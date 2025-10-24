import React from 'react';

/**
 * Composant Loading réutilisable
 */
export default function Loading({ 
  size = 'medium', 
  color = 'var(--primary-color)', 
  text = 'Chargement...',
  fullScreen = false,
  style = {}
}) {
  const getSizeStyles = () => {
    const sizes = {
      small: { width: '20px', height: '20px', borderWidth: '2px' },
      medium: { width: '40px', height: '40px', borderWidth: '4px' },
      large: { width: '60px', height: '60px', borderWidth: '6px' }
    };
    return sizes[size] || sizes.medium;
  };

  const spinnerStyles = {
    ...getSizeStyles(),
    border: `${getSizeStyles().borderWidth} solid rgba(255, 255, 255, 0.3)`,
    borderTop: `${getSizeStyles().borderWidth} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem',
    color: 'white',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999
    }),
    ...style
  };

  return (
    <div style={containerStyles}>
      <div style={spinnerStyles} />
      {text && <p style={{ margin: 0, fontSize: '1rem' }}>{text}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}