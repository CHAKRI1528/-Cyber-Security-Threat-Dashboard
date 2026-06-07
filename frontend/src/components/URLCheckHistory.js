import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSync } from 'react-icons/fa';

export default function URLCheckHistory() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchURLChecks();
  }, []);

  const fetchURLChecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/threats?type=url_check&limit=10`);
      
      if (!response.ok) throw new Error('Failed to fetch URL checks');
      
      const data = await response.json();
      setChecks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'text-red-600 bg-red-100 border-red-300';
    if (severity >= 5) return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-green-600 bg-green-100 border-green-300';
  };

  const truncateURL = (url, length = 45) => {
    return url.length > length ? url.substring(0, length) + '...' : url;
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <h3 className="text-lg font-bold text-gray-900 mb-3">URL Check History</h3>
        <p className="text-red-600">Error loading URL checks: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">URL Check History</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            {checks.length}
          </span>
        </div>
        <button
          onClick={fetchURLChecks}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          title="Refresh"
        >
          <FaSync className={`${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <FaSync className="text-2xl text-blue-600 animate-spin" />
        </div>
      ) : checks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No URL checks performed yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {checks.map((check) => (
            <div
              key={check._id}
              className={`p-3 rounded-lg border-l-4 ${getSeverityColor(check.severity)} bg-opacity-20`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="text-lg">
                    {check.isSuspicious ? (
                      <FaExclamationCircle className="text-red-600" />
                    ) : (
                      <FaCheckCircle className="text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {check.isSuspicious ? '⚠️ Suspicious' : '✅ Safe'}
                    </p>
                    <p className="text-xs text-gray-600 truncate" title={check.url}>
                      {truncateURL(check.url || check.sourceData?.url || 'Unknown')}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(check.severity)}`}>
                  {check.severity.toFixed(1)}/10
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {formatDate(check.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
