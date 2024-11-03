import TickerData from './TickerDataInterface';

const getLineColor = (data: any) => {
  if (data.length < 2) return 'rgba(75, 192, 192, 1)'; // Default color
  return data[data.length - 1] > data[0] ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
};

export function generateTickerData(props: { asset: any }): TickerData {
  return {
    label: props.asset.symbol,
    data: props.asset.price_hist_24h,
    borderColor: getLineColor(props.asset.price_hist_24h),
    fill: false,
    pointRadius: 0,
  };
}
