/* Mô phỏng cân bằng: node tools/mo-phong-can-bang.js [GK_F] [số trận] [DUEL_G] [MOR_E] [POS_E]
   Ví dụ: node tools/mo-phong-can-bang.js 0.65 800 17 0.3 0.5 */
const fs=require('fs');const GKF=process.argv[2]||'1.0',N=+process.argv[3]||800;
const full=fs.readFileSync(require('path').join(__dirname,'../js/game.js'),'utf8');const grab=n=>{const i=full.indexOf('function '+n+'(');return full.slice(i,full.indexOf('\n',i))};
let src=(full.split('/* ================== CAMERA')[0]+'\n'+grab('tickMinutes')+'\n'+grab('goalMor')).replace('const GK_F=0.65, DUEL_G=17, MOR_E=0.3, POS_E=0.5;','const GK_F='+GKF+', DUEL_G='+(process.argv[4]||48)+', MOR_E='+(process.argv[5]||0.9)+', POS_E='+(process.argv[6]||1)+';');
const stub={textContent:'',innerHTML:'',style:{},prepend(){},classList:{add(){},remove(){}}};
global.document={getElementById:()=>stub,createElement:()=>stub};global.scene=null;global.hidePop=()=>{};global.render=()=>{};global.renderSquad=()=>{};
eval(src+`
const F=["TM","HVC","HV","HV","HVC","TVC","TV","TV","TVC","TĐ","TĐ"];
function team(tag,tier,kt,star=0,color="#e8372c"){return{name:tag,color,players:F.map((pos,i)=>{const t=Array.isArray(tier)?tier[i]:tier;const p=mk(tag+i,pos,t,"P",0);p.kt=kt;
  for(const [k] of ATTR)p.base[k]=maxOf(p,k);
  if(star){const keys=Object.entries(OVR[pos]).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);for(let s=0;s<star;s++)for(const k of keys)p.starB[k]=r1((p.starB[k]||0)+p.pot[k]*STAR_GAIN*(0.5+0.5*p.tn/100))}
  refresh(p);return p})}}
function play(h,a){T={club:{},home:h,away:a};M={min:0,score:[0,0],log:[],shots:[0,0],queue:null,inv:new Set()};
  h.players.concat(a.players).forEach(p=>{p.sta=100});initMor();
  while(M.min<90){tickMinutes(M.queue?1:4+Math.floor(Math.random()*7));if(M.min>=90)break;const s=buildScene();s.actors.forEach(x=>x.p.sta-=1.5);if(s.res==="goal"){M.score[s.side]++;goalMor(s.side,s.scorer)}}
  return M.score}
function run(label,mkA,mkB){let w=0,d=0,g=0;for(let i=0;i<N;i++){const sw=i%2;const A=mkA(),B=mkB();const sc=sw?play(B,A):play(A,B);const ga=sw?sc[1]:sc[0],gb=sw?sc[0]:sc[1];g+=ga+gb;if(ga>gb)w++;else if(ga===gb)d++}
  console.log(label.padEnd(44),'A thắng',(w/N*100).toFixed(0).padStart(3)+'%','hòa',(d/N*100).toFixed(0).padStart(3)+'%','thua',((N-w-d)/N*100).toFixed(0).padStart(3)+'%','| bàn/trận',(g/N).toFixed(2))}
const ovT=t=>(t.players.reduce((s,p)=>s+overall(p),0)/11).toFixed(0);
run("1 Tím full vs Tím full (gương)",()=>team("a",3,100),()=>team("b",3,100));
run("2 Trắng kt30 vs Trắng kt30 (đầu game)",()=>team("a",0,30),()=>team("b",0,30));
run("3 Vàng full vs Tím full (hơn 1 bậc)",()=>team("a",4,100),()=>team("b",3,100));
run("4 Đỏ full vs Vàng full (hơn 1 bậc)",()=>team("a",5,100),()=>team("b",4,100));
run("5 Vàng full vs Xanh lam full (hơn 2 bậc)",()=>team("a",4,100),()=>team("b",2,100));
run("6 Tím kt100 vs Tím kt70",()=>team("a",3,100),()=>team("b",3,70));
run("7 Tím kt100 vs Tím kt30",()=>team("a",3,100),()=>team("b",3,30));
run("8 Tím full 10 sao vs Tím full 0 sao",()=>team("a",3,100,10),()=>team("b",3,100,0));
run("9 Xanh lam full vs Tím kt60 (cày vs bậc)",()=>team("a",2,100),()=>team("b",3,60));
run("10 Xanh lam + 1 Đỏ (TĐ) vs Xanh lam",()=>team("a",[2,2,2,2,2,2,2,2,2,5,2],100),()=>team("b",2,100));
run("11 Vàng full vs Vàng full (giai đoạn cuối)",()=>team("a",4,100),()=>team("b",4,100));
console.log('thực lực TB: Tím full',ovT(team("x",3,100)),'Vàng full',ovT(team("x",4,100)),'Tím kt70',ovT(team("x",3,70)),'Trắng kt30',ovT(team("x",0,30)));
`);
