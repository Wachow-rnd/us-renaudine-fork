// ...existing code...
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "../styles/index.css";

export default function Hero() {
  const heroAboutRef = useRef(null);
  const { isAuthenticated, canManage } = useAuth();

  // Ajuste la marge du hero-about pour qu'il apparaisse après le hero
  const updateHeroAboutMargin = () => {
    const header = document.querySelector("header");
    const hero = document.querySelector(".hero");
    const heroAbout = heroAboutRef.current;
    if (!header || !hero || !heroAbout) return;

    const headerHeight = header.offsetHeight;
    const heroHeight = hero.offsetHeight;

    // marge = hauteur du hero - header + un petit espace
    const newMargin = heroHeight - headerHeight + 20;
    heroAbout.style.marginTop = `${newMargin}px`;
  };

  useEffect(() => {
    updateHeroAboutMargin();
    window.addEventListener("resize", updateHeroAboutMargin);

    // Animation des boutons "En savoir plus" et "Nous contacter"
    const scrollElements = document.querySelectorAll(".scroll-left, .scroll-right");

    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.9;
      scrollElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < triggerPoint) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Animation au chargement
    handleScroll();

    return () => {
      window.removeEventListener("resize", updateHeroAboutMargin);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>Bienvenue à l’US Renaudine Tennis de Table</h1>
        <p>
          Un club convivial et passionné pour tous les niveaux, du loisir à la
          compétition.
        </p>

        <div className="hero-buttons">
          <a href="#hero-about" className="btn btn-info scroll-left">
            En savoir plus
          </a>
          <Link to="/contact" className="btn btn-contact scroll-right">
            Nous contacter
          </Link>
        </div>

        <div className="hero-about" id="hero-about" ref={heroAboutRef}>
          <h2>À propos du club</h2>
          <p>
            Fondé par des passionnés, le club de tennis de table US Renaudine
            accueille petits et grands dans une ambiance chaleureuse. Nous
            proposons des entraînements adaptés à chaque niveau et des
            compétitions régulières dans la région. Rejoignez-nous pour partager
            la passion du ping !
          </p>

          {/* Section pour les membres et responsables */}
          {(isAuthenticated() || canManage()) && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '10px',
              marginTop: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                Espace membres
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Accédez aux fonctionnalités réservées aux membres et responsables du club.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {canManage() ? (
                  <Link to="/gestion" className="btn btn-contact">
                    Gestion du club
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-info">
                    Connexion responsables
                  </Link>
                )}
                <Link to="/membres" className="btn btn-info">
                  Liste des membres
                </Link>
              </div>
            </div>
          )}
          
          {/* Section d'invitation à la connexion pour les visiteurs */}
          {!isAuthenticated() && (
            <div style={{
              background: 'rgba(110, 193, 228, 0.1)',
              padding: '1.5rem',
              borderRadius: '10px',
              marginTop: '2rem',
              border: '1px solid rgba(110, 193, 228, 0.3)',
              textAlign: 'center'
            }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                Vous êtes responsable du club ?
              </h4>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                Connectez-vous pour accéder à l'espace de gestion.
              </p>
              <Link 
                to="/login" 
                className="btn btn-info"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                Connexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
// ...existing code...