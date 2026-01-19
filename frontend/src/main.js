import { initOrbitCanvas } from './components/OrbitCanvas.js';
import { initAsteroidPanel } from './components/AsteroidPanel.js';
import { initDashboard } from './components/Dashboard.js';

window.addEventListener('DOMContentLoaded', () => {
  initOrbitCanvas();
  initAsteroidPanel();
  initDashboard();
});
