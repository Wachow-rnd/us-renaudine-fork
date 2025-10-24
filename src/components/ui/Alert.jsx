import React from 'react';

/**
 * Composant Alert réutilisable pour les messages d'erreur, succès, etc.
 */
export default function Alert({ 
  type = 'info', 
  children, 
  onClose,
  style = {},
  className = ''
}) {
  const getTypeStyles = () => {
    const types = {
      success: {
        backgroundColor: '#d1e7dd',
        color: '#0f5132',
        borderColor: '#badbcc'
      },
      error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderColor: '#f5c6cb'
      },
      warning: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderColor: '#ffeaa7'
      },
      info: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        borderColor: '#bee5eb'
      }
    };
    return types[type] || types.info;
  };

  const alertStyles = {
    ...getTypeStyles(),
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    border: `1px solid ${getTypeStyles().borderColor}`,
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...style
  };

  const getIcon = () => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  };

  return (
    <div className={`alert alert-${type} ${className}`} style={alertStyles}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flex: 1 }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {getIcon()}
        </span>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: 'inherit',
            marginLeft: '1rem',
            padding: '0 0.25rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}