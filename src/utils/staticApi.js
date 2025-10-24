/**
 * API statique pour GitHub Pages
 * Simule les appels serveur avec des données en localStorage
 */

class StaticApiClient {
  constructor() {
    this.initializeData();
  }

  // Initialiser des données de démonstration
  initializeData() {
    if (!localStorage.getItem('static-members')) {
      const demoMembers = [
        {
          id: 1,
          lastName: "Dupont",
          firstName: "Jean",
          licenseNumber: "123456",
          email: "jean.dupont@example.com",
          joinDate: "2023-01-15",
          lastMedicalDate: "2024-09-01",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          lastName: "Martin",
          firstName: "Marie",
          licenseNumber: "789012",
          email: "marie.martin@example.com",
          joinDate: "2023-03-20",
          lastMedicalDate: "2024-08-15",
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('static-members', JSON.stringify(demoMembers));
    }

    if (!localStorage.getItem('static-articles')) {
      const demoArticles = [
        {
          id: 1,
          title: "Début de saison 2024-2025",
          content: "La nouvelle saison commence avec de nouveaux défis...",
          author: "Admin",
          publishDate: "2024-09-01",
          category: "info",
          published: true
        }
      ];
      localStorage.setItem('static-articles', JSON.stringify(demoArticles));
    }
  }

  // Simulation d'appels API
  async get(endpoint) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simule délai réseau
    
    if (endpoint === '/api/members') {
      const members = JSON.parse(localStorage.getItem('static-members') || '[]');
      return { data: members };
    }
    
    if (endpoint === '/api/articles') {
      const articles = JSON.parse(localStorage.getItem('static-articles') || '[]');
      return { data: articles };
    }
    
    throw new Error(`Endpoint ${endpoint} non supporté en mode statique`);
  }

  async post(endpoint, data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint === '/api/members') {
      const members = JSON.parse(localStorage.getItem('static-members') || '[]');
      const newMember = {
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      members.push(newMember);
      localStorage.setItem('static-members', JSON.stringify(members));
      return { member: newMember };
    }
    
    throw new Error(`Endpoint ${endpoint} non supporté en mode statique`);
  }

  async put(endpoint, data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint.startsWith('/api/members/')) {
      const id = parseInt(endpoint.split('/').pop());
      const members = JSON.parse(localStorage.getItem('static-members') || '[]');
      const index = members.findIndex(m => m.id === id);
      
      if (index === -1) {
        throw new Error('Membre non trouvé');
      }
      
      members[index] = { ...members[index], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem('static-members', JSON.stringify(members));
      return { member: members[index] };
    }
    
    throw new Error(`Endpoint ${endpoint} non supporté en mode statique`);
  }

  async delete(endpoint) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint.startsWith('/api/members/')) {
      const id = parseInt(endpoint.split('/').pop());
      const members = JSON.parse(localStorage.getItem('static-members') || '[]');
      const filteredMembers = members.filter(m => m.id !== id);
      
      if (filteredMembers.length === members.length) {
        throw new Error('Membre non trouvé');
      }
      
      localStorage.setItem('static-members', JSON.stringify(filteredMembers));
      return { success: true };
    }
    
    throw new Error(`Endpoint ${endpoint} non supporté en mode statique`);
  }
}

export const staticApi = new StaticApiClient();
