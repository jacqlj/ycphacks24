import { GameAsset, GameAssetTemplate, GameEvent, GameState } from './util/structs';

import AssetMenu from './components/AssetMenu';
import StatDisplay from './components/StatDisplay';
import styles from './page.module.css';
import { update_asset } from './util/functions';

async function getData(): Promise<{ events: GameEvent[]; assets: GameAssetTemplate[] }> {
  try {
    const response = await import('./util/data.json');
    return {
      events: response.events,
      assets: response.assets,
    };
  } catch (err) {
    console.log(err);
    return { events: [], assets: [] };
  }
}

const data = await getData();

export default function Home() {
  let events: GameEvent[] = data.events;
  let assets: GameAssetTemplate[] = data.assets;

  const state: GameState = {
    time: 0,
    assets: assets.map((a) => ({
      symbol: a.symbol,
      name: a.name,
      quantity: 0,
      price: a.b_price,
      price_hist: [],
      effects: [],
      sigma: a.sigma,
      category: a.category,
      location: a.location,
      attributes: a.attributes,
    })),
    event_history: [],
  };

  state.assets.forEach((a) => [...Array(30).keys()].forEach((i) => update_asset(a, false)));

  return (
    <div className={styles.page}>
      <div className={styles.stock_ticker}></div>
      <div className={styles.function_panel}></div>
      <div className={styles.news}></div>
      <div className={styles.stats}>
        <StatDisplay />
      </div>
      <div className={styles.asset_menu}>
        <AssetMenu />
      </div>
    </div>
  );
}
