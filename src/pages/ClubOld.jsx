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
            d'esprit d'équipe.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "1.5rem", 
            borderRadius: "10px" 
          }}>
            <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>Équipements</h3>
            <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
              <li>• 6 tables de compétition</li>
              <li>• Vestiaires équipés</li>
              <li>• Éclairage professionnel</li>
              <li>• Matériel d'entraînement</li>
            </ul>
          </div>

          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "1.5rem", 
            borderRadius: "10px" 
          }}>
            <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>Horaires</h3>
            <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
              <li>• Lundi : 18h - 22h</li>
              <li>• Mercredi : 18h - 22h</li>
              <li>• Vendredi : 18h - 22h</li>
              <li>• Samedi : 14h - 18h</li>
            </ul>
          </div>

          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "1.5rem", 
            borderRadius: "10px" 
          }}>
            <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>Tarifs</h3>
            <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
              <li>• Adultes : 120€/an</li>
              <li>• Jeunes (-18) : 80€/an</li>
              <li>• Étudiants : 90€/an</li>
              <li>• Famille : 280€/an</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          background: "rgba(255, 255, 255, 0.1)", 
          padding: "2rem", 
          borderRadius: "10px" 
        }}>
          <h2 style={{ color: "var(--primary-color)", marginBottom: "1rem" }}>Rejoignez-nous !</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Que vous souhaitiez découvrir le tennis de table ou perfectionner votre niveau, 
            notre club vous accueille dans une ambiance chaleureuse. Nos entraîneurs qualifiés 
            vous accompagneront dans votre progression.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <a href="/contact" className="btn btn-contact" style={{ textDecoration: "none" }}>
              Nous contacter
            </a>
            <a href="/membres" className="btn btn-info" style={{ textDecoration: "none" }}>
              Voir les membres
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
