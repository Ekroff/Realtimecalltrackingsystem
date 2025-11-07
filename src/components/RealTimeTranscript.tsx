import { useEffect, useRef, useState } from 'react';
import { TranscriptSegment } from '../lib/mock-data';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, Search, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface RealTimeTranscriptProps {
  segments: TranscriptSegment[];
  isLive?: boolean;
}

export function RealTimeTranscript({ segments, isLive = false }: RealTimeTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Auto-scroll to bottom when new segments arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const handleCopyTranscript = () => {
    const text = segments
      .map((seg) => `[${seg.timestamp.toLocaleTimeString()}] ${seg.speaker}: ${seg.text}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setAutoScroll(true);
    }
  };

  const speakerColors: Record<string, string> = {
    'John Doe': 'bg-blue-100 border-blue-300 text-blue-900',
    'Jane Smith': 'bg-purple-100 border-purple-300 text-purple-900',
    'Bob Johnson': 'bg-green-100 border-green-300 text-green-900',
    'Alice Williams': 'bg-orange-100 border-orange-300 text-orange-900',
  };

  const getSpeakerColor = (speaker: string) => {
    return speakerColors[speaker] || 'bg-gray-100 border-gray-300 text-gray-900';
  };

  const filteredSegments = searchQuery
    ? segments.filter(
        (seg) =>
          seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seg.speaker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : segments;

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[--color-border] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg">Live Transcript</h3>
          {isLive && (
            <Badge variant="outline" className="bg-[--color-status-active] text-white border-0">
              <span className="pulse-animation mr-1">●</span>
              Live
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search transcript"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyTranscript}
            aria-label="Copy transcript"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b border-[--color-border]">
          <Input
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* Transcript Content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live={isLive ? 'polite' : 'off'}
        aria-label="Transcript content"
      >
        {filteredSegments.length === 0 ? (
          <div className="text-center text-[--color-text-light] py-12">
            {searchQuery ? 'No matching segments found' : 'No transcript available yet...'}
          </div>
        ) : (
          filteredSegments.map((segment) => (
            <div
              key={segment.id}
              className={`relative p-4 rounded-[--radius-md] border-l-4 transition-all ${
                segment.hasActionItem
                  ? 'bg-yellow-50 border-[--color-warning] shadow-sm'
                  : `${getSpeakerColor(segment.speaker)} border-current`
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{segment.speaker}</span>
                  {segment.hasActionItem && (
                    <Badge variant="outline" className="bg-[--color-warning] text-white border-0 text-xs">
                      Action Item
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-[--color-text-light] whitespace-nowrap">
                  {segment.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{segment.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {!autoScroll && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 fade-in">
          <Button
            onClick={scrollToBottom}
            size="sm"
            className="shadow-lg"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            New messages
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-[--color-border] text-xs text-[--color-text-light]">
        {filteredSegments.length} segment{filteredSegments.length !== 1 ? 's' : ''}
        {searchQuery && ` (filtered from ${segments.length})`}
      </div>
    </Card>
  );
}
