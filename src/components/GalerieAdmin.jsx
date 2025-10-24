import React from 'react';
import { Button } from './ui';

const GalerieAdmin = ({ 
  mediaContent, 
  setMediaContent, 
  categories, 
  setCategories, 
  isAdminMode, 
  setIsAdminMode 
}) => {
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [newImageTitle, setNewImageTitle] = React.useState('');
  const [newImageCaption, setNewImageCaption] = React.useState('');
  const [newImageSrc, setNewImageSrc] = React.useState('');
  const [draggedItem, setDraggedItem] = React.useState(null);

  // Ajouter une nouvelle catégorie
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCategory = {
      id: newId,
      label: newCategoryName,
      icon: "📸", // Icône par défaut
      thumbnail: "/images/default-thumbnail.jpg",
      description: `Photos de ${newCategoryName}`
    };
    
    setCategories(prev => [...prev, newCategory]);
    setMediaContent(prev => ({ ...prev, [newId]: [] }));
    setNewCategoryName('');
  };

  // Supprimer une catégorie
  const deleteCategory = (categoryId) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryId}" et toutes ses images ?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setMediaContent(prev => {
        const newContent = { ...prev };
        delete newContent[categoryId];
        return newContent;
      });
    }
  };

  // Ajouter une nouvelle image
  const addImage = () => {
    if (!selectedCategory || !newImageTitle.trim() || !newImageSrc.trim()) return;
    
    const categoryImages = mediaContent[selectedCategory] || [];
    const maxId = Math.max(0, ...Object.values(mediaContent).flat().map(img => img.id || 0));
    
    const newImage = {
      id: maxId + 1,
      title: newImageTitle,
      caption: newImageCaption,
      src: newImageSrc,
      alt: newImageTitle,
      date: new Date().toISOString().split('T')[0]
    };
    
    setMediaContent(prev => ({
      ...prev,
      [selectedCategory]: [...categoryImages, newImage]
    }));
    
    // Reset form
    setNewImageTitle('');
    setNewImageCaption('');
    setNewImageSrc('');
  };

  // Supprimer une image
  const deleteImage = (categoryId, imageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      setMediaContent(prev => ({
        ...prev,
        [categoryId]: prev[categoryId].filter(img => img.id !== imageId)
      }));
    }
  };

  // Déplacer une image vers une autre catégorie
  const moveImage = (fromCategory, toCategory, imageId) => {
    const image = mediaContent[fromCategory].find(img => img.id === imageId);
    if (!image) return;
    
    setMediaContent(prev => ({
      ...prev,
      [fromCategory]: prev[fromCategory].filter(img => img.id !== imageId),
      [toCategory]: [...(prev[toCategory] || []), image]
    }));
  };

  // Gestion du drag & drop
  const handleDragStart = (e, item, categoryId) => {
    setDraggedItem({ item, categoryId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCategoryId) => {
    e.preventDefault();
    if (draggedItem && draggedItem.categoryId !== targetCategoryId) {
      moveImage(draggedItem.categoryId, targetCategoryId, draggedItem.item.id);
    }
    setDraggedItem(null);
  };

  // Réorganiser automatiquement par date
  const sortByDate = (categoryId) => {
    setMediaContent(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId]].sort((a, b) => 
        new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01')
      )
    }));
  };

  // Réorganiser automatiquement par titre
  const sortByTitle = (categoryId) => {
    setMediaContent(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId]].sort((a, b) => 
        a.title.localeCompare(b.title)
      )
    }));
  };

  if (!isAdminMode) {
    return (
      <div style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000
      }}>
        <Button 
          onClick={() => setIsAdminMode(true)}
          style={{
            background: "var(--secondary-color)",
            color: "white",
            padding: "0.5rem 1rem",
            fontSize: "0.9rem"
          }}
        >
          ⚙️ Mode Admin
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.95)",
      color: "white",
      zIndex: 2000,
      padding: "2rem",
      overflowY: "auto"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "2px solid var(--secondary-color)",
          paddingBottom: "1rem"
        }}>
          <h2 style={{ color: "var(--secondary-color)", margin: 0 }}>
            🛠️ Administration de la Galerie
          </h2>
          <Button 
            onClick={() => setIsAdminMode(false)}
            style={{
              background: "#ff4444",
              color: "white",
              padding: "0.5rem 1rem"
            }}
          >
            ✕ Fermer
          </Button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem"
        }}>
          {/* Section Catégories */}
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            padding: "1.5rem"
          }}>
            <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
              📁 Gestion des Catégories
            </h3>
            
            {/* Ajouter une catégorie */}
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Nom de la nouvelle catégorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "black"
                }}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button onClick={addCategory} style={{ width: "100%" }}>
                ➕ Ajouter Catégorie
              </Button>
            </div>

            {/* Liste des catégories */}
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {categories.map(category => (
                <div 
                  key={category.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "5px",
                    padding: "1rem",
                    marginBottom: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                >
                  <div>
                    <strong>{category.label}</strong>
                    <br />
                    <small style={{ color: "#ccc" }}>
                      {(mediaContent[category.id] || []).length} photos
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => sortByDate(category.id)}
                      style={{
                        background: "var(--secondary-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      📅 Date
                    </button>
                    <button
                      onClick={() => sortByTitle(category.id)}
                      style={{
                        background: "var(--secondary-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      🔤 Titre
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      style={{
                        background: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Images */}
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            padding: "1.5rem"
          }}>
            <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
              🖼️ Gestion des Images
            </h3>
            
            {/* Ajouter une image */}
            <div style={{ marginBottom: "1rem" }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "black"
                }}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Titre de l'image"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "black"
                }}
              />
              
              <input
                type="text"
                placeholder="Description"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "black"
                }}
              />
              
              <input
                type="text"
                placeholder="URL ou chemin de l'image"
                value={newImageSrc}
                onChange={(e) => setNewImageSrc(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "black"
                }}
              />
              
              <Button onClick={addImage} style={{ width: "100%" }}>
                ➕ Ajouter Image
              </Button>
            </div>
          </div>
        </div>

        {/* Aperçu des images par catégorie */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
            👁️ Aperçu et Gestion
          </h3>
          
          {categories.map(category => (
            <div key={category.id} style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1rem"
            }}>
              <h4 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
                {category.label} ({(mediaContent[category.id] || []).length} photos)
              </h4>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "1rem",
                maxHeight: "200px",
                overflowY: "auto"
              }}>
                {(mediaContent[category.id] || []).map(image => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, image, category.id)}
                    style={{
                      position: "relative",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "5px",
                      overflow: "hidden",
                      cursor: "move"
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100px',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      color: 'white',
                      fontSize: '2rem'
                    }}>
                      🏓
                    </div>
                    
                    <div style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px"
                    }}>
                      <button
                        onClick={() => deleteImage(category.id, image.id)}
                        style={{
                          background: "#ff4444",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{
                      padding: "0.5rem",
                      fontSize: "0.8rem"
                    }}>
                      <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                        {image.title}
                      </div>
                      <div style={{ color: "#ccc", fontSize: "0.7rem" }}>
                        {image.caption}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          background: "rgba(0, 150, 255, 0.1)",
          border: "1px solid rgba(0, 150, 255, 0.3)",
          borderRadius: "10px",
          padding: "1rem",
          marginTop: "2rem"
        }}>
          <h4 style={{ color: "var(--secondary-color)", marginBottom: "0.5rem" }}>
            💡 Instructions
          </h4>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", lineHeight: "1.6" }}>
            <li>Glissez-déposez les images entre les catégories pour les déplacer</li>
            <li>Utilisez les boutons de tri pour réorganiser automatiquement</li>
            <li>Les vignettes se mettent à jour automatiquement</li>
            <li>Les suppressions sont définitives - soyez prudent!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GalerieAdmin;