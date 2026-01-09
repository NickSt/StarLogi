import React from 'react';
import { ItemData } from '@/types';
import { ResourceBadge } from '../ResourceBadge';
import { RecipePreview } from '../RecipePreview';

interface SelectionControlsProps {
    itemFilter: string;
    setItemFilter: (val: string) => void;
    selectedItems: ItemData[];
    toggleItem: (item: ItemData) => void;
    clearSelected: () => void;
    handleOptimize: () => void;
    loading: boolean;
    allItems: ItemData[];
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
    itemFilter,
    setItemFilter,
    selectedItems,
    toggleItem,
    clearSelected,
    handleOptimize,
    loading,
    allItems
}) => (
    <div className="glass p-8 rounded-3xl border-white/5 bg-slate-900/20 mb-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full space-y-4">
                <h4 className="text-xs font-black text-sky-500 uppercase tracking-widest pl-1">Configuration Utility</h4>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Filter blueprints..."
                        value={itemFilter}
                        onChange={(e) => setItemFilter(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium placeholder:text-slate-600 group-hover:border-sky-500/30"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-900 border border-white/5 px-2 py-1 rounded-md">
                        ALPHA-V1
                    </div>
                </div>

                {selectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-left duration-300">
                        {selectedItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group/item"
                            >
                                <span
                                    onClick={() => toggleItem(item)}
                                    className="cursor-pointer"
                                >
                                    <ResourceBadge name={item.name} />
                                </span>
                                <div className="grid transition-all duration-500 ease-in-out grid-rows-[0fr] group-hover/item:grid-rows-[1fr] opacity-0 group-hover/item:opacity-100 min-w-[200px]">
                                    <div className="overflow-hidden">
                                        <div className="glass p-4 rounded-xl border-sky-500/30 bg-slate-900 shadow-2xl mt-2 mb-4">
                                            <RecipePreview itemName={item.name} allItems={allItems} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={clearSelected}
                            className="text-[9px] text-slate-500 hover:text-red-400 font-black uppercase px-2 transition-colors self-center"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handleOptimize}
                disabled={loading || selectedItems.length === 0}
                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${loading || selectedItems.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.15)] overflow-hidden'
                    }`}
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            ANALYZING
                        </>
                    ) : (
                        'GENERATE ROUTES'
                    )}
                </span>
                {!loading && selectedItems.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
            </button>
        </div>
    </div>
);
