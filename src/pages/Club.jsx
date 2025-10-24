import React from "react";
import { Button } from "../components/ui";

export default function Club() {
  return (
    <main style={{ padding: "3rem 1rem", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "1rem", 
            color: "var(--secondary-color)"
          }}>
            US Renaudine Tennis de Table
          </h1>
          <p style={{ 
            fontSize: "1.3rem", 
            fontStyle: "italic",
            color: "#FFD700",
            marginBottom: "2rem"
          }}>
            "Le tennis de table à Château-Renault, c'est plus qu'un sport : c'est une famille !"
          </p>
          <p style={{ 
            fontSize: "1.1rem",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "10px"
          }}>
            Venez découvrir une ambiance unique dans notre club de tennis de table !
          </p>
        </div>

        {/* Histoire du Club */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center"
          }}>
            <div>
              <h2 style={{ 
                color: "var(--primary-color)", 
                marginBottom: "1.5rem",
                fontSize: "2rem"
              }}>
                🏓 Notre Histoire
              </h2>
              <p style={{ 
                lineHeight: "1.8", 
                marginBottom: "1.5rem",
                fontSize: "1.1rem"
              }}>
                L'US Renaudine Tennis de Table est un club historique de <strong>Château-Renault</strong> 
                qui porte les valeurs du sport amateur et de la convivialité depuis de nombreuses années.
              </p>
              <p style={{ 
                lineHeight: "1.8", 
                marginBottom: "1.5rem",
                fontSize: "1.1rem"
              }}>
                Notre club accueille tous les niveaux, des débutants aux compétiteurs, dans une ambiance 
                familiale où le plaisir du jeu et l'esprit d'équipe sont nos priorités.
              </p>
              <p style={{ 
                lineHeight: "1.8",
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "#FFD700"
              }}>
                Plus qu'un club de tennis de table, nous sommes une véritable famille sportive !
              </p>
            </div>
            
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "2rem",
              borderRadius: "15px",
              textAlign: "center"
            }}>
              <div style={{
                width: "200px",
                height: "200px",
                margin: "0 auto 1.5rem",
                background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem"
              }}>
                🏓
              </div>
              <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
                Château-Renault
              </h3>
              <p style={{ color: "#ccc" }}>
                Indre-et-Loire (37)
                <br />
                Région Centre-Val de Loire
              </p>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ 
            color: "var(--primary-color)", 
            marginBottom: "2rem",
            fontSize: "2rem",
            textAlign: "center"
          }}>
            🎯 Nos Valeurs
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            {[
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Esprit Familial",
                description: "Une ambiance conviviale où chacun trouve sa place, des plus jeunes aux vétérans."
              },
              {
                icon: "🏆",
                title: "Excellence Sportive",
                description: "Un encadrement de qualité pour progresser et exceller dans la pratique du tennis de table."
              },
              {
                icon: "🤝",
                title: "Solidarité",
                description: "L'entraide et le soutien mutuel sont au cœur de notre philosophie de club."
              },
              {
                icon: "🎓",
                title: "Formation",
                description: "Nous formons les jeunes talents et accompagnons chaque joueur dans sa progression."
              }
            ].map((valeur, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "2rem",
                  borderRadius: "15px",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {valeur.icon}
                </div>
                <h3 style={{ 
                  color: "var(--secondary-color)", 
                  marginBottom: "1rem",
                  fontSize: "1.3rem"
                }}>
                  {valeur.title}
                </h3>
                <p style={{ 
                  color: "#ccc", 
                  lineHeight: "1.6",
                  fontSize: "1rem"
                }}>
                  {valeur.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Infrastructures */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ 
            color: "var(--primary-color)", 
            marginBottom: "2rem",
            fontSize: "2rem",
            textAlign: "center"
          }}>
            🏢 Nos Installations
          </h2>
          
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "3rem 2rem",
            borderRadius: "15px"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏓</div>
                <h4 style={{ color: "var(--secondary-color)", marginBottom: "0.5rem" }}>
                  Tables de compétition
                </h4>
                <p style={{ color: "#ccc" }}>Matériel homologué FFTT</p>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏠</div>
                <h4 style={{ color: "var(--secondary-color)", marginBottom: "0.5rem" }}>
                  Salle du club
                </h4>
                <p style={{ color: "#ccc" }}>Espace dédié et équipé</p>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
                <h4 style={{ color: "var(--secondary-color)", marginBottom: "0.5rem" }}>
                  Zones d'entraînement
                </h4>
                <p style={{ color: "#ccc" }}>Espaces adaptés à tous niveaux</p>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📹</div>
                <h4 style={{ color: "var(--secondary-color)", marginBottom: "0.5rem" }}>
                  Chaîne YouTube
                </h4>
                <p style={{ color: "#ccc" }}>Retransmission des matchs</p>
              </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <p style={{ 
                fontSize: "1.1rem", 
                fontStyle: "italic",
                color: "#FFD700"
              }}>
                📍 Salle municipale de Château-Renault - Indre-et-Loire
              </p>
            </div>
          </div>
        </section>

        {/* Réseaux et Contact */}
        <section style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "3rem 2rem",
          borderRadius: "15px",
          textAlign: "center"
        }}>
          <h2 style={{ 
            color: "var(--primary-color)", 
            marginBottom: "2rem",
            fontSize: "2rem"
          }}>
            📱 Suivez-nous !
          </h2>
          
          <p style={{ 
            marginBottom: "2rem", 
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            Restez connectés avec l'actualité du club et ne manquez aucun de nos événements !
          </p>
          
          <div style={{ 
            display: "flex", 
            gap: "1.5rem", 
            justifyContent: "center", 
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://www.facebook.com/usrtt/', '_blank')}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              📘 Facebook
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open('https://www.youtube.com/channel/UCf-BPCtgxwRBc0Ovm10UYIg', '_blank')}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              📺 YouTube
            </Button>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => window.location.href = '/contact'}>
              Nous rejoindre
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = '/evenements'}>
              Nos événements
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}