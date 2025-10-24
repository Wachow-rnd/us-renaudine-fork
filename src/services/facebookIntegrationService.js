/**
 * Service d'intégration Facebook pour récupérer automatiquement les posts
 * et les convertir en articles pour le site
 */

class FacebookIntegrationService {
  constructor() {
    this.facebookPageUrl = 'https://www.facebook.com/usrtt/'; // URL de la page FB du club
    this.lastSyncTimestamp = this.getLastSyncTimestamp();
  }

  /**
   * Méthode principale pour synchroniser les posts Facebook
   */
  async syncFacebookPosts() {
    try {
      console.log('🔄 Début de la synchronisation Facebook...');
      
      // En production, utiliser un service de scraping ou API
      const newPosts = await this.fetchFacebookPosts();
      
      if (newPosts.length === 0) {
        console.log('ℹ️ Aucun nouveau post trouvé');
        return { success: true, newArticles: 0 };
      }

      let createdArticles = 0;
      
      for (const post of newPosts) {
        const article = await this.convertPostToArticle(post);
        if (article) {
          // Ici on utiliserait notre articlesService
          const result = await this.createArticleFromPost(article);
          if (result.success) {
            createdArticles++;
            console.log(`✅ Article créé: ${article.title}`);
          }
        }
      }

      this.updateLastSyncTimestamp();
      
      return { 
        success: true, 
        newArticles: createdArticles,
        message: `${createdArticles} nouveaux articles créés depuis Facebook`
      };

    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation Facebook:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Simuler la récupération de posts Facebook
   * En production, remplacer par un vrai scraper ou API
   */
  async fetchFacebookPosts() {
    // SIMULATION - En production, utiliser:
    // - Puppeteer pour scraper
    // - API Facebook Graph (si permissions)
    // - Service tiers comme Zapier webhook
    
    const simulatedPosts = [
      {
        id: 'fb_post_1',
        text: `🏆 Grande nouvelle ! 

L'US Renaudine Tennis de Table organise son tournoi de Noël le 15 décembre 2025 !

📅 Date : 15 décembre 2025
⏰ Heure : 14h00  
📍 Lieu : Salle du club

Inscriptions ouvertes à tous les niveaux ! 
Venez nombreux pour cette journée conviviale 🏓

#TennisDeTable #USRenaudine #TournoiNoel`,
        
        createdTime: new Date('2025-10-20T10:30:00Z'),
        images: [
          'https://example.com/facebook-image-tournoi-noel.jpg'
        ],
        link: 'https://www.facebook.com/usrtt/posts/123456789',
        type: 'status' // status, photo, link, etc.
      },
      
      {
        id: 'fb_post_2',
        text: `📢 Résultats du championnat !

Félicitations à notre équipe 1 qui remporte son match contre Tours TT sur le score de 10-6 ! 

👏 Bravo à tous les joueurs :
- Jean-Marc : 3 victoires
- Sophie : 2 victoires  
- Michel : 3 victoires
- Claire : 2 victoires

Prochaine rencontre le 28 octobre à domicile ! 

#ChampionnatFFTT #USRenaudine #Victoire`,
        
        createdTime: new Date('2025-10-18T20:15:00Z'),
        images: [],
        link: 'https://www.facebook.com/usrtt/posts/123456790',
        type: 'status'
      }
    ];

    // Filtrer les posts plus récents que la dernière synchronisation
    return simulatedPosts.filter(post => 
      post.createdTime > new Date(this.lastSyncTimestamp)
    );
  }

  /**
   * Convertir un post Facebook en article
   */
  async convertPostToArticle(post) {
    try {
      // Analyser le contenu pour extraire les informations
      const analysis = this.analyzePostContent(post.text);
      
      return {
        title: analysis.title,
        excerpt: analysis.excerpt,
        content: this.formatPostContent(post.text),
        type: analysis.type,
        eventDate: analysis.eventDate,
        eventTime: analysis.eventTime,
        location: analysis.location,
        status: 'published', // Auto-publier les posts Facebook
        imageUrl: post.images.length > 0 ? post.images[0] : null,
        facebookPostId: post.id,
        facebookLink: post.link,
        createdAt: post.createdTime.toISOString(),
        publishDate: post.createdTime.toISOString(),
        author: 'Facebook Bot'
      };
    } catch (error) {
      console.error('Erreur lors de la conversion du post:', error);
      return null;
    }
  }

  /**
   * Analyser le contenu d'un post pour extraire les métadonnées
   */
  analyzePostContent(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Détection du titre (première ligne significative)
    let title = lines[0]?.replace(/[🏆📢🎯🏓⚡]/g, '').trim() || 'Actualité du club';
    if (title.length > 80) {
      title = title.substring(0, 77) + '...';
    }

    // Détection de l'excerpt (2-3 premières lignes)
    const excerpt = lines.slice(0, 3).join(' ')
      .replace(/[🏆📢🎯🏓⚡📅⏰📍👏🎄]/g, '')
      .trim()
      .substring(0, 150) + '...';

    // Détection du type d'événement
    let type = 'Information';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('tournoi')) type = 'Tournoi';
    else if (lowerText.includes('championnat') || lowerText.includes('match')) type = 'Compétition';
    else if (lowerText.includes('stage') || lowerText.includes('cours')) type = 'Stage';
    else if (lowerText.includes('assemblée') || lowerText.includes('réunion')) type = 'Réunion';

    // Détection de date (format : "15 décembre 2025", "28 octobre", etc.)
    const dateRegex = /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})?/i;
    const dateMatch = text.match(dateRegex);
    let eventDate = null;
    
