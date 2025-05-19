
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import App from './App.tsx'
import './index.css'

// Disable strict mode temporarily to reduce double renders which can cause flashing
createRoot(document.getElementById("root")!).render(
  <AnimatePresence mode="wait">
    <App />
  </AnimatePresence>
);
