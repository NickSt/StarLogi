
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { getLocalConstructionStrategy } from '@/services/localOptimizer';
import { fetchGalacticData } from '@/services/dataService';
import { ConstructionAnalysis, ItemData, PlanetData, PlanetStrategy } from '@/types';
import { PlanetCard } from '@/components/PlanetCard';
import { NetworkGraph } from '@/components/NetworkGraph';
import { RecipePreview } from '@/components/RecipePreview';
import { SearchView } from '@/components/SearchView';

type ViewMode = 'optimizer' | 'search';
// type SortMode = 'tier' | 'alphabetical'; // Unused for now

const App: React.FC = () => {
  const [galacticData, setGalacticData] = useState<{ items: ItemData[], planets: PlanetData[], resourceTypes: Record<string, string> } | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [analysis, setAnalysis] = useState<ConstructionAnalysis | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null); // Unused
  const [currentView, setCurrentView] = useState<ViewMode>('optimizer');
  // const [sortMode, setSortMode] = useState<SortMode>('tier'); // Unused
  const sortMode = 'tier'; // Defaulting usage for now to keep logic intact
  const [useBidirectional, setUseBidirectional] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const data = await fetchGalacticData();
        setGalacticData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      } finally {
        setInitializing(false);
      }
    }
    init();
  }, []);

  const handleOptimize = useCallback(() => {
    if (!galacticData || selectedItems.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const result = getLocalConstructionStrategy(selectedItems, galacticData.items, galacticData.planets, useBidirectional);
        setAnalysis(result);
        setCurrentView('optimizer');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [selectedItems, galacticData, useBidirectional]);

  const handleExport = useCallback(() => {
    if (!analysis) return;

    const exportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        selectedItems,
        efficiencyScore: analysis.efficiencyScore,
        logisticalSummary: analysis.logisticalSummary,
        outpostLimitReached: analysis.outpostLimitReached
      },
      outposts: analysis.recommendedPlanets.map(p => ({
        planet: p.planetName,
        system: p.system,
        isHub: p.isAssemblyHub,
        extracted: p.resourcesFound,
        manufactured: [
          ...(p.manufacturedItems || []),
          ...(p.finalAssemblyItems || [])
        ]
      })),
      logistics: analysis.recommendedPlanets.flatMap(p =>
        p.links
          .filter(link => link.direction === 'Outgoing' || link.direction === 'Bidirectional')
          .map(link => ({
            from: p.planetName,
            to: link.target,
            transport: link.type,
            cargo: link.cargo
          }))
      )
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'outpost-plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [analysis, selectedItems]);


  useEffect(() => {
    if (analysis) handleOptimize();
  }, [useBidirectional, analysis, handleOptimize]);

  const itemTiers = useMemo(() => {
    if (!galacticData) return {};
    const tiers: Record<string, number> = {};
    const itemsMap = new Map<string, ItemData>(galacticData.items.map(i => [i.name.toLowerCase(), i]));

    function calculateTier(name: string, visited = new Set<string>()): number {
      const lowerName = name.toLowerCase();
      if (tiers[lowerName]) return tiers[lowerName];
      if (visited.has(lowerName)) return 1;

      const item = itemsMap.get(lowerName);
      if (!item) return 0;

      visited.add(lowerName);
      let maxSubTier = 0;
      for (const req of item.requirements) {
        maxSubTier = Math.max(maxSubTier, calculateTier(req.name, visited));
      }

      const result = maxSubTier + 1;
      tiers[lowerName] = result;
      return result;
    }

    galacticData.items.forEach(item => calculateTier(item.name));
    return tiers;
  }, [galacticData]);

  const groupedPlanets = useMemo(() => {
    if (!analysis) return [];

    const groups: Record<string, PlanetStrategy[]> = {};
    analysis.recommendedPlanets.forEach(p => {
      const baseName = p.planetName.split(' (Site')[0];
      if (!groups[baseName]) groups[baseName] = [];
      groups[baseName].push(p);
    });

    return Object.entries(groups).map(([name, sites]) => ({
      name,
      sites,
      system: sites[0].system
    }));
  }, [analysis]);

  const filteredItems = useMemo(() => {
    if (!galacticData) return [];
    const filtered = galacticData.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sortMode === 'tier') {
        const tierA = itemTiers[a.name.toLowerCase()] || 1;
        const tierB = itemTiers[b.name.toLowerCase()] || 1;
        if (tierA !== tierB) return tierB - tierA;
        return a.name.localeCompare(b.name);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, galacticData, itemTiers, sortMode]);

  const toggleItem = (name: string) => {
    setSelectedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const getTierStyles = (name: string) => {
    const tier = itemTiers[name.toLowerCase()] || 1;
    switch (tier) {
      case 4: return { border: 'border-amber-500/40', bg: 'bg-amber-500/5', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]', text: 'text-amber-400', label: 'TIER 4' };
      case 3: return { border: 'border-sky-500/40', bg: 'bg-sky-500/5', glow: 'shadow-[0_0_15px_rgba(14,165,233,0.1)]', text: 'text-sky-400', label: 'TIER 3' };
      case 2: return { border: 'border-emerald-500/40', bg: 'bg-emerald-500/5', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]', text: 'text-emerald-400', label: 'TIER 2' };
      default: return { border: 'border-white/10', bg: 'bg-slate-900/40', glow: '', text: 'text-slate-400', label: 'TIER 1' };
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-6"></div>
        <h1 className="text-xl font-black text-white uppercase tracking-[0.3em] animate-pulse">Initializing Local Database</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              Outpost<span className="text-sky-400">Optimizer</span>
            </h1>
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/10">
              <button onClick={() => setCurrentView('optimizer')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'optimizer' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500'}`}>Logistics</button>
              <button onClick={() => setCurrentView('search')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'search' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500'}`}>Database</button>
            </div>
          </div>
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">Enforcing Base Game Outpost Limit: 24</p>
        </div>

        <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-slate-900/50 px-3 py-2 rounded-xl border border-white/5 self-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Efficiency</span>
            <button
              onClick={() => setUseBidirectional(!useBidirectional)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${useBidirectional ? 'bg-sky-500' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${useBidirectional ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
            <div className="flex gap-2 w-full md:w-auto">
              {currentView === 'optimizer' && analysis && !loading ? (
                <>
                  <button onClick={() => setAnalysis(null)} className="bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-2 rounded-lg text-xs transition-all border border-slate-600 uppercase tracking-wider">Modify Selections</button>
                  <button onClick={handleExport} className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all whitespace-nowrap">Export Plan</button>
                </>
              ) : currentView === 'optimizer' && (
                <input type="text" placeholder="Filter blueprints..." className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm w-full outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              )}
              {currentView === 'optimizer' && !analysis && (
                <button onClick={handleOptimize} disabled={selectedItems.length === 0 || loading} className={`bg-sky-600 hover:bg-sky-500 disabled:opacity-20 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${loading ? 'animate-pulse' : ''}`}>
                  {loading ? 'CALCULATING...' : 'GENERATE ROUTES'}
                </button>
              )}
            </div>
          </div>
          {currentView === 'optimizer' && selectedItems.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              <button onClick={() => { setSelectedItems([]); setAnalysis(null); }} className="text-[9px] text-slate-500 hover:text-red-400 font-black uppercase">Clear All</button>
              {selectedItems.map(item => <span key={item} className="text-[10px] bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1">{item}<button onClick={(e) => { e.stopPropagation(); toggleItem(item); }} className="ml-1 hover:text-white">×</button></span>)}
            </div>
          )}
        </div>
      </header>

      {currentView === 'search' && galacticData && <SearchView planets={galacticData.planets} items={galacticData.items} onSelectItem={(name) => { toggleItem(name); setCurrentView('optimizer'); setAnalysis(null); }} />}

      {currentView === 'optimizer' && (
        <>
          {!analysis && !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredItems.map(item => {
                const styles = getTierStyles(item.name);
                const isSelected = selectedItems.includes(item.name);
                return (
                  <div key={item.name} onClick={() => toggleItem(item.name)} onMouseEnter={() => setHoveredItem(item.name)} onMouseLeave={() => setHoveredItem(null)} className={`glass p-6 rounded-2xl cursor-pointer relative group min-h-[160px] border flex flex-col item-card-hover transition-all duration-300 ${isSelected ? 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-500/10' : `${styles.border} ${styles.bg} ${styles.glow}`}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-black uppercase tracking-tight text-sm ${isSelected ? 'text-white' : 'text-slate-100 group-hover:text-white'}`}>{item.name}</h3>
                      <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded border border-white/5 bg-slate-950/50 ${isSelected ? 'text-sky-400' : styles.text}`}>{styles.label}</span>
                    </div>
                    <div className="mt-auto">
                      <RecipePreview itemName={item.name} allItems={galacticData!.items} compact={hoveredItem !== item.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {analysis && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <section className="glass-panel p-6 rounded-2xl nasa-accent starfield-glow">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Intelligence Report</h2>
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <p className="text-5xl font-black text-white tracking-tighter">{analysis.efficiencyScore}<span className="text-sky-500 text-2xl ml-1">%</span></p>
                        <p className="text-[10px] text-sky-400 uppercase font-mono tracking-widest mt-1">Route Integrity</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-black tracking-tighter ${analysis.outpostLimitReached ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                          {analysis.recommendedPlanets.length}<span className="text-[10px] text-slate-500 ml-1">/ 24</span>
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mt-1">Outpost Saturation</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-light italic bg-slate-900/50 p-4 rounded-xl border border-white/5">
                      "{analysis.logisticalSummary}"
                    </p>
                  </section>

                  <section className="glass-panel p-6 rounded-2xl flex flex-col flex-grow">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Required Extraction</h2>
                    <div className="relative flex-1 min-h-0">
                      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2">
                        <div className="grid grid-cols-1 gap-2">
                          {analysis.totalResourcesRequired.map(res => (
                            <div key={res.name} className="flex justify-between items-center bg-slate-800/20 p-3 rounded-lg border border-white/5 hover:border-sky-500/30 transition-all group">
                              <span className="text-[11px] text-slate-300 font-medium group-hover:text-white">{res.name}</span>
                              <span className="text-sky-400 font-mono text-[11px] font-black">x{res.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-8">
                  <NetworkGraph analysis={analysis} />
                </div>
              </div>

              {/* Planet Cards now span the full width below the main grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {groupedPlanets.map((group, idx) => {
                  // Find the matching full planet data for hover stats
                  const fullPlanetData = galacticData?.planets.find(p => p.name === group.name);
                  return (
                    <PlanetCard
                      key={group.name}
                      planetName={group.name}
                      system={group.system}
                      sites={group.sites}
                      index={idx}
                      planetData={fullPlanetData}
                      resourceTypes={galacticData?.resourceTypes}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
