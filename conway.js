var HEIGHT = 800, WIDTH = 800;
var NUMCELLSVERT = 80;
var NUMCELLSHORZ = NUMCELLSVERT/HEIGHT*WIDTH;
var CELLSIZE = HEIGHT/NUMCELLSVERT;
var TIMESTEP = 100;
var cells = [];

var canvas = document.getElementById("canv");
var canvasContext = canvas.getContext("2d");
canvas.addEventListener("click", canvasClick);
canvas.fillStyle="black";

var isPaused = true;
var pauseButton = document.getElementById("pause");
var resetButton = document.getElementById("reset");
pauseButton.addEventListener("click", function () {
  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "Pause";
    run();
  }
  else {
    isPaused = true;
    pauseButton.textContent = "Unpause";
  }
});
resetButton.addEventListener("click", init);

init();
startWithGlider();

function run() {
  if (!isPaused) {
    step();
    setTimeout(run, TIMESTEP);
  }
}

function init() {
  for (var i = 0; i < NUMCELLSVERT; i++) {
    cells[i] = [];
    for (var j = 0; j < NUMCELLSHORZ; j++) {
      cells[i][j] = 0;
    }
  }
  draw();
}

function startWithGlider() {
  cells[0][1] = 1;
  cells[1][2] = 1;
  cells[2][0] = 1;
  cells[2][1] = 1;
  cells[2][2] = 1;
  draw();
}


function step() {
  var steppedCells = [];
  for (var i = 0; i < NUMCELLSVERT; i++) {
    steppedCells[i] = [];
    for (var j = 0; j < NUMCELLSHORZ; j++) {
      var numNeigh = countNeighbors(i, j);
      if (cells[i][j]) {
        steppedCells[i][j] = (2 <= numNeigh && numNeigh <= 3)? 1 : 0;
      }
      else steppedCells[i][j] = (numNeigh === 3)? 1 : 0;
    }
  }
  cells = steppedCells;
  draw();
}

function draw() {
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  canvasContext.beginPath();
  for (i = 0; i < NUMCELLSVERT; i++) {
    for (j = 0; j < NUMCELLSHORZ; j++) {
      if (cells[i][j]) {
        canvasContext.rect(j*CELLSIZE, i*CELLSIZE, CELLSIZE, CELLSIZE);
        canvasContext.fill();
      }
    }
  }
}

function countNeighbors(i, j) {
  var count = 0;
  var N = NUMCELLSVERT;
  var M = NUMCELLSHORZ;
  if (cells[(i+1)%N][j]) count++;
  if (cells[((i-1)%N+N)%N][j]) count++;
  if (cells[i][(j+1)%M]) count++;
  if (cells[i][((j-1)%M+M)%M]) count++;
  if (cells[(i+1)%N][(j+1)%M]) count++;
  if (cells[(i+1)%N][((j-1)%M+M)%M]) count++;
  if (cells[((i-1)%N+N)%N][(j+1)%M]) count++;
  if (cells[((i-1)%N+N)%N][((j-1)%M+M)%M]) count++;
  return count;
}

function canvasClick(event) {
  var x = event.pageX - canvas.offsetLeft,
      y = event.pageY - canvas.offsetTop;
  cells[Math.floor(y/CELLSIZE)][Math.floor(x/CELLSIZE)] ^= 1;
  draw();
}
