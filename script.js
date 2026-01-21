/***********************
 * 2026 – FINAL LOGIC
 ***********************/
const ENERGY_MAX = 50;
const ENERGY_PER_MINUTE = 2;

const SIZE = 4;
const TOTAL = SIZE * SIZE;

let grid = [];
let score = 0;
let energy = 50;
let selectedIndex = null;
let gameOver = false;

/* x2 limit */
let x2Used = JSON.parse(localStorage.getItem("x2Used")) || 0;
let x2ResetTime = JSON.parse(localStorage.getItem("x2Reset")) || Date.now();

/* replace mode */
let replaceMode = false;

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  grid = Array(TOTAL).fill(0);
  startGame();
  setInterval(autoEnergyRefill, 30 * 60 * 1000);
});
/* START GAME */
function startGame() {
  if (!loadGame()) {
    grid.fill(0);
    score = 0;
    energy = 50;
    spawnTwos(2);
  }
  selectedIndex = null;
  render();
}


/* SPAWN */
function spawnTwos(count) {
  const empty = grid
    .map((v, i) => v === 0 ? i : null)
    .filter(v => v !== null);

  const spawnCount = Math.min(count, empty.length);

  for (let i = 0; i < spawnCount; i++) {
    const index = empty.splice(
      Math.floor(Math.random() * empty.length), 1
    )[0];
    grid[index] = 2;
  }
}

/* CELL CLICK */
function onCellClick(index) {
  if (gameOver) return;

  /* REPLACE MODE */
  if (replaceMode) {
    showReplaceOptions(index);
    return;
  }

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
}

/* MERGE */
function tryMerge(a, b) {
  if (grid[a] !== grid[b]) {
    selectedIndex = null;
    render();
    return;
  }

  grid[b] *= 2;
  grid[a] = 0;

  score += grid[b];
  energy--;
localStorage.setItem("energyTime", Date.now());
saveGame();

  if (energy <= 0) {
    energy = 0;
    gameOver = true;
    alert("Energiya tugadi ⚡\n30 daqiqa kuting yoki + bosing");
  }

  selectedIndex = null;

  const emptyCount = grid.filter(v => v === 0).length;
  if (emptyCount >= 2) spawnTwos(2);
  else if (emptyCount === 1) spawnTwos(1);

  render();
}

/* 🔄 REPLACE */
function useReplace() {
  fakeAd(() => {
    replaceMode = true;
    alert("Katakni tanlang");
  });
}

function showReplaceOptions(index) {
  const choices = [2, 4, 8, 16, 32, 64];
  const pick = prompt("Son tanlang:\n" + choices.join(", "));
  const num = Number(pick);

  if (choices.includes(num)) {
    grid[index] = num;
  }

  replaceMode = false;
  render();
}

/* ✖️ X2 */
function useX2() {
  resetX2IfNeeded();

  if (x2Used >= 3) {
    alert("x2 limiti tugadi (24 soat)");
    return;
  }

  if (selectedIndex === null) {
    alert("Katak tanlang");
    return;
  }

  fakeAd(() => {
    grid[selectedIndex] *= 2;
    x2Used++;
    localStorage.setItem("x2Used", JSON.stringify(x2Used));
    localStorage.setItem("x2Reset", JSON.stringify(x2ResetTime));
    selectedIndex = null;
    render();
  });
}

function resetX2IfNeeded() {
  if (Date.now() - x2ResetTime > 24 * 60 * 60 * 1000) {
    x2Used = 0;
    x2ResetTime = Date.now();
  }
}

/* ❤️ DONATE */
function donate() {
  fakeAd(() => {
    fakeAd(() => {
      fakeAd(() => {
        energy += 100;
        x2Used = Math.max(x2Used - 1, 0);
        alert("Rahmat ❤️\n+100 energiya\n+1 x2");
        render();
      });
    });
  });
}

/* ⚡ ENERGY + */
function addEnergyByAd() {
  fakeAd(() => {
    energy += 20;
    gameOver = false;
    render();
  });
}

function autoEnergyRefill() {
  energy += 50;
  gameOver = false;
  render();
}

/* FAKE AD */
function fakeAd(cb) {
  setTimeout(cb, 1200);
}

/* RENDER */
function render() {
  const board = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const energyEl = document.getElementById("energy");

  board.innerHTML = "";

  grid.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (v > 0) {
      cell.textContent = v;
      cell.classList.add("v" + v);
    }

    if (i === selectedIndex) cell.classList.add("selected");

    cell.onclick = () => onCellClick(i);
    board.appendChild(cell);
  });
  

  scoreEl.textContent = score;
  energyEl.textContent = energy;
saveGame();
}


  /***********************
 * SAVE / LOAD GAME
 ***********************/
function saveGame() {
  const data = {
    grid,
    score,
    energy
  };
  localStorage.setItem("game2026", JSON.stringify(data));
}

function loadGame() {
  const saved = localStorage.getItem("game2026");
  if (!saved) return false;

  try {
    const data = JSON.parse(saved);
    grid = data.grid || grid;
    score = data.score || 0;
    energy = data.energy ?? 50;
    updateEnergyByTime();
    return true;
  } catch {
    return false;
  }
}
function updateEnergyByTime() {
  const lastTime = localStorage.getItem("energyTime");
  if (!lastTime) {
    localStorage.setItem("energyTime", Date.now());
    return;
  }

  const now = Date.now();
  const diffMs = now - Number(lastTime);
  const minutesPassed = Math.floor(diffMs / 60000);

  if (minutesPassed > 0) {
    energy += minutesPassed * ENERGY_PER_MINUTE;
    if (energy > ENERGY_MAX) energy = ENERGY_MAX;

    // yangi vaqtni saqlaymiz
    localStorage.setItem("energyTime", now);
    saveGame();
  }
}
