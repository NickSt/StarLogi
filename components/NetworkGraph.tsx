
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
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ analysis }) => {
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 180;

  const nodes = useMemo(() => {
    const planetNodes: Node[] = [];
    const planets = analysis.recommendedPlanets;
    const count = planets.length;

    planets.forEach((planet, i) => {
      let x, y;
      if (planet.isAssemblyHub) {
        x = centerX;
        y = centerY;
      } else {
        // Position others in a circle around the hub
        const angle = (i / (count - (planets.some(p => p.isAssemblyHub) ? 1 : 0))) * 2 * Math.PI;
        // Offset angle slightly if the first one is the hub to avoid overlap issues
        const finalAngle = planets[0].isAssemblyHub ? angle + (Math.PI / 4) : angle;
        
        x = centerX + radius * Math.cos(finalAngle);
        y = centerY + radius * Math.sin(finalAngle);
      }
      planetNodes.push({ id: planet.planetName, x, y, planet });
    });

    return planetNodes;
  }, [analysis, centerX, centerY, radius]);

  const links = useMemo(() => {
    const visualLinks: any[] = [];
    nodes.forEach(sourceNode => {
      sourceNode.planet.links.forEach(link => {
        const targetNode = nodes.find(n => n.id === link.target);
        if (targetNode && link.direction === 'Outgoing') {
          visualLinks.push({
            source: sourceNode,
            target: targetNode,
            type: link.type,
            cargo: link.cargo
          });
        }
      });
    });
    return visualLinks;
  }, [nodes]);

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800 overflow-hidden bg-slate-950/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center">
          <svg className="w-5 h-5 mr-2 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V7.618a2 2 0 011.553-1.944L9 4m0 16l9.447-4.724a2 2 0 001.553-1.944V7.618a2 2 0 00-1.553-1.944L18 4m-9 16V4" />
          </svg>
          System Topology
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

      <div className="relative aspect-[16/10] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <marker id="arrowhead-local" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
            </marker>
            <marker id="arrowhead-inter" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Draw Links */}
          {links.map((link, i) => {
            const isInter = link.type === 'Inter-System';
            const color = isInter ? '#f59e0b' : '#0ea5e9';
            return (
              <g key={`link-${i}`}>
                <line
                  x1={link.source.x}
                  y1={link.source.y}
                  x2={link.target.x}
                  y2={link.target.y}
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity="0.6"
                  markerEnd={`url(#arrowhead-${isInter ? 'inter' : 'local'})`}
                  className="transition-all duration-500"
                />
                <text
                  x={(link.source.x + link.target.x) / 2}
                  y={(link.source.y + link.target.y) / 2 - 10}
                  fill={color}
                  fontSize="8"
                  textAnchor="middle"
                  className="font-mono font-bold uppercase tracking-tighter opacity-80"
                >
                  {link.cargo.slice(0, 2).join(', ')}{link.cargo.length > 2 ? '...' : ''}
                </text>
              </g>
            );
          })}

          {/* Draw Nodes */}
          {nodes.map((node) => {
            const isHub = node.planet.isAssemblyHub;
            const isVendor = node.planet.planetName.includes("Trade Authority");
            
            return (
              <g key={node.id} className="cursor-pointer group">
                {/* Outer Glow for Hub */}
                {isHub && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill="rgba(245, 158, 11, 0.15)"
                    filter="url(#glow)"
                  />
                )}
                
                {/* Main Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHub ? "20" : "16"}
                  fill={isHub ? "#f59e0b" : isVendor ? "#475569" : "#0f172a"}
                  stroke={isHub ? "#fbbf24" : isVendor ? "#64748b" : "#38bdf8"}
                  strokeWidth="2"
                  className="group-hover:stroke-white transition-all"
                />

                {/* Planet Label */}
                <text
                  x={node.x}
                  y={node.y + (isHub ? 40 : 35)}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  className="font-black uppercase tracking-tighter"
                >
                  {node.planet.planetName}
                </text>

                {/* System Label */}
                <text
                  x={node.x}
                  y={node.y + (isHub ? 52 : 47)}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  className="font-mono uppercase"
                >
                  {node.planet.system}
                </text>

                {/* Resource Icons (Small Dots) */}
                <g transform={`translate(${node.x - 15}, ${node.y - 30})`}>
                  {node.planet.resourcesFound.slice(0, 3).map((_, idx) => (
                    <circle key={idx} cx={idx * 15} cy="0" r="3" fill="#38bdf8" />
                  ))}
                  {node.planet.manufacturedItems && node.planet.manufacturedItems.length > 0 && (
                    <rect x="0" y="5" width="30" height="4" fill="#10b981" rx="2" />
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 p-3 bg-slate-900/80 rounded border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[9px] text-white font-black uppercase">Assembly Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            <span className="text-[9px] text-white font-black uppercase">Extraction Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-1 bg-emerald-500 rounded-sm"></div>
            <span className="text-[9px] text-white font-black uppercase">Factory Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
