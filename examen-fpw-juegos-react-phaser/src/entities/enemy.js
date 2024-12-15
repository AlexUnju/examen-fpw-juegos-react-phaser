import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setVelocityX(-50);

    this.bullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 30,
      runChildUpdate: true,
    });

    this.health = 40;

    this.fireTimer = this.scene.time.addEvent({
      delay: 5000,
      callback: this.fire,
      callbackScope: this,
      loop: true,
    });

    this.isDestroyed = false;
  }

  update() {
    const worldBounds = this.scene.physics.world.bounds;
    const enemyBounds = this.getBounds();

    if (enemyBounds.right >= worldBounds.width) {
      this.setVelocityX(-50);
    } else if (enemyBounds.left <= 0) {
      this.setVelocityX(50);
    }

    if (this.body.blocked.right) {
      this.setVelocityX(-50);
    } else if (this.body.blocked.left) {
      this.setVelocityX(50);
    }
  }

  fire() {
    if (this.isDestroyed || !this.scene) return;

    const bullet = this.bullets.get(this.x, this.y);
    if (bullet) {
      bullet.setTexture('bullet');
      bullet.setScale(0.1);
      bullet.setSize(2, 1);
      bullet.setOffset(5, 5);
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.enable = true;
      bullet.body.setAllowGravity(false);
      bullet.setVelocityX(-200);

      if (this.scene) {
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

    if (this.health <= 0) {
      this.isDestroyed = true;

      if (this.fireTimer) {
        this.fireTimer.remove();
      }

      this.bullets.children.each((bullet) => {
        if (bullet) {
          bullet.setActive(false);
          bullet.setVisible(false);
          bullet.body.enable = false;
          bullet.destroy();
        }
      });

      this.bullets.clear(true, true);

      this.scene.time.delayedCall(0, () => {
        this.destroy();
        this.scene = null;
      });
    }
  }
}

export default Enemy;

