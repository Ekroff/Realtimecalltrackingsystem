# Real-Time Autonomous Call Tracking & Task Automation System

A production-grade web application for monitoring calls in real-time, extracting action items automatically, and executing tasks autonomously with configurable approval workflows.

## 🎨 Design System

### Color Tokens

All colors are defined as CSS custom properties in `/styles/globals.css` and exported in `/lib/design-tokens.json`:

- **Primary**: `#0066CC` - Main brand color for buttons, links, active states
- **Secondary**: `#F5F5F5` - Background and neutral elements
- **Success**: `#10B981` - Positive states, completed actions
- **Warning**: `#F59E0B` - Pending approvals, medium priority
- **Error**: `#EF4444` - Failed actions, high priority, errors
- **Text Dark**: `#1F2937` - Primary text color (AA contrast ratio)
- **Text Light**: `#6B7280` - Secondary text, labels

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: 12px (xs) → 32px (4xl) with corresponding line-heights
- **Font Weights**: 300 (light) → 800 (extrabold)

### Spacing Scale

Base unit: 4px
- 1 = 4px
- 2 = 8px
- 3 = 12px
- 4 = 16px
- 6 = 24px
- 8 = 32px
- 12 = 48px

### Border Radius

- `sm`: 6px - Small elements, badges
- `md`: 12px - Cards, buttons, inputs
- `lg`: 20px - Large containers, modals
- `full`: 9999px - Circular elements

### Shadows

- `sm`: Subtle elevation for cards
- `md`: Default card shadow
- `lg`: Elevated elements like dropdowns
- `xl`: Modals and overlays

### Breakpoints

- **Mobile**: 0-639px
- **Tablet**: 640-1023px  
- **Desktop**: 1024px+

## 📁 Project Structure

```
/
├── styles/
│   └── globals.css           # Design tokens and global styles
├── lib/
│   ├── design-tokens.json    # Exported design tokens
│   └── mock-data.ts          # Mock data for demonstration
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── DashboardLayout.tsx   # Main layout with navigation
│   ├── StatsCard.tsx         # Statistics display card
│   ├── CallStatusIndicator.tsx
│   ├── PlatformSelector.tsx
│   ├── RealTimeTranscript.tsx
│   ├── ActionItemRow.tsx
│   └── SentimentGauge.tsx
├── pages/
│   ├── Home.tsx             # Dashboard with stats
│   ├── CallMonitor.tsx      # Real-time call monitoring
│   ├── Upload.tsx           # Upload transcript for analysis
│   ├── Configuration.tsx    # Settings and integrations
│   └── AuditLog.tsx         # Action audit trail
└── App.tsx                  # Main app with routing
```

## 🧩 Component Library

### Layout Components

#### `DashboardLayout`
**File**: `/components/DashboardLayout.tsx`

Main application layout with sidebar navigation.

**Props**: `{ children: ReactNode }`

**Features**:
- Responsive sidebar (desktop) / mobile menu
- Active route highlighting
- User profile section
- Accessible navigation with ARIA labels

**Tailwind Classes**: `min-h-screen flex bg-[--color-background-alt]`

---

#### `StatsCard`
**File**: `/components/StatsCard.tsx`

Statistics display card with icon and optional trend.

**Props**:
```typescript
{
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: 'primary' | 'success' | 'warning' | 'error';
}
```

**Tailwind Classes**: `p-6 rounded-[--radius-md] hover:shadow-lg`

---

### Real-Time Components

#### `CallStatusIndicator`
**File**: `/components/CallStatusIndicator.tsx`

Displays call status with connection quality indicator.

**Props**:
```typescript
{
  session: CallSession;
  showDetails?: boolean;
}
```

**States**: offline, connecting, active, poor-quality, ended

**Tailwind Classes**: Badge-based with dynamic colors

**Accessibility**: Live region updates, ARIA labels for status

---

#### `PlatformSelector`
**File**: `/components/PlatformSelector.tsx`

Platform selection chips (Google Meet, Zoom, Teams, Phone, Browser).

