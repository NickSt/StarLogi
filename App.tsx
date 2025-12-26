
import React, { useState, useCallback, useMemo } from 'react';
import { getLocalConstructionStrategy } from './services/localOptimizer';
import { ConstructionAnalysis } from './types';
import { PlanetCard } from './components/PlanetCard';
import { NetworkGraph } from './components/NetworkGraph';
import { RecipePreview } from './components/RecipePreview';
import { CONSTRUCTIBLE_ITEMS } from './data/gameData';

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ConstructionAnalysis | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return CONSTRUCTIBLE_ITEMS.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleItem = (name: string) => {
    setSelectedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
    setAnalysis(null);
  };

  const handleOptimize = useCallback(() => {
    if (selectedItems.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const result = getLocalConstructionStrategy(selectedItems);
      setAnalysis(result);
      setLoading(false);
    }, 600);
  }, [selectedItems]);

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Outpost<span className="text-sky-400">Optimizer</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase mt-1 tracking-widest">Settled Systems Logistics Engine v8.2</p>
        </div>
        
        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
          <div className="flex gap-2 w-full md:w-96">
            <input 
              type="text" 
              placeholder="Filter blueprints..."
              className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm w-full focus:border-sky-500 outline-none transition-all focus:ring-1 focus:ring-sky-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={handleOptimize}
              disabled={selectedItems.length === 0 || loading}
              className={`bg-sky-600 hover:bg-sky-500 disabled:opacity-20 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all whitespace-nowrap starfield-glow ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? 'CALCULATING...' : 'GENERATE ROUTES'}
            </button>
          </div>
          <div className="flex flex-wrap justify-end gap-2 min-h-[24px]">
            {selectedItems.map(item => (
              <span key={item} className="text-[10px] bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                {item}
                <button onClick={(e) => { e.stopPropagation(); toggleItem(item); }} className="ml-1 hover:text-white leading-none">×</button>
              </span>
            ))}
          </div>
        </div>
      </header>

      {!analysis && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.name} 
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => toggleItem(item.name)}
              className={`glass p-6 rounded-2xl cursor-pointer transition-all duration-300 relative group min-h-[160px] border flex flex-col ${
                selectedItems.includes(item.name) 
                  ? 'border-sky-500 ring-1 ring-sky-500/50 bg-sky-500/10' 
                  : 'border-white/5 hover:border-sky-500/50 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-slate-100 uppercase tracking-tight text-sm leading-tight">{item.name}</h3>
                {selectedItems.includes(item.name) && (
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mt-1 shrink-0"></div>
                )}
              </div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-4">Unit Data Available</p>
              
              <div className="mt-auto transition-all duration-300">
                {hoveredItem === item.name ? (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                    <RecipePreview itemName={item.name} />
                  </div>
                ) : (
                  <div className="opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                    <RecipePreview itemName={item.name} compact />
                  </div>
                )}
              </div>

              {/* Hover highlight background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/0 via-sky-500/0 to-sky-500/5 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-sky-500 animate-pulse text-sm">QUERYING GALACTIC LOGISTICS NETWORK...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-4 space-y-6">
            <section className="glass-panel p-6 rounded-2xl nasa-accent starfield-glow">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Efficiency Metrics</h2>
              <div className="mb-6">
                <p className="text-4xl font-black text-white">{analysis.efficiencyScore}%</p>
                <p className="text-[10px] text-sky-400 uppercase font-mono tracking-widest">Route Optimization Rating</p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-light italic bg-slate-900/50 p-3 rounded-lg border border-white/5">
                {analysis.logisticalSummary}
              </p>
            </section>

            <section className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Material Manifest</h2>
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {analysis.totalResourcesRequired.map(res => (
                  <div key={res.name} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded border border-white/5 hover:border-sky-500/30 transition-colors">
                    <span className="text-[11px] text-slate-300 font-medium">{res.name}</span>
                    <span className="text-sky-400 font-mono text-[11px] font-black">x{res.amount}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <NetworkGraph analysis={analysis} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.recommendedPlanets.map((planet, idx) => (
                <PlanetCard key={planet.planetName} planet={planet} index={idx} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
