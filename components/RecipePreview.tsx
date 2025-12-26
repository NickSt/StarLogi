
import React, { useMemo } from 'react';
import { CONSTRUCTIBLE_ITEMS, ItemData } from '../data/gameData';

interface RecipePreviewProps {
  itemName: string;
}

interface TreeNode {
  name: string;
  amount: string;
  children: TreeNode[];
  isRaw: boolean;
}

export const RecipePreview: React.FC<RecipePreviewProps> = ({ itemName }) => {
  const buildTree = (name: string, amount: string = "1"): TreeNode => {
    const item = CONSTRUCTIBLE_ITEMS.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!item) {
      return { name, amount, children: [], isRaw: true };
    }
    return {
      name,
      amount,
      isRaw: false,
      children: item.requirements.map(req => buildTree(req.name, req.amount))
    };
  };

  const getRawTotals = (node: TreeNode, multiplier: number = 1): Record<string, number> => {
    const totals: Record<string, number> = {};
    const currentAmount = parseInt(node.amount) * multiplier;
    
    if (node.isRaw) {
      totals[node.name] = currentAmount;
    } else {
      node.children.forEach(child => {
        const subTotals = getRawTotals(child, currentAmount);
        Object.entries(subTotals).forEach(([name, count]) => {
          totals[name] = (totals[name] || 0) + count;
        });
      });
    }
    return totals;
  };

  const tree = useMemo(() => buildTree(itemName), [itemName]);
  const rawTotals = useMemo(() => getRawTotals(tree), [tree]);

  const renderNode = (node: TreeNode, depth: number = 0) => (
    <div key={`${node.name}-${depth}`} className="flex flex-col ml-4 relative">
      <div className="flex items-center group/node">
        {depth > 0 && (
          <div className="absolute -left-3 top-1/2 w-3 h-[1px] bg-slate-700"></div>
        )}
        <div className={`text-[10px] font-mono py-0.5 px-2 rounded border mb-1 flex justify-between items-center min-w-[140px] transition-colors ${
          node.isRaw 
            ? 'bg-slate-900/80 border-slate-700 text-slate-400' 
            : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
        }`}>
          <span className="truncate max-w-[100px]">{node.name}</span>
          <span className="ml-2 font-black">x{node.amount}</span>
        </div>
      </div>
      {node.children.length > 0 && (
        <div className="border-l border-slate-700 ml-1">
          {node.children.map(child => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-950/95 border border-sky-500/40 rounded-lg p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl w-[320px] animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
        <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Blueprint Specification</h4>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-sky-500 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-sky-500/50 rounded-full"></div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">Recipe Hierarchy</p>
        <div className="-ml-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {renderNode(tree)}
        </div>
      </div>

      <div>
        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">Consolidated Raw Materials</p>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(rawTotals).map(([name, amount]) => (
            <div key={name} className="flex justify-between items-center text-[9px] bg-slate-900/50 p-1.5 rounded border border-slate-800/50">
              <span className="text-slate-300 truncate mr-1">{name}</span>
              <span className="text-sky-400 font-black">x{amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="text-[8px] text-slate-600 font-mono italic">SCANNING COMPLETED // NAV-COMPUTER SYNC ACTIVE</div>
      </div>
    </div>
  );
};
