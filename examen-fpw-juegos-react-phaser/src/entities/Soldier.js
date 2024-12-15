import Phaser from 'phaser';

class Soldier extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'soldier');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setCollideWorldBounds(true); // Hacer que el soldado no salga del mapa
    this.setBounce(0.2); // Agregar un pequeño rebote para un efecto visual
    this.setVelocityX(-30); // Mover inicialmente hacia la izquierda
    this.direction = -1; // Indicar que el soldado se mueve hacia la izquierda

    this.bullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
      runChildUpdate: true
    });

    this.health = 10;

    // Disparo aleatorio por soldado
    this.startFireTimer();
  }

  startFireTimer() {
    // Generar un tiempo aleatorio entre 7000ms (7 segundos) y 11000ms (11 segundos)
    const randomDelay = Phaser.Math.Between(7000, 11000);
    this.fireTimer = this.scene.time.addEvent({
      delay: randomDelay,
      callback: this.fire,
      callbackScope: this,
      loop: true // Hacerlo en bucle para que dispare repetidamente
    });
  }

  update() {
    // Verificar si el soldado está destruido antes de proceder
    if (!this.active) {
      return; // Si el soldado está destruido, no hacer nada más en update
    }

    // Verificar colisiones con los bordes
    if (this.body.touching.right || this.body.blocked.right) {
      this.direction = -1; // Si toca el borde derecho, volver a moverse hacia la izquierda
      this.setVelocityX(-30); // Cambiar la dirección del movimiento
    } else if (this.body.touching.left || this.body.blocked.left) {
      this.direction = 1; // Si toca el borde izquierdo, moverse hacia la derecha
      this.setVelocityX(30); // Cambiar la dirección del movimiento
    }

    // Mover constantemente en la dirección establecida
    this.setVelocityX(this.direction * 30); // Asegurarse de que la dirección esté controlada por la variable `direction`
  }

  fire() {
    // Verificar si el soldado está destruido antes de disparar
    if (!this.active) {
      return; // Si el soldado está destruido, no disparar
    }

    const bullet = this.bullets.get(this.x, this.y);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.enable = true;
      bullet.body.setAllowGravity(false); // Desactivar la gravedad en el proyectil
      bullet.setVelocityX(this.direction * 150); // El proyectil se mueve hacia la dirección opuesta al soldado
    }

    // Reiniciar el temporizador con un nuevo tiempo aleatorio entre 7 y 11 segundos
    this.startFireTimer();
  }

  damage(amount) {
    if (this.health !== undefined) {
      this.health -= amount;
      if (this.health <= 0) {
        // Cancelar el temporizador de disparos
        if (this.fireTimer) {
          this.fireTimer.remove(); // Elimina el temporizador
        }
        this.destroy(); // Destruir al soldado
      }
    }
  }
}

export default Soldier;