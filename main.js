"use strict";
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const playSoundShoot = new Audio("./res/shoot-ef.mp3");
const playSoundDie = new Audio("./res/die-ef.mp3");
const playBackground = new Audio("./res/Minecraft-Theme.mp3");
playBackground.play();
// play button
const playBtn = document.querySelector("#play_btn");
playBtn.addEventListener("click", () => {
  const playerNameInput = document.querySelector("#player-name").value.trim();
  if (playerNameInput.length > 0) {
    playerName = playerNameInput;
    playBackground.pause();
    newGame();
  }
});
const playAgainBtn = document.querySelector("#play-again_btn");
playAgainBtn.addEventListener("click", () => {
  newGame();
});

class Player {
  x;
  y;
  radius;
  color;
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
  }
}
class Bullet {
  x;
  y;
  radius;
  color;
  // object
  velocity;
  speed;
  constructor(x, y, radius, color, velocity, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.x += this.velocity.x * this.speed;
    this.y += this.velocity.y * this.speed;
    this.draw();
  }
}
class Enemy {
  x;
  y;
  radius;
  color;
  // object
  velocity;
  speed;
  constructor(x, y, radius, color, velocity, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.x += this.velocity.x * this.speed;
    this.y += this.velocity.y * this.speed;
    this.draw();
  }
}

// get center position in cavas
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let playerName = "Hello World";
const player = new Player(centerX, centerY, 25, "#FFFFFF");
let playerSize = 25;
let playerSpeed = 5;
let playerScore = 0;
let surviveTime = 0;
let bestScore = 0;
// 2000 = 2s per unit
let healingSpeed = 2000;
const enemies = [];
const enemiesRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
// const enemyColor = ["#dac01a", "#39a78e", "#fc5185", "#9f0fef", "#016612"]; // custom
const enemySize = {
  min: 10,
  max: 30
};
let enemySpeed = 3;
// full damage is 1, add higher value to decrease dramage
let enemyDramage = 1;
// 1000 = 1s per enemy
let enemySpawSpeed = 1000;

const bullets = [];
let bulletSize = 4;
const bulletColor = {
  default: "red",
  random: "#" + Math.floor(Math.random() * 16777215).toString(16)
};
let bulletSpeed = 8;
// const bulletDramage = bulletSize * 4;
let bulletDramage = 4;
let bulletShape = false;
let isGameOver = false;
function newGame() {
  const mainUI = document.querySelector(".home-menu_container");
  if (!mainUI.classList.contains("hide")) {
    mainUI.classList.add("hide");
  }
  const gameOverUI = document.querySelector(".game-over_container");
  if (!gameOverUI.classList.contains("hide")) {
    gameOverUI.classList.add("hide");
  }
  window.requestAnimationFrame(animete);
  playerSize = 25;
  playerSpeed = 2;
  playerScore = 0;
  healingSpeed = 1000;
  surviveTime = 0;
  enemySpeed = 2;
  enemyDramage = 2;
  enemySpawSpeed = 1500;
  bulletSize = 3;
  bulletSpeed = 8;
  bulletDramage = 8;
  isGameOver = false;
  bulletShape = false;
  spawEnemy();
  counTime();
}

function gameOver(frameID) {
  player.x = centerX;
  player.y = centerY;
  player.radius = playerSize;
  enemies.splice(0, enemies.length);
  bullets.splice(0, bullets.length);
  bestScore = playerScore > bestScore ? playerScore : bestScore;
  const gameOverUI = document.querySelector(".game-over_container");
  gameOverUI.classList.remove("hide");

  const currentScore = document.querySelector("#current-score");
  currentScore.textContent = playerScore;
  const newScore = document.querySelector("#best-score");
  newScore.textContent = bestScore;
  window.cancelAnimationFrame(frameID);
}
// auto resize / healing for player
function autoHealing() {
  setInterval(() => {
    if (player.radius < 25) {
      player.radius++;
    }
  }, healingSpeed);
}
autoHealing();
function spawEnemy() {
  if (!isGameOver) {
    setTimeout(() => {
      const size = Math.floor(
        Math.random() * (enemySize.max - enemySize.min) + enemySize.min
      );
      let x, y;
      // random spaw positon for enemy
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
      }
      // const color =
      //   enemyColor[Math.floor(Math.random() * (enemyColor.length - 1))];
      const color = enemiesRandomColor();
      const angle = Math.atan2(player.y - y, player.x - x);
      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      enemies.push(new Enemy(x, y, size, color, velocity, enemySpeed));
      spawEnemy();
    }, enemySpawSpeed);
  }
}
function counTime() {
  setInterval(() => {
    surviveTime++;
    if (enemySpawSpeed > 250) {
      enemySpawSpeed -= 10;
    }
  }, 1000);
}
// shooting
window.addEventListener("click", (e) => {
  const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };

  bullets.push(
    new Bullet(
      player.x,
      player.y,
      bulletSize,
      bulletColor.default,
      velocity,
      bulletSpeed
    )
  );

  playSoundShoot.play();
});

