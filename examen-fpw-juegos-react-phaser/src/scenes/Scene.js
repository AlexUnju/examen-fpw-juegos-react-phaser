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
  
    // Añadir enemigo a un grupo para manejar colisiones
    this.enemies = this.physics.add.group();
    this.enemies.add(this.enemy);
  
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
  
    // Detección de colisiones entre balas del jugador y el helicoptero
    this.physics.add.collider(this.player.bullets, this.helicopter, this.handleBulletCollision, null, this);
  
    // Helicopter bombs collision
    this.physics.add.collider(this.player, this.helicopter.bombs, this.handlePlayerBombCollision, null, this); // Nueva colisión con bombas de helicóptero
    this.physics.add.collider(this.helicopter.bombs, this.staticTanks);
    this.physics.add.collider(this.helicopter.bombs, this.enemies);
    this.physics.add.collider(this.helicopter.bombs, this.soldiers);
  
    // Suelo helicopter bombs collision
    this.physics.add.collider(this.helicopter.bombs, ground);
  
    // Suelo soldados collision
    this.physics.add.collider(this.soldiers, ground);
  
    // Detección de colisiones entre el jugador y los soldados
    this.physics.add.collider(this.player, this.soldiers, this.handlePlayerCollision, null, this);
  
    // Detección de colisiones entre las balas del jugador y los soldados
    this.physics.add.collider(this.player.bullets, this.soldiers, this.handleBulletCollision, null, this);
  
    // Nueva colisión entre el jugador y el helicóptero
    this.physics.add.collider(this.player, this.helicopter, this.handlePlayerHelicopterCollision, null, this);
  
    // HUD
    this.healthText = this.add.text(16, 16, 'Health: 100', { fontSize: '18px', fill: '#ffffff' });
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

    // Actualizar HUD
    this.healthText.setText(`Health: ${this.player.health}`);

    // Actualizar soldados
    this.soldiers.children.iterate((soldier) => {
      if (soldier) {
        soldier.update(this.player);
      }
    });

    // Actualizar helicóptero si aún existe
    if (this.helicopter && !this.helicopter.isDestroyed) {
      this.helicopter.update(time);
    }
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
    bullet.destroy();
    player.damage(1);
  }

  handleBulletCollision(bullet, enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.enable = false;

    if (enemy && enemy.damage) {
      enemy.damage(20);

      // Si el enemigo es el helicóptero y ha sido destruido
      if (enemy === this.helicopter && enemy.health <= 0) {
        // Destruir el helicóptero
        enemy.destroy();
        enemy.isDestroyed = true;

        // Detener la generación de bombas
        if (enemy.bombTimer) {
          enemy.bombTimer.remove();
        }

        console.log('Helicóptero destruido por proyectil');
      }
    }
  }

  handlePlayerHelicopterCollision(player, helicopter) {
    // Reducir la vida del jugador en 2 puntos
    player.damage(2);

    // Destruir el helicóptero
    helicopter.destroy();
    helicopter.isDestroyed = true;

    // Detener la generación de bombas
    if (helicopter.bombTimer) {
      helicopter.bombTimer.remove();
    }
  }

  // Nueva función para manejar la colisión con las bombas de los soldados
  handlePlayerBombCollision(player, bomb) {
    player.damage(2);  // Reducir la vida del jugador
    bomb.destroy();    // Destruir la bomba
  }
}

export default Scene;

