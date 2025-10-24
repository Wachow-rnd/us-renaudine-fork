import React, { Suspense, useEffect, useState } from "react";
import { Loading } from "../components/ui";
import { articlesService } from "../services/articlesService";

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      tournament: '🏆',
      training: '🏓',
      meeting: '👥',
      social: '🎉',
      competition: '🥇',
      other: '📝'
    };
    return emojis[type] || '📝';
  };

  const getTypeLabel = (type) => {
    const labels = {
      tournament: 'Tournoi',
      training: 'Entraînement',
      meeting: 'Réunion',
      social: 'Événement social',
      competition: 'Compétition',
      other: 'Autre'
    };
    return labels[type] || 'Autre';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Événements</h1>
            <p>
              Découvrez tous nos événements, tournois et activités. 
              Une programmation riche pour tous les niveaux et tous les âges !
            </p>
          </div>
        </section>

        {/* Articles/Événements */}
        <section style={{ 
          padding: "var(--section-padding) 5vw",
          background: "rgba(0,0,0,0.3)"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              marginBottom: "3rem", 
              textAlign: "center",
              color: "var(--secondary-color)"
            }}>
              📅 Nos événements
            </h2>
            
            {articles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{ color: '#ccc', fontSize: '1.2rem' }}>
                  Aucun événement publié pour le moment.
                </p>
                <p style={{ color: '#888', fontSize: '1rem' }}>
                  Revenez bientôt pour découvrir nos prochaines activités !
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "2rem",
                marginBottom: "3rem"
              }}>
                {articles.map((article) => (
                  <article
                    key={article.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      padding: "2rem",
                      borderRadius: "15px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-5px)";
                      e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {/* Image à la une si disponible */}
                    {(article.featuredImage || article.imageUrl) && (
                      <div style={{
                        marginBottom: '1rem',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        height: '200px'
                      }}>
                        <img
                          src={article.featuredImage || article.imageUrl}
                          alt={article.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem"
                    }}>
                      <h3 style={{ 
                        color: "var(--secondary-color)", 
                        margin: 0,
                        fontSize: "1.4rem",
                        lineHeight: "1.3",
                        flex: 1
                      }}>
                        {article.title}
                      </h3>
                      <span style={{
                        background: "var(--primary-color)",
                        color: "white",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        marginLeft: "1rem",
                        whiteSpace: "nowrap"
                      }}>
                        {getTypeEmoji(article.type)} {getTypeLabel(article.type)}
                      </span>
                    </div>
                    
                    {/* Informations événement */}
                    {(article.eventDate || article.eventTime || article.location) && (
                      <div style={{ marginBottom: "1rem" }}>
                        {article.eventDate && (
                          <p style={{ 
                            color: "white", 
                            margin: "0.5rem 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                          }}>
                            <span>📅</span> {formatDate(article.eventDate)}
                          </p>
                        )}
                        {article.eventTime && (
                          <p style={{ 
                            color: "white", 
                            margin: "0.5rem 0",
                            display: "flex",
                            alignItems: "center", 
                            gap: "0.5rem"
                          }}>
                            <span>⏰</span> {formatTime(article.eventTime)}
                          </p>
                        )}
                        {article.location && (
                          <p style={{ 
                            color: "white", 
                            margin: "0.5rem 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                          }}>
                            <span>📍</span> {article.location}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Extrait ou contenu */}
                    <div style={{ 
                      color: "#ccc", 
                      lineHeight: "1.6",
                      margin: "1rem 0"
                    }}>
                      {article.excerpt ? (
                        <p style={{ margin: 0 }}>{article.excerpt}</p>
                      ) : (
                        <p style={{ margin: 0 }}>
                          {article.content.substring(0, 150)}
                          {article.content.length > 150 ? '...' : ''}
                        </p>
                      )}
                    </div>

                    {/* Détails complets du contenu */}
                    {article.content && article.content.length > (article.excerpt?.length || 150) && (
                      <details style={{ marginTop: '1rem' }}>
                        <summary style={{
                          color: 'var(--primary-color)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          marginBottom: '1rem'
                        }}>
                          📖 Lire la suite
                        </summary>
                        <div style={{
                          color: '#ccc',
                          lineHeight: '1.6',
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          whiteSpace: 'pre-line'
                        }}>
                          {article.content}
                        </div>
                      </details>
                    )}

                    {/* Date de publication */}
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.8rem',
                      color: '#888',
                      textAlign: 'right'
                    }}>
                      Publié le {formatDate(article.createdAt)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section style={{ 
          padding: "var(--section-padding) 5vw",
          background: "rgba(110, 193, 228, 0.1)",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ 
              fontSize: "2.2rem", 
              marginBottom: "1.5rem",
              color: "var(--secondary-color)"
            }}>
              Rejoignez-nous !
            </h2>
            <p style={{ 
              fontSize: "1.2rem", 
              color: "white", 
              marginBottom: "2rem",
              lineHeight: "1.6"
            }}>
              Ne manquez aucun de nos événements ! Suivez notre actualité et participez à la vie du club.
            </p>
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <button 
                className="btn"
                style={{
                  background: "var(--secondary-color)",
                  color: "white",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--primary-color)"}
                onMouseLeave={(e) => e.target.style.background = "var(--secondary-color)"}
                onClick={() => window.location.href = '/contact'}
              >
                📞 Nous contacter
              </button>
              <button 
                className="btn"
                style={{
                  background: "transparent",
                  color: "var(--primary-color)",
                  border: "2px solid var(--primary-color)",
                  padding: "1rem 2rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--primary-color)";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "var(--primary-color)";
                }}
                onClick={() => window.location.href = '/club'}
              >
                ℹ️ En savoir plus
              </button>
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  );
}