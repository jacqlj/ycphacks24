import TickerChart from './TickerChart';
import styles from './StockTicker.module.css';

function StockTicker(props: { chart_refresh: number; asset: any }) {
  return (
    <>
      <div className={styles.ticker}>
        <div>
          <div className={styles.symbol}>{props.asset.symbol}</div>
          <div>${props.asset.price_hist_24h[props.asset.price_hist_24h.length - 1]}</div>
          <div>^ 1.2%</div>
        </div>
        <TickerChart chart_refresh={props.chart_refresh} assets={props.asset} />
      </div>
    </>
  );
}

export default StockTicker;
