import React from 'react';
import { ConstructionAnalysis } from '@/types';
import { ResourceBadge } from '../ResourceBadge';

interface OptimizerReportProps {
    analysis: ConstructionAnalysis;
    handleExport: () => void;
}

export const OptimizerReport: React.FC<OptimizerReportProps> = ({
    analysis,
    handleExport
}) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="lg:col-span-2 glass rounded-3xl border-white/5 p-8 flex flex-col justify-between bg-gradient-to-br from-slate-900/60 to-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Intelligence Report</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        Status: <span className="text-emerald-500 animate-pulse">Optimal Configuration Found</span>
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                    Export Plan
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Efficiency Score', value: `${analysis.efficiencyScore}%`, color: 'text-sky-500' },
                    { label: 'Outpost Count', value: analysis.recommendedPlanets.length, color: 'text-white' },
                    { label: 'Route Integrity', value: 'Nominal', color: 'text-emerald-500' },
                    { label: 'Protocol', value: 'V8-LOCAL', color: 'text-slate-500' }
                ].map((stat) => (
                    <div key={stat.label} className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="glass rounded-3xl border-white/5 p-8 bg-black/40">
            <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-6">Required Extraction</h4>
            <div className="flex flex-wrap gap-2">
                {analysis.totalResourcesRequired.map((res) => (
                    <ResourceBadge key={res.name} name={res.name} amount={res.amount.toString()} />
                ))}
            </div>
            <p className="text-[9px] text-slate-500 mt-6 font-bold leading-relaxed">
                Total of {analysis.totalResourcesRequired.length} unique resources required across all manufacturing sites.
            </p>
        </div>
    </div>
);
