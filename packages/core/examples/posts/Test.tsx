import React from 'react';

interface TestProps {
  title?: string;
  children?: React.ReactNode;
}

const Test: React.FC<TestProps> = ({ title = 'Test Component', children }) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{title}</h2>
      {children && <div>{children}</div>}
      <p>This is a simple React component for testing purposes.</p>
    </div>
  );
};

export default Test;
