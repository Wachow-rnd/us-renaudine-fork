import React, { useState, useEffect } from 'react';
import { Button, Alert, Loading } from './ui';
import { facebookIntegrationService } from '../services/facebookIntegrationService';

export default function FacebookIntegration({ onArticleCreated }) {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, loading, success, error
  const [syncResult, setSyncResult] = useState(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncInterval, setSyncInterval] = useState(30); // minutes
  const [lastSync, setLastSync] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Charger le statut de la dernière synchronisation
    loadSyncStatus();
  }, []);

  const loadSyncStatus = () => {
    try {
      const lastSyncTime = localStorage.getItem('facebook-last-sync');
      if (lastSyncTime) {
        setLastSync(new Date(lastSyncTime));
      }
      
      const autoSync = localStorage.getItem('facebook-auto-sync') === 'true';
      setAutoSyncEnabled(autoSync);
    } catch (error) {
      console.error('Erreur lors du chargement du statut:', error);
    }
  };

  const handleManualSync = async () => {
    setSyncStatus('loading');
    setSyncResult(null);
    
    try {
      const result = await facebookIntegrationService.syncFacebookPosts();
      
      if (result.success) {
        setSyncStatus('success');
        setSyncResult(result);
        setLastSync(new Date());
        
        // Notifier le parent si des articles ont été créés
        if (result.newArticles > 0 && onArticleCreated) {
          onArticleCreated();
        }
      } else {
        setSyncStatus('error');
        setSyncResult(result);
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncResult({ error: error.message });
    }
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    
    try {
      const result = await facebookIntegrationService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    }
  };

  const toggleAutoSync = () => {
    const newStatus = !autoSyncEnabled;
    setAutoSyncEnabled(newStatus);
    
    try {
      localStorage.setItem('facebook-auto-sync', newStatus.toString());
      
      if (newStatus) {
        // Démarrer la synchronisation automatique
        facebookIntegrationService.startAutoSync(syncInterval);
      }
    } catch (error) {
      console.error('Erreur lors de la configuration de la sync auto:', error);
    }
  };

  const handleIntervalChange = (newInterval) => {
    setSyncInterval(newInterval);
    
    if (autoSyncEnabled) {
      // Redémarrer avec le nouveau délai
      facebookIntegrationService.startAutoSync(newInterval);
    }
  };

  return (
    <div style={{ 
      background: "rgba(255, 255, 255, 0.1)", 
      padding: "2rem", 
      borderRadius: "10px",
      marginBottom: "2rem"
    }}>
      <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
        📘 Intégration Facebook
      </h2>
      
      <p style={{ color: "#ccc", marginBottom: "2rem", lineHeight: 1.6 }}>
        Synchronisez automatiquement les posts de votre page Facebook pour créer des articles sur le site.
        <br />
        <small>⚠️ Actuellement en mode simulation - remplacer par une vraie intégration en production.</small>
      </p>

      {/* Statut de la dernière synchronisation */}
      {lastSync && (
        <div style={{ 
          background: "rgba(255, 255, 255, 0.05)",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
          color: "#ccc"
        }}>
          <strong>Dernière synchronisation :</strong> {lastSync.toLocaleString('fr-FR')}
        </div>
      )}

      {/* Configuration */}
      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}>
        
        {/* Synchronisation automatique */}
        <div style={{ 
          padding: "1rem",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <input
              type="checkbox"
              id="auto-sync"
              checked={autoSyncEnabled}
              onChange={toggleAutoSync}
              style={{ marginRight: "0.5rem" }}
            />
            <label htmlFor="auto-sync" style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Synchronisation automatique
            </label>
          </div>
          
          {autoSyncEnabled && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <label style={{ fontSize: "0.9rem" }}>Intervalle :</label>
              <select
                value={syncInterval}
                onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white"
                }}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 heure</option>
                <option value={180}>3 heures</option>
                <option value={360}>6 heures</option>
              </select>
            </div>
          )}
        </div>

        {/* URL de la page Facebook */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            URL de la page Facebook
          </label>
          <input
            type="url"
            value="https://www.facebook.com/usrtt/"
            disabled
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "5px",
              border: "1px solid #666",
              backgroundColor: "#f5f5f5",
              color: "#666"
            }}
          />
          <small style={{ color: "#999", fontSize: "0.8rem" }}>
            Configuration modifiable dans le fichier de service
          </small>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <Button
          variant="primary"
          onClick={handleManualSync}
          loading={syncStatus === 'loading'}
          disabled={syncStatus === 'loading'}
        >
          🔄 Synchroniser maintenant
        </Button>
        
        <Button
          variant="outline"
          onClick={handleTestConnection}
        >
          🔍 Tester la connexion
        </Button>
      </div>

      {/* Résultat du test de connexion */}
      {testResult && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Alert type={testResult.success ? "success" : "error"}>
            <strong>Test de connexion :</strong> {testResult.message || testResult.error}
            {testResult.posts && testResult.posts.length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <strong>Posts trouvés :</strong>
                <ul style={{ margin: "0.5rem 0 0 1rem" }}>
                  {testResult.posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </Alert>
        </div>
      )}

      {/* Résultat de la synchronisation */}
      {syncStatus !== 'idle' && (
        <div>
          {syncStatus === 'loading' && (
            <Loading text="Synchronisation en cours..." />
          )}
          
          {syncStatus === 'success' && syncResult && (
            <Alert type="success">
              <strong>Synchronisation réussie !</strong>
              <br />
              {syncResult.newArticles > 0 
                ? `${syncResult.newArticles} nouveaux articles créés depuis Facebook.`
                : 'Aucun nouveau post trouvé depuis la dernière synchronisation.'
              }
            </Alert>
          )}
          
          {syncStatus === 'error' && syncResult && (
            <Alert type="error">
              <strong>Erreur lors de la synchronisation :</strong>
              <br />
              {syncResult.error}
            </Alert>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        marginTop: "2rem",
        padding: "1rem",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        fontSize: "0.9rem",
        color: "#ccc"
      }}>
        <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--secondary-color)" }}>
          📋 Instructions pour l'intégration réelle :
        </h4>
        <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>Obtenir un token d'accès Facebook Graph API</li>
          <li>Configurer les permissions pour lire les posts publics</li>
          <li>Remplacer la simulation par de vrais appels API</li>
          <li>Optionnel : utiliser un service tiers comme Zapier</li>
        </ul>
        
        <p style={{ margin: "1rem 0 0 0", fontStyle: "italic" }}>
          💡 Alternative : Utiliser IFTTT ou Zapier pour créer des webhooks automatiques
        </p>
      </div>
    </div>
  );
}