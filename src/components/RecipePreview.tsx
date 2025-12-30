
import React from 'react';
import { ItemData } from '@/types';

interface RecipePreviewProps {
  itemName: string;
  allItems: ItemData[];
  compact?: boolean;
}

const TreeNode: React.FC<{ name: string; amount: string; depth: number; isLast: boolean; allItems: ItemData[] }> = ({ name, amount, depth, isLast, allItems }) => {
  const item = allItems.find(i => i.name.toLowerCase() === name.toLowerCase());
  const hasChildren = !!item;

  return (
    <div className="relative ml-4 mt-2">
      {/* Visual connector lines */}
      {!isLast && <div className="tree-line-v"></div>}
      {isLast && hasChildren && <div className="tree-line-v h-[12px] !bottom-auto"></div>}
      <div className="tree-line-h"></div>

      <div className="flex justify-between items-center text-[10px] group/node">
        <span className={`${hasChildren ? 'text-sky-300 font-bold' : 'text-slate-400 font-medium'} truncate`}>
          {name}
        </span>
        <span className="text-sky-500/60 font-mono ml-2 shrink-0">x{amount}</span>
      </div>

      {hasChildren && (
        <div className="mt-1 animate-in slide-in-from-left-2 duration-300">
          {item.requirements.map((req, idx) => (
            <TreeNode
              key={`${req.name}-${idx}`}
              name={req.name}
              amount={req.amount}
              depth={depth + 1}
              isLast={idx === item.requirements.length - 1}
              allItems={allItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const RecipePreview: React.FC<RecipePreviewProps> = ({ itemName, allItems, compact }) => {
  const item = allItems.find(i => i.name === itemName);
  if (!item) return <span className="text-[9px] text-slate-600 font-mono italic uppercase">Resource</span>;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {item.requirements.slice(0, 3).map(req => (
          <span key={req.name} className="text-[8px] bg-slate-900/60 text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono">
            {req.name}
          </span>
        ))}
        {item.requirements.length > 3 && (
          <span className="text-[8px] text-slate-600 font-bold px-1">+ {item.requirements.length - 3}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <h4 className="text-[9px] font-black text-sky-500 uppercase tracking-[0.2em]">Build Tree</h4>
      </div>
      <div className="pl-1 pb-1">
        {item.requirements.map((req, idx) => (
          <TreeNode
            key={`${req.name}-${idx}`}
            name={req.name}
            amount={req.amount}
            depth={0}
            isLast={idx === item.requirements.length - 1}
            allItems={allItems}
          />
        ))}
      </div>
    </div>
  );
};
