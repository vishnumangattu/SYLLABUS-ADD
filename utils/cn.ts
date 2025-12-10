import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getCategoryColor = (category) => {
  switch (category) {
    case 'frontend': return 'border-orange-500 shadow-orange-500/50 bg-orange-500/10 text-orange-200'; // Primary
    case 'backend': return 'border-sky-500 shadow-sky-500/50 bg-sky-500/10 text-sky-200'; // Secondary
    case 'python': return 'border-yellow-500 shadow-yellow-500/50 bg-yellow-500/10 text-yellow-200';
    case 'devops': return 'border-indigo-500 shadow-indigo-500/50 bg-indigo-500/10 text-indigo-200';
    case 'db': return 'border-emerald-500 shadow-emerald-500/50 bg-emerald-500/10 text-emerald-200';
    default: return 'border-slate-500 shadow-slate-500/50 bg-slate-500/10 text-slate-200';
  }
};

export const getGlowColor = (category) => {
   switch (category) {
    case 'frontend': return '#f97316';
    case 'backend': return '#0ea5e9';
    case 'python': return '#eab308';
    case 'devops': return '#6366f1';
    case 'db': return '#10b981';
    default: return '#64748b';
  }
}