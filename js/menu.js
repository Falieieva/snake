class menu extends Phaser.Scene {
    
    constructor () {
        super ("menu");
    }

    preload() {
        this.load.image('menu', 'assets/menu.png');
    }
    
    create(){
        this.add.sprite(400, 300, 'menu');
        this.input.on("pointerdown", (pointer) => {
            this.scene.start("playGame");
        });
        this.input.keyboard.on('keydown', () => {
            this.scene.start("playGame");
        });
    }
}

