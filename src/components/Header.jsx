// ...existing code...
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaFacebook, FaYoutube, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useAuth } from "../context/Authcontext";
import "../styles/index.css";
import logo from "/assets/images/logo_us_renaudine.png?url";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, canManage, isAuthenticated } = useAuth();



  // fermer les menus quand on change de route
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // fermer les menus avec Échap
  useEffect(() => {
    const onKey = (e) => { 
      if (e.key === "Escape") {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // fermer le menu utilisateur en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuOpen && !e.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  // Items de navigation publics
  const publicNavItems = [
    { to: "/", label: "Accueil" },
    { to: "/club", label: "Le Club" },
    { to: "/evenements", label: "Événements" },
    { to: "/galerie", label: "Galerie" },
    { to: "/contact", label: "Contact" },
    { to: "/membres", label: "Membres" },
    { to: "/sponsors", label: "Sponsors" }
  ];

  // Items de navigation pour les utilisateurs connectés
  const adminNavItems = [
    ...(canManage() ? [{ to: "/gestion", label: "Gestion" }] : [])
  ];

  const allNavItems = [...publicNavItems, ...adminNavItems];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <header 
      className="header"
      style={{
        backgroundColor: 'var(--primary-color)'
      }}
    >
      <div className="header-left">
        <div className="logo">
          <NavLink to="/" aria-label="Accueil">
            <img src={logo} alt="US Renaudine - Logo" />
          </NavLink>
        </div>
      </div>

      <div className={`header-center ${menuOpen ? "open" : ""}`}>
        <nav aria-label="Navigation principale">
          <ul className={menuOpen ? "show" : ""}>
            {allNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="header-right">
        {/* Réseaux sociaux */}
        <div className="social-links">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="facebook"
            aria-label="Facebook"
          >
            <FaFacebook className="icon" style={{ color: '#1877F2' }} />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="youtube"
            aria-label="YouTube"
          >
            <FaYoutube className="icon" style={{ color: '#FF0000' }} />
          </a>
        </div>

        {/* Menu utilisateur */}
        {isAuthenticated() ? (
          <div className="user-menu-container" style={{ position: 'relative', marginLeft: '1rem' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '25px',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <FaUser size={14} />
              <span>{user.username}</span>
              <span style={{ 
                transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}>▼</span>
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'rgba(30, 30, 30, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                minWidth: '200px',
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ padding: '1rem 0' }}>
                  {/* Informations utilisateur */}
                  <div style={{ 
                    padding: '0.5rem 1rem', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#ccc' }}>Connecté en tant que</div>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{user.username}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                      Rôle: {user.role}
                    </div>
                  </div>

                  {/* Actions */}
                  {canManage() && (
                    <NavLink
                      to="/gestion"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <FaCog size={16} />
                      <span>Gestion du club</span>
                    </NavLink>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <FaSignOutAlt size={16} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/gestion"
            style={{
              marginLeft: '1rem',
              background: 'var(--secondary-color)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--primary-color)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--secondary-color)'}
          >
            <FaUser size={14} />
            <span>Connexion</span>
          </NavLink>
        )}
      </div>

      <button
        className={`burger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((s) => !s)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
// ...existing code...