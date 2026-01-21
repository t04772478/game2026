/***********************
 * 2026 – FINAL LOGIC (STABLE)
 ***********************/

/* =====================
   CONFIG
===================== */
const ENERGY_MAX = 50;
const ENERGY_PER_MINUTE = 2;

const SIZE = 4;
const TOTAL = SIZE * SIZE;

/* =====================
   GAME STATE
===================== */
let grid = [];
let score = 0;
let energy = ENERGY_MAX;
let selectedIndex = null;
let gameOver = false;

/* =====================
   X2 LIMIT (24 soat)
===================== */
let x2Used = JSON.parse(localStorage.getItem("x2Used")) || 0;
let x2ResetTime = JSON.parse(localStorage.getItem("x2Reset")) || Date.now();

/* =====================
   REPLACE MODE
===================== */
let replaceMode = false;

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {
  grid = Array(TOTAL).fill(0);

  const hasSave = loadGame();

  // 👇 MUHIM TEKSHIRUV
  const hasAnyNumber = grid.some(v => v > 0);

  if (!hasSave || !hasAnyNumber) {
    startNewGame();
  }

  updateEnergyByTime();
  render();
});


/* Har 1 daqiqada energiya tekshiradi (sahifa ochiq bo‘lsa ham) */
setInterval(() => {
  updateEnergyByTime();
  render();
}, 60000);

/* =====================
   NEW GAME
===================== */
function startNewGame() {
  grid = Array(TOTAL).fill(0);
  score = 0;
  energy = ENERGY_MAX;
  gameOver = false;
  spawnTwos(2);
  saveGame();
}

/* =====================
   SPAWN
===================== */
function spawnTwos(count) {
  const empty = grid
    .map((v, i) => (v === 0 ? i : null))
    .filter(v => v !== null);

  for (let i = 0; i < Math.min(count, empty.length); i++) {
    const index = empty.splice(
      Math.floor(Math.random() * empty.length), 1
    )[0];
    grid[index] = 2;
  }
}

/* =====================
   CELL CLICK
===================== */
function onCellClick(index) {
  if (gameOver) return;

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

/* =====================
   MERGE
===================== */
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
    alert("Energiya tugadi ⚡\nReklama ko‘ring yoki kuting");
  }

  selectedIndex = null;

  const emptyCount = grid.filter(v => v === 0).length;
  if (emptyCount >= 2) spawnTwos(2);
  else if (emptyCount === 1) spawnTwos(1);

  render();
}

/* =====================
   REPLACE (AD)
===================== */
function useReplace() {
  fakeAd(() => {
    replaceMode = true;
    alert("Katakni tanlang");
  });
}

function showReplaceOptions(index) {
  const choices = [2, 4, 8, 16, 32, 64];
  const num = Number(prompt("Son tanlang:\n" + choices.join(", ")));

  if (choices.includes(num)) {
    grid[index] = num;
  }

  replaceMode = false;
  saveGame();
  render();
}

/* =====================
   X2 (AD, 3 marta / 24 soat)
===================== */
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
    saveGame();
    render();
  });
}

function resetX2IfNeeded() {
  if (Date.now() - x2ResetTime > 24 * 60 * 60 * 1000) {
    x2Used = 0;
    x2ResetTime = Date.now();
  }
}

/* =====================
   DONATE (3 ta uzun reklama)
===================== */
function donate() {
  fakeAd(() => {
    fakeAd(() => {
      fakeAd(() => {
        energy += 100;
        if (energy > ENERGY_MAX) energy = ENERGY_MAX;
        x2Used = Math.max(x2Used - 1, 0);
        alert("Rahmat ❤️\n+100 energiya\n+1 x2");
        saveGame();
        render();
      });
    });
  });
}

/* =====================
   ENERGY BY AD
===================== */
function addEnergyByAd() {
  fakeAd(() => {
    energy += 20;
    if (energy > ENERGY_MAX) energy = ENERGY_MAX;
    gameOver = false;
    saveGame();
    render();
  });
}

/* =====================
   FAKE AD
   ⚠️ KEYIN SHU YERGA
   YANDEX / ADMOB / TELEGRAM
   REKLAMA ID QO‘SHILADI
===================== */
function fakeAd(cb) {
  /*
   BU YERGA:
   - Yandex Ads blockId
   - AdMob rewarded ad
   - Telegram Ads
   integratsiya qilinadi
  */
  setTimeout(cb, 1200);
}

/* =====================
   RENDER
===================== */
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
}

/* =====================
   SAVE / LOAD
===================== */
function saveGame() {
  localStorage.setItem(
    "game2026",
    JSON.stringify({ grid, score, energy })
  );
}

function loadGame() {
  const saved = localStorage.getItem("game2026");
  if (!saved) return false;

  try {
    const data = JSON.parse(saved);
    grid = data.grid || grid;
    score = data.score || 0;
    energy = data.energy ?? ENERGY_MAX;
    return true;
  } catch {
    return false;
  }
}

/* =====================
   ENERGY BY TIME
===================== */
function updateEnergyByTime() {
  const lastTime = Number(localStorage.getItem("energyTime"));
  const now = Date.now();

  if (!lastTime) {
    localStorage.setItem("energyTime", now);
    return;
  }

  const minutes = Math.floor((now - lastTime) / 60000);
  if (minutes <= 0) return;

  energy = Math.min(
    ENERGY_MAX,
    energy + minutes * ENERGY_PER_MINUTE
  );

  localStorage.setItem(
    "energyTime",
    lastTime + minutes * 60000
  );

  saveGame();
}
