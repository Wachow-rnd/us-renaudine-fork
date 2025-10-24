import React from "react";
import { Button } from "../components/ui";
import "../styles/Sponsors.css"

export default function Sponsors() {
  // Sponsors officiels récupérés du site usrenaudinett.fr
  const sponsors = [
    {
      id: 1,
      name: "Allianz Cyrille DUVEAU",
      logo: "/images/sponsors/allianz-logo.png", // placeholder
      website: "https://agence.allianz.fr/chateau-renault-37110-537061",
      description: "Assurance et protection pour tous vos projets. Agence Allianz de Château-Renault.",
      category: "Assurance & Finance",
      location: "Château-Renault"
    },
    {
      id: 2,
      name: "Opticien Krys Stéphane LOQUET",
      logo: "/images/sponsors/krys-logo.png", // placeholder
      website: "https://www.krys.com",
      description: "Votre opticien de confiance à Château-Renault. Lunettes de vue, solaires et lentilles.",
      category: "Santé & Optique",
      location: "Château-Renault"
    },
    {
      id: 3,
      name: "INFINYFIT by TIAC",
      logo: "/images/sponsors/infinyfit-logo.png", // placeholder
      website: "#",
      description: "Solutions fitness et bien-être. Accompagnement personnalisé pour votre forme physique.",
      category: "Sport & Fitness",
      location: "Région Centre"
    },
    {
      id: 4,
      name: "Société FORBO",
      logo: "/images/sponsors/forbo-logo.png", // placeholder
      website: "https://www.forbo.com",
      description: "Leader mondial des revêtements de sol. Solutions innovantes pour le sport et l'industrie.",
      category: "Industrie & Matériaux",
      location: "International"
    }
  ];

  const categories = [...new Set(sponsors.map(s => s.category))];

  return (
    <section className="sponsors-section" style={{ padding: "3rem 1rem", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "1rem", 
          color: "var(--secondary-color)",
          textAlign: "center"
        }}>
          Nos Partenaires et Sponsors
        </h1>
        
        <p style={{ 
          textAlign: "center", 
          marginBottom: "3rem", 
          fontSize: "1.1rem",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "1.5rem",
          borderRadius: "10px"
        }}>
          Découvrez les entreprises et organisations qui soutiennent l'US Renaudine Tennis de Table 
          et contribuent au développement de notre club.
        </p>

        {/* Affichage par catégorie */}
        {categories.map(category => (
          <div key={category} style={{ marginBottom: "3rem" }}>
            <h2 style={{ 
              color: "var(--primary-color)", 
              marginBottom: "1.5rem",
              borderBottom: "2px solid var(--primary-color)",
              paddingBottom: "0.5rem"
            }}>
              {category}
            </h2>
            
            <div className="sponsors-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem"
            }}>
              {sponsors
                .filter(sponsor => sponsor.category === category)
                .map(sponsor => (
                  <div
                    key={sponsor.id}
                    className="sponsor-card"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "15px",
                      padding: "1.5rem",
                      textAlign: "center",
                      transition: "transform 0.3s, background 0.3s",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-5px)";
                      e.target.style.background = "rgba(255, 255, 255, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <div style={{ 
                      width: "120px", 
                      height: "120px", 
                      margin: "0 auto 1rem",
                      background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative"
                    }}>
                      <div style={{
                        color: "white",
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}>
                        {sponsor.name.split(' ')[0].charAt(0)}
                        {sponsor.name.split(' ')[1]?.charAt(0) || ''}
                      </div>
                      <div style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        background: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem"
                      }}>
                        🏪
                      </div>
                    </div>
                    
                    <h3 style={{ 
                      margin: "0 0 0.5rem 0", 
                      color: "white",
                      fontSize: "1.2rem"
                    }}>
                      {sponsor.name}
                    </h3>
                    
                    <p style={{ 
                      margin: "0 0 1rem 0", 
                      color: "#ccc",
                      fontSize: "0.9rem",
                      lineHeight: "1.4"
                    }}>
                      {sponsor.description}
                    </p>
                    
                    <p style={{
                      margin: "0 0 1.5rem 0",
                      color: "#FFD700",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.3rem"
                    }}>
                      📍 {sponsor.location}
                    </p>
                    
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => window.open(sponsor.website, '_blank', 'noopener,noreferrer')}
                      style={{ fontSize: "0.9rem" }}
                    >
                      Visiter le site
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Section pour devenir sponsor */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "3rem 2rem",
          borderRadius: "15px",
          textAlign: "center",
          marginTop: "3rem",
          border: "2px dashed rgba(255, 255, 255, 0.3)"
        }}>
          <h2 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
            Devenez partenaire !
          </h2>
          <p style={{ 
            marginBottom: "2rem", 
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            Vous êtes une entreprise locale et souhaitez soutenir le tennis de table dans notre région ? 
            Rejoignez nos partenaires et bénéficiez d'une visibilité lors de nos événements.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => window.location.href = '/contact'}>
              Nous contacter
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/evenements'}>
              Voir nos événements
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
