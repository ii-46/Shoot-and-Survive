// setup canvas element
"use strict";
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// get center position in cavas
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

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
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.x += this.velocity.x * 8;
    this.y += this.velocity.y * 8;
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
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

const player = new Player(centerX, centerY, 30, "#008996");
const bullets = [];
const enemies = [];

function spawEnemy() {
  setInterval(() => {
    const size = Math.floor(Math.random() * (30 - 15) + 15);
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
    }
    const colors = ["#dac01a", "#39a78e", "#5c2935", "#9f0fef", "#016612"];
    const color = colors[Math.floor(Math.random() * (colors.length - 1))];
    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };

    enemies.push(new Enemy(x, y, size, color, velocity));
    // console.log(enemies);
  }, 1000);
}
spawEnemy();

window.addEventListener("click", (e) => {
  const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };

  //   console.log(angle);
  bullets.push(new Bullet(player.x, player.y, 8, "yellow", velocity));
  console.log(bullets);
});
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

function animete() {
  const id = window.requestAnimationFrame(animete);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  if (keyW) {
    player.y -= 5;
  }
  if (keyA) {
    player.x -= 5;
  }
  if (keyD) {
    player.x += 5;
  }
  if (keyS) {
    player.y += 5;
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

    // collision detect for enemy with layer
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius + 5 < 1) {
      setTimeout(() => {
        player.x = centerX;
        player.y = centerY;
        enemies.splice(0, enemies.length);
        bullets.splice(0, bullets.length);
      }, 0);
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
        setTimeout(() => {
          enemies.splice(eIndex, 1);
          bullets.splice(pIndex, 1);
        }, 0);
      }
    });
  });
}
window.requestAnimationFrame(animete);
console.log(player);
console.log(bullets);
