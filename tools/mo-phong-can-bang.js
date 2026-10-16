// Bộ mô phỏng cân bằng: node bal2.js <game.js> [mode] [N]
// mode: all | base | sens | tiers | pos | camp
const fs=require('fs');
const file=process.argv[2],MODE=process.argv[3]||'all',N=+process.argv[4]||1500;
const full=fs.readFileSync(file,'utf8');
const grab=n=>{const i=full.indexOf('function '+n+'(');return full.slice(i,full.indexOf('\n',i))};
const cut=(a,b)=>{const i=full.indexOf(a);return full.slice(i,full.indexOf(b,i))};
let src=full.split('/* ================== CAMERA')[0]+'\n'+grab('tickMinutes')+'\n'+grab('goalMor')+'\n'+cut('const CAMPAIGN=[','const reward=')+'\n'+cut('function npcTeam(','\n/* ---------- Nhiệm vụ')+'\n';
const stub={textContent:'',innerHTML:'',style:{},value:'',prepend(){},append(){},appendChild(){},addEventListener(){},querySelector(){return stub},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}},getContext(){return{}}};
global.window=global;global.document={getElementById:()=>stub,createElement:()=>stub,querySelector:()=>stub,addEventListener(){}};
global.scene=null;global.hidePop=()=>{};global.render=()=>{};global.renderSquad=()=>{};global.localStorage={getItem(){return null},setItem(){}};
eval(src+`
const STATS={};const TYPES=["drib","combo","solo","cross","corner","long","pen","fk"];
function wrap(name,type){const f=eval(name);return c=>{const r=f(c);const s=STATS[type]||(STATS[type]={n:0,g:0,shot:0});s.n++;if(r==="goal")s.g++;return r}}
sceneDribble=wrap("sceneDribble","drib");sceneCombo=wrap("sceneCombo","combo");sceneSolo=wrap("sceneSolo","solo");sceneLong=wrap("sceneLong","long");scenePen=wrap("scenePen","pen");
{const f=sceneCross;sceneCross=(c,corner)=>{const t=corner?"corner":"cross";const r=f(c,corner);const s=STATS[t]||(STATS[t]={n:0,g:0});s.n++;if(r==="goal")s.g++;return r}}
{const f=sceneFK;sceneFK=(c,pos)=>{const r=f(c,pos);const s=STATS.fk||(STATS.fk={n:0,g:0});s.n++;if(r==="goal")s.g++;return r}}
const F=["TM","HVC","HV","HV","HVC","TVC","TV","TV","TVC","TĐ","TĐ"];
let uid=0;
function team(tier,kt,o={}){const tag="p"+(uid++)+"_";const FF=o.form?FORMS[o.form].map(x=>x[0]):F;const players=FF.map((pos,i)=>{const t=Array.isArray(tier)?tier[i]:tier;const p=mk(tag+i,pos,t,"P",0);p.kt=Array.isArray(kt)?kt[i]:kt;
  for(const [k] of ATTR)p.base[k]=maxOf(p,k)*(o.fill??1);
  if(o.star){const keys=Object.entries(OVR[pos]).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);for(let s=0;s<o.star;s++)for(const k of keys)p.starB[k]=r1((p.starB[k]||0)+p.pot[k]*STAR_GAIN*(0.5+0.5*p.tn/100))}
  if(o.boost){for(const [k,m] of Object.entries(o.boost))p.base[k]*=m}
  if(o.boostPos&&o.boostPos[0]===pos){for(const [k] of ATTR)p.base[k]*=o.boostPos[1]}
  refresh(p);return p});
  const t={name:tag,color:"#e33",players,subs:[],tac:{form:o.form||"442A",atk:o.atk||"Chuyền ngắn",atkLv:1,def:o.def||"Khu vực",defLv:1}};
  applyLineup(t);return t}
let goalsTot=0,shotsTot=0;
function play(h,a){T={club:{},home:h,away:a};M={min:0,score:[0,0],log:[],shots:[0,0],queue:null,inv:new Set()};
  h.players.concat(a.players).forEach(p=>{p.sta=100});initMor();
  while(M.min<90){tickMinutes(M.queue?1:GAP());if(M.min>=90)break;const s=buildScene();s.actors.forEach(x=>x.p.sta-=1.5);if(s.res==="goal"){M.score[s.side]++;goalMor(s.side,s.scorer)}}
  shotsTot+=M.shots[0]+M.shots[1];return M.score}
function run(mkA,mkB,n=N){let w=0,d=0,g=0;for(let i=0;i<n;i++){const sw=i%2;const A=mkA(),B=mkB();const sc=sw?play(B,A):play(A,B);const ga=sw?sc[1]:sc[0],gb=sw?sc[0]:sc[1];g+=ga+gb;if(ga>gb)w++;else if(ga===gb)d++}
  return{w:w/n,d:d/n,l:(n-w-d)/n,g:g/n,edge:(w-(n-w-d))/n}}
const pct=x=>(x*100).toFixed(0).padStart(3)+"%";
const line=(lab,r)=>console.log(lab.padEnd(42),"thắng",pct(r.w),"hòa",pct(r.d),"thua",pct(r.l),"| bàn",r.g.toFixed(2));
const ovT=t=>(t.players.reduce((s,p)=>s+overall(p),0)/11).toFixed(0);
const want=m=>MODE==="all"||MODE===m;
if(want("base")){for(const k in STATS)delete STATS[k];shotsTot=0;
  const r=run(()=>team(3,100),()=>team(3,100),N*2);line("Gương Tím full",r);
  const tot=Object.values(STATS).reduce((s,x)=>s+x.n,0),gt=Object.values(STATS).reduce((s,x)=>s+x.g,0);
  console.log("  pha/trận",(tot/(N*2)).toFixed(1),"sút/trận",(shotsTot/(N*2)).toFixed(1));
  for(const t of TYPES)if(STATS[t])console.log("  ",t.padEnd(7),"tỉ trọng",pct(STATS[t].n/tot),"bàn/pha",pct(STATS[t].g/STATS[t].n),"phần bàn",pct(STATS[t].g/gt));
  line("Gương Trắng kt30 (đầu game)",run(()=>team(0,30,{fill:.88}),()=>team(0,30,{fill:.88})));
  line("Gương Vàng full",run(()=>team(4,100),()=>team(4,100)));}
if(want("tiers")){
  line("Vàng vs Tím (hơn 1 bậc)",run(()=>team(4,100),()=>team(3,100)));
  line("Tím vs Xanh lam (hơn 1 bậc)",run(()=>team(3,100),()=>team(2,100)));
  line("Đỏ vs Vàng (hơn 1 bậc)",run(()=>team(5,100),()=>team(4,100)));
  line("Vàng vs Xanh lam (hơn 2 bậc)",run(()=>team(4,100),()=>team(2,100)));
  line("Tím kt100 vs Tím kt70",run(()=>team(3,100),()=>team(3,70)));
  line("Tím 10 sao vs 0 sao",run(()=>team(3,100,{star:10}),()=>team(3,100)));
  line("Tím chỉ số +10% vs thường",run(()=>team(3,100,{fill:1.1}),()=>team(3,100)));
  line("Xanh lam + 1 Đỏ TĐ vs Xanh lam",run(()=>team([2,2,2,2,2,2,2,2,2,5,2],100),()=>team(2,100)));
  line("Trắng + 1 Vàng TĐ vs Trắng (đầu game)",run(()=>team([0,0,0,0,0,0,0,0,0,4,0],40),()=>team(0,40)));
  console.log("thực lực: Trắng kt40",ovT(team(0,40)),"Xanh lam",ovT(team(2,100)),"Tím",ovT(team(3,100)),"Vàng",ovT(team(4,100)),"Đỏ",ovT(team(5,100)));}
if(want("sens")){console.log("Độ nhạy: cả đội +25% một chỉ số, Tím full (edge = thắng - thua)");const res=[];
  for(const [k,l] of ATTR.filter(([k])=>!process.env.ONLY||process.env.ONLY.split(",").includes(k))){const r=run(()=>team(3,100,{boost:{[k]:1.25}}),()=>team(3,100));res.push([l,r.edge,r.g])}
  res.sort((a,b)=>b[1]-a[1]);for(const [l,e,g] of res)console.log("  ",l.padEnd(10),(e*100>=0?"+":"")+(e*100).toFixed(1)+"%", "█".repeat(Math.max(0,Math.round(e*100))));}
if(want("pos")){console.log("Độ quan trọng vị trí: cả tuyến +20% mọi chỉ số");
  for(const p of ["TM","HV","HVC","TV","TVC","TĐ"]){const r=run(()=>team(3,100,{boostPos:[p,1.2]}),()=>team(3,100));console.log("  ",p.padEnd(4),(r.edge*100).toFixed(1)+"%")}}
if(want("camp")){console.log("Đội khởi đầu (chưa luyện / luyện đầy) vs từng phụ bản");
  const home=(full)=>{const t=freshT().home;t.players.forEach(p=>{if(full)for(const [k] of ATTR)p.base[k]=maxOf(p,k);refresh(p)});return t};
  console.log("  thực lực đội nhà:",ovT(home(false)),"→ luyện đầy",ovT(home(true)));
  for(let i=0;i<10;i++){const a=run(()=>home(false),()=>npcTeam(i),N),b=run(()=>home(true),()=>npcTeam(i),N);
    console.log("  PB"+(i+1),CAMPAIGN[i].n.padEnd(20),"thực lực",ovT(npcTeam(i)).padStart(4),"| mới:",pct(a.w),"thắng | luyện đầy:",pct(b.w),"thắng")}}
if(want("tac")){console.log("Chiến thuật / thế trận (vs 442 Chuyền ngắn Khu vực)");
  for(const f of Object.keys(FORMS))line("  thế trận "+f,run(()=>team(3,100,{form:f}),()=>team(3,100)));
  for(const a of Object.keys(ATK_TAC))line("  tấn công "+a,run(()=>team(3,100,{atk:a}),()=>team(3,100)));
  for(const d of Object.keys(DEF_TAC))line("  phòng ngự "+d,run(()=>team(3,100,{def:d}),()=>team(3,100)));}
`);
