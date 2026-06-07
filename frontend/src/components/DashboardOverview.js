import React, { useEffect, useState } from 'react';
import { FaExclamationCircle, FaArrowUp, FaCheckCircle, FaClock, FaFire } from 'react-icons/fa';
import { statsService } from '../services/api';
import StatCard from './StatCard';

export default function DashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await statsService.getDashboardOverview();
      setOverview(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!overview) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Threats"
        value={overview.summary.totalThreats}
        icon={FaExclamationCircle}
        color="bg-red-500"
      />
      <StatCard
        title="Active Threats"
        value={overview.summary.activeThreats || 0}
        icon={FaFire}
        color="bg-orange-500"
      />
      <StatCard
        title="Resolved"
        value={overview.summary.resolvedThreats || 0}
        icon={FaCheckCircle}
        color="bg-green-500"
      />
      <StatCard
        title="Active Alerts"
        value={overview.summary.activeAlerts}
        icon={FaArrowUp}
        color="bg-yellow-500"
      />
      <StatCard
        title="Avg Severity"
        value={`${overview.summary.averageSeverity}/10`}
        icon={FaClock}
        color="bg-blue-500"
      />
    </div>
  );
}
