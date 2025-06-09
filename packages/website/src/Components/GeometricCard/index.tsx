import React from 'react';
import './geometricCard.css';

interface GeometricCardProps {
  heading?: string;
  currency?: string;
  title?: string;
  description?: string;
  action: string;
  onClick?: () => void;
  customStyle: {
    bg?: string;
    width?: string | number;
    height?: string | number;
    btnStyle?: React.CSSProperties;
  };
  children?: React.ReactNode;
}

const GeometricCard: React.FC<Partial<GeometricCardProps>> = ({
  heading = 'Lorem',
  title = 'Ipsum',
  action = 'Sit Amet',
  onClick = () => {
    /** */
  },
  customStyle,
  children,
}) => {
  const {
    bg = 'var(--color-primary)',
    btnStyle = {
      background: 'var(--color-text)',
      color: 'var(--color-primary)',
    },
    width,
    height,
  } = customStyle || {};
  
  return (
    <div
      className="info-card"
      style={{ width, height, '--before-tmp-bg': bg } as React.CSSProperties}
    >
      <h1 className="heading">{heading}</h1>
      <h2 className="title">{title}</h2>

      <div className="content">{children}</div>

      <div className="presented-by">PRESENTED BY</div>
      <button
        onClick={onClick}
        className="portfolio-btn"
        style={btnStyle as React.CSSProperties}
      >
        {action}
      </button>
    </div>
  );
};

export default GeometricCard;
