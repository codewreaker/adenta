import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Layout from './Pages/Layout/index.js';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Layout />
  </StrictMode>
);
