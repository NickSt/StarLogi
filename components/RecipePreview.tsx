
import React from 'react';
import { CONSTRUCTIBLE_ITEMS } from '../data/gameData';

interface RecipePreviewProps {
  itemName: string;
  compact?: boolean;
}

const TreeNode: React.FC<{ name: string; amount: string; depth: number; isLast: boolean }> = ({ name, amount, depth, isLast }) => {
  const item = CONSTRUCTIBLE_ITEMS.find(i => i.name.toLowerCase() === name.toLowerCase());
  const hasChildren = !!item;

  return (
    <div className="relative ml-4 mt-2">
      {/* Connector lines */}
      <div className="tree-line-v" style={{ display: isLast && !hasChildren ? 'none' : 'block' }}></div>
      <div className="tree-line-h"></div>
      
      <div className="flex justify-between items-center text-[10px]">
        <span className={`${hasChildren ? 'text-sky-300 font-bold' : 'text-slate-400 font-medium'}`}>
          {name}
        </span>
        <span className="text-sky-500/80 font-mono ml-2">x{amount}</span>
      </div>

      {hasChildren && (
        <div className="mt-1">
          {item.requirements.map((req, idx) => (
            <TreeNode 
              key={`${req.name}-${idx}`}
              name={req.name} 
              amount={req.amount} 
              depth={depth + 1}
              isLast={idx === item.requirements.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const RecipePreview: React.FC<RecipePreviewProps> = ({ itemName, compact }) => {
  const item = CONSTRUCTIBLE_ITEMS.find(i => i.name === itemName);
  if (!item) return <span className="text-[9px] text-slate-600 font-mono italic uppercase">Raw Resource</span>;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {item.requirements.slice(0, 3).map(req => (
          <span key={req.name} className="text-[8px] bg-slate-900/60 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
            {req.name}
          </span>
        ))}
        {item.requirements.length > 3 && (
          <span className="text-[8px] text-slate-600 font-bold px-1">+ {item.requirements.length - 3} more</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <h4 className="text-[9px] font-black text-sky-500 uppercase tracking-[0.15em]">Recursive Blueprint</h4>
      </div>
      <div className="pl-2 pb-2">
        {item.requirements.map((req, idx) => (
          <TreeNode 
            key={`${req.name}-${idx}`}
            name={req.name} 
            amount={req.amount} 
            depth={0}
            isLast={idx === item.requirements.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
