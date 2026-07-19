import React from 'react';

function DetailedAnalysis({ analysis }) {
  return (
    <div className="detailed-analysis">
      <div className="analysis-section">
        <h3>✅ Strengths</h3>
        {analysis.components && analysis.components.length > 0 ? (
          <ul className="components-list">
            {analysis.components.map((comp, idx) => (
              <li key={idx}>{comp}</li>
            ))}
          </ul>
        ) : (
          <p className="no-items">No strengths detected</p>
        )}
      </div>

      {analysis.issues && analysis.issues.length > 0 && (
        <div className="analysis-section">
          <h3>⚠️ Issues Found</h3>
          <div className="issues-list">
            {['critical', 'high', 'medium', 'low'].map(severity => {
              const items = analysis.issues.filter(i => i.type === severity);
              if (items.length === 0) return null;

              return (
                <div key={severity} className={`issue-group ${severity}`}>
                  <h4>{severity.charAt(0).toUpperCase() + severity.slice(1)}</h4>
                  {items.map((issue, idx) => (
                    <p key={idx}>• {issue.message}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="analysis-section">
          <h3>💡 Suggestions</h3>
          <ul className="suggestions-list">
            {analysis.suggestions.map((sugg, idx) => (
              <li key={idx}>{sugg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="analysis-footer">
        <h4>🔐 Security Best Practices:</h4>
        <ul>
          <li>Use at least 12-16 characters</li>
          <li>Mix uppercase, lowercase, numbers, and symbols</li>
          <li>Avoid common words or personal information</li>
          <li>Don't reuse passwords across services</li>
          <li>Change passwords regularly</li>
          <li>Use a password manager to store securely</li>
        </ul>
      </div>
    </div>
  );
}

export default DetailedAnalysis;