import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Button, Alert, Loading } from "../components/ui";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const authContext = useAuth();
  const { login, isAuthenticated, user } = authContext;
  
  console.log("🔍 Context complet:", authContext);
  const location = useLocation();
  
  // Rediriger vers la page de destination après connexion
  const from = location.state?.from?.pathname || "/gestion";
  
  console.log("🔍 État Login - isAuthenticated():", isAuthenticated(), "user:", user);

  // Si déjà connecté, rediriger
  if (isAuthenticated()) {
    console.log("🔄 Utilisateur déjà connecté, redirection vers:", from);
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🎯 Soumission du formulaire avec:", formData);
    setLoading(true);
    setError(null);

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      console.log("🚀 Appel de la fonction login...");
      const result = await login(formData.username, formData.password);
      console.log("📋 Résultat du login:", result);
      
      if (result.success) {
        console.log("✅ Connexion réussie, redirection en cours...");
        // La redirection sera automatique grâce au Navigate ci-dessus
      } else {
        console.error("❌ Échec de la connexion:", result.error);
        setError(result.error || "Erreur de connexion");
      }
    } catch (err) {
      console.error("🚨 Exception lors du login:", err);
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height) - var(--footer-max-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: 'var(--secondary-color)', 
            marginBottom: '0.5rem',
            fontSize: '2rem'
          }}>
            Connexion
          </h1>
          <p style={{ color: '#ccc', margin: 0 }}>
            Accédez à l'espace de gestion du club
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="username" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
              autoComplete="username"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(5px)'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(5px)'
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          {error && (
            <Alert type="error" style={{ marginBottom: '1rem' }}>
              {error}
            </Alert>
          )}
        </form>



        {/* Informations d'aide */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem',
          fontSize: '0.9rem',
          color: '#ccc'
        }}>
          <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontSize: '1rem' }}>
            💡 Informations
          </h4>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Compte par défaut :</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            <li>Utilisateur: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem', borderRadius: '3px' }}>admin</code></li>
            <li>Mot de passe: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem', borderRadius: '3px' }}>admin123</code></li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontStyle: 'italic' }}>
            ⚠️ Changez ces identifiants après la première connexion
          </p>
        </div>

        {/* Lien retour */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a 
            href="/" 
            style={{ 
              color: 'var(--primary-color)', 
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}