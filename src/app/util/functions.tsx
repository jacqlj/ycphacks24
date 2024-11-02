import { GameAsset, GameAssetEffect, GameEffectCondition, GameEvent, GameState } from './structs';

import { gamma } from 'mathjs';

export function step_time(events: GameEvent[], state: GameState): GameEvent {
  const norm_dist = require('distributions-normal-random');
  norm_dist.seed = Date.now();

  // update asset prices
  state.assets.forEach((asset) => update_asset(asset, norm_dist));

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
export function update_asset(asset: GameAsset, shift: boolean = true): void {
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
  if (shift) asset.price_hist.shift();
  asset.price_hist.push(new_price);
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
