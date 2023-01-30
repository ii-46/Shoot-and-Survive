"use strict";
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

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

const playerName = "Hello World";
const player = new Player(centerX, centerY, 25, "#FFFFFF");
const playerSize = 25;
const playerSpeed = 5;
// 2000 = 2s per unit
const healingSpeed = 2000;
const enemies = [];
const enemiesRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
const enemyColor = ["#dac01a", "#39a78e", "#fc5185", "#9f0fef", "#016612"]; // custom
const enemySize = {
  min: 10,
  max: 30
};
const enemySpeed = 3;
// full damage is 1, add higher value to decrease dramage
const enemyDramage = 1;
// 1000 = 1s per enemy
const enemySpawSpeed = 1000;

const bullets = [];
const bulletSize = 4;
const bulletColor = {
  default: "red",
  random: "#" + Math.floor(Math.random() * 16777215).toString(16)
};
const bulletSpeed = 8;
// const bulletDramage = bulletSize * 4;
const bulletDramage = 4;
const bulletShape = false;
function gameOver() {
  player.x = centerX;
  player.y = centerY;
  player.radius = playerSize;
  enemies.splice(0, enemies.length);
  bullets.splice(0, bullets.length);
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
  setInterval(() => {
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
  }, enemySpawSpeed);
}
spawEnemy();

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
  console.log(bullets);
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
        console.log(bullets);
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
          gameOver();
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
        console.log(enemies);
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
          setTimeout(() => {
            enemies.splice(eIndex, 1);
            bullets.splice(pIndex, 1);
          }, 0);
        }
      }
    });
  });
  drawPlayerStatus();
}
window.requestAnimationFrame(animete);

function drawPlayerStatus() {
  const fontSize = "16";
  ctx.font = `${fontSize}px serif`;
  // ctx.font = `16px serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    playerName,
    player.x - playerSize - (playerName.length < 10 ? 0 : playerName.length),
    player.y - playerSize - fontSize
  );
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
function LightenDarkenColor(col, amt) {
  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;
  var b = ((num >> 8) & 0x00ff) + amt;
  var g = (num & 0x0000ff) + amt;
  var newColor = g | (b << 8) | (r << 16);
  return newColor.toString(16);
}
