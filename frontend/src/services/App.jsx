import OrbitCanvas from './components/OrbitCanvas.jsx';
import AsteroidPanel from './components/AsteroidPanel.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-indigo-900 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Asteroid Orbit Tracker 🚀
        </h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <OrbitCanvas />
        <AsteroidPanel />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
