'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import AssetCategory from './AssetCategory';
import { GameAsset } from '../../util/structs';
import style from './AssetMenu.module.css';

export default function AssetMenu(props: {
  assets: GameAsset[];
  monies: {
    playerCapital: number;
    setPlayerCapital: Dispatch<SetStateAction<number>>;
    playerPortfolio: number;
    setPlayerPortfolio: Dispatch<SetStateAction<number>>;
    playerAssets: GameAsset[];
    setPlayerAssets: Dispatch<SetStateAction<GameAsset[]>>;
  };
}) {
  const [buyMode, setBuyMode] = useState(true);
  const [multiplier, setMultiplier] = useState(1);

  return (
    <div className={style.container}>
      <div className={style.modeContainer}>
        <div className={style.mode}>
          <span className={style.label}>Buy</span>
          {[1, 10, 100, 1000].map((i) => (
            <span
              key={i}
              className={`${style.button} ${buyMode && multiplier === i ? style.active : ''}`}
              onClick={() => (setMultiplier(i), setBuyMode(true))}
            >
              &times;{i}
            </span>
          ))}
          <span className={style.label}>Sell</span>
          {[1, 10, 100, 1000].map((i) => (
            <span
              key={i}
              className={`${style.button} ${!buyMode && multiplier === i ? style.active : ''}`}
              onClick={() => (setMultiplier(i), setBuyMode(false))}
            >
              &times;{i}
            </span>
          ))}
        </div>
        <div className={style.border}></div>
      </div>
      <div className={style.menu}>
        <AssetCategory
          filtered_assets={props.assets.filter((a) => a.category === 'commodity')}
          category={'commodity'}
          label={'COMMODITIES'}
          buy={buyMode}
          multiplier={multiplier}
          monies={props.monies}
        />
        <AssetCategory
          filtered_assets={props.assets.filter((a) => a.category === 'stock')}
          category={'stock'}
          label={'STOCKS'}
          buy={buyMode}
          multiplier={multiplier}
          monies={props.monies}
        />
        <AssetCategory
          filtered_assets={props.assets.filter((a) => a.category === 'crypto')}
          category={'crypto'}
          label={'CRYPTO'}
          buy={buyMode}
          multiplier={multiplier}
          monies={props.monies}
        />
      </div>
    </div>
  );
}
