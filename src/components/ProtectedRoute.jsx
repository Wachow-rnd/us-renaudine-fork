import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import Loading from './ui/Loading';
import Alert from './ui/Alert';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole = null,
  fallback = null,
  redirectTo = "/login"
}) {
  const { loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Affichage pendant le chargement
  if (loading) {
    return <Loading text="Vérification des permissions..." />;
  }

  // Utilisateur non connecté - rediriger vers la page de login
  if (!isAuthenticated()) {
    if (fallback) {
      return fallback;
    }
    
    // Rediriger vers la page de connexion en sauvegardant la destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Vérification du rôle si requis
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'white' }}>
        <Alert type="error">
          <h3>Accès refusé</h3>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <p><small>Rôle requis: {requiredRole}</small></p>
        </Alert>
      </div>
    );
  }

  // Utilisateur autorisé
  return children;
}