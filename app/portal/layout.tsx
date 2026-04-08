// TODO: Add auth check — redirect to /login if not authenticated
// TODO: Fetch affiliate data for logged-in user from GET /api/v2/me/affiliate

import PortalLayoutClient from '@/components/portal/PortalLayoutClient';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayoutClient>{children}</PortalLayoutClient>;
}