function animete() {
  const id = window.requestAnimationFrame(animete);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  if (keyW) {
    player.y -= player.y - playerSpeed < playerSize ? 0 : playerSpeed;
  }
  if (keyA) {
    player.x -= player.x - playerSpeed < playerSize ? 0 : playerSpeed;
  }
  if (keyD) {
    player.x +=
      player.x + playerSpeed > canvas.width - playerSize ? 0 : playerSpeed;
  }
  if (keyS) {
    player.y +=
      player.y + playerSpeed > canvas.height - playerSize ? 0 : playerSpeed;
  }
  player.update();

  bullets.forEach((bullet, bIndex) => {
    bullet.update();
    // remove bullet in off screen
    if (
      bullet.x - bullet.radius > canvas.width ||
      bullet.y - bullet.radius > canvas.height ||
      bullet.x + bullet.radius < 0 ||
      bullet.y + bullet.radius < 0
    ) {
      setTimeout(() => {
        bullets.splice(bIndex, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, eIndex) => {
    enemy.draw();
    enemy.update();

    // collision detect for enemy with player
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius + 5 < 1) {
      if (
        player.radius > 8 &&
        player.radius - enemy.radius / enemyDramage > 1
      ) {
        enemies.splice(eIndex, 1);
        player.radius -= enemy.radius / enemyDramage;
      } else {
        setTimeout(() => {
          isGameOver = true;
          playSoundDie.play();
          gameOver(id);
        }, 0);
      }
    }

    // remove enemy from off screen
    if (
      enemy.x - enemy.radius > canvas.width ||
      enemy.y - enemy.radius > canvas.height ||
      enemy.x + enemy.radius < 0 ||
      enemy.y + enemy.radius < 0
    ) {
      setTimeout(() => {
        enemies.splice(eIndex, 1);
      }, 0);
    }

    bullets.forEach((bullet, pIndex) => {
      // collision detect for enemy with bullet
      const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
      if (dist - enemy.radius - bullet.radius < 1) {
        if (enemy.radius - bulletDramage > 10) {
          enemy.radius -= bulletDramage;
          if (!bulletShape) {
            bullets.splice(pIndex, 1);
          }
        } else {
          playerScore += enemy.radius;
          setTimeout(() => {
            const playSoundEnemyDie = new Audio("./res/enemy-die.mp3");

            playSoundEnemyDie.play();
            enemies.splice(eIndex, 1);
            bullets.splice(pIndex, 1);
          }, 0);
        }
      }
    });
  });
  drawPlayerStatus();
}

function drawPlayerStatus() {
  let fontSize = "16";
  ctx.font = `${fontSize}px serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    playerName,
    player.x - playerSize - (playerName.length < 10 ? 0 : playerName.length),
    player.y - playerSize - fontSize
  );

  ctx.fillText("current score: " + playerScore.toString(), 50, 60);
  ctx.fillText("best score: " + bestScore.toString(), 50, 80);
  ctx.fillText("time: " + fancyTimeFormat(surviveTime).toString(), 50, 100);
  const img = document.createElement("img");
  img.src = "./res/controller.png";
  ctx.drawImage(img, 50, canvas.height - 150, 120, 130);
}
// controller

let keyW = false;
let keyA = false;
let keyD = false;
let keyS = false;

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
  switch (event.code) {
    case "KeyW":
      keyW = true;
      break;
    case "KeyA":
      keyA = true;
      break;
    case "KeyD":
      keyD = true;
      break;
    case "KeyS":
      keyS = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case "KeyW":
      keyW = false;
      break;
    case "KeyA":
      keyA = false;
      break;
    case "KeyD":
      keyD = false;
      break;
    case "KeyS":
      keyS = false;
      break;
  }
}
function fancyTimeFormat(duration) {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}
