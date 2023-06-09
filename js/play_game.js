const DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
};

class PlayGame extends Phaser.Scene {

  snake = [];
  apple = {};
  squareSize = 15; // The length of a side of the squares. Our image is 15x15 pixels.
  score = 0;
  speed = 1;
  updateDelay = 0;
  maxScore = 0;
  direction = DIRECTION.RIGHT; // The direction of our snake.
  newDirection = null; // A buffer to store the new direction into.
  shouldAddNew = false; // A variable used when an apple has been eaten. Boolean
  //
  cursors;
  scoreText;
  speedText;

  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image('apple', 'assets/apple.png');
    this.load.image('snake', 'assets/snake.png');
  }

  create() {
    // Set up a Phaser controller for keyboard input.
    this.cursors = this.input.keyboard.createCursorKeys();

    // Generate the initial snake stack. Our snake will be 10 elements long.
    // Beginning at X=150 Y=150 and increasing the X on every iteration.
    for (let i = 0; i < 3; i++) {
      this.snake[i] = this.add.sprite(150 + i * this.squareSize, 150, 'snake'); // Parameters are (X coordinate, Y coordinate, image)
    }

    // Generate the first apple.
    this.generateApple();

    // Speed value
    this.speedText = this.add.text(15, 18, 'Speed: 1', {
      fontSize: '18px',
      fill: '#000000',
    });

    // Score value
    this.scoreText = this.add.text(330, 18, 'Score: 0', {
      fontSize: '18px',
      fill: '#000000',
    });

    this.maxScore = localStorage.getItem('maxScore') || 0;

    this.maxScoreText = this.add.text(
      630,
      18,
      `Max Score: ${this.maxScore}`,
      {
        fontSize: '18px',
        fill: '#000000',
      }
    );
  }

  update() {
    // Snake movement
    // Handle arrow key presses, while not allowing illegal direction changes that will kill the player.
    if (this.cursors.right.isDown && this.direction !== DIRECTION.LEFT) {
      this.newDirection = DIRECTION.RIGHT;
    } else if (this.cursors.left.isDown && this.direction !== DIRECTION.RIGHT) {
      this.newDirection = DIRECTION.LEFT;
    } else if (this.cursors.up.isDown && this.direction !== DIRECTION.DOWN) {
      this.newDirection = DIRECTION.UP;
    } else if (this.cursors.down.isDown && this.direction !== DIRECTION.UP) {
      this.newDirection = DIRECTION.DOWN;
    }

    // A formula to calculate game speed based on the score.
    // The higher the score, the higher the game speed, with a maximum of 10;
    this.speed = Math.min(10, Math.floor(this.score / 5) + 1);
    // Update speed value on the game screen.
    this.speedText.text = `Speed: ${this.speed}`;

    // Since the update function of Phaser has an update rate of around 60 FPS,
    // we need to slow that down to make the game playable.

    // Increase a counter on every update call.
    this.updateDelay++;

    // Do game stuff only if the counter is aliquot to (10 - the game speed).
    // The higher the speed, the more frequently this is fulfilled,
    // making the snake move faster.
    if (this.updateDelay % (10 - this.speed) === 0) {
      // Snake movement

      let firstCell = this.snake[this.snake.length - 1];
      let lastCell = this.snake.shift();
      let oldLastCellx = lastCell.x;
      let oldLastCelly = lastCell.y;

      // If a new direction has been chosen from the keyboard, make it the direction of the snake now.
      if (this.newDirection) {
        this.direction = this.newDirection;
        this.newDirection = null;
      }

      // Change the last cell's coordinates relative to the head of the snake, according to the direction.

      if (this.direction === DIRECTION.RIGHT) {
        lastCell.x = (firstCell.x + this.squareSize) % (this.squareSize * 52);
        lastCell.y = firstCell.y;
      } else if (this.direction === DIRECTION.LEFT) {
        lastCell.x =
          (firstCell.x - this.squareSize + this.squareSize * 52) %
          (this.squareSize * 52);
        lastCell.y = firstCell.y;
      } else if (this.direction === DIRECTION.UP) {
        lastCell.x = firstCell.x;
        lastCell.y =
          (firstCell.y - this.squareSize + this.squareSize * 40) %
          (this.squareSize * 40);
      } else if (this.direction === DIRECTION.DOWN) {
        lastCell.x = firstCell.x;
        lastCell.y = (firstCell.y + this.squareSize) % (this.squareSize * 40);
      }

      // Place the last cell in the front of the stack.
      // Mark it as the first cell.
      this.snake.push(lastCell);
      firstCell = lastCell;
      // End of snake movement

      // Increase length of snake if an apple has been eaten.
      // Create a block in the back of the snake with the old position of the previous last block
      // (it has moved now along with the rest of the snake).

      if (this.shouldAddNew) {
        this.snake.unshift(
          this.add.sprite(oldLastCellx, oldLastCelly, 'snake')
        );
        this.shouldAddNew = false;
      }

      // Check for apple collision.
      this.appleCollision();

      // Check for collision with self. The parameter is the head of the snake.
      this.selfCollision(firstCell);
    }
  }

  generateApple() {
    // width: 800 - 15,
    // height: 600 - 15,
    // Choose a random place on the grid.
    // X is between 0 and 785 (52*15)
    // Y is between 0 and 585 (39*15)
    const randomX = Math.floor(Math.random() * 52) * this.squareSize;
    const randomY = Math.floor(Math.random() * 40) * this.squareSize;

    // Add a new apple.
    this.apple = this.add.sprite(randomX, randomY, 'apple');
    this.apple.setScale(0.8);
  }

  appleCollision() {
    // Check if any part of the snake is overlapping the apple.
    // This is needed if the apple spawns inside the snake.
    for (let i = 0; i < this.snake.length; i++) {
      if (
        this.snake[i].x === this.apple.x &&
        this.snake[i].y === this.apple.y
      ) {
        // Next time the snake moves, a new block will be added to its length.
        this.shouldAddNew = true;

        // Destroy the old apple.
        this.apple.destroy();

        // Make a new one.
        this.generateApple();

        // Increase score.
        this.score++;

        if (this.score > this.maxScore) {
          this.maxScore = this.score;
          this.maxScoreText.setText('Max Score: ' + this.maxScore);
          localStorage.setItem('maxScore', this.maxScore);
        }

        // Refresh scoreboard.
        this.scoreText.text = `Score: ${this.score}`;
      }
    }
  }

  selfCollision(head) {
    // Check if the head of the snake overlaps with any part of the snake.
    for (let i = 0; i < this.snake.length - 1; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        // If so, go to the game over screen.
        this.snake = [];
        this.scene.start('GameOver', { score: this.score });
      }
    }
  }
}
export default PlayGame;