import TickerChart from './TickerChart';
import { asset_daily_return } from '@/app/util/functions';
import styles from './StockTicker.module.css';

function StockTicker(props: { chart_refresh: number; asset: any }) {
  return (
    <>
      <div className={styles.ticker}>
        <div>
          <div className={styles.symbol}>{props.asset.label}</div>
          <div>${props.asset.data[props.asset.data.length - 1]}</div>
          <div>^ {asset_daily_return(props.asset.data)}%</div>
        </div>
        <TickerChart chart_refresh={props.chart_refresh} assets={props.asset} />
      </div>
    </>
  );
}

export default StockTicker;
