# Examen FPW: Desarrollo de Juegos con Phaser y React

Este repositorio contiene los proyectos desarrollados para el examen de la materia **Fundamentos de Programación Web (FPW)**. El examen consiste en la creación de dos videojuegos utilizando las tecnologías **Phaser** y **ReactJS**, según las consignas proporcionadas.

---

### **Juego 1: Videojuego de Tanques (Phaser)**  
Un videojuego en 2D que incluye mecánicas de disparos, movimiento y escenarios con varios niveles. 

#### **Características:**
- Un tanque protagonista que:
  - Se mueve hacia adelante y hacia atrás.
  - Puede saltar y disparar horizontalmente.
  - Pierde vidas al ser golpeado por enemigos, disparos o bombas.
- **Enemigos:**  
  - Soldados y tanques móviles que disparan hacia el protagonista.  
  - Tanques fijos que disparan en ambas direcciones.  
  - Un helicóptero que lanza bombas de manera aleatoria.
- **Escenarios:**  
  - Plataformas en diferentes posiciones donde puede moverse el tanque.  
  - Al completar el nivel, se enfrenta a un enemigo final para avanzar.  
  - Tres niveles de dificultad creciente.  
- **Game Over:**  
  - Si el tanque pierde tres vidas, aparece un mensaje y opciones para salir o reiniciar.  
- **Pantalla de Victoria:**  
  - Felicitaciones al completar todos los niveles, mostrando el puntaje final.

### **Juego 2: Laberinto de Preguntas (ReactJS)**  
Un juego de preguntas y respuestas en un laberinto, pensado para dos jugadores.

#### **Características:**
- **Inicio:**  
  - Cada jugador ingresa su nombre antes de comenzar.  
- **Mecánicas:**  
  - Un número aleatorio entre 5 y 10 determina la cantidad de preguntas.  
  - Cada pregunta tiene 3 opciones de respuesta.  
  - Si el jugador acierta, avanza un casillero y suma un punto.  
  - Si falla, se muestra un mensaje de error y no avanza.  
- **Laberinto:**  
  - Un laberinto de 10 posiciones visualiza el progreso de cada jugador.  
- **Pantallas finales:**  
  - Felicitaciones al ganador, con opciones para finalizar el juego o volver a jugar.
