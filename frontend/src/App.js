import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Threats from './pages/Threats';
import Alerts from './pages/Alerts';
import URLChecker from './pages/URLChecker';
import './App.css';

function App() {
  useEffect(() => {
    document.title = 'CyberGuard - Threat Monitoring';
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/url-checker" element={<URLChecker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
