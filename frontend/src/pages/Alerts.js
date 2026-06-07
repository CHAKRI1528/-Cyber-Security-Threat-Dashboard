import React, { useState, useEffect } from 'react';
import { alertService } from '../services/api';
import { FaFilter } from 'react-icons/fa';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
  });

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAllAlerts(filters);
      setAlerts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await alertService.acknowledgeAlert(alertId, 'Current User');
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await alertService.resolveAlert(alertId);
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const severities = ['critical', 'high', 'medium', 'low', 'info'];
  const statuses = ['active', 'acknowledged', 'resolved'];

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Alerts Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaFilter className="mr-2" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">All Severities</option>
                {severities.map(sev => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center text-gray-500">No alerts found</div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${
                          alert.severity === 'critical' ? 'bg-red-600' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' :
                          alert.severity === 'low' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          alert.status === 'active' ? 'bg-red-100 text-red-800' :
                          alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{alert.title}</h3>
                      <p className="text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <div className="space-x-2 ml-4">
                      {alert.status === 'active' && (
                        <button
                          onClick={() => handleAcknowledge(alert._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Ack
                        </button>
                      )}
                      {alert.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolve(alert._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>

                  {alert.recommendations && alert.recommendations.length > 0 && (
                    <div className="mt-3 bg-blue-50 p-3 rounded text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Recommendations:</p>
                      <ul className="text-blue-800 space-y-1">
                        {alert.recommendations.map((rec, idx) => (
                          <li key={idx}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
