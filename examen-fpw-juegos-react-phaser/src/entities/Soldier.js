import Phaser from 'phaser';

class Soldier extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'soldier'); // Cargar la imagen del soldado
    this.scene = scene;
    this.scene.add.existing(this); // Añadir el soldado a la escena
    this.scene.physics.world.enable(this); // Habilitar física para el soldado
    this.setCollideWorldBounds(true); // Habilitar colisiones con los límites del mapa
    this.setBounce(1); // Añadir rebote al soldado cuando llegue al borde
    this.speed = 100; // Velocidad de movimiento
    this.lastShotTime = 0; // Para manejar el tiempo entre disparos
    this.movingRight = true; // Indicar si el soldado se está moviendo a la derecha
  }

  update(time, delta) {
    // Si el soldado se está moviendo hacia la derecha
    if (this.movingRight) {
      this.setVelocityX(this.speed); // Moverse hacia la derecha
    } else {
      this.setVelocityX(-this.speed); // Moverse hacia la izquierda
    }

    // Verificar si el soldado ha llegado al límite del mapa (derecha o izquierda)
    if (this.x >= this.scene.cameras.main.width && this.movingRight) {
      this.movingRight = false; // Cambiar la dirección hacia la izquierda
    } else if (this.x <= 0 && !this.movingRight) {
      this.movingRight = true; // Cambiar la dirección hacia la derecha
    }

    // Disparar bombas cada cierto tiempo
    if (time - this.lastShotTime > 1000) { // Disparar cada 1000 ms
      this.fireBomb();
      this.lastShotTime = time;
    }
  }

  fireBomb() {
    const bomb = new Bomb(this.scene, this.x, this.y); // Crear una bomba
    this.scene.add.existing(bomb); // Añadirla a la escena
    this.scene.physics.world.enable(bomb); // Habilitar física para la bomba
    bomb.setVelocityX(this.movingRight ? 200 : -200); // Lanzar la bomba en la dirección del soldado
  }
}

class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bomb'); // Crear una bomba en la posición del soldado
    this.setDisplaySize(32, 32); // Establecer el tamaño de la bomba
    this.setCollideWorldBounds(true); // Colisionar con los límites del mundo
    this.setBounce(1); // Añadir rebote
  }

}

export default Soldier;