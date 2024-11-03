import { Dispatch, SetStateAction } from 'react';
import { asset_daily_return, format_number } from '@/app/util/functions';

import { GameAsset } from '@/app/util/structs';
import style from './Asset.module.css';

export default function Asset(props: {
  asset: GameAsset;
  sell: boolean;
  multiplier: number;
  monies: {
    playerCapital: number;
    setPlayerCapital: Dispatch<SetStateAction<number>>;
    playerAssets: GameAsset[];
    setPlayerAssets: Dispatch<SetStateAction<GameAsset[]>>;
  };
}) {
  const daily_return = asset_daily_return(props.asset.price_hist_24h);
  const return_icon =
    daily_return >= 0 ? (
      <i className="bi bi-caret-up-fill" style={{ color: '#0f0' }}></i>
    ) : (
      <i className="bi bi-caret-down-fill" style={{ color: '#f00' }}></i>
    );
  const total_return = 0;
  const mult_price = props.asset.price * props.multiplier;

  const nothing_to_sell = props.sell && props.asset.quantity < props.multiplier;
  const cant_afford = !props.sell && mult_price > props.monies.playerCapital;

  const handle_click = () => {
    if (nothing_to_sell || cant_afford) return;
    if (!props.sell) {
      props.monies.setPlayerAssets((assets: GameAsset[]) =>
        assets.map((a: GameAsset) =>
          a.symbol === props.asset.symbol
            ? {
                ...a,
                quantity: a.quantity + props.multiplier,
                total_bought: a.total_bought + props.multiplier,
                average_cost: (a.average_cost * a.total_bought + mult_price) / (a.total_bought + props.multiplier),
              }
            : a
        )
      );
      props.monies.setPlayerCapital((capital: number) => +(capital - mult_price).toFixed(2));
    }
    if (props.sell) {
      props.monies.setPlayerAssets((assets: GameAsset[]) =>
        assets.map((a: GameAsset) =>
          a.symbol === props.asset.symbol ? { ...a, quantity: a.quantity - props.multiplier } : a
        )
      );
      props.monies.setPlayerCapital((capital: number) => +(capital + mult_price).toFixed(2));
    }
  };

  if (typeof props.asset === 'undefined') return <></>;

  return (
    <div
      className={`${style.container} ${props.sell ? style.sell : ''} ${nothing_to_sell ? style.disabled : ''}`}
      onClick={handle_click}
    >
      <div className={style.quantity}>{props.asset.quantity}</div>
      <div className={style.details}>
        <div className={style.top}>
          <div className={style.symbol}>{props.asset.symbol}</div>
          <div className={style.name}>
            <span>{props.asset.name}</span>
          </div>
        </div>
        <div className={style.bottom}>
          <div className={`${style.price} ${cant_afford ? style.red : ''}`}>
            ${format_number(+mult_price.toFixed(2))}
          </div>
          {props.sell ? (
            <></>
          ) : (
            <div className={style.trend}>
              {return_icon}&nbsp;{Math.abs(daily_return)}%
            </div>
          )}
          {props.sell ? <div className={style.return}>{total_return}</div> : <></>}
        </div>
      </div>
    </div>
  );
}
