import React, { useState } from 'react';
import { FaShieldAlt, FaExclamationCircle, FaCheckCircle, FaSearch, FaDatabase } from 'react-icons/fa';

export default function URLChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const checkURL = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setSaved(false);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/threats/check-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check URL');
      }

      const data = await response.json();
      setResult(data.data);
      setSaved(data.saved || false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkURL();
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'text-red-600 bg-red-100';
    if (severity >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityLabel = (severity) => {
    if (severity >= 8) return 'CRITICAL';
    if (severity >= 5) return 'MEDIUM';
    return 'LOW';
  };

  const getThreatIcon = (isSuspicious) => {
    return isSuspicious ? (
      <FaExclamationCircle className="text-red-600" />
    ) : (
      <FaCheckCircle className="text-green-600" />
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-3xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">URL Security Checker</h1>
          </div>
          <p className="text-gray-600">Check if a website is malicious or suspicious</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={checkURL}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
            >
              <FaSearch />
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Saved Indicator */}
            {saved && (
              <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <FaDatabase className="text-lg" />
                <span className="font-semibold">✓ Check result saved to dashboard</span>
              </div>
            )}

            {/* Main Result Card */}
            <div className={`p-6 rounded-lg mb-6 ${result.isSuspicious ? 'bg-red-50 border-2 border-red-300' : 'bg-green-50 border-2 border-green-300'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {getThreatIcon(result.isSuspicious)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {result.isSuspicious ? '⚠️ SUSPICIOUS SITE' : '✅ SAFE SITE'}
                    </h2>
                    <p className="text-gray-600">{url}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold ${getSeverityColor(result.severity)}`}>
                  {getSeverityLabel(result.severity)}
                  <br />
                  Severity: {result.severity.toFixed(1)}/10
                </div>
              </div>
            </div>

            {/* Threat Details */}
            {result.threats && result.threats.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Threat Details</h3>
                <div className="space-y-3">
                  {result.threats.map((threat, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{threat.type}</h4>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                          {threat.confidence.toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-gray-600">{threat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indicators */}
            {result.indicators && Object.keys(result.indicators).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Detection Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.indicators).map(([key, value]) => (
                    <div key={key} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {result.tags && result.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Classification Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, idx) => {
                    let bgColor = 'bg-gray-200';
                    if (tag === 'malicious') bgColor = 'bg-red-200';
                    if (tag === 'suspicious') bgColor = 'bg-orange-200';
                    if (tag === 'safe') bgColor = 'bg-green-200';
                    if (tag === 'verified') bgColor = 'bg-blue-200';

                    return (
                      <span key={idx} className={`${bgColor} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Source Info */}
            <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
              <p>Source: <span className="font-semibold capitalize">{result.source}</span></p>
              <p>Checked: {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !error && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Enter a URL above and click "Check" to scan for threats</p>
          </div>
        )}
      </div>
    </div>
  );
}
