
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
  const isIntermediate = planet.manufacturedItems && planet.manufacturedItems.length > 0 && !planet.isAssemblyHub;

  return (
    <div className={`glass-panel rounded-lg p-5 nasa-accent hover:border-sky-500 transition-all duration-300 relative overflow-hidden ${
      planet.isAssemblyHub ? 'border-amber-500/50 ring-2 ring-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.1)]' : 
      isIntermediate ? 'border-sky-400/50 ring-1 ring-sky-400/20' : ''
    }`}>
      {planet.isAssemblyHub && (
        <div className="absolute -right-12 top-4 rotate-45 bg-amber-500 text-slate-950 text-[10px] font-black py-1 px-14 shadow-lg z-10">
          COMMAND HUB
        </div>
      )}
      
      {isIntermediate && (
        <div className="absolute -right-12 top-4 rotate-45 bg-sky-500 text-slate-950 text-[10px] font-black py-1 px-14 shadow-lg z-10">
          FACTORY HUB
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

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="p-3 bg-slate-900/40 rounded border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Cargo Link Capacity</p>
            <span className={`font-mono text-xs font-bold ${isHardLimit ? 'text-red-500 animate-pulse' : isOverLimit ? 'text-amber-400' : 'text-sky-400'}`}>
              {planet.linkCount} / 6 USED
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all ${isHardLimit ? 'bg-red-500' : isOverLimit ? 'bg-amber-400' : 'bg-sky-500'}`} 
              style={{ width: `${Math.min(100, (planet.linkCount / 6) * 100)}%` }}
            ></div>
          </div>
          {isHardLimit && (
            <p className="text-[9px] text-red-500 mt-2 font-black uppercase tracking-tighter">
              Capacity Exceeded! Must split route.
            </p>
          )}
        </div>

        <div>
          <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Active Extraction</p>
          <div className="flex flex-wrap">
            {planet.resourcesFound.length > 0 ? (
              planet.resourcesFound.map((res, idx) => <ResourceBadge key={idx} name={res} />)
            ) : (
              <span className="text-[10px] text-slate-600 italic">No local extraction required.</span>
            )}
          </div>
        </div>
      </div>

      {planet.manufacturedItems && planet.manufacturedItems.length > 0 && (
        <div className="mb-4 p-3 bg-sky-500/5 border border-sky-500/10 rounded-md">
          <p className="text-[10px] text-sky-400 uppercase font-black mb-2 tracking-widest">Local Manufacturing</p>
          <div className="flex flex-wrap gap-2">
            {planet.manufacturedItems.map((item, i) => (
              <span key={i} className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-sky-500/30">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-800 pt-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Logistics Network</h4>
        <div className="space-y-2">
          {planet.links.length > 0 ? (
            planet.links.map((link, i) => (
              <div key={i} className="flex flex-col p-2 bg-slate-800/30 rounded border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-black ${link.direction === 'Incoming' ? 'text-emerald-400' : 'text-sky-400'}`}>
                    {link.direction === 'Incoming' ? '← INCOMING' : '→ OUTGOING'}
                  </span>
                  <span className={`text-[8px] px-1 py-0.5 rounded ${link.type === 'Inter-System' ? 'bg-amber-500/10 text-amber-500' : 'bg-sky-500/10 text-sky-500'}`}>
                    {link.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white font-bold">{link.target}</span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[120px]">
                    Cargo: {link.cargo.join(', ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-slate-600 italic">Disconnected Node.</p>
          )}
        </div>
      </div>
    </div>
  );
};
