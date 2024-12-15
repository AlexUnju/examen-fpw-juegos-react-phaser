import Phaser from 'phaser';
import Player from '../entities/player';
import Enemy from '../entities/enemy';
import Helicopter from '../entities/helicopter';
import Soldier from '../entities/Soldier';
import ConfigUtils from '../utils/configUtils';

class Scene extends Phaser.Scene {
  constructor() {
    super('Scene');
  }

  preload() {
    // Cargar imágenes
    this.load.image('tank', 'public/images/tanque1.png');
    this.load.image('background', 'public/images/sky.webp');
    this.load.image('enemy', 'public/images/enemy-tank.png');
    this.load.image('platform', 'public/images/platform.webp');
    this.load.image('helicopter', 'public/images/helicopter.png');
    this.load.image('soldier', 'public/images/soldier.webp');
    this.load.image('bomb', 'public/images/bomb.png');
    this.load.image('bullet', 'public/images/bullet.webp');
  }

  create() {
    // Añadir fondo con tamaño específico
    this.add.image(400, 300, 'background').setDisplaySize(ConfigUtils.displaySize.background.width, ConfigUtils.displaySize.background.height);

    // Crear el jugador con tamaño específico
    this.player = new Player(this, 100, 450);
    this.player.setDisplaySize(ConfigUtils.displaySize.tank.width, ConfigUtils.displaySize.tank.height);

    // Crear un enemigo con tamaño específico (tanque enemigo)
    this.enemy = new Enemy(this, 600, 450);
    this.enemy.setDisplaySize(ConfigUtils.displaySize.enemy.width, ConfigUtils.displaySize.enemy.height);

    // Crear Helicóptero con tamaño específico
    this.helicopter = new Helicopter(this, 100, 100);
    this.helicopter.setDisplaySize(ConfigUtils.displaySize.helicopter.width, ConfigUtils.displaySize.helicopter.height);
    this.helicopter.body.setAllowGravity(false); // Deshabilitar gravedad para el helicóptero

    // Añadir enemigo a un grupo para manejar colisiones
    this.enemies = this.physics.add.group();
    this.enemies.add(this.enemy);
    this.enemies.add(this.helicopter);

    // Inicializa el grupo de soldados
    this.soldiers = this.physics.add.group();

    // Crear soldados con tamaño específico
    for (let i = 0; i < 5; i++) {
      const soldier = new Soldier(this, 600 + i * 80, 440);
      soldier.setDisplaySize(ConfigUtils.displaySize.soldier.width, ConfigUtils.displaySize.soldier.height);
      this.soldiers.add(soldier);
    }

    // Suelo
    const ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.enemies, ground);

    // Crear plataformas con tamaño específico
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(200, 420, 'platform').setDisplaySize(ConfigUtils.displaySize.platform.width, ConfigUtils.displaySize.platform.height).refreshBody();
    this.platforms.create(300, 300, 'platform').setDisplaySize(ConfigUtils.displaySize.platform.width, ConfigUtils.displaySize.platform.height).refreshBody();
    this.platforms.create(600, 300, 'platform').setDisplaySize(ConfigUtils.displaySize.platform.width, ConfigUtils.displaySize.platform.height).refreshBody();

    // Colisiones entre el jugador y las plataformas
    this.physics.add.collider(this.player, this.platforms);

