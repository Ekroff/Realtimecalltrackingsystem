import { useState, Fragment } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Download, ChevronDown, ChevronUp, Check, X, Filter } from 'lucide-react';
import { mockAuditLog, AuditLogEntry, platformIcons, actionTypeIcons } from '../lib/mock-data';

export function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLog);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredLogs.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredLogs.map((log) => log.id)));
    }
  };

  const handleApprove = (id: string) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status: 'success' as const } : log))
    );
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  };

  const handleReject = (id: string) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status: 'failed' as const } : log))
    );
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  };

  const handleBulkApprove = () => {
    setLogs((prev) =>
      prev.map((log) =>
        selectedRows.has(log.id) && log.status === 'pending'
          ? { ...log, status: 'success' as const }
          : log
      )
    );
    setSelectedRows(new Set());
  };

  const handleBulkReject = () => {
    setLogs((prev) =>
      prev.map((log) =>
        selectedRows.has(log.id) && log.status === 'pending'
          ? { ...log, status: 'failed' as const }
          : log
      )
    );
    setSelectedRows(new Set());
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPlatformFilter('all');
    setActionTypeFilter('all');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const handleExport = () => {
    // Simulate CSV export
    const csv = [
      ['Timestamp', 'Platform', 'Action Type', 'Description', 'Status', 'Executed By'].join(','),
      ...filteredLogs.map((log) =>
        [
          log.timestamp.toISOString(),
          log.platform,
          log.actionType,
          `"${log.description}"`,
          log.status,
          log.executedBy,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    // Search query
    if (
      searchQuery &&
      !log.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.executedBy.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Platform filter
    if (platformFilter !== 'all' && log.platform !== platformFilter) {
      return false;
    }

    // Action type filter
    if (actionTypeFilter !== 'all' && log.actionType !== actionTypeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && log.status !== statusFilter) {
      return false;
    }

    // Date range
    if (dateFrom && log.timestamp < new Date(dateFrom)) {
      return false;
    }
    if (dateTo && log.timestamp > new Date(dateTo)) {
      return false;
    }

    return true;
  });

  const statusConfig = {
    success: { color: 'bg-[--color-success] text-white border-0', label: 'Success' },
    failed: { color: 'bg-[--color-error] text-white border-0', label: 'Failed' },
    pending: { color: 'bg-[--color-warning] text-white border-0', label: 'Pending' },
  };

  const pendingCount = filteredLogs.filter((log) => log.status === 'pending').length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Audit Log</h1>
          <p className="text-[--color-text-light]">
            Track all automated actions and system events
          </p>
        </div>
        <div className="flex gap-2">
          {selectedRows.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkApprove}
                className="text-[--color-success] border-[--color-success] hover:bg-[--color-success] hover:text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve ({selectedRows.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkReject}
                className="text-[--color-error] border-[--color-error] hover:bg-[--color-error] hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Reject ({selectedRows.size})
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-[--color-text-light]" />
          <h3>Filters</h3>
          {pendingCount > 0 && (
            <Badge variant="outline" className="bg-[--color-warning] text-white border-0">
              {pendingCount} Pending
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="xl:col-span-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[--color-text-light]" />
              <Input
                id="search"
                placeholder="Search description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Platform */}
          <div>
            <Label htmlFor="platform-filter">Platform</Label>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger id="platform-filter" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="google-meet">Google Meet</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="teams">Teams</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="browser">Browser</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Type */}
          <div>
            <Label htmlFor="action-type-filter">Action Type</Label>
            <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
              <SelectTrigger id="action-type-filter" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="date-from">Date From</Label>
            <Input
              id="date-from"
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="date-to">Date To</Label>
            <Input
              id="date-to"
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {(searchQuery ||
          platformFilter !== 'all' ||
          actionTypeFilter !== 'all' ||
          statusFilter !== 'all' ||
          dateFrom ||
          dateTo) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="mt-4">
            Clear All Filters
          </Button>
        )}
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-[--color-text-light]">
        <span>
          Showing {filteredLogs.length} of {logs.length} entries
        </span>
        {selectedRows.size > 0 && <span>{selectedRows.size} selected</span>}
      </div>

      {/* Audit Log Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[--color-background-alt] border-b border-[--color-border]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredLogs.length > 0 && selectedRows.size === filteredLogs.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-[--color-border]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm">Platform</th>
                <th className="px-4 py-3 text-left text-sm">Type</th>
                <th className="px-4 py-3 text-left text-sm">Description</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Executed By</th>
                <th className="px-4 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[--color-text-light]">
                    No audit log entries found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <Fragment key={log.id}>
                    <tr
                      className="border-b border-[--color-border] hover:bg-[--color-background-alt] transition-colors"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(log.id)}
                          onChange={() => toggleSelectRow(log.id)}
                          className="w-4 h-4 rounded border-[--color-border]"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        {log.timestamp.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" role="img">
                            {platformIcons[log.platform]}
                          </span>
                          <span className="text-sm capitalize">
                            {log.platform.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" role="img">
                            {actionTypeIcons[log.actionType]}
                          </span>
                          <span className="text-sm capitalize">{log.actionType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm max-w-md truncate">
                        {log.description}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={statusConfig[log.status].color}>
                          {statusConfig[log.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm">{log.executedBy}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {log.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(log.id)}
                                className="text-[--color-success]"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(log.id)}
                                className="text-[--color-error]"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(log.id)}
                          >
                            {expandedRows.has(log.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(log.id) && (
                      <tr className="bg-[--color-background-alt]">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[--color-text-light]">ID:</span>{' '}
                                <span>{log.id}</span>
                              </div>
                              <div>
                                <span className="text-[--color-text-light]">Timestamp:</span>{' '}
                                <span>{log.timestamp.toISOString()}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[--color-text-light]">Full Description:</span>{' '}
                              <span>{log.description}</span>
                            </div>
                            {log.metadata && (
                              <div>
                                <span className="text-[--color-text-light]">Metadata:</span>
                                <pre className="mt-2 p-3 bg-white rounded-[--radius-md] text-xs overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
