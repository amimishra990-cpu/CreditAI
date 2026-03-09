import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import DataIngestion from './pages/DataIngestion';
import AgentAnalysis from './pages/AgentAnalysis';
import Orchestrator from './pages/Orchestrator';
import EarlyWarning from './pages/EarlyWarning';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/data-ingestion" element={<DataIngestion />} />
        <Route path="/agent-analysis" element={<AgentAnalysis />} />
        <Route path="/orchestrator" element={<Orchestrator />} />
        <Route path="/early-warning" element={<EarlyWarning />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
