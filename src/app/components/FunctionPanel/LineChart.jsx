'use client';

import { Chart, registerables } from 'chart.js';
import React, { useEffect, useRef } from 'react';

Chart.register(...registerables);

export default function LineChart(props) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getLineColor = (data) => {
    if (data.length < 2) return 'rgba(75, 192, 192, 1)'; // Default color
    return data[data.length - 1] > data[0] ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const datasets = props.assets
      .filter((asset) => props.selectedAssets.includes(asset.symbol))
      .map((asset) => ({
        label: asset.symbol,
        data: asset.price_hist_24h,
        borderColor: getLineColor(asset.price_hist_24h),
        fill: false,
      }));

    datasets.sort((a, b) => {
      const aLatest = a.data[a.data.length - 1];
      const bLatest = b.data[b.data.length - 1];
      return bLatest - aLatest; // Sort in descending order
    });

    // Create the chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...Array(24).keys()],
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
          x: {
            title: {
              display: true,
              text: 'Time (hours)',
            },
            ticks: {
              // Use the callback function to filter labels
              callback: function (value, index) {
                // Show label only for every second point
                return index % 2 === 0 ? value : '';
              },
            },
          },
        },
        animation: false,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'middle',
          },
        },
        maintainAspectRatio: false,
      },
    });
    // Cleanup function to destroy the chart instance
    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [props.chart_refresh, props.selectedAssets]);

  return <canvas ref={chartRef} style={{ position: 'flex', width: '80%', height: '320px' }}></canvas>;
}
