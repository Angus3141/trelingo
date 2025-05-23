const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth * 0.9;
let height = window.innerHeight * 0.7;
canvas.width = width;
canvas.height = height;

const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = height / 2 - paddleHeight / 2;
let rightPaddleY = height / 2 - paddleHeight / 2;

const ball = {
  x: width / 2,
  y: height / 2,
  radius: 10,
  speedX: 5,
  speedY: 3
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.speedX *= -1;
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  drawRect(0, leftPaddleY, paddleWidth, paddleHeight, 'white');
  drawRect(width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, 'white');
  drawCircle(ball.x, ball.y, ball.radius, 'white');
}

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
    ball.speedY *= -1;
  }

  // Left paddle
  if (ball.x - ball.radius < paddleWidth &&
      ball.y > leftPaddleY && ball.y < leftPaddleY + paddleHeight) {
    ball.speedX *= -1;
  }

  // Right paddle
  if (ball.x + ball.radius > width - paddleWidth &&
      ball.y > rightPaddleY && ball.y < rightPaddleY + paddleHeight) {
    ball.speedX *= -1;
  }

  if (ball.x < 0 || ball.x > width) {
    resetBall();
  }

  // Simple AI
  if (rightPaddleY + paddleHeight / 2 < ball.y) {
    rightPaddleY += 4;
  } else {
    rightPaddleY -= 4;
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Touch control
canvas.addEventListener('touchmove', function (e) {
  const touchY = e.touches[0].clientY;
  leftPaddleY = touchY - paddleHeight / 2;
});

gameLoop();