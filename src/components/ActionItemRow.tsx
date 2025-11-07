import { useState } from 'react';
import { ActionItem } from '../lib/mock-data';
import { Check, X, Edit2, Clock, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface ActionItemRowProps {
  item: ActionItem;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<ActionItem>) => void;
}

export function ActionItemRow({ item, onApprove, onReject, onUpdate }: ActionItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text);

  const priorityConfig = {
    low: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Low' },
    medium: { color: 'bg-[--color-warning] text-white border-[--color-warning]', label: 'Medium' },
    high: { color: 'bg-[--color-error] text-white border-[--color-error]', label: 'High' },
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
    executed: { color: 'bg-[--color-success] text-white border-[--color-success]', label: 'Executed' },
  };

  const handleSaveEdit = () => {
    if (onUpdate && editedText !== item.text) {
      onUpdate(item.id, { text: editedText });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(item.text);
    setIsEditing(false);
  };

  return (
    <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        {/* Priority Indicator */}
        <div
          className={`w-1.5 h-full min-h-[80px] rounded-full ${priorityConfig[item.priority].color.split(' ')[0]} shadow-sm`}
          aria-label={`Priority: ${item.priority}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`${priorityConfig[item.priority].color} shadow-sm`}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {priorityConfig[item.priority].label}
              </Badge>
              <Badge variant="outline" className={`${statusConfig[item.status].color} shadow-sm`}>
                {statusConfig[item.status].label}
              </Badge>
            </div>

            {item.status === 'pending' && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                aria-label="Edit action item"
                className="hover:bg-white/60"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Text */}
          {isEditing ? (
            <div className="space-y-3 mb-3">
              <Input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mb-3">{item.text}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[--color-text-light] mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{item.assignee}</span>
            </div>
            {item.deadline && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{item.deadline}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs">
              <span>Detected {item.detectedAt.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Actions */}
          {item.status === 'pending' && !isEditing && (onApprove || onReject) && (
            <div className="flex gap-2 pt-3 border-t border-[--color-border]">
              {onApprove && (
                <Button
                  size="sm"
                  onClick={() => onApprove(item.id)}
                  className="bg-[--color-success] hover:bg-[--color-success-dark]"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(item.id)}
                  className="text-[--color-error] border-[--color-error] hover:bg-[--color-error] hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}