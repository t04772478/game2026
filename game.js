const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");

let grid = Array(16).fill(0);
let score = 0;
let energy = 20;
let selected = null;

/* INIT */
function init(){
  grid.fill(0);
  score = 0;
  energy = 20;
  add(2);
  render();
}

/* ADD NUMBERS (NEVER STUCK) */
function add(n){
  for(let i=0;i<n;i++){
    let empty = grid.map((v,i)=>v===0?i:null).filter(v=>v!==null);
    if(!empty.length){
      // majburan bo‘shatamiz
      grid[Math.floor(Math.random()*16)] = 0;
      empty = grid.map((v,i)=>v===0?i:null).filter(v=>v!==null);
    }
    const idx = empty[Math.floor(Math.random()*empty.length)];
    grid[idx] = Math.random()<0.75?2:4;
  }
}

/* RENDER */
function render(){
  gridEl.innerHTML="";
  grid.forEach((v,i)=>{
    const c=document.createElement("div");
    c.className="cell";
    if(v){
      c.textContent=v;
      c.setAttribute("v",v);
      c.onclick=()=>select(i);
    }
    if(i===selected) c.classList.add("active");
    gridEl.appendChild(c);
  });
  scoreEl.textContent=score;
  energyEl.textContent=energy;
}

/* SMART MERGE */
function select(i){
  if(energy<=0) return;

  if(selected===null){
    selected=i;
  }else{
    if(grid[selected]===grid[i] && selected!==i){
      grid[i]*=2;
      score+=grid[i];
      grid[selected]=0;
      energy-=2;
      add(2);
    }
    selected=null;
  }
  render();
}

/* MENU ACTIONS */
document.getElementById("clear").onclick=()=>{
  if(energy>=3){
    grid[Math.floor(Math.random()*16)]=0;
    energy-=3;
    render();
  }
};

document.getElementById("boost").onclick=()=>{
  if(selected!==null && energy>=3){
    grid[selected]*=2;
    score+=grid[selected];
    energy-=3;
    add(1);
    selected=null;
    render();
  }
};

init();
