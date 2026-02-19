import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ToolCard({ tool }) {
  return (
    <Link 
      to={tool.path}
      className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-start gap-4"
    >
      <div className={`p-4 rounded-xl ${tool.lightColor} group-hover:scale-110 transition-transform`}>
        <tool.icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
          {tool.desc}
        </p>
        
        <span className="text-xs font-bold text-blue-500 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity md:-translate-x-2 md:group-hover:translate-x-0">
          Open Tool <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}