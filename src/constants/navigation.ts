import { LayoutDashboard, Users, Settings } from 'lucide-react';
import type { NavigationItem } from '@/types/navigation';

export const DASHBOARD_NAVIGATION: NavigationItem[] = [
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: LayoutDashboard,
  },
  {
    name: 'Team Members',
    href: '/dashboard/team/members',
    icon: Users,
  },
  {
    name: 'Team Settings',
    href: '/dashboard/team/settings',
    icon: Settings,
  },
];
