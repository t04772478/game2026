/************ CONFIG ************/
const COLS = 4;
const ROWS = 5;
const START_ENERGY = 50;

/************ STATE ************/
let grid = [];
let selected = null;
let score = 0;

let energy = START_ENERGY;
let maxEnergy = START_ENERGY;

let x2Uses = 3;
let lastX2Reset = Date.now();

/************ DOM ************/
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");
const x2LeftEl = document.getElementById("x2Left");

/************ INIT ************/
initGame();
setInterval(energyTick, 60 * 1000);

/************ GAME ************/
function initGame() {
  grid = Array(COLS * ROWS).fill(0);
  spawn2();
  spawn2();
  render();
}

function spawn2() {
  const empty = getEmpty();
  if (!empty.length) return;
  grid[empty[Math.floor(Math.random() * empty.length)]] = 2;
}

function spawnAfterMerge() {
  const empty = getEmpty().length;
  if (empty >= 2) spawn2(), spawn2();
  else if (empty === 1) spawn2();
}

function getEmpty() {
  return grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
}

/************ CLICK ************/
function clickCell(i) {
  if (energy <= 0) return;

  if (grid[i] === 0) return;

  if (selected === null) {
    selected = i;
  } else if (selected === i) {
    selected = null;
  } else {
    if (grid[selected] === grid[i]) {
      grid[i] *= 2;
      grid[selected] = 0;
      score += grid[i];
      energy--;
      handleScoreBonus();
      spawnAfterMerge();
    }
    selected = null;
  }
  render();
}

/************ ENERGY ************/
function energyTick() {
  if (energy < maxEnergy) energy++;
  if (Date.now() - lastX2Reset > 24 * 60 * 60 * 1000) {
    x2Uses = 3;
    lastX2Reset = Date.now();
  }
  render();
}

function handleScoreBonus() {
  const level = Math.floor(score / 1000);
  const newMax = START_ENERGY + level * 10;
  if (newMax > maxEnergy) {
    maxEnergy = newMax;
    energy += 10;
  }
}

/************ BUTTONS ************/
document.getElementById("energyPlus").onclick = () =>
  fakeAd(() => { energy += 20; if (energy > maxEnergy) energy = maxEnergy; render(); });

document.getElementById("freeBtn").onclick = () =>
  fakeAd(() => alert("Bo‘shatmoqchi bo‘lgan katakni bosing")) &&
  (board.onclick = e => {
    const i = e.target.dataset.i;
    if (i !== undefined) {
      grid[i] = 0;
      board.onclick = null;
      render();
    }
  });

document.getElementById("x2Btn").onclick = () => {
  if (x2Uses <= 0 || selected === null) return;
  grid[selected] *= 2;
  x2Uses--;
  selected = null;
  render();
};

document.getElementById("donateBtn").onclick = () =>
  fakeAd(() => fakeAd(() => fakeAd(() => {
    energy += 100;
    maxEnergy += 100;
    x2Uses++;
    grid = grid.map(v => v === 16 ? 32 : v);
    render();
  })));

/************ HELP ************/
document.getElementById("helpBtn").onclick =
  () => document.getElementById("helpOverlay").style.display = "block";

function closeHelp() {
  document.getElementById("helpOverlay").style.display = "none";
}

/************ RENDER ************/
function render() {
  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  grid.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.i = i;

    if (v > 0) {
      cell.textContent = v;
      cell.style.fontSize = Math.max(14, 48 - String(v).length * 6) + "px";
    }

    if (i === selected) cell.classList.add("selected");

    cell.onclick = () => clickCell(i);
    board.appendChild(cell);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
  x2LeftEl.textContent = x2Uses;
}

/************ FAKE AD ************/
function fakeAd(cb) {
  setTimeout(cb, 5000);
  return true;
}
