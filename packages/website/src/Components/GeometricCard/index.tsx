import React from 'react';
import './geometricCard.css';

interface GeometricCardProps {
  heading?: string;
  currency?: string;
  title?: string;
  width?: string | number;
  bg?: string;
  height?: string | number;
  description?: string;
  sponsor: string;
  children?: React.ReactNode;
}

const GeometricCard: React.FC<Partial<GeometricCardProps>> = ({
  heading = '50000',
  title = 'Best Developer Award',
  sponsor = 'Tech Innovators Inc.',
  bg = 'var(--color-primary)',
  width,
  height,
  children
}) => {

  return (
    <div className="info-card" style={{ width, height, '--before-tmp-bg': bg } as React.CSSProperties}>
      <h1 className="heading">{heading}</h1>
      <h2 className="title">{title}</h2>

      <div className="content">{children}</div>

      <div className="presented-by">PRESENTED BY</div>
      <div className="sponsor-logo">{sponsor}</div>
    </div>
  );
};

export default GeometricCard;
