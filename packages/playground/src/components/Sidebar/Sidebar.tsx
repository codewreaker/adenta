import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onNewFile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewFile }) => {
  return (
    <div className="sidebar-container">
      <button 
        className="sidebar-button" 
        onClick={onNewFile}
        title="New File"
      >
        + New
      </button>
    </div>
  );
};
