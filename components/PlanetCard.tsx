
import React from 'react';
import { PlanetStrategy } from '../types';
import { ResourceBadge } from './ResourceBadge';

interface PlanetCardProps {
  planet: PlanetStrategy;
  index: number;
}

export const PlanetCard: React.FC<PlanetCardProps> = ({ planet, index }) => {
  const isOverLimit = planet.linkCount > 3;
  const isHardLimit = planet.linkCount > 6;

  return (
    <div className={`glass-panel rounded-lg p-5 nasa-accent hover:border-sky-500 transition-all duration-300 relative overflow-hidden ${
      planet.isAssemblyHub ? 'border-amber-500/50 ring-2 ring-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.1)]' : 
      planet.isManufacturingSite ? 'border-sky-400/50 ring-1 ring-sky-400/20' : ''
    }`}>
      {planet.isAssemblyHub && (
        <div className="absolute -right-12 top-4 rotate-45 bg-amber-500 text-slate-950 text-[10px] font-black py-1 px-14 shadow-lg z-10">
          ASSEMBLY HUB
        </div>
      )}
      
      {planet.isManufacturingSite && !planet.isAssemblyHub && (
        <div className="absolute -right-12 top-4 rotate-45 bg-sky-500 text-slate-950 text-[10px] font-black py-1 px-14 shadow-lg z-10">
          FACTORY
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className={planet.isAssemblyHub ? "text-amber-500 mr-2" : "text-sky-500 mr-2"}>#{index + 1}</span>
            {planet.planetName}
          </h3>
          <p className="text-sm text-slate-400 font-mono uppercase tracking-wider">
            System: {planet.system}
          </p>
        </div>
      </div>

      {planet.isAssemblyHub && planet.finalAssemblyItems && (
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md animate-in fade-in zoom-in-95 duration-500">
          <p className="text-[10px] text-amber-500 uppercase font-black mb-2 tracking-widest flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 2.318a1 1 0 01-.8 1.601H3.851a1 1 0 01-.8-1.601l1.738-2.318-1.233-.616a1 1 0 01.894-1.79l1.599.8L10 4.323V3a1 1 0 011-1zm-5 8v2h10v-2H5z" clipRule="evenodd"/></svg>
            Final Assembly Targets
          </p>
          <div className="flex flex-wrap gap-2">
            {planet.finalAssemblyItems.map((item, i) => (
              <span key={i} className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Local Resources</p>
          <div className="flex flex-wrap">
            {planet.resourcesFound.map((res, idx) => (
              <ResourceBadge key={idx} name={res} />
            ))}
          </div>
        </div>
        
        <div className="p-3 bg-slate-900/40 rounded border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Link Capacity</p>
            <span className={`font-mono text-xs font-bold ${isHardLimit ? 'text-red-500' : isOverLimit ? 'text-amber-400' : 'text-sky-400'}`}>
              {planet.linkCount} / 6
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div 
              className={`h-full transition-all ${isHardLimit ? 'bg-red-500' : isOverLimit ? 'bg-amber-400' : 'bg-sky-500'}`} 
              style={{ width: `${(planet.linkCount / 6) * 100}%` }}
            ></div>
          </div>
          {isOverLimit && (
            <p className="text-[9px] text-amber-500/70 mt-1 italic font-mono">
              Requires Outpost Management Rank {isHardLimit ? 'MAX' : '1+'}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
          <svg className="w-3 h-3 mr-1 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          Transit Links
        </h4>
        {planet.links.length > 0 ? (
          <div className="space-y-2">
            {planet.links.map((link, i) => (
              <div key={i} className="flex flex-col p-2 bg-slate-800/30 rounded border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold ${link.direction === 'Incoming' ? 'text-emerald-400' : 'text-sky-400'}`}>
                    {link.direction === 'Incoming' ? '← INCOMING' : '→ OUTGOING'}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${link.type === 'Inter-System' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'}`}>
                    {link.type.toUpperCase()} {link.type === 'Inter-System' && '(+He3)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-medium">{link.target}</span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[150px]">
                    Cargo: {link.cargo.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-600 italic">No active transit links configured.</p>
        )}
      </div>

      {planet.isManufacturingSite && planet.manufacturedItems && (
        <div className="mt-4 p-3 bg-sky-500/5 border border-sky-500/10 rounded-md">
          <p className="text-[10px] text-sky-400 uppercase font-black mb-2 tracking-widest flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v1H3a1 1 0 000 2h2v2H3a1 1 0 000 2h2v2H3a1 1 0 000 2h2v1a2 2 0 002 2h1a1 1 0 002-2v-1h2v1a1 1 0 002 2h1a2 2 0 002-2v-1h2a1 1 0 000-2h-2v-2h2a1 1 0 000-2h-2V7h2a1 1 0 000-2h-2V4a2 2 0 00-2-2h-1a1 1 0 00-2 2v1H9V4a1 1 0 00-2-2H7zm0 5h2v2H7V7zm5 0h2v2h-2V7z" clipRule="evenodd"/></svg>
            Intermediate Production
          </p>
          <div className="flex flex-wrap gap-2">
            {planet.manufacturedItems.map((item, i) => (
              <span key={i} className="text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
