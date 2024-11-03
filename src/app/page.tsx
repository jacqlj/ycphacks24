'use client';

import { GameAsset, GameAssetTemplate, GameEvent, GameState } from './util/structs';
import { format_number, get_date_from_time, init_price_history_24h } from './util/functions';
import { useEffect, useMemo, useState } from 'react';

import AssetMenu from './components/AssetMenu/AssetMenu';
import FunctionPanel from './components/FunctionPanel/FunctionPanel';
import News from './components/News';
import StatDisplay from './components/StatDisplay';
import StockTicker from './components/StockTicker/StockTicker';
import StockTickerPanel from './components/StockTicker/StockTickerPanel';
import styles from './page.module.css';

export default function Home() {
  // state declarations

  // game data
  const [eventPool, setEventPool] = useState<GameEvent[]>([]);

  // game state
  const [time, setTime] = useState(typeof window !== 'undefined' ? +(localStorage.getItem('time') ?? 0) : 0);
  const [playerAssets, setPlayerAssets] = useState<GameAsset[]>([]);
  const [eventHistory, setEventHistory] = useState<GameEvent[]>([]);
  const [playerCapital, setPlayerCapital] = useState<number>(1000);
  const [playerPortfolio, setPlayerPortfolio] = useState<number>(0);

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
          price_hist_24h: init_price_history_24h(a),
          price_hist_30d: [],
          average_cost: 0,
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
      <div className={styles.stock_ticker_panel}>
        <StockTickerPanel chart_refresh={chart_refresh} assets={playerAssets} />
      </div>
      <div className={styles.function_panel}>
        <FunctionPanel chart_refresh={chart_refresh} assets={playerAssets} />
      </div>
      <div className={styles.news}>
        <News />
      </div>
      <div className={styles.stats}>
        <StatDisplay
          capital={`${format_number(playerCapital)}`}
          portfolio={`${format_number(playerPortfolio)}`}
          datetime={datetime}
        />
      </div>
      <div className={styles.asset_menu}>
        <AssetMenu
          assets={playerAssets}
          monies={{
            playerCapital,
            setPlayerCapital,
            playerPortfolio,
            setPlayerPortfolio,
            playerAssets,
            setPlayerAssets,
          }}
        />
      </div>
    </div>
  );
}
