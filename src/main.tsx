
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnimatePresence>
      <App />
    </AnimatePresence>
  </React.StrictMode>
);
