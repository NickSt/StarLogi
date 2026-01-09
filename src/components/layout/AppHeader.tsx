import React from 'react';

interface AppHeaderProps {
    currentView: 'home' | 'optimizer' | 'database';
    setCurrentView: (view: 'home' | 'optimizer' | 'database') => void;
    useBidirectional: boolean;
    setUseBidirectional: (val: boolean) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    currentView,
    setCurrentView,
    useBidirectional,
    setUseBidirectional
}) => (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-xl">S</span>
            </div>
            <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    StarLogi <span className="text-sky-500 italic">Network</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Galactic Logistics Optimizer</p>
            </div>
        </div>

        <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm shadow-2xl">
            <button
                onClick={() => setCurrentView('optimizer')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${currentView !== 'database' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
            >
                Optimizer
            </button>
            <button
                onClick={() => setCurrentView('database')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${currentView === 'database' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
            >
                Database
            </button>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="text-[9px] font-black text-slate-500 uppercase">Link Efficiency</span>
            <button
                onClick={() => setUseBidirectional(!useBidirectional)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${useBidirectional ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                title="Toggle Bidirectional Links"
            >
                <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-200 ${useBidirectional ? 'left-6' : 'left-1'
                        }`}
                />
            </button>
        </div>
    </nav>
);
