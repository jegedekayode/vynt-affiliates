import { LucideIcon } from 'lucide-react';

interface ResourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ResourceCard({ icon: Icon, title, description }: ResourceCardProps) {
  return (
    <button
      type="button"
      className="group text-left w-full bg-white rounded-xl border border-border p-5 hover:border-vynt/40 hover:shadow-sm transition-all duration-150"
    >
      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-3 group-hover:bg-vynt-light transition-colors duration-150">
        <Icon size={20} strokeWidth={1.5} className="text-text-2 group-hover:text-vynt transition-colors duration-150" />
      </div>
      <p className="text-sm font-semibold text-text-1 mb-1">{title}</p>
      <p className="text-xs text-text-3 leading-relaxed">{description}</p>
    </button>
  );
}
