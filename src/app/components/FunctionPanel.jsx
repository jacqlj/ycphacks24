'use client';

import { Chart, registerables } from 'chart.js';
import React, { useEffect, useRef } from 'react';

Chart.register(...registerables);

const LineChart = (props) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getLineColor = (data) => {
    if (data.length < 2) return 'rgba(75, 192, 192, 1)'; // Default color
    return data[data.length - 1] > data[0] ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const dataPoints = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    const dataPoints2 = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

    const lineColor = getLineColor(dataPoints);
    const lineColor2 = getLineColor(dataPoints2);

    // Create the chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'XLR',
            data: dataPoints,
            borderColor: lineColor,
            // backgroundColor: 'rgba(0, 192, 0, 0.2)',
            fill: false,
          },
          {
            label: 'NXB',
            data: dataPoints2,
            borderColor: lineColor2,
            // backgroundColor: 'rgba(200, 0, 0, 0.2)',
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance
    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [props.chart_refresh]);

  return <canvas ref={chartRef} width="300" height="200"></canvas>;
};

function FunctionPanel(props) {
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
