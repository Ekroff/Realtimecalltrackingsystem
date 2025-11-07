import { Route, Switch } from 'wouter';
import { DashboardLayout } from './components/DashboardLayout';
import { Home } from './pages/Home';
import { CallMonitor } from './pages/CallMonitor';
import { Upload } from './pages/Upload';
import { Configuration } from './pages/Configuration';
import { AuditLog } from './pages/AuditLog';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/call-monitor">
          {/* CallMonitor uses custom layout for 3-column design */}
          <CallMonitor />
        </Route>

        {/* All other routes use standard dashboard layout */}
        <Route>
          <DashboardLayout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/upload" component={Upload} />
              <Route path="/configuration" component={Configuration} />
              <Route path="/audit-log" component={AuditLog} />
              
              {/* 404 fallback */}
              <Route>
                <div className="p-8 text-center">
                  <h1 className="mb-4">404 - Page Not Found</h1>
                  <p className="text-[--color-text-light]">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </Route>
            </Switch>
          </DashboardLayout>
        </Route>
      </Switch>

      {/* Toast notifications */}
      <Toaster />
    </>
  );
}
