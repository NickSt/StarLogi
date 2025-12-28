import React, { useState, useEffect } from 'react';
import { PlanetStrategy } from '../types';
import { ResourceBadge } from './ResourceBadge';

interface PlanetCardProps {
  planetName: string;
  system: string;
  sites: PlanetStrategy[];
  index: number;
  planetData?: any; // Add optional full planet data
}

export const PlanetCard: React.FC<PlanetCardProps> = ({ planetName, system, sites, index, planetData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isAssemblyPlanet = sites.some(s => s.isAssemblyHub);

  return (
    <div 
      className={`glass-panel rounded-xl p-4 nasa-accent hover:border-sky-500/40 transition-all duration-300 relative overflow-visible ${
        isAssemblyPlanet ? 'border-amber-500/40 ring-1 ring-amber-500/10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Detailed Stats Hover Overlay */}
      {isHovered && planetData && (
        <div className="absolute z-50 left-0 right-0 -top-2 translate-y-[-100%] animate-in fade-in zoom-in duration-200 pointer-events-none">
          <div className="glass-panel p-4 rounded-xl border border-sky-500/30 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none">Atmosphere</p>
                <p className="text-xs text-white font-mono uppercase truncate">{planetData.atmosphere || 'None'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none">Gravity</p>
                <p className="text-xs text-white font-mono uppercase">{planetData.gravity}G</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none">Temperature</p>
                <p className="text-xs text-white font-mono uppercase">{planetData.temperature}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none">Type</p>
                <p className="text-xs text-white font-mono uppercase">{planetData.type}</p>
              </div>
              <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 leading-none text-center">Available Orbitals</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {planetData.resources?.slice(0, 8).map((res: string) => (
                    <span key={res} className="text-[7px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono">{res}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 text-[7px] text-sky-400/50 font-black uppercase tracking-tighter text-center italic">
              Survey Data provided by Constellation Local Cache
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-sky-500/30 mx-auto"></div>
        </div>
      )}

      {/* Condensed Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-black shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-black text-white uppercase tracking-tight italic flex items-center gap-2 leading-none truncate">
              {planetName}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1 truncate">
              {system} SYSTEM
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
           {sites.some(s => s.requiresHe3) && (
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[8px] font-black py-0.5 px-2 rounded tracking-tighter uppercase whitespace-nowrap animate-pulse">
              Fuel Required
            </div>
          )}
          {isAssemblyPlanet && (
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[8px] font-black py-0.5 px-2 rounded tracking-tighter uppercase whitespace-nowrap">
              Industrial Hub
            </div>
          )}
        </div>
      </div>

      {/* Optimized Site Modules */}
      <div className="space-y-3 relative">
        {sites.map((site, sIdx) => {
          const hasManufacturedItems = (site.manufacturedItems?.length ?? 0) > 0;
          const hasFinalAssemblyItems = (site.finalAssemblyItems?.length ?? 0) > 0;

          return (
            <div key={sIdx} className={`rounded-lg border border-white/5 overflow-hidden flex flex-col ${site.isAssemblyHub ? 'bg-amber-500/5' : 'bg-slate-900/30'}`}>
              
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                      site.isAssemblyHub ? 'bg-amber-500 text-slate-950' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {String.fromCharCode(65 + sIdx)}
                    </div>
                    <h4 className="text-[10px] font-black text-white uppercase">
                      Outpost {String.fromCharCode(65 + sIdx)}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[9px] font-bold ${site.links.length >= 6 ? 'text-red-500 animate-pulse' : 'text-sky-400/60'}`}>
                      {site.links.length}/6 SLOTS
                    </span>
                  </div>
                </div>

                {/* Manufacturing Tasks */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {site.resourcesFound.length > 0 && <h5 className="text-xs font-bold w-full">Extracted</h5>}
                  {site.resourcesFound.map((item, idx) => (
                    <div key={`res-${idx}`} className="text-[8px] font-black text-sky-400 uppercase flex items-center gap-1 bg-sky-500/5 px-1.5 py-0.5 rounded border border-sky-500/20">
                      <span className="w-1 h-1 bg-sky-500 rounded-sm"></span> {item}
                    </div>
                  ))}
                  {(hasManufacturedItems || hasFinalAssemblyItems) && <div className="w-full mt-2" />}
                  {(hasManufacturedItems || hasFinalAssemblyItems) && <h5 className="text-xs font-bold w-full">Manufactured</h5>}
                  {site.finalAssemblyItems?.map((item, idx) => (
                    <div key={`fin-${idx}`} className="text-[8px] font-black text-amber-400 uppercase flex items-center gap-1 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <span className="w-1 h-1 bg-amber-500 rounded-sm"></span> {item}
                    </div>
                  ))}
                  {site.manufacturedItems?.map((item, idx) => (
                    <div key={`man-${idx}`} className="text-[8px] font-black text-sky-400 uppercase flex items-center gap-1 bg-sky-500/5 px-1.5 py-0.5 rounded border border-sky-500/20">
                      <span className="w-1 h-1 bg-sky-500 rounded-sm"></span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics Grid with Bandwidth Indicators */}
              <div className="p-2 grid grid-cols-1 gap-1 max-h-[160px] overflow-y-auto custom-scrollbar bg-black/20">
                {site.links.length > 0 ? (
                  site.links.map((link, lIdx) => {
                    const isSaturated = link.cargo.length >= 3;
                    const isOverloaded = link.cargo.length > 3;
                    return (
                      <div key={lIdx} className={`rounded p-1.5 border border-white/5 flex flex-col gap-0.5 bg-slate-950/50 transition-colors ${isOverloaded ? 'border-red-500/30' : ''}`}>
                        <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-tighter">
                          <div className="flex gap-1.5 items-center">
                             <span className={link.direction === 'Incoming' ? 'text-emerald-400' : 'text-sky-400'}>
                                {link.direction === 'Incoming' ? '← RECEIVING' : '→ SENDING'}
                              </span>
                            <span className={`px-1 rounded-sm border ${
                              isOverloaded ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                              isSaturated ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 
                              'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            }`}>
                              {isOverloaded ? 'OVERLOAD' : 'LOAD'}: {link.cargo.length}/3
                            </span>
                          </div>
                          <span className="opacity-30">{link.type}</span>
                        </div>
                        
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[9px] font-bold truncate shrink-0 max-w-[100px] text-white">
                            {link.target}
                          </span>
                          <div className="flex gap-1.5 text-[8px] truncate overflow-hidden text-slate-400 font-mono italic">
                             {link.cargo.join(' + ')}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="text-[8px] text-sky-400 uppercase font-black tracking-[0.2em] mb-1">Direct-to-Fabricator</div>
                    <div className="text-[7px] text-slate-600 uppercase font-bold italic">Requirements sourced locally at site</div>
                  </div>
                )}
              </div>
              {site.notes && <div className="p-2 text-[8px] bg-red-500/10 text-red-400 font-bold uppercase tracking-tight text-center">{site.notes}</div>}
            </div>
          )
        })}
      </div>
    </div>
  );
};
