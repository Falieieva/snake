class GameStart extends Phaser.Scene {
    constructor() {
      super("GameStart");
    }
  
    preload() {
      this.load.image("GameStart", "assets/menu.png");
    }
  
    create() {
      this.add.sprite(400, 300, "GameStart");
      this.input.on("pointerdown", (pointer) => {
        this.scene.start("PlayGame");
      });
      this.input.keyboard.on("keydown", () => {
        this.scene.start("PlayGame");
      });
    }
  }
  export default GameStart;
