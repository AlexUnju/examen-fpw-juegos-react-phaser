import Phaser from 'phaser';
import Player from '../entities/player';

class Scene extends Phaser.Scene {
  constructor() {
    super('Scene');
  }

  preload() {
    this.load.image('tank', 'assets/tank.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('background', 'assets/background.png');
  }

  create() {
    // fondo
    this.add.image(400, 300, 'background');

    // jugador
    this.player = new Player(this, 3, 450);

    // Suelo
    const ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);

    // HUD
    this.healthText = this.add.text(16, 16, 'Health: 3', { fontSize: '18px', fill: '#ffffff' });
  }

  update(time) {
    // actualizar el jugador
    this.player.update(time);

    // actualizar HUD
    this.healthText.setText(`Health: ${this.player.health}`);
  }
}

export default Scene;