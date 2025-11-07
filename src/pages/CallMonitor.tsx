import { useState, useEffect } from 'react';
import { Play, Square, Pause } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CallStatusIndicator } from '../components/CallStatusIndicator';
import { PlatformSelector } from '../components/PlatformSelector';
import { RealTimeTranscript } from '../components/RealTimeTranscript';
import { ActionItemRow } from '../components/ActionItemRow';
import { SentimentGauge } from '../components/SentimentGauge';
import { Badge } from '../components/ui/badge';
import {
  mockCallSessions,
  mockTranscript,
  mockActionItems,
  mockSentimentData,
  CallSession,
  TranscriptSegment,
  ActionItem,
} from '../lib/mock-data';

type Platform = 'google-meet' | 'zoom' | 'teams' | 'phone' | 'browser';

export function CallMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('google-meet');
  const [currentSession, setCurrentSession] = useState<CallSession | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [callDuration, setCallDuration] = useState(0);

  // Simulate call monitoring
  useEffect(() => {
    if (isMonitoring && !isPaused) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, isPaused]);

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    setIsPaused(false);
    setCallDuration(0);
    
    // Simulate starting a call session
    setCurrentSession({
      ...mockCallSessions[0],
      platform: selectedPlatform,
      status: 'connecting',
    });

    // Simulate connection delay
    setTimeout(() => {
      setCurrentSession((prev) => prev ? { ...prev, status: 'active' } : null);
      setTranscript(mockTranscript);
      setActionItems(mockActionItems);
    }, 2000);
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setIsPaused(false);
    setCurrentSession((prev) => prev ? { ...prev, status: 'ended' } : null);
    
    // Reset after a delay
    setTimeout(() => {
      setCurrentSession(null);
      setTranscript([]);
      setActionItems([]);
      setCallDuration(0);
    }, 3000);
  };

  const handlePauseMonitoring = () => {
    setIsPaused(!isPaused);
  };

  const handleApproveAction = (id: string) => {
    setActionItems((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'approved' as const } : item))
    );
  };

  const handleRejectAction = (id: string) => {
    setActionItems((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'rejected' as const } : item))
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingActions = actionItems.filter((item) => item.status === 'pending');

  return (
    <div className="h-screen flex flex-col lg:grid lg:grid-cols-[400px_1fr_380px] gap-0 overflow-hidden">
      {/* Left Panel - Control Panel */}
      <div className="border-r border-[--color-border] bg-white p-6 overflow-y-auto">
        <h2 className="mb-6">Call Control</h2>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="block text-sm mb-3">Select Platform</label>
          <PlatformSelector
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            disabled={isMonitoring}
          />
        </div>

        {/* Control Buttons */}
        <div className="space-y-3 mb-6">
          {!isMonitoring ? (
            <Button
              className="w-full bg-[--color-success] hover:bg-[--color-success-dark]"
              onClick={handleStartMonitoring}
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Monitoring
            </Button>
          ) : (
            <>
              <Button
                className="w-full"
                variant="outline"
                onClick={handlePauseMonitoring}
                size="lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                className="w-full bg-[--color-error] hover:bg-[--color-error-dark] text-white"
                onClick={handleStopMonitoring}
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Monitoring
              </Button>
            </>
          )}
        </div>

        {/* Call Status */}
        {currentSession && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Status</label>
              <CallStatusIndicator session={{
                ...currentSession,
                duration: callDuration
              }} showDetails />
            </div>

            {/* Participants */}
            {currentSession.status === 'active' && (
              <Card className="p-4">
                <h4 className="text-sm mb-3">Participants ({currentSession.participants.length})</h4>
                <div className="space-y-2">
                  {currentSession.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[--color-primary] flex items-center justify-center text-white text-xs">
                        {participant.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{participant}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Call Timer */}
            <Card className="p-4">
              <div className="text-center">
                <p className="text-sm text-[--color-text-light] mb-1">Duration</p>
                <p className="text-3xl tabular-nums">{formatDuration(callDuration)}</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Center Panel - Live Transcript */}
      <div className="flex-1 bg-[--color-background-alt] p-6 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="mb-4">
            <h2>Live Transcript</h2>
            <p className="text-sm text-[--color-text-light]">
              Real-time transcription with action item detection
            </p>
          </div>
          
          {!isMonitoring && transcript.length === 0 ? (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 bg-[--color-secondary] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-[--color-text-light]" />
                </div>
                <h3 className="mb-2">No Active Monitoring</h3>
                <p className="text-sm text-[--color-text-light] mb-6">
                  Select a platform and start monitoring to see real-time transcription and analysis.
                </p>
                <Button onClick={handleStartMonitoring} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Monitoring
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex-1 overflow-hidden">
              <RealTimeTranscript
                segments={transcript}
                isLive={isMonitoring && !isPaused}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Insights */}
      <div className="border-l border-[--color-border] bg-white p-6 overflow-y-auto space-y-6">
        <div>
          <h3 className="mb-4">Live Insights</h3>
        </div>

        {/* Sentiment Analysis */}
        {isMonitoring && currentSession?.status === 'active' && (
          <SentimentGauge data={mockSentimentData} size="large" showTrend />
        )}

        {/* Action Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4>Action Items</h4>
            {pendingActions.length > 0 && (
              <Badge variant="outline" className="bg-[--color-warning] text-white border-0">
                {pendingActions.length} Pending
              </Badge>
            )}
          </div>

          {actionItems.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-[--color-text-light]">
                No action items detected yet
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {actionItems.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  onApprove={handleApproveAction}
                  onReject={handleRejectAction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {isMonitoring && currentSession?.status === 'active' && (
          <Card className="p-4">
            <h5 className="mb-3">Session Stats</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[--color-text-light]">Transcript segments</span>
                <span>{transcript.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[--color-text-light]">Action items detected</span>
                <span>{actionItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[--color-text-light]">Pending approval</span>
                <span>{pendingActions.length}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
