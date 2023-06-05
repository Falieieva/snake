class gameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    init(data) {
        this.score = data.score;
    }
  
    preload() {
      this.load.image("gameOver", "assets/game_over.png");
    }
  
    create() {
      this.add.sprite(400, 300, "gameOver");
  
      // Display score and maximum score
      this.add.text(300, 125, `Score: ${this.score}`, {
        fontSize: "42px",
        fill: "#ffffff",
      });
     
  
      this.input.on("pointerdown", (pointer) => {
        this.scene.start("playGame");
      });
  
      this.input.keyboard.on("keydown", () => {
        this.scene.start("playGame");
      });
    }
  }