    if (dateMatch) {
      const months = {
        janvier: '01', février: '02', mars: '03', avril: '04',
        mai: '05', juin: '06', juillet: '07', août: '08',
        septembre: '09', octobre: '10', novembre: '11', décembre: '12'
      };
      
      const day = dateMatch[1].padStart(2, '0');
      const month = months[dateMatch[2].toLowerCase()];
      const year = dateMatch[3] || new Date().getFullYear();
      
      eventDate = `${year}-${month}-${day}`;
    }

    // Détection d'heure (format : "14h00", "20h15", etc.)
    const timeRegex = /(\d{1,2})h(\d{2})/;
    const timeMatch = text.match(timeRegex);
    const eventTime = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}` : null;

    // Détection du lieu
    let location = null;
    if (text.includes('Salle du club')) location = 'Salle du club';
    else if (text.includes('domicile')) location = 'Salle du club';
    else if (text.includes('extérieur')) location = 'À l\'extérieur';

    return {
      title,
      excerpt,
      type,
      eventDate,
      eventTime,
      location
    };
  }

  /**
   * Formater le contenu du post en markdown
   */
  formatPostContent(text) {
    return text
      // Convertir les emojis de titre en markdown
      .replace(/🏆\s*([^\n]+)/g, '## 🏆 $1')
      .replace(/📢\s*([^\n]+)/g, '## 📢 $1')
      
      // Formater les listes
      .replace(/^-\s+(.+)/gm, '- $1')
      
      // Formater les hashtags
      .replace(/#(\w+)/g, '**#$1**')
      
      // Ajouter des sauts de ligne pour les paragraphes
      .replace(/\n\n/g, '\n\n')
      
      // Préserver la structure originale
      .trim();
  }

  /**
   * Créer un article depuis un post Facebook
   */
  async createArticleFromPost(articleData) {
    // Ici on utiliserait l'articlesService existant
    // Pour la démo, on simule la création
    
    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { articlesService } = await import('./articlesService.js');
      
      return articlesService.createArticle(articleData);
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gestion des timestamps de synchronisation
   */
  getLastSyncTimestamp() {
    try {
      return localStorage.getItem('facebook-last-sync') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 jours par défaut
    } catch {
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  updateLastSyncTimestamp() {
    try {
      localStorage.setItem('facebook-last-sync', new Date().toISOString());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du timestamp:', error);
    }
  }

  /**
   * Configuration d'une synchronisation automatique
   */
  startAutoSync(intervalMinutes = 30) {
    console.log(`🔄 Synchronisation automatique démarrée (toutes les ${intervalMinutes} minutes)`);
    
    return setInterval(async () => {
      const result = await this.syncFacebookPosts();
      if (result.success && result.newArticles > 0) {
        console.log(`✅ ${result.newArticles} nouveaux articles ajoutés automatiquement`);
        
        // Optionnel : notification à l'admin
        this.notifyNewArticles(result.newArticles);
      }
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Notification pour les nouveaux articles
   */
  notifyNewArticles(count) {
    // Ici on pourrait envoyer un email, une notification push, etc.
    console.log(`📧 Notification: ${count} nouveaux articles ajoutés depuis Facebook`);
  }

  /**
   * Test de connexion et récupération manuelle
   */
  async testConnection() {
    try {
      const posts = await this.fetchFacebookPosts();
      return {
        success: true,
        message: `Connexion réussie. ${posts.length} posts récupérés.`,
        posts: posts.map(p => ({ id: p.id, title: p.text.substring(0, 50) + '...' }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instance unique du service
export const facebookIntegrationService = new FacebookIntegrationService();
export default facebookIntegrationService;