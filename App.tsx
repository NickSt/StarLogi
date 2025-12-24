
import React, { useState, useCallback, useMemo } from 'react';
import { getLocalConstructionStrategy } from './services/localOptimizer';
import { ConstructionAnalysis } from './types';
import { PlanetCard } from './components/PlanetCard';
import { ResourceBadge } from './components/ResourceBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CONSTRUCTIBLE_ITEMS } from './data/gameData';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ConstructionAnalysis | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return CONSTRUCTIBLE_ITEMS;
    return CONSTRUCTIBLE_ITEMS.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleItemSelection = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(i => i !== itemName) 
        : [...prev, itemName]
    );
    if (analysis) setAnalysis(null);
  };

  const runOptimization = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const result = getLocalConstructionStrategy(selectedItems);
        setAnalysis(result);
      } catch (err: any) {
        setError(err.message || 'Optimization failed.');
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [selectedItems]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredItems.length > 0 && searchTerm.trim()) {
      const exactMatch = filteredItems.find(i => i.name.toLowerCase() === searchTerm.toLowerCase());
      if (exactMatch) {
        if (!selectedItems.includes(exactMatch.name)) {
          toggleItemSelection(exactMatch.name);
        }
        setSearchTerm('');
      } else {
        if (!selectedItems.includes(filteredItems[0].name)) {
          toggleItemSelection(filteredItems[0].name);
        }
        setSearchTerm('');
      }
    }
  };

  const COLORS = ['#38bdf8', '#818cf8', '#fb7185', '#34d399', '#fbbf24', '#a78bfa'];

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto pt-12 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 mb-10">
        <div className="cursor-pointer" onClick={() => { setAnalysis(null); setSelectedItems([]); setSearchTerm(''); }}>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            OUTPOST<span className="text-sky-500 italic">OPTIMIZER</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm uppercase">Advanced Logistics v6.0</p>
        </div>
        
        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search components..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-full transition-all"
              />
            </div>
            <button
              type="button"
              onClick={runOptimization}
              disabled={loading || selectedItems.length === 0}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center min-w-[140px] starfield-glow"
            >
              {loading ? 'ANALYZING...' : 'RUN LOGISTICS'}
            </button>
          </form>

          <div className="flex flex-wrap justify-end gap-2 max-w-md">
            {selectedItems.map(item => (
              <button
                key={item}
                onClick={() => toggleItemSelection(item)}
                className="text-[10px] font-bold bg-sky-500/10 border border-sky-500/40 text-sky-400 px-2 py-1 rounded-md flex items-center hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all group"
              >
                {item.toUpperCase()}
                <span className="ml-2 opacity-50 group-hover:opacity-100">×</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-8 text-center animate-pulse font-bold">
            {error}
          </div>
        )}

        {!analysis && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center">
                <span className="w-8 h-[1px] bg-sky-500 mr-4"></span>
                Constellation Database
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedItems.includes(item.name);
                return (
                  <button
                    key={item.name}
                    onClick={() => toggleItemSelection(item.name)}
                    className={`glass-panel text-left p-5 rounded-xl border transition-all group relative overflow-hidden ${
                      isSelected ? 'border-sky-500 bg-sky-500/5 ring-1 ring-sky-500/50' : 'hover:border-slate-500 border-transparent'
                    }`}
                  >
                    <h3 className={`text-sm font-bold mb-1 transition-colors ${isSelected ? 'text-sky-400' : 'text-white'}`}>
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">View sub-components &raquo;</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {analysis && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Side: Summary & Logistical Details */}
            <div className="lg:col-span-1 space-y-8">
              <button 
                onClick={() => setAnalysis(null)}
                className="flex items-center text-sky-500 hover:text-sky-400 text-xs font-bold uppercase tracking-widest mb-4 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Edit Selection
              </button>

              <section className="glass-panel p-6 rounded-xl border-sky-500/30 starfield-glow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1V9.414l1.293 1.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-tight">Logistics Hub</h2>
                    <p className="text-[10px] text-sky-400 font-mono font-black">{analysis.primaryAssemblyHub.toUpperCase()}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-6 font-light">
                  {analysis.logisticalSummary}
                </p>
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Logistical Efficiency</span>
                    <span className="text-sky-400 font-black text-sm">{analysis.efficiencyScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${analysis.efficiencyScore}%` }}></div>
                  </div>
                </div>
              </section>

              <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Manufacturing Routes</h2>
                {analysis.manufacturingNodes.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.manufacturingNodes.map((node, i) => (
                      <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-sky-400">{node.itemName}</span>
                          <span className="text-[9px] text-slate-500 font-mono">ON-SITE</span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic mb-2">Produced at {node.planetName}</p>
                        <div className="flex flex-wrap gap-1">
                          {node.components.map((c, idx) => (
                            <span key={idx} className="text-[8px] bg-slate-800 text-slate-500 px-1 py-0.5 rounded border border-slate-700">{c}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No direct manufacturing nodes identified. Standard shipping required.</p>
                )}
              </section>
            </div>

            {/* Right Side: Maps & Resources */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Recommended Resource Network</h2>
                  <span className="bg-sky-500 text-slate-950 font-black px-3 py-1 rounded-sm text-[11px] uppercase tracking-tighter">
                    {analysis.recommendedPlanets.length} NODES IDENTIFIED
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.recommendedPlanets.map((planet, i) => (
                    <PlanetCard key={i} planet={planet} index={i} />
                  ))}
                </div>
              </section>

              <section className="glass-panel p-6 rounded-xl bg-slate-900/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-tight flex items-center">
                      Resource Volume
                    </h2>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analysis.recommendedPlanets.map(p => ({ 
                              name: p.planetName, 
                              value: p.resourcesFound.length 
                            }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            dataKey="value"
                          >
                            {analysis.recommendedPlanets.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-tight">Required Load</h2>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {analysis.totalResourcesRequired.map((res, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] p-2 bg-slate-800/30 rounded border border-slate-800">
                          <span className="text-slate-400 truncate">{res.name}</span>
                          <span className="text-sky-500 font-mono font-bold">x{res.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-b-2 border-sky-500 rounded-full animate-spin mb-6"></div>
            <p className="text-sky-400 font-mono text-xl tracking-[0.4em] font-bold">OPTIMIZING NETWORK</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full glass-panel py-3 px-8 flex justify-between items-center z-50 border-t border-sky-500/10">
        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">
          Constellation Logistics Interface // Local Cache V6.0
        </div>
      </footer>
    </div>
  );
};

export default App;
