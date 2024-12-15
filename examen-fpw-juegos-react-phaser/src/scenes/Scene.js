import Phaser from 'phaser';
import Player from '../entities/player';
import Enemy from '../entities/enemy';
import Helicopter from '../entities/helicopter';

class Scene extends Phaser.Scene {
  constructor() {
    super('Scene');
  }

  preload() {
    // Cargar imágenes de los recursos
    this.load.image('tank', 'assets/tank.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('enemy', 'assets/enemy.png');
  }

  create() {
    // Añadir fondo
    this.add.image(400, 300, 'background');

    // Crear el jugador
    this.player = new Player(this, 100, 450);

    // Crear un enemigo
    this.enemy = new Enemy(this, 600, 450);

    // crear Helicoptero
    this.helicopter = new Helicopter(this, 100, 100);

    // Añadir enemigo a un grupo para manejar colisiones
    this.enemies = this.physics.add.group();
    this.enemies.add(this.enemy);

    // Suelo
    const ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.enemies, ground);

    // Manejar colisión entre el jugador y los enemigos
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerCollision, null, this);

    // Manejar colisión entre las balas del jugador y los enemigos
    this.physics.add.collider(this.player.bullets, this.enemies, this.handleBulletCollision, null, this);

    // Detección de colisiones entre balas del enemigo y el jugador
    this.physics.add.overlap(this.enemy.bullets, this.player, this.handleEnemyBulletCollision, null, this);

    // Detección de colisiones entre balas del jugador y el helicoptero
    this.physics.add.collider(this.player.bullets, this.helicopter, this.handleBulletCollision, null, this);

    // Helicopter bombs collision
    this.physics.add.collider(this.player, this.helicopter.bombs, this.handlePlayerCollision, null, this);
    this.physics.add.collider(this.helicopter.bombs, this.staticTanks);
    this.physics.add.collider(this.helicopter.bombs, this.enemies);
    this.physics.add.collider(this.helicopter.bombs, this.soldiers);

    // suelo helicopter bombs collision
    this.physics.add.collider(this.helicopter.bombs, ground);

    // HUD
    this.healthText = this.add.text(16, 16, 'Health: 100', { fontSize: '18px', fill: '#ffffff' });
  }

  update(time) {
    // Actualizar jugador
    this.player.update(time);

    // Actualizar enemigos
    this.enemies.children.iterate((enemy) => {
      if (enemy) {
        enemy.update(time);
      }
    });

    // Actualizar HUD
    this.healthText.setText(`Health: ${this.player.health}`);
  }

  handlePlayerCollision(player, enemy) {
    // Reducir la vida del jugador al colisionar con un enemigo
    player.damage(1); // Resta 1 vida al jugador
  
    // Verificar si el enemigo sigue existiendo antes de intentar destruirlo
    if (enemy && !enemy.scene.isDestroyed) {
      enemy.destroy(); // El enemigo desaparece
    }
  }
  
  handleEnemyBulletCollision(player, bullet) {
    bullet.destroy(); // Destruir la bala
    player.damage(1); // Reducir 1 vida al jugador
  }

  handleBulletCollision(bullet, enemy) {
    // Desactivar la bala después de la colisión
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.enable = false;

    // Reducir la vida del enemigo si existe y tiene el método damage
    if (enemy && enemy.damage) {
      enemy.damage(20);
    }
  }
}
export default Scene;