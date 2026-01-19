/***********************
 * 2026 – SMART MERGE
 * Full Stable Logic
 ***********************/

const SIZE = 4;
const TOTAL = SIZE * SIZE;

let grid = [];
let score = 0;
let energy = 50;

let selectedIndex = null;

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {
  grid = Array(TOTAL).fill(0);
  startGame();
});

/* =======================
   GAME START
======================= */
function startGame() {
  grid.fill(0);
  score = 0;
  energy = 50;
  selectedIndex = null;

  spawnTwo();
  spawnTwo();

  render();
}

/* =======================
   SPAWN ONLY 2
======================= */
function spawnTwo() {
  const empty = [];

  for (let i = 0; i < TOTAL; i++) {
    if (grid[i] === 0) empty.push(i);
  }

  if (empty.length === 0) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  grid[index] = 2;
}

/* =======================
   CLICK HANDLER
======================= */
function onCellClick(index) {
  if (grid[index] === 0) return;

  // First select
  if (selectedIndex === null) {
    selectedIndex = index;
    render();
    return;
  }

  // Same cell → cancel
  if (selectedIndex === index) {
    selectedIndex = null;
    render();
    return;
  }

  // Try merge
  tryMerge(selectedIndex, index);
}

/* =======================
   MERGE LOGIC
======================= */
function tryMerge(from, to) {
  if (grid[from] !== grid[to]) {
    selectedIndex = null;
    render();
    return;
  }

  const newValue = grid[to] * 2;

  grid[to] = newValue;
  grid[from] = 0;

  score += newValue;
  energy = Math.max(energy - 1, 0);

  selectedIndex = null;

  spawnTwo();
  render();
}

/* =======================
   EMPTY CELL BUTTON
======================= */
function useEmptyCell() {
  if (energy < 5) {
    alert("Reklama ko‘rib energiya oling");
    return;
  }

  const filled = grid
    .map((v, i) => v !== 0 ? i : null)
    .filter(v => v !== null);

  if (filled.length === 0) return;

  const index = filled[Math.floor(Math.random() * filled.length)];
  grid[index] = 0;
  energy -= 5;

  spawnTwo();
  render();
}

/* =======================
   X2 BUTTON
======================= */
function useX2() {
  if (energy < 10 || selectedIndex === null) {
    alert("Avval katak tanlang");
    return;
  }

  grid[selectedIndex] *= 2;
  energy -= 10;

  selectedIndex = null;
  render();
}

/* =======================
   DONATE (PLACEHOLDER)
======================= */
function donate() {
  alert("Reklama → Donat (keyin ulanadi)");
}

/* =======================
   RENDER
======================= */
function render() {
  const board = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const energyEl = document.getElementById("energy");

  board.innerHTML = "";

  grid.forEach((value, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add("v" + value);
    }

    if (i === selectedIndex) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () => onCellClick(i));
    board.appendChild(cell);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
}
