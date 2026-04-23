'use client';

import { useState } from 'react';
import axios from 'axios';
import { getWhatsAppClickToChat } from '@/lib/whatsapp';

interface LeadDetailProps {
  lead: any;
  activities: any[];
  user: any;
}

export default function LeadDetail({ lead, activities, user }: LeadDetailProps) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const handleStatusChange = async (newStatus: string) => {
    try {
      setSaving(true);
      await axios.patch(
        `/api/leads/${lead._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSetFollowup = async () => {
    if (!nextFollowUp) return;

    try {
      setSaving(true);
      await axios.patch(
        `/api/leads/${lead._id}`,
        { nextFollowUp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNextFollowUp('');
      alert('Follow-up date set successfully');
    } catch (error) {
      console.error('Failed to set follow-up:', error);
    } finally {
      setSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return '';
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={() => window.history.back()}
        className="mb-6 text-bloom-600 hover:text-bloom-700 font-medium"
      >
        ← Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-3xl font-bold">{lead.name}</h1>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Email</label>
                  <p className="text-lg text-gray-800">{lead.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Phone</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg text-gray-800">{lead.phone}</p>
                    <a
                      href={getWhatsAppClickToChat(
                        lead.phone,
                        'Hello, I am reaching out regarding your property inquiry.'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-bold"
                      title="Open WhatsApp"
                    >
                      💬
                    </a>
                  </div>
                </div>
              </div>

              {/* Property & Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 font-medium">
                    Property Interest
                  </label>
                  <p className="text-lg text-gray-800">{lead.propertyInterest}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Budget</label>
                  <p className="text-lg text-gray-800 font-bold">
                    PKR {lead.budget.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Priority & Score */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Priority</label>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg border font-bold ${getPriorityColor(
                      lead.priority
                    )}`}
                  >
                    {lead.priority.toUpperCase()}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Score</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-bloom-500 h-2 rounded-full"
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-lg">{lead.score}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-gray-500 font-medium block mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm text-gray-500 font-medium block mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Add notes about this lead..."
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="text-sm text-gray-500 font-medium block mb-2">
                  Set Follow-up Date
                </label>
                <div className="flex space-x-2">
                  <input
                    type="datetime-local"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSetFollowup}
                    disabled={saving || !nextFollowUp}
                    className="btn-primary disabled:opacity-50"
                  >
                    Set
                  </button>
                </div>
                {lead.nextFollowUp && (
                  <p className="text-sm text-gray-500 mt-2">
                    Next follow-up: {new Date(lead.nextFollowUp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Activity Timeline</h2>
            </div>
            <div className="p-6">
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity._id} className="border-l-4 border-bloom-500 pl-4">
                      <p className="font-semibold text-gray-800">
                        {activity.action.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        By: {activity.performedBy?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No activities yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
