'use client';

import { GameAsset, GameAssetTemplate, GameEvent, GameState } from './util/structs';
import { get_date_from_time, update_asset } from './util/functions';
import { useEffect, useMemo, useState } from 'react';

import AssetMenu from './components/AssetMenu/AssetMenu';
import FunctionPanel from './components/FunctionPanel/FunctionPanel';
import StatDisplay from './components/StatDisplay';
import StockTicker from './components/StockTicker';
import styles from './page.module.css';

export default function Home() {
  // state declarations

  // game data
  const [eventPool, setEventPool] = useState<GameEvent[]>([]);

  // game state
  const [time, setTime] = useState(+(localStorage.getItem('time') ?? 0));
  const [playerAssets, setPlayerAssets] = useState<GameAsset[]>([]);
  const [eventHistory, setEventHistory] = useState<GameEvent[]>([]);

  // prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);

  // webpage init async calls
  useEffect(() => {
    // prevent hydration errors
    setIsMounted(true);

    const getData = async (): Promise<{ events: GameEvent[]; assets: GameAssetTemplate[] }> => {
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
    };

    getData().then(({ events, assets }) => {
      setEventPool(events);
      setPlayerAssets(
        assets.map((a) => ({
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
        }))
      );
    });
  }, []);

  // main time step loop
  useEffect(() => {
    setTimeout(() => {
      setTime((time) => time + 1);

      // everything goes here

      localStorage.setItem('time', `${time}`);
    }, 1000);
  }, [time]);

  // memoization declarations
  const datetime = useMemo(() => get_date_from_time(time), [time]);
  const chart_refresh = useMemo(() => Math.floor(time / 5), [time]);

  // prevent hydration error
  // must occur after all hooks
  if (!isMounted) return null;

  return (
    <div className={styles.page}>
      <div className={styles.stock_ticker}>
        <StockTicker />
      </div>
      <div className={styles.function_panel}>
        <FunctionPanel chart_refresh={chart_refresh} />
      </div>
      <div className={styles.news}></div>
      <div className={styles.stats}>
        <StatDisplay capital={'370000'} datetime={datetime} portfolio={'300000'} />
      </div>
      <div className={styles.asset_menu}>
        <AssetMenu assets={playerAssets} />
      </div>
    </div>
  );
}
