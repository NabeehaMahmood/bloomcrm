'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface LeadListProps {
  leads: any[];
  user: any;
  filters: { status: string; priority: string };
  setFilters: (filters: any) => void;
}

export default function LeadList({ leads, user, filters, setFilters }: LeadListProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge-high">🔴 High</span>;
      case 'medium':
        return <span className="badge-medium">🟡 Medium</span>;
      case 'low':
        return <span className="badge-low">🟢 Low</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      interested: 'bg-yellow-100 text-yellow-800',
      negotiating: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="section-heading">Leads</h1>
          <p className="section-subheading">Manage and track your leads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="negotiating">Negotiating</option>
          <option value="closed_won">Closed Won</option>
          <option value="closed_lost">Closed Lost</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-bloom-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-b hover:bg-bloom-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                <td className="px-6 py-4 text-gray-900">
                  PKR {lead.budget.toLocaleString()}
                </td>
                <td className="px-6 py-4">{getPriorityBadge(lead.priority)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/leads/${lead._id}`}
                    className="text-bloom-600 hover:text-bloom-700 font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
}
