import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';
import { DASHBOARD_NAVIGATION } from '@/constants/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  
  const isInsideProject = /^\/dashboard\/projects\/[^/]+/.test(location.pathname);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isInsideProject && (
          <aside className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)] p-4">
            <nav className="space-y-1 px-3 py-4">
              {DASHBOARD_NAVIGATION.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <main className="flex-1">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
