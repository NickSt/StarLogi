
import React, { useState, useMemo } from 'react';
import { PlanetData, ItemData } from '@/types';
import { RecipePreview } from './RecipePreview';
import { ResourceBadge } from './ResourceBadge';

interface SearchViewProps {
  planets: PlanetData[];
  items: ItemData[];
  onSelectItem: (name: string) => void;
}

/**
 * Checks if an item or any of its sub-requirements match the query.
 * This is recursive to allow searching for base resources and finding high-tier items that use them.
 */
function matchesRecursively(item: ItemData, lowerQuery: string, allItems: ItemData[], visited: Set<string> = new Set()): boolean {
  if (visited.has(item.name)) return false;
  visited.add(item.name);

  // Does the item name itself match?
  if (item.name.toLowerCase().includes(lowerQuery)) return true;

  // Do any direct requirements match?
  for (const req of item.requirements) {
    if (req.name.toLowerCase().includes(lowerQuery)) return true;

    // Recurse into sub-requirements if the requirement is another constructible item
    const subItem = allItems.find(i => i.name === req.name);
    if (subItem && matchesRecursively(subItem, lowerQuery, allItems, visited)) {
      return true;
    }
  }

  return false;
}

export const SearchView: React.FC<SearchViewProps> = ({ planets, items, onSelectItem }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { bestMatch: null, otherPlanets: [], otherItems: [] };

    const lowerQuery = query.toLowerCase();

    // Search Items: Match by recursive dependency check
    const matchedItems = items.map(item => {
      const hasRecursiveMatch = matchesRecursively(item, lowerQuery, items);
      if (!hasRecursiveMatch) return null;

      const isDirectNameMatch = item.name.toLowerCase().includes(lowerQuery);
      const isDirectRequirementMatch = item.requirements.some(req => req.name.toLowerCase().includes(lowerQuery));

      // It's an indirect match if it matches recursively but not directly (as name or primary requirement)
      const isIndirect = !isDirectNameMatch && !isDirectRequirementMatch;

      return { ...item, isIndirect };
    }).filter((i): i is (ItemData & { isIndirect: boolean }) => i !== null);

    // Search Planets: Match by planet name, system, or extractable resources
    const matchedPlanets = planets.filter(planet =>
      planet.name.toLowerCase().includes(lowerQuery) ||
      planet.system.toLowerCase().includes(lowerQuery) ||
      planet.resources.some(r => r.toLowerCase().includes(lowerQuery))
    );

    // Calculate "Best Match"
    let bestMatch: { type: 'item'; data: ItemData } | { type: 'planet'; data: PlanetData } | null = null;

    const exactItem = matchedItems.find(i => i.name.toLowerCase() === lowerQuery);
    const exactPlanet = planets.find(p => p.name.toLowerCase() === lowerQuery);

    if (exactItem) {
      bestMatch = { type: 'item', data: exactItem };
    } else if (exactPlanet) {
      bestMatch = { type: 'planet', data: exactPlanet };
    } else {
      const nameMatchedItems = matchedItems.filter(i => i.name.toLowerCase().includes(lowerQuery));
      const nameMatchedPlanets = matchedPlanets.filter(p => p.name.toLowerCase().includes(lowerQuery));

      if (nameMatchedItems.length > 0) bestMatch = { type: 'item', data: nameMatchedItems[0] };
      else if (nameMatchedPlanets.length > 0) bestMatch = { type: 'planet', data: nameMatchedPlanets[0] };
      else if (matchedItems.length > 0) bestMatch = { type: 'item', data: matchedItems[0] };
    }

    return {
      bestMatch,
      otherItems: matchedItems.filter(i => i !== bestMatch?.data),
      otherPlanets: matchedPlanets.filter(p => p !== bestMatch?.data)
    };
  }, [query, planets, items]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search planets, resources, or blueprints (e.g. 'Iron', 'Sol', 'Manifold')"
            className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-2xl px-6 py-4 text-lg focus:border-sky-500 outline-none transition-all placeholder:text-slate-600 shadow-2xl focus:ring-4 focus:ring-sky-500/10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        {!query && (
          <p className="text-center text-slate-600 text-[10px] font-mono mt-4 uppercase tracking-[0.2em]">
            Accessing Unified Galactic Index...
          </p>
        )}
      </div>

      {query.trim() && (
        <div className="space-y-12">
          {/* Best Match Spotlight */}
          {results.bestMatch && (
            <section className="animate-in zoom-in-95 duration-500">
              <h2 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-6 text-center">Primary Correspondence</h2>
              <div className="max-w-4xl mx-auto">
                {results.bestMatch.type === 'item' ? (
                  <ItemResult item={results.bestMatch.data} allItems={items} onSelect={onSelectItem} spotlight />
                ) : (
                  <PlanetResult planet={results.bestMatch.data} spotlight />
                )}
              </div>
            </section>
          )}

          {/* Categorized Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Items Column */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="h-[1px] flex-1 bg-white/5"></span>
                Industrial Blueprints
                <span className="h-[1px] flex-1 bg-white/5"></span>
              </h2>
              <div className="space-y-4">
                {results.otherItems.length > 0 ? (
                  results.otherItems.slice(0, 20).map(item => (
                    <ItemResult key={item.name} item={item} allItems={items} onSelect={onSelectItem} />
                  ))
                ) : (
                  !results.bestMatch && <div className="text-slate-700 font-mono text-xs italic text-center py-8">No matching blueprints found.</div>
                )}
              </div>
            </section>

            {/* Planets Column */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="h-[1px] flex-1 bg-white/5"></span>
                Celestial Bodies
                <span className="h-[1px] flex-1 bg-white/5"></span>
              </h2>
              <div className="space-y-4">
                {results.otherPlanets.length > 0 ? (
                  results.otherPlanets.slice(0, 15).map(planet => (
                    <PlanetResult key={planet.name} planet={planet} />
                  ))
                ) : (
                  !results.bestMatch && <div className="text-slate-700 font-mono text-xs italic text-center py-8">No matching celestial bodies found.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

const ItemResult: React.FC<{ item: ItemData & { isIndirect?: boolean }, allItems: ItemData[], onSelect: (n: string) => void, spotlight?: boolean }> = ({ item, allItems, onSelect, spotlight }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-panel rounded-xl p-6 border border-white/5 group transition-all duration-300 relative overflow-hidden hover:border-amber-500/40 ${spotlight ? 'ring-2 ring-amber-500/20' : ''}`}
    >
      {item.isIndirect && (
        <div className="absolute top-0 left-0 bg-indigo-500/20 border-b border-r border-indigo-500/30 px-3 py-1 rounded-br-lg z-10">
          <span className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.15em] flex items-center gap-1.5">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Indirect Dependency
          </span>
        </div>
      )}

      <div className={`flex justify-between items-start ${item.isIndirect ? 'mt-4' : ''}`}>
        <div>
          <h3 className={`font-black uppercase tracking-tight text-amber-100 transition-colors duration-300 group-hover:text-amber-400 ${spotlight ? 'text-2xl' : 'text-lg'}`}>{item.name}</h3>
          <p className="text-[9px] font-mono text-amber-500/60 tracking-widest uppercase">Manufactured Component</p>
        </div>
        <button
          onClick={() => onSelect(item.name)}
          className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-950 border border-amber-500/30 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shrink-0 ml-4"
        >
          Track
        </button>
      </div>

      <div className={`grid transition-all duration-500 ease-in-out ${isHovered ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-2 border-t border-white/5">
            <RecipePreview itemName={item.name} allItems={allItems} />
          </div>
        </div>
      </div>

      {!isHovered && !spotlight && (
        <div className="mt-2 text-[8px] text-slate-600 font-bold uppercase tracking-widest animate-pulse">
          Hover to expand blueprints
        </div>
      )}
    </div>
  );
};

const PlanetResult: React.FC<{ planet: PlanetData, spotlight?: boolean }> = ({ planet, spotlight }) => (
  <div className={`glass-panel rounded-xl p-6 border border-white/5 group transition-all hover:border-sky-500/40 ${spotlight ? 'ring-2 ring-sky-500/20' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className={`font-black uppercase tracking-tight text-sky-100 ${spotlight ? 'text-2xl' : 'text-lg'}`}>{planet.name}</h3>
        <p className="text-[9px] font-mono text-sky-500/60 tracking-widest uppercase">System: {planet.system}</p>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resources Available</p>
        <p className="text-[10px] font-mono text-white">{planet.resources.length} EXTRACTABLE</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-1">
      {planet.resources.map(res => (
        <ResourceBadge key={res} name={res} />
      ))}
    </div>
  </div>
);
