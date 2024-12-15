import Phaser from 'phaser';

class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss'); // Inicia el Boss en la posición deseada
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.5);
    this.setVelocityX(-100); // Movimiento horizontal inicial
    this.setGravityY(300); // Añadir gravedad al Boss

    // Grupo para disparos del boss
    this.bullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 50,
      runChildUpdate: true,
    });

    // Propiedades del Boss
    this.health = 200; // Más vida que un enemigo común
    this.isDestroyed = false;

    // Temporizador para disparos regulares
    this.fireTimer = this.scene.time.addEvent({
      delay: 3000, // Dispara cada 3 segundos
      callback: this.fire,
      callbackScope: this,
      loop: true,
    });

    // Temporizador para ataque especial
    this.specialAttackTimer = this.scene.time.addEvent({
      delay: 8000, // Ataque especial cada 8 segundos
      callback: this.specialAttack,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (!this.scene) return;

    const worldBounds = this.scene.physics.world.bounds;
    const bossBounds = this.getBounds();

    // Colisión con el suelo
    const desiredY = worldBounds.height - 100; // Ajustar la posición 'y' 100px arriba del suelo
    if (this.y !== desiredY && !this.body.blocked.down) {
      this.setY(desiredY); // Ajustar la posición 'y' si no está bloqueado por el suelo
    }

    // Movimiento horizontal dentro de los límites del mundo
    if (bossBounds.right >= worldBounds.width) {
      this.setVelocityX(-100);
    } else if (bossBounds.left <= 0) {
      this.setVelocityX(100);
    }

    // Asegurarse de que el Boss no suba más allá del suelo
    if (this.body.blocked.down) {
      this.setVelocityY(0); // Detener el movimiento vertical cuando toca el suelo
    }
  }

  fire() {
    if (this.isDestroyed || !this.scene) return;

    // Dispara 3 balas al mismo tiempo
    for (let i = -1; i <= 1; i++) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.setTexture('bullet');
        bullet.setScale(0.1);
        bullet.setSize(2, 2);
        bullet.setOffset(5, 5);
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.enable = true;
        bullet.body.setAllowGravity(false);
        bullet.setVelocity(i * 100, 300); // Ajusta el ángulo de disparo

        // Destruir la bala después de un tiempo
        this.scene.time.delayedCall(3000, () => {
          if (bullet && bullet.scene) {
            bullet.destroy();
          }
        });
      }
    }
  }

  specialAttack() {
    if (this.isDestroyed || !this.scene) return;

    console.log('¡Ataque especial del Boss!');

    // Dispara en todas las direcciones
    for (let angle = 0; angle < 360; angle += 45) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.setTexture('bullet');
        bullet.setScale(0.15);
        bullet.setSize(3, 3);
        bullet.setOffset(5, 5);
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.enable = true;
        bullet.body.setAllowGravity(false);

        const velocity = this.scene.physics.velocityFromAngle(angle, 200);
        bullet.setVelocity(velocity.x, velocity.y);

        // Destruir la bala después de un tiempo
        this.scene.time.delayedCall(3000, () => {
          if (bullet && bullet.scene) {
            bullet.destroy();
          }
        });
      }
    }
  }

  damage(amount) {
    if (this.isDestroyed || !this.scene) return;
  
    this.health -= amount;
    console.log(`El Boss recibe ${amount} de daño. Vida restante: ${this.health}`);
  
    if (this.health <= 0) {
      this.isDestroyed = true;
  
      // Detener temporizadores
      if (this.fireTimer) this.fireTimer.remove();
      if (this.specialAttackTimer) this.specialAttackTimer.remove();
  
      // Destruir todas las balas activas
      this.bullets.children.each((bullet) => {
        if (bullet) {
          bullet.setActive(false);
          bullet.setVisible(false);
          bullet.body.enable = false;
          bullet.destroy();
        }
      });
  
      this.bullets.clear(true, true);
  
      // Destruir el Boss inmediatamente
      this.destroy();
      this.scene = null;
      console.log('¡El Boss ha sido derrotado!');
    }
  }
  
}

export default Boss;