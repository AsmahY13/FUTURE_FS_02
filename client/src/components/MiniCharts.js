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
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
        hoverOffset: 6,
      },
    ],
  };

  const statusData = {
    labels: stats.statuses.map(s => s.name),
    datasets: [
      {
        label: 'Leads',
        data: stats.statuses.map(s => s.count),
        backgroundColor: '#6366f1',
      },
    ],
  };

  return (
    <div className="mini-charts">
      <div className="chart-card">
        <h4>Lead Sources</h4>
        <Pie data={sourceData} options={{ plugins: { legend: { position: 'bottom' } } }} />
      </div>

      <div className="chart-card">
        <h4>Lead Status</h4>
        <Bar data={statusData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
      </div>

      <style jsx>{`
        .mini-charts {
          display: flex;
          gap: 24px;
          align-items: stretch;
          margin-bottom: 16px;
          justify-content: center;
        }
        .chart-card {
          background: white;
          padding: 12px;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
          width: 320px;
          max-width: 340px;
        }
        .chart-card h4 { margin: 0 0 8px 0; font-size: 14px; }
        @media (max-width: 900px) {
          .mini-charts { flex-direction: column; gap: 16px; align-items: stretch; }
          .chart-card { width: 100%; max-width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default MiniCharts;
