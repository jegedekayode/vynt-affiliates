'use client';

import { useEffect } from 'react';

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide sidebar and reset main margin when on leaderboard
  useEffect(() => {
    const sidebar = document.querySelector('aside');
    const main = document.querySelector('main');
    if (sidebar) sidebar.style.display = 'none';
    if (main) {
      main.style.marginLeft = '0';
      main.style.padding = '0';
    }
    return () => {
      if (sidebar) sidebar.style.display = '';
      if (main) {
        main.style.marginLeft = '';
        main.style.padding = '';
      }
    };
  }, []);

  return <>{children}</>;
}
