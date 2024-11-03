import { asset_daily_return, format_number } from '@/app/util/functions';

import { GameAsset } from '@/app/util/structs';
import style from './Asset.module.css';

export default function Asset(props: { asset: GameAsset; sell: boolean; multiplier: number; monies: any }) {
  const trend = 0;
  const daily_return = asset_daily_return(props.asset.price_hist_24h);
  const mult_price = props.asset.price * props.multiplier;

  if (typeof props.asset === 'undefined') return <></>;

  return (
    <div className={`${style.container} ${props.sell ? style.sell : ''}`}>
      <div className={style.quantity}>{props.asset.quantity}</div>
      <div className={style.details}>
        <div className={style.top}>
          <div className={style.symbol}>{props.asset.symbol}</div>
          <div className={style.name}>
            <span>{props.asset.name}</span>
          </div>
        </div>
        <div className={style.bottom}>
          <div className={`${style.price} ${mult_price > props.monies.playerCapital ? style.red : ''}`}>
            ${format_number(+mult_price.toFixed(2))}
          </div>
          {props.sell ? <></> : <div className={style.trend}>{trend}</div>}
          {props.sell ? <div className={style.return}>{daily_return}</div> : <></>}
        </div>
      </div>
    </div>
  );
}
