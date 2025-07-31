import React from 'react';
import LogViewer from './components/LogViewer';
import './logger.js'; // 👈 This will activate browser logging globally


function App() {
  return (
    <div className="App">
      <h1 className="dashboard-title">LogGuardian Dashboard</h1>
      <LogViewer />
    </div>
  );
}

export default App;
