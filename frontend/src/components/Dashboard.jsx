import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, avgDistance: 0, avgVelocity: 0 });

  useEffect(() => {
    api.getStats().then(setStats);
  }, []);

  const data = {
    labels: ['NEOs Tracked', 'Avg Distance (LD)', 'Avg Velocity (km/s)'],
    datasets: [{
      label: 'Metrics',
      data: [stats.total, stats.avgDistance, stats.avgVelocity],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Risk Metrics</h2>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="p-4 bg-blue-500/20 rounded-xl">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div>Total NEOs</div>
        </div>
        <div className="p-4 bg-orange-500/20 rounded-xl">
          <div className="text-2xl font-bold text-orange-400">{stats.avgDistance.toFixed(1)} LD</div>
          <div>Avg Distance</div>
        </div>
        <div className="p-4 bg-red-500/20 rounded-xl">
          <div className="text-2xl font-bold text-red-400">{stats.avgVelocity.toFixed(1)} km/s</div>
          <div>Avg Velocity</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
