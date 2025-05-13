import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { CallCenter } from './components/call-center/CallCenter';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call-center" element={<CallCenter />} />
            <Route path="/b2b" element={<CallCenter />} />
            <Route path="/b2c" element={<CallCenter />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
);
};

export default App;
