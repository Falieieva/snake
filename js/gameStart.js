class gameStart extends Phaser.Scene {
    
    constructor () {
        super ("gameStart");
    }

    preload() {
        this.load.image("gameStart", "assets/menu.png");
    }
    
    create(){
        this.add.sprite(400, 300, "gameStart");
        this.input.on("pointerdown", (pointer) => {
            this.scene.start("playGame");
        });
        this.input.keyboard.on("keydown", () => {
            this.scene.start("playGame");
        });
    }
}

