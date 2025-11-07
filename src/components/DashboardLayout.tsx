import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Monitor, Upload, Settings, FileText, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Call Monitor', href: '/call-monitor', icon: Monitor },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Configuration', href: '/configuration', icon: Settings },
    { name: 'Audit Log', href: '/audit-log', icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden glass border-b border-white/20 px-4 py-3 flex items-center justify-between sticky top-0 z-[--z-sticky] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg">Call Tracker</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-white/50 sticky top-0 h-screen shadow-xl">
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Call Tracker</h1>
              <p className="text-xs text-[--color-text-light]">Real-time monitoring</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? 'gradient-primary text-white shadow-lg shadow-blue-500/30'
                      : 'text-[--color-text-dark] hover:bg-white/60 hover:shadow-md'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  role="link"
                  tabIndex={0}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/30">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white text-sm">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">John Doe</p>
              <p className="text-xs text-[--color-text-light] truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[--z-modal-backdrop] bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="fixed left-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl border-r border-white/50 slide-in-right shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="p-6 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <Monitor className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl">Call Tracker</h1>
                  <p className="text-xs text-[--color-text-light]">Real-time monitoring</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-2" role="navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        active
                          ? 'gradient-primary text-white shadow-lg shadow-blue-500/30'
                          : 'text-[--color-text-dark] hover:bg-white/60 hover:shadow-md'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      role="link"
                      tabIndex={0}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}