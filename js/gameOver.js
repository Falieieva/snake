class gameOver extends Phaser.Scene {
    
    constructor () {
        super ("gameOver");
    }

    preload() {
        this.load.image('game_over', 'assets/game_over.png');
    }
    
    create(){
        this.add.sprite(400, 300, 'game_over');
        this.input.on("pointerdown", (pointer) => {
            this.scene.start("gameOver");
        });
        this.input.keyboard.on('keydown', () => {
            this.scene.start("gameOver");
        });
    }
}