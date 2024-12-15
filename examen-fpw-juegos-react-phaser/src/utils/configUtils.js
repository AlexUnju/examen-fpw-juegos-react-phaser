const ConfigUtils = {
  // Factor de escala para las imágenes, puedes modificarlo aquí
  scaleFactor: 0.1, // Esto reduce las imágenes al 50% de su tamaño original

  // Tamaño específico para las imágenes (si prefieres un tamaño fijo, descomenta y usa esto en lugar de scaleFactor)
  displaySize: {
    tank: { width: 120, height: 60 },       // Jugador (tanque)
    bullet: { width: 30, height: 30 },     // Bala
    background: { width: 800, height: 600 }, // Fondo
    enemy: { width: 100, height: 70 },     // Tanque enemigo
    soldier: { width: 70, height: 70 },    // Soldados
    helicopter: { width: 150, height: 150 }, // Helicóptero
    platform: { width: 90, height: 50 }    // Plataforma
  }
};

export default ConfigUtils;