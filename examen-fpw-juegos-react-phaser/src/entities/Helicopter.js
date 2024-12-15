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

    this.bombTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.dropBomb,
      callbackScope: this,
      loop: true
    });

    // Movimiento de ida y vuelta
    this.scene.tweens.add({
      targets: this,
      x: 700,
      duration: 4000,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });
  }

  dropBomb() {
    const bomb = this.bombs.get(this.x, this.y + 20);
    if (bomb) {
      bomb.setActive(true);
      bomb.setVisible(true);
      bomb.body.enable = true;
      bomb.setVelocityY(100);
      bomb.setBounce(0.8);
      bomb.setCollideWorldBounds(true);
      
      // Destruir la bomba después de 5 segundos
      this.scene.time.delayedCall(5000, () => {
        bomb.destroy();
      });
    }
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}

export default Helicopter;