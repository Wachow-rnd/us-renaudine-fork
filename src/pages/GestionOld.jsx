import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { api } from "../utils/api";
import { Button, Loading, Alert, Modal } from "../components/ui";
import ProtectedRoute from "../components/ProtectedRoute";

function GestionContent() {
  const { user, login, logout, canManage } = useAuth();
  const [formulaire, setFormulaire] = useState({
    lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: ""
  });
  const [membres, setMembres] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => { 
    if (user && canManage()) {
      recupererMembres(); 
    }
  }, [user, canManage]);

  async function recupererMembres() {
    try {
      setLoading(true);
      const response = await api.get("/api/members");
      setMembres(response.data || []);
    } catch (err) {
      setErreur("Erreur lors du chargement des membres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErreur(null);
    setLoginLoading(true);
    
    try {
      const result = await login(loginForm.username, loginForm.password);
      if (result.success) {
        setLoginForm({ username: "", password: "" });
        await recupererMembres();
      } else {
        setErreur(result.error);
      }
    } catch (err) {
      setErreur(err.message || "Connexion impossible");
    } finally {
      setLoginLoading(false);
    }
  }

  async function creerMembre() {
    setErreur(null);
    if (!formulaire.lastName.trim() || !formulaire.firstName.trim()) {
      setErreur("Nom et prénom sont requis");
      return;
    }
    
    try {
      setLoading(true);
      await api.post("/api/members", formulaire);
      setFormulaire({ lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "" });
      await recupererMembres();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmerSuppression(membre) {
    try {
      setLoading(true);
      await api.delete(`/api/members/${membre.id}`);
      await recupererMembres();
      setShowDeleteModal(null);
    } catch (err) {
      setErreur(`Erreur lors de la suppression: ${err.message}`);
      setShowDeleteModal(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setMembres([]);
    setFormulaire({ lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "" });
    setErreur(null);
  }

  return (
    <main style={{ padding: "3rem 1rem", color: "white" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--secondary-color)" }}>
          Gestion des membres
        </h1>

        {!user ? (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "2rem", 
              borderRadius: "10px" 
            }}>
              <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem", textAlign: "center" }}>
                Connexion
              </h2>
              
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1rem" }}>
                  <input 
                    name="username"
                    placeholder="Nom d'utilisateur" 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    autoComplete="username" 
                    required 
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="Mot de passe"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    autoComplete="current-password" 
                    required 
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loginLoading}
                  style={{ width: "100%" }}
                >
                  Se connecter
                </Button>
              </form>
              
              {erreur && (
                <Alert type="error" style={{ marginTop: "1rem" }}>
                  {erreur}
                </Alert>
              )}
            </div>
          </div>
        ) : !canManage() ? (
          <Alert type="warning">
            <h3>Accès limité</h3>
            <p>Vous n'avez pas les permissions nécessaires pour gérer les membres.</p>
          </Alert>
        ) : (
          <>
            {/* Header avec informations utilisateur */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "2rem",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px"
            }}>
              <div>
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  Connecté en tant que <strong>{user.username}</strong> ({user.role})
                </p>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>

            {/* Section d'ajout de membre */}
            <section style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "2rem", 
              borderRadius: "10px",
              marginBottom: "2rem"
            }}>
              <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                Ajouter un membre
              </h2>
              
              <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input 
                    placeholder="Nom *" 
                    value={formulaire.lastName} 
                    onChange={e => setFormulaire({ ...formulaire, lastName: e.target.value })} 
                    required 
                    style={{ 
                      padding: "0.75rem", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                  <input 
                    placeholder="Prénom *" 
                    value={formulaire.firstName} 
                    onChange={e => setFormulaire({ ...formulaire, firstName: e.target.value })} 
                    required 
                    style={{ 
                      padding: "0.75rem", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                </div>
                
                <input 
                  placeholder="N° licence" 
                  value={formulaire.licenseNumber} 
                  onChange={e => setFormulaire({ ...formulaire, licenseNumber: e.target.value })} 
                  style={{ 
                    padding: "0.75rem", 
                    borderRadius: "5px", 
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      Date d'entrée au club
                    </label>
                    <input 
                      type="date" 
                      value={formulaire.joinDate} 
                      onChange={e => setFormulaire({ ...formulaire, joinDate: e.target.value })} 
                      style={{ 
                        width: "100%",
                        padding: "0.75rem", 
                        borderRadius: "5px", 
                        border: "1px solid #ccc",
                        fontSize: "1rem"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      Date certificat médical
                    </label>
                    <input 
                      type="date" 
                      value={formulaire.lastMedicalDate} 
                      onChange={e => setFormulaire({ ...formulaire, lastMedicalDate: e.target.value })} 
                      style={{ 
                        width: "100%",
                        padding: "0.75rem", 
                        borderRadius: "5px", 
                        border: "1px solid #ccc",
                        fontSize: "1rem"
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <Button 
                    variant="primary"
                    onClick={creerMembre} 
                    disabled={!formulaire.lastName.trim() || !formulaire.firstName.trim() || loading}
                    loading={loading}
                  >
                    Ajouter le membre
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setFormulaire({ lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "" })}
                    disabled={loading}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
              
              {erreur && (
                <Alert type="error" style={{ marginTop: "1rem" }}>
                  {erreur}
                </Alert>
              )}
            </section>

            {/* Section liste des membres */}
            <section style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "2rem", 
              borderRadius: "10px"
            }}>
              <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                Liste des membres ({membres.length})
              </h2>
              
              {loading && <Loading text="Chargement des membres..." />}
              
              {!loading && membres.length === 0 ? (
                <Alert type="info">
                  Aucun membre enregistré pour le moment.
                </Alert>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {membres.map(membre => (
                    <div 
                      key={membre.id} 
                      style={{ 
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "1.5rem", 
                        borderRadius: "8px",
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                          {membre.lastName} {membre.firstName}
                        </h4>
                        <div style={{ fontSize: "0.9rem", color: "#ccc", display: "grid", gap: "0.25rem" }}>
                          <div><strong>N° licence:</strong> {membre.licenseNumber || "Non renseigné"}</div>
                          <div><strong>Entrée:</strong> {membre.joinDate || "Non renseignée"}</div>
                          <div><strong>Certificat médical:</strong> {membre.lastMedicalDate || "Non renseigné"}</div>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => navigator.clipboard?.writeText(JSON.stringify(membre, null, 2))}
                          title="Copier les informations"
                        >
                          📋
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => setShowDeleteModal(membre)}
                          disabled={loading}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Modal de confirmation de suppression */}
            <Modal
              isOpen={!!showDeleteModal}
              onClose={() => setShowDeleteModal(null)}
              title="Confirmer la suppression"
              size="small"
            >
              {showDeleteModal && (
                <div>
                  <p style={{ marginBottom: "1.5rem" }}>
                    Êtes-vous sûr de vouloir supprimer le membre{" "}
                    <strong>{showDeleteModal.lastName} {showDeleteModal.firstName}</strong> ?
                  </p>
                  <Alert type="warning" style={{ marginBottom: "1.5rem" }}>
                    Cette action est irréversible.
                  </Alert>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <Button variant="ghost" onClick={() => setShowDeleteModal(null)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => confirmerSuppression(showDeleteModal)}
                      loading={loading}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
          </>
        )}
      </div>
    </main>
  );
}

export default function Gestion() {
  return (
    <ProtectedRoute requiredRole="manager">
      <GestionContent />
    </ProtectedRoute>
  );
}