    // Manejar colisión entre el jugador y los enemigos
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerCollision, null, this);

    // Manejar colisión entre las balas del jugador y los enemigos
    this.physics.add.collider(this.player.bullets, this.enemies, this.handleBulletCollision, null, this);

    // Detección de colisiones entre balas del enemigo y el jugador
    this.physics.add.overlap(this.enemy.bullets, this.player, this.handleEnemyBulletCollision, null, this);

    // Detección de colisiones entre balas del jugador y el helicóptero
    this.physics.add.collider(this.player.bullets, this.helicopter, this.handleHelicopterBulletCollision, null, this);

    // Colisión de bombas del helicóptero
    this.physics.add.collider(this.player, this.helicopter.bombs, this.handlePlayerBombCollision, null, this);
    this.physics.add.collider(this.helicopter.bombs, this.enemies);
    this.physics.add.collider(this.helicopter.bombs, this.soldiers);

    // Colisión de bombas del helicóptero con el suelo
    this.physics.add.collider(this.helicopter.bombs, ground);

    // Colisión de soldados con el suelo
    this.physics.add.collider(this.soldiers, ground);

    // Detección de colisiones entre el jugador y los soldados
    this.physics.add.collider(this.player, this.soldiers, this.handlePlayerCollision, null, this);

    // Detección de colisiones entre las balas del jugador y los soldados
    this.physics.add.collider(this.player.bullets, this.soldiers, this.handleBulletCollision, null, this);

    // Nueva colisión entre el jugador y el helicóptero
    this.physics.add.collider(this.player, this.helicopter, this.handlePlayerHelicopterCollision, null, this);

    // HUD
    this.healthText = this.add.text(16, 16, 'Salud: 100', { fontSize: '18px', fill: '#ff0000' }); // Texto rojo para la salud
    this.enemyCountText = this.add.text(16, 40, `Enemigos vivos: ${this.getEnemyCount()}`, { fontSize: '18px', fill: '#ffffff' });
  }

  update(time, delta) {
    // Actualizar jugador
    this.player.update(time);

    // Actualizar enemigos
    this.enemies.children.iterate((enemy) => {
      if (enemy) {
        enemy.update(time);
      }
    });

    // Actualizar helicóptero
    this.helicopter.y = 100; // Ajusta la posición según lo necesites

    // Actualizar HUD
    this.healthText.setText(`Salud: ${this.player.health}`);

    // Actualizar contador de enemigos vivos
    const enemyCount = this.getEnemyCount();
    if (enemyCount > 0) {
      this.enemyCountText.setText(`Enemigos vivos: ${enemyCount}`);
    } else {
      this.enemyCountText.setText('Todos los enemigos destruidos');
    }

    // Actualizar soldados
    this.soldiers.children.iterate((soldier) => {
      if (soldier) {
        soldier.update(this.player);
      }
    });
  }

  handlePlayerCollision(player, enemy) {
    // Reducir la vida del jugador al colisionar con un enemigo
    player.damage(1);

    // Verificar si el enemigo sigue existiendo antes de intentar destruirlo
    if (enemy && !enemy.scene.isDestroyed) {
      enemy.destroy();
    }
  }

  handleEnemyBulletCollision(player, bullet) {
    console.log('Colisión con la bala del enemigo');
    bullet.destroy();
    player.damage(1);
  }

  handleBulletCollision(bullet, enemy) {
    console.log('Colisión con la bala');

    // Desactivar la bala
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.enable = false;

    if (enemy && enemy.damage) {
      // Reducir la vida del enemigo al recibir daño
      enemy.damage(20);

      if (enemy.isDestroyed) {
        enemy.destroy();
      }
    }
  }

  handleHelicopterBulletCollision(bullet, helicopter) {
    console.log('Colisión con la bala en el helicóptero');

    // Desactivar la bala
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.enable = false;

    // Reducir la vida del helicóptero
    if (helicopter && helicopter.damage) {
      helicopter.damage(20);

      if (helicopter.isDestroyed) {
        helicopter.bombs.clear(true, true); // Eliminar todas las bombas
        console.log('Helicóptero destruido por bala.');
      }
    }
  }

  handlePlayerHelicopterCollision(player, helicopter) {
    player.damage(2);

    helicopter.damage(100); // Asumimos que esto destruirá el helicóptero

    console.log('Helicóptero destruido por colisión con el jugador.');
  }

  handlePlayerBombCollision(player, bomb) {
    player.damage(2); // Reducir la vida del jugador
    bomb.destroy(); // Destruir la bomba
  }

  getEnemyCount() {
    // Contar enemigos que siguen activos
    return this.enemies.countActive(true) + this.soldiers.countActive(true);
  }
}

export default Scene;
