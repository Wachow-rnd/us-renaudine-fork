import React from 'react';
import Button from './Button';

/**
 * Composant Modal réutilisable
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = 'medium',
  style = {}
}) {
  // Fermer avec Échap
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeStyles = () => {
    const sizes = {
      small: { maxWidth: '400px', width: '90%' },
      medium: { maxWidth: '600px', width: '90%' },
      large: { maxWidth: '800px', width: '95%' },
      full: { maxWidth: '95%', width: '95%', maxHeight: '95%' }
    };
    return sizes[size] || sizes.medium;
  };

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalStyles = {
    background: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    position: 'relative',
    maxHeight: '90vh',
    overflow: 'auto',
    ...getSizeStyles(),
    ...style
  };

  const headerStyles = {
    padding: '1.5rem 1.5rem 0 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const contentStyles = {
    padding: '0 1.5rem 1.5rem 1.5rem'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={overlayStyles} onClick={handleOverlayClick}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>{title}</h2>}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  fontSize: '1.5rem'
                }}
              >
                ×
              </Button>
            )}
          </div>
        )}
        <div style={contentStyles}>
          {children}
        </div>
      </div>
    </div>
  );
}