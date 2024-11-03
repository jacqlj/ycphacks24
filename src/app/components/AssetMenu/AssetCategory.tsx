'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import Asset from './Asset';
import { GameAsset } from '@/app/util/structs';
import style from './AssetCategory.module.css';

export default function AssetCategory(props: {
  filtered_assets: GameAsset[];
  category: string;
  label: string;
  buy: boolean;
  multiplier: number;
  monies: {
    playerCapital: number;
    setPlayerCapital: Dispatch<SetStateAction<number>>;
    playerPortfolio: number;
    setPlayerPortfolio: Dispatch<SetStateAction<number>>;
    playerAssets: GameAsset[];
    setPlayerAssets: Dispatch<SetStateAction<GameAsset[]>>;
  };
}) {
  const [active, setActive] = useState(false);

  return (
    <>
      <div className={`${style.category} ${active ? style.active : ''}`} onClick={() => setActive(!active)}>
        <i className={`bi bi-${active ? 'dash' : 'plus'}-lg`}></i>
        <span>{props.label}</span>
      </div>
      {active ? (
        props.filtered_assets.map((a) => (
          <Asset key={a.symbol} asset={a} sell={!props.buy} multiplier={props.multiplier} monies={props.monies} />
        ))
      ) : (
        <></>
      )}
    </>
  );
}
