// Mock data for demonstration purposes

export interface CallSession {
  id: string;
  platform: 'google-meet' | 'zoom' | 'teams' | 'phone' | 'browser';
  status: 'offline' | 'connecting' | 'active' | 'poor-quality' | 'ended';
  startTime: Date;
  endTime?: Date;
  duration: number;
  participants: string[];
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface TranscriptSegment {
  id: string;
  timestamp: Date;
  speaker: string;
  text: string;
  hasActionItem?: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  detectedAt: Date;
  source: string;
}

export interface SentimentData {
  score: number; // -1 to 1
  label: 'positive' | 'neutral' | 'negative';
  trend: 'improving' | 'stable' | 'declining';
  history: { timestamp: Date; score: number }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  platform: 'google-meet' | 'zoom' | 'teams' | 'phone' | 'browser';
  actionType: 'calendar' | 'crm' | 'email' | 'ticket' | 'meeting' | 'minutes';
  description: string;
  status: 'success' | 'failed' | 'pending';
  executedBy: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  activeCalls: number;
  totalCallsToday: number;
  actionItemsDetected: number;
  tasksExecuted: number;
  pendingApprovals: number;
}

export const mockCallSessions: CallSession[] = [
  {
    id: 'call-001',
    platform: 'google-meet',
    status: 'active',
    startTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    duration: 15 * 60,
    participants: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    quality: 'excellent'
  },
  {
    id: 'call-002',
    platform: 'zoom',
    status: 'ended',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    duration: 30 * 60,
    participants: ['Alice Williams', 'Charlie Brown'],
    quality: 'good'
  },
  {
    id: 'call-003',
    platform: 'teams',
    status: 'ended',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
    duration: 45 * 60,
    participants: ['Sarah Davis', 'Mike Wilson', 'Tom Anderson', 'Lisa Martinez'],
    quality: 'good'
  }
];

export const mockTranscript: TranscriptSegment[] = [
  {
    id: 'seg-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
    speaker: 'John Doe',
    text: 'Good morning everyone! Thanks for joining today\'s project sync.'
  },
  {
    id: 'seg-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 13.5),
    speaker: 'Jane Smith',
    text: 'Happy to be here. Let\'s discuss the Q4 roadmap.'
  },
  {
    id: 'seg-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 13),
    speaker: 'John Doe',
    text: 'I\'ll send the updated product requirements to the team by end of day today.',
    hasActionItem: true
  },
  {
    id: 'seg-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 12.5),
    speaker: 'Bob Johnson',
    text: 'Great! We also need to schedule a follow-up meeting next week to review the designs.',
    hasActionItem: true
  },
  {
    id: 'seg-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    speaker: 'Jane Smith',
    text: 'Let me update the CRM with these commitments. Can you share the customer feedback summary?'
  },
  {
    id: 'seg-006',
    timestamp: new Date(Date.now() - 1000 * 60 * 11.5),
    speaker: 'John Doe',
    text: 'Absolutely. I\'ll create a Jira ticket for tracking the design review process.',
    hasActionItem: true
  },
  {
    id: 'seg-007',
    timestamp: new Date(Date.now() - 1000 * 60 * 11),
    speaker: 'Bob Johnson',
    text: 'Perfect. I think we\'re making excellent progress on this initiative.'
  }
];

export const mockActionItems: ActionItem[] = [
  {
    id: 'action-001',
    text: 'Send updated product requirements to team',
    assignee: 'John Doe',
    deadline: 'Today, 5:00 PM',
    priority: 'high',
    status: 'pending',
    detectedAt: new Date(Date.now() - 1000 * 60 * 13),
    source: 'call-001'
  },
  {
    id: 'action-002',
    text: 'Schedule follow-up meeting next week for design review',
    assignee: 'Bob Johnson',
    deadline: 'Next Monday',
    priority: 'medium',
    status: 'pending',
    detectedAt: new Date(Date.now() - 1000 * 60 * 12.5),
    source: 'call-001'
  },
  {
    id: 'action-003',
    text: 'Create Jira ticket for design review tracking',
    assignee: 'John Doe',
    deadline: 'Tomorrow',
    priority: 'medium',
    status: 'approved',
    detectedAt: new Date(Date.now() - 1000 * 60 * 11.5),
    source: 'call-001'
  },
  {
    id: 'action-004',
    text: 'Update Salesforce with Q4 commitments',
    assignee: 'Jane Smith',
    deadline: 'This week',
    priority: 'low',
    status: 'executed',
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    source: 'call-002'
  }
];

export const mockSentimentData: SentimentData = {
  score: 0.65,
  label: 'positive',
  trend: 'stable',
  history: [
    { timestamp: new Date(Date.now() - 1000 * 60 * 14), score: 0.5 },
    { timestamp: new Date(Date.now() - 1000 * 60 * 12), score: 0.6 },
    { timestamp: new Date(Date.now() - 1000 * 60 * 10), score: 0.65 },
    { timestamp: new Date(Date.now() - 1000 * 60 * 8), score: 0.7 },
    { timestamp: new Date(Date.now() - 1000 * 60 * 6), score: 0.65 },
    { timestamp: new Date(Date.now() - 1000 * 60 * 4), score: 0.68 },
    { timestamp: new Date(Date.now() - 1000 * 60 * 2), score: 0.65 }
  ]
};

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    platform: 'google-meet',
    actionType: 'calendar',
    description: 'Created calendar reminder: Follow-up with design team',
    status: 'success',
    executedBy: 'System (Auto)'
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    platform: 'zoom',
    actionType: 'crm',
    description: 'Updated Salesforce opportunity: Q4 Enterprise Deal',
    status: 'success',
    executedBy: 'System (Auto)'
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    platform: 'teams',
    actionType: 'ticket',
    description: 'Created Jira ticket: PROJ-1234 - Design Review',
    status: 'success',
    executedBy: 'System (Auto)'
  },
  {
    id: 'audit-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    platform: 'google-meet',
    actionType: 'email',
    description: 'Sent follow-up email to meeting attendees',
    status: 'pending',
    executedBy: 'System (Pending Approval)'
  },
  {
    id: 'audit-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    platform: 'phone',
    actionType: 'minutes',
    description: 'Generated and sent meeting minutes to participants',
    status: 'success',
    executedBy: 'System (Auto)'
  },
  {
    id: 'audit-006',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    platform: 'zoom',
    actionType: 'meeting',
    description: 'Scheduled next sync meeting for Jan 15, 2025',
    status: 'failed',
    executedBy: 'System (Auto)',
    metadata: { error: 'Calendar API timeout' }
  }
];

export const mockDashboardStats: DashboardStats = {
  activeCalls: 1,
  totalCallsToday: 8,
  actionItemsDetected: 24,
  tasksExecuted: 18,
  pendingApprovals: 3
};

export const platformIcons = {
  'google-meet': '🎥',
  'zoom': '📹',
  'teams': '💼',
  'phone': '📞',
  'browser': '🌐'
};

export const actionTypeIcons = {
  'calendar': '📅',
  'crm': '💼',
  'email': '✉️',
  'ticket': '🎫',
  'meeting': '🤝',
  'minutes': '📝'
};
