'use client';

import AssetCategory from './AssetCategory';
import { GameAsset } from '../../util/structs';
import style from './AssetMenu.module.css';
import { useState } from 'react';

export default function AssetMenu(props: { assets: GameAsset[] }) {
  const [buyMode, setBuyMode] = useState(true);
  const [multiplier, setMultiplier] = useState(1);

  return (
    <>
      <div className={style.mode}>
        <span className={style.label}>Buy</span>
        <span className={`${style.button} ${buyMode && multiplier === 1 ? style.active : ''}`}>&times;1</span>
        <span className={`${style.button} ${buyMode && multiplier === 10 ? style.active : ''}`}>&times;10</span>
        <span className={`${style.button} ${buyMode && multiplier === 100 ? style.active : ''}`}>&times;100</span>
        <span className={`${style.button} ${buyMode && multiplier === 1000 ? style.active : ''}`}>&times;1000</span>
        <span className={style.label}>Sell</span>
        <span className={`${style.button} ${!buyMode && multiplier === 1 ? style.active : ''}`}>&times;1</span>
        <span className={`${style.button} ${!buyMode && multiplier === 10 ? style.active : ''}`}>&times;10</span>
        <span className={`${style.button} ${!buyMode && multiplier === 100 ? style.active : ''}`}>&times;100</span>
        <span className={`${style.button} ${!buyMode && multiplier === 1000 ? style.active : ''}`}>&times;1000</span>
      </div>
      <div className={style.menu}>
        <AssetCategory
          assets={props.assets.filter((a) => a.category === 'commodity')}
          category={'commodity'}
          label={'COMMODITIES'}
        />
        <AssetCategory
          assets={props.assets.filter((a) => a.category === 'stock')}
          category={'stock'}
          label={'STOCKS'}
        />
        <AssetCategory
          assets={props.assets.filter((a) => a.category === 'crypto')}
          category={'crypto'}
          label={'CRYPTO'}
        />
      </div>
    </>
  );
}
