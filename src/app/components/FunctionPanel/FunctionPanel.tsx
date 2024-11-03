import LineChart from './LineChart';
import styles from './FunctionPanel.module.css';

// {datasets.map((assetsubset: any) => (
//   <StockTicker chart_refresh={props.chart_refresh} asset={assetsubset} />
// ))}

function FunctionPanel(props: { chart_refresh: number; assets: any }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.chart}>
          <LineChart chart_refresh={props.chart_refresh} assets={props.assets} />
        </div>
        <div className={styles.toggle}>{props.assets.map((asset: any) => asset.name)}</div>
      </div>
    </>
  );
}

export default FunctionPanel;
