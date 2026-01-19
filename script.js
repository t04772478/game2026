/*************************************************
 * 2026 – FINAL STABLE GAME LOGIC
 * Only JS – design untouched
 *************************************************/

const SIZE = 4;
const TOTAL = SIZE * SIZE;

/* ===== STATE ===== */
let grid = Array(TOTAL).fill(0);
let selected = null;

let score = 0;
let energy = 50;
let maxEnergy = 50;

let lastEnergyTick = Date.now();
let x2Uses = 3;
let lastX2Reset = Date.now();

/* ===== DOM ===== */
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");

const freeBtn = document.getElementById("freeBtn");
const x2Btn = document.getElementById("x2Btn");
const donateBtn = document.getElementById("donateBtn");
const energyPlus = document.getElementById("energyPlus");

const helpBtn = document.getElementById("helpBtn");
const helpOverlay = document.getElementById("helpOverlay");

/* ===== INIT ===== */
init();
setInterval(tickEnergy, 1000 * 60); // har 1 daqiqa tekshir

/* ===== FUNCTIONS ===== */

function init() {
  grid.fill(0);
  score = 0;
  energy = 50;
  maxEnergy = 50;
  selected = null;
  x2Uses = 3;
  lastX2Reset = Date.now();

  spawn2();
  spawn2();

  render();
}

/* ===== GRID ===== */

function spawn2() {
  const empty = getEmpty();
  if (!empty.length) return;
  const i = empty[Math.floor(Math.random() * empty.length)];
  grid[i] = 2;
}

function spawnAfterMerge() {
  const emptyCount = getEmpty().length;
  if (emptyCount >= 2) {
    spawn2();
    spawn2();
  } else if (emptyCount === 1) {
    spawn2();
  }
}

function getEmpty() {
  return grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
}

/* ===== CLICK ===== */

function onCellClick(i) {
  if (grid[i] === 0) return;

  if (energy <= 0) {
    alert("⚡ Energiya tugadi");
    return;
  }

  if (selected === null) {
    selected = i;
    render();
    return;
  }

  if (selected === i) {
    selected = null;
    render();
    return;
  }

  if (grid[selected] === grid[i]) {
    grid[i] *= 2;
    grid[selected] = 0;

    score += grid[i];
    energy--;

    handleScoreBonus();
    spawnAfterMerge();
  }

  selected = null;
  render();
}

/* ===== SCORE → ENERGY ===== */

function handleScoreBonus() {
  const level = Math.floor(score / 1000);
  const newMax = 50 + level * 10;

  if (newMax > maxEnergy) {
    maxEnergy = newMax;
    energy += 10;
  }
}

/* ===== ENERGY TIMER ===== */

function tickEnergy() {
  if (energy < maxEnergy) {
    energy++;
    render();
  }

  if (Date.now() - lastX2Reset >= 24 * 60 * 60 * 1000) {
    x2Uses = 3;
    lastX2Reset = Date.now();
  }
}

/* ===== BUTTONS ===== */

/* + ENERGY (AD) */
energyPlus.onclick = () => {
  fakeAd(5, () => {
    energy = Math.min(energy + 20, maxEnergy);
    render();
  });
};

/* BO‘SH JOY (AD) */
freeBtn.onclick = () => {
  fakeAd(5, () => {
    alert("Bo‘shatmoqchi bo‘lgan katakni tanlang");
    board.classList.add("select-mode");

    board.onclick = e => {
      const idx = e.target.dataset.i;
      if (idx !== undefined) {
        grid[idx] = 0;
        board.onclick = null;
        board.classList.remove("select-mode");
        render();
      }
    };
  });
};

/* X2 */
x2Btn.onclick = () => {
  if (x2Uses <= 0) {
    alert("x2 limit tugadi");
    return;
  }
  if (selected === null) {
    alert("Katak tanlang");
    return;
  }
  grid[selected] *= 2;
  x2Uses--;
  selected = null;
  render();
};

/* DONATE */
donateBtn.onclick = () => {
  fakeAd(5, () => {
    fakeAd(5, () => {
      fakeAd(5, () => {
        energy += 100;
        maxEnergy += 100;
        x2Uses++;

        grid = grid.map(v => v === 16 ? 32 : v);
        render();
      });
    });
  });
};

/* ===== HELP ===== */

helpBtn.onclick = () => {
  helpOverlay.style.display = "block";
};

function closeHelp() {
  helpOverlay.style.display = "none";
}

/* ===== RENDER ===== */

function render() {
  board.innerHTML = "";

  grid.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.i = i;

    if (v > 0) {
      cell.textContent = v;
      cell.style.fontSize = Math.max(12, 42 - String(v).length * 6) + "px";
    }

    if (i === selected) cell.classList.add("selected");

    cell.onclick = () => onCellClick(i);
    board.appendChild(cell);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
}

/* ===== FAKE AD ===== */

function fakeAd(seconds, cb) {
  alert(`Reklama ${seconds} soniya`);
  setTimeout(cb, seconds * 1000);
}
