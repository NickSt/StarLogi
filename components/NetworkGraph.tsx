
import React, { useMemo } from 'react';
import { ConstructionAnalysis, PlanetStrategy } from '../types';

interface NetworkGraphProps {
  analysis: ConstructionAnalysis;
}

interface Node {
  id: string;
  x: number;
  y: number;
  planet: PlanetStrategy;
  tier: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ analysis }) => {
  const width = 800;
  
  // Calculate dynamic height and tiers
  const { nodes, visualLinks, dynamicHeight } = useMemo(() => {
    const planets = analysis.recommendedPlanets;
    
    // Determine tiers for layout
    const tierMap: Record<string, number> = {};
    const tierCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
    
    planets.forEach(p => {
      let tier = 2;
      if (p.isAssemblyHub) tier = 0;
      else if (p.manufacturedItems && p.manufacturedItems.length > 0) tier = 1;
      
      tierMap[p.planetName] = tier;
      tierCounts[tier]++;
    });

    // Calculate height based on densest tier (min 500px)
    const maxDensity = Math.max(...Object.values(tierCounts));
    const calculatedHeight = Math.max(500, maxDensity * 100);

    const planetNodes: Node[] = planets.map((p) => {
      const tier = tierMap[p.planetName];
      const tierNodes = planets.filter(pl => tierMap[pl.planetName] === tier);
      const indexInTier = tierNodes.indexOf(p);
      
      // Vertical stratification layout
      // Use 800 - x to flow from left (extractors) to right (assembly)
      const baseTierX = 150 + (tier * 250);
      
      // Stagger nodes in the same tier column to prevent label overlap
      const xOffset = indexInTier % 2 === 0 ? -30 : 30;
      const x = 800 - baseTierX + (tier === 0 ? 0 : xOffset);
      
      const y = (calculatedHeight / (tierNodes.length + 1)) * (indexInTier + 1);
      
      return { id: p.planetName, x, y, planet: p, tier };
    });

    const links: any[] = [];
    planetNodes.forEach(sourceNode => {
      sourceNode.planet.links.forEach(link => {
        const targetNode = planetNodes.find(n => n.id === link.target);
        if (targetNode && link.direction === 'Outgoing') {
          links.push({
            source: sourceNode,
            target: targetNode,
            type: link.type,
            cargo: link.cargo
          });
        }
      });
    });

    return { nodes: planetNodes, visualLinks: links, dynamicHeight: calculatedHeight };
  }, [analysis]);

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800 overflow-hidden bg-slate-950/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center">
          <svg className="w-5 h-5 mr-2 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V7.618a2 2 0 011.553-1.944L9 4m0 16l9.447-4.724a2 2 0 001.553-1.944V7.618a2 2 0 00-1.553-1.944L18 4m-9 16V4" />
          </svg>
          Supply Chain Topology
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-sky-500"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Local</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-amber-500"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Inter-System</span>
          </div>
        </div>
      </div>

      <div 
        className="relative overflow-y-auto custom-scrollbar" 
        style={{ maxHeight: '600px' }}
      >
        <svg 
          viewBox={`0 0 ${width} ${dynamicHeight}`} 
          className="w-full h-auto bg-slate-950/20"
          style={{ minHeight: '500px' }}
        >
          <defs>
            <marker id="arrowhead-local" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
            </marker>
            <marker id="arrowhead-inter" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Draw Links First (Background) */}
          {visualLinks.map((link, i) => {
            const isInter = link.type === 'Inter-System';
            const color = isInter ? '#f59e0b' : '#0ea5e9';
            
            const dx = link.target.x - link.source.x;
            const dy = link.target.y - link.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            
            return (
              <g key={`link-${i}`}>
                <path
                  d={`M${link.source.x},${link.source.y}A${dr},${dr} 0 0,1 ${link.target.x},${link.target.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  markerEnd={`url(#arrowhead-${isInter ? 'inter' : 'local'})`}
                  className="transition-all duration-500"
                />
              </g>
            );
          })}

          {/* Draw Nodes Second (Foreground) */}
          {nodes.map((node) => {
            const isHub = node.planet.isAssemblyHub;
            const isFactory = node.planet.manufacturedItems && node.planet.manufacturedItems.length > 0;
            
            return (
              <g key={node.id} className="cursor-pointer group">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHub ? "20" : isFactory ? "16" : "12"}
                  fill={isHub ? "#f59e0b" : isFactory ? "#0ea5e9" : "#1e293b"}
                  stroke={isHub ? "#fbbf24" : isFactory ? "#38bdf8" : "#475569"}
                  strokeWidth="2"
                  className="group-hover:stroke-white transition-all shadow-xl"
                />

                {/* Text Label with Halo for Readability */}
                <text
                  x={node.x}
                  y={node.y + (isHub ? 35 : 28)}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  className="font-black uppercase tracking-tighter select-none"
                  style={{ 
                    paintOrder: 'stroke',
                    stroke: 'rgba(2, 6, 23, 0.8)',
                    strokeWidth: '4px',
                    strokeLinejoin: 'round'
                  }}
                >
                  {node.planet.planetName}
                </text>
                
                {/* Secondary System Label */}
                <text
                  x={node.x}
                  y={node.y + (isHub ? 46 : 39)}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8"
                  className="font-mono font-bold uppercase select-none"
                  style={{ 
                    paintOrder: 'stroke',
                    stroke: 'rgba(2, 6, 23, 0.8)',
                    strokeWidth: '3px',
                    strokeLinejoin: 'round'
                  }}
                >
                  {node.planet.system}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Simplified Legend */}
        <div className="absolute top-0 right-0 p-3 bg-slate-900/80 rounded border border-white/5 backdrop-blur-sm text-[8px] font-mono text-slate-400 space-y-1">
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> COMMAND HUB</p>
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500"></span> FACTORY NODE</p>
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-700"></span> EXTRACTION</p>
        </div>
      </div>
      
      <p className="mt-4 text-[9px] text-slate-500 font-mono text-center uppercase tracking-widest italic">
        Topology auto-scaled for logistical density
      </p>
    </div>
  );
};
