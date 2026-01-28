import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MiniCharts = ({ stats }) => {
  const sourceData = {
    labels: stats.sources.map(s => s.name),
    datasets: [
      {
        data: stats.sources.map(s => s.count),
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899'
        ],
        borderWidth: 0,
        hoverOffset: 8,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const statusData = {
    labels: stats.statuses.map(s => s.name),
    datasets: [
      {
        label: 'Leads',
        data: stats.statuses.map(s => s.count),
        backgroundColor: stats.statuses.map((_, index) => {
          const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
          return colors[index % colors.length];
        }),
        borderWidth: 0,
        borderRadius: 8,
        hoverBackgroundColor: stats.statuses.map((_, index) => {
          const colors = ['#4f46e5', '#059669', '#d97706', '#dc2626'];
          return colors[index % colors.length];
        }),
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
            weight: '500',
          },
          color: '#6b7280',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: {
          family: "'Outfit', sans-serif",
          size: 13,
          weight: '600',
        },
        bodyFont: {
          family: "'JetBrains Mono', monospace",
          size: 12,
          weight: '500',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: {
          family: "'Outfit', sans-serif",
          size: 13,
          weight: '600',
        },
        bodyFont: {
          family: "'JetBrains Mono', monospace",
          size: 12,
          weight: '500',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
          color: '#6b7280',
          padding: 8,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
            weight: '500',
          },
          color: '#6b7280',
          padding: 8,
        },
      },
    },
  };

  return (
    <div className="mini-charts">
      <div className="chart-card">
        <div className="chart-header">
          <h4 className="chart-title">Lead Sources</h4>
          <span className="chart-badge">Distribution</span>
        </div>
        <div className="chart-container">
          <Pie data={sourceData} options={pieOptions} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h4 className="chart-title">Lead Status</h4>
          <span className="chart-badge">Overview</span>
        </div>
        <div className="chart-container">
          <Bar data={statusData} options={barOptions} />
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        :root {
          --color-primary: #6366f1;
          --color-surface: #ffffff;
          --color-border: #e5e7eb;
          --color-text: #111827;
          --color-text-muted: #6b7280;
          --color-bg: #fafbfc;
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --radius-lg: 16px;
          --radius-md: 12px;
        }
        
        .mini-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .chart-card {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .chart-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--color-primary), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .chart-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }
        
        .chart-card:hover::before {
          opacity: 1;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1.5px solid var(--color-border);
        }
        
        .chart-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text);
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.01em;
        }
        
        .chart-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--color-primary);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Outfit', sans-serif;
        }
        
        .chart-container {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Responsive Design */
        @media (max-width: 900px) {
          .mini-charts {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .chart-container {
            height: 240px;
          }
        }
        
        @media (max-width: 500px) {
          .chart-card {
            padding: 20px;
          }
          
          .chart-container {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
};

export default MiniCharts;