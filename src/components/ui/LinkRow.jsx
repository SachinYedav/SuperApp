import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function LinkRow({ label, desc, icon: Icon, to, href, isLast, className }) {
  const content = (
    <>
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</h4>
          {desc && <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>}
        </div>
      </div>
      
      {/* Show External Icon if it's an external link */}
      {href && <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />}
    </>
  );

  const baseClasses = cn(
    "flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer w-full text-left",
    !isLast && "border-b border-slate-100 dark:border-slate-800", // Separator line logic
    className
  );

  if (to) {
    return <Link to={to} className={baseClasses}>{content}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
      {content}
    </a>
  );
}