import { Signal, SignalHigh, SignalLow, SignalZero } from 'lucide-react';
import { platformIcons, CallSession } from '../lib/mock-data';
import { Badge } from './ui/badge';

interface CallStatusIndicatorProps {
  session: CallSession;
  showDetails?: boolean;
}

export function CallStatusIndicator({ session, showDetails = false }: CallStatusIndicatorProps) {
  const statusConfig = {
    offline: {
      label: 'Offline',
      color: 'bg-[--color-status-offline]',
      icon: SignalZero,
    },
    connecting: {
      label: 'Connecting',
      color: 'bg-[--color-status-connecting]',
      icon: SignalLow,
    },
    active: {
      label: 'Active',
      color: 'bg-[--color-status-active]',
      icon: SignalHigh,
    },
    'poor-quality': {
      label: 'Poor Quality',
      color: 'bg-[--color-status-poor]',
      icon: SignalLow,
    },
    ended: {
      label: 'Ended',
      color: 'bg-[--color-text-muted]',
      icon: SignalZero,
    },
  };

  const qualityConfig = {
    excellent: { label: 'Excellent', icon: SignalHigh, color: 'text-[--color-success]' },
    good: { label: 'Good', icon: Signal, color: 'text-[--color-success]' },
    fair: { label: 'Fair', icon: SignalLow, color: 'text-[--color-warning]' },
    poor: { label: 'Poor', icon: SignalZero, color: 'text-[--color-error]' },
  };

  const config = statusConfig[session.status];
  const StatusIcon = config.icon;
  const qualityInfo = qualityConfig[session.quality];
  const QualityIcon = qualityInfo.icon;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showDetails) {
    return (
      <Badge
        variant="outline"
        className={`${config.color} text-white border-0 shadow-md`}
      >
        {session.status === 'active' && <span className="pulse-animation mr-1">●</span>}
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-3xl" role="img" aria-label={`${session.platform} platform`}>
        {platformIcons[session.platform]}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={`${config.color} text-white border-0 shadow-md`}>
            {session.status === 'active' && <span className="pulse-animation mr-1">●</span>}
            {config.label}
          </Badge>
          <div className={`flex items-center gap-1 ${qualityInfo.color}`} title={`Connection quality: ${qualityInfo.label}`}>
            <QualityIcon className="w-4 h-4" />
            <span className="text-xs">{qualityInfo.label}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-[--color-text-light]">
          <span className="flex items-center gap-1">
            <span>⏱️</span>
            {formatDuration(session.duration)}
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span>
            {session.participants.length} participant{session.participants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <StatusIcon className={`w-7 h-7 ${qualityInfo.color}`} />
    </div>
  );
}