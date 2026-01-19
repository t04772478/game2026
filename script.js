/********************
  GLOBAL STATE
*********************/
const GRID_SIZE = 4;
let grid = [];
let score = 0;

let energy = 50;
let maxEnergy = 50;

let x2Uses = 3;
let lastEnergyTick = Date.now();
let lastX2Reset = Date.now();

/********************
  INIT
*********************/
function initGame() {
  grid = Array(GRID_SIZE * GRID_SIZE).fill(0);
  score = 0;
  spawnInitial();
  updateUI();
  startEnergyTimer();
}

/********************
  SPAWN LOGIC
*********************/
function spawnInitial() {
  spawnNumber(2);
  spawnNumber(2);
}

function spawnAfterMerge() {
  const empty = getEmptyCells();
  if (empty.length === 0) return;

  spawnNumber(2);
  if (empty.length > 1) spawnNumber(2);
}

function spawnNumber(value) {
  const empty = getEmptyCells();
  if (!empty.length) return;
  const index = empty[Math.floor(Math.random() * empty.length)];
  grid[index] = value;
}

/********************
  MERGE LOGIC (CLICK BASED)
*********************/
let selectedCell = null;

function selectCell(index) {
  if (grid[index] === 0) return;

  if (selectedCell === null) {
    selectedCell = index;
    highlight(index);
  } else {
    if (grid[selectedCell] === grid[index]) {
      grid[index] *= 2;
      score += grid[index];
      grid[selectedCell] = 0;
      selectedCell = null;
      spawnAfterMerge();
      energy--;
    } else {
      selectedCell = index;
    }
    updateUI();
  }
}

/********************
  ENERGY SYSTEM
*********************/
function startEnergyTimer() {
  setInterval(() => {
    if (energy < maxEnergy) energy++;
    updateUI();
  }, 30 * 60 * 1000);
}

function addEnergy(amount) {
  energy = Math.min(energy + amount, maxEnergy);
}

/********************
  SCORE BONUS
*********************/
function checkScoreBonus() {
  const bonus = Math.floor(score / 1000);
  maxEnergy = 50 + bonus * 10;
}

/********************
  BO‘SH JOY (AD)
*********************/
function freeCellWithAd(index) {
  playAd(() => {
    grid[index] = 0;
    updateUI();
  });
}

/********************
  X2 LOGIC
*********************/
function useX2(index) {
  if (x2Uses <= 0) return;
  grid[index] *= 2;
  x2Uses--;
  updateUI();
}

/********************
  DONATE
*********************/
function donate() {
  playAd(() => {
    playAd(() => {
      playAd(() => {
        energy += 100;
        maxEnergy += 100;
        x2Uses += 1;
        grid = grid.map(v => v === 16 ? 32 : v);
        updateUI();
      });
    });
  });
}

/********************
  UI HELPERS
*********************/
function getEmptyCells() {
  return grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
}

function updateUI() {
  renderGrid();
  document.getElementById("score").innerText = score;
  document.getElementById("energy").innerText = energy;
}

function renderGrid() {
  grid.forEach((v, i) => {
    const cell = document.querySelector(`[data-index="${i}"]`);
    cell.innerText = v || "";
    cell.style.fontSize = v ? Math.max(14, 48 - String(v).length * 6) + "px" : "0";
  });
}

/********************
  FAKE AD
*********************/
function playAd(cb) {
  setTimeout(cb, 5000);
}

/********************
  START
*********************/
initGame();
