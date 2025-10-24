/**
 * Service de gestion des articles en mode simulation
 * En production, cela communiquerait avec l'API backend
 */

class ArticlesService {
  constructor() {
    this.storageKey = 'us-renaudine-articles';
    this.initializeDefaultArticles();
  }

  // Initialiser avec les articles du site officiel
  initializeDefaultArticles() {
    const existingArticles = this.getAllArticles();
    if (existingArticles.length === 0) {
      const defaultArticles = [
        {
          id: 1,
          title: "TOURNOI INTERNE DU CLUB",
          excerpt: "Tournoi de fin de saison avec barbecue convivial pour tous les membres du club.",
          content: `🏆 **TOURNOI INTERNE DU CLUB**

Le club US Renaudine Tennis de Table organise son tournoi interne de fin de saison !

**📅 Date :** Juin 2026
**📍 Lieu :** Salle du club de Château-Renault

**🎯 Ouvert à tous les membres du club**
Tous les niveaux sont les bienvenus pour cette journée conviviale qui marque la fin de la saison sportive.

**🍖 BARBECUE INCLUS**
La journée se terminera par un barbecue convivial pour tous les participants et leurs familles.

**📋 Inscriptions :**
Auprès des responsables du club ou sur place le jour J.

Une belle occasion de se retrouver dans une ambiance détendue et sportive !`,
          type: "Tournoi",
          eventDate: "2026-06-15",
          eventTime: "09:00",
          location: "Salle du club",
          status: "published",
          createdAt: "2025-05-25T10:00:00Z",
          publishDate: "2025-05-25T10:00:00Z",
          imageUrl: "/images/articles/tournoi-fin-saison-2026.jpg",
          author: "usrenaudinett"
        },
        {
          id: 2,
          title: "Tournoi Ludovic Bayard Parçay-Meslay",
          excerpt: "Tournoi organisé en mémoire de Ludovic Bayard à Parçay-Meslay.",
          content: `🏓 **Tournoi Ludovic Bayard**

Tournoi organisé à Parçay-Meslay en mémoire de Ludovic Bayard.

**📅 Date :** Avril 2025
**📍 Lieu :** Parçay-Meslay

**🏆 Tournoi en mémoire de Ludovic Bayard**
Un tournoi émouvant organisé pour honorer la mémoire d'un membre important de la communauté du tennis de table local.

**🎯 Participation :**
Ouvert aux joueurs de tous niveaux souhaitant rendre hommage à Ludovic.

**ℹ️ Informations pratiques :**
Voir l'affiche officielle pour tous les détails concernant les inscriptions et le programme.

Une belle occasion de se rassembler autour de notre passion commune.`,
          type: "Tournoi",
          eventDate: "2025-04-26",
          eventTime: "09:00",
          location: "Parçay-Meslay",
          status: "published",
          createdAt: "2025-04-22T14:30:00Z",
          publishDate: "2025-04-22T14:30:00Z",
          imageUrl: "/images/articles/tournoi-ludovic-bayard-2025.jpg",
          author: "usrenaudinett"
        },
        {
          id: 3,
          title: "Tournoi amical de doubles de Cormery-Truyes",
          excerpt: "Tournoi amical de doubles organisé par le club de Cormery-Truyes.",
          content: `🏓🏓 **Tournoi Amical de Doubles**

Le club de Cormery-Truyes organise un tournoi amical de doubles !

**📅 Date :** Avril 2025
**📍 Lieu :** Cormery-Truyes
**🎯 Format :** Doubles uniquement

**🤝 Tournoi amical**
Une compétition dans un esprit convivial et fair-play, parfaite pour découvrir de nouveaux partenaires de jeu.

**📋 Règlement :**
Consultez le règlement officiel du tournoi pour connaître toutes les modalités de participation.

**🏆 Prix et récompenses :**
Récompenses pour les meilleures équipes et ambiance garantie !

**📞 Inscriptions :**
Auprès du club organisateur selon les modalités précisées dans le règlement.

Une belle opportunité de rencontrer d'autres passionnés de tennis de table !`,
          type: "Tournoi",
          eventDate: "2025-04-27",
          eventTime: "09:00",
          location: "Cormery-Truyes",
          status: "published",
          createdAt: "2025-04-19T16:45:00Z",
          publishDate: "2025-04-19T16:45:00Z",
          imageUrl: "/images/articles/tournoi-doubles-cormery-2025.png",
          author: "usrenaudinett"
        },
        {
          id: 4,
          title: "COUPE MIXTE DEPARTEMENTALE",
          excerpt: "Participation à la Coupe Mixte Départementale - Compétition officielle FFTT.",
          content: `🏆 **COUPE MIXTE DÉPARTEMENTALE**

L'US Renaudine participe à la Coupe Mixte Départementale !

**🏓 Compétition officielle FFTT**
Une compétition qui mélange joueurs et joueuses dans un format original et dynamique.

**👥 Équipes mixtes**
Chaque équipe doit être composée de joueurs masculins et féminins selon le règlement FFTT.

**📅 Calendrier :**
Les matchs se déroulent selon le calendrier établi par le comité départemental.

**🎯 Objectif :**
Représenter dignement les couleurs du club dans cette compétition départementale.

**💪 Soutien aux équipes**
Venez encourager nos équipes lors des rencontres à domicile !

**ℹ️ Plus d'informations :**
Suivez les résultats sur le site de la FFTT et les réseaux sociaux du club.`,
          type: "Compétition",
          eventDate: "2025-04-15",
          eventTime: "14:00",
          location: "Divers lieux",
          status: "published",
          createdAt: "2025-04-07T12:00:00Z",
          publishDate: "2025-04-07T12:00:00Z",
          imageUrl: "/images/articles/coupe-davis.png",
          author: "usrenaudinett"
        },
        {
          id: 5,
          title: "Actualité FFTT",
          excerpt: "Suivez l'actualité de la Fédération Française de Tennis de Table et les performances de nos Bleus.",
          content: `🇫🇷 **Actualité FFTT**

Pour suivre l'actualité de la Fédération de Tennis de Table et les compétitions de nos Bleus, rendez-vous sur la page de la **[FFTT](https://www.fftt.com/site/)**

**📰 Que trouver sur le site FFTT :**
- Actualités nationales et internationales
- Résultats des équipes de France
- Règlements et informations techniques
- Calendrier des compétitions
- Formation et perfectionnement

**🏓 Nos Bleus en compétition**
Suivez les performances de l'équipe de France dans les grandes compétitions internationales.

**📚 Ressources pour les clubs**
- Documents officiels
- Guides de formation
- Outils de gestion
- Supports pédagogiques

**🔗 Lien direct :** [www.fftt.com](https://www.fftt.com/site/)

Restez connectés avec l'actualité de notre sport !`,
          type: "Information",
          eventDate: null,
          eventTime: null,
          location: null,
          status: "published",
          createdAt: "2024-10-25T09:00:00Z",
          publishDate: "2024-10-25T09:00:00Z",
          author: "usrenaudinett"
        },
        {
          id: 6,
          title: "Chaîne Youtube USRenaudineTT",
          excerpt: "Découvrez notre chaîne YouTube avec toutes les vidéos des matchs et événements du club.",
          content: `📺 **Chaîne YouTube USRenaudineTT**

Toutes les vidéos des matchs de la 2ème journée sont disponibles sur notre chaîne YouTube !

**🎥 Contenu de la chaîne :**
- Matchs en direct et replays
- Highlights des meilleures actions
- Interviews de joueurs
- Événements du club
- Tutoriels et conseils techniques

**📱 N'hésitez pas à aller faire un tour :**
- Abonnez-vous à la chaîne
- Activez les notifications
- Partagez vos vidéos préférées
- Laissez vos commentaires

**🏓 Revivez les meilleurs moments**
Retrouvez tous les temps forts de nos rencontres et événements.

**🔗 Lien :** [Chaîne YouTube USRenaudineTT](https://www.youtube.com/channel/UCf-BPCtgxwRBc0Ovm10UYIg)

**👍 Votre soutien compte !**
Plus nous avons d'abonnés, plus nous pourrons proposer de contenu de qualité.`,
          type: "Information",
          eventDate: null,
          eventTime: null,
          location: null,
          status: "published",
          createdAt: "2022-10-28T15:30:00Z",
          publishDate: "2022-10-28T15:30:00Z",
          author: "usrenaudinett"
        },
        {
          id: 7,
          title: "Séjour dans le Nord pour l'USR Tennis de Table",
          excerpt: "Récit du week-end de l'Ascension dans le Nord avec rencontre du club de Bourbourg.",
          content: `🚌 **Séjour dans le Nord pour l'USR Tennis de Table**

Lors du week-end de l'Ascension, le club de Tennis de Table de Château-Renault a effectué un déplacement sur 4 jours sur la commune d'Oudezeele dans le Nord.

**🏓 Rencontre sportive**
Évidemment, le club ne pouvait pas faire ce voyage sans rencontrer un club de tennis de table local. Des contacts ont donc été pris avec le club de Bourbourg.

**🏡 Séjour à Oudezeele**
Quatre jours de découverte de la région Nord-Pas-de-Calais, entre tourisme et tennis de table.

**🤝 Échange avec Bourbourg**
Une belle rencontre sportive et humaine avec nos homologues nordistes.

**📰 Article complet**
Consultez l'article détaillé de la Nouvelle République pour revivre ce beau voyage.

**📷 Photos souvenirs**
De nombreuses photos immortalisent ce séjour mémorable.

**🌟 Témoignages**
Les participants gardent un excellent souvenir de ce week-end alliant sport, convivialité et découverte.`,
          type: "Événement",
          eventDate: "2022-05-26",
          eventTime: null,
          location: "Oudezeele (Nord)",
          status: "published",
          createdAt: "2022-08-28T11:15:00Z",
          publishDate: "2022-08-28T11:15:00Z",
          imageUrl: "/images/articles/usrttnord.png",
          author: "usrenaudinett"
        },
        {
          id: 8,
          title: "Tournoi de l'Avent",
          excerpt: "Retour sur le succès du Tournoi de l'Avent avec article de la Nouvelle République.",
          content: `🎄 **Tournoi de l'Avent**

Voici un article de la Nouvelle République suite à notre tournoi de l'Avent.

**🏆 Un tournoi réussi**
Le tournoi de l'Avent organisé par l'US Renaudine a rencontré un franc succès.

**📰 Couverture presse**
La Nouvelle République a consacré un article à cet événement, témoignage de la qualité de l'organisation.

**🎯 Participation**
De nombreux joueurs de tous niveaux ont participé à cette compétition de fin d'année.

**🎄 Ambiance festive**
L'esprit de Noël était au rendez-vous pour cette compétition conviviale.

**🏓 Beau spectacle**
Les matchs ont offert un spectacle de qualité aux nombreux spectateurs présents.

**🔗 Article de presse**
[Cliquez ici pour lire l'article de la Nouvelle République](http://www.lanouvellerepublique.fr/indre-et-loire/commune/chateau-renault/un-tournoi-de-l-avent-reussi)

**📅 Rendez-vous l'année prochaine**
Ce succès nous motive pour organiser à nouveau cet événement.`,
          type: "Tournoi",
          eventDate: "2021-12-11",
          eventTime: "09:00",
          location: "Salle du club",
          status: "published",
          createdAt: "2021-12-18T14:45:00Z",
          publishDate: "2021-12-18T14:45:00Z",
          imageUrl: "/images/articles/tournoi-avent-2019.jpg",
          author: "usrenaudinett"
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
    return this.getAllArticles().filter(article => article.status === 'published');
  }

  // Récupérer un article par ID
  getArticleById(id) {
    const articles = this.getAllArticles();
    return articles.find(article => article.id === parseInt(id));
  }

  // Créer un nouvel article
  createArticle(articleData) {
    try {
      const articles = this.getAllArticles();
      const newId = Math.max(0, ...articles.map(a => a.id)) + 1;
      
      const newArticle = {
        id: newId,
        ...articleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'admin' // En production, récupérer de l'utilisateur connecté
      };
      
      articles.push(newArticle);
      localStorage.setItem(this.storageKey, JSON.stringify(articles));
      
      return { success: true, article: newArticle };
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return { success: false, error: error.message };
    }
  }

  // Mettre à jour un article
  updateArticle(id, updateData) {
    try {
      const articles = this.getAllArticles();
      const articleIndex = articles.findIndex(article => article.id === parseInt(id));
      
      if (articleIndex === -1) {
        return { success: false, error: 'Article non trouvé' };
      }
      
      articles[articleIndex] = {
        ...articles[articleIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(articles));
      
      return { success: true, article: articles[articleIndex] };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      return { success: false, error: error.message };
    }
  }

  // Supprimer un article
  deleteArticle(id) {
    try {
      const articles = this.getAllArticles();
      const filteredArticles = articles.filter(article => article.id !== parseInt(id));
      
      if (articles.length === filteredArticles.length) {
        return { success: false, error: 'Article non trouvé' };
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredArticles));
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return { success: false, error: error.message };
    }
  }

  // Rechercher des articles
  searchArticles(query, filters = {}) {
    let articles = this.getAllArticles();
    
    // Filtrer par statut si spécifié
    if (filters.status) {
      articles = articles.filter(article => article.status === filters.status);
    }
    
    // Filtrer par type si spécifié
    if (filters.type) {
      articles = articles.filter(article => article.type === filters.type);
    }
    
    // Recherche textuelle
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm))
      );
    }
    
    // Trier par date de création (plus récent en premier)
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return articles;
  }

  // Obtenir des statistiques sur les articles
  getArticleStats() {
    const articles = this.getAllArticles();
    
    return {
      total: articles.length,
      published: articles.filter(a => a.status === 'published').length,
      draft: articles.filter(a => a.status === 'draft').length,
      scheduled: articles.filter(a => a.status === 'scheduled').length,
      byType: articles.reduce((acc, article) => {
        acc[article.type] = (acc[article.type] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

// Instance unique du service
export const articlesService = new ArticlesService();
export default articlesService;