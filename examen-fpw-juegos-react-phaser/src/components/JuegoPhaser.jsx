import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../scenes/Scene';

const JuegoPhaser = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: [MainScene]
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div id="game-container" style={{ width: '800px', height: '600px', margin: '0 auto' }} />;
};

export default JuegoPhaser;