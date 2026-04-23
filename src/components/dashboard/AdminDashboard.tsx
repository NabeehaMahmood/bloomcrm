'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateLeadModal from '@/components/leads/CreateLeadModal';

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="section-heading">Admin Dashboard</h1>
          <p className="section-subheading">
            Welcome back, {user.name}! 🌸
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>➕</span>
          <span>New Lead</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-bloom-600 mt-2">
                  {analytics?.totalLeads || 0}
                </p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </div>
        </div>

        {/* Leads by Priority */}
        {analytics?.leadsByPriority?.map((priority: any) => (
          <div key={priority._id} className="card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium capitalize">
                    {priority._id} Priority
                  </p>
                  <p className="text-3xl font-bold text-bloom-600 mt-2">
                    {priority.count}
                  </p>
                </div>
                <span className="text-4xl">
                  {priority._id === 'high' && '🔴'}
                  {priority._id === 'medium' && '🟡'}
                  {priority._id === 'low' && '🟢'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lead Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Lead Status Distribution</h2>
          </div>
          <div className="p-6">
            {analytics?.leadsByStatus && analytics.leadsByStatus.length > 0 ? (
              <div className="space-y-4">
                {analytics.leadsByStatus.map((status: any) => (
                  <div key={status._id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700 capitalize">
                        {status._id.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-bloom-600">{status.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-bloom h-2 rounded-full"
                        style={{
                          width: `${
                            (status.count / (analytics.totalLeads || 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No leads data</p>
            )}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Agent Performance</h2>
          </div>
          <div className="p-6">
            {analytics?.agentPerformance && analytics.agentPerformance.length > 0 ? (
              <div className="space-y-4">
                {analytics.agentPerformance.map((agent: any) => (
                  <div key={agent.agentId} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{agent.agentName}</p>
                        <p className="text-sm text-gray-500">{agent.agentEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-bloom-600">
                          {agent.closureRate}%
                        </p>
                        <p className="text-sm text-gray-500">closure rate</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{agent.totalAssigned} assigned</span>
                      <span className="mx-2">•</span>
                      <span>{agent.totalClosed} closed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No agents</p>
            )}
          </div>
        </div>
      </div>

      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLeadCreated={() => {
          setIsModalOpen(false);
          // Refresh analytics
          window.location.reload();
        }}
        token={token!}
      />
    </div>
  );
}
