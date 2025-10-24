import React, { Suspense, useEffect, useState } from "react";
import { Loading } from "../components/ui";
import articlesService from "../services/articlesService";

export default function Evenements() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les articles publiés
    try {
      const publishedArticles = articlesService.getPublishedArticles();
      setArticles(publishedArticles);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'tournament': return 'var(--secondary-color)';
      case 'training': return 'var(--primary-color)';
      case 'competition': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'tournament': return 'Tournoi';
      case 'training': return 'Entraînement';
      case 'competition': return 'Compétition';
      default: return 'Événement';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section style={{ padding: "3rem 1rem", textAlign: "center", color: "white" }}>
        <h1>Chargement des événements...</h1>
      </section>
    );
  }

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'past');

  return (
    <section className="evenements" style={{ padding: "3rem 1rem", color: "white" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "2rem", 
          color: "var(--secondary-color)",
          textAlign: "center"
        }}>
          Événements du Club
        </h1>

        {/* Événements à venir */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ 
            color: "var(--primary-color)", 
            marginBottom: "1.5rem",
            borderBottom: "2px solid var(--primary-color)",
            paddingBottom: "0.5rem"
          }}>
            À venir
          </h2>
          
          {upcomingEvents.length === 0 ? (
            <p style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "2rem", 
              borderRadius: "10px",
              textAlign: "center",
              fontStyle: "italic"
            }}>
              Aucun événement prévu pour le moment.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {upcomingEvents.map(event => (
                <div key={event.id} style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  borderLeft: `4px solid ${getEventTypeColor(event.type)}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <h3 style={{ margin: 0, color: "white" }}>{event.title}</h3>
                    <span style={{
                      background: getEventTypeColor(event.type),
                      color: "white",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold"
                    }}>
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
                    <div>
                      <strong>📅 {formatDate(event.date)}</strong>
                    </div>
                    <div>
                      <strong>🕒 {event.time}</strong>
                    </div>
                  </div>
                  
                  <p style={{ margin: 0, lineHeight: "1.5" }}>{event.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Événements passés */}
        <section>
          <h2 style={{ 
            color: "var(--primary-color)", 
            marginBottom: "1.5rem",
            borderBottom: "2px solid var(--primary-color)",
            paddingBottom: "0.5rem"
          }}>
            Événements passés
          </h2>
          
          {pastEvents.length === 0 ? (
            <p style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "2rem", 
              borderRadius: "10px",
              textAlign: "center",
              fontStyle: "italic"
            }}>
              Aucun événement passé à afficher.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {pastEvents.map(event => (
                <div key={event.id} style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "1rem",
                  borderRadius: "8px",
                  borderLeft: `3px solid rgba(108, 117, 125, 0.5)`,
                  opacity: 0.8
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, color: "white" }}>{event.title}</h4>
                    <div style={{ fontSize: "0.8rem", color: "#ccc" }}>
                      {formatDate(event.date)} - {event.time}
                    </div>
                  </div>
                  <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#ddd" }}>
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section d'appel à l'action */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "2rem",
          borderRadius: "10px",
          textAlign: "center",
          marginTop: "3rem"
        }}>
          <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
            Envie de participer ?
          </h3>
          <p style={{ marginBottom: "1.5rem" }}>
            Contactez-nous pour vous inscrire aux prochains événements ou pour proposer vos idées !
          </p>
          <a href="/contact" className="btn btn-contact" style={{ textDecoration: "none" }}>
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
