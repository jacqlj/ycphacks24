'use client';

import { GameAsset, GameAssetTemplate, GameEvent } from './util/structs';
import {
  apply_if_match,
  format_number,
  get_date_from_time,
  init_price_history_24h,
  split_sentence,
  step_time,
} from './util/functions';
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

  const [eventHistory, setEventHistory] = useState<GameEvent[]>([]);
  const [currentEventSentences, setCurrentEventSentences] = useState<string[]>([]);

  const [playerAssets, setPlayerAssets] = useState<GameAsset[]>([]);
  const [playerCapital, setPlayerCapital] = useState<number>(1000);

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
          total_bought: 0,
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
      const ev = step_time(eventPool, time, setPlayerAssets);
      if (ev !== null) {
        setCurrentEventSentences(split_sentence(ev.broadcaster_text, 10));
        setPlayerAssets((assets) =>
          assets.map((asset) => {
            console.log('calling', asset.symbol, ev.id);
            return apply_if_match(asset, ev);
          })
        );
      }

      localStorage.setItem('time', `${time}`);
    }, 1000);
  }, [time]);

  useEffect(() => {
    if (currentEventSentences.length > 0) {
      setTimeout(() => {
        setCurrentEventSentences((cur) => cur.slice(1));
      }, 3000);
    }
  }, [currentEventSentences]);

  // memoization declarations
  const datetime = useMemo(() => get_date_from_time(time), [time]);
  const chart_refresh = useMemo(() => Math.floor(time / 1), [time]);
  const player_portfolio = useMemo(
    () => playerAssets.reduce((sum, a) => +(sum + a.price * a.quantity).toFixed(2), 0),
    [time]
  );
  const speech_text = useMemo(
    () => (currentEventSentences.length > 0 ? currentEventSentences[0] : undefined),
    [currentEventSentences]
  );

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
        <News eventPool={eventPool} speechText={speech_text} />
      </div>
      <div className={styles.stats}>
        <StatDisplay
          capital={`${format_number(playerCapital)}`}
          portfolio={`${format_number(player_portfolio)}`}
          datetime={datetime}
        />
      </div>
      <div className={styles.asset_menu}>
        <AssetMenu
          assets={playerAssets}
          monies={{
            playerCapital,
            setPlayerCapital,
            playerAssets,
            setPlayerAssets,
          }}
        />
      </div>
    </div>
  );
}
