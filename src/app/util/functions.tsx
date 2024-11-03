import { GameAsset, GameAssetEffect, GameAssetTemplate, GameEffectCondition, GameEvent, GameState } from './structs';

import { gamma } from 'mathjs';

export function step_time(events: GameEvent[], state: GameState): GameEvent {
  const norm_dist = require('distributions-normal-random');
  norm_dist.seed = Date.now();

  // update asset prices
  state.assets.forEach((asset) => update_asset(asset));

  // update game statistics exposed to player

  // summon new event
  const severity_range = get_probabilistic_event_severity_range();
  const ev = spawn_event(events, severity_range);
  state.assets.forEach((asset) => apply_if_match(asset, ev));

  // return summoned event for display
  return ev;
}

/**
 * Updates an asset's price when `step_time` is evaluated.
 * @param {GameAsset} asset - The asset with which the price is to be updated.
 */
function update_asset(asset: GameAsset): void {
  const mu =
    1 +
    asset.effects.reduce((sum, effect) => {
      const tapered = get_tapered_bias(effect);
      if (Math.abs(tapered) < 0.001) asset.effects = asset.effects.filter((e) => e != effect);
      return sum + tapered;
    }, 0);
  const sigma = asset.sigma;
  const new_price = asset.price * gaussianRandom(mu, sigma);
  asset.price = new_price;
  asset.price_hist_24h.shift();
  asset.price_hist_24h.push(new_price);
}

export function init_price_history_24h(asset: GameAssetTemplate): number[] {
  const sigma = asset.sigma;
  const price_history: number[] = [];
  let price = asset.b_price;
  for (let index = 0; index < 23; index++) {
    price *= gaussianRandom(1, sigma);
    price_history.push(price);
  }
  price_history.push(asset.b_price);
  return price_history;
}

function gaussianRandom(mu = 0, sigma = 1): number {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * sigma + mu;
}

/**
 * Calculates a tapered bias value based on input parameters using a gamma distribution formula.
 * @param {GameAssetEffect} effect - The effect from which to calculate the current bias from.
 * @returns The tapered bias of an effect given how long the effect has persisted since the event.
 */
function get_tapered_bias(effect: GameAssetEffect): number {
  effect.time_elapsed += 1;
  const alpha = 8 / (5 * effect.severity + 2);
  const beta = (4 - 3 * effect.severity) / 12;
  const num = effect.bias_max * gamma_dist(effect.time_elapsed, alpha, beta);
  return num / gamma_dist((alpha - 1) / beta, alpha, beta);
}

function gamma_dist(x: number, alpha: number, beta: number): number {
  const prod = Math.pow(x, alpha - 1) * Math.exp(-beta * x) * Math.pow(beta, alpha);
  return prod / gamma(alpha);
}

// TODO
function get_probabilistic_event_severity_range(): [number, number] {
  throw new Error('Function not implemented.');
}

function spawn_event(events: GameEvent[], severity_range: [number, number]): GameEvent {
  const rand_idx = () => Math.floor(Math.random() * events.length);
  let ev: GameEvent;
  do {
    ev = events[rand_idx()];
  } while (ev.severity < severity_range[0] || ev.severity > severity_range[1]);
  return ev;
}

function apply_if_match(asset: GameAsset, ev: GameEvent): void {
  const match_condition = (as: GameAsset, cd: GameEffectCondition): boolean => {
    if (cd.locations.length && !cd.locations.includes(as.location)) return false;
    if (cd.attributes.length && !cd.attributes.some((a) => as.attributes.includes(a))) return false;
    return true;
  };

  for (const eff of ev.effects) {
    if (eff.conditions.some((cond) => match_condition(asset, cond))) {
      asset.effects.push({
        bias_max: eff.bias,
        time_elapsed: 0,
        severity: ev.severity,
      });
    }
  }
}

export function get_date_from_time(time: number) {
  const date = new Date(Date.UTC(2020, 0, 1) + time * 60 * 60000);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'UTC',
  }).format(date);
}

export function format_number(n: number) {
  if (n < 10 ** 6) return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (n < 10 ** 9) return (n / 10 ** 6).toFixed(1) + ' mil';
  if (n < 10 ** 12) return (n / 10 ** 9).toFixed(1) + ' bil';
  return (n / 10 ** 12).toFixed(1) + ' tr';
}

export function asset_daily_return(price_hist_24h: number[]) {
  return (Math.abs(price_hist_24h[price_hist_24h.length - 1] - price_hist_24h[0]) / price_hist_24h[0]) * 100;
}
