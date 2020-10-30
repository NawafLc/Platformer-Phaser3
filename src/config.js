import myGame from './GlobalVariables';
import GameScene from './scenes/GameScene';

 export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [GameScene],
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
};