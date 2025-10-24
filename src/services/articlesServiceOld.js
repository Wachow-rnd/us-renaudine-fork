/**
 * Service de gestion des articles en mode simulation
 * En production, cela communiquerait avec l'API backend
 */

class ArticlesService {
  constructor() {
    this.storageKey = 'us-renaudine-articles';
    this.initializeDefaultArticles();
  }

  // Initialiser avec quelques articles par défaut
  initializeDefaultArticles() {
    const existingArticles = this.getAllArticles();
    if (existingArticles.length === 0) {
      const defaultArticles = [
        {
          id: 1,
          title: "Tournoi d'été 2025 - Inscriptions ouvertes !",
          excerpt: "Le grand tournoi d'été approche. Inscrivez-vous dès maintenant pour participer à cet événement incontournable.",
          content: `🏆 **Grand Tournoi d'Été 2025**

Nous sommes ravis d'annoncer l'ouverture des inscriptions pour notre traditionnel tournoi d'été !

**Détails de l'événement :**
- 📅 Date : 15 juillet 2025
- ⏰ Heure : 14h00
- 📍 Lieu : Salle du club
- 🎯 Catégories : Débutants, Intermédiaires, Avancés

**Prizes :**
- 🥇 1er place : Trophée + 100€
- 🥈 2ème place : Médaille + 50€  
- 🥉 3ème place : Médaille + 25€

**Inscription :**
Venez vous inscrire au club ou contactez-nous par email. Places limitées !

Nous comptons sur votre participation pour faire de cet événement un grand succès !`,
          eventDate: '2025-07-15',
          eventTime: '14:00',
          location: 'Salle du club',
          type: 'tournament',
          status: 'published',
          featuredImage: '',
          createdAt: '2025-06-01T10:00:00Z',
          updatedAt: '2025-06-01T10:00:00Z',
          author: 'admin'
        },
        {
          id: 2,
          title: "Nouvelle saison - Reprise des entraînements",
          excerpt: "La nouvelle saison commence bientôt ! Découvrez les horaires et les nouveautés de cette année.",
          content: `🏓 **Reprise de la Saison 2025-2026**

C'est avec plaisir que nous vous annonçons la reprise des activités pour la nouvelle saison !

**Horaires d'entraînement :**
- Lundi : 18h00 - 20h00 (Tous niveaux)
- Mercredi : 19h00 - 21h00 (Perfectionnement)
- Vendredi : 18h00 - 20h00 (Jeunes)
- Samedi : 14h00 - 17h00 (Libre + Cours)

**Nouveautés cette année :**
- 🆕 Cours spécialisés pour débutants
- 🏆 Plus de tournois internes
- 🤝 Partenariats avec d'autres clubs
- 📱 Application mobile pour suivre vos progrès

**Inscriptions :**
Les inscriptions sont ouvertes ! Venez nous rencontrer lors de nos portes ouvertes le 1er septembre.

À très bientôt sur les tables !`,
          eventDate: '2025-09-01',
          eventTime: '18:00',
          location: 'Salle du club',
          type: 'training',
          status: 'published',
          featuredImage: '',
          createdAt: '2025-05-15T14:30:00Z',
          updatedAt: '2025-05-15T14:30:00Z',
          author: 'admin'
        }
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultArticles));
    }
  }

  // Récupérer tous les articles
  getAllArticles() {
    try {
      const articles = localStorage.getItem(this.storageKey);
      return articles ? JSON.parse(articles) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  }

  // Récupérer les articles publiés uniquement
  getPublishedArticles() {
    return this.getAllArticles()
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Récupérer un article par ID
  getArticleById(id) {
    const articles = this.getAllArticles();
    return articles.find(article => article.id === parseInt(id));
  }

  // Créer un nouvel article
  createArticle(articleData) {
    const articles = this.getAllArticles();
    const newId = Math.max(...articles.map(a => a.id), 0) + 1;
    
    const newArticle = {
      id: newId,
      ...articleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'admin' // En production, récupérer depuis le contexte auth
    };

    articles.push(newArticle);
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    
    return newArticle;
  }

  // Mettre à jour un article
  updateArticle(id, articleData) {
    const articles = this.getAllArticles();
    const index = articles.findIndex(article => article.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Article non trouvé');
    }

    articles[index] = {
      ...articles[index],
      ...articleData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    return articles[index];
  }

  // Supprimer un article
  deleteArticle(id) {
    const articles = this.getAllArticles();
    const filteredArticles = articles.filter(article => article.id !== parseInt(id));
    
    if (filteredArticles.length === articles.length) {
      throw new Error('Article non trouvé');
    }

    localStorage.setItem(this.storageKey, JSON.stringify(filteredArticles));
    return true;
  }

  // Publier/dépublier un article
  togglePublishStatus(id) {
    const articles = this.getAllArticles();
    const article = articles.find(a => a.id === parseInt(id));
    
    if (!article) {
      throw new Error('Article non trouvé');
    }

    article.status = article.status === 'published' ? 'draft' : 'published';
    article.updatedAt = new Date().toISOString();
    
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    return article;
  }

  // Rechercher des articles
  searchArticles(query) {
    const articles = this.getAllArticles();
    const searchTerm = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrer par type
  getArticlesByType(type) {
    return this.getAllArticles().filter(article => article.type === type);
  }

  // Statistiques
  getStats() {
    const articles = this.getAllArticles();
    return {
      total: articles.length,
      published: articles.filter(a => a.status === 'published').length,
      draft: articles.filter(a => a.status === 'draft').length,
      scheduled: articles.filter(a => a.status === 'scheduled').length
    };
  }
}

// Instance unique du service
export const articlesService = new ArticlesService();
export default articlesService;