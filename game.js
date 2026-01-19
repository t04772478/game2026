/* =========================
   2026 – SMART MERGE
   Author: Sen + ChatGPT
   ========================= */

/* --------- SOZLAMALAR --------- */
const SIZE = 4;
const MAX_ENERGY = 50;
const ENERGY_REWARD = 20;

/* --------- HOLAT --------- */
let grid = Array(16).fill(0);
let score = 0;
let energy = MAX_ENERGY;

let selectedIndex = null;

/* --------- DOM --------- */
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");

/* --------- BOSHLASH --------- */
init();

/* =========================
   ASOSIY FUNKSIYALAR
   ========================= */

function init() {
  grid.fill(0);
  score = 0;
  energy = MAX_ENERGY;
  selectedIndex = null;

  spawnTwo();
  spawnTwo();
  render();
}

/* --------- RENDER --------- */
function render() {
  board.innerHTML = "";

  grid.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add("v" + value);
    }

    if (index === selectedIndex) {
      cell.classList.add("selected");
    }

    cell.onclick = () => onCellClick(index);
    board.appendChild(cell);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
}

/* =========================
   O‘YIN MANTIQI
   ========================= */

function onCellClick(index) {
  if (grid[index] === 0) return;

  if (selectedIndex === null) {
    selectedIndex = index;
    render();
    return;
  }

  if (selectedIndex === index) {
    selectedIndex = null;
    render();
    return;
  }

  tryMerge(selectedIndex, index);
  selectedIndex = null;
  render();
}

/* --------- BIRLASHTIRISH --------- */
function tryMerge(from, to) {
  if (energy <= 0) return;

  if (grid[from] === grid[to]) {
    grid[to] *= 2;
    grid[from] = 0;

    score += grid[to];
    energy--;

    spawnTwo();
    ensurePlayable();
  }
}

/* =========================
   AVTO YORDAM
   ========================= */

/* Har doim bo‘sh joyga 2 chiqadi */
function spawnTwo() {
  const empty = grid
    .map((v, i) => (v === 0 ? i : null))
    .filter(v => v !== null);

  if (empty.length === 0) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  grid[index] = 2;
}

/* Agar merge bo‘lmasa — yana 2 qo‘shiladi */
function ensurePlayable() {
  if (!hasMerge()) {
    spawnTwo();
  }
}

/* Maydonda merge bormi */
function hasMerge() {
  const counts = {};
  grid.forEach(v => {
    if (v > 0) counts[v] = (counts[v] || 0) + 1;
  });

  return Object.values(counts).some(c => c >= 2);
}

/* =========================
   MENU TUGMALARI
   ========================= */

/* Bo‘sh joy ochish */
window.freeCell = function () {
  if (energy < 5) {
    watchAd(() => {
      energy += ENERGY_REWARD;
      render();
    });
    return;
  }

  const filled = grid
    .map((v, i) => (v !== 0 ? i : null))
    .filter(v => v !== null);

  if (filled.length === 0) return;

  const index = filled[Math.floor(Math.random() * filled.length)];
  grid[index] = 0;
  energy -= 5;
  spawnTwo();
  render();
};

/* X2 qilish */
window.doubleTile = function () {
  if (energy < 10) {
    watchAd(() => {
      energy += ENERGY_REWARD;
      render();
    });
    return;
  }

  if (selectedIndex === null) return;

  grid[selectedIndex] *= 2;
  score += grid[selectedIndex];
  energy -= 10;

  spawnTwo();
  ensurePlayable();
  render();
};

/* Donat */
window.donate = function () {
  watchLongAd(() => {
    energy += 50;
    render();
  });
};

/* =========================
   REKLAMA (SIMULYATSIYA)
   ========================= */

function watchAd(callback) {
  alert("5 soniyalik reklama...");
  setTimeout(callback, 5000);
}

function watchLongAd(callback) {
  alert("Uzun reklama / donat...");
  setTimeout(callback, 8000);
}
