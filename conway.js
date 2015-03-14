var HEIGHT = 800, WIDTH = 800;
var NUMCELLSVERT = 80;
var NUMCELLSHORZ = Math.floor(NUMCELLSVERT/HEIGHT*WIDTH); 
var CELLSIZE = Math.floor(HEIGHT/NUMCELLSVERT);
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
startPattern();

function run() {
  if (!isPaused) {
    step();
    setTimeout(run, TIMESTEP);
  }
}

function startPattern() {
  centerX = Math.floor((NUMCELLSHORZ-1)/2);
  centerY = Math.floor((NUMCELLSVERT-1)/2);
  cells[centerY][centerX] = 1;
  cells[centerY+1][centerX] = 1;
  cells[centerY][centerX-1] = 1;
  cells[centerY][centerX+1] = 1;
  cells[centerY-2][centerX-5] = 1;
  cells[centerY-2][centerX-6] = 1;
  cells[centerY-2][centerX-7] = 1;
  cells[centerY-3][centerX-5] = 1;
  cells[centerY-4][centerX-5] = 1;
  cells[centerY+2][centerX+5] = 1;
  cells[centerY+2][centerX+6] = 1;
  cells[centerY+2][centerX+7] = 1;
  cells[centerY+3][centerX+5] = 1;
  cells[centerY+4][centerX+5] = 1;

  drawAll();
}

function init() {
  for (var i = 0; i < NUMCELLSVERT; i++) {
    cells[i] = [];
    for (var j = 0; j < NUMCELLSHORZ; j++) {
      cells[i][j] = 0;
    }
  }
  drawAll();
}

function step() {
  cells = cells.map(function(row, i) {
    return row.map(function(cell, j) {
      var numNeigh = countNeighbors(i, j);
      if (cell) return (2 <= numNeigh && numNeigh <= 3)? 1 : 0;
      else return (numNeigh === 3)? 1 : 0;
    });
  });
  drawAll();
}

function drawAll() {
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  canvasContext.beginPath();
  cells.forEach(function(row, i) {
    row.forEach(function(cell, j) {
      if (cell) {
        canvasContext.rect(j*CELLSIZE, i*CELLSIZE, CELLSIZE, CELLSIZE);
        canvasContext.fill();
      }
    });
  });
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
  drawAll();
}
