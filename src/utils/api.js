/**
 * Utilitaire API pour les appels vers le serveur
 * Gère automatiquement l'authentification JWT et les erreurs
 */

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  constructor() {
    this.baseURL = '';
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Récupère le token d'authentification
   */
  getAuthToken() {
    return localStorage.getItem("jeton");
  }

  /**
   * Prépare les headers pour une requête
   */
  getHeaders(customHeaders = {}) {
    const token = this.getAuthToken();
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Traite la réponse HTTP
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data = null;
    if (isJson) {
      try {
        data = await response.json();
      } catch (error) {
        console.warn('Erreur lors du parsing JSON:', error);
      }
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message = data?.error || data?.message || `Erreur HTTP ${response.status}`;
      throw new ApiError(message, response.status, data);
    }

    return data;
  }

  /**
   * Effectue une requête GET
   */
  async get(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'GET',
        headers: this.getHeaders(options.headers),
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Erreur réseau', 0);
    }
  }

  /**
   * Effectue une requête POST
   */
  async post(url, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Erreur réseau', 0);
    }
  }

  /**
   * Effectue une requête PUT
   */
  async put(url, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'PUT',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Erreur réseau', 0);
    }
  }

  /**
   * Effectue une requête PATCH
   */
  async patch(url, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'PATCH',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Erreur réseau', 0);
    }
  }

  /**
   * Effectue une requête DELETE
   */
  async delete(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'DELETE',
        headers: this.getHeaders(options.headers),
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Erreur réseau', 0);
    }
  }

  /**
   * Upload de fichiers
   */
  async upload(url, file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Pour les uploads, on ne met pas Content-Type pour laisser le navigateur le définir
      const headers = this.getHeaders();
      delete headers['Content-Type'];
      
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers,
        body: formData,
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Erreur lors de l\'upload', 0);
    }
  }
}

// Instance principale de l'API
export const api = new ApiClient();

// Export de la classe d'erreur pour une gestion fine des erreurs
export { ApiError };

// Méthodes de commodité pour la rétrocompatibilité
export default api;