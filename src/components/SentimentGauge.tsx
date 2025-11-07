import { SentimentData } from '../lib/mock-data';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Minus, Smile, Frown, Meh } from 'lucide-react';
import { Badge } from './ui/badge';

interface SentimentGaugeProps {
  data: SentimentData;
  size?: 'small' | 'large';
  showTrend?: boolean;
}

export function SentimentGauge({ data, size = 'large', showTrend = true }: SentimentGaugeProps) {
  const { score, label, trend, history } = data;

  // Convert score (-1 to 1) to percentage (0 to 100)
  const percentage = ((score + 1) / 2) * 100;

  const sentimentConfig = {
    positive: {
      color: 'text-[--color-success]',
      bgColor: 'bg-[--color-success]',
      icon: Smile,
      label: 'Positive',
    },
    neutral: {
      color: 'text-[--color-text-light]',
      bgColor: 'bg-[--color-text-light]',
      icon: Meh,
      label: 'Neutral',
    },
    negative: {
      color: 'text-[--color-error]',
      bgColor: 'bg-[--color-error]',
      icon: Frown,
      label: 'Negative',
    },
  };

  const trendConfig = {
    improving: { icon: TrendingUp, color: 'text-[--color-success]', label: 'Improving' },
    stable: { icon: Minus, color: 'text-[--color-text-light]', label: 'Stable' },
    declining: { icon: TrendingDown, color: 'text-[--color-error]', label: 'Declining' },
  };

  const config = sentimentConfig[label];
  const SentimentIcon = config.icon;
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  if (size === 'small') {
    return (
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} bg-opacity-10`}>
          <SentimentIcon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div>
          <p className="text-sm">{config.label}</p>
          <p className="text-xs text-[--color-text-light]">
            {(score > 0 ? '+' : '') + score.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg">Sentiment Analysis</h4>
        <Badge variant="outline" className={`${config.bgColor} text-white border-0`}>
          {config.label}
        </Badge>
      </div>

      {/* Gauge Visualization */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-40 h-40">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="12"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={`var(--color-sentiment-${label})`}
                strokeWidth="12"
                strokeDasharray={`${(percentage / 100) * 439.8} 439.8`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <SentimentIcon className={`w-10 h-10 mb-2 ${config.color}`} />
              <p className={`text-2xl ${config.color}`}>
                {score > 0 ? '+' : ''}{score.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-[--color-text-light]">
          <span className="flex items-center gap-1">
            <Frown className="w-3 h-3" />
            Negative
          </span>
          <span className="flex items-center gap-1">
            <Meh className="w-3 h-3" />
            Neutral
          </span>
          <span className="flex items-center gap-1">
            <Smile className="w-3 h-3" />
            Positive
          </span>
        </div>
      </div>

      {/* Trend Information */}
      {showTrend && (
        <div className="pt-4 border-t border-[--color-border]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[--color-text-light]">Trend</span>
            <div className={`flex items-center gap-1 ${trendInfo.color}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm">{trendInfo.label}</span>
            </div>
          </div>

          {/* Mini Trend Chart */}
          {history.length > 0 && (
            <div className="mt-4 h-12 flex items-end gap-1">
              {history.map((point, index) => {
                const height = ((point.score + 1) / 2) * 100;
                return (
                  <div
                    key={index}
                    className={`flex-1 rounded-t-sm ${config.bgColor} transition-all`}
                    style={{ height: `${height}%` }}
                    title={`${point.timestamp.toLocaleTimeString()}: ${point.score.toFixed(2)}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
