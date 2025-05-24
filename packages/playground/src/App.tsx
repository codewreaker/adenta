// import { LiveEditor } from "@adenta/ui";
import { Sandbox } from '@adenta/ui';
import './App.css';

const files = [
  {
    name: 'App.tsx',
    language: 'typescript',
    value: `
      import React from 'react';
      
      export default function App() {
        return <h1>Hello World</h1>;
      }
    `,
  },
  {
    name: 'index.tsx',
    language: 'typescript',
    value: `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import App from './App';
      
      createRoot(document.getElementById('root')).render(<App />);
    `,
  },
];

function App() {
  return (
    <div className="app-container">
      <div className="editor-container">
        {/* <LiveEditor /> */}
        <Sandbox files={files} defaultFile="App.tsx" height="600px" />
      </div>
    </div>
  );
}

export default App;
