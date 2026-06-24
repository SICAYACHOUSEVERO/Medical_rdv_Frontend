import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

function DashboardMedecin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'MEDECIN') {
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
        <h2>Bienvenue,  {user.nom}</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <p>Email : {user.email}</p>
      <p>Rôle : Médecin</p>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h3>Mon planning</h3>
      <p style={{ color: '#888' }}>
        (La liste de vos rendez-vous, l'acceptation/refus et la gestion des disponibilités seront ajoutées au Jour 5)
      </p>
    </div>
  );
}

export default DashboardMedecin;