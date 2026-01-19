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
  spawn(2);
  render();
}

/* ALWAYS SPAWN 2 OR 4 */
function spawn(count){
  for(let i=0;i<count;i++){
    let empty = grid.map((v,i)=>v===0?i:null).filter(v=>v!==null);

    // agar bo‘sh joy yo‘q bo‘lsa – eng kichik sonni o‘chiramiz
    if(!empty.length){
      let min = Math.min(...grid.filter(v=>v>0));
      let idx = grid.indexOf(min);
      grid[idx] = 0;
      empty = [idx];
    }

    const pos = empty[Math.floor(Math.random()*empty.length)];
    grid[pos] = Math.random()<0.7 ? 2 : 4;
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
      c.onclick=()=>selectCell(i);
    }
    if(i===selected) c.classList.add("active");
    gridEl.appendChild(c);
  });
  scoreEl.textContent=score;
  energyEl.textContent=energy;
}

/* SMART MERGE (A VARIANT) */
function selectCell(i){
  if(energy<=0) return;

  if(selected===null){
    selected=i;
  }else{
    if(grid[selected]===grid[i] && selected!==i){
      grid[i]*=2;
      score+=grid[i];
      grid[selected]=0;
      energy-=2;

      // A VARIANT: har bir birlashuvdan keyin majburiy son
      spawn(1);
    }
    selected=null;
  }
  render();
}

/* MENU ACTIONS */
document.getElementById("clear").onclick=()=>{
  if(energy>=3){
    let idx=Math.floor(Math.random()*16);
    grid[idx]=0;
    energy-=3;
    spawn(1);
    render();
  }
};

document.getElementById("boost").onclick=()=>{
  if(selected!==null && energy>=3){
    grid[selected]*=2;
    score+=grid[selected];
    energy-=3;
    spawn(1);
    selected=null;
    render();
  }
};

init();