**Props**:
```typescript
{
  value: Platform;
  onChange: (platform: Platform) => void;
  disabled?: boolean;
}
```

**States**: default, selected, disabled

**Tailwind Classes**: `flex gap-2 px-4 py-2 rounded-[--radius-md] border`

**Accessibility**: `role="group"` with `aria-pressed` states

---

#### `RealTimeTranscript`
**File**: `/components/RealTimeTranscript.tsx`

Live scrolling transcript with speaker identification and action item highlighting.

**Props**:
```typescript
{
  segments: TranscriptSegment[];
  isLive?: boolean;
}
```

**Features**:
- Auto-scroll with manual override
- Search functionality
- Copy transcript
- Color-coded speakers
- Action item badges

**Accessibility**: `role="log"` with `aria-live="polite"` for live updates

---

#### `ActionItemRow`
**File**: `/components/ActionItemRow.tsx`

Action item display with inline editing and approval controls.

**Props**:
```typescript
{
  item: ActionItem;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<ActionItem>) => void;
}
```

**States**: pending, approved, rejected, executed

**Priority Levels**: low (blue), medium (orange), high (red)

**Tailwind Classes**: `p-4 rounded-[--radius-md] border hover:shadow-md`

---

#### `SentimentGauge`
**File**: `/components/SentimentGauge.tsx`

Sentiment analysis visualization with trend chart.

**Props**:
```typescript
{
  data: SentimentData;
  size?: 'small' | 'large';
  showTrend?: boolean;
}
```

**Features**:
- Circular gauge (-1 to 1 scale)
- Sentiment labels (positive/neutral/negative)
- Trend indicator (improving/stable/declining)
- Historical mini-chart

---

## 📄 Pages

### Home (`/`)
**File**: `/pages/Home.tsx`

**Components Used**:
- `StatsCard` × 5 (stats overview)
- `CallStatusIndicator` (active calls)
- `Card` (recent calls, action items)
- Quick action buttons

**Layout**: Grid with responsive columns

---

### CallMonitor (`/call-monitor`)
**File**: `/pages/CallMonitor.tsx`

**Layout**: 3-column grid (`[400px_1fr_380px]`)
- **Left**: Control panel (platform selector, start/stop)
- **Center**: Live transcript
- **Right**: Insights (sentiment, action items)

**Real-Time Features**:
- WebSocket simulation for live updates
- Call duration timer
- Participant tracking
- Action item detection with quick approve/reject

**Responsive**: Stacks vertically on mobile/tablet

---

### Upload (`/upload`)
**File**: `/pages/Upload.tsx`

**Features**:
- Drag-and-drop file upload
- Text input for pasted transcripts
- Platform and date selection
- Analysis with loading state
- Expandable results sections

**Results Display**:
- Action items list
- Sentiment analysis
- Key decisions
- Commitments
- Meeting summary

---

### Configuration (`/configuration`)
**File**: `/pages/Configuration.tsx`

**Settings Sections**:
1. **Real-Time Monitoring**: Enable/disable, accuracy slider
2. **Approval Workflow**: Threshold slider, approval methods
3. **Task Execution Rules**: Per-task toggles and approval requirements
4. **Integrations**: Connect/disconnect platforms and business tools

**Features**:
- Switch toggles for boolean settings
- Sliders for thresholds
- Connect/disconnect integrations with simulated OAuth
- Test connection buttons

---

### AuditLog (`/audit-log`)
**File**: `/pages/AuditLog.tsx`

**Features**:
- Advanced filtering (search, platform, type, status, date range)
- Sortable table
- Expandable rows for metadata
- Bulk approve/reject
- Row selection with checkboxes
- CSV export

**Accessibility**: Full keyboard navigation, ARIA table markup

---

## 🎯 Key Features Implemented

### ✅ Design System
- Complete design tokens in CSS variables
- Exported as JSON for documentation
- Tailwind 4 integration
- Typography scale with Inter font
- Accessible color contrast (AA/AAA compliant)

