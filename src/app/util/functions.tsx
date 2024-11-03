import { Dispatch, SetStateAction } from 'react';
import { GameAsset, GameAssetEffect, GameAssetTemplate, GameEffectCondition, GameEvent } from './structs';

import { gamma } from 'mathjs';

export function step_time(
  events: GameEvent[],
  time: number,
  setPlayerAssets: Dispatch<SetStateAction<GameAsset[]>>
): GameEvent | null {
  // update asset prices

  setPlayerAssets((playerAssets: GameAsset[]) => {
    playerAssets.forEach((asset) => update_asset(asset));
    return playerAssets;
  });

  // summon new event
  const severity_range = get_probabilistic_event_severity_range(time);
  const ev = spawn_event(events, severity_range, time);

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
      effect.time_elapsed += 1;
      const tapered = get_tapered_bias(effect);
      if (Math.abs(tapered) < 0.001 && effect.time_elapsed > 5)
        asset.effects = asset.effects.filter((e) => e != effect);
      console.log(asset.symbol, effect.time_elapsed, tapered * 100);
      return sum + tapered;
    }, 0);
  const sigma = asset.sigma;
  const new_price = asset.price * gaussianRandom(mu, sigma);
  asset.price = new_price + 0.02; // offset to prevent collapse to 0
  asset.price_hist_24h.shift();
  asset.price_hist_24h.push(new_price);
}

export function init_price_history_24h(asset: GameAssetTemplate): number[] {
  const sigma = asset.sigma;
  const price_history: number[] = [];
  let price = asset.b_price;
  for (let index = 0; index < 23; index++) {
    price *= gaussianRandom(1, sigma);
    price_history.push(price + 0.02); // offset to prevent collapse to 0
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
  const alpha = 8 / (5 * effect.severity + 2);
  const beta = (4 - 3 * effect.severity) / 12;
  const num = effect.bias_max * gamma_dist(effect.time_elapsed, alpha, beta);
  return num / gamma_dist((alpha - 1) / beta, alpha, beta);
}

function gamma_dist(x: number, alpha: number, beta: number): number {
  const prod = Math.pow(x, alpha - 1) * Math.exp(-beta * x) * Math.pow(beta, alpha);
  return prod / gamma(alpha);
}

function get_probabilistic_event_severity_range(time_elapsed: number): [number, number] {
  const sev_mod = (time_elapsed % 240) / 290;

  const min = 0 + sev_mod;
  const max = 0.16 + sev_mod;

  return [min, max];
}

function spawn_event(events: GameEvent[], severity_range: [number, number], time: number): GameEvent | null {
  const rand_idx = () => Math.floor(Math.random() * events.length);
  let ev: GameEvent;
  if (time % 80 == 0) {
    do {
      ev = events[rand_idx()];
      console.log();
    } while (ev.severity < severity_range[0] || ev.severity > severity_range[1]);
    return ev;
  }
  return null;
}

export function apply_if_match(asset: GameAsset, ev: GameEvent): GameAsset {
  console.log('applying', asset.symbol, ev.id);

  const match_condition = (as: GameAsset, cd: GameEffectCondition): boolean => {
    if (cd.locations.length && !cd.locations.includes(as.location)) return false;
    if (cd.attributes.length && !cd.attributes.some((a) => as.attributes.includes(a))) return false;
    return true;
  };

  for (const eff of ev.effects) {
    if (eff.conditions.some((cond) => match_condition(asset, cond))) {
      console.log(asset.symbol, eff.bias);
      asset.effects.push({
        bias_max: eff.bias,
        time_elapsed: 0,
        severity: ev.severity,
      });
    }
  }

  return asset;
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
  return +(((price_hist_24h[price_hist_24h.length - 1] - price_hist_24h[0]) / price_hist_24h[0]) * 100).toFixed(2);
}

export function split_sentence(sentence: string, chunkSize: number) {
  const words = sentence.split(' ');
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }

  return chunks;
}
