import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPatient from './pages/DashboardPatient';
import DashboardMedecin from './pages/DashboardMedecin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-patient" element={<DashboardPatient />} />
        <Route path="/dashboard-medecin" element={<DashboardMedecin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;