### ✅ Component Library
- 10+ custom components with variants and states
- Full shadcn/ui integration
- Responsive behaviors
- Accessibility features (ARIA, keyboard navigation)
- Loading states and skeletons

### ✅ Real-Time Monitoring
- Live call status indicators
- Real-time transcript streaming
- Action item detection with highlighting
- Sentiment analysis gauge
- Connection quality indicators

### ✅ Pages
- Home dashboard with stats
- Call Monitor with 3-column layout
- Upload with drag-drop and analysis
- Configuration with all settings
- Audit Log with filtering and bulk actions

### ✅ Responsive Design
- Mobile-first approach
- Breakpoints: 640px (tablet), 1024px (desktop)
- Hamburger menu for mobile
- Flexible grids and layouts

### ✅ Interactions
- Hover states on all interactive elements
- Focus-visible states for accessibility
- Smooth transitions and animations
- Toast notifications (via sonner)
- Modal/drawer patterns

### ✅ Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements for live regions
- Color contrast ratios ≥4.5:1
- Focus management

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Dependencies

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **wouter** - Routing
- **shadcn/ui** - Component library
- **lucide-react** - Icons
- **sonner** - Toast notifications

## 🎨 Design Token Mapping

### Tailwind Config Snippet

```javascript
// tailwind.config.js extension mapping
theme: {
  extend: {
    colors: {
      primary: '#0066CC',
      secondary: '#F5F5F5',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    spacing: {
      '1': '4px',
      '2': '8px',
      '3': '12px',
      // ... etc
    },
    borderRadius: {
      'md': '12px',
      'lg': '20px',
    }
  }
}
```

## 📊 Component → File Mapping

| Figma Component | File Path | Props | Tailwind Classes |
|----------------|-----------|-------|------------------|
| Button.Primary | `components/ui/button.tsx` | `variant="default"` | `bg-[--color-primary] text-white rounded-[--radius-md] px-4 py-2` |
| Button.Secondary | `components/ui/button.tsx` | `variant="secondary"` | `bg-[--color-secondary] text-[--color-text-dark]` |
| Button.Ghost | `components/ui/button.tsx` | `variant="ghost"` | `hover:bg-[--color-secondary]` |
| Card.Default | `components/ui/card.tsx` | - | `bg-white rounded-[--radius-md] border shadow-sm p-6` |
| Input.Default | `components/ui/input.tsx` | - | `border rounded-[--radius-md] px-3 py-2` |
| Badge.Default | `components/ui/badge.tsx` | `variant="outline"` | `rounded-full px-2 py-1 text-xs` |
| StatsCard | `components/StatsCard.tsx` | `title, value, icon` | `p-6 hover:shadow-lg transition-shadow` |
| CallStatusIndicator | `components/CallStatusIndicator.tsx` | `session, showDetails` | Badge-based with dynamic colors |
| RealTimeTranscript | `components/RealTimeTranscript.tsx` | `segments, isLive` | `overflow-y-auto space-y-4` |
| ActionItemRow | `components/ActionItemRow.tsx` | `item, onApprove, onReject` | `p-4 rounded-[--radius-md] border hover:shadow-md` |
| SentimentGauge | `components/SentimentGauge.tsx` | `data, size, showTrend` | SVG circular gauge with animations |

## 🧪 Quality Checks

- ✅ Color contrast ≥4.5:1 for all text
- ✅ Focus-visible states on interactive elements  
- ✅ Keyboard navigation throughout
- ✅ Screen reader support with ARIA
- ✅ Responsive on mobile/tablet/desktop
- ✅ Loading states for async operations
- ✅ Empty states with helpful CTAs
- ✅ Error states with recovery options

## 📝 Notes

This is a **production-ready prototype** with mock data. To connect to real backend:

1. Replace mock data in `/lib/mock-data.ts` with API calls
2. Implement WebSocket connection for real-time features
3. Add authentication context
4. Configure environment variables for API endpoints
5. Implement tRPC client for backend communication

---

**Built with React 19 + Vite + Tailwind 4 + shadcn/ui**
