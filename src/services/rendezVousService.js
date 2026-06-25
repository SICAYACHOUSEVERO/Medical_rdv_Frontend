import api from './api';

//  Médecins 
export const getAllMedecins = async () => {
  const response = await api.get('/medecins');
  return response.data;
};

export const getMedecinsBySpecialite = async (specialite) => {
  const response = await api.get(`/medecins/specialite/${specialite}`);
  return response.data;
};

//  Disponibilités 
export const getDisponibilitesByMedecin = async (medecinId) => {
  const response = await api.get(`/disponibilites/medecin/${medecinId}`);
  return response.data;
};

// Rendez-vous (côté Patient) 
export const getRendezVousByPatient = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/rendezvous`);
  return response.data;
};

export const prendreRendezVous = async (patientId, rendezVousData) => {
  const response = await api.post(`/patients/${patientId}/rendezvous`, rendezVousData);
  return response.data;
};

export const annulerRendezVous = async (rendezVousId) => {
  const response = await api.delete(`/patients/rendezvous/${rendezVousId}`);
  return response.data;
};

//  Rendez-vous (côté Médecin) 
export const getPlanningMedecin = async (medecinId) => {
  const response = await api.get(`/medecins/${medecinId}/planning`);
  return response.data;
};

export const confirmerRendezVous = async (rendezVousId) => {
  const response = await api.put(`/rendezvous/${rendezVousId}/confirmer`);
  return response.data;
};

export const refuserRendezVous = async (rendezVousId) => {
  const response = await api.put(`/rendezvous/${rendezVousId}/refuser`);
  return response.data;
};

export const ajouterDisponibilite = async (disponibiliteData) => {
  const response = await api.post('/disponibilites', disponibiliteData);
  return response.data;
};