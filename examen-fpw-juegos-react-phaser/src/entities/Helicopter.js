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
      callbackScope: this,
      loop: true
    });

    this.scene.tweens.add({
      targets: this,
      x: 700,
      duration: 6000,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });
  }

  dropBomb() {
    // Verificar si el helicóptero ha sido destruido
    if (this.isDestroyed) {
      return; // Si el helicóptero está destruido, no lanza más bombas
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

      this.scene.time.delayedCall(4000, () => {
      });        
      bomb.destroy();
    }
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.isDestroyed = true; // Marcar como destruido
      this.destroy();
      
      // Detener el temporizador de bombas cuando el helicóptero sea destruido
      if (this.bombTimer) {
        this.bombTimer.remove();
      }
    }
  }
}

export default Helicopter;