'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import PortalSidebar from './PortalSidebar';

export default function PortalLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/portal/login';

  useEffect(() => {
    // Hide the admin sidebar and reset the root main margin
    const adminSidebar = document.querySelector('body > aside') as HTMLElement | null;
    const adminMain = document.querySelector('body > main') as HTMLElement | null;
    if (adminSidebar) adminSidebar.style.display = 'none';
    if (adminMain) {
      adminMain.style.marginLeft = '0';
      adminMain.style.padding = '0';
    }
    return () => {
      if (adminSidebar) adminSidebar.style.display = '';
      if (adminMain) {
        adminMain.style.marginLeft = '';
        adminMain.style.padding = '';
      }
    };
  }, []);

  // Auth pages (login) render without the portal shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="portal-root fixed inset-0 z-50 flex overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <PortalSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-border bg-white shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-lg text-text-2 hover:bg-surface transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="ml-2 text-base font-bold text-text-1">VYNT</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
