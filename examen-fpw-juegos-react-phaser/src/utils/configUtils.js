const ConfigUtils = {
  // Factor de escala para las imágenes
  scaleFactor: 0.1, // Esto reduce las imágenes al 10% de su tamaño original

  // Tamaños específicos para las imágenes
  displaySize: {
    tank: { width: 120, height: 60 },       // Jugador (tanque)
    bullet: { width: 30, height: 30 },     // Bala
    background: { width: 800, height: 600 }, // Fondo
    enemy: { width: 100, height: 70 },     // Tanque enemigo
    soldier: { width: 70, height: 70 },    // Soldados
    helicopter: { width: 150, height: 100 }, // Helicóptero
    platform: { width: 90, height: 50 },   // Plataforma
    boss: { width: 500, height: 500 },     // Tamaño del Boss
    bomb: { width: 40, height: 40 }        // Tamaño de las bombas disparadas por el boss
  }
};

export default ConfigUtils;