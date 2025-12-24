
import React from 'react';

interface ResourceBadgeProps {
  name: string;
  amount?: string;
}

export const ResourceBadge: React.FC<ResourceBadgeProps> = ({ name, amount }) => {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs font-medium text-slate-300 mr-2 mb-2">
      <span className="w-2 h-2 rounded-full bg-sky-400 mr-2"></span>
      {name} {amount && <span className="text-sky-400 ml-1">x{amount}</span>}
    </div>
  );
};
