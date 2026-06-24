import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    role: 'PATIENT',
    dateNaissance: '',
    adresse: '',
    specialite: '',
    cabinet: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess('Inscription réussie ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'inscription."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Inscription</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Je suis</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="PATIENT">Patient</option>
              <option value="MEDECIN">Médecin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>

          {formData.role === 'PATIENT' && (
            <>
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {formData.role === 'MEDECIN' && (
            <>
              <div className="form-group">
                <label>Spécialité</label>
                <input
                  type="text"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Cabinet</label>
                <input
                  type="text"
                  name="cabinet"
                  value={formData.cabinet}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;