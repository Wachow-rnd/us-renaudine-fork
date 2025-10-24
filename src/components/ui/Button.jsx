import React from 'react';

/**
 * Composant Button réutilisable
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props 
}) {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--text-color)',
        border: 'none'
      },
      secondary: {
        backgroundColor: 'var(--secondary-color)',
        color: 'var(--text-color)',
        border: 'none'
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--primary-color)',
        border: '2px solid var(--primary-color)'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--text-color)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      },
      danger: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none'
      }
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem'
      },
      medium: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem'
      },
      large: {
        padding: '1rem 2rem',
        fontSize: '1.125rem'
      }
    };
    return sizes[size] || sizes.medium;
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.7 : 1,
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    ...style
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      style={buttonStyles}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {children}
    </button>
  );
}