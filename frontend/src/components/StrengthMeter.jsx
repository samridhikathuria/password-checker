import React from 'react';

function StrengthMeter({ analysis }) {
  const score = analysis.strength_score;
  const rating = analysis.strength_rating;
  
  let color, icon;
  
  if (score >= 80) {
    color = 'very-strong';
    icon = '✅';
  } else if (score >= 70) {
    color = 'strong';
    icon = '✔️';
  } else if (score >= 50) {
    color = 'moderate';
    icon = '⚠️';
  } else if (score >= 25) {
    color = 'weak';
    icon = '❌';
  } else {
    color = 'very-weak';
    icon = '🚫';
  }

  return (
    <div className={`strength-meter ${color}`}>
      <div className="meter-icon">{icon}</div>
      
      <div className="meter-content">
        <div className="meter-rating">{rating}</div>
        
        <div className="meter-bar">
          <div className="meter-fill" style={{ width: `${score}%` }}></div>
        </div>
        
        <div className="meter-stats">
          <div className="stat">
            <span>Score</span>
            <strong>{score}/100</strong>
          </div>
          <div className="stat">
            <span>Entropy</span>
            <strong>{analysis.entropy} bits</strong>
          </div>
          <div className="stat">
            <span>Crack Time</span>
            <strong>{analysis.crack_time}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrengthMeter;