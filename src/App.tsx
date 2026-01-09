import React, { useState } from 'react';
import { SearchView } from '@/components/SearchView';
import { NetworkGraph } from '@/components/NetworkGraph';
import { PlanetCard } from '@/components/PlanetCard';
import { useGalacticData } from '@/hooks/useGalacticData';
import { useOptimizer } from '@/hooks/useOptimizer';
import { AppHeader } from '@/components/layout/AppHeader';
import { SelectionControls } from '@/components/layout/SelectionControls';
import { OptimizerReport } from '@/components/layout/OptimizerReport';
import { ItemCard } from '@/components/ItemCard';

const App: React.FC = () => {
  const { galacticData, initializing, itemTiers } = useGalacticData();
  const {
    selectedItems,
    toggleItem,
    clearSelected,
    analysis,
    setAnalysis,
    loading,
    useBidirectional,
    setUseBidirectional,
    handleOptimize,
    handleExport
  } = useOptimizer(galacticData);

  const [currentView, setCurrentView] = useState<'home' | 'optimizer' | 'database'>('home');
  const [itemFilter, setItemFilter] = useState('');

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(14,165,233,0.3)]" />
        <h2 className="text-white text-xl font-black uppercase tracking-[0.3em] animate-pulse">Initializing Data Stream</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">Constellation Local Cache Syncing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-sky-500/30 selection:text-sky-200">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <AppHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          useBidirectional={useBidirectional}
          setUseBidirectional={setUseBidirectional}
        />

        {currentView !== 'database' && (
          <SelectionControls
            itemFilter={itemFilter}
            setItemFilter={setItemFilter}
            selectedItems={selectedItems}
            toggleItem={toggleItem}
            clearSelected={clearSelected}
            handleOptimize={handleOptimize}
            loading={loading}
            allItems={galacticData?.items || []}
          />
        )}

        {currentView === 'optimizer' && analysis && (
          <OptimizerReport
            analysis={analysis}
            handleExport={handleExport}
          />
        )}

        {currentView === 'database' ? (
          <SearchView
            planets={galacticData?.planets || []}
            items={galacticData?.items || []}
            onSelectItem={(name) => {
              // Toggle item in optimizer if selected from search
              const item = galacticData?.items.find(i => i.name === name);
              if (item) toggleItem(item);
            }}
          />
        ) : (
          <div className="space-y-12">
            {!analysis && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {(galacticData?.items || [])
                  .filter(item => item.name.toLowerCase().includes(itemFilter.toLowerCase()))
                  .map((item) => (
                    <ItemCard
                      key={item.name}
                      item={item}
                      isSelected={!!selectedItems.find(i => i.name === item.name)}
                      tier={itemTiers[item.name.toLowerCase()] || 1}
                      allItems={galacticData?.items || []}
                      onToggle={toggleItem}
                    />
                  ))}
              </div>
            )}

            {analysis && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start animate-in fade-in duration-1000">
                <div className="xl:col-span-3">
                  <NetworkGraph analysis={analysis} />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Logistics Topology</h4>
                    <button
                      onClick={() => setAnalysis(null)}
                      className="text-[9px] text-slate-500 hover:text-white font-black uppercase transition-colors"
                    >
                      Reset Configuration
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {analysis.recommendedPlanets.map((planet, idx) => (
                      <div key={planet.planetName} className="animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <PlanetCard
                          planetName={planet.planetName}
                          system={planet.system}
                          sites={analysis.recommendedPlanets.filter(p => p.planetName === planet.planetName)}
                          index={idx}
                          planetData={galacticData?.planets.find(p => p.name === planet.planetName)}
                          resourceTypes={galacticData?.resourceTypes}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
