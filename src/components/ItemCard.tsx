import React from 'react';
import { ItemData } from '@/types';
import { RecipePreview } from './RecipePreview';

interface ItemCardProps {
    item: ItemData;
    isSelected: boolean;
    tier: number;
    allItems: ItemData[];
    onToggle: (item: ItemData) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
    item,
    isSelected,
    tier,
    allItems,
    onToggle
}) => {
    return (
        <div
            onClick={() => onToggle(item)}
            className={`glass p-6 rounded-2xl cursor-pointer relative group min-h-[160px] border flex flex-col item-card-hover transition-all duration-300 ${isSelected
                ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)]'
                : 'border-white/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/20'
                }`}
        >
            <div className="flex justify-between items-start mb-1">
                <h3 className="font-black uppercase tracking-tight text-sm text-slate-100 group-hover:text-white transition-colors">{item.name}</h3>
                <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded border border-white/5 bg-slate-950/50 ${tier >= 3 ? 'text-amber-400 border-amber-500/20' :
                    tier === 2 ? 'text-sky-400 border-sky-500/20' : 'text-slate-400'
                    }`}>
                    TIER {tier}
                </span>
            </div>

            <div className="mt-auto">
                <div className="flex flex-wrap gap-1">
                    {item.requirements.slice(0, 4).map(req => (
                        <span key={req.name} className="text-[8px] bg-slate-900/60 text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                            {req.name}
                        </span>
                    ))}
                    {item.requirements.length > 4 && (
                        <span className="text-[8px] text-slate-600 font-bold px-1">+{item.requirements.length - 4}</span>
                    )}
                </div>
            </div>

            {/* Hover Expansion Tree */}
            <div className="grid transition-all duration-500 ease-in-out grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-4">
                <div className="overflow-hidden">
                    <div className="glass p-4 rounded-xl border-sky-500/30 bg-slate-950/90 shadow-2xl backdrop-blur-md">
                        <RecipePreview itemName={item.name} allItems={allItems} />
                    </div>
                </div>
            </div>
        </div>
    );
};
