class playGame extends Phaser.Scene {
  snake;
  snakeBody = [];
  apples;
  cursors;
  scoreText;
  score = 0;
  speedText;
  speed = 50;
  appleCount = 0; 
  maxScore = 0;
  maxScoreText;

  constructor () {
    super ("playGame");
  }
  
  preload() {
    this.load.image('apple', 'assets/apple.png');
    this.load.image('snake', 'assets/snake.png');
  }
  
  create() {
    this.apples = this.physics.add.group();

    this.snakeBody = this.physics.add.group();
   
    this.snake = this.snakeBody.create(400, 300, 'snake').setScale(0.8);

    this.snake.setOrigin(0);

    this.physics.add.collider(this.snake, this.snakeBody, this.gameOver, null, this);
    
    this.physics.world.setBoundsCollision();
    
    this.cursors = this.input.keyboard.createCursorKeys();
  
    this.speedText = this.add.text(15, 18, 'Speed: 50', { fontSize: '18px', fill: '#000000' });
    
    this.scoreText = this.add.text(330, 18, 'Score: 0', { fontSize: '18px', fill: '#000000' });
    
    this.maxScoreText = this.add.text(640, 18, 'Max Score: 0', { fontSize: '18px', fill: '#000000' });
    
    if (localStorage.getItem('maxScore')) {
      this.maxScore = localStorage.getItem('maxScore');
      this.maxScoreText.setText('Max Score: ' + this.maxScore);
    }
    

    this.spawnApple();
  }

  update() {
    // Керування змією
    if (this.cursors.left.isDown) {
      this.snake.setVelocityX(-this.speed);
      this.snake.setVelocityY(0);
    } else if (this.cursors.right.isDown) {
      this.snake.setVelocityX(this.speed);
      this.snake.setVelocityY(0);
    } else if (this.cursors.up.isDown) {
      this.snake.setVelocityY(-this.speed);
      this.snake.setVelocityX(0);
    } else if (this.cursors.down.isDown) {
      this.snake.setVelocityY(this.speed);
      this.snake.setVelocityX(0);
    }
  
    this.physics.overlap(this.snake, this.apples, this.eatApple, null, this);

    // Оновити позицію блоків змії
    for (let i = this.snakeBody.getChildren().length - 1; i > 0; i--) {
      const part = this.snakeBody.getChildren()[i];
      const prevPart = this.snakeBody.getChildren()[i - 1];
      part.setPosition(prevPart.x, prevPart.y);
    }
      
    // Оновлення позиції першого блоку змії
    this.snakeBody.getChildren()[0].setVelocity(this.snake.body.velocity.x, this.snake.body.velocity.y);
    
    this.wrapSnake();
  }
  
  wrapSnake() {
    const { width, height } = this.game.config;
  
    if (this.snake.x < 0) {
      this.snake.x = width;
    } else if (this.snake.x > width) {
      this.snake.x = 0;
    }

    if (this.snake.y < 0) {
      this.snake.y = height;
    } else if (this.snake.y > height) {
      this.snake.y = 0;
    }
  }
  
  spawnApple() {
    const { width, height } = this.game.config;
  
    // Генерування випадкових координат для яблука
    const x = Phaser.Math.Between(10, width);
    const y = Phaser.Math.Between(10, height);
  
    // Створення яблука
    const apple = this.apples.create(x, y, 'apple').setScale(0.7);
    apple.setOrigin(0);
  }
  
  eatApple(snake, apple) {
   
    apple.destroy();
  
    const newPart = this.snakeBody.create(snake.x,snake.y, 'snake').setScale(0.8);
    newPart.setOrigin(1,0);
  
    
    const lastPart = this.snakeBody.getChildren()[0];
    newPart.setPosition(lastPart.x, lastPart.y);
  
   
    this.score++;
    this.scoreText.setText('Score: ' + this.score);
  
    // Збільшення швидкості кожні 5 з'їдених блоків
    if (this.score % 5 === 0) {
      this.speed += 25;
      this.speedText.setText('Speed: ' + this.speed);
    }
  
    // Оновлення максимального результату
    if (this.score > this.maxScore) {
      this.maxScore = this.score;
      this.maxScoreText.setText('Max Score: ' + this.maxScore);
  
      localStorage.setItem('maxScore', this.maxScore);
    }
  
    // Створення нового яблука
    this.spawnApple();
  }
  

}
