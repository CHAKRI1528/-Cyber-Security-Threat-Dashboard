import React from 'react';
import DashboardOverview from '../components/DashboardOverview';
import ThreatCharts from '../components/ThreatCharts';
import ThreatList from '../components/ThreatList';
import AlertList from '../components/AlertList';
import URLCheckHistory from '../components/URLCheckHistory';

export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Security Dashboard</h1>

        {/* Overview Stats */}
        <DashboardOverview />

        {/* Charts */}
        <ThreatCharts />

        {/* URL Check History */}
        <div className="mt-8">
          <URLCheckHistory />
        </div>

        {/* Threats and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <ThreatList />
          </div>
          <div>
            <AlertList />
          </div>
        </div>
      </div>
    </div>
  );
}
