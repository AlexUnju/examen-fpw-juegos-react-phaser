import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tank');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDrag(500, 0);

    this.bullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
      runChildUpdate: true
    });

    this.health = 3;
    this.maxHealth = 3;
    this.invulnerable = false;
    this.invulnerabilityTime = 1000;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.lastFired = 0;
  }

  update(time) {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-160);
      this.setFlipX(true); // Refleja la imagen hacia la izquierda
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(160);
      this.setFlipX(false); // Imagen original hacia la derecha
    } else {
      this.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }

    if (this.fireKey.isDown && time > this.lastFired) {
      const bullet = this.bullets.get(this.x, this.y - 20);
      if (bullet) {
        bullet.setTexture('bullet');
        bullet.setScale(0.1);
        bullet.setSize(1, 1);
        bullet.setOffset(5, 5);
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.enable = true;
        bullet.body.setAllowGravity(false);
        bullet.setVelocityX(this.flipX ? -400 : 400); // Ajusta la dirección del disparo
        this.lastFired = time + 200;
      }
    }    
  }

  damage(amount) {
    if (!this.invulnerable) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        this.destroy();
        console.log("Game Over");
      } else {
        this.invulnerable = true;
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
          this.invulnerable = false;
        });
        this.scene.tweens.add({
          targets: this,
          alpha: 0.5,
          duration: 100,
          ease: 'Linear',
          repeat: 5,
          yoyo: true,
          onComplete: () => {
            this.alpha = 1;
          }
        });
      }
    }
  }
}

export default Player;