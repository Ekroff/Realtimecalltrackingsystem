import { useState } from 'react';
import { Video, Phone, Monitor } from 'lucide-react';
import { Button } from './ui/button';

type Platform = 'google-meet' | 'zoom' | 'teams' | 'phone' | 'browser';

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
  disabled?: boolean;
}

export function PlatformSelector({ value, onChange, disabled = false }: PlatformSelectorProps) {
  const platforms = [
    { id: 'google-meet' as Platform, label: 'Google Meet', icon: '🎥' },
    { id: 'zoom' as Platform, label: 'Zoom', icon: '📹' },
    { id: 'teams' as Platform, label: 'Teams', icon: '💼' },
    { id: 'phone' as Platform, label: 'Phone', icon: '📞' },
    { id: 'browser' as Platform, label: 'Browser', icon: '🌐' },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Select platform">
      {platforms.map((platform) => {
        const isSelected = value === platform.id;
        return (
          <button
            key={platform.id}
            onClick={() => onChange(platform.id)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200
              ${isSelected
                ? 'gradient-primary text-white border-transparent shadow-lg shadow-blue-500/30 scale-105'
                : 'bg-white/80 backdrop-blur-sm text-[--color-text-dark] border-white/50 hover:border-[--color-primary] hover:shadow-md hover:scale-105'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-pressed={isSelected}
          >
            <span className="text-lg" role="img" aria-label={platform.label}>
              {platform.icon}
            </span>
            <span className="text-sm">{platform.label}</span>
          </button>
        );
      })}
    </div>
  );
}