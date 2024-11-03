import TickerChart from './TickerChart';
import { asset_daily_return } from '@/app/util/functions';
import styles from './StockTicker.module.css';

function StockTicker(props: {
  chart_refresh: number;
  asset: {
    label: string;
    data: number[];
    borderColor: string;
    pointRadius: number;
    fill: boolean;
  };
}) {
  const daily_return = asset_daily_return(props.asset.data);
  const return_icon =
    daily_return >= 0 ? (
      <i className="bi bi-caret-up-fill" style={{ color: '#0f0' }}></i>
    ) : (
      <i className="bi bi-caret-down-fill" style={{ color: '#f00' }}></i>
    );

  return (
    <>
      <div className={styles.ticker}>
        <div>
          <div className={styles.symbol}>{props.asset.label}</div>
          <div>${+props.asset.data[props.asset.data.length - 1].toFixed(2)}</div>
          <div>
            {return_icon}&nbsp;{Math.abs(daily_return)}%
          </div>
        </div>
        <TickerChart chart_refresh={props.chart_refresh} assets={props.asset} />
      </div>
    </>
  );
}

export default StockTicker;
