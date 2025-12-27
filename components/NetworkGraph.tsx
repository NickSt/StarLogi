
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
  radius: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ analysis }) => {
  const width = 800;
  
  const getRadius = (p: PlanetStrategy) => {
    if (p.isAssemblyHub) return 20;
    if (p.manufacturedItems && p.manufacturedItems.length > 0) return 16;
    return 12;
  };

  const { nodes, visualLinks, dynamicHeight } = useMemo(() => {
    const planets = analysis.recommendedPlanets;
    const tierMap: Record<string, number> = {};
    const tierCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
    
    planets.forEach(p => {
      let tier = 2;
      if (p.isAssemblyHub) tier = 0;
      else if (p.manufacturedItems && p.manufacturedItems.length > 0) tier = 1;
      tierMap[p.planetName] = tier;
      tierCounts[tier]++;
    });

    const maxDensity = Math.max(...Object.values(tierCounts));
    const calculatedHeight = Math.max(500, maxDensity * 120);

    const planetNodes: Node[] = planets.map((p) => {
      const tier = tierMap[p.planetName];
      const tierNodes = planets.filter(pl => tierMap[pl.planetName] === tier);
      const indexInTier = tierNodes.indexOf(p);
      
      const x = 150 + (tier * 250);
      const y = (calculatedHeight / (tierNodes.length + 1)) * (indexInTier + 1);
      
      return { id: p.planetName, x, y, planet: p, tier, radius: getRadius(p) };
    });

    const links: any[] = [];
    planetNodes.forEach(sourceNode => {
      sourceNode.planet.links.forEach(link => {
        const targetNode = planetNodes.find(n => n.id === link.target);
        if (targetNode && (link.direction === 'Outgoing' || link.direction === 'Bidirectional')) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const angle = Math.atan2(dy, dx);

          links.push({
            source: sourceNode,
            target: targetNode,
            type: link.type,
            cargo: link.cargo,
            isBidirectional: link.direction === 'Bidirectional'
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
          Topology Visualizer
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Local Relay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inter-System Carrier</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-y-auto custom-scrollbar" style={{ maxHeight: '600px' }}>
        <svg viewBox={`0 0 ${width} ${dynamicHeight}`} className="w-full h-auto bg-slate-950/30 rounded-lg" style={{ minHeight: '500px' }}>
          <defs>
            <marker id="arrowhead-local" markerWidth="6" markerHeight="6" refX="18" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
            </marker>
            <marker id="arrowhead-inter" markerWidth="6" markerHeight="6" refX="18" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>

          {visualLinks.map((link, i) => {
            const isInter = link.type === 'Inter-System';
            const color = isInter ? '#f59e0b' : '#0ea5e9';
            const isBidirectional = link.isBidirectional;
            
            return (
              <g key={`link-${i}`}>
                <path
                  d={`M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={isInter ? "2" : "1"}
                  strokeOpacity={isInter ? "0.6" : "0.3"}
                  markerEnd={`url(#arrowhead-${isInter ? 'inter' : 'local'})`}
                  strokeDasharray={isInter ? "4,4" : "none"}
                />
                {isBidirectional && (
                  <path
                    d={`M${link.target.x},${link.target.y} L${link.source.x},${link.source.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    markerEnd={`url(#arrowhead-${isInter ? 'inter' : 'local'})`}
                  />
                )}
              </g>
            );
          })}

          {nodes.map((node) => {
            const isHub = node.planet.isAssemblyHub;
            const isFactory = node.planet.manufacturedItems && node.planet.manufacturedItems.length > 0;
            const needsFuel = node.planet.requiresHe3;
            
            return (
              <g key={node.id} className="cursor-pointer group">
                <circle cx={node.x} cy={node.y} r={node.radius + 4} fill="transparent" className={isHub ? "stroke-amber-500/10" : isFactory ? "stroke-sky-500/10" : "stroke-slate-500/5"} strokeWidth="4" />
                <circle cx={node.x} cy={node.y} r={node.radius} fill={isHub ? "#f59e0b" : isFactory ? "#0ea5e9" : "#1e293b"} stroke={isHub ? "#fbbf24" : isFactory ? "#38bdf8" : "#475569"} strokeWidth="2" />
                
                {needsFuel && <circle cx={node.x + 8} cy={node.y - 8} r="4" fill="#fbbf24" className="animate-pulse" />}

                <text x={node.x} y={node.y + 35} textAnchor="middle" fill="white" fontSize="9" className="font-black uppercase tracking-tight" style={{ paintOrder: 'stroke', stroke: '#020617', strokeWidth: '3px' }}>{node.planet.planetName}</text>
                <text x={node.x} y={node.y + 45} textAnchor="middle" fill="#64748b" fontSize="7" className="font-mono">{node.planet.system}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-4 text-[9px] text-slate-500 font-mono text-center uppercase tracking-widest italic opacity-50">Daisy-Chained paths reduce terminal congestion at assembly nodes.</p>
    </div>
  );
};
