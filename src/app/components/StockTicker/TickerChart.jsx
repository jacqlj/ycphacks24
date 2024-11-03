'use client';

import { Chart, registerables } from 'chart.js';
import React, { useEffect, useRef } from 'react';

Chart.register(...registerables);

export default function TickerChart(props) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    console.log(props.assets);

    // Create the chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...Array(24).keys()],
        datasets: props.asset,
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            display: false,
          },
          x: {
            display: false,
          },
        },
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // Disable tooltips
          },
        },
        maintainAspectRatio: false,
      },
    });
    // Cleanup function to destroy the chart instance
    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [props.chart_refresh]);

  return <canvas ref={chartRef} style={{ position: 'relative', width: '100%', height: '95%' }}></canvas>;
}
