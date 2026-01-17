import { useState, useEffect } from 'react';
import api from '../services/api.js';

const AsteroidPanel = () => {
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    api.getAsteroids().then(setAsteroids);
  }, []);

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl lg:col-span-1">
      <h2 className="text-2xl font-bold mb-6 text-center">Nearby Asteroids</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {asteroids.slice(0,5).map((ast) => (
          <div key={ast.id} className="p-4 bg-gray-900/50 rounded-xl border-l-4 border-blue-400 hover:bg-gray-800/50 transition-all">
            <div className="font-bold text-lg">{ast.name}</div>
            <div className="text-sm text-gray-300">Distance: {ast.distance} LD</div>
            <div className="text-sm text-gray-300">Velocity: {ast.velocity} km/s</div>
            <div className="text-sm">Risk: {ast.risk}</div>
          </div>
        ))}
      </div>
      {asteroids.error && (
        <p className="text-red-400 text-center mt-4">Connection error - using mock data</p>
      )}
    </div>
  );
};

export default AsteroidPanel;
