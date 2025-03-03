import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import './style.css';

const ChartWidget = ({ id,title, label, profit}) => {
  useEffect(() => {
    const ctx = document.getElementById(id);
    let chartInstance = null;
    // Ensure data is properly formatted
    const labels = Array.isArray(label) ? label : [];
    const data = Array.isArray(profit) ? profit : [];


    if (ctx) {
      if (Chart.instances.hasOwnProperty(id)) {
        // Destroy existing chart instance if it exists
        Chart.instances[id].destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Monthly Income',
              data: data,
              backgroundColor: 'white',
              borderColor: '#3DA06E',
              borderRadius: 6,
              cubicInterpolationMode: 'monotone',
              fill: false,
              borderSkipped: false,
            },
          ],
        },
        options: {
          interaction: {
            intersect: false,
            mode: 'index',
          },
          elements: {
            point: {
              radius: 0,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: title,
              padding: {
                bottom: 16,
              },
              font: {
                size: 16,
                weight: 'normal',
              },
            },
            tooltip: {
              backgroundColor: '#FDCA49',
              bodyColor: '#0E0A03',
              yAlign: 'bottom',
              cornerRadius: 4,
              titleColor: '#0E0A03',
              usePointStyle: true,
              callbacks: {
                label: function (context) {
                  if (context.parsed.y !== null) {
                    const label = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(
                      context.parsed.y
                    );
                    return label;
                  }
                  return null;
                },
              },
            },
          },
          scales: {
            x: {
              border: {
                dash: [2, 4],
              },
              title: {
                text: '2023',
              },
            },
            y: {
              grid: {
                color: '#27292D',
              },
              border: {
                dash: [2, 4],
              },
              title: {
                display: true,
                text: 'Income (PKR)',
              },
            },
          },
        },
      });
    }

    return () => {
      // Cleanup function
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the chart instance on unmount
      }
    };
  },  [id,label, profit, title]);

  return <div className="widget"><canvas id={id}></canvas></div>;
};

export default ChartWidget;
