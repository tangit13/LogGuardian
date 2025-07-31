import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './LogViewer.css';

// Use the full backend URL for the socket connection
const socket = io(); // Update this to your backend URL

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredType, setFilteredType] = useState('All');
  const [browserInfo, setBrowserInfo] = useState('');
  const [startTime] = useState(Date.now());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setBrowserInfo(userAgent);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new-log', (log) => {
      setLogs(prevLogs => [log, ...prevLogs]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getRowClass = (type) => {
    switch (type?.toUpperCase()) {
      case 'ERROR': return 'log-row error';
      case 'WARN': return 'log-row warn';
      case 'INFO': return 'log-row info';
      default: return 'log-row';
    }
  };

  const getFilteredLogs = () => {
    if (filteredType === 'All') return logs;
    return logs.filter(log => log.AnomalyType?.toUpperCase() === filteredType.toUpperCase());
  };

  const sessionDuration = Math.floor((Date.now() - startTime) / 1000);

  return (
    <div className="log-container">
      <div className="log-header">
        <h2 className="log-title">Anomaly Logs</h2>
        <div className={`live-indicator ${connected ? 'online' : 'offline'}`}>
          <span className="dot" />
          {connected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>

      <div className="info-section">
        <div><strong>Browser:</strong> {browserInfo}</div>
        <div><strong>Session Duration:</strong> {sessionDuration} seconds</div>
        <div>
          <label htmlFor="filter">Filter Logs:</label>
          <select id="filter" value={filteredType} onChange={(e) => setFilteredType(e.target.value)}>
            <option value="All">All</option>
            <option value="Info">Info</option>
            <option value="Warn">Warn</option>
            <option value="Error">Error</option>
          </select>
        </div>
      </div>

      <table className="log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Anomaly Type</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredLogs().map((log, index) => (
            <tr key={index} className={getRowClass(log.AnomalyType)}>
              <td>{log.Timestamp}</td>
              <td>{log.AnomalyType}</td>
              <td>{log.Message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;
