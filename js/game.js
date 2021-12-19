const cvs = document.getElementById("breakOut");
ctx = cvs.getContext("2d");

cvs.style.border = "1px solid #0ff";
ctx.lineWidth = 3;

const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 10;
const ballRadius = 8;
let life = 3;
let score = 0;
const scoreUnit = 10;
let level = 1;
const maxLevel = 3;
let GAME_OVER = false;
let leftPressed = false;
let rightPressed = false;
let bricks = [];

const paddle = {
  x: cvs.width / 2 - paddleWidth / 2,
  y: cvs.height - paddleMarginBottom - paddleHeight,
  width: paddleWidth,
  height: paddleHeight,
  dx: 5
}

function drawPaddle() {
  ctx.fillStyle = "#2e3548";
  ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);

  ctx.strokeStyle = "#ffcd05";
  ctx.strokeRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
  function keyUpHandler(k){
  if (k.keyCode == 37) {
    leftPressed = false;
  } else if (k.keyCode == 39) {
    rightPressed = false;
  }
}

function keyDownHandler(k){
  if (k.keyCode == 37) {
    leftPressed = true;
  } else if (k.keyCode == 39) {
    rightPressed = true;
  }
}
function movePaddle() {
  if (rightPressed && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

const ball = {
  x: cvs.width / 2,
  y: paddle.y - ballRadius,
  radius: ballRadius,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3
}


const brick = {
  row: 3,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#2e3548",
  strokeColor: "#FFF",
}

function drawBall() {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = "#ffcd05";
  ctx.fill();

  ctx.strokeStyle = "#2e3548";
  ctx.stroke();

  ctx.closePath();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
      bricks[r] = [];
      for (let c = 0; c < brick.column; c++) {
        bricks[r][c] = {
          x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
          y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
          status: true
        }
      }
    }  
}

createBricks();

function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);
        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if(b.status) {
        if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
          brickHit.play();
          ball.dy = -ball.dy;
          b.status = false;
          score += scoreUnit;
        }
      }
    }
  }
}

function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    wallHit.play();
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = - ball.dy;
    wallHit.play();
  }
  if (ball.y + ball.radius > cvs.height) {
    life--;
    lifeLost.play();
    resetBall();
  }
}

function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

function ballPaddleCollision() {
  if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
    paddleHit.play();
    let colidePoint = ball.x - (paddle.x + paddle.width/2);

    colidePoint = colidePoint / (paddle.width/2);

    let angle = colidePoint * Math.PI/3;
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

function levelUp() {
  let islevelUp = true;
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      islevelUp = islevelUp && !bricks[r][c].status;
    }
  }
  if (islevelUp) {
    win.play();
    if (level >= maxLevel) {
      showYouWin();
      GAME_OVER = true;
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetBall();
    level++;
  }
}

function showGameStats(text, textX, textY, img, imgX, imgY){
  ctx.fillStyle = "#FFF";
  ctx.font = "25px Germania One";
  ctx.fillText(text, textX, textY);
  ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

function gameOver() {
  if (life <=0) {
    showYouLose();
    GAME_OVER = true;
  }
}

function draw() {
  drawPaddle();
  drawBricks();
  drawBall();
  showGameStats(score, 35, 25, scoreImg, 5, 5);
  showGameStats(life, cvs.width - 25, 25, lifeImg, cvs.width - 55, 5);
  showGameStats(level, cvs.width / 2, 25, levelImg, cvs.width / 2 - 30, 5);
}

function upDate() {
  moveBall();
  movePaddle();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  gameOver();
  levelUp();
}

function loop() {
  ctx.drawImage(bgImage, 0, 0);
  draw();
  upDate();
  if (! GAME_OVER) {
    requestAnimationFrame(loop);
  }
}
loop();

const soundElement = document.getElementById("sound");
soundElement.addEventListener("click", audioManager);

function audioManager() {
  let imgSrc = soundElement.getAttribute("src");
  let soundImg = imgSrc == "img/SoundOn.png"? "img/SoundOff.png" : "img/SoundOn.png";

  soundElement.setAttribute("src", soundImg);

  wallHit.muted = wallHit.muted? false : true;
  paddleHit.muted = paddleHit.muted? false : true;
  brickHit.muted = brickHit.muted? false : true;
  win.muted = win.muted? false : true;
  lifeLost.muted = lifeLost.muted? false : true;
}

const gameover = document.getElementById("gameOver");
const youwin = document.getElementById("youWon");
const youlose =  document.getElementById("youLose");
const restart = document.getElementById("restart");

restart.addEventListener("click", function(){
  location.reload();
})

function showYouWin() {
  gameover.style.display = "block";
  youwin.style.display = "block";
}
function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
}
 
