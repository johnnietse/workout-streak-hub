
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import App from './App.tsx'
import './index.css'

// Use createRoot instead of ReactDOM.render
const container = document.getElementById("root")!;
const root = createRoot(container);

// Render the app with React.StrictMode and AnimatePresence
root.render(
  <React.StrictMode>
    <AnimatePresence mode="wait">
      <App />
    </AnimatePresence>
  </React.StrictMode>
);
