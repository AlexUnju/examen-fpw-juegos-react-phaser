import Phaser from 'phaser';

class Boss extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss'); // Usamos 'boss' como la clave de la imagen del boss.
    this.scene = scene;
    this.setDisplaySize(200, 150); // Tamaño del Boss
    this.health = 500; // Mucha más salud
    this.maxHealth = 500; // Salud máxima para la barra
    this.speed = 50; // Velocidad de movimiento
    this.isDestroyed = false;

    // Añadir al mundo y configurar la física
    scene.add.existing(this); // Asegura que el boss sea parte del mundo del juego
    scene.physics.world.enable(this); // Habilita la física para el boss
    this.body.setCollideWorldBounds(true); // El boss no puede salir del mundo

    // Crear la barra de salud
    this.healthBar = this.scene.add.graphics();
    this.healthBar.fillStyle(0xff0000, 1); // Color rojo
    this.updateHealthBar();

    // Intervalo para disparar bombas
    this.scene.time.addEvent({
      delay: 1000,
      callback: this.shootBomb,
      callbackScope: this,
      loop: true
    });
  }

  update(time, delta) {
    if (this.health <= 0 && !this.isDestroyed) {
      this.destroy();
      this.isDestroyed = true;
      console.log('¡El Boss ha sido destruido!');
    }
    this.updateHealthBar();
  }

  damage(amount) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  shootBomb() {
    if (!this.isDestroyed) {
      const bomb = this.scene.physics.add.image(this.x, this.y, 'bomb');
      bomb.setVelocityY(-100); // Dispara hacia arriba
      bomb.setBounce(1); // Hace que rebote
      bomb.setCollideWorldBounds(true); // Rebota contra los límites del mundo
      bomb.setGravityY(300); // Simula la gravedad para las bombas
    }
  }

  updateHealthBar() {
    // Borrar la barra de salud anterior
    this.healthBar.clear();
    // Dibujar la barra de salud actual
    this.healthBar.fillRect(this.x - 50, this.y - 80, 100 * (this.health / this.maxHealth), 10);
  }
}

export default Boss;