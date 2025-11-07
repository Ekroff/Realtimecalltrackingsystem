import { Activity, CheckCircle, Clock, PhoneCall, AlertCircle } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CallStatusIndicator } from '../components/CallStatusIndicator';
import { mockDashboardStats, mockCallSessions, mockActionItems, platformIcons } from '../lib/mock-data';
import { Link } from 'wouter';

export function Home() {
  const stats = mockDashboardStats;
  const recentCalls = mockCallSessions.slice(0, 5);
  const activeCalls = mockCallSessions.filter(call => call.status === 'active');
  const recentActions = mockActionItems.slice(0, 3);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome back, John!</h1>
        <p className="text-[--color-text-light] text-lg">
          Here's what's happening with your calls today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 fade-in">
        <StatsCard
          title="Active Calls"
          value={stats.activeCalls}
          icon={PhoneCall}
          color="success"
        />
        <StatsCard
          title="Total Calls Today"
          value={stats.totalCallsToday}
          icon={Activity}
          color="primary"
          trend={{ value: '+12%', positive: true }}
        />
        <StatsCard
          title="Action Items"
          value={stats.actionItemsDetected}
          icon={AlertCircle}
          color="warning"
        />
        <StatsCard
          title="Tasks Executed"
          value={stats.tasksExecuted}
          icon={CheckCircle}
          color="success"
          trend={{ value: '95%', positive: true }}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          color="warning"
        />
      </div>

      {/* Active Calls Widget */}
      {activeCalls.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-xl fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Active Calls</h3>
            <Badge variant="outline" className="gradient-success text-white border-0 shadow-md">
              <span className="pulse-animation mr-1">●</span>
              {activeCalls.length} Active
            </Badge>
          </div>
          <div className="space-y-4">
            {activeCalls.map((call) => (
              <CallStatusIndicator key={call.id} session={call} showDetails />
            ))}
          </div>
          <div className="mt-6">
            <Link href="/call-monitor">
              <Button className="w-full gradient-primary shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                View Call Monitor
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Recent Calls</h3>
            <Link href="/call-monitor">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentCalls.length === 0 ? (
              <p className="text-center text-[--color-text-light] py-8">
                No recent calls yet
              </p>
            ) : (
              recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-4 bg-[--color-background-alt] rounded-[--radius-md] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-1" role="img" aria-label={`${call.platform} platform`}>
                        {platformIcons[call.platform]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm">{call.platform.replace('-', ' ')}</p>
                          <CallStatusIndicator session={call} />
                        </div>
                        <p className="text-xs text-[--color-text-light]">
                          {call.startTime.toLocaleString()} • {call.participants.length} participants
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Action Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Recent Action Items</h3>
            <Link href="/audit-log">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentActions.length === 0 ? (
              <p className="text-center text-[--color-text-light] py-8">
                No action items yet
              </p>
            ) : (
              recentActions.map((action) => (
                <div
                  key={action.id}
                  className="p-4 bg-[--color-background-alt] rounded-[--radius-md] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-1 h-16 rounded-full ${
                      action.priority === 'high' ? 'bg-[--color-error]' :
                      action.priority === 'medium' ? 'bg-[--color-warning]' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-2">{action.text}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={
                          action.status === 'executed' ? 'bg-[--color-success] text-white border-0' :
                          action.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          action.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }>
                          {action.status}
                        </Badge>
                        <span className="text-xs text-[--color-text-light]">{action.assignee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/call-monitor">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <PhoneCall className="w-6 h-6" />
              <span>Start Monitoring</span>
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <Activity className="w-6 h-6" />
              <span>Upload Transcript</span>
            </Button>
          </Link>
          <Link href="/configuration">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span>Configure Settings</span>
            </Button>
          </Link>
          <Link href="/audit-log">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>View Audit Log</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}