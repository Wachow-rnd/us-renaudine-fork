import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { staticApi as api } from "../utils/staticApi";
import { articlesService } from "../services/articlesService";
import { Button, Loading, Alert, Modal } from "../components/ui";
import ArticleForm from "../components/ArticleForm";
import FacebookIntegration from "../components/FacebookIntegration";
import ProtectedRoute from "../components/ProtectedRoute";

function GestionContent() {
  const { user, login, logout, canManage } = useAuth();
  const [currentTab, setCurrentTab] = useState("membres");
  
  // États pour la gestion des membres
  const [formulaire, setFormulaire] = useState({
    lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "", email: ""
  });
  const [membres, setMembres] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // États pour la gestion des articles
  const [articles, setArticles] = useState([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleFilter, setArticleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la gestion de la galerie
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [managingCategory, setManagingCategory] = useState(null);
  const [categoryPhotos, setCategoryPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryStats, setGalleryStats] = useState({
    equipes: 0,
    evenements: 0,
    matchs: 0,
    tournois: 0,
    voyages: 0,
    divers: 0
  });

  // État pour gérer les photos supprimées (persisté dans localStorage)
  const [deletedPhotos, setDeletedPhotos] = useState(() => {
    // Nettoyer l'ancien système d'IDs si présent
    const oldSaved = localStorage.getItem('galerie-deleted-photos');
    if (oldSaved) {
      localStorage.removeItem('galerie-deleted-photos');
    }
    
    const saved = localStorage.getItem('galerie-deleted-photos-paths');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { 
    if (user && canManage()) {
      recupererMembres();
      loadArticles();
      loadGalleryStats();
    }
  }, [user, canManage]);

  // Fonctions pour la gestion des membres (existantes)
  async function recupererMembres() {
    try {
      setLoading(true);
      const response = await api.get("/api/members");
      setMembres(response.data || []);
    } catch (err) {
      setErreur("Erreur lors du chargement des membres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErreur(null);
    setLoginLoading(true);
    
    try {
      const result = await login(loginForm.username, loginForm.password);
      if (result.success) {
        setLoginForm({ username: "", password: "" });
        await recupererMembres();
        loadArticles();
      } else {
        setErreur(result.error);
      }
    } catch (err) {
      setErreur(err.message || "Connexion impossible");
    } finally {
      setLoginLoading(false);
    }
  }

  async function creerMembre() {
    setErreur(null);
    if (!formulaire.lastName.trim() || !formulaire.firstName.trim()) {
      setErreur("Nom et prénom sont requis");
      return;
    }
    
    try {
      setLoading(true);
      await api.post("/api/members", formulaire);
      setFormulaire({ lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "", email: "" });
      await recupererMembres();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmerSuppression(membre) {
    try {
      setLoading(true);
      await api.delete(`/api/members/${membre.id}`);
      await recupererMembres();
      setShowDeleteModal(null);
    } catch (err) {
      setErreur(`Erreur lors de la suppression: ${err.message}`);
      setShowDeleteModal(null);
    } finally {
      setLoading(false);
    }
  }

  function ouvrirModificationMembre(membre) {
    setEditingMember({
      id: membre.id,
      lastName: membre.lastName,
      firstName: membre.firstName,
      licenseNumber: membre.licenseNumber || "",
      joinDate: membre.joinDate || "",
      lastMedicalDate: membre.lastMedicalDate || "",
      email: membre.email || ""
    });
    setShowEditModal(true);
  }

  async function modifierMembre() {
    setErreur(null);
    if (!editingMember.lastName.trim() || !editingMember.firstName.trim()) {
      setErreur("Nom et prénom sont requis");
      return;
    }
    
    try {
      setLoading(true);
      await api.put(`/api/members/${editingMember.id}`, editingMember);
      await recupererMembres();
      setShowEditModal(false);
      setEditingMember(null);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fermerModificationMembre() {
    setShowEditModal(false);
    setEditingMember(null);
    setErreur(null);
  }

  // Fonctions pour la gestion des articles
  function loadArticles() {
    const allArticles = articlesService.getAllArticles();
    setArticles(allArticles);
  }

  function handleArticleSuccess() {
    loadArticles();
    setShowArticleForm(false);
    setEditingArticle(null);
  }

  function handleEditArticle(article) {
    setEditingArticle(article);
    setShowArticleForm(true);
  }

  function handleDeleteArticle(articleId) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      articlesService.deleteArticle(articleId);
      loadArticles();
    }
  }

  function handlePublishArticle(articleId) {
    articlesService.updateArticle(articleId, { status: "published" });
    loadArticles();
  }

  function handleUnpublishArticle(articleId) {
    articlesService.updateArticle(articleId, { status: "draft" });
    loadArticles();
  }

  function getFilteredArticles() {
    let filtered = articles;

    // Filtrer par statut
    if (articleFilter !== "all") {
      filtered = filtered.filter(article => article.status === articleFilter);
    }

    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.content.toLowerCase().includes(term) ||
        article.type.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Fonctions pour la gestion de la galerie
  function detectCategoryFromFilename(filename) {
    const name = filename.toLowerCase();
    
    if (name.includes('match') || name.includes('partie')) return 'matchs';
    if (name.includes('equipe') || name.includes('team') || name.includes('groupe')) return 'equipes';
    if (name.includes('tournoi') || name.includes('competition') || name.includes('championnat')) return 'tournois';
    if (name.includes('voyage') || name.includes('deplacement') || name.includes('sortie')) return 'voyages';
    if (name.includes('event') || name.includes('evenement') || name.includes('manifestation')) return 'evenements';
    
    return 'divers'; // Catégorie par défaut
  }

  function handleGalleryImageUpload(e) {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB par image
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const newImages = [];

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setErreur(`Format non supporté: ${file.name}. Utilisez JPG, PNG ou WebP.`);
        return;
      }
      
      if (file.size > maxSize) {
        setErreur(`Image trop volumineuse: ${file.name}. Maximum 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const detectedCategory = detectCategoryFromFilename(file.name);
        const newImage = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: event.target.result,
          size: file.size,
          detectedCategory: detectedCategory,
          finalCategory: selectedCategory || detectedCategory
        };
        
        newImages.push(newImage);
        
        if (newImages.length === files.length) {
          setGalleryImages(prev => [...prev, ...newImages]);
          
          // Afficher l'aperçu
          const previewDiv = document.getElementById('gallery-upload-preview');
          const uploadBtn = document.getElementById('upload-gallery-btn');
          if (previewDiv && uploadBtn) {
            previewDiv.style.display = 'block';
            uploadBtn.style.display = 'inline-flex';
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  }

  function handleCategoryChange(e) {
    const value = e.target.value;
    setSelectedCategory(value);
    
    const newCategoryField = document.getElementById('new-category-field');
    if (newCategoryField) {
      newCategoryField.style.display = value === 'custom' ? 'block' : 'none';
    }

    // Mettre à jour la catégorie de toutes les images en attente
    setGalleryImages(prev => prev.map(img => ({
      ...img,
      finalCategory: value === 'custom' ? newCategoryName : (value || img.detectedCategory)
    })));
  }

  async function uploadGalleryImages() {
    if (galleryImages.length === 0) return;

    setGalleryUploadLoading(true);
    setErreur(null);

    try {
      // Compter les photos par catégorie pour mettre à jour les statistiques
      const categoryCount = {};
      
      // Simulation d'upload - dans un vrai projet, vous enverriez les images au serveur
      for (const image of galleryImages) {
        const category = selectedCategory === 'custom' ? newCategoryName : image.finalCategory;
        
        // Ici vous pourriez envoyer l'image au serveur
        // await api.post(`/api/gallery/${category}/upload`, { image: image.data, name: image.name });
        
        console.log(`Uploading ${image.name} to category: ${category}`);
        
        // Compter les uploads par catégorie
        categoryCount[category] = (categoryCount[category] || 0) + 1;
        
        // Simuler un délai d'upload
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Mettre à jour les statistiques
      const newStats = { ...galleryStats };
      Object.keys(categoryCount).forEach(category => {
        newStats[category] = (newStats[category] || 0) + categoryCount[category];
      });
      setGalleryStats(newStats);

      // Succès
      const uploadedCount = galleryImages.length;
      setGalleryImages([]);
      setSelectedCategory("");
      setNewCategoryName("");
      
      // Cacher l'aperçu
      const previewDiv = document.getElementById('gallery-upload-preview');
      const uploadBtn = document.getElementById('upload-gallery-btn');
      if (previewDiv && uploadBtn) {
        previewDiv.style.display = 'none';
        uploadBtn.style.display = 'none';
      }

      // Message de succès
      alert(`✅ ${uploadedCount} photo(s) ajoutée(s) avec succès à la galerie !`);
      
    } catch (err) {
      setErreur(`Erreur lors de l'upload: ${err.message}`);
    } finally {
      setGalleryUploadLoading(false);
    }
  }

  function removeGalleryImage(imageId) {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    
    if (galleryImages.length <= 1) {
      const previewDiv = document.getElementById('gallery-upload-preview');
      const uploadBtn = document.getElementById('upload-gallery-btn');
      if (previewDiv && uploadBtn) {
        previewDiv.style.display = 'none';
        uploadBtn.style.display = 'none';
      }
    }
  }

  // Fonction pour charger les statistiques de la galerie
  async function loadGalleryStats() {
    try {
      // Calculer les statistiques en tenant compte des photos supprimées
      const categories = ['equipes', 'evenements', 'matchs', 'tournois', 'voyages', 'divers'];
      const stats = {};
      
      categories.forEach(category => {
        const categoryPhotos = getMockPhotosForCategory(category);
        stats[category] = categoryPhotos.length;
      });
      
      setGalleryStats(stats);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques de galerie:", err);
    }
  }

  // Fonction pour charger les vraies photos d'une catégorie
  async function loadCategoryPhotos(categoryName) {
    try {
      // Utiliser directement les données mockées qui correspondent à la galerie publique
      return getMockPhotosForCategory(categoryName);
    } catch (err) {
      console.error(`Erreur lors du chargement des photos de ${categoryName}:`, err);
      return [];
    }
  }

  // Données synchronisées avec la galerie publique (après filtrage)
  function getMockPhotosForCategory(categoryName) {
    // Images exclues de l'affichage (même filtrage que la galerie publique)
    const excludedImages = [
      'affiche-montee-n3.jpg',
      'bbq-affiche.jpg', 
      'aire-sportive-p-verite.jpg'
    ];

    const allPhotos = {
      'equipes': [
        'equipe-d1600-cyrille-2015-2016.jpg',
        'equipe-d2-cyrille-2019-2020.jpg',
        'equipe-d3-philippe-2018-2019.jpg',
        'equipe-d3-philippe-2019-2020.jpg',
        'equipes-jeunes-2018-2019.jpg'
      ],
      'evenements': [
        // aire-sportive-p-verite.jpg est exclu du filtrage
      ],
      'matchs': [
        'img-2596.jpg',
        'img-2598.jpg',
        'img-2609.jpg',
        'img-2612.jpg',
        'img-2623.jpg'
      ],
      'tournois': [
        'tournoi-fin-saison-2026.jpg',
        'tournoi-avent-13dec.jpg',
        'tournoi-avent-2019.jpg',
        'tournoi-doubles-cormery-2025.png',
        'tournoi-ludovic-bayard-2025.jpg',
        'coupe-davis.png'
      ],
      'voyages': [
        'usrttnord.png'
      ],
      'divers': [
        // affiche-montee-n3.jpg exclu du filtrage
        'article-montee-n3.jpg',
        'flechettes-1.jpg',
        'flechettes-2.jpg',
        'reception-bourbourg.jpg',
        'repas-flechettes.jpg'
      ]
    };

    const photos = allPhotos[categoryName] || [];
    
    // Appliquer le même filtre que la galerie publique
    const filteredPhotos = photos.filter(photoName => 
      !excludedImages.some(excluded => photoName.includes(excluded))
    );

    // Créer les objets photo avec des IDs persistants basés sur le nom de fichier
    const photoObjects = filteredPhotos.map((photoName, index) => ({
      id: `${categoryName}-${photoName}`,
      name: photoName,
      url: `/images/galerie/${categoryName}/${photoName}`,
      size: Math.floor(Math.random() * 3000000) + 1000000, // 1-3MB
      uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));

    // Filtrer les photos supprimées (persistent via localStorage par chemin)
    return photoObjects.filter(photo => !deletedPhotos.includes(photo.url));

    return (realPhotos[categoryName] || []).map((photoName, i) => ({
      id: `${categoryName}-${photoName}-${i}`,
      name: photoName,
      url: `/images/galerie/${categoryName}/${photoName}`,
      size: Math.floor(Math.random() * 3000000) + 1000000,
      uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  // Fonctions de gestion des catégories et photos existantes
  async function handleManageCategory(categoryName) {
    setManagingCategory(categoryName);
    setShowCategoryManager(true);
    
    // Charger les vraies photos de la catégorie
    const photos = await loadCategoryPhotos(categoryName);
    setCategoryPhotos(photos);
    setSelectedPhotos([]);
  }

  async function handleDeleteCategory(categoryName) {
    const photoCount = galleryStats[categoryName] || 0;
    const confirmation = window.confirm(
      `⚠️ Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?\n\n` +
      `Cela supprimera définitivement ${photoCount} photo(s) de cette catégorie.\n` +
      `Cette action est irréversible.`
    );
    
    if (!confirmation) return;

    try {
      setLoading(true);
      
      // Simuler la suppression de la catégorie
      // Dans un vrai projet, vous feriez un appel API pour supprimer le dossier et son contenu
      // await api.delete(`/api/gallery/${categoryName}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les statistiques (remettre à 0 pour cette catégorie)
      setGalleryStats(prev => ({
        ...prev,
        [categoryName]: 0
      }));
      
      alert(`✅ Catégorie "${categoryName}" supprimée avec succès ! ${photoCount} photo(s) supprimée(s).`);
      
    } catch (err) {
      setErreur(`Erreur lors de la suppression de la catégorie: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function togglePhotoSelection(photoId) {
    console.log('Toggling photo:', photoId); // Debug
    setSelectedPhotos(prev => {
      const isSelected = prev.includes(photoId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId];
      console.log('New selection:', newSelection); // Debug
      return newSelection;
    });
  }

  function selectAllPhotos() {
    setSelectedPhotos(categoryPhotos.map(photo => photo.id));
  }

  function deselectAllPhotos() {
    setSelectedPhotos([]);
  }

  async function deleteSelectedPhotos() {
    if (selectedPhotos.length === 0) return;

    const confirmation = window.confirm(
      `⚠️ Êtes-vous sûr de vouloir supprimer ${selectedPhotos.length} photo(s) ?\n\n` +
      `Cette action est irréversible.`
    );
    
    if (!confirmation) return;

    try {
      setLoading(true);
      
      // Dans un vrai projet, vous feriez un appel API pour supprimer les fichiers
      // await api.delete(`/api/gallery/${managingCategory}/photos`, { photoIds: selectedPhotos });
      
      // Simuler la suppression des photos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ajouter les chemins des photos supprimées à la liste persistante
      const deletedPaths = selectedPhotos.map(photoId => {
        const photo = categoryPhotos.find(p => p.id === photoId);
        return photo ? photo.url : null;
      }).filter(Boolean);
      
      const newDeletedPhotos = [...deletedPhotos, ...deletedPaths];
      setDeletedPhotos(newDeletedPhotos);
      localStorage.setItem('galerie-deleted-photos-paths', JSON.stringify(newDeletedPhotos));
      
      // Retirer les photos supprimées de la liste
      const newPhotos = categoryPhotos.filter(photo => !selectedPhotos.includes(photo.id));
      setCategoryPhotos(newPhotos);
      setSelectedPhotos([]);
      
      // Mettre à jour les statistiques avec le nouveau calcul
      setGalleryStats(prev => ({
        ...prev,
        [managingCategory]: newPhotos.length
      }));
      
      // Recharger toutes les statistiques pour synchroniser
      loadGalleryStats();
      
      alert(`✅ ${selectedPhotos.length} photo(s) supprimée(s) avec succès !`);
      
    } catch (err) {
      setErreur(`Erreur lors de la suppression des photos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setMembres([]);
    setArticles([]);
    setFormulaire({ lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "", email: "" });
    setErreur(null);
    setCurrentTab("membres");
    
    // Reset galerie
    setGalleryImages([]);
    setSelectedCategory("");
    setNewCategoryName("");
  }

  const tabStyle = (isActive) => ({
    padding: "0.75rem 1.5rem",
    backgroundColor: isActive ? "var(--primary-color)" : "rgba(255, 255, 255, 0.1)",
    color: isActive ? "white" : "#ccc",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.3s ease"
  });

  return (
    <main style={{ padding: "3rem 1rem", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--secondary-color)" }}>
          Gestion du club
        </h1>

        {!user ? (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "2rem", 
              borderRadius: "10px" 
            }}>
              <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem", textAlign: "center" }}>
                Connexion
              </h2>
              
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1rem" }}>
                  <input 
                    name="username"
                    placeholder="Nom d'utilisateur" 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    autoComplete="username" 
                    required 
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="Mot de passe"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    autoComplete="current-password" 
                    required 
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loginLoading}
                  style={{ width: "100%" }}
                >
                  Se connecter
                </Button>
              </form>
              
              {erreur && (
                <Alert type="error" style={{ marginTop: "1rem" }}>
                  {erreur}
                </Alert>
              )}
            </div>
          </div>
        ) : !canManage() ? (
          <Alert type="warning">
            <h3>Accès limité</h3>
            <p>Vous n'avez pas les permissions nécessaires pour gérer le club.</p>
          </Alert>
        ) : (
          <>
            {/* Header avec informations utilisateur */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "2rem",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px"
            }}>
              <div>
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  Connecté en tant que <strong>{user.username}</strong> ({user.role})
                </p>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>

            {/* Onglets de navigation */}
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              marginBottom: "2rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <button
                style={tabStyle(currentTab === "membres")}
                onClick={() => setCurrentTab("membres")}
              >
                👥 Gestion des membres
              </button>
              <button
                style={tabStyle(currentTab === "articles")}
                onClick={() => setCurrentTab("articles")}
              >
                📝 Gestion des articles
              </button>
              <button
                style={tabStyle(currentTab === "galerie")}
                onClick={() => setCurrentTab("galerie")}
              >
                🖼️ Gestion de la galerie
              </button>
              <button
                style={tabStyle(currentTab === "facebook")}
                onClick={() => setCurrentTab("facebook")}
              >
                📘 Intégration Facebook
              </button>
            </div>

            {/* Contenu des onglets */}
            {currentTab === "membres" && (
              <>
                {/* Section d'ajout de membre */}
                <section style={{ 
                  background: "rgba(255, 255, 255, 0.1)", 
                  padding: "2rem", 
                  borderRadius: "10px",
                  marginBottom: "2rem"
                }}>
                  <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                    Ajouter un membre
                  </h2>
                  
                  <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <input 
                        placeholder="Nom *" 
                        value={formulaire.lastName} 
                        onChange={e => setFormulaire({ ...formulaire, lastName: e.target.value })} 
                        required 
                        style={{ 
                          padding: "0.75rem", 
                          borderRadius: "5px", 
                          border: "1px solid #ccc",
                          fontSize: "1rem"
                        }}
                      />
                      <input 
                        placeholder="Prénom *" 
                        value={formulaire.firstName} 
                        onChange={e => setFormulaire({ ...formulaire, firstName: e.target.value })} 
                        required 
                        style={{ 
                          padding: "0.75rem", 
                          borderRadius: "5px", 
                          border: "1px solid #ccc",
                          fontSize: "1rem"
                        }}
                      />
                    </div>
                    
                    <input 
                      placeholder="N° licence" 
                      value={formulaire.licenseNumber} 
                      onChange={e => setFormulaire({ ...formulaire, licenseNumber: e.target.value })} 
                      style={{ 
                        padding: "0.75rem", 
                        borderRadius: "5px", 
                        border: "1px solid #ccc",
                        fontSize: "1rem"
                      }}
                    />
                    
                    <input 
                      type="email"
                      placeholder="Adresse e-mail" 
                      value={formulaire.email} 
                      onChange={e => setFormulaire({ ...formulaire, email: e.target.value })} 
                      style={{ 
                        padding: "0.75rem", 
                        borderRadius: "5px", 
                        border: "1px solid #ccc",
                        fontSize: "1rem"
                      }}
                    />
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                          Date d'entrée au club
                        </label>
                        <input 
                          type="date" 
                          value={formulaire.joinDate} 
                          onChange={e => setFormulaire({ ...formulaire, joinDate: e.target.value })} 
                          style={{ 
                            width: "100%",
                            padding: "0.75rem", 
                            borderRadius: "5px", 
                            border: "1px solid #ccc",
                            fontSize: "1rem"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                          Date certificat médical
                        </label>
                        <input 
                          type="date" 
                          value={formulaire.lastMedicalDate} 
                          onChange={e => setFormulaire({ ...formulaire, lastMedicalDate: e.target.value })} 
                          style={{ 
                            width: "100%",
                            padding: "0.75rem", 
                            borderRadius: "5px", 
                            border: "1px solid #ccc",
                            fontSize: "1rem"
                          }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                      <Button 
                        variant="primary"
                        onClick={creerMembre} 
                        disabled={!formulaire.lastName.trim() || !formulaire.firstName.trim() || loading}
                        loading={loading}
                      >
                        Ajouter le membre
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setFormulaire({ lastName: "", firstName: "", licenseNumber: "", joinDate: "", lastMedicalDate: "", email: "" })}
                        disabled={loading}
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                  
                  {erreur && (
                    <Alert type="error" style={{ marginTop: "1rem" }}>
                      {erreur}
                    </Alert>
                  )}
                </section>

                {/* Section liste des membres */}
                <section style={{ 
                  background: "rgba(255, 255, 255, 0.1)", 
                  padding: "2rem", 
                  borderRadius: "10px"
                }}>
                  <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                    Liste des membres ({membres.length})
                  </h2>
                  
                  {loading && <Loading text="Chargement des membres..." />}
                  
                  {!loading && membres.length === 0 ? (
                    <Alert type="info">
                      Aucun membre enregistré pour le moment.
                    </Alert>
                  ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {membres.map(membre => (
                        <div 
                          key={membre.id} 
                          style={{ 
                            background: "rgba(255, 255, 255, 0.05)",
                            padding: "1.5rem", 
                            borderRadius: "8px",
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                              {membre.lastName} {membre.firstName}
                            </h4>
                            <div style={{ fontSize: "0.9rem", color: "#ccc", display: "grid", gap: "0.25rem" }}>
                              <div><strong>N° licence:</strong> {membre.licenseNumber || "Non renseigné"}</div>
                              <div><strong>Email:</strong> {membre.email || "Non renseigné"}</div>
                              <div><strong>Entrée:</strong> {membre.joinDate || "Non renseignée"}</div>
                              <div><strong>Certificat médical:</strong> {membre.lastMedicalDate || "Non renseigné"}</div>
                            </div>
                          </div>
                          
                          <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => navigator.clipboard?.writeText(JSON.stringify(membre, null, 2))}
                              title="Copier les informations"
                            >
                              📋
                            </Button>
                            <Button 
                              variant="primary" 
                              size="small"
                              onClick={() => ouvrirModificationMembre(membre)}
                              disabled={loading}
                              title="Modifier le membre"
                            >
                              ✏️
                            </Button>
                            <Button 
                              variant="danger" 
                              size="small"
                              onClick={() => setShowDeleteModal(membre)}
                              disabled={loading}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Modal de confirmation de suppression */}
                <Modal
                  isOpen={!!showDeleteModal}
                  onClose={() => setShowDeleteModal(null)}
                  title="Confirmer la suppression"
                  size="small"
                >
                  {showDeleteModal && (
                    <div>
                      <p style={{ marginBottom: "1.5rem" }}>
                        Êtes-vous sûr de vouloir supprimer le membre{" "}
                        <strong>{showDeleteModal.lastName} {showDeleteModal.firstName}</strong> ?
                      </p>
                      <Alert type="warning" style={{ marginBottom: "1.5rem" }}>
                        Cette action est irréversible.
                      </Alert>
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button variant="ghost" onClick={() => setShowDeleteModal(null)}>
                          Annuler
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => confirmerSuppression(showDeleteModal)}
                          loading={loading}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}
                </Modal>

                {/* Modal de modification d'un membre */}
                <Modal
                  isOpen={showEditModal}
                  onClose={fermerModificationMembre}
                  title="Modifier le membre"
                  size="medium"
                >
                  {editingMember && (
                    <div>
                      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <input 
                            placeholder="Nom *" 
                            value={editingMember.lastName} 
                            onChange={e => setEditingMember({ ...editingMember, lastName: e.target.value })} 
                            required 
                            style={{ 
                              padding: "0.75rem", 
                              borderRadius: "5px", 
                              border: "1px solid #ccc",
                              fontSize: "1rem"
                            }}
                          />
                          <input 
                            placeholder="Prénom *" 
                            value={editingMember.firstName} 
                            onChange={e => setEditingMember({ ...editingMember, firstName: e.target.value })} 
                            required 
                            style={{ 
                              padding: "0.75rem", 
                              borderRadius: "5px", 
                              border: "1px solid #ccc",
                              fontSize: "1rem"
                            }}
                          />
                        </div>
                        
                        <input 
                          placeholder="N° licence" 
                          value={editingMember.licenseNumber} 
                          onChange={e => setEditingMember({ ...editingMember, licenseNumber: e.target.value })} 
                          style={{ 
                            padding: "0.75rem", 
                            borderRadius: "5px", 
                            border: "1px solid #ccc",
                            fontSize: "1rem"
                          }}
                        />
                        
                        <input 
                          type="email"
                          placeholder="Adresse e-mail" 
                          value={editingMember.email} 
                          onChange={e => setEditingMember({ ...editingMember, email: e.target.value })} 
                          style={{ 
                            padding: "0.75rem", 
                            borderRadius: "5px", 
                            border: "1px solid #ccc",
                            fontSize: "1rem"
                          }}
                        />
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                              Date d'entrée
                            </label>
                            <input 
                              type="date" 
                              value={editingMember.joinDate} 
                              onChange={e => setEditingMember({ ...editingMember, joinDate: e.target.value })} 
                              style={{ 
                                width: "100%",
                                padding: "0.75rem", 
                                borderRadius: "5px", 
                                border: "1px solid #ccc",
                                fontSize: "1rem"
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                              Date certificat médical
                            </label>
                            <input 
                              type="date" 
                              value={editingMember.lastMedicalDate} 
                              onChange={e => setEditingMember({ ...editingMember, lastMedicalDate: e.target.value })} 
                              style={{ 
                                width: "100%",
                                padding: "0.75rem", 
                                borderRadius: "5px", 
                                border: "1px solid #ccc",
                                fontSize: "1rem"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {erreur && (
                        <Alert type="error" style={{ marginBottom: "1.5rem" }}>
                          {erreur}
                        </Alert>
                      )}
                      
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button variant="ghost" onClick={fermerModificationMembre} disabled={loading}>
                          Annuler
                        </Button>
                        <Button 
                          variant="primary" 
                          onClick={modifierMembre}
                          disabled={!editingMember.lastName.trim() || !editingMember.firstName.trim() || loading}
                          loading={loading}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  )}
                </Modal>
              </>
            )}

            {currentTab === "articles" && (
              <>
                {/* Header section articles */}
                <section style={{ 
                  background: "rgba(255, 255, 255, 0.1)", 
                  padding: "2rem", 
                  borderRadius: "10px",
                  marginBottom: "2rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ color: "var(--primary-color)", margin: 0 }}>
                      Gestion des articles
                    </h2>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowArticleForm(true)}
                    >
                      ➕ Nouvel article
                    </Button>
                  </div>

                  {/* Filtres et recherche */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <select
                      value={articleFilter}
                      onChange={(e) => setArticleFilter(e.target.value)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "white",
                        minWidth: "120px"
                      }}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="draft">Brouillons</option>
                      <option value="published">Publiés</option>
                      <option value="scheduled">Programmés</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        minWidth: "200px",
                        flex: 1,
                        maxWidth: "300px"
                      }}
                    />

                    <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                      {getFilteredArticles().length} article(s)
                    </div>
                  </div>
                </section>

                {/* Liste des articles */}
                <section style={{ 
                  background: "rgba(255, 255, 255, 0.1)", 
                  padding: "2rem", 
                  borderRadius: "10px"
                }}>
                  {getFilteredArticles().length === 0 ? (
                    <Alert type="info">
                      {articles.length === 0 
                        ? "Aucun article créé pour le moment." 
                        : "Aucun article ne correspond aux filtres sélectionnés."
                      }
                    </Alert>
                  ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {getFilteredArticles().map(article => (
                        <div 
                          key={article.id} 
                          style={{ 
                            background: "rgba(255, 255, 255, 0.05)",
                            padding: "1.5rem", 
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.3rem" }}>
                                {article.title}
                              </h3>
                              <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.5rem" }}>
                                <span style={{ 
                                  display: "inline-block",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "4px",
                                  backgroundColor: 
                                    article.status === "published" ? "#28a745" :
                                    article.status === "scheduled" ? "#ffc107" : "#6c757d",
                                  color: "white",
                                  fontSize: "0.8rem",
                                  marginRight: "0.5rem"
                                }}>
                                  {article.status === "published" ? "Publié" :
                                   article.status === "scheduled" ? "Programmé" : "Brouillon"}
                                </span>
                                <span>{article.type}</span>
                                <span style={{ margin: "0 0.5rem" }}>•</span>
                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                              </div>
                              {article.excerpt && (
                                <p style={{ margin: "0.5rem 0", color: "#ddd", fontSize: "0.95rem" }}>
                                  {article.excerpt}
                                </p>
                              )}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => handleEditArticle(article)}
                            >
                              ✏️ Modifier
                            </Button>
                            
                            {article.status === "published" ? (
                              <Button 
                                variant="outline" 
                                size="small"
                                onClick={() => handleUnpublishArticle(article.id)}
                              >
                                📤 Dépublier
                              </Button>
                            ) : (
                              <Button 
                                variant="primary" 
                                size="small"
                                onClick={() => handlePublishArticle(article.id)}
                              >
                                📢 Publier
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => navigator.clipboard?.writeText(JSON.stringify(article, null, 2))}
                              title="Copier les données"
                            >
                              📋
                            </Button>
                            
                            <Button 
                              variant="danger" 
                              size="small"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              🗑️ Supprimer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Modal de création/édition d'article */}
                <Modal
                  isOpen={showArticleForm}
                  onClose={() => {
                    setShowArticleForm(false);
                    setEditingArticle(null);
                  }}
                  title={editingArticle ? "Modifier l'article" : "Créer un nouvel article"}
                  size="large"
                >
                  <ArticleForm
                    initialData={editingArticle}
                    onSubmit={async (formData) => {
                      if (editingArticle) {
                        // Mode modification
                        articlesService.updateArticle(editingArticle.id, formData);
                      } else {
                        // Mode création
                        articlesService.createArticle(formData);
                      }
                      handleArticleSuccess();
                    }}
                    onCancel={() => {
                      setShowArticleForm(false);
                      setEditingArticle(null);
                    }}
                  />
                </Modal>
              </>
            )}

            {currentTab === "galerie" && (
              <>
                {/* Section gestion de la galerie */}
                <section style={{ 
                  background: "rgba(255, 255, 255, 0.1)", 
                  padding: "2rem", 
                  borderRadius: "10px",
                  marginBottom: "2rem"
                }}>
                  <h2 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                    Gestion de la galerie photos
                  </h2>
                  
                  <div style={{ 
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "1.5rem", 
                    borderRadius: "8px",
                    marginBottom: "2rem"
                  }}>
                    <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
                      📊 Statistiques de la galerie
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                      gap: "1rem" 
                    }}>
                      <div style={{ textAlign: "center", padding: "1rem" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary-color)" }}>
                          {Object.values(galleryStats).reduce((total, count) => total + count, 0)}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>Photos totales</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "1rem" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--secondary-color)" }}>
                          {Object.keys(galleryStats).filter(category => galleryStats[category] > 0).length}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>Catégories actives</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "1rem" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>100%</div>
                        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>Images optimisées</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "1.5rem", 
                    borderRadius: "8px",
                    marginBottom: "2rem"
                  }}>
                    <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
                      📁 Gestion des catégories et photos
                    </h3>
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "5px"
                      }}>
                        <span>🏆 <strong>Équipes</strong></span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ color: "#ccc" }}>{galleryStats.equipes} photos</span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleManageCategory('equipes')}
                            >
                              🖼️ Gérer
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteCategory('equipes')}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "5px"
                      }}>
                        <span>🎯 <strong>Événements</strong></span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ color: "#ccc" }}>{galleryStats.evenements} photos</span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleManageCategory('evenements')}
                            >
                              🖼️ Gérer
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteCategory('evenements')}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "5px"
                      }}>
                        <span>🏓 <strong>Matchs</strong></span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ color: "#ccc" }}>{galleryStats.matchs} photos</span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleManageCategory('matchs')}
                            >
                              🖼️ Gérer
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteCategory('matchs')}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "5px"
                      }}>
                        <span>🏅 <strong>Tournois</strong></span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ color: "#ccc" }}>{galleryStats.tournois} photos</span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleManageCategory('tournois')}
                            >
                              🖼️ Gérer
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteCategory('tournois')}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "5px"
                      }}>
                        <span>✈️ <strong>Voyages</strong></span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ color: "#ccc" }}>{galleryStats.voyages} photos</span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleManageCategory('voyages')}
                            >
                              🖼️ Gérer
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteCategory('voyages')}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "5px"
                      }}>
                        <span>🎲 <strong>Divers</strong></span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ color: "#ccc" }}>{galleryStats.divers} photos</span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleManageCategory('divers')}
                            >
                              🖼️ Gérer
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteCategory('divers')}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "1.5rem", 
                    borderRadius: "8px"
                  }}>
                    <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
                      � Ajouter des photos à la galerie
                    </h3>
                    
                    {/* Section upload de photos */}
                    <div style={{
                      border: "2px dashed rgba(255, 255, 255, 0.3)",
                      borderRadius: "8px",
                      padding: "2rem",
                      textAlign: "center",
                      background: "rgba(255, 255, 255, 0.05)",
                      marginBottom: "1.5rem"
                    }}>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleGalleryImageUpload}
                        style={{ display: "none" }}
                        id="gallery-image-upload"
                      />
                      <label htmlFor="gallery-image-upload" style={{ cursor: "pointer", color: "#ccc" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖼️</div>
                        <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "white" }}>
                          Sélectionner des photos pour la galerie
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#999" }}>
                          JPG, PNG, WebP • Maximum 10MB par image • Plusieurs fichiers acceptés
                        </div>
                      </label>
                    </div>

                    {/* Sélection de catégorie */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "0.5rem", 
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        📁 Catégorie des photos
                      </label>
                      
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {/* Catégories existantes */}
                        <div>
                          <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "5px",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              background: "rgba(255, 255, 255, 0.1)",
                              color: "white",
                              fontSize: "1rem"
                            }}
                          >
                            <option value="" style={{ background: "#333" }}>
                              🤖 Détection automatique (recommandé)
                            </option>
                            <option value="equipes" style={{ background: "#333" }}>
                              🏆 Équipes
                            </option>
                            <option value="evenements" style={{ background: "#333" }}>
                              🎯 Événements
                            </option>
                            <option value="matchs" style={{ background: "#333" }}>
                              🏓 Matchs
                            </option>
                            <option value="tournois" style={{ background: "#333" }}>
                              🏅 Tournois
                            </option>
                            <option value="voyages" style={{ background: "#333" }}>
                              ✈️ Voyages
                            </option>
                            <option value="divers" style={{ background: "#333" }}>
                              🎲 Divers
                            </option>
                            <option value="custom" style={{ background: "#333" }}>
                              ➕ Créer une nouvelle catégorie
                            </option>
                          </select>
                        </div>
                        
                        {/* Champ pour nouvelle catégorie (conditionnel) */}
                        <div style={{ display: selectedCategory === 'custom' ? 'block' : 'none' }} id="new-category-field">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            placeholder="Nom de la nouvelle catégorie (ex: competitions-2024)"
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "5px",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              background: "rgba(255, 255, 255, 0.1)",
                              color: "white",
                              fontSize: "1rem"
                            }}
                          />
                          <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>
                            Utilisez des lettres, chiffres et tirets uniquement
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aperçu des photos à uploader */}
                    {galleryImages.length > 0 && (
                      <div id="gallery-upload-preview">
                        <h4 style={{ color: "var(--primary-color)", marginBottom: "1rem" }}>
                          📋 Photos à ajouter ({galleryImages.length})
                        </h4>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                          gap: "0.5rem",
                          marginBottom: "1rem"
                        }}>
                          {galleryImages.map(image => (
                            <div key={image.id} style={{
                              position: "relative",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "6px",
                              overflow: "hidden",
                              background: "rgba(255, 255, 255, 0.05)"
                            }}>
                              <img
                                src={image.data}
                                alt={image.name}
                                style={{
                                  width: "100%",
                                  height: "80px",
                                  objectFit: "cover"
                                }}
                              />
                              
                              {/* Badge catégorie */}
                              <div style={{
                                position: "absolute",
                                top: "3px",
                                left: "3px",
                                background: selectedCategory ? "var(--secondary-color)" : "var(--primary-color)",
                                color: "white",
                                padding: "1px 4px",
                                borderRadius: "3px",
                                fontSize: "0.6rem",
                                fontWeight: "bold"
                              }}>
                                {selectedCategory === 'custom' ? newCategoryName || 'custom' : (selectedCategory || image.detectedCategory)}
                              </div>
                              
                              {/* Bouton supprimer */}
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(image.id)}
                                style={{
                                  position: "absolute",
                                  top: "3px",
                                  right: "3px",
                                  background: "rgba(255, 0, 0, 0.8)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                  fontSize: "0.6rem"
                                }}
                              >
                                ×
                              </button>
                              
                              <div style={{
                                padding: "0.3rem",
                                fontSize: "0.7rem",
                                color: "#ccc"
                              }}>
                                <div style={{ 
                                  whiteSpace: "nowrap", 
                                  overflow: "hidden", 
                                  textOverflow: "ellipsis" 
                                }}>
                                  {image.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {!selectedCategory && (
                          <Alert type="info" style={{ marginBottom: "1rem" }}>
                            🤖 Catégorie automatique détectée pour chaque image
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* Boutons d'action */}
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                      {galleryImages.length > 0 && (
                        <Button 
                          variant="primary"
                          onClick={uploadGalleryImages}
                          loading={galleryUploadLoading}
                          disabled={galleryUploadLoading || (selectedCategory === 'custom' && !newCategoryName.trim())}
                          id="upload-gallery-btn"
                        >
                          ✅ Ajouter {galleryImages.length} photo(s) à la galerie
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline"
                        onClick={() => window.open('/galerie', '_blank')}
                      >
                        👁️ Voir la galerie publique
                      </Button>
                    </div>
                    
                    <Alert type="info" style={{ marginTop: "1.5rem" }}>
                      <strong>🤖 Détection automatique :</strong><br/>
                      L'IA analyse le nom du fichier et le contenu pour déterminer la meilleure catégorie :<br/>
                      • <code>match_*.jpg</code> → Matchs<br/>
                      • <code>equipe_*.jpg</code> → Équipes<br/>
                      • <code>tournoi_*.jpg</code> → Tournois<br/>
                      • <code>voyage_*.jpg</code> → Voyages<br/>
                      • <code>event_*.jpg</code> → Événements<br/>
                      • Autres → Divers
                    </Alert>
                  </div>
                </section>

                {/* Modal de gestion des photos d'une catégorie */}
                <Modal
                  isOpen={showCategoryManager}
                  onClose={() => {
                    setShowCategoryManager(false);
                    setManagingCategory(null);
                    setCategoryPhotos([]);
                    setSelectedPhotos([]);
                  }}
                  title={`🖼️ Gestion des photos - ${managingCategory}`}
                  size="large"
                >
                  <div>
                    {/* Header avec actions globales */}
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px"
                    }}>
                      <div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "white" }}>
                          Catégorie: {managingCategory}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                          {categoryPhotos.length} photo(s) • {selectedPhotos.length} sélectionnée(s)
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {selectedPhotos.length === categoryPhotos.length ? (
                          <Button variant="outline" size="small" onClick={deselectAllPhotos}>
                            ❌ Tout désélectionner
                          </Button>
                        ) : (
                          <Button variant="outline" size="small" onClick={selectAllPhotos}>
                            ✅ Tout sélectionner
                          </Button>
                        )}
                        
                        {selectedPhotos.length > 0 && (
                          <Button 
                            variant="danger" 
                            size="small" 
                            onClick={deleteSelectedPhotos}
                            loading={loading}
                          >
                            🗑️ Supprimer ({selectedPhotos.length})
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Grille des photos */}
                    {categoryPhotos.length === 0 ? (
                      <Alert type="info">
                        Aucune photo trouvée dans cette catégorie.
                      </Alert>
                    ) : (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "1rem",
                        maxHeight: "400px",
                        overflowY: "auto",
                        padding: "0.5rem"
                      }}>
                        {categoryPhotos.map(photo => (
                          <div 
                            key={photo.id} 
                            style={{
                              position: "relative",
                              border: selectedPhotos.includes(photo.id) 
                                ? "3px solid var(--secondary-color)" 
                                : "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              overflow: "hidden",
                              background: "rgba(255, 255, 255, 0.05)",
                              cursor: "pointer",
                              transition: "all 0.3s ease"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePhotoSelection(photo.id);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.zIndex = "10";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.zIndex = "1";
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(photo);
                            }}
                          >
                            {/* Aperçu de l'image */}
                            <div style={{
                              width: "100%",
                              height: "120px",
                              position: "relative",
                              overflow: "hidden"
                            }}>
                              <img
                                src={photo.url}
                                alt={photo.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  transition: "all 0.3s ease",
                                  filter: selectedPhotos.includes(photo.id) ? "brightness(0.7)" : "brightness(1)"
                                }}
                                onError={(e) => {
                                  // Si l'image ne se charge pas, afficher un placeholder
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              {/* Fallback si l'image ne charge pas */}
                              <div style={{
                                display: "none",
                                width: "100%",
                                height: "100%",
                                background: `linear-gradient(135deg, 
                                  ${selectedPhotos.includes(photo.id) ? 'var(--secondary-color)' : '#666'} 0%, 
                                  ${selectedPhotos.includes(photo.id) ? 'var(--primary-color)' : '#999'} 100%)`,
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "2rem",
                                position: "absolute",
                                top: 0,
                                left: 0
                              }}>
                                🖼️
                              </div>
                              
                              {/* Overlay de sélection */}
                              {selectedPhotos.includes(photo.id) && (
                                <div style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: "rgba(236, 72, 153, 0.3)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "2rem",
                                  color: "white"
                                }}>
                                  ✓
                                </div>
                              )}
                            </div>
                            
                            {/* Checkbox de sélection */}
                            <div style={{
                              position: "absolute",
                              top: "8px",
                              left: "8px",
                              width: "20px",
                              height: "20px",
                              borderRadius: "4px",
                              background: selectedPhotos.includes(photo.id) 
                                ? "var(--secondary-color)" 
                                : "rgba(255, 255, 255, 0.3)",
                              border: "2px solid white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.8rem"
                            }}>
                              {selectedPhotos.includes(photo.id) && "✓"}
                            </div>
                            
                            {/* Informations de la photo */}
                            <div style={{
                              padding: "0.75rem",
                              fontSize: "0.8rem",
                              color: "#ccc"
                            }}>
                              <div style={{ 
                                fontWeight: "bold",
                                whiteSpace: "nowrap", 
                                overflow: "hidden", 
                                textOverflow: "ellipsis",
                                color: "white"
                              }}>
                                {photo.name}
                              </div>
                              <div style={{ marginTop: "0.25rem" }}>
                                {photo.size ? (photo.size / 1024 / 1024).toFixed(1) + ' MB' : '2.5 MB'}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "#999" }}>
                                {photo.uploadDate ? new Date(photo.uploadDate).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer du modal */}
                    <div style={{ 
                      marginTop: "1.5rem", 
                      padding: "1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                        💡 Clic simple: sélectionner • Double-clic: aperçu • Survol: zoom
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setShowCategoryManager(false);
                          setManagingCategory(null);
                          setCategoryPhotos([]);
                          setSelectedPhotos([]);
                        }}
                      >
                        Fermer
                      </Button>
                    </div>
                  </div>
                </Modal>

                {/* Modal d'aperçu d'image */}
                <Modal
                  isOpen={!!previewImage}
                  onClose={() => setPreviewImage(null)}
                  title={`🔍 Aperçu - ${previewImage?.name}`}
                  size="large"
                >
                  {previewImage && (
                    <div>
                      {/* Image en grand */}
                      <div style={{
                        textAlign: "center",
                        marginBottom: "1.5rem"
                      }}>
                        <img
                          src={previewImage.url}
                          alt={previewImage.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* Fallback si l'image ne charge pas */}
                        <div style={{
                          display: "none",
                          width: "300px",
                          height: "200px",
                          background: "linear-gradient(135deg, #666 0%, #999 100%)",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "3rem",
                          borderRadius: "8px",
                          margin: "0 auto"
                        }}>
                          🖼️
                        </div>
                      </div>

                      {/* Informations détaillées */}
                      <div style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem"
                      }}>
                        <div>
                          <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.25rem" }}>
                            📄 Nom du fichier
                          </div>
                          <div style={{ fontWeight: "bold", color: "white" }}>
                            {previewImage.name}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.25rem" }}>
                            📏 Taille
                          </div>
                          <div style={{ fontWeight: "bold", color: "white" }}>
                            {previewImage.size ? (previewImage.size / 1024 / 1024).toFixed(2) + ' MB' : '2.5 MB'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.25rem" }}>
                            📅 Date d'ajout
                          </div>
                          <div style={{ fontWeight: "bold", color: "white" }}>
                            {previewImage.uploadDate ? new Date(previewImage.uploadDate).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.25rem" }}>
                            📁 Catégorie
                          </div>
                          <div style={{ fontWeight: "bold", color: "var(--primary-color)" }}>
                            {managingCategory}
                          </div>
                        </div>
                      </div>

                      {/* Actions sur l'image */}
                      <div style={{
                        marginTop: "1.5rem",
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        flexWrap: "wrap"
                      }}>
                        <Button
                          variant={selectedPhotos.includes(previewImage.id) ? "secondary" : "primary"}
                          onClick={() => {
                            togglePhotoSelection(previewImage.id);
                          }}
                        >
                          {selectedPhotos.includes(previewImage.id) ? "❌ Désélectionner" : "✅ Sélectionner"}
                        </Button>
                        
                        <Button
                          variant="danger"
                          onClick={() => {
                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${previewImage.name}" ?`)) {
                              // Sélectionner temporairement cette photo et la supprimer
                              setSelectedPhotos([previewImage.id]);
                              setTimeout(() => {
                                deleteSelectedPhotos();
                                setPreviewImage(null);
                              }, 100);
                            }
                          }}
                        >
                          🗑️ Supprimer cette photo
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Ouvrir l'image dans un nouvel onglet
                            window.open(previewImage.url, '_blank');
                          }}
                        >
                          🔗 Ouvrir en grand
                        </Button>
                      </div>
                    </div>
                  )}
                </Modal>
              </>
            )}

            {currentTab === "facebook" && (
              <>
                <FacebookIntegration 
                  onArticleCreated={() => {
                    loadArticles();
                    // Optionnel : changer d'onglet pour voir les nouveaux articles
                    // setCurrentTab("articles");
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function Gestion() {
  return (
    <ProtectedRoute requiredRole="manager">
      <GestionContent />
    </ProtectedRoute>
  );
}