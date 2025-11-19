import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { DASHBOARD_NAVIGATION } from '@/constants/navigation';
import type { DashboardLayoutProps } from '@/types/componentTypes';

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isInsideProject = /^\/dashboard\/projects\/[^/]+/.test(location.pathname);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex flex-1 relative">
        {!isInsideProject && (
          <>
            {/* Mobile Menu Button */}
            <div className="md:hidden absolute top-4 left-4 z-40">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background p-4 transition-transform duration-300 ease-in-out md:hidden",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              <div className="flex items-center justify-between mb-6 px-2">
                <span className="font-bold text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-1">
                {DASHBOARD_NAVIGATION.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
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

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r bg-muted/10 p-4">
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
          </>
        )}

        <main className="flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
