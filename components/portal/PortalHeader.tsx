import { ReactNode } from 'react';

interface PortalHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PortalHeader({ title, subtitle, actions }: PortalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-text-1">{title}</h1>
        {subtitle && <p className="text-sm text-text-3 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
