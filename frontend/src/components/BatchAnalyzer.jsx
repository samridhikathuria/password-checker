import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function BatchAnalyzer({ apiUrl, onComplete }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${apiUrl}/api/batch-analyze`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResults(response.data.analyses);
      onComplete();
    } catch (err) {
      setError('Failed to analyze file. Ensure it has a "password" column.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'password\nPassword1!\nTest@123\nmyPassword123';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password_template.csv';
    a.click();
  };

  return (
    <div className="batch-analyzer">
      <div className="batch-upload">
        <h2>Batch Password Analysis</h2>
        <p>Upload a CSV file with passwords to analyze multiple at once</p>

        <div className="upload-section">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
            id="batch-file-input"
          />
          <label htmlFor="batch-file-input" className="upload-button">
            {loading ? 'Analyzing...' : 'Choose CSV File'}
          </label>
        </div>

        <button className="template-button" onClick={downloadTemplate}>
          📥 Download Template
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {results && (
        <div className="batch-results">
          <h3>Results ({results.length} passwords analyzed)</h3>
          
          <table className="results-table">
            <thead>
              <tr>
                <th>Password Length</th>
                <th>Strength</th>
                <th>Score</th>
                <th>Entropy</th>
                <th>Crack Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} className={`rating-${result.strength_rating.toLowerCase().replace(' ', '-')}`}>
                  <td>{result.password_length}</td>
                  <td>{result.strength_rating}</td>
                  <td>{result.strength_score}/100</td>
                  <td>{result.entropy} bits</td>
                  <td>{result.crack_time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="batch-summary">
            <h4>Summary</h4>
            <p>
              {results.filter(r => r.strength_score >= 80).length} very strong,
              {' '}{results.filter(r => r.strength_score >= 70 && r.strength_score < 80).length} strong,
              {' '}{results.filter(r => r.strength_score < 50).length} weak passwords
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchAnalyzer;