import LineChart from './LineChart';

function FunctionPanel(props: { chart_refresh: number }) {
  return (
    <>
      <div></div>
      <div>
        <LineChart chart_refresh={props.chart_refresh} />
      </div>
    </>
  );
}

export default FunctionPanel;
