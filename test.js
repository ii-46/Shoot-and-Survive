var x = 0;
let time = 1000;

function Start() {
  if (time > 250) {
    time -= 50;
  }
  console.log(time);
  setTimeout(Start, time);
}
Start();
