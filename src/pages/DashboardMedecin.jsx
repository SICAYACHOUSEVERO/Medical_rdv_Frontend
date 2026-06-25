import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import {
  getPlanningMedecin,
  confirmerRendezVous,
  refuserRendezVous,
  ajouterDisponibilite,
} from '../services/rendezVousService';

function DashboardMedecin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [planning, setPlanning] = useState([]);
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'MEDECIN') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadPlanning(currentUser.id);
  }, [navigate]);

  const loadPlanning = async (medecinId) => {
    try {
      const data = await getPlanningMedecin(medecinId);
      setPlanning(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmer = async (rendezVousId) => {
    try {
      await confirmerRendezVous(rendezVousId);
      setMessage('Rendez-vous confirmé.');
      loadPlanning(user.id);
    } catch (err) {
      setError('Erreur lors de la confirmation.');
    }
  };

  const handleRefuser = async (rendezVousId) => {
    try {
      await refuserRendezVous(rendezVousId);
      setMessage('Rendez-vous refusé.');
      loadPlanning(user.id);
    } catch (err) {
      setError('Erreur lors du refus.');
    }
  };

  const handleAjouterDisponibilite = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!date || heureDebut === '' || heureFin === '') {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await ajouterDisponibilite({
        date: date,
        heureDebut: parseInt(heureDebut),
        heureFin: parseInt(heureFin),
        medecin: { id: user.id },
      });
      setMessage('Disponibilité ajoutée avec succès !');
      setDate('');
      setHeureDebut('');
      setHeureFin('');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout.");
    }
  };
  const formatDateFr = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Bienvenue, Dr. {user.nom}</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <p>Email : {user.email}</p>
      <p>Rôle : Médecin</p>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h3>Ajouter une disponibilité</h3>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleAjouterDisponibilite}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

     <div className="form-group">
        <label>Heure de début</label>
        <input
           type="number"
           min="0"
           max="23"
           list="heures-list"
           value={heureDebut}
           onChange={(e) => setHeureDebut(e.target.value)}
           placeholder="Ex: 9"
          />
     </div>

     <div className="form-group">
        <label>Heure de fin</label>
        <input
            type="number"
            min="0"
            max="23"
            list="heures-list"
            value={heureFin}
            onChange={(e) => setHeureFin(e.target.value)}
            placeholder="Ex: 17"
        />
      </div>

        <button type="submit" className="btn-submit">
          Ajouter la disponibilité
        </button>
      </form>

      <datalist id="heures-list">
          {[...Array(24).keys()].map((h) => (
          <option key={h} value={h} />
          ))}
      </datalist>

      <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h3>Mon planning</h3>

      {planning.length === 0 ? (
        <p style={{ color: '#888' }}>Aucun rendez-vous pour le moment.</p>
      ) : (
        planning.map((rdv) => (
          <div
            key={rdv.id}
            style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}
          >
            <div>
              <strong>{formatDateFr(rdv.date)}</strong> à {rdv.heure}h — {rdv.motif || 'Sans motif précisé'}
              <br />
              Patient : {rdv.patient?.nom || 'Inconnu'}
              <br />
              <span style={{ color: rdv.statut ? '#27ae60' : '#e67e22' }}>
                {rdv.statut ? 'Confirmé' : 'En attente'}
              </span>
            </div>

            {!rdv.statut && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button className="btn-submit" onClick={() => handleConfirmer(rdv.id)}>
                  Accepter
                </button>
                <button className="btn-logout" onClick={() => handleRefuser(rdv.id)}>
                  Refuser
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardMedecin;