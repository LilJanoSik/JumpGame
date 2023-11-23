const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.height = 900;
canvas.width = 900;
const scoreP = document.getElementById("score");
const highscoreP = document.getElementById("highscore");
const ammountGems = document.getElementById("gems");
const menuWrapper = document.getElementsByClassName("menu-wrapper")[0];
const button = document.getElementById("buttonShop");
const buyChar1 = document.getElementById("buyChar1");
const buyChar2 = document.getElementById("buyChar2");
const buyChar3 = document.getElementById("buyChar3");
const buyChar4 = document.getElementById("buyChar4");
const gameOver = document.getElementById("gameover");
const playAgain = document.getElementById("playAgain")

const playerImages = ["./img/char.png", "./img/char1.png", "./img/char2.png", "./img/char3.png", "./img/char4.png"];

const karbMan = new Image();
karbMan.src = playerImages[0];
const background = new Image();
background.src = "./img/background.jpg";
const platform = new Image();
platform.src = "./img/platform.png";

const defaultGameSpeed = 1;
let gameSpeed = defaultGameSpeed;
let gravity = 0.5;
let player;
let gems = 0;
let score = 0;
let highscore = 0;
let keys = {};

let runGame = true;

document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));

/*
const animate = () => {
    ctx.clearRect(0,0, 900,900);
    ctx.drawImage(karbMan, 400, 800, 100,100);
    requestAnimationFrame(animate);
}
animate();
*/

class Player {
  width = 50;
  height = 85;
  canJump = true;
  canWalk = true;
  walkSpeed = 15;
  walkCounter = 0;
  jumpCounter = 0;
  jumpForce = 12;
  dY = 0; //jump Y
  dX = 0; // walk X

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  update() {

    if (this.y > canvas.height - this.height){
      gameOver.style.display = "block";
      runGame = false;
    }

    if(!runGame)return;

    let obstacleY = this.y;

    if (keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) {
      this.jump();
    } else {
      this.jumpCounter = 0;
    }
    this.y += this.dY;
    if (this.y + this.height < canvas.height) {
      this.canJump = true;
      this.dY += gravity;
    } else {
      this.canJump = false;
      this.dY;
    }

    if (this.x + this.width < canvas.width && this.x >= 0) {
      this.canWalk = true;
    } else {
      this.canWalk = false;
    }

    if (keys["ArrowLeft"] || keys["KeyA"]) {
      this.left();
    } else {
      this.walkCounter = 0;
    }
    this.x += this.dX;

    if (keys["ArrowRight"] || keys["KeyD"]) {
      this.right();
    }

    obstacleY -= this.y;
    if(obstacleY > 0)score += Math.floor(obstacleY);
    if(obstacleY > 0)gems += Math.floor(obstacleY)/100;

     ctx.drawImage(karbMan, this.x, this.y, this.width, this.height);
    //ctx.fillStyle = "red";
    //ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  jump() {
    if (!this.canJump && this.jumpCounter === 0) {
      this.jumpCounter = 1;
      this.dY = -this.jumpForce;
      return;
    }
    if (this.jumpCounter > 0 && this.jumpCounter < this.jumpForce) {
      this.jumpCounter++;
      this.dY = -this.jumpForce - this.jumpCounter / 50;
    }
  }
  left() {
    if (this.canWalk) player.x -= this.walkSpeed;
    if (this.x < 0) player.x += this.walkSpeed;
  }

  right() {
    if (this.canWalk) player.x += this.walkSpeed;
    if (this.x + this.width > canvas.width) player.x -= this.walkSpeed;
  }
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "blue";
    this.collision = false;
  }
  update() {
    //ctx.fillStyle = this.color;
    //ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(platform, this.x, this.y, this.w, this.h);
    if (player.y + player.height < this.y) {
      this.collision = true;
   }else{
     this.collision = false;
   }
   if(player.y > this.y){
     this.collision = false;
   }
  }
}

const random = (min, max) => Math.random() * (max - min) +min;

const checkCollisions = () => {
  obstacles.forEach((obstacle) =>{
    if(!runGame)return;
    if(obstacle.y > canvas.height){
      obstacle.x = random(0, canvas.width - obstacle.w);
      obstacle.y = random(0,90);
      gameSpeed += 0.002;
      obstacle.collision = false;
    }
    if (
      obstacle.collision &&
      player.x < obstacle.x + obstacle.w &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y &&
      player.height + player.y > obstacle.y && 
      player.height + player.y < obstacle.y + 20

      
    ) {
      this.y += this.dY;
      player.y -= player.dY - gravity;
      player.jumpCounter = 1;
      player.dY = 0;
    }
  });
};


const obstacles = [new Obstacle(435, 750, 100, 30), new Obstacle(435, 700, 100, 30),new Obstacle(535, 600, 100, 30),new Obstacle(635, 475, 100, 30),new Obstacle(135, 350, 100, 30),new Obstacle(535, 225, 100, 30),new Obstacle(435, 100, 100, 30)];

const drawGame = () => {
  ctx.clearRect(0, 0, canvas.height, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  obstacles.forEach((obstacle) => {
    obstacle.update();
  });
  player.update();
  scoreP.innerHTML = `Score: ${score}`;
  if (score > highscore) {
    highscore = score;
    highscoreP.innerHTML = `Highscore: ${highscore}`;
  }
};

const updateGame = () => {
  ammountGems.innerHTML = "Gems:" + Math.floor(gems);
  if(gems >= 10)buyChar1.innerHTML = "Choose char1"
  if(gems >= 100)buyChar2.innerHTML = "Choose char2"
  if(gems >= 500)buyChar3.innerHTML = "Choose char3"
  if(gems >= 1000)buyChar4.innerHTML = "Choose char4"

  obstacles.forEach((obstacle) =>{
    obstacle.y += gameSpeed;
  });
};

const init = () => {
  if(!runGame)return;
  player = new Player(canvas.width / 2, 550);
  let savedHighScore = Cookies.get("highscore");
  if (savedHighScore !== undefined) {
    highscore = savedHighScore;
    highscoreP.innerHTML = `Highscore : ${highscore}`;
    console.log("Highscore loaded");
    console.log({ savedHighScore });
  } else {
    Cookies.set("highscore", 0);
    console.log("Highscore not found");
  }
  window.requestAnimationFrame(gameLoop);
};

playAgain.onclick = () => {
  if (gameOver.style.display === "block"){
      gameOver.style.display = "none";
      score = 0;
      runGame = true;
  }
}

const shop = () =>{
  if (menuWrapper.style.display === "none") {
    menuWrapper.style.display = "block";
  } else {
    menuWrapper.style.display = "none";
  }
}
button.onclick = shop;

buyChar1.onclick = () =>{
  if(gems < 10){
    karbMan.src = playerImages[0];
  }else {
    karbMan.src = playerImages[1];
  }
}
buyChar2.onclick = () =>{
  if(gems < 100){
    karbMan.src = playerImages[0];
  }else {
    karbMan.src = playerImages[2];
  }
}
buyChar3.onclick = () =>{
  if(gems < 500){
    karbMan.src = playerImages[0];
  }else {
    karbMan.src = playerImages[3];
  }
}
buyChar4.onclick = () =>{
  if(gems < 1000){
    karbMan.src = playerImages[0];
  }else {
    karbMan.src = playerImages[4];
  }
}

const resetPlayerAndObstacles = () => {
  player.x = canvas.width / 2;
    player.y = 550;
    obstacles[0].x = 435;
    obstacles[0].y = 750;
}


const gameLoop = () => {
  if(runGame){
    updateGame();
    checkCollisions();
    drawGame();
  } else{
    resetPlayerAndObstacles();
  }
  window.requestAnimationFrame(gameLoop);
};

window.onload = () => {
  init();
};
