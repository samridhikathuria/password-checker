import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import DetailedAnalysis from './components/DetailedAnalysis';
import BatchAnalyzer from './components/BatchAnalyzer';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [currentView, setCurrentView] = useState('analyzer');
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handlePasswordChange = async (pwd) => {
    setPassword(pwd);
    setError(null);
    
    if (!pwd) {
      setAnalysis(null);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/analyze`,
        { password: pwd },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAnalysis(response.data);
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAnalysisComplete = () => {
    fetchStats();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Password Strength Checker</h1>
        <p>Get instant feedback on your password security</p>
      </header>

      <nav className="app-nav">
        <button 
          className={currentView === 'analyzer' ? 'active' : ''} 
          onClick={() => setCurrentView('analyzer')}
        >
          Analyzer
        </button>
        <button 
          className={currentView === 'batch' ? 'active' : ''} 
          onClick={() => setCurrentView('batch')}
        >
          Batch Analysis
        </button>
        <button 
          className={currentView === 'dashboard' ? 'active' : ''} 
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </button>
      </nav>

      <main className="app-main">
        {currentView === 'analyzer' && (
          <div className="analyzer-section">
            {error && <div className="error-message">{error}</div>}
            
            <PasswordInput 
              password={password}
              onChange={handlePasswordChange}
              loading={loading}
            />

            {analysis && (
              <div className="analysis-results">
                <StrengthMeter analysis={analysis} />
                <DetailedAnalysis analysis={analysis} />
              </div>
            )}

            {!analysis && !password && (
              <div className="empty-state">
                <p>Start typing a password to see real-time analysis</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'batch' && (
          <BatchAnalyzer 
            apiUrl={API_URL}
            onComplete={handleBatchAnalysisComplete}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard stats={stats} />
        )}
      </main>

      <footer className="app-footer">
        <p>🔒 Your passwords are not stored or transmitted. Analysis happens locally.</p>
        <p>© 2024 Password Strength Checker | Security Education Tool</p>
      </footer>
    </div>
  );
}

export default App;