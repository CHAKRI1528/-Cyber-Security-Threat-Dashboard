import React, { useEffect, useState } from 'react';
import { threatService } from '../services/api';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ThreatCharts() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await threatService.getThreatAnalytics();
      const data = response.data.data;

      setAnalyticsData({
        byType: Object.entries(data.byType).map(([key, value]) => ({
          name: key.replace('_', ' ').toUpperCase(),
          value,
        })),
        bySeverity: Object.entries(data.bySeverity).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
        })),
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading charts...</div>;
  if (!analyticsData) return <div className="text-center text-gray-500">No data</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Threats by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analyticsData.byType}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {analyticsData.byType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Threats by Severity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.bySeverity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
