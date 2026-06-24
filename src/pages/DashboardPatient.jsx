import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

function DashboardPatient() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'PATIENT') {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Bienvenue, {user.nom}</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <p>Email : {user.email}</p>
      <p>Rôle : Patient</p>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h3>Mes rendez-vous</h3>
      <p style={{ color: '#888' }}>
        (La liste de vos rendez-vous et la prise de rendez-vous seront ajoutées au Jour 5)
      </p>
    </div>
  );
}

export default DashboardPatient;