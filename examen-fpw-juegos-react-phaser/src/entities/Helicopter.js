import Phaser from 'phaser';

class Helicopter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'helicopter');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.body.setAllowGravity(false);

    this.bombs = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 20,
      runChildUpdate: true
    });

    this.health = 100;

    // Indicador de destrucción
    this.isDestroyed = false;

    // Timer que lanza bombas cada 2 segundos
    this.bombTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.dropBomb,
      callbackScope: this,  // Garantiza que 'this' dentro de 'dropBomb' sea el Helicopter
      loop: true
    });

    // Variable para rastrear la dirección previa
    this.previousX = x;

    // Tween que mueve al helicóptero de lado a lado
    this.scene.tweens.add({
      targets: this,
      x: 700,
      duration: 6000,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        this.updateDirection();
      }
    });
  }

  dropBomb() {
    if (this.isDestroyed) {
      return;
    }

    const bomb = this.bombs.get(this.x, this.y + 20);
    if (bomb) {
      bomb.setTexture('bomb');
      bomb.setScale(0.1);
      bomb.setActive(true);
      bomb.setVisible(true);
      bomb.body.enable = true;
      bomb.setVelocityY(100);
      bomb.setBounce(0.8);
      bomb.setCollideWorldBounds(true);

      // Usamos un callback adecuado para eliminar la bomba
      this.scene.time.delayedCall(4000, this.destroyBomb, [bomb], this);  // Se pasa 'bomb' como argumento
    }
  }

  destroyBomb(bomb) {
    // Aseguramos que solo se destruye si no está destruido el helicóptero
    if (this.isDestroyed && bomb) {
      bomb.destroy();
    }
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.isDestroyed = true;
      this.destroy();

      if (this.bombTimer) {
        this.bombTimer.remove();  // Detenemos el temporizador de bombas
      }
    }
  }

  updateDirection() {
    // Cambiar la orientación basándose en el cambio de posición
    if (this.x > this.previousX) {
      this.setFlipX(true); // Mirando hacia la derecha
    } else if (this.x < this.previousX) {
      this.setFlipX(false); // Mirando hacia la izquierda
    }

    // Actualizar el valor de `previousX`
    this.previousX = this.x;
  }
}

export default Helicopter;