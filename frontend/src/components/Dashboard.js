import { getStats } from '../services/api.js';

export async function initDashboard() {
  const totalEl = document.getElementById('metricTotal');
  const distEl = document.getElementById('metricAvgDistance');
  const velEl = document.getElementById('metricAvgVelocity');

  if (!totalEl || !distEl || !velEl) return;

  const stats = await getStats();
  const total = stats.total || 0;
  const avgDistance = stats.avgDistance || 0;
  const avgVelocity = stats.avgVelocity || 0;

  totalEl.textContent = total;
  distEl.textContent = avgDistance.toFixed(1) + ' LD';
  velEl.textContent = avgVelocity.toFixed(1) + ' km/s';
}
