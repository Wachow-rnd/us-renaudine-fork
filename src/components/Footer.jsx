import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '0 2rem'
    }}>
      <p style={{ margin: 0 }}>
        &copy; 2025 US Renaudine Tennis de Table - Tous droits réservés
      </p>
      
      {!isAuthenticated() && (
        <Link 
          to="/login" 
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'white';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
            e.target.style.background = 'transparent';
          }}
        >
          Connexion responsables
        </Link>
      )}
    </footer>
  );
}
