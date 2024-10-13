import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './style.css';

const ChartComponent = ({ title, label, profit }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const createGradient = (ctx, colors) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    return gradient;
  };
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Ensure data is properly formatted
    const labels = Array.isArray(label) ? label : [];
    const data = Array.isArray(profit) ? profit : [];

    // Ensure canvas has dimensions
    chartRef.current.width = 400; // Example width
    chartRef.current.height = 400; // Example height

    // Initialize chart only after component mounts
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy previous chart instance
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Amount',
            data: data,
            backgroundColor: createGradient(ctx, ['#000000', '#3533CD']), // Set color directly
            hoverBackgroundColor: createGradient(ctx, ['#20368F', '#40a9ff']),
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: title, // Remove curly braces
            padding: {
              bottom: 16,
            },
            font: {
              size: 16,
              weight: 'normal',
            },
          },
          tooltip: {
            backgroundColor:  '#27292D',
          },
        },
        scales: {
          x: {
            border: {
              dash: [2, 4],
            },
            grid: {
              color: '#2e14c4',
            },
            title: {
              text: '2023',
            },
          },
          y: {
            grid: {
              color: '#2e14c4',
            },
            border: {
              dash: [2, 4],
            },
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (PKR)',
            },
          },
        },
      },
    });

    return () => {
      // Cleanup function
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy the chart instance on unmount
      }
    };
  }, [label, profit, title]); // Add label, profit, and title as dependencies

  return (
    <div className="widget">
      <canvas ref={chartRef} id="revenues"></canvas>
    </div>
  );
};

export default ChartComponent;
