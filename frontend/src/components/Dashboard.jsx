import React from 'react';

function Dashboard({ stats }) {
  return (
    <div className="dashboard">
      <h2>Analytics Dashboard</h2>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total_analyses}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
          
          <div className="stat-card weak">
            <div className="stat-value">{stats.weak_passwords}</div>
            <div className="stat-label">Weak Passwords</div>
          </div>
          
          <div className="stat-card strong">
            <div className="stat-value">{stats.strong_passwords}</div>
            <div className="stat-label">Strong Passwords</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.average_entropy?.toFixed(1)}</div>
            <div className="stat-label">Avg Entropy (bits)</div>
          </div>
        </div>
      )}

      <div className="dashboard-info">
        <h3>Understanding Password Security</h3>
        
        <div className="info-section">
          <h4>🔢 Password Length</h4>
          <p>
            Longer passwords are exponentially harder to crack. A 12-character password is billions of times more secure than an 8-character one.
          </p>
        </div>

        <div className="info-section">
          <h4>🎲 Character Variety</h4>
          <p>
            Using uppercase, lowercase, numbers, and symbols increases password entropy. Each character type adds another layer of security.
          </p>
        </div>

        <div className="info-section">
          <h4>📊 Entropy</h4>
          <p>
            Entropy measures randomness. Higher entropy means the password is harder to guess. 50+ bits of entropy is considered strong.
          </p>
        </div>

        <div className="info-section">
          <h4>⏱️ Crack Time</h4>
          <p>
            Estimated time to crack using brute force (1 billion attempts/second). Strong passwords take millions of years.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;