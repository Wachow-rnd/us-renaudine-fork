import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContextDef";

export function StaticAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jeton"));
  
  async function login(username, password) {
    try {
      console.log("🔐 Connexion en mode statique pour:", username);
      setLoading(true);
      
      // Mode statique - authentification simulée
      if (username === "admin" && password === "admin123") {
        console.log("✅ Connexion statique réussie");
        const staticToken = "static-token-" + Date.now();
        const staticUser = {
          id: 1,
          username: "admin",
          role: "admin"
        };
        
        localStorage.setItem("jeton", staticToken);
        setToken(staticToken);
        setUser(staticUser);
        return { success: true };
      } else {
        console.error("❌ Identifiants incorrects");
        return { 
          success: false, 
          error: "Identifiants invalides" 
        };
      }
    } catch (err) {
      console.error("🚨 Erreur de connexion:", err);
      return { 
        success: false, 
        error: err.message || "Erreur lors de la connexion" 
      };
    } finally {
      setLoading(false);
    }
  }
  
  function logout() {
    localStorage.removeItem("jeton");
    setToken(null);
    setUser(null);
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  function hasRole(role) {
    return user?.role === role || user?.role === 'admin';
  }

  // Vérifier si l'utilisateur est connecté
  function isAuthenticated() {
    return !!user && !!token;
  }

  // Vérifier si l'utilisateur peut gérer (manager ou admin)
  function canManage() {
    return hasRole('manager') || hasRole('admin');
  }
  
  useEffect(() => {
    // Mode statique - vérifier le token au démarrage
    if (token) {
      console.log("🔄 Token trouvé, connexion automatique en mode statique");
      setUser({
        id: 1,
        username: "admin",
        role: "admin"
      });
    }
    setLoading(false);
  }, [token]);
  
  const contextValue = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    canManage
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default StaticAuthProvider;
