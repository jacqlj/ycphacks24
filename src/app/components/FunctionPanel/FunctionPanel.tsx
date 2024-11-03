import LineChart from './LineChart';

function FunctionPanel(props: { chart_refresh: number; assets: any }) {
  return (
    <>
      <div></div>
      <div>
        <LineChart chart_refresh={props.chart_refresh} assets={props.assets} />
      </div>
    </>
  );
}

export default FunctionPanel;
