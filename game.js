const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");

let grid = Array(16).fill(0);
let score = 0;
let energy = 20;

let selectedIndex = null;

/* INIT */
function init(){
  grid = Array(16).fill(0);
  score = 0;
  energy = 20;
  addNumbers(2);
  render();
}

/* ADD NUMBERS */
function addNumbers(n){
  for(let i=0;i<n;i++){
    const empty = grid.map((v,i)=>v===0?i:null).filter(v=>v!==null);
    if(!empty.length) return;
    const idx = empty[Math.floor(Math.random()*empty.length)];
    grid[idx] = Math.random()<0.8 ? 2 : 4;
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
      c.onclick=()=>smartSelect(i);
    }
    if(i===selectedIndex) c.classList.add("active");
    gridEl.appendChild(c);
  });
  scoreEl.textContent=score;
  energyEl.textContent=energy;
}

/* SMART MERGE */
function smartSelect(i){
  if(energy<=0) return;

  if(selectedIndex===null){
    selectedIndex=i;
  }else{
    if(grid[selectedIndex]===grid[i] && selectedIndex!==i){
      grid[i]*=2;
      score+=grid[i];
      grid[selectedIndex]=0;
      energy-=3;
      addNumbers(1);
    }
    selectedIndex=null;
  }
  render();
}

/* SWIPE MOVE */
function slide(row){
  row=row.filter(v=>v);
  for(let i=0;i<row.length-1;i++){
    if(row[i]===row[i+1] && row[i]<1024){
      row[i]*=2;
      score+=row[i];
      energy+=2;
      row[i+1]=0;
    }
  }
  return row.filter(v=>v);
}

function move(dir){
  if(energy<=0) return;
  energy--;

  let old=grid.join();
  for(let i=0;i<4;i++){
    let row=[];
    for(let j=0;j<4;j++){
      let idx=
        dir==="l"?i*4+j:
        dir==="r"?i*4+3-j:
        dir==="u"?j*4+i:
                  (3-j)*4+i;
      row.push(grid[idx]);
    }
    row=slide(row);
    while(row.length<4) row.push(0);
    for(let j=0;j<4;j++){
      let idx=
        dir==="l"?i*4+j:
        dir==="r"?i*4+3-j:
        dir==="u"?j*4+i:
                  (3-j)*4+i;
      grid[idx]=row[j];
    }
  }
  if(old!==grid.join()) addNumbers(2);
  render();
}

/* INPUTS */
window.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft")move("l");
  if(e.key==="ArrowRight")move("r");
  if(e.key==="ArrowUp")move("u");
  if(e.key==="ArrowDown")move("d");
});

let sx=0,sy=0;
document.addEventListener("mousedown",e=>{sx=e.clientX;sy=e.clientY});
document.addEventListener("mouseup",e=>{
  let dx=e.clientX-sx,dy=e.clientY-sy;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>30)move("r");if(dx<-30)move("l");
  }else{
    if(dy>30)move("d");if(dy<-30)move("u");
  }
});

document.addEventListener("touchstart",e=>{
  sx=e.touches[0].clientX;sy=e.touches[0].clientY;
});
document.addEventListener("touchend",e=>{
  let dx=e.changedTouches[0].clientX-sx;
  let dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>30)move("r");if(dx<-30)move("l");
  }else{
    if(dy>30)move("d");if(dy<-30)move("u");
  }
});

init();
