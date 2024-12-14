import React from 'react';
// Importa los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa los íconos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
// Importa los estilos personalizados
import '../styles/menuStyles.css'; // Asegúrate de que la ruta sea correcta

/** 
 * Renderiza dos tarjetas con enlaces que contienen una imagen, título y botón de exploración
 */

export default function MenuOptions() {
  return (
    <div className="container">
      {/* Fila para centrar las columnas */}
      <div className="row justify-content-center">
        
        {/* Columna para el primer enlace */}
        <div className="col-md-5 m-2">
          <div className="card bg-black text-white border border-danger shadow-lg hover-card">
            <div className="card-body text-center p-4">
              {/* Icono de Phaser js */}
              <img 
                src="https://cdn.phaser.io/images/logo/phaser-logo.png" 
                alt="REACT LOGO" 
                style={{ width: '15rem', height: 'auto' }} 
                className="mb-3" 
              />
              {/* Imagen del enlace */}
              <img 
                src="https://store-images.s-microsoft.com/image/apps.39652.14293105219565845.7ae13fc9-1414-4895-8e9c-a8caa8b971af.e0420a92-a867-4ebf-92c6-8d97a317310b?q=90&w=480&h=270" 
                className="card-img mb-3 rounded" 
                alt="tank game"
              />
              {/* Título del enlace */}
              <h3 className="card-title text-danger">Enlace 1 JS</h3>
              {/* Botón para explorar el enlace */}
              <button className="btn btn-outline-danger mt-3 neon-btn">
                <i className="bi bi-arrow-right-circle me-2"></i>
                Explorar
              </button>
            </div>
          </div>
        </div>
        
        {/* Columna para el segundo enlace */}
        <div className="col-md-5 m-2">
          <div className="card bg-black text-white border border-danger shadow-lg hover-card">
            <div className="card-body text-center p-4">
              {/* Icono de desarrollo con un tamaño grande */}
              <img 
                src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" 
                alt="REACT LOGO" 
                style={{ width: '3rem', height: 'auto' }} 
                className="mb-3" 
              />
              {/* Imagen del enlace */}
              <img 
                src="https://hamradio.my/wp-content/uploads/2024/06/q6hgjkv5yy4ilmgzpa1p.jpg" 
                className="card-img mb-3 rounded" 
                alt="JavaScript Development"
              />
              {/* Título del enlace */}
              <h3 className="card-title text-danger">Enlace 2 JS</h3>
              {/* Botón para explorar el enlace */}
              <button className="btn btn-outline-danger mt-3 neon-btn">
                <i className="bi bi-arrow-right-circle me-2"></i>
                Explorar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}