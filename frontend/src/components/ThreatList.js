import React, { useEffect, useState } from 'react';
import { threatService, connectSocket, setupSocketListeners } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { FaExclamationCircle, FaBolt } from 'react-icons/fa';

export default function ThreatList() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();

    const unsubscribe = setupSocketListeners(
      (newThreat) => {
        setThreats(prev => [newThreat.threat, ...prev].slice(0, 50));
      },
      null,
      null
    );

    connectSocket().emit('subscribe-threats');

    const interval = setInterval(fetchThreats, 10000);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const fetchThreats = async () => {
    try {
      const response = await threatService.getLatestThreats(50);
      setThreats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching threats:', error);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 9) return 'bg-red-600';
    if (severity >= 7) return 'bg-orange-500';
    if (severity >= 5) return 'bg-yellow-500';
    if (severity >= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getSeverityText = (severity) => {
    if (severity >= 9) return 'CRITICAL';
    if (severity >= 7) return 'HIGH';
    if (severity >= 5) return 'MEDIUM';
    if (severity >= 3) return 'LOW';
    return 'INFO';
  };

  if (loading) return <div className="text-center text-gray-500">Loading threats...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold flex items-center">
          <FaBolt className="mr-2 text-yellow-500" />
          Recent Threats ({threats.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Detection</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {threats.map((threat) => (
              <tr key={threat._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                    threat.status === 'new' ? 'bg-red-500' :
                    threat.status === 'investigating' ? 'bg-yellow-500' :
                    threat.status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {threat.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                  {threat.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {threat.type.replace('_', ' ')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getSeverityColor(threat.severity)}`}>
                    {getSeverityText(threat.severity)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {threat.source}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {threat.confidence ? `${threat.confidence.toFixed(0)}%` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(threat.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
