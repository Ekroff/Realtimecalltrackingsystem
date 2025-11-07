import { useState } from 'react';
import { Upload as UploadIcon, FileText, Calendar, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { PlatformSelector } from '../components/PlatformSelector';
import { ActionItemRow } from '../components/ActionItemRow';
import { SentimentGauge } from '../components/SentimentGauge';
import { Badge } from '../components/ui/badge';
import { mockActionItems, mockSentimentData } from '../lib/mock-data';

type Platform = 'google-meet' | 'zoom' | 'teams' | 'phone' | 'browser';

interface AnalysisResults {
  actionItems: typeof mockActionItems;
  sentiment: typeof mockSentimentData;
  decisions: string[];
  commitments: string[];
  attendees: string[];
  summary: string;
}

export function Upload() {
  const [transcriptText, setTranscriptText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('google-meet');
  const [callDate, setCallDate] = useState('');
  const [autoExecute, setAutoExecute] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => file.type === 'text/plain');

    if (textFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTranscriptText(event.target?.result as string);
      };
      reader.readAsText(textFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTranscriptText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock results
    setAnalysisResults({
      actionItems: mockActionItems,
      sentiment: mockSentimentData,
      decisions: [
        'Approved Q4 product roadmap',
        'Decided to prioritize mobile experience',
        'Agreed to weekly sync meetings',
      ],
      commitments: [
        'John will deliver PRD by Friday',
        'Design team to complete mockups by next Monday',
        'Engineering to provide effort estimates by Wednesday',
      ],
      attendees: ['John Doe', 'Jane Smith', 'Bob Johnson'],
      summary: 'The team discussed Q4 priorities and agreed on the product roadmap. Key decisions were made regarding mobile experience prioritization and weekly sync cadence. Multiple action items were identified with clear owners and deadlines.',
    });

    setIsAnalyzing(false);
  };

  const canAnalyze = transcriptText.trim().length > 0 && callDate;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2">Upload Transcript</h1>
        <p className="text-[--color-text-light]">
          Upload or paste a call transcript for analysis and action item extraction
        </p>
      </div>

      {/* Upload Form */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label htmlFor="file-upload">Upload File</Label>
            <div
              className={`
                mt-2 border-2 border-dashed rounded-[--radius-md] p-8 text-center transition-colors
                ${isDragOver
                  ? 'border-[--color-primary] bg-blue-50'
                  : 'border-[--color-border] hover:border-[--color-primary]'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 mx-auto mb-4 text-[--color-text-light]" />
              <p className="mb-2">
                Drag and drop a transcript file here, or click to browse
              </p>
              <p className="text-sm text-[--color-text-light] mb-4">
                Supports .txt files
              </p>
              <Input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>

          {/* Or Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[--color-border]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[--color-text-light]">OR</span>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <Label htmlFor="transcript-text">Paste Transcript</Label>
            <Textarea
              id="transcript-text"
              placeholder="Paste your call transcript here..."
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              rows={12}
              className="mt-2"
            />
            <p className="text-xs text-[--color-text-light] mt-2">
              {transcriptText.length} characters
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="call-date">Call Date</Label>
              <Input
                id="call-date"
                type="datetime-local"
                value={callDate}
                onChange={(e) => setCallDate(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Platform</Label>
              <div className="mt-2">
                <PlatformSelector
                  value={selectedPlatform}
                  onChange={setSelectedPlatform}
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-execute"
              checked={autoExecute}
              onChange={(e) => setAutoExecute(e.target.checked)}
              className="w-4 h-4 rounded border-[--color-border] text-[--color-primary] focus:ring-[--color-primary]"
            />
            <Label htmlFor="auto-execute" className="cursor-pointer">
              Automatically execute approved tasks
            </Label>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Analyze Transcript
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="space-y-6 fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[--color-success] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2>Analysis Complete</h2>
              <p className="text-sm text-[--color-text-light]">
                Found {analysisResults.actionItems.length} action items and extracted key insights
              </p>
            </div>
          </div>

          {/* Summary */}
          <Card className="p-6">
            <h3 className="mb-3">Meeting Summary</h3>
            <p className="text-[--color-text-dark]">{analysisResults.summary}</p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Action Items */}
            <div className="space-y-3">
              <h3>Action Items ({analysisResults.actionItems.length})</h3>
              {analysisResults.actionItems.map((item) => (
                <ActionItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Insights Column */}
            <div className="space-y-6">
              {/* Sentiment */}
              <SentimentGauge data={analysisResults.sentiment} size="large" showTrend={false} />

              {/* Decisions */}
              <Card className="p-6">
                <h4 className="mb-3">Key Decisions</h4>
                <ul className="space-y-2">
                  {analysisResults.decisions.map((decision, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-[--color-success] mt-1">✓</span>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Commitments */}
              <Card className="p-6">
                <h4 className="mb-3">Commitments</h4>
                <ul className="space-y-2">
                  {analysisResults.commitments.map((commitment, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-[--color-primary] mt-1">•</span>
                      <span>{commitment}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Attendees */}
              <Card className="p-6">
                <h4 className="mb-3">Attendees</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.attendees.map((attendee, index) => (
                    <Badge key={index} variant="outline">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
