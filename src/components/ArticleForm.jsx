import React, { useState } from 'react';
import { Button, Alert } from './ui';

export default function ArticleForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    eventDate: initialData?.eventDate || '',
    eventTime: initialData?.eventTime || '',
    location: initialData?.location || 'Salle du club',
    type: initialData?.type || 'tournament',
    status: initialData?.status || 'draft',
    featuredImage: initialData?.featuredImage || '',
    images: initialData?.images || []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(initialData?.images || []);
  const [selectedFeaturedImage, setSelectedFeaturedImage] = useState(initialData?.featuredImage || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB par image
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setError(`Format non supporté: ${file.name}. Utilisez JPG, PNG ou WebP.`);
        return;
      }
      
      if (file.size > maxSize) {
        setError(`Image trop volumineuse: ${file.name}. Maximum 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: event.target.result,
          size: file.size
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
    
    if (selectedFeaturedImage === imageId) {
      setSelectedFeaturedImage(null);
      setFormData(prev => ({
        ...prev,
        featuredImage: ''
      }));
    }
  };

  const selectFeaturedImage = (imageId) => {
    const selectedImage = uploadedImages.find(img => img.id === imageId);
    if (selectedImage) {
      setSelectedFeaturedImage(imageId);
      setFormData(prev => ({
        ...prev,
        featuredImage: selectedImage.data
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Le titre et le contenu sont requis');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: 'tournament', label: '🏆 Tournoi' },
    { value: 'training', label: '🏓 Entraînement' },
    { value: 'meeting', label: '👥 Réunion' },
    { value: 'social', label: '🎉 Événement social' },
    { value: 'competition', label: '🥇 Compétition' },
    { value: 'other', label: '📝 Autre' }
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          color: 'var(--secondary-color)', 
          marginBottom: '0.5rem',
          fontSize: '1.8rem'
        }}>
          {initialData ? '✏️ Modifier l\'article' : '📝 Nouvel article'}
        </h2>
        <p style={{ color: '#ccc', margin: 0 }}>
          Créez et publiez des articles pour la page Événements
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Titre */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: 'white',
            fontWeight: 'bold'
          }}>
            Titre de l'article *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre accrocheur de votre article"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Résumé */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: 'white',
            fontWeight: 'bold'
          }}>
            Résumé (extrait)
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Court résumé qui apparaîtra dans la liste des articles"
            rows="2"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Contenu principal */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: 'white',
            fontWeight: 'bold'
          }}>
            Contenu de l'article *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Contenu complet de votre article..."
            rows="8"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Informations événement */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'white',
              fontWeight: 'bold'
            }}>
              Date de l'événement
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'white',
              fontWeight: 'bold'
            }}>
              Heure
            </label>
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'white',
              fontWeight: 'bold'
            }}>
              Lieu
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Lieu de l'événement"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'white',
              fontWeight: 'bold'
            }}>
              Type d'événement
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value} style={{ background: '#333' }}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload d'images */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: 'white',
            fontWeight: 'bold'
          }}>
            📸 Images de l'article
          </label>
          
          <div style={{
            border: '2px dashed rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            marginBottom: '1rem'
          }}>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer', color: '#ccc' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
              <div style={{ marginBottom: '0.5rem' }}>
                Cliquez pour sélectionner des images
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>
                JPG, PNG, WebP • Maximum 5MB par image
              </div>
            </label>
          </div>

          {/* Aperçu des images uploadées */}
          {uploadedImages.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                Images uploadées ({uploadedImages.length})
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                {uploadedImages.map(image => (
                  <div key={image.id} style={{
                    position: 'relative',
                    border: selectedFeaturedImage === image.id ? '3px solid var(--secondary-color)' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}>
                    <img
                      src={image.data}
                      alt={image.name}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => selectFeaturedImage(image.id)}
                    />
                    
                    {/* Badge image à la une */}
                    {selectedFeaturedImage === image.id && (
                      <div style={{
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        background: 'var(--secondary-color)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        ⭐ À la une
                      </div>
                    )}
                    
                    {/* Bouton supprimer */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'rgba(255, 0, 0, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      ×
                    </button>
                    
                    <div style={{
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#ccc'
                    }}>
                      <div style={{ 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {image.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#999' }}>
                        {(image.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {uploadedImages.length > 0 && !selectedFeaturedImage && (
                <Alert type="info" style={{ marginTop: '1rem' }}>
                  💡 Cliquez sur une image pour la définir comme image à la une
                </Alert>
              )}
            </div>
          )}

          {/* Alternative URL */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#ccc',
              fontSize: '0.9rem'
            }}>
              Ou utiliser une URL d'image externe
            </label>
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Statut de publication */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: 'white',
            fontWeight: 'bold'
          }}>
            Statut de publication
          </label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              📝 Brouillon
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              🌐 Publié
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <input
                type="radio"
                name="status"
                value="scheduled"
                checked={formData.status === 'scheduled'}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              ⏰ Programmé
            </label>
          </div>
        </div>

        {error && (
          <Alert type="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}

        {/* Boutons d'action */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Sauvegarde...' : (initialData ? 'Mettre à jour' : 'Créer l\'article')}
          </Button>
        </div>
      </form>
    </div>
  );
}