import React, { useEffect, useState } from 'react';
import { alertService, connectSocket, setupSocketListeners } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { FaBell } from 'react-icons/fa';

export default function AlertList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();

    const unsubscribe = setupSocketListeners(
      null,
      (newAlert) => {
        setAlerts(prev => [newAlert.alert, ...prev].slice(0, 50));
      },
      null
    );

    connectSocket().emit('subscribe-alerts');

    const interval = setInterval(fetchAlerts, 10000);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await alertService.getActiveAlerts();
      setAlerts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-600 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-black',
      low: 'bg-blue-500 text-white',
      info: 'bg-green-500 text-white',
    };
    return colors[severity] || 'bg-gray-500 text-white';
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

  if (loading) return <div className="text-center text-gray-500">Loading alerts...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaBell className="mr-2 text-red-500" />
        Active Alerts ({alerts.length})
      </h2>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAcknowledge(alert._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleResolve(alert._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Resolve
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">{alert.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
              </p>
              {alert.recommendations && alert.recommendations.length > 0 && (
                <div className="mt-3 bg-blue-50 p-3 rounded text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Recommendations:</p>
                  <ul className="text-blue-800 space-y-1">
                    {alert.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
