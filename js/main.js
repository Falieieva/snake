const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#f9f9f9",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [GameStart, PlayGame, GameOver]
};

const game = new Phaser.Game(config);