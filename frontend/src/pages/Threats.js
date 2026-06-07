import React, { useState, useEffect } from 'react';
import { threatService } from '../services/api';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function Threats() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    type: '',
    source: '',
  });

  useEffect(() => {
    fetchThreats();
  }, [filters]);

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const response = await threatService.getAllThreats(filters);
      setThreats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching threats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const threatTypes = ['malware', 'ip_reputation', 'vulnerability', 'network_anomaly', 'phishing'];
  const sources = ['abuseipdb', 'virustotal', 'shodan', 'misp', 'internal'];

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Threats</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaFilter className="mr-2" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Severity</label>
              <input
                type="number"
                min="0"
                max="10"
                placeholder="Min severity"
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">All Types</option>
                {threatTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Source</label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">All Sources</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Threats List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : threats.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No threats found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {threats.map((threat) => (
                    <tr key={threat._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{threat.title}</td>
                      <td className="px-6 py-4 text-gray-600">{threat.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${
                          threat.severity >= 9 ? 'bg-red-600' :
                          threat.severity >= 7 ? 'bg-orange-500' :
                          threat.severity >= 5 ? 'bg-yellow-500' :
                          threat.severity >= 3 ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {threat.severity.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{threat.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                          threat.status === 'new' ? 'bg-red-500' :
                          threat.status === 'investigating' ? 'bg-yellow-500' :
                          threat.status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                          {threat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{threat.confidence?.toFixed(0) || '-'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
