import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import {
  getAllMedecins,
  getDisponibilitesByMedecin,
  getRendezVousByPatient,
  prendreRendezVous,
  annulerRendezVous,
} from '../services/rendezVousService';

function DashboardPatient() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rendezVousList, setRendezVousList] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState('');
  const [selectedDispo, setSelectedDispo] = useState('');
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'PATIENT') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadRendezVous(currentUser.id);
    loadMedecins();
  }, [navigate]);

  const loadRendezVous = async (patientId) => {
    try {
      const data = await getRendezVousByPatient(patientId);
      setRendezVousList(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMedecins = async () => {
    try {
      const data = await getAllMedecins();
      setMedecins(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMedecinChange = async (e) => {
    const medecinId = e.target.value;
    setSelectedMedecin(medecinId);
    setSelectedDispo('');
    if (medecinId) {
      try {
        const data = await getDisponibilitesByMedecin(medecinId);
        setDisponibilites(data || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setDisponibilites([]);
    }
  };

  const handlePrendreRendezVous = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedMedecin || !selectedDispo) {
      setError('Veuillez selectionner un medecin et un creneau.');
      return;
    }

    const dispo = disponibilites.find((d) => d.id === parseInt(selectedDispo));

    try {
      await prendreRendezVous(user.id, {
        date: dispo.date,
        heure: dispo.heureDebut,
        motif: motif,
        medecin: { id: parseInt(selectedMedecin) },
        disponibilite: { id: dispo.id },
      });
      setMessage('Rendez-vous demande avec succes !');
      setMotif('');
      setSelectedMedecin('');
      setSelectedDispo('');
      loadRendezVous(user.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la prise de rendez-vous.');
    }
  };

  const handleAnnuler = async (rendezVousId) => {
    try {
      await annulerRendezVous(rendezVousId);
      setMessage('Rendez-vous annule.');
      loadRendezVous(user.id);
    } catch (err) {
      setError("Erreur lors de l'annulation.");
    }
  };

  const formatDateFr = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatutLabel = (statut) => {
    if (statut === 'CONFIRME') {
      return 'Confirme';
    }
    if (statut === 'REFUSE') {
      return 'Refuse';
    }
    return 'En attente';
  };

  const getStatutColor = (statut) => {
    if (statut === 'CONFIRME') {
      return '#27ae60';
    }
    if (statut === 'REFUSE') {
      return '#e74c3c';
    }
    return '#e67e22';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Bienvenue, {user.nom}</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Deconnexion
        </button>
      </div>

      <p>Email : {user.email}</p>
      <p>Role : Patient</p>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h3>Prendre un rendez-vous</h3>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handlePrendreRendezVous}>
        <div className="form-group">
          <label>Medecin</label>
          <select value={selectedMedecin} onChange={handleMedecinChange}>
            <option value="">Choisir un medecin</option>
            {medecins.map((m) => (
              <option key={m.id} value={m.id}>
                Dr. {m.nom} ({m.specialite})
              </option>
            ))}
          </select>
        </div>

        {disponibilites.length > 0 && (
          <div className="form-group">
            <label>Creneau disponible</label>
            <select value={selectedDispo} onChange={(e) => setSelectedDispo(e.target.value)}>
              <option value="">Choisir un creneau</option>
              {disponibilites.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatDateFr(d.date)} a {d.heureDebut}h
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedMedecin && disponibilites.length === 0 && (
          <p style={{ color: '#888' }}>Aucune disponibilite pour ce medecin.</p>
        )}

        <div className="form-group">
          <label>Motif de la consultation</label>
          <input
            type="text"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Ex: Consultation de routine"
          />
        </div>

        <button type="submit" className="btn-submit">
          Prendre rendez-vous
        </button>
      </form>

      <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h3>Mes rendez-vous</h3>

      {rendezVousList.length === 0 ? (
        <p style={{ color: '#888' }}>Vous n avez aucun rendez-vous pour le moment.</p>
      ) : (
        rendezVousList.map((rdv) => (
          <div
            key={rdv.id}
            style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{formatDateFr(rdv.date)}</strong> a {rdv.heure}h - {rdv.motif || 'Sans motif precise'}
              <br />
              <span style={{ color: getStatutColor(rdv.statut) }}>
                {getStatutLabel(rdv.statut)}
              </span>
            </div>
            {rdv.statut !== 'REFUSE' && (
              <button className="btn-logout" onClick={() => handleAnnuler(rdv.id)}>
                Annuler
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardPatient;