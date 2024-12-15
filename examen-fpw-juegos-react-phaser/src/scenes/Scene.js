import Phaser from 'phaser';
import Player from '../entities/player';
import Enemy from '../entities/enemy';
import Helicopter from '../entities/helicopter';
import Soldier from '../entities/Soldier';
import Boss from '../entities/Boss';
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
    this.load.image('boss', 'public/images/boss.png');
  }

  create() {
    // Añadir fondo con tamaño específico
    this.add.image(400, 300, 'background').setDisplaySize(ConfigUtils.displaySize.background.width, ConfigUtils.displaySize.background.height);

    // Crear el jugador con tamaño específico
    this.player = new Player(this, 100, 450);
    this.player.setDisplaySize(ConfigUtils.displaySize.tank.width, ConfigUtils.displaySize.tank.height);

    // Agregar el jugador a la escena y permitir que dispare
    this.physics.add.existing(this.player);

    // Configurar el grupo de balas, sin un límite estricto
    this.player.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true // Permite la actualización de las balas
    });

    // Crear un enemigo con tamaño específico (tanque enemigo)
    this.enemy = new Enemy(this, 600, 450);
    this.enemy.setDisplaySize(ConfigUtils.displaySize.enemy.width, ConfigUtils.displaySize.enemy.height);

    // Crear Helicóptero con tamaño específico
    this.helicopter = new Helicopter(this, 50, 100);
    this.helicopter.setDisplaySize(ConfigUtils.displaySize.helicopter.width, ConfigUtils.displaySize.helicopter.height);

    // Añadir enemigo a un grupo para manejar colisiones
    this.enemies = this.physics.add.group();
    this.enemies.add(this.enemy);
    this.enemies.add(this.helicopter);
    this.enemies.add

    // Inicializa el grupo de soldados
    this.soldiers = this.physics.add.group();

    // Crear soldados con tamaño específico
    for (let i = 0; i < 2; i++) {
      const soldier = new Soldier(this, 700 + i * 80, 440);
      soldier.setDisplaySize(ConfigUtils.displaySize.soldier.width, ConfigUtils.displaySize.soldier.height);
      this.soldiers.add(soldier);
    }

   // Crear soldados con tamaño específico
    for (let i = 0; i < 2; i++) {
      const soldier = new Soldier(this, 700 + i * 80, 440);
      soldier.setDisplaySize(ConfigUtils.displaySize.soldier.width, ConfigUtils.displaySize.soldier.height);
      this.soldiers.add(soldier);
    }

    // Suelo
    const ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.enemies, ground);
    // Agregar colisión del Boss con el suelo
    if (this.boss) {
    this.physics.add.collider(this.boss, ground);
    }

    // Crear plataformas con tamaño específico
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(200, 420, 'platform').setDisplaySize(ConfigUtils.displaySize.platform.width, ConfigUtils.displaySize.platform.height).refreshBody();
    this.platforms.create(300, 300, 'platform').setDisplaySize(ConfigUtils.displaySize.platform.width, ConfigUtils.displaySize.platform.height).refreshBody();
    this.platforms.create(600, 300, 'platform').setDisplaySize(ConfigUtils.displaySize.platform.width, ConfigUtils.displaySize.platform.height).refreshBody();

    // Crear Boss si no hay enemigos
    this.boss = null;

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

    // Barra de vida del boss
    this.bossHealthBar = this.add.graphics();
    this.bossHealthBar.fillStyle(0x00ff00, 1);  // Barra verde para el boss
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

    // Crear el boss si no hay enemigos vivos
    if (this.getEnemyCount() === 0 && !this.boss) {
      this.spawnBoss();
    }

    // Si el boss existe, actualizamos su barra de salud
    if (this.boss) {
      this.boss.update(time);
      this.updateBossHealthBar();
    }

      // Asegurar que el boss esté tocando el suelo
  if (this.boss) {
    // Posicionar el boss justo por encima del suelo, cerca del jugador
    this.boss.y = Math.max(this.boss.y, 450);  // Ajustar 450 según el nivel de tu suelo
  }

    // Si el boss existe, actualizamos su barra de salud
    if (this.boss) {
      this.boss.update(time);
      this.updateBossHealthBar();
    }
  }


  spawnBoss() {
    // Crear el boss cuando no haya enemigos
    this.boss = new Boss(this, 400, 150);

    // Configurar tamaño del Boss
    this.boss.setDisplaySize(ConfigUtils.displaySize.enemy.width, ConfigUtils.displaySize.enemy.height);
  
    // Añadir el Boss a la escena
    this.physics.add.existing(this.boss);
    
    // Colisión con el jugador
    this.physics.add.collider(this.player, this.boss, this.handlePlayerCollision, null, this);

    // Colisión con las balas del jugador
    this.physics.add.collider(this.player.bullets, this.boss, this.handleBulletCollision, null, this);  

  // Habilitar colisión con el suelo
  this.physics.add.collider(this.boss, this.physics.world.staticBodies); // Suelo estático

  // Añadir el Boss al grupo de enemigos
  this.enemies.add(this.boss);

     // Configurar barra de salud del Boss
    this.bossHealthBar.clear();
    this.bossHealthBar.fillRect(20, 20, 200, 10);
  }

  updateBossHealthBar() {
    // Actualizar la barra de salud del boss
    const healthPercent = this.boss.health / this.boss.maxHealth;
    this.bossHealthBar.clear();
    this.bossHealthBar.fillStyle(0x00ff00, 1);
    this.bossHealthBar.fillRect(20, 20, 200 * healthPercent, 10);
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


  handlePlayerCollision(player, enemy) {
    // Si el enemigo es un helicóptero, no lo destruyas
    if (enemy instanceof Helicopter) {
      // Si el enemigo es un helicóptero, solo dañar al jugador
      player.damage(1);
      console.log('Jugador recibe daño por colisión con helicóptero');
    } else {
      // Si el enemigo no es un helicóptero, procedemos con la destrucción habitual
      player.damage(1);
      if (enemy && !enemy.scene.isDestroyed) {
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
    console.log('Player recibe daño por colisión con helicóptero');
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