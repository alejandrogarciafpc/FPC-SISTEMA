import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill simple para window.storage usando localStorage
// (el sistema fue diseñado para una API async con get/set/delete)
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    async get(key) {
      const v = window.localStorage.getItem(key);
      return v === null ? null : { value: v };
    },
    async set(key, value) {
      window.localStorage.setItem(key, value);
      return { value };
    },
    async delete(key) {
      window.localStorage.removeItem(key);
      return { deleted: true };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (!prefix || k.startsWith(prefix)) keys.push(k);
      }
      return { keys };
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
