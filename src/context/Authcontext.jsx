import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import AuthContext from "./AuthContextDef";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("jeton"));
  
  async function login(username, password) {
    try {
      console.log("🔐 Tentative de connexion pour:", username);
      setLoading(true);
      
      // Appel API réel vers le serveur
      const response = await api.post("/api/auth/login", { username, password });
      
      if (response.token && response.user) {
        console.log("✅ Connexion réussie");
        localStorage.setItem("jeton", response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      } else {
        console.error("❌ Réponse serveur invalide");
        return { 
          success: false, 
          error: "Réponse serveur invalide" 
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
    const result = !!user && !!token;
    console.log("🔒 isAuthenticated check - user:", !!user, "token:", !!token, "result:", result);
    return result;
  }

  // Vérifier si l'utilisateur peut gérer (manager ou admin)
  function canManage() {
    return hasRole('manager') || hasRole('admin');
  }
  
  useEffect(() => {
    // Vérifier token au démarrage
    async function loadUser() {
      if (token) {
        try {
          console.log("🔄 Vérification du token existant");
          const response = await api.get("/api/auth/me");
          if (response.user) {
            console.log("✅ Token valide, utilisateur chargé");
            setUser(response.user);
          } else {
            console.log("❌ Token invalide, déconnexion");
            logout();
          }
        } catch (err) {
          console.log("❌ Erreur vérification token, déconnexion");
          logout();
        }
      }
      setLoading(false);
    }
    
    loadUser();
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

export { useAuth } from "./AuthContextDef";