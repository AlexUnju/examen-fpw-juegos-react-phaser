import React from 'react';
import Footer from '../components/Footer';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <header>
        <h1>Mi Aplicación JS</h1>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}