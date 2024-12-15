import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importar Router y Routes
import AppLayout from './layouts/AppLayout';
import MenuOptions from './components/MenuOptions';
import JuegoPhaser from './components/JuegoPhaser';
import './styles/app.css';

function App() {
  return (
    <Router> {/* Aquí envolvemos la aplicación en Router */}
      <AppLayout>
        <Routes>
          <Route path="/" element={<MenuOptions />} /> {/* Ruta para el menú */}
          <Route path="/juego" element={<JuegoPhaser />} /> {/* Ruta para el juego */}
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;