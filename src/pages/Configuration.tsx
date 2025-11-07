import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { CheckCircle, XCircle, Loader2, Settings, Zap, Shield, Link2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'platform' | 'crm' | 'calendar' | 'email' | 'pm';
  connected: boolean;
  lastSync?: Date;
}

export function Configuration() {
  // Real-time Monitoring Settings
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [autoStartMonitoring, setAutoStartMonitoring] = useState(false);
  const [transcriptionAccuracy, setTranscriptionAccuracy] = useState([75]);

  // Approval Workflow
  const [requireApproval, setRequireApproval] = useState(true);
  const [approvalThreshold, setApprovalThreshold] = useState([60]); // 0-100 scale
  const [emailApproval, setEmailApproval] = useState(true);
  const [inAppApproval, setInAppApproval] = useState(true);
  const [smsApproval, setSmsApproval] = useState(false);
  const [learningMode, setLearningMode] = useState(true);

  // Task Execution Rules
  const [taskSettings, setTaskSettings] = useState({
    calendarReminders: { enabled: true, requireApproval: false, priority: 'medium' as const },
    crmUpdates: { enabled: true, requireApproval: true, priority: 'high' as const },
    followUpEmails: { enabled: true, requireApproval: true, priority: 'medium' as const },
    pmTickets: { enabled: true, requireApproval: false, priority: 'medium' as const },
    nextMeetings: { enabled: false, requireApproval: true, priority: 'low' as const },
    meetingMinutes: { enabled: true, requireApproval: false, priority: 'low' as const },
  });

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'google-meet', name: 'Google Meet', category: 'platform', connected: true, lastSync: new Date() },
    { id: 'zoom', name: 'Zoom', category: 'platform', connected: true, lastSync: new Date() },
    { id: 'teams', name: 'Microsoft Teams', category: 'platform', connected: false },
    { id: 'twilio', name: 'Twilio Phone', category: 'platform', connected: false },
    { id: 'salesforce', name: 'Salesforce', category: 'crm', connected: true, lastSync: new Date() },
    { id: 'hubspot', name: 'HubSpot', category: 'crm', connected: false },
    { id: 'google-calendar', name: 'Google Calendar', category: 'calendar', connected: true, lastSync: new Date() },
    { id: 'outlook-calendar', name: 'Outlook Calendar', category: 'calendar', connected: false },
    { id: 'gmail', name: 'Gmail', category: 'email', connected: true, lastSync: new Date() },
    { id: 'outlook', name: 'Outlook', category: 'email', connected: false },
    { id: 'jira', name: 'Jira', category: 'pm', connected: true, lastSync: new Date() },
    { id: 'asana', name: 'Asana', category: 'pm', connected: false },
  ]);

  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const toggleTask = (taskKey: keyof typeof taskSettings, field: 'enabled' | 'requireApproval') => {
    setTaskSettings((prev) => ({
      ...prev,
      [taskKey]: { ...prev[taskKey], [field]: !prev[taskKey][field] },
    }));
  };

  const handleToggleIntegration = async (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    if (!integration) return;

    if (integration.connected) {
      // Disconnect
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: false, lastSync: undefined } : i))
      );
    } else {
      // Connect (simulate OAuth flow)
      setTestingConnection(id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: true, lastSync: new Date() } : i))
      );
      setTestingConnection(null);
    }
  };

  const handleTestConnection = async (id: string) => {
    setTestingConnection(id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTestingConnection(null);
  };

  const getThresholdLabel = (value: number) => {
    if (value < 33) return 'Low';
    if (value < 66) return 'Medium';
    return 'High';
  };

  const groupedIntegrations = {
    platform: integrations.filter((i) => i.category === 'platform'),
    crm: integrations.filter((i) => i.category === 'crm'),
    calendar: integrations.filter((i) => i.category === 'calendar'),
    email: integrations.filter((i) => i.category === 'email'),
    pm: integrations.filter((i) => i.category === 'pm'),
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2">Configuration</h1>
        <p className="text-[--color-text-light]">
          Customize your call tracking and automation settings
        </p>
      </div>

      {/* Real-Time Monitoring Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-primary] bg-opacity-10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[--color-primary]" />
          </div>
          <div>
            <h3>Real-Time Monitoring</h3>
            <p className="text-sm text-[--color-text-light]">Configure live call tracking behavior</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="real-time-enabled">Enable Real-Time Monitoring</Label>
              <p className="text-sm text-[--color-text-light]">Monitor calls as they happen</p>
            </div>
            <Switch
              id="real-time-enabled"
              checked={realTimeEnabled}
              onCheckedChange={setRealTimeEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-start">Auto-Start Monitoring</Label>
              <p className="text-sm text-[--color-text-light]">Automatically start when call begins</p>
            </div>
            <Switch
              id="auto-start"
              checked={autoStartMonitoring}
              onCheckedChange={setAutoStartMonitoring}
              disabled={!realTimeEnabled}
            />
          </div>

          <div>
            <Label htmlFor="transcription-accuracy">Transcription Accuracy Target</Label>
            <div className="flex items-center gap-4 mt-2">
              <Slider
                id="transcription-accuracy"
                value={transcriptionAccuracy}
                onValueChange={setTranscriptionAccuracy}
                max={100}
                step={5}
                className="flex-1"
                disabled={!realTimeEnabled}
              />
              <span className="text-sm min-w-[3rem] text-right">{transcriptionAccuracy[0]}%</span>
            </div>
            <p className="text-xs text-[--color-text-light] mt-2">
              Higher accuracy may increase processing time
            </p>
          </div>
        </div>
      </Card>

      {/* Approval Workflow */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-warning] bg-opacity-10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[--color-warning]" />
          </div>
          <div>
            <h3>Approval Workflow</h3>
            <p className="text-sm text-[--color-text-light]">Control automated task execution</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-approval">Require Approval</Label>
              <p className="text-sm text-[--color-text-light]">Review actions before execution</p>
            </div>
            <Switch
              id="require-approval"
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
            />
          </div>

          {requireApproval && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="approval-threshold">Approval Threshold</Label>
                  <Badge variant="outline">{getThresholdLabel(approvalThreshold[0])}</Badge>
                </div>
                <Slider
                  id="approval-threshold"
                  value={approvalThreshold}
                  onValueChange={setApprovalThreshold}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-[--color-text-light] mt-2">
                  Tasks above this confidence level will execute automatically
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[--color-border]">
                <Label>Approval Methods</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-approval">Email Notifications</Label>
                    <p className="text-sm text-[--color-text-light]">Receive approval requests via email</p>
                  </div>
                  <Switch
                    id="email-approval"
                    checked={emailApproval}
                    onCheckedChange={setEmailApproval}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="in-app-approval">In-App Notifications</Label>
                    <p className="text-sm text-[--color-text-light]">Show alerts in the application</p>
                  </div>
                  <Switch
                    id="in-app-approval"
                    checked={inAppApproval}
                    onCheckedChange={setInAppApproval}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-approval">SMS Notifications</Label>
                    <p className="text-sm text-[--color-text-light]">Text alerts for critical actions</p>
                  </div>
                  <Switch
                    id="sms-approval"
                    checked={smsApproval}
                    onCheckedChange={setSmsApproval}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[--color-border]">
                <div>
                  <Label htmlFor="learning-mode">Learning Mode</Label>
                  <p className="text-sm text-[--color-text-light]">Improve accuracy based on your approvals</p>
                </div>
                <Switch
                  id="learning-mode"
                  checked={learningMode}
                  onCheckedChange={setLearningMode}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Task Execution Rules */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-success] bg-opacity-10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[--color-success]" />
          </div>
          <div>
            <h3>Task Execution Rules</h3>
            <p className="text-sm text-[--color-text-light]">Configure automated task types</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(taskSettings).map(([key, settings]) => {
            const labels: Record<string, string> = {
              calendarReminders: 'Create Calendar Reminders',
              crmUpdates: 'Update CRM Systems',
              followUpEmails: 'Send Follow-up Emails',
              pmTickets: 'Create Project Management Tickets',
              nextMeetings: 'Schedule Next Meetings',
              meetingMinutes: 'Send Meeting Minutes',
            };

            return (
              <div
                key={key}
                className="p-4 bg-[--color-background-alt] rounded-[--radius-md] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label>{labels[key]}</Label>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={() => toggleTask(key as keyof typeof taskSettings, 'enabled')}
                  />
                </div>

                {settings.enabled && (
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <Label className="text-sm">Require Approval</Label>
                      <p className="text-xs text-[--color-text-light]">
                        Review before executing this task type
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireApproval}
                      onCheckedChange={() =>
                        toggleTask(key as keyof typeof taskSettings, 'requireApproval')
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Platform Integrations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-primary] bg-opacity-10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-[--color-primary]" />
          </div>
          <div>
            <h3>Integrations</h3>
            <p className="text-sm text-[--color-text-light]">Connect your business tools</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedIntegrations).map(([category, items]) => {
            const categoryLabels: Record<string, string> = {
              platform: 'Call Platforms',
              crm: 'CRM Systems',
              calendar: 'Calendar Services',
              email: 'Email Services',
              pm: 'Project Management',
            };

            return (
              <div key={category}>
                <h4 className="mb-3">{categoryLabels[category]}</h4>
                <div className="space-y-3">
                  {items.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 bg-[--color-background-alt] rounded-[--radius-md]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Label>{integration.name}</Label>
                          {integration.connected ? (
                            <Badge variant="outline" className="bg-[--color-success] text-white border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[--color-text-light]">
                              Not Connected
                            </Badge>
                          )}
                        </div>
                        {integration.lastSync && (
                          <p className="text-xs text-[--color-text-light]">
                            Last synced: {integration.lastSync.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {integration.connected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestConnection(integration.id)}
                            disabled={testingConnection === integration.id}
                          >
                            {testingConnection === integration.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Test'
                            )}
                          </Button>
                        )}
                        <Button
                          variant={integration.connected ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleToggleIntegration(integration.id)}
                          disabled={testingConnection === integration.id}
                        >
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
