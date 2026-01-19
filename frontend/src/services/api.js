const API_BASE = '';

async function fetchJson(path) {
  if (!API_BASE) throw new Error('API disabled');
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

export async function getAsteroids() {
  try {
    const data = await fetchJson('/asteroids');
    return data.asteroids || data || [];
  } catch (e) {
    console.warn('Using mock asteroids:', e);
    return [
      { id: 1, name: '2026 AB1', distance: 3.4, velocity: 17.1, risk: 'Low' },
      { id: 2, name: 'Apollo-NEO 33', distance: 1.2, velocity: 22.4, risk: 'Medium' },
      { id: 3, name: '2025 QX9', distance: 0.8, velocity: 28.9, risk: 'Medium' },
      { id: 4, name: 'PHA-192', distance: 10.1, velocity: 12.3, risk: 'Low' },
      { id: 5, name: 'Tempel-NEO', distance: 6.7, velocity: 19.5, risk: 'Low' },
    ];
  }
}

export async function getStats() {
  try {
    return await fetchJson('/stats');
  } catch (e) {
    console.warn('Using mock stats:', e);
    return { total: 5, avgDistance: 4.4, avgVelocity: 20.4 };
  }
}
