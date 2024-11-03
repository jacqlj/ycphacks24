import { GameAsset } from '@/app/util/structs';
import StockTicker from './StockTicker';
// import TickerData from './TickerDataInterface';
// import { generateTickerData } from './TickerDataFunctions';
import styles from './StockTickerPanel.module.css';

const getLineColor = (data: number[]) => {
  if (data.length < 2) return 'rgba(75, 192, 192, 1)'; // Default color
  return data[data.length - 1] > data[0] ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
};

export default function StockTickerPanel(props: { chart_refresh: number; assets: GameAsset[] }) {
  /*
        label: asset.symbol,
        data: asset.price_hist_24h,
        borderColor: getLineColor(asset.price_hist_24h),
        pointRadius: 0,
        fill: false,
    */

  const datasets = props.assets.map((asset: GameAsset) => ({
    label: asset.symbol,
    data: asset.price_hist_24h,
    borderColor: getLineColor(asset.price_hist_24h),
    pointRadius: 0,
    fill: false,
  }));

  return (
    <>
      <div className={`${styles.container}`}>
        <div className={styles.marquee}>
          {datasets.map((assetsubset) => (
            <StockTicker key={assetsubset.label} chart_refresh={props.chart_refresh} asset={assetsubset} />
          ))}
        </div>
      </div>
    </>
  );
}
