import React, { useState } from 'react';

function PasswordInput({ password, onChange, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a password to analyze..."
          className="password-input"
          disabled={loading}
        />
        <button
          className="toggle-visibility"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      
      <div className="input-info">
        <p>💡 <strong>Security Tip:</strong> Never use the same password twice. Create unique passwords for each service.</p>
      </div>
    </div>
  );
}

export default PasswordInput;