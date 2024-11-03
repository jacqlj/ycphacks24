export interface GameState {
  time: number;
  assets: GameAsset[];
  event_history: GameEvent[];
}

export interface GameAssetTemplate {
  symbol: string;
  name: string;
  b_price: number;
  sigma: number;
  category: string;
  location: string;
  attributes: string[];
}

export interface GameAsset {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  price_hist_24h: number[];
  price_hist_30d: number[];
  average_cost: number;
  effects: GameAssetEffect[];
  sigma: number;
  category: string;
  location: string;
  attributes: string[];
}

export interface GameAssetEffect {
  bias_max: number;
  time_elapsed: number;
  severity: number;
}

export interface GameEvent {
  id: number;
  effects: GameEventEffect[];
  severity: number;
  ticker_text: string;
  broadcaster_text: string;
}

export interface GameEventEffect {
  bias: number;
  conditions: GameEffectCondition[];
}

export interface GameEffectCondition {
  locations: string[];
  attributes: string[];
}
