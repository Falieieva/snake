class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
      this.score = data.score;
  }

  preload() {
    this.load.image("GameOver", "assets/game_over.png");
  }

  create() {
    this.add.sprite(400, 300, "GameOver");

    // Display score and maximum score
    this.add.text(300, 125, `Score: ${this.score}`, {
      fontSize: "42px",
      fill: "#ffffff",
    });
   

    this.input.on("pointerdown", (pointer) => {
      this.scene.start("PlayGame");
    });

    this.input.keyboard.on("keydown", () => {
      this.scene.start("PlayGame");
    });
  }
}