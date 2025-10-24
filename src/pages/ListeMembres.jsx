import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function ListeMembres() {
  const [membres, setMembres] = useState([]);
  const { canManage, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(data => setMembres(data.data || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <main style={{ padding: 24, color: 'white' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ margin: 0, color: 'var(--secondary-color)' }}>
          Liste des membres
        </h1>
        
        {canManage() ? (
          <Link 
            to="/gestion" 
            style={{
              background: 'var(--secondary-color)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--primary-color)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--secondary-color)'}
          >
            Gérer les membres
          </Link>
        ) : !isAuthenticated() && (
          <Link 
            to="/login" 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Connexion responsables
          </Link>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <th style={{ textAlign:'left', padding: '12px 8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>Nom</th>
            <th style={{ textAlign:'left', padding: '12px 8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>Prénom</th>
            <th style={{ textAlign:'left', padding: '12px 8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>N° licence</th>
            <th style={{ textAlign:'left', padding: '12px 8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>Entrée</th>
            <th style={{ textAlign:'left', padding: '12px 8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>Dernier certificat</th>
          </tr>
        </thead>
        <tbody>
          {membres.map(m => (
            <tr 
              key={m.id} 
              style={{ 
                borderTop:'1px solid rgba(255,255,255,0.1)',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{m.lastName}</td>
              <td style={{ padding: '12px 8px' }}>{m.firstName}</td>
              <td style={{ padding: '12px 8px', color: 'var(--primary-color)' }}>{m.licenseNumber || '—'}</td>
              <td style={{ padding: '12px 8px' }}>{m.joinDate || '—'}</td>
              <td style={{ padding: '12px 8px' }}>{m.lastMedicalDate || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
// ...existing code...