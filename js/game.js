/* ================== BỘ CHỈ SỐ (giống thẻ cầu thủ gốc) ================== */
const ATTR=[
 ["toc","Tốc độ","Tốc độ chạy trên sân, đi bóng qua người, đuổi theo đối thủ"],
 ["bat","Sức bật","Tranh chấp bóng bổng, đánh đầu, thủ môn băng ra bắt bóng"],
 ["the","Thể lực","Sức mạnh tì đè khi tắc bóng và giữ bóng"],
 ["ben","S.Bền","Độ giảm thể lực mỗi phút (cao thì mệt chậm)"],
 ["sut","Sút","Dứt điểm trong vòng cấm"],
 ["re","Rê dắt","Đi bóng qua người"],
 ["chuyen","Chuyền","Chuyền ngắn phối hợp, kiểm soát tuyến giữa"],
 ["dau","Đ.Đầu","Độ chính xác cú đánh đầu"],
 ["doat","Đoạt","Cắt đường chuyền, chặn cú sút, giành bóng tuyến giữa"],
 ["xoac","Xoạc","Tắc bóng; Xoạc thấp dễ phạm lỗi"],
 ["cdai","Ch.dài","Tạt bóng từ cánh"],
 ["sxa","Sút xa","Sút ngoài vòng cấm"],
 ["pden","Phạt đền","Sút phạt đền"],
 ["pgoc","Phạt góc","Độ chuẩn quả phạt góc"],
 ["dphat","Đá phạt","Sút phạt trực tiếp"],
 ["bpha","Bứt phá","Tăng tốc thoát người, chạy chỗ nhận bóng"],
 ["dbong","Đảm bóng","Giữ bóng khi bị áp sát, kiểm soát tuyến giữa"],
 ["kchien","Kh.Chiến","Tranh chấp trên không"],
 ["cuu","Cứu bóng","Thủ môn cản phá"]];
const ATTR_COL1=["toc","bat","the","ben","sut","re","chuyen","dau","doat","xoac"],ATTR_COL2=["cdai","sxa","pden","pgoc","dphat","bpha","dbong","kchien","cuu"];
const LBL=Object.fromEntries(ATTR.map(a=>[a[0],a[1]]));
const POSN={TM:"Thủ môn",HV:"Trung vệ",HVC:"H.Vệ cánh",TV:"T.Vệ",TVC:"T.Vệ cánh","TĐ":"T.Đạo"};
const BASE={toc:300,bat:300,the:320,ben:380,sut:250,re:280,chuyen:320,dau:260,doat:250,xoac:250,cdai:260,sxa:240,pden:240,pgoc:200,dphat:200,bpha:300,dbong:260,kchien:240,cuu:60};
const ROLE={
 TM:{cuu:600,bat:480,the:420,cdai:380,toc:280,bpha:420,sut:120,re:120,xoac:120,doat:150,dau:120},
 HV:{xoac:580,doat:560,kchien:580,the:560,dau:480,bat:480,chuyen:380,toc:420,re:250,sut:200},
 HVC:{toc:560,bpha:520,xoac:500,doat:480,cdai:480,ben:540,re:420,chuyen:420,kchien:380},
 TV:{chuyen:580,dbong:540,doat:440,cdai:520,sxa:480,ben:560,re:480,dphat:420,pgoc:380,sut:380,xoac:380},
 TVC:{toc:600,re:580,cdai:540,bpha:580,chuyen:480,ben:520,pgoc:480,dphat:380,sut:420,sxa:400},
 "TĐ":{sut:600,dau:520,re:520,bpha:560,toc:560,the:480,pden:520,sxa:460,bat:480,dbong:460,kchien:400}};
// Trọng số tính "Thực lực" theo vị trí
const OVR={
 TM:{cuu:.45,bat:.2,toc:.1,bpha:.1,the:.05,cdai:.1},
 HV:{xoac:.25,doat:.2,kchien:.2,the:.15,toc:.1,chuyen:.1},
 HVC:{toc:.2,xoac:.2,doat:.15,cdai:.15,bpha:.15,ben:.15},
 TV:{chuyen:.25,dbong:.2,doat:.15,cdai:.15,sxa:.1,ben:.15},
 TVC:{toc:.2,re:.2,cdai:.2,bpha:.15,chuyen:.1,ben:.15},
 "TĐ":{sut:.3,dau:.15,re:.15,bpha:.15,toc:.15,the:.1}};
// Thực lực = trung bình 19 chỉ số (khớp thẻ gốc: Messi trung bình 438.6 ≈ Thực lực 436.6)
const overall=p=>ATTR.reduce((s,[k])=>s+p[k],0)/ATTR.length;
/* Bậc cầu thủ: trần chỉ số khi Độ kích thích 100%. Vàng = 625 theo thẻ Messi (Sút/Rê/Chuyền 624.9). */
const TIERS=[{n:"Trắng",c:"#d6d9de",cap:250},{n:"Xanh lá",c:"#22c55e",cap:330},{n:"Xanh lam",c:"#3b82f6",cap:410},{n:"Tím",c:"#a855f7",cap:500},{n:"Vàng",c:"#eab308",cap:625},{n:"Đỏ",c:"#ef4444",cap:750}];
const tierOf=p=>TIERS[p.tier??2];
const hashN=s=>[...s].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7);
function seeded(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
/* Mỗi chỉ số có: base (đã luyện), pot (giới hạn khi độ kích thích 100%),
   imp (cộng thêm từ Cải tiến), starB (cộng thêm từ Lên sao).
   Giới hạn luyện hiện tại = pot × độ kích thích (kt%).                       */
const r1=v=>Math.round(v*10)/10;
/* ===== KỸ NĂNG =====
   Mỗi cầu thủ chỉ có kỹ năng mình SỞ HỮU (SKILL_OWN) và phải đạt đủ sao mới dùng được.
   Trong trận, khi gặp đúng tình huống, kỹ năng có xác suất kích hoạt (rate) và cộng sức (mult). */
const SKILLS={
 stepover:{n:"Step Over",anim:"stepover",rate:.6,mult:1.15,desc:"Đi bóng qua người: đảo chân đánh lừa, sức đi bóng +15%"},
 roulette:{n:"Xoay Compa",anim:"roulette",rate:.6,mult:1.2,desc:"Đi bóng qua người: xoay người 360°, sức đi bóng +20%"},
 bike:{n:"Ngả Bàn Đèn",anim:"bike",rate:.45,mult:1.08,desc:"Thắng tranh chấp bóng bổng: tung người móc bóng, sức dứt điểm +8%"},
 siu:{n:"Ăn mừng SIUUU",anim:"siu",rate:1,mult:1,desc:"Màn ăn mừng độc quyền sau khi ghi bàn"}};
const SKILL_OWN={
 "Ronaldo":[["siu",0],["stepover",2],["bike",4]],
 "Quang Hải":[["roulette",3]],
 "Công Phượng":[["stepover",2],["roulette",4]],
 "Tiến Linh":[["bike",3]],
 "Văn Quyết":[["bike",3]]};
const hasSkill=(p,id)=>(p.skills||[]).some(s=>s.id===id&&(p.star||0)>=s.star);
// chọn kỹ năng đi bóng mạnh nhất đang mở và tung xác suất kích hoạt
function trySkill(p,ids){const own=ids.filter(id=>hasSkill(p,id)).sort((a,b)=>SKILLS[b].mult-SKILLS[a].mult);for(const id of own)if(rnd()<SKILLS[id].rate)return id;return null}
/* pot = trần của bậc × tỉ lệ theo vị trí (chỉ số mấu chốt = trần, chỉ số phụ tối thiểu ~1/3 trần).
   Cầu thủ mới có Độ kích thích 30% (như game gốc); đội mẫu đã kích sẵn vài lần. */
function mk(n,pos,tier,chan,kicks){const r=seeded(hashN(n)),cap=TIERS[tier].cap,p={n,pos,chan,tier,sta:100,base:{},pot:{},imp:{},starB:{},plan:[],tp:2000,star:0,ktUsed:0,ktLast:0};
  p.kt=30;const nk=kicks??(2+Math.floor(r()*5));for(let i=0;i<nk;i++){const x=r();p.kt+=x<.3?1+Math.floor(r()*2):x<.75?3+Math.floor(r()*2):x<.95?5+Math.floor(r()*2):7}p.ktUsed=nk;
  p.tn=60+Math.floor(r()*41);p.age=18+Math.floor(r()*15);p.cao=168+Math.floor(r()*24);p.nang=p.cao-105+Math.floor(r()*10);
  for(const [k] of ATTR){const ratio=Math.max(0.33,Math.min(1,(ROLE[pos][k]??BASE[k])/505))*(0.9+0.1*r());p.pot[k]=r1(Math.min(cap-0.1,cap*ratio))}
  for(const [k] of ATTR)p.base[k]=r1(p.pot[k]*p.kt/100*(0.8+0.15*r()));
  p.plan=Object.entries(OVR[pos]).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
  p.skills=(SKILL_OWN[n]||[]).map(([id,star])=>({id,star}));
  clampBase(p);refresh(p);return p}
const maxOf=(p,k)=>r1(p.pot[k]*p.kt/100);
function clampBase(p){for(const [k] of ATTR)p.base[k]=Math.min(p.base[k],maxOf(p,k))}
function refresh(p){for(const [k] of ATTR)p[k]=r1(p.base[k]+(p.imp[k]||0)+(p.starB[k]||0))}
const overallMax=p=>ATTR.reduce((s,[k])=>s+maxOf(p,k)+(p.imp[k]||0)+(p.starB[k]||0),0)/ATTR.length;
function defaultTeams(){return{
 club:{gold:567500,xu:200,phieu:1000,the:8,bh:0},
 home:{name:"FC Sông Hồng",color:"#e8372c",players:[
  mk("Văn Lâm","TM",2,"P"),mk("Văn Hậu","HVC",3,"T"),mk("Duy Mạnh","HV",2,"P"),mk("Tiến Dũng","HV",1,"P"),mk("Xuân Mạnh","HVC",1,"P"),
  mk("Hùng Dũng","TVC",2,"P"),mk("Tuấn Anh","TV",2,"P"),mk("Hoàng Đức","TV",3,"P"),mk("Quang Hải","TVC",4,"T"),
  mk("Tiến Linh","TĐ",3,"P"),mk("Ronaldo","TĐ",5,"P",4)]},
 away:{name:"Sài Gòn United",color:"#2f7ff0",players:[
  mk("Đình Triệu","TM",2,"P"),mk("Hồng Duy","HVC",2,"T"),mk("Ngọc Hải","HV",3,"P"),mk("Thành Chung","HV",2,"P"),mk("Thanh Bình","HVC",1,"P"),
  mk("Trọng Hoàng","TVC",1,"P"),mk("Minh Vương","TV",2,"T"),mk("Văn Đức","TV",2,"P"),mk("Công Phượng","TVC",4,"P"),
  mk("Văn Quyết","TĐ",3,"P"),mk("Anh Đức","TĐ",3,"P")]}
};}
/* ===== CHIẾN THUẬT (hiện ở màn hình giữa các pha) =====
   Tấn công: đổi tần suất loại pha. Phòng thủ: +3% mỗi cấp cho chỉ số phòng ngự liên quan. */
const ATK_TAC={"Chuyền ngắn":{pass:1.6},"Dàn cánh":{cross:1.8},"Sút xa":{long:1.9},"Đột phá":{drib:1.6}};
const DEF_TAC={"Ép sân":{k:"xoac",foul:1.25},"Khu vực":{k:"doat"},"Kèm người":{k:"kchien"}};
const tacOf=t=>t.tac||(t.tac={form:"442A",atk:"Chuyền ngắn",atkLv:1,def:"Khu vực",defLv:1});
const defBoost=(t,k)=>{const c=halfTac(t);return DEF_TAC[c.def].k===k?1+0.03*c.defLv:1};
/* ================== LẬP ĐỘI HÌNH ==================
   Thế trận (đội hình) = 11 vị trí trên sân, mỗi vị trí có một vai trò (r) và toạ độ trên sân dọc (x,y %).
   Cầu thủ đá đúng vị trí sở trường giữ 100% sức; vị trí gần giống 92%; khác tuyến 80%; thủ môn ↔ cầu thủ 40%. */
const FORMS={
 "442A":[["TM",50,91],["HVC",12,70],["HV",37,74],["HV",63,74],["HVC",88,70],["TVC",12,43],["TV",37,47],["TV",63,47],["TVC",88,43],["TĐ",35,15],["TĐ",65,15]],
 "433A":[["TM",50,91],["HVC",12,70],["HV",37,74],["HV",63,74],["HVC",88,70],["TV",25,48],["TV",50,53],["TV",75,48],["TVC",14,20],["TĐ",50,13],["TVC",86,20]],
 "451A":[["TM",50,91],["HVC",12,70],["HV",37,74],["HV",63,74],["HVC",88,70],["TVC",10,42],["TV",30,48],["TV",50,53],["TV",70,48],["TVC",90,42],["TĐ",50,14]],
 "532C":[["TM",50,91],["HVC",8,60],["HV",28,74],["HV",50,77],["HV",72,74],["HVC",92,60],["TV",28,44],["TV",50,47],["TV",72,44],["TĐ",35,15],["TĐ",65,15]],
 "352A":[["TM",50,91],["HV",25,74],["HV",50,77],["HV",75,74],["TVC",8,44],["TV",30,48],["TV",50,53],["TV",70,48],["TVC",92,44],["TĐ",35,15],["TĐ",65,15]]};
const FORM_NOTE={"442A":"Cân bằng công – thủ","433A":"Tấn công biên, 3 tiền vệ trung tâm","451A":"Dày tuyến giữa, giữ bóng tốt","532C":"Phòng ngự chắc, 5 hậu vệ","352A":"3 trung vệ, tiền vệ cánh dâng cao"};
const roleOf=p=>p.role||p.pos;
function fitOf(nat,role){if(nat===role)return 1;if(nat==="TM"||role==="TM")return 0.4;
  const near=[["HV","HVC"],["TV","TVC"],["TVC","TĐ"],["HVC","TVC"]];return near.some(([a,b])=>(a===nat&&b===role)||(b===nat&&a===role))?0.92:0.8}
function slotLabel(f,i){const [r,x]=FORMS[f][i],side=x<50?"T":"P";return{TM:"Thủ môn",HV:"Tr.Vệ",HVC:"H.Vệ "+side,TV:"T.Vệ",TVC:"T.Vệ "+side,"TĐ":"T.P"}[r]}
const squad=t=>t.players.concat(t.subs||[]);
function applyLineup(t){const f=FORMS[tacOf(t).form]||FORMS["442A"];t.players.forEach((p,i)=>{p.role=f[i][0];p.fit=fitOf(p.pos,p.role)});(t.subs||[]).forEach(p=>{p.role=null;p.fit=1})}
// Đổi đội hình: xếp lại 11 người đá chính vào vị trí hợp nhất (ưu tiên đúng sở trường, rồi thực lực)
function autoArrange(t){const f=FORMS[tacOf(t).form],pool=t.players.slice(),out=Array(11),used=new Set(),pairs=[];
  // ghép toàn cục: cặp (vị trí, cầu thủ) điểm cao nhất được xếp trước — đúng sở trường quan trọng hơn thực lực
  f.forEach((s,i)=>pool.forEach((p,j)=>pairs.push([fitOf(p.pos,s[0])*10000+overall(p),i,j])));
  pairs.sort((a,b)=>b[0]-a[0]);
  for(const [,i,j] of pairs){if(out[i]||used.has(j))continue;out[i]=pool[j];used.add(j)}
  t.players=out;applyLineup(t)}
// Chiến thuật theo hiệp: hiệp 2 dùng atk2/def2 nếu có
function halfTac(t){const c=tacOf(t),h2=typeof M!=="undefined"&&M&&M.min>=45;return{atk:(h2&&c.atk2)||c.atk,def:(h2&&c.def2)||c.def,atkLv:c.atkLv,defLv:c.defLv}}
let T=defaultTeams();T.home.tac={form:"442A",atk:"Dàn cánh",atkLv:1,def:"Ép sân",defLv:1};T.away.tac={form:"442A",atk:"Chuyền ngắn",atkLv:1,def:"Khu vực",defLv:1};
T.home.subs=[mk("Thanh Thắng","TM",1,"P"),mk("Việt Anh","HV",2,"P"),mk("Văn Thanh","HVC",2,"P"),mk("Đức Huy","TV",1,"P"),mk("Ngọc Quang","TVC",2,"T"),mk("Đức Chinh","TĐ",2,"P"),mk("Tuấn Hải","TĐ",1,"P")];
T.away.subs=[];applyLineup(T.home);applyLineup(T.away);

/* ================== CÔNG THỨC ==================
   Chỉ số gốc ~100–700 được quy về thang ~0–100 (chia 6.5),
   rồi nhân với thể lực còn lại và độ kích thích.                               */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=Math.random;
// tinh thần đội (M.mor) ~ 200–800, 500 là trung tính: ±6% chỉ số
const morOf=p=>(typeof M!=="undefined"&&M&&M.mor&&p._side!==undefined)?M.mor[p._side]:500;
const eff=(p,k)=>(p.fit||1)*p[k]/6.5*(0.75+0.25*p.sta/100)*(0.94+0.12*morOf(p)/1000);
/* Đối đầu theo TỈ LỆ (không theo hiệu số), nên cân bằng giữ nguyên dù chỉ số đang 80 hay 600.
   g = 48/k: k=12 → g=4 (mạnh hơn 20% thắng ~67%, mạnh hơn 50% thắng ~83%). */
/* ===== THAM SỐ CÂN BẰNG (đã dò bằng mô phỏng 800 trận/kịch bản) =====
   GK_F  : hệ số thủ môn → số bàn ~2.3–2.5/trận giữa hai đội ngang nhau
   DUEL_G: độ dốc đối đầu (k=12 → mũ 1.4: mạnh hơn 25% thắng pha ~58%)
   MOR_E : tinh thần đầu trận nhạy với chênh lệch Công/Thủ bao nhiêu
   POS_E : lợi thế giành quyền tấn công theo Công/Thủ (0.5 = căn bậc hai)
   Mục tiêu: hơn 1 bậc thắng ~65%, hơn 2 bậc ~85%, kích 100% vs 70% ~80%, 10 sao vs 0 sao ~+15%. */

const GK_F=0.65, DUEL_G=17, MOR_E=0.3, POS_E=0.5;
const STAR_GAIN=0.012; // mỗi cấp sao: +1.2% tiềm năng (×0.75–1 theo thích nghi) → 10 sao ≈ +9–12%
const duel=(a,d,k=12)=>{a=Math.max(a,0.1);d=Math.max(d,0.1);const g=DUEL_G/k,x=Math.pow(a/d,g);return x/(1+x)};
const pick=(arr,w)=>{let s=arr.reduce((t,x)=>t+Math.max(1,w(x)),0),r=rnd()*s;for(const x of arr){r-=Math.max(1,w(x));if(r<=0)return x}return arr[0]};
const speedOf=p=>4.2+eff(p,"toc")/22;
const avg=a=>a.reduce((s,x)=>s+x,0)/Math.max(1,a.length);
const byPos=(t,...ps)=>t.players.filter(p=>ps.includes(roleOf(p)));
const fmt1=v=>(Math.round(v*10)/10).toString();
// sức kiểm soát tuyến giữa: tiền vệ tính đủ, các tuyến khác tính một phần
const PW={TV:1,TVC:.8,HV:.35,HVC:.5,"TĐ":.4,TM:0};
/* Điểm Công – Thủ của đội: chỉ số mỗi cầu thủ × mức quan trọng của vị trí.
   Công cao → nhiều cơ hội tấn công; Thủ cao → giảm cơ hội của đối phương. */
const ATK_K={sut:.25,re:.15,toc:.15,bpha:.1,chuyen:.15,sxa:.1,dau:.1},DEF_K={xoac:.3,doat:.3,kchien:.15,the:.15,toc:.1};
const WA={"TĐ":1,TVC:.8,TV:.6,HVC:.3,HV:.1,TM:0},WD={TM:1.2,HV:1,HVC:.8,TV:.5,TVC:.3,"TĐ":.1};
const rate=(p,K)=>Object.entries(K).reduce((s,[k,w])=>s+eff(p,k)*w,0);
function atkDef(t){let a=0,d=0;for(const p of t.players){a+=WA[roleOf(p)]*rate(p,ATK_K);d+=WD[roleOf(p)]*(roleOf(p)==="TM"?eff(p,"cuu"):rate(p,DEF_K))}return{a:r1(a*1.6),d:r1(d*1.6)}}
function control(t){let s=0,w=0;for(const p of t.players){const k=PW[roleOf(p)];if(!k)continue;s+=k*(0.4*eff(p,"chuyen")+0.3*eff(p,"dbong")+0.3*eff(p,"doat"));w+=k}return s/w}

let M;
function initMor(){T.home.players.forEach(p=>p._side=0);T.away.players.forEach(p=>p._side=1);
  M.mor=[500,500];const H=atkDef(T.home),A=atkDef(T.away);
  const mr=(a,d,a2,d2)=>clamp(Math.round(500*Math.pow(a/d,MOR_E)*Math.pow(d2/a2,MOR_E/2)),150,900);M.mor=[mr(H.a,A.d,A.a,H.d),mr(A.a,H.d,H.a,A.d)];M.ad=[H,A]}
function newMatch(){if(typeof showIdle==="function")setTimeout(()=>showIdle("00:00"),0);squad(T.home).concat(squad(T.away)).forEach(p=>{p.sta=100;refresh(p)});applyLineup(T.home);applyLineup(T.away);M={min:0,score:[0,0],log:[],shots:[0,0],done:false,busy:false,auto:false,hold:0,queue:null,inv:new Set()};initMor();scene=null;hidePop();render();renderSquad();document.getElementById("log").innerHTML="";document.getElementById("roll").innerHTML='<span class="note">Mỗi pha sẽ hiện xác suất và kết quả.</span>';setCmt("Bấm “Đá trận” để bắt đầu.")}
function setCmt(t){document.getElementById("cmt").textContent=t}
function addLog(t,g){M.log.push(t);const d=document.createElement("div");d.textContent=`${M.min}' ${t}`;if(g)d.className="g";document.getElementById("log").prepend(d);setCmt(t)}
let rolls=[];function roll(label,p,ok,detail){rolls.push({label,p,ok,detail});document.getElementById("roll").innerHTML=rolls.map(r=>`<div class="row"><span>${r.label}<br><span class="note">${r.detail}</span></span><span class="mono ${r.ok?"ok":"ko"}">${Math.round(r.p*100)}% ${r.ok?"✓":"✗"}</span><div class="bar"><i style="width:${r.p*100}%"></i></div></div>`).join("")}

/* ================== TÌNH HUỐNG ================== */
const ent=(p,team,k,lab)=>({p,team,lab:lab||LBL[k],v:p[k]});
function makeCtx(atk,def,side){return{atk,def,side,S:[],actors:[],ids:{},G:def.players.find(p=>roleOf(p)==="TM")}}
function add(c,role,p,team,x,y){const a={p,team,x,y,role};c.actors.push(a);c.ids[role]=a;return a}
const OUT=[[8,10],[8,58],[6,34]];

// Kết thúc bằng cú sút: dùng chung cho mọi loại pha
function finishShot(c,o){
  const {role,from,stat,title}=o;const Sh=c.ids[role].p,G=c.G;M.shots[c.side]++;
  const dist=Math.hypot(52.5-from[0],34-from[1]);
  let sk,onP,gP,detail;
  const gk=(0.75*eff(G,"cuu")+0.25*eff(G,"bat"))*GK_F; // GK_F: cân chỉnh số bàn/trận
  if(o.header&&hasSkill(Sh,"bike")&&rnd()<SKILLS.bike.rate){o.bike=true;o.title="Kỹ Năng: Ngả Bàn Đèn"}
  if(o.header){
    sk=(0.6*eff(Sh,"dau")+0.4*eff(Sh,"bat"))*(o.bike?SKILLS.bike.mult:1);
    onP=clamp(0.3+0.4*duel(sk,gk,12)-(dist-8)*0.01,0.2,0.8);gP=clamp(duel(sk,gk,10)*(1.15-dist/40),0.06,0.8);
    detail=`0.6·Đ.Đầu ${Sh.dau} + 0.4·Sức bật ${Sh.bat}`;
  }else{
    sk=eff(Sh,stat);let weak=false;
    if(rnd()<0.3){sk*=0.88;weak=true}
    const fac=stat==="sxa"?1.15-dist/30:stat==="dphat"?0.55:1.3-dist/40;
    onP=clamp((0.4+0.4*duel(sk,gk,12))*(o.pressure||1)-(dist-10)*0.012,0.12,0.9);gP=clamp(duel(sk,gk,10)*fac,0.04,0.85);
    detail=`${LBL[stat]} ${Sh[stat]}, cách khung ${dist.toFixed(1)}m${weak?", chân không thuận (×0.88)":""}${o.pressure&&o.pressure<1?", bị áp sát":""}`;
  }
  const on=rnd()<onP;roll("Trúng đích",onP,on,detail);
  let goal=false;if(on){goal=rnd()<gP;roll("Thắng thủ môn",gP,goal,`vs 0.75·Cứu bóng ${G.cuu} + 0.25·Sức bật ${G.bat}`)}
  const pop={title:o.title||title,L:[ent(Sh,c.atk,o.header?"dau":stat)],R:[...(o.extraR||[]),ent(G,c.def,"cuu")],p:onP*gP,ok:goal};
  const lab=o.header?`Đánh đầu: ${Sh.dau}`:`${LBL[stat]}: ${Sh[stat]}`;
  if(!o.header)c.S.push({dur:0.4,t:{G:[51-(gk-60)/40,34+(from[1]-34)*0.25]},ball:{carry:o.noCarry?undefined:role},popup:pop,label:{[role]:lab},txt:`${Sh.n} lấy đà dứt điểm!`});
  outcome(c,{goal,on,role,from,popup:o.header?pop:null,label:o.header?{[role]:o.bike?"Ngả bàn đèn!":lab}:null,peak:o.peak??(o.header?0.8:1.2),kicker:o.header?null:o.kicker,kind:stat==="sxa"?"long":stat==="dphat"?"fk":"shot",hAnim:o.bike?"bike":"jump"});
  return goal?"goal":on?"save":"miss";
}
function outcome(c,o){
  const ty=o.on?(rnd()<.5?30.8+rnd()*1.5:35.7+rnd()*1.5):(rnd()<.5?27+rnd()*2:39+rnd()*2);
  const endH=o.on?0.3+rnd()*1.8:rnd()<.4?3:0.6;
  const extra={popup:o.popup||undefined,label:o.label||undefined,kicker:o.kicker||undefined,kickSet:o.kind};
  const hA=o.label?{[o.role]:o.hAnim||"jump"}:{};
  const Sh=c.ids[o.role].p,G=c.G;
  if(o.goal){c.S.push({dur:0.7,t:{G:[51.5,ty+(ty<34?2.5:-2.5)]},ball:{fly:null,to:[53.4,ty],h:o.peak,endH},anim:{G:"dive",...hA},txt:`VÀOOO! ${Sh.n} ghi bàn cho ${c.atk.name}!`,goal:true,...extra});
    c.S.push({dur:2.2,t:{[o.role]:[o.from[0]-7,clamp(o.from[1]+(o.from[1]<34?-6:6),6,62)]},ball:{},anim:{[o.role]:"celebrate"},txt:`${Sh.n} chạy về phía khán đài ăn mừng`});c.scorer=Sh}
  else if(o.on){const deflect=[48,ty<34?ty-12:ty+12];
    c.S.push({dur:0.6,t:{G:[51.6,ty]},ball:{fly:null,to:[51.6,ty],h:o.peak,endH},anim:{G:"dive",...hA},txt:`${G.n} bay người cản phá xuất thần!`,...extra});
    const corner=rnd()<0.45;
    c.S.push({dur:0.6,t:{},ball:{fly:null,to:corner?[53.5,ty<34?14:54]:deflect,h:1.2},txt:corner?`Bóng đi hết đường biên ngang, phạt góc cho ${c.atk.name}`:"Bóng bật ra, hậu vệ kịp phá"});
    if(corner)M.queue={type:"corner",side:c.side}}
  else c.S.push({dur:0.8,t:{},ball:{fly:null,to:[53.6,ty],h:o.peak+1.5,endH},anim:o.label?hA:undefined,txt:"Bóng đi chệch khung thành",...extra});
  if(!o.goal&&rnd()<0.6)c.S.push({dur:1.6,t:{},ball:{},anim:{[o.role]:"regret"},txt:`${Sh.n} ôm đầu tiếc nuối`});
}

// 1) Đi bóng qua người (có thể có cầu thủ thứ 2 chạy chỗ)
function sceneDribble(c){
  const fw=byPos(c.atk,"TV","TVC","TĐ");const A=pick(fw,p=>p.re+p.bpha-400);
  const B=rnd()<0.4?pick(fw.filter(p=>p!==A),p=>p.bpha-200):null;
  const D=pick(byPos(c.def,"HV","HVC"),p=>p.xoac-200);const y0=26+rnd()*24;
  add(c,"A",A,c.atk,20,y0);add(c,"D",D,c.def,35,clamp(y0+(rnd()-.5)*8,10,58));add(c,"G",c.G,c.def,51,34);
  if(B)add(c,"B",B,c.atk,23,clamp(y0+(y0<34?16:-16),6,62));
  c.S.push({dur:1.4,t:{A:[30,y0],D:[35,c.ids.D.y],G:[50.5,34+(y0-34)*.15],B:B?[34,c.ids.B.y]:null},ball:{carry:"A"},label:{A:`Rê dắt: ${A.re}`},txt:`${A.n} nhận bóng rồi dẫn bóng tiến về phía trước`});
  const skl=trySkill(A,["roulette","stepover"]);
  const a=(0.45*eff(A,"re")+0.3*eff(A,"toc")+0.25*eff(A,"bpha"))*(skl?SKILLS[skl].mult:1), d=(0.5*eff(D,"xoac")+0.3*eff(D,"the")+0.2*eff(D,"toc"))*defBoost(c.def,"xoac");
  if(skl)roll(`Kỹ năng: ${SKILLS[skl].n}`,SKILLS[skl].rate,true,`${A.n} ★${A.star} — sức đi bóng ×${SKILLS[skl].mult}`);
  const pD=duel(a,d,12),ok=rnd()<pD;
  roll("Đi bóng qua người",pD,ok,`0.45·Rê dắt + 0.3·Tốc độ + 0.25·Bứt phá vs 0.5·Xoạc + 0.3·Thể lực + 0.2·Tốc độ`);
  const pop={title:skl?`Kỹ Năng: ${SKILLS[skl].n}`:"Đi Bóng Qua Người",L:[ent(A,c.atk,"re","Lừa")],R:[ent(D,c.def,"xoac")],p:pD,ok};
  c.S.push({dur:skl?1.1:0.9,t:{A:[33.5,y0],D:[34.5,y0]},ball:{carry:"A"},anim:skl?{A:skl}:undefined,popup:pop,label:{A:skl?SKILLS[skl].n+"!":`Lừa bóng: ${A.re}`,D:`Xoạc: ${D.xoac}`},txt:skl?`${A.n} tung kỹ năng ${SKILLS[skl].n}!`:`${A.n} đối mặt ${D.n}`});
  if(!ok){
    // giữ bóng: Đảm bóng + Thể lực có cơ hội giữ được bóng dù bị tắc
    const pK=clamp(duel(0.6*eff(A,"dbong")+0.4*eff(A,"the"),eff(D,"the"),12)*0.3,0.05,0.3),keep=rnd()<pK;
    roll("Che chắn giữ bóng",pK,keep,`0.6·Đảm bóng ${A.dbong} + 0.4·Thể lực ${A.the} vs Thể lực ${D.the}`);
    if(!keep){c.S.push({dur:0.9,t:{D:[33.2,y0],A:[32,y0+1.5]},ball:{carry:"D"},anim:{D:"slide",A:"fall"},txt:`${D.n} xoạc bóng chuẩn xác`});
      c.S.push({dur:1,t:{},ball:{fly:null,to:OUT[(rnd()*3)|0],h:2},txt:`${D.n} phá bóng lên tuyến trên`});return "lost"}
    c.S.push({dur:0.6,t:{D:[33,y0-1]},ball:{carry:"A"},anim:{D:"slide"},txt:`${A.n} tì đè giữ được bóng!`});
  }
  // phạm lỗi: Xoạc thấp thì dễ phạm lỗi
  const pF=clamp((0.03+0.16*(1-duel(eff(D,"xoac"),a,12)))*(DEF_TAC[halfTac(c.def).def].foul||1),0.03,0.18);
  if(rnd()<pF){roll("Phạm lỗi",pF,true,`Xoạc ${D.xoac} càng thấp càng dễ phạm lỗi`);
    c.S.push({dur:1,t:{D:[33.4,y0]},ball:{carry:"A"},anim:{D:"slide",A:"fall"},txt:`${D.n} phạm lỗi với ${A.n}. Trọng tài thổi phạt trực tiếp!`});
    M.queue={type:"fk",side:c.side,pos:[33.5,y0]};return "foul"}
  const sp=[40+rnd()*4,clamp(y0+(34-y0)*.6,14,54)];
  c.S.push({dur:1.3,t:{A:sp,D:[sp[0]-3,sp[1]+(rnd()<.5?3:-3)],B:B?[42,c.ids.B.y*0.7+34*0.3]:null},ball:{carry:"A"},txt:`${A.n} đảo người qua ${D.n} đầy tinh tế!`});
  return finishShot(c,{role:"A",from:sp,stat:"sut",pressure:1.1,title:"Đối Mặt Thủ Môn"});
}
// 2) Phối hợp chuyền bóng 2 đánh 1
function scenePass(c){
  const fw=byPos(c.atk,"TV","TVC","TĐ");const A=pick(byPos(c.atk,"TV","TVC"),p=>p.chuyen-300),B=pick(fw.filter(p=>p!==A),p=>p.bpha+p.sut-600);
  const D=pick(byPos(c.def,"HV","HVC"),p=>p.doat-200);const y0=26+rnd()*24;
  add(c,"A",A,c.atk,20,y0);add(c,"D",D,c.def,35,clamp(y0+(rnd()-.5)*8,10,58));add(c,"G",c.G,c.def,51,34);add(c,"B",B,c.atk,23,clamp(y0+(y0<34?16:-16),6,62));
  c.S.push({dur:1.4,t:{A:[30,y0],D:[35,c.ids.D.y],G:[50.5,34+(y0-34)*.15],B:[33,c.ids.B.y]},ball:{carry:"A"},label:{A:`Chuyền: ${A.chuyen}`},txt:`${A.n} cầm bóng tìm khoảng trống`});
  const recv=[38,clamp(c.ids.B.y,8,60)];
  const pP=clamp(duel(0.65*eff(A,"chuyen")+0.35*eff(B,"bpha"),(0.7*eff(D,"doat")+0.3*eff(D,"toc"))*defBoost(c.def,"doat"),14)+0.15,0.4,0.95),ok=rnd()<pP;
  roll("Chuyền bóng",pP,ok,`0.65·Chuyền ${A.chuyen} + 0.35·Bứt phá người nhận ${B.bpha} vs 0.7·Đoạt ${D.doat} + 0.3·Tốc độ`);
  c.S.push({dur:0.6,t:{A:[31.5,y0],B:[35,c.ids.B.y]},ball:{carry:"A"},popup:{title:"Phối Hợp Chuyền Bóng",L:[ent(A,c.atk,"chuyen"),ent(B,c.atk,"bpha")],R:[ent(D,c.def,"doat")],p:pP,ok},label:{A:`Chuyền bóng: ${A.chuyen}`},txt:`${A.n} nhìn thấy ${B.n} đang băng lên`});
  if(!ok){const mid=[34,(y0+recv[1])/2];
    c.S.push({dur:0.8,t:{D:mid,B:[36,recv[1]]},ball:{fly:"D",to:mid},anim:{D:"slide"},txt:`${D.n} đọc tình huống và cắt bóng!`});
    c.S.push({dur:1,t:{},ball:{fly:null,to:OUT[(rnd()*3)|0],h:2},txt:`${D.n} phá bóng giải nguy`});return "lost"}
  c.S.push({dur:0.9,t:{B:recv,D:[37,(y0+recv[1])/2],A:[34,y0]},ball:{fly:"B",to:recv},txt:`${A.n} chuyền vừa tầm cho ${B.n}`});
  const pC=clamp(duel(0.6*eff(D,"toc")+0.4*eff(D,"bpha"),0.5*eff(B,"toc")+0.5*eff(B,"bpha"),12)*0.5,0.05,0.45),caught=rnd()<pC;
  roll("Hậu vệ đuổi kịp",pC,!caught,`Tốc độ + Bứt phá: ${D.n} vs ${B.n}`);
  const sp=[41+rnd()*3,clamp(recv[1]+(34-recv[1])*.5,14,54)];
  c.S.push({dur:1.2,t:{B:sp,D:caught?[sp[0]-0.8,sp[1]+(sp[1]<34?1:-1)]:[sp[0]-4,sp[1]+4],A:[38,y0]},ball:{carry:"B"},label:{B:`Bứt phá: ${B.bpha}`},txt:caught?`${D.n} đuổi kịp, áp sát ${B.n}`:`${B.n} bứt tốc thoát xuống`});
  if(caught){const pF=clamp(0.03+0.14*(1-duel(eff(D,"xoac"),0.5*eff(B,"toc")+0.5*eff(B,"bpha"),12)),0.03,0.13);
    if(rnd()<pF){roll("Phạm lỗi trong vòng cấm",pF,true,`Xoạc ${D.xoac}`);
      c.S.push({dur:1,t:{D:[sp[0]-0.5,sp[1]]},ball:{carry:"B"},anim:{D:"slide",B:"fall"},txt:`${D.n} phạm lỗi trong vòng cấm. PHẠT ĐỀN!`});M.queue={type:"pen",side:c.side};return "foul"}}
  return finishShot(c,{role:"B",from:sp,stat:"sut",pressure:caught?0.75:1.05,title:"Đối Mặt Thủ Môn",extraR:caught?[ent(D,c.def,"xoac","Áp sát")]:[]});
}
// 3) Tạt bóng / phạt góc → tranh chấp trên không → đánh đầu
function sceneCross(c,corner){
  const out=c.atk.players.filter(p=>roleOf(p)!=="TM");
  const C=corner?out.reduce((b,p)=>p.pgoc>b.pgoc?p:b):pick(byPos(c.atk,"TVC","HVC"),p=>p.cdai-300);
  const H=pick(out.filter(p=>p!==C&&(roleOf(p)==="TĐ"||(corner&&roleOf(p)==="HV"))),p=>p.dau+p.bat-600);
  const D=pick(byPos(c.def,"HV"),p=>p.kchien-200);const wing=rnd()<.5?7:61;
  if(corner){add(c,"C",C,c.atk,52.2,wing<34?1.3:66.7);add(c,"H",H,c.atk,40,34+(rnd()-.5)*10);add(c,"D",D,c.def,41,c.ids.H.y+1);add(c,"G",c.G,c.def,51.6,34);c.ballStart=[52.4,wing<34?1.5:66.5]}
  else{add(c,"C",C,c.atk,32,wing);add(c,"H",H,c.atk,37,34+(rnd()-.5)*8);add(c,"D",D,c.def,41,c.ids.H.y+1.5);add(c,"G",c.G,c.def,51,34)}
  const hp=[46+rnd()*2.5,31+rnd()*6],k=corner?"pgoc":"cdai";
  if(corner)c.S.push({dur:1.2,t:{H:[44,hp[1]+1],D:[44.5,hp[1]+1.8]},ball:{},label:{C:`Phạt góc: ${C.pgoc}`},txt:`${C.n} chuẩn bị đá phạt góc`});
  else c.S.push({dur:1.5,t:{C:[44,wing],H:[42,hp[1]],D:[43,hp[1]+1.2],G:[51,34+(wing-34)*.1]},ball:{carry:"C"},label:{C:`Ch.dài: ${C.cdai}`},txt:`${C.n} đi bóng dọc biên rồi chuẩn bị tạt`});
  const cq=eff(C,k),acc=clamp(0.5+0.4*duel(cq,eff(D,"kchien"),12),0.4,0.92),accOk=rnd()<acc;
  roll(corner?"Quả phạt góc chuẩn":"Quả tạt chuẩn",acc,accOk,`${LBL[k]} ${C[k]}`);
  if(!accOk){c.S.push({dur:1,t:{H:[45,hp[1]]},ball:{fly:null,to:[53.5,wing<34?58:10],h:4},kicker:"C",txt:"Bóng đi quá cao, hết đường biên ngang"});return "lost"}
  const pG=clamp(duel(0.5*eff(c.G,"bat")+0.5*eff(c.G,"cuu"),cq,14)*0.3,0.05,0.35),claim=rnd()<pG;
  roll("Thủ môn băng ra bắt bóng",pG,claim,`0.5·Sức bật ${c.G.bat} + 0.5·Cứu bóng ${c.G.cuu} vs ${LBL[k]} ${C[k]}`);
  if(claim){c.S.push({dur:1,t:{G:hp,H:[hp[0]-1.5,hp[1]+.5],D:[hp[0]-1,hp[1]+1.5]},ball:{fly:null,to:hp,h:4,endH:2.3},kicker:"C",txt:`${C.n} treo bóng vào vòng cấm`});
    c.S.push({dur:1,t:{},ball:{carry:"G"},anim:{G:"jump"},txt:`${c.G.n} băng ra bắt gọn bóng`});return "lost"}
  const atkA=0.45*eff(H,"dau")+0.35*eff(H,"bat")+0.2*eff(H,"kchien"),defA=(0.6*eff(D,"kchien")+0.4*eff(D,"bat"))*defBoost(c.def,"kchien");
  const pA=duel(atkA,defA,12),win=rnd()<pA;
  roll("Tranh chấp trên không",pA,win,`0.45·Đ.Đầu + 0.35·Sức bật + 0.2·Kh.Chiến vs 0.6·Kh.Chiến + 0.4·Sức bật`);
  c.S.push({dur:1,t:{H:[hp[0]-0.5,hp[1]],D:[hp[0]-0.3,hp[1]+0.9]},ball:{fly:null,to:hp,h:4,endH:2.3},kicker:"C",txt:`${C.n} treo bóng vào vòng cấm`});
  c.S.push({dur:0.35,t:{},ball:{},anim:{H:"jump",D:"jump"},popup:{title:"Không Chiến",L:[ent(C,c.atk,k),ent(H,c.atk,"bat")],R:[ent(D,c.def,"kchien")],p:pA,ok:win},label:{H:`Sức bật: ${H.bat}`,D:`Kh.Chiến: ${D.kchien}`},txt:`${H.n} và ${D.n} cùng bật cao tranh chấp`});
  if(!win){c.S.push({dur:1,t:{},ball:{fly:null,to:[34,10+rnd()*48],h:3},kicker:"D",txt:`${D.n} đánh đầu phá bóng`});return "lost"}
  return finishShot(c,{role:"H",from:hp,header:true,title:"Đánh Đầu Cận Thành",extraR:[ent(D,c.def,"kchien")]});
}
// 4) Sút xa
function sceneLong(c){
  const A=pick(byPos(c.atk,"TV","TVC","TĐ"),p=>p.sxa-250),D=pick(byPos(c.def,"HV","HVC"),p=>p.doat-200),y0=26+rnd()*24;
  add(c,"A",A,c.atk,20,y0);add(c,"D",D,c.def,37,clamp(y0+(rnd()-.5)*6,10,58));add(c,"G",c.G,c.def,51,34);
  const sp=[28+rnd()*3,clamp(y0+(34-y0)*.3,12,56)];
  c.S.push({dur:1.4,t:{A:sp,D:[34,sp[1]+(rnd()-.5)*3],G:[50.5,34+(sp[1]-34)*.15]},ball:{carry:"A"},label:{A:`Sút xa: ${A.sxa}`},txt:`${A.n} có khoảng trống trước vòng cấm`});
  const pB=clamp(duel(0.8*eff(D,"doat")+0.2*eff(D,"bat"),eff(A,"sxa")*1.15,12)*0.3,0.05,0.3),blocked=rnd()<pB;
  roll("Hậu vệ chặn cú sút",pB,!blocked,`Đoạt ${D.doat} vs Sút xa ${A.sxa}`);
  if(blocked){c.S.push({dur:0.4,t:{},ball:{carry:"A"},popup:{title:"Cơ Hội Sút Xa",L:[ent(A,c.atk,"sxa")],R:[ent(D,c.def,"doat"),ent(c.G,c.def,"cuu")],p:(1-pB)*0.15,ok:false},label:{A:`Sút xa: ${A.sxa}`},txt:`${A.n} tung cú sút xa!`});
    c.S.push({dur:0.5,t:{D:[c.ids.D.x+0.8,c.ids.D.y]},ball:{fly:null,to:[33.5,c.ids.D.y],h:1},anim:{D:"slide"},txt:`${D.n} lao người chặn bóng`});
    const corner=rnd()<.5;c.S.push({dur:0.9,t:{},ball:{fly:null,to:corner?[53.5,c.ids.D.y<34?12:56]:OUT[(rnd()*3)|0],h:2},txt:corner?"Bóng đổi hướng đi hết đường biên ngang. Phạt góc!":"Bóng bật ra, hàng thủ phá đi"});
    if(corner)M.queue={type:"corner",side:c.side};return "blocked"}
  return finishShot(c,{role:"A",from:sp,stat:"sxa",title:"Cơ Hội Sút Xa",extraR:[ent(D,c.def,"doat")],peak:1.8});
}
// 5) Phạt đền
function scenePen(c){
  const K=c.atk.players.filter(p=>roleOf(p)!=="TM").reduce((b,p)=>p.pden>b.pden?p:b);
  add(c,"K",K,c.atk,38.5,32.5);add(c,"G",c.G,c.def,52.2,34);c.ballStart=[41.5,34];
  const pS=clamp(0.76+0.3*(duel(eff(K,"pden"),eff(c.G,"cuu"),12)-0.5),0.6,0.9),goal=rnd()<pS;
  roll("Phạt đền",pS,goal,`Phạt đền ${K.pden} vs Cứu bóng ${c.G.cuu}`);M.shots[c.side]++;
  c.S.push({dur:1.2,t:{K:[40.8,33.6]},ball:{},popup:{title:"Đá Phạt Đền",L:[ent(K,c.atk,"pden")],R:[ent(c.G,c.def,"cuu")],p:pS,ok:goal},label:{K:`Phạt đền: ${K.pden}`},txt:`${K.n} đặt bóng trên chấm phạt đền`});
  const ty=rnd()<.5?31.2:36.8,saved=!goal&&rnd()<.55,gDir=goal?(rnd()<.6?(ty<34?36.5:31.5):ty):ty;
  if(goal){c.S.push({dur:0.6,t:{G:[52,gDir]},ball:{fly:null,to:[53.4,ty],h:0.5,endH:0.6},kicker:"K",kickSet:"pen",anim:{G:"dive"},txt:`VÀOOO! ${K.n} sút phạt đền thành công`,goal:true});
    c.S.push({dur:2,t:{K:[38,ty<34?26:42]},ball:{},anim:{K:"celebrate"},txt:`${K.n} ăn mừng`});c.scorer=K;return "goal"}
  if(saved){c.S.push({dur:0.6,t:{G:[52,ty]},ball:{fly:null,to:[52,ty],h:0.6,endH:0.5},kicker:"K",kickSet:"pen",anim:{G:"dive"},txt:`${c.G.n} đoán đúng hướng và cản phá!`});
    c.S.push({dur:0.7,t:{},ball:{fly:null,to:[45,ty<34?20:48],h:1},txt:"Bóng bật ra, hậu vệ phá đi"});return "save"}
  c.S.push({dur:0.7,t:{G:[52,ty<34?36:32]},ball:{fly:null,to:[54,ty<34?29:39],h:2.5,endH:3},kicker:"K",kickSet:"pen",anim:{G:"dive"},txt:`${K.n} sút ra ngoài!`});return "miss";
}
// 6) Đá phạt trực tiếp (hậu vệ đứng làm hàng rào)
function sceneFK(c,pos){
  const K=c.atk.players.filter(p=>roleOf(p)!=="TM").reduce((b,p)=>p.dphat>b.dphat?p:b);
  const W=pick(byPos(c.def,"HV","HVC"),p=>p.bat);
  const dx=52.5-pos[0],dy=34-pos[1],dd=Math.hypot(dx,dy),wall=[pos[0]+dx/dd*9.15,pos[1]+dy/dd*9.15];
  add(c,"K",K,c.atk,pos[0]-2.5,pos[1]+1.2);add(c,"D",W,c.def,wall[0],wall[1]);add(c,"G",c.G,c.def,51.5,34+(pos[1]-34)*0.12);c.ballStart=pos;
  c.S.push({dur:1.2,t:{K:[pos[0]-0.8,pos[1]+0.4]},ball:{},label:{K:`Đá phạt: ${K.dphat}`,D:"Hàng rào"},txt:`${K.n} đứng trước quả đá phạt`});
  return finishShot(c,{role:"K",from:pos,stat:"dphat",title:"Đá Phạt Trực Tiếp",extraR:[ent(W,c.def,"bat","Hàng rào · Sức bật")],peak:3.2,noCarry:true,kicker:"K"});
}

function buildScene(){
  rolls=[];let atk,def,side,type,q=M.queue;M.queue=null;
  if(q){side=q.side;atk=side?T.away:T.home;def=side?T.home:T.away;type=q.type}
  else{
    const H=atkDef(T.home),A=atkDef(T.away),wh=Math.pow(H.a/A.d*control(T.home),POS_E),wa=Math.pow(A.a/H.d*control(T.away),POS_E),pH=wh/(wh+wa);const homeAtk=rnd()<pH;
    atk=homeAtk?T.home:T.away;def=homeAtk?T.away:T.home;side=homeAtk?0:1;
    roll("Giành quyền tấn công",homeAtk?pH:1-pH,true,`Công ${homeAtk?H.a:A.a} vs Thủ ${homeAtk?A.d:H.d}, kèm kiểm soát tuyến giữa`);
    // loại pha phụ thuộc điểm mạnh của đội tấn công
    const ov=avg(atk.players.map(overall)),wC=0.6*avg(byPos(atk,"TVC","HVC").map(p=>p.cdai))/ov*avg(byPos(atk,"TĐ").map(p=>p.dau))/ov;
    const wL=0.5*avg(byPos(atk,"TV","TVC").map(p=>p.sxa))/ov;
    const at=ATK_TAC[halfTac(atk).atk]||{},lv=1+0.15*(tacOf(atk).atkLv-1);type=pick([["drib",1*(at.drib?at.drib*lv:1)],["pass",1*(at.pass?at.pass*lv:1)],["cross",wC*(at.cross?at.cross*lv:1)],["long",wL*(at.long?at.long*lv:1)]],x=>x[1]*100)[0];
  }
  const c=makeCtx(atk,def,side);
  c.res=type==="drib"?sceneDribble(c):type==="pass"?scenePass(c):type==="cross"?sceneCross(c,false):type==="corner"?sceneCross(c,true):type==="long"?sceneLong(c):type==="pen"?scenePen(c):sceneFK(c,q.pos);
  return{actors:c.actors,steps:c.S,side,atk,def,res:c.res,scorer:c.scorer,ballStart:c.ballStart};
}

/* ================== CAMERA PHỐI CẢNH ================== */
const cv=document.getElementById("cv"),ctx=cv.getContext("2d");
const W=cv.width,H=cv.height;
let camX=30;
function proj(x,y,h=0){const d=60+(68-y);const s=1920/d;return[W/2+(x-camX)*s,-219+25.9*s-h*s,s]}
function poly(pts,fill){ctx.beginPath();pts.forEach((p,i)=>{const q=proj(...p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});ctx.fillStyle=fill;ctx.fill()}
function line3(pts,lw){ctx.beginPath();pts.forEach((p,i)=>{const q=proj(...p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});ctx.lineWidth=lw;ctx.stroke()}
const crowdC=document.createElement("canvas");crowdC.width=240;crowdC.height=120;
(()=>{const g=crowdC.getContext("2d");g.fillStyle="#2a2d33";g.fillRect(0,0,240,120);
  const cols=["#e8372c","#ffffff","#f2c94c","#2f7ff0","#1f1f1f","#e8372c","#d9d9d9","#ff8a3d"];
  for(let r=0;r<12;r++)for(let c=0;c<40;c++){const x=c*6+(r%2)*3,y=r*10+4;g.fillStyle=cols[(Math.random()*cols.length)|0];g.beginPath();g.arc(x,y,2.6,0,7);g.fill();g.fillStyle="#c99877";g.beginPath();g.arc(x,y-3.2,1.6,0,7);g.fill()}})();
let crowdPat=null;
function drawStadium(){
  ctx.fillStyle="#141619";ctx.fillRect(0,0,W,H);
  crowdPat=crowdPat||ctx.createPattern(crowdC,"repeat");
  ctx.save();crowdPat.setTransform&&crowdPat.setTransform(new DOMMatrix().translate(-camX*15,0));
  poly([[-40,-3,1.2],[100,-3,1.2],[100,-18,16],[-40,-18,16]],crowdPat);
  poly([[57.5,-3,1.2],[57.5,75,1.2],[66,75,10],[66,-3,10]],crowdPat);
  ctx.restore();
  poly([[-40,-3],[100,-3],[100,90],[-40,90]],"#3f9a32");
  for(let x=-40;x<100;x+=5)if(((x/5)|0)%2===0)poly([[x,-3],[x+5,-3],[x+5,90],[x,90]],"#47a838");
  for(let x=-40;x<57;x+=6){poly([[x,-2,0],[x+6,-2,0],[x+6,-2,1],[x,-2,1]],(x/6|0)%2?"#d8261b":"#f2f2f2");
    const q=proj(x+3,-2,0.5);ctx.fillStyle=(x/6|0)%2?"#fff":"#d8261b";ctx.font=`italic 800 ${q[2]*0.62}px Impact,'Saira Condensed',sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("Goal!!",q[0],q[1])}
  for(let y=-2;y<80;y+=6)poly([[56,y,0],[56,y+6,0],[56,y+6,1],[56,y,1]],(y/6|0)%2?"#d8261b":"#f2f2f2");
  ctx.textBaseline="alphabetic";
  ctx.strokeStyle="rgba(255,255,255,.92)";
  line3([[2,1],[52.5,1],[52.5,67],[2,67],[2,1]],2.5);
  line3([[36,13.85],[52.5,13.85]],2.5);line3([[36,54.15],[52.5,54.15]],2.5);line3([[36,13.85],[36,54.15]],2.5);
  line3([[47,24.85],[52.5,24.85],[52.5,43.15],[47,43.15],[47,24.85]],2.5);
  const arc=(cx,cy,r,a0,a1)=>{const pts=[];for(let i=0;i<=24;i++){const a=a0+(a1-a0)*i/24;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}line3(pts,2.5)};
  arc(2,34,9.15,-Math.PI/2,Math.PI/2);
  const pa=Math.acos(5.5/9.15);arc(41.5,34,9.15,Math.PI-pa,Math.PI+pa);
  arc(52.5,1,1,Math.PI/2,Math.PI);arc(52.5,67,1,Math.PI,Math.PI*1.5);
  const ps=proj(41.5,34);ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(ps[0],ps[1],ps[2]*.15,ps[2]*.08,0,0,7);ctx.fill();
}
function drawGoal(){
  const y0=30.34,y1=37.66,hh=2.44,bx=54.6,amp=fx.net*0.6;
  const wob=(i)=>Math.sin(i*1.3+performance.now()/70)*amp;
  ctx.strokeStyle="rgba(255,255,255,.55)";
  for(let i=0;i<=12;i++){const y=y0+(y1-y0)*i/12;line3([[52.5,y,hh],[bx+wob(i),y,hh*0.85],[bx+wob(i),y,0]],1)}
  for(let j=0;j<=6;j++){const h=hh*0.85*j/6;line3([[bx+wob(j),y0,h],[bx+wob(j+3),y1,h]],1)}
  for(let k=0;k<=4;k++){const x=52.5+(bx-52.5)*k/4;line3([[x,y0,0],[x,y0,hh-(hh*0.15)*k/4]],1);line3([[x,y1,0],[x,y1,hh-(hh*0.15)*k/4]],1)}
}
function drawPosts(){ctx.strokeStyle="#fff";ctx.lineCap="round";const s=proj(52.5,34)[2];line3([[52.5,30.34,0],[52.5,30.34,2.44],[52.5,37.66,2.44],[52.5,37.66,0]],Math.max(3,s*0.16))}

/* ================== SPRITE CẦU THỦ (vẽ bằng code) ================== */
const SKIN=["#f1c7a0","#e0ac80","#c68b5e","#a46a43"],HAIR=["#1b1410","#2e2018","#4a3020","#0d0d0d","#6b4a2a"];
function shade(hex,k){const n=parseInt(hex.slice(1),16);const f=c=>clamp(Math.round(c*k),0,255);return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`}
function limb(g,x,y,ang,l1,l2,bend,w,c1,c2,c3){
  const kx=x+Math.sin(ang)*l1,ky=y+Math.cos(ang)*l1,a2=ang+bend,fx2=kx+Math.sin(a2)*l2,fy=ky+Math.cos(a2)*l2;
  g.lineCap="round";g.lineWidth=w;g.strokeStyle=c1;g.beginPath();g.moveTo(x,y);g.lineTo(kx,ky);g.stroke();
  g.strokeStyle=c2;g.beginPath();g.moveTo(kx,ky);g.lineTo(fx2,fy);g.stroke();
  if(c3){g.fillStyle=c3;g.beginPath();g.ellipse(fx2+2,fy+1,4.5,2.6,a2*0.3,0,7);g.fill()}
}
function drawSprite(g,a,now,x,y,sc){
  const p=a.p,h=hashN(p.n),gk=roleOf(p)==="TM";
  const shirt=gk?"#f2c94c":a.team.color,shorts=gk?"#1d1d1d":"#f4f4f4",sock=gk?"#1d1d1d":a.team.color;
  const skin=SKIN[h%4],hair=HAIR[(h>>3)%5],num=(h%23)+1;
  const f=a.face||1,an=a.anim,t=a.at||0;
  g.beginPath();g.ellipse(x,y+1,16*sc,5*sc,0,0,7);g.fillStyle="rgba(0,0,0,.28)";g.fill();
  g.save();g.translate(x,y);g.scale(f*sc,sc);
  let legF=0,legB=0,armF=0,armB=0,bob=0,rot=0,lean=0,armUp=false,dy=0;
  if(an==="kick"){const k=clamp(t/0.32,0,1),e=k<.45?-k/.45:(k-.45)/.55;legF=e<0?e*1.1:e*1.6;legB=0.15;armF=-0.9;armB=0.9;lean=-0.18}
  else if(an==="slide"){const k=clamp(t/0.25,0,1);rot=-1.15*k;dy=6*k;legF=1.5;legB=1.1;armF=-2.2;armB=0.6}
  else if(an==="fall"){const k=clamp(t/0.4,0,1);rot=1.35*k;dy=8*k;legF=0.6;legB=-0.4;armF=1.8;armB=-1.6}
  else if(an==="dive"){const k=clamp(t/0.22,0,1);rot=a.diveDir*1.45*k;dy=-9*Math.sin(k*Math.PI);legF=0.25;legB=-0.25;armF=a.diveDir*-2.6;armB=a.diveDir*-2.3}
  else if(an==="jump"){const k=clamp(t/0.55,0,1);dy=-16*Math.sin(k*Math.PI);legF=0.5;legB=-0.6;armUp=true;lean=-0.1}
  else if(a.moving||an==="celebrate"){const ph=a.phase||0;legF=Math.sin(ph)*0.85;legB=-legF;armF=-legF*0.9;armB=legF*0.9;bob=Math.abs(Math.cos(ph))*2.2;lean=0.12}
  else if(an==="pose"){legF=0.5;legB=-0.45;armF=-0.6;armB=0.7;lean=0.1}
  else{bob=Math.sin(now*3+h)*0.6}
  if(an==="celebrate"){armUp=true;dy-=Math.abs(Math.sin(t*7))*7}
  g.translate(0,dy-bob);g.rotate(rot+lean);
  const hipY=-15,shY=-31;
  limb(g,0,hipY,legB,7,8,legB<0?legB*0.9:0,4.5,shade(skin,0.88),shade(sock,0.8),"#1a1a1a");
  if(!armUp)limb(g,-1,shY+2,armB,6,6,-0.4,3.5,shade(shirt,0.8),shade(skin,0.88));
  g.fillStyle=shirt;g.beginPath();g.roundRect(-6.5,shY-1,13,hipY-shY+2,3);g.fill();
  g.fillStyle=shorts;g.beginPath();g.roundRect(-6.5,hipY-3,13,6,2);g.fill();
  g.fillStyle=gk?"#111":"rgba(255,255,255,.9)";g.font="800 8px 'Saira Condensed',sans-serif";g.textAlign="center";g.fillText(num,0,-21);
  limb(g,0,hipY,legF,7,8,legF<0?legF*0.9:0,4.5,skin,sock,"#111");
  g.fillStyle=skin;g.beginPath();g.arc(1,shY-7,6.2,0,7);g.fill();
  g.fillStyle=hair;g.beginPath();g.arc(0.3,shY-8.3,6.3,Math.PI*0.95,Math.PI*2.15);g.fill();
  g.fillStyle="#111";g.fillRect(4,shY-8,1.4,1.6);
  if(armUp){limb(g,-1,shY+2,Math.PI-0.35,6,6,0,3.5,shade(shirt,0.8),skin);limb(g,1,shY+2,Math.PI+0.35,6,6,0,3.5,shirt,gk?"#f2f2f2":skin)}
  else limb(g,1,shY+2,armF,6,6,-0.4,3.5,shirt,gk?"#f2f2f2":skin);
  g.restore();
}

/* ================== SPRITE ẢNH (atlas) ==================
   std = cầu thủ thường (áo xanh, đổi màu theo đội), cr7 = Ronaldo, gk = thủ môn.
   Mọi khung hình quay sang phải; quay trái thì lật ngang. Gốc vẽ = giữa chân.   */
const SPR={};
for(const [k,src] of Object.entries(SPRITE_SRC)){const img=new Image();SPR[k]={img,ready:false,tint:{}};img.onload=()=>{SPR[k].ready=true;if(window.mgrRender)mgrRender()};img.src=src}
const charKey=p=>p.sprite||(roleOf(p)==="TM"?"gk":"std");
const FPS={stepover:13,roulette:13,siu:7,run:0,drib:0,pass:16,shot:16,fk:15,long:16,pen:15,slide:14,head:16,bike:13,cele:6,regret:6,catch:14,dive:14};
const KICK_FALLBACK={pass:["pass","fk","shot"],shot:["shot","fk"],long:["long","shot"],fk:["fk","shot"],pen:["fk","shot"]};
const CONTACT={pass:.55,shot:.6,long:.55,fk:.65};
function hasAnim(key,an){return !!SPRITE_META[key].anims[an]}
function kickAnim(key,set){for(const a of (KICK_FALLBACK[set]||["shot"]))if(hasAnim(key,a))return a;return null}
function kickInfo(a){const key=charKey(a.p),an=kickAnim(key,a.kickSet||"shot");if(!an)return{dur:0.4,contact:0};
  const n=SPRITE_META[key].anims[an].length,f=FPS[an]||15;return{dur:n/f,contact:n/f*(CONTACT[an]||.6)}}
// đổi màu áo xanh của sprite thường sang màu đội
function hexRgb(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]}
function tinted(key,color){
  const S=SPR[key];if(key!=="std")return S.img;
  const [tr,tg,tb]=hexRgb(color);if(tb>tr+60&&tb>tg)return S.img; // đội áo xanh: giữ nguyên
  if(S.tint[color])return S.tint[color];
  const c=document.createElement("canvas");c.width=S.img.width;c.height=S.img.height;const g=c.getContext("2d");g.drawImage(S.img,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),px=d.data;
    for(let i=0;i<px.length;i+=4){const r=px[i],gg=px[i+1],b=px[i+2];
      if(px[i+3]>0&&b>70&&b>r+35&&b>gg+15){const l=Math.min(1.25,(b/255)*1.15+0.05);px[i]=Math.min(255,tr*l);px[i+1]=Math.min(255,tg*l);px[i+2]=Math.min(255,tb*l)}}
    g.putImageData(d,0,0)}catch(e){return S.img}
  return S.tint[color]=c;
}
function pickFrame(a,key,now){
  const A=SPRITE_META[key].anims,an=a.anim,t=Math.max(0,a.at||0);
  const once=(name)=>{const n=A[name].length;return[name,Math.min(n-1,Math.floor(t*(FPS[name]||14)))]};
  const loop=(name,fps)=>{const n=A[name].length;return[name,Math.floor(t*fps+hashN(a.p.n)%7)%n]};
  let r={rot:0,dy:0};
  if(an==="pose"){r.an="idle";r.i=0;return r}
  if(an==="kick"){const k=kickAnim(key,a.kickSet||"shot");if(k){[r.an,r.i]=once(k);return r}}
  if(an==="slide"){if(A.slide){[r.an,r.i]=once("slide");return r}const k=clamp(t/0.25,0,1);r.an=A.run?"run":"idle";r.i=A.run?2:0;r.rot=-1.1*k;r.dy=0.25*k;return r}
  if(an==="fall"){const k=clamp(t/0.4,0,1);r.an="idle";r.i=0;r.rot=1.35*k;r.dy=0.2*k;return r}
  if(an==="dive"||(an==="jump"&&key==="gk")){const set=A[a.diveSet]?a.diveSet:"dive";[r.an,r.i]=once(set);if(a.at<0)r.i=0;r.dy=set==="dive"?-0.35*Math.sin(clamp(t/0.5,0,1)*Math.PI):0;return r}
  if(an==="jump"){[r.an,r.i]=A.head?once("head"):["idle",0];r.dy=-0.55*Math.sin(clamp(t/0.6,0,1)*Math.PI);return r}
  if(an==="bike"&&A.bike){[r.an,r.i]=once("bike");r.dy=-0.5*Math.sin(clamp(t/0.7,0,1)*Math.PI);return r}
  if(an==="regret"&&A.regret){[r.an,r.i]=once("regret");return r}
  if((an==="stepover"||an==="roulette")&&A[an]){[r.an,r.i]=once(an);return r}
  if(an==="celebrate"){const sv=hasSkill(a.p,"siu")&&A.siu?"siu":"cele";if(A[sv]){[r.an,r.i]=once(sv);return r}r.an="idle";r.i=0;r.dy=-0.35*Math.abs(Math.sin(t*7));return r}
  if(a.moving&&!A.run){r.an="idle";r.i=Math.floor((a.phase||0)*1.2)%A.idle.length;r.dy=-0.04*Math.abs(Math.sin((a.phase||0)*1.6));return r}
  if(a.moving){const set=(A.drib&&scene&&scene.holder===a.role)?"drib":"run";const n=A[set].length;r.an=set;r.i=Math.floor((a.phase||0)*n/5.7)%n;return r}
  [r.an,r.i]=loop("idle",5);return r;
}
// px = chiều cao (pixel) của một cầu thủ đứng thẳng ở vị trí đó
function drawChar(g,a,now,x,y,px,noShadow){
  const key=charKey(a.p),S=SPR[key];
  if(!S||!S.ready){drawSprite(g,a,now,x,y,px/50);return}
  if(!noShadow){g.beginPath();g.ellipse(x,y+1,px*0.3,px*0.09,0,0,7);g.fillStyle="rgba(0,0,0,.3)";g.fill()}
  const r=pickFrame(a,key,now),fr=SPRITE_META[key].anims[r.an][r.i],sc=px/SPRITE_META[key].ref,f=a.face||1;
  g.save();g.translate(x,y+r.dy*px);if(r.rot)g.rotate(r.rot*f);g.scale(f*sc,sc);
  g.drawImage(tinted(key,a.team.color),fr[0],fr[1],fr[2],fr[3],-fr[2]/2,-fr[3],fr[2],fr[3]);g.restore();
}

function drawPlayer(a,now){
  const [x,y,s]=proj(a.x,a.y);const sc=s*0.068;
  drawChar(ctx,a,now,x,y,s*3.3);
  ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="rgba(0,0,0,.8)";
  const ny=y-56*sc;ctx.font=`700 ${Math.max(11,s*0.42)}px 'Be Vietnam Pro',sans-serif`;ctx.strokeText(a.p.n,x,ny);ctx.fillStyle=tierOf(a.p).c;ctx.fillText(a.p.n,x,ny);
  if(a.label){ctx.font=`600 ${Math.max(12,s*0.5)}px 'Be Vietnam Pro',sans-serif`;
    const ly=ny-Math.max(13,s*0.55);ctx.strokeText(a.label,x,ly);ctx.fillStyle="#ffffff";ctx.fillText(a.label,x,ly)}
}
function drawBall(){if(window.MODE==="lobby")return;
  const g=proj(ball.x,ball.y),b=proj(ball.x,ball.y,(ball.h||0)+0.22),r=Math.max(4,g[2]*0.24);
  ctx.beginPath();ctx.ellipse(g[0],g[1],r*1.1,r*0.4,0,0,7);ctx.fillStyle="rgba(0,0,0,.35)";ctx.fill();
  ctx.save();ctx.translate(b[0],b[1]);ctx.rotate(ball.rot||0);ctx.scale(r/7.5,r/7.5);
  ctx.beginPath();ctx.arc(0,0,7.5,0,7);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#222";ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle="#222";ctx.beginPath();for(let i=0;i<5;i++){const q=i*1.2566-1.57;ctx.lineTo(Math.cos(q)*3,Math.sin(q)*3)}ctx.fill();
  for(let i=0;i<5;i++){const q=i*1.2566-1.57;ctx.beginPath();ctx.arc(Math.cos(q)*6.3,Math.sin(q)*6.3,1.7,0,7);ctx.fill()}
  ctx.restore();
}
let parts=[],fx={net:0,shake:0,banner:0};
function puff(x,y,n,c){for(let i=0;i<n;i++)parts.push({x,y,h:0.2,vx:(rnd()-.5)*4,vh:rnd()*2.5,life:0.6+rnd()*0.4,c})}
function drawFx(dt){
  parts=parts.filter(q=>(q.life-=dt)>0);
  for(const q of parts){q.x+=q.vx*dt;q.h=Math.max(0,q.h+q.vh*dt);q.vh-=4*dt;const p=proj(q.x,q.y,q.h);ctx.globalAlpha=clamp(q.life,0,1)*0.7;ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(p[0],p[1],(0.15+(1-q.life)*0.25)*p[2],0,7);ctx.fill()}
  ctx.globalAlpha=1;
  if(fx.banner>0){const k=1-fx.banner/2;ctx.save();ctx.translate(W/2,H*0.55);const s=k<.15?k/.15*1.2:1+Math.sin(k*20)*0.03;ctx.scale(s,s);
    ctx.font="italic 800 150px 'Saira Condensed',Impact,sans-serif";ctx.textAlign="center";ctx.lineWidth=12;ctx.strokeStyle="#7a0d06";ctx.strokeText("GOAL!!",0,50);ctx.fillStyle="#ffd23f";ctx.fillText("GOAL!!",0,50);ctx.restore()}
}

/* ================== BẢNG TÌNH HUỐNG ================== */
const popEl=document.getElementById("pop");
function miniSprite(e,flip){const c=document.createElement("canvas");c.width=78;c.height=102;const g=c.getContext("2d");
  drawChar(g,{p:e.p,team:e.team,face:flip?-1:1,anim:"pose"},0,39,98,88,true);return c}
function popCol(e,flip){const d=document.createElement("div");d.className="pc";
  d.innerHTML=`<span class="nm" style="color:${tierOf(e.p).c}">${e.p.n}</span><span class="ln">Vị trí: ${POSN[roleOf(e.p)]}</span><span class="ln">${e.lab}: <b>${fmt1(e.v)}</b></span>`;d.appendChild(miniSprite(e,flip));return d}
function showPop(pp){
  const L=document.getElementById("popL"),R=document.getElementById("popR2");L.innerHTML="";R.innerHTML="";
  pp.L.forEach(e=>L.appendChild(popCol(e,false)));pp.R.forEach(e=>R.appendChild(popCol(e,true)));
  document.getElementById("popT").textContent=pp.title;document.getElementById("popP").textContent=Math.round(pp.p*100)+"%";
  const rs=document.getElementById("popR");rs.textContent="";rs.className="rs";popEl.classList.add("on")}
function revealPop(pp){const rs=document.getElementById("popR");rs.textContent=pp.ok?"THÀNH CÔNG!":"THẤT BẠI";rs.className="rs "+(pp.ok?"ok":"ko")}
function hidePop(){popEl.classList.remove("on")}

/* ================== DIỄN HOẠT ================== */
let scene=null,stepI=0,stepT=0,ball={x:30,y:34,from:null,to:null,h:0};
const spd=()=>+document.getElementById("spd").value;
function startStep(){
  const st=scene.steps[stepI];stepT=0;
  const byRole=r=>scene.actors.find(a=>a.role===r);
  for(const a of scene.actors){const tg=st.t[a.role];if(tg)a.tx=tg[0],a.ty=tg[1];a.label=null;
    if(a.anim&&!["fall","dive","celebrate"].includes(a.anim))a.anim=null}
  for(const [r,l] of Object.entries(st.label||{})){const k=byRole(r);if(k)k.label=l}
  if(st.ball.fly!==undefined){
    const kr=st.kicker||scene.holder;
    ball.delay=0;
    if(kr){const k=byRole(kr);if(k&&k.anim!=="jump"&&k.anim!=="bike"){k.anim="kick";k.at=0;k.face=Math.sign(st.ball.to[0]-k.x)||k.face;
      k.kickSet=st.kickSet||(st.ball.fly?"pass":"pass");const kd=kickInfo(k);k.kickDur=kd.dur;ball.delay=kd.contact;ball.kickerRole=kr;puff(k.x,k.y,4,"#b9d8a8")}}
    ball.from=[ball.x,ball.y];ball.to=st.ball.to;ball.peak=st.ball.h??1.2;ball.h0=ball.h||0;ball.h1=st.ball.endH||0}else{ball.from=null}
  scene.holder=st.ball.carry||st.ball.fly||null;
  for(const [r,an] of Object.entries(st.anim||{})){const k=byRole(r);if(!k)continue;k.anim=an;k.at=0;
    if(an==="dive"){k.diveDir=Math.sign((st.ball.to?st.ball.to[1]:34)-k.y)||1;k.diveSet=(st.ball.endH??0)>1.1?"dive":"catch";k.at=-(ball.delay||0)}
    if(an==="jump"&&roleOf(k.p)==="TM")k.diveSet="dive";
    if(an==="slide"||an==="fall"||an==="dive")puff(k.x,k.y,8,"#cfe3c0")}
  addLog(st.txt,st.goal);
  if(st.popup){showPop(st.popup);M.hold=2.4;M.holdPop=st.popup}
  if(st.goal){M.score[scene.side]++;goalMor(scene.side,scene.scorer);render();setTimeout(()=>{fx.net=1;fx.shake=1;fx.banner=2},st.dur*600/spd())}
}
let last=0;
function frame(ts){
  const dt=Math.min(0.05,(ts-last)/1000||0)*spd();last=ts;
  if(M.hold>0&&scene){
    M.hold-=dt;if(M.hold<0.9&&M.holdPop){revealPop(M.holdPop);M.holdPop=null}
    if(M.hold<=0)hidePop();
    for(const a of scene.actors)a.moving=false;
  }else if(scene&&stepI<scene.steps.length){
    const st=scene.steps[stepI];
    if(ball.delay>0){ball.delay-=dt;const kk=scene.actors.find(a=>a.role===ball.kickerRole);if(kk){ball.x=kk.x+0.7*(kk.face||1);ball.y=kk.y+0.3}}
    else stepT+=dt;
    for(const a of scene.actors){
      a.at=(a.at||0)+dt;if(a.anim==="kick"&&a.at>(a.kickDur||0.4))a.anim=null;if(a.anim==="jump"&&a.at>0.7&&roleOf(a.p)!=="TM")a.anim=null;
      if(a.tx==null){a.moving=false;continue}
      const lock=a.anim==="fall";
      const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy),v=speedOf(a.p)*dt*1.15*(a.anim==="kick"?0.4:1);
      const mv=lock?0:Math.min(d,v);
      if(d>0.001){a.x+=dx/d*mv;a.y+=dy/d*mv}
      a.moving=mv>dt*0.5;a.phase=(a.phase||0)+mv*1.9;
      if(a.moving&&Math.abs(dx)>0.05&&!a.anim)a.face=Math.sign(dx);
      else if(!a.moving&&!a.anim)a.face=Math.sign(ball.x-a.x)||a.face||1;
    }
    const k=clamp(stepT/st.dur,0,1);
    if(st.ball.carry){const c=scene.actors.find(a=>a.role===st.ball.carry);const dir=c.face||1;
      if(c.role==="G"){ball.x=c.x+0.3*dir;ball.y=c.y;ball.h=0.9}
      else{ball.x=c.x+(0.7+Math.abs(Math.sin(c.phase||0))*0.4)*dir;ball.y=c.y+0.3;ball.h=0}
      ball.rot=(ball.rot||0)+(c.moving?dt*12*dir:0)}
    else if(ball.from){ball.x=ball.from[0]+(ball.to[0]-ball.from[0])*k;ball.y=ball.from[1]+(ball.to[1]-ball.from[1])*k;ball.h=ball.h0+(ball.h1-ball.h0)*k+Math.sin(k*Math.PI)*ball.peak;ball.rot=(ball.rot||0)+dt*25}
    if(stepT>=st.dur){stepI++;if(stepI<scene.steps.length)startStep();else endScene()}
  }
  if(window.MODE==="lobby")camX=33+9*Math.sin(ts/7000);else camX+=(clamp(ball.x,22,44)-camX)*Math.min(1,dt*2);
  fx.net=Math.max(0,fx.net-dt*0.8);fx.shake=Math.max(0,fx.shake-dt*2);fx.banner=Math.max(0,fx.banner-dt*0.7);
  ctx.save();if(fx.shake>0)ctx.translate((rnd()-.5)*14*fx.shake,(rnd()-.5)*14*fx.shake);
  drawStadium();drawGoal();
  const now=ts/1000;
  const items=(scene?scene.actors.map(a=>({y:a.y,d:()=>drawPlayer(a,now)})):[]).concat([{y:ball.y+0.01,d:drawBall}]);
  items.sort((p,q)=>p.y-q.y).forEach(i=>i.d());
  drawPosts();drawFx(dt);ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ================== VÒNG TRẬN ================== */
// S.Bền cao → mất thể lực chậm hơn
function tickMinutes(n){M.min=Math.min(90,M.min+n);T.home.players.concat(T.away.players).forEach(p=>{p.sta=clamp(p.sta-n*0.45*(1-0.5*Math.min(1,p.ben/tierOf(p).cap)),0,100)})}
const mmss=(m,s)=>`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
function narrate(){
  const [h,a]=M.score,m=M.min,H=T.home.name,A=T.away.name,mh=M.mor?M.mor[0]:500,ma=M.mor?M.mor[1]:500;
  const up=mh>=ma?H:A,lead=h>a?H:A,trail=h>a?A:H,d=Math.abs(h-a);
  if(M.done)return h===a?`Trận đấu kết thúc với tỉ số hòa ${h}:${a}. Hai đội chia nhau mỗi bên một điểm.`:`Trận đấu kết thúc! ${lead} giành chiến thắng ${h}:${a} trước ${trail}.`;
  if(m<10)return`Trận đấu vừa mới bắt đầu, tỉ số trên sân là ${h}:${a}. Hai bên đều rất thận trọng, đang từ từ thăm dò lẫn nhau.`;
  if(m>=42&&m<=48)return`Hiệp một sắp khép lại, tỉ số đang là ${h}:${a}. ${h===a?`${up} chơi lấn lướt hơn nhưng chưa tạo được khác biệt.`:`${lead} đang nắm lợi thế trước giờ nghỉ.`}`;
  if(m>=80)return h===a?`Những phút cuối trận, tỉ số vẫn là ${h}:${a}. Cả hai đội đều dồn lên tìm bàn thắng quyết định.`:d===1?`Những phút cuối căng thẳng! ${trail} dồn toàn lực tìm bàn gỡ, ${lead} lùi sâu bảo vệ tỉ số ${h}:${a}.`:`${lead} gần như đã nắm chắc chiến thắng với tỉ số ${h}:${a}.`;
  if(h===a)return`Thế trận giằng co, tỉ số vẫn là ${h}:${a}. ${up} với tinh thần cao hơn đang dần chiếm thế chủ động.`;
  return d>=2?`${lead} đang chơi áp đảo và dẫn ${h}:${a}. ${trail} cần thay đổi để trở lại trận đấu.`:`${lead} đang tạm dẫn ${h}:${a}. ${trail} đẩy cao đội hình tìm bàn gỡ.`;
}
function tacHtml(t,cls){const c=halfTac(t);return`<div class="it ${cls}"><div>Thế trận: ${tacOf(t).form}</div><div>Tấn công: ${c.atk} Lv.${c.atkLv}</div><div>Phòng thủ: ${c.def} Lv.${c.defLv}</div><div class="ad">Công ${M.ad?M.ad[cls==="l"?0:1].a:"–"} · Thủ ${M.ad?M.ad[cls==="l"?0:1].d:"–"}</div></div>`}
function showIdle(clock){const el=document.getElementById("idle");
  el.innerHTML=`<div class="ig">${tacHtml(T.home,"l")}<div class="ic"><div class="il">Thời gian thi đấu</div><div class="iclk" id="iclk">${clock}</div></div>${tacHtml(T.away,"r")}</div><p class="inar">${narrate()}</p>`;
  el.hidden=false;document.getElementById("clk").textContent=clock}
const hideIdle=()=>{document.getElementById("idle").hidden=true};
// Giữa hai pha: đồng hồ chạy từ phút cũ tới phút mới, rồi mới vào tình huống
function playNext(){
  if(M.done||M.busy)return;
  M.busy=true;hidePop();scene=null;
  const n=M.queue?1:4+Math.floor(rnd()*7),from=M.min,to=Math.min(90,from+n),dur=1600/spd(),t0=performance.now();
  showIdle(mmss(from,0));
  const tick=()=>{const k=Math.min(1,(performance.now()-t0)/dur),tot=Math.round((from+(to-from)*k)*60),c=mmss(Math.floor(tot/60),tot%60);
    const e=document.getElementById("iclk");if(e)e.textContent=c;document.getElementById("clk").textContent=c;
    if(k<1)requestAnimationFrame(tick);else{M.busy=false;startScene(n)}};
  requestAnimationFrame(tick);
}
function startScene(n){
  tickMinutes(n);
  if(M.min>=90){finish();return}
  hideIdle();
  scene=buildScene();scene.actors.forEach(a=>{a.p.sta=clamp(a.p.sta-1.5,0,100);M.inv.add(a.p)});
  M.busy=true;stepI=0;const bs=scene.ballStart||[scene.actors[0].x+0.7,scene.actors[0].y+0.3];ball.x=bs[0];ball.y=bs[1];ball.h=0;camX=clamp(ball.x,22,44);startStep();render();
}
function endScene(){M.busy=false;scene=null;renderSquad();showIdle(document.getElementById("clk").textContent);if(M.auto)setTimeout(playNext,500/spd())}
function goalMor(side,scorer){M.mor[side]=Math.min(950,M.mor[side]+40);M.mor[1-side]=Math.max(100,M.mor[1-side]-25);scorer._goals=(scorer._goals||0)+1}
function finish(){M.done=true;M.auto=false;M.min=90;M.queue=null;hidePop();
  const won=M.score[0]>M.score[1],draw=M.score[0]===M.score[1];T.club.gold+=won?20000:draw?8000:3000;T.club.phieu+=won?10:draw?5:2;
  // điểm huấn luyện sau trận: ra sân +200, tham gia tình huống +50, ghi bàn +150/bàn, đội thắng +100
  T.home.players.concat(T.away.players).forEach(p=>{const w=(p._side===0&&won)||(p._side===1&&M.score[1]>M.score[0]);p.tp=(p.tp||0)+200+(M.inv.has(p)?50:0)+(p._goals||0)*150+(w?100:0);p._goals=0});
  if(window.onMatchEnd)onMatchEnd();render();addLog(`Hết trận: ${T.home.name} ${M.score[0]} – ${M.score[1]} ${T.away.name}. Cầu thủ nhận điểm huấn luyện.`,true);saveLocal();scene=null;showIdle(mmss(90,0));if(typeof db!=="undefined"&&db)fbSave(true).catch(()=>{});if(window.mgrRender)mgrRender()}
function fastSim(){
  M.auto=false;scene=null;M.hold=0;hidePop();
  while(M.min<90){tickMinutes(M.queue?1:4+Math.floor(rnd()*7));if(M.min>=90)break;const s=buildScene();s.actors.forEach(a=>a.p.sta-=1.5);
    s.actors.forEach(a=>M.inv.add(a.p));if(s.res==="goal"){M.score[s.side]++;goalMor(s.side,s.scorer);addLog(`${s.scorer.n} ghi bàn cho ${s.atk.name}`,true)}}
  M.busy=false;finish();renderSquad();
}
const fmt=n=>n.toLocaleString("vi-VN");
function badge(svg,team){const c=team.color,ini=team.name.split(" ").map(w=>w[0]).join("").slice(0,3);
  svg.innerHTML=`<path d="M20 2 L36 7 V20 C36 30 28 36 20 38 C12 36 4 30 4 20 V7 Z" fill="${c}" stroke="#fff" stroke-width="2"/><path d="M20 6 L32 10 V20 C32 27 26 32 20 34 Z" fill="rgba(0,0,0,.2)"/><text x="20" y="25" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="800" font-size="12" fill="#fff">${ini}</text>`}
function render(){if(window.MODE==="lobby"&&window.lobbyRender)setTimeout(lobbyRender,0);
  document.getElementById("sc").textContent=`${M.score[0]}:${M.score[1]}`;
  document.getElementById("hn").textContent=T.home.name;document.getElementById("an").textContent=T.away.name;
  badge(document.getElementById("hb"),T.home);badge(document.getElementById("ab"),T.away);
  const mh=M.mor?M.mor[0]:500,ma=M.mor?M.mor[1]:500;
  document.getElementById("mh").style.width=clamp(mh/10,0,100)+"%";document.getElementById("ma").style.width=clamp(ma/10,0,100)+"%";
  document.getElementById("mht").textContent=`Tinh thần thi đấu: ${mh}`;document.getElementById("mat").textContent=`Tinh thần thi đấu: ${ma}`;
  document.getElementById("gold").textContent=fmt(T.club.gold);document.getElementById("xu").textContent=fmt(T.club.xu);document.getElementById("phieu").textContent=fmt(T.club.phieu);
}
function skillList(p){if(!(p.skills||[]).length)return"<b>Kỹ năng:</b> chưa sở hữu kỹ năng nào.";
  return"<b>Kỹ năng:</b> "+p.skills.map(s=>{const k=SKILLS[s.id],on=(p.star||0)>=s.star;return`<span class="sk ${on?"on":""}" title="${k.desc}">${on?"✔":"🔒"} ${k.n} <small>(cần ★${s.star})</small></span>`}).join(" ")}
const COLS=["toc","sut","re","chuyen","xoac","kchien","cuu"];
function renderSquad(){
  const row=(t,ti,p,i)=>`<tr><td class="nm"><i class="tdot" style="background:${t.color}" title="${t.name}"></i><button data-t="${ti}" data-i="${i}" style="color:${tierOf(p).c}">${p.n}</button>${p.star?` <small style="color:${STAR_COL[p.star]}">★${p.star}</small>`:""}</td><td class="nm">${p.pos}${(t.subs||[]).includes(p)?` <small class="dub">dự bị</small>`:""}</td><td class="nm"><span class="tier" style="background:${tierOf(p).c}">${tierOf(p).n}</span></td><td>${fmt1(overall(p))}</td>${COLS.map(k=>`<td>${Math.round(p[k])}</td>`).join("")}<td><span class="sta"><i style="width:${p.sta}%"></i></span></td></tr>`;
  document.getElementById("sq").innerHTML=`<tr><th>Cầu thủ</th><th>VT</th><th>Bậc</th><th>Thực lực</th>${COLS.map(k=>`<th>${LBL[k]}</th>`).join("")}<th>Thể lực</th></tr>`+squad(T.home).map((p,i)=>row(T.home,"home",p,i)).join("")+squad(T.away).map((p,i)=>row(T.away,"away",p,i)).join("");
}
/* ---------- Thẻ cầu thủ ---------- */
const modal=document.getElementById("modal");
document.getElementById("sq").addEventListener("click",e=>{const b=e.target.closest("button[data-t]");if(b)openCard(T[b.dataset.t],+b.dataset.i)});
function openCard(team,i){
  const p=squad(team)[i];const top=Object.entries(OVR[p.pos]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
  const at=k=>`<div class="at" title="${ATTR.find(a=>a[0]===k)[2]}"><span>${LBL[k]}</span><span class="b"><i style="width:${clamp(p[k]/7,2,100)}%"></i></span><span class="v ${top.includes(k)?"hi":""}">${fmt1(p[k])}</span></div>`;
  modal.innerHTML=`<div class="pcard" role="dialog" aria-label="Thẻ cầu thủ ${p.n}"><div class="hd"><span>Cầu thủ</span><button id="mclose" aria-label="Đóng">✕</button></div>
   <div class="bd"><div><div class="av" id="mav"></div>
    <div class="info"><span>Tên: <span style="color:${tierOf(p).c};font-weight:700;text-shadow:0 1px 0 #0003">${p.n}</span> · Bậc <b style="color:${tierOf(p).c}">${tierOf(p).n}</b></span><span>Vị trí: ${POSN[p.pos]} · Đội: ${team.name}</span><span>Thuận: Chân ${p.chan==="T"?"trái":"phải"}</span>
    <span>Độ kích thích: ${Math.round(p.kt)}% · Kích: ${p.ktUsed}/10</span><span>Sao: ${starTxt(p.star)} · Thích nghi ${p.tn}%</span><span>Điểm huấn luyện: ${fmt(Math.round(p.tp))}</span><span>Thể lực trận: ${Math.round(p.sta)}%</span><span>Thực lực: <b>${fmt1(overall(p))}</b> · Max ${fmt1(overallMax(p))}</span></div></div>
    <div class="attrs"><div>${ATTR_COL1.map(at).join("")}</div><div>${ATTR_COL2.map(at).join("")}</div>
     <div class="use">${skillList(p)}</div>
     <div class="use">Số màu xanh là chỉ số quan trọng nhất của vị trí này. Di chuột vào từng dòng để xem chỉ số dùng trong pha nào.</div></div></div>
    <div class="cbtn"><button data-go="plan">Huấn luyện</button><button data-go="kich">Kích thích</button><button data-go="imp">Cải tiến</button><button data-go="star">Lên sao</button></div></div>`;
  modal.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{modal.hidden=true;mgrOpen(team,i,b.dataset.go)});
  const c=document.createElement("canvas");c.width=110;c.height=140;drawChar(c.getContext("2d"),{p,team,face:1,anim:"pose"},0,55,134,120,true);document.getElementById("mav").appendChild(c);
  modal.hidden=false;document.getElementById("mclose").focus();
}
modal.addEventListener("click",e=>{if(e.target===modal||e.target.id==="mclose")modal.hidden=true});
document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.hidden=true});


/* ================== QUẢN LÝ CẦU THỦ: Kế hoạch · Kích · Cải tiến · Lên sao ================== */
const STAR_COL=["#9aa4ae","#3b82f6","#3b82f6","#3b82f6","#3b82f6","#a855f7","#a855f7","#a855f7","#f59e0b","#f59e0b","#ef4444"];
const starTxt=n=>n?`<span style="color:${STAR_COL[n]};font-weight:800">★${n}</span>`:"☆0";
const STAR_RATE=[100,100,95,90,80,70,60,50,40,30];       // % thành công lên từ cấp n
const KICH_COST=5000, REDO_COST=1, IMP_COST=20, TP_PACK=[10,1000], BH_PRICE=10;
const MG={team:"home",i:0,tab:"plan",msg:"",preview:null,impSel:null,bh:0,pay:"phieu"};
const all=()=>squad(T[MG.team]), cur=()=>all()[MG.i];
const mgEl=document.getElementById("mgr");
function say(t,ok=true){MG.msg=`<span class="${ok?"mok":"mko"}">${t}</span>`}
function pay(kind,n){const c=T.club;if((c[kind]||0)<n){say(`Không đủ ${kind==="xu"?"Xu":kind==="phieu"?"Phiếu":"Vàng"}: cần ${fmt(n)}, đang có ${fmt(c[kind]||0)}.`,false);return false}c[kind]-=n;return true}
function after(){const p=cur();clampBase(p);refresh(p);render();renderSquad();saveLocal();mgrRender()}

// ---- Kế hoạch huấn luyện: chia đều điểm vào các chỉ số được chọn cho tới khi chạm giới hạn ----
const TP_PER=0.04; // 1 điểm huấn luyện = +0.04 chỉ số
function train(p){
  let pts=Math.floor(p.tp),used=0;const ks=p.plan.filter(k=>p.base[k]<maxOf(p,k));
  if(!ks.length){say("Các chỉ số trong kế hoạch đã đạt giới hạn. Hãy Kích thích hoặc Lên sao để nâng giới hạn, hoặc chọn thêm chỉ số.",false);return}
  let live=ks.slice();
  while(pts>=10&&live.length){for(const k of live){if(pts<10)break;const room=maxOf(p,k)-p.base[k];if(room<=0)continue;const add=Math.min(room,10*TP_PER);p.base[k]=r1(p.base[k]+add);const c=Math.ceil(add/TP_PER);pts-=c;used+=c}
    live=live.filter(k=>p.base[k]<maxOf(p,k))}
  p.tp-=used;if(used&&window.flag)flag("train");say(`Đã dùng ${fmt(used)} điểm huấn luyện cho ${ks.map(k=>LBL[k]).join(", ")}.${live.length?"":" Các chỉ số này đã chạm giới hạn."}`)
}
// ---- Kích thích: mỗi lần +1%–7% độ kích thích (tối đa 10 lần) ----
function rollKich(){const r=rnd();return r<.3?1+Math.floor(rnd()*2):r<.75?3+Math.floor(rnd()*2):r<.95?5+Math.floor(rnd()*2):7}
function kich(p){
  if(p.ktUsed>=10){say("Cầu thủ đã dùng hết 10 lần kích thích.",false);return}
  if(p.kt>=100){say("Độ kích thích đã đạt 100%.",false);return}
  if(!pay("gold",KICH_COST))return;
  const v=Math.min(rollKich(),100-p.kt);p.kt+=v;p.ktLast=v;p.ktUsed++;
  const hadImp=Object.keys(p.imp).length;p.imp={};
  if(window.flag)flag("kich");say(`Kích thích lần ${p.ktUsed}: +${v}% → ${p.kt}%.${hadImp?" Hiệu quả Cải tiến cũ đã bị hủy.":""}`)
}
function redo(p){
  if(!p.ktLast){say("Chưa có lần kích thích nào để làm lại.",false);return}
  if(p.ktLast>=7){say("Lần này đã đạt mức tối đa 7%, không cần làm lại.",false);return}
  if(!pay(MG.pay,REDO_COST))return;
  p.kt-=p.ktLast;const v=Math.min(rollKich(),100-p.kt);p.kt+=v;
  say(`Làm lại: ${p.ktLast}% → ${v}%. Độ kích thích hiện tại ${p.kt}%.`,v>=p.ktLast);p.ktLast=v;
}
function undoKich(p){if(!p.ktLast){say("Không có lần kích thích nào để bỏ.",false);return}p.kt-=p.ktLast;say(`Đã bỏ lần kích thích vừa rồi (−${p.ktLast}%). Lần kích đó vẫn tính vào số lần đã dùng.`);p.ktLast=0}
// ---- Cải tiến: chia ngẫu nhiên một lượng điểm vào các chỉ số được đánh dấu ----
const impPool=p=>r1(overall(p)*0.045);
function improve(p){
  const ks=MG.impSel;if(!ks.length){say("Hãy đánh dấu ít nhất một chỉ số để cải tiến.",false);return}
  if(!pay(MG.pay,IMP_COST))return;
  const pool=impPool(p),w=ks.map(()=>0.3+rnd()),sw=w.reduce((a,b)=>a+b,0),q=0.55+rnd()*0.45;
  MG.preview=Object.fromEntries(ks.map((k,j)=>[k,Math.max(0.5,Math.round(pool*q*w[j]/sw*2)/2)]));
  say(`Kết quả cải tiến: ${ks.map(k=>`${LBL[k]} +${MG.preview[k]}`).join(", ")}. Bấm Lưu để thay cho điểm cải tiến hiện tại.`)
}
function saveImp(p){if(!MG.preview){say("Chưa có kết quả cải tiến mới để lưu.",false);return}p.imp=MG.preview;MG.preview=null;say("Đã lưu điểm cải tiến.")}
// ---- Lên sao: dùng thẻ cầu thủ, tỉ lệ giảm dần theo cấp, bảo hiểm +5%/tờ ----
const starRate=p=>p.star>=10?0:Math.min(100,STAR_RATE[p.star]+MG.bh*5);
function starUp(p){
  if(p.star>=10){say("Cầu thủ đã đạt cấp sao tối đa.",false);return}
  if(T.club.the<1){say("Hết thẻ cầu thủ.",false);return}
  if(MG.bh>(T.club.bh||0)){say("Không đủ giấy bảo hiểm.",false);return}
  const rate=starRate(p);T.club.the--;T.club.bh-=MG.bh;const used=MG.bh;MG.bh=0;
  if(rnd()*100<rate){p.star++;
    // tăng các chỉ số mấu chốt của vị trí, nhiều hay ít theo tính thích nghi
    const keys=Object.entries(OVR[p.pos]).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
    const gains=keys.map(k=>{const g=r1(p.pot[k]*STAR_GAIN*(0.5+0.5*p.tn/100));p.starB[k]=r1((p.starB[k]||0)+g);return`${LBL[k]} +${g}`});
    const un=(p.skills||[]).filter(s=>s.star===p.star).map(s=>SKILLS[s.id].n);
    if(window.flag)flag("star");say(`Lên sao thành công: ★${p.star}! ${gains.join(", ")} (thích nghi ${p.tn}%).${un.length?` Mở khóa kỹ năng: ${un.join(", ")}!`:""}`)}
  else say(`Lên sao thất bại (tỉ lệ ${rate}%). Mất 1 thẻ cầu thủ${used?` và ${used} giấy bảo hiểm`:""}.`,false)
}

/* ---------- giao diện ---------- */
function avatar(p,team,w=96,h=120){const c=document.createElement("canvas");c.width=w;c.height=h;drawChar(c.getContext("2d"),{p,team,face:1,anim:"pose"},0,w/2,h-6,h*0.86,true);return c}
function mgrOpen(team,i,tab){MG.team=team===T.home?"home":team===T.away?"away":team;MG.i=i;MG.tab=tab||MG.tab;MG.msg="";MG.preview=null;MG.impSel=null;mgrRender();document.getElementById("mgr").scrollIntoView({behavior:"smooth",block:"start"})}
function listCols(p){const o=fmt1(overall(p)),mx=fmt1(overallMax(p));
  if(MG.tab==="plan")return[POSN[p.pos],fmt(Math.round(p.tp))];
  if(MG.tab==="kich")return[o,mx,10-p.ktUsed];
  if(MG.tab==="imp")return[o,mx,r1(Object.values(p.imp).reduce((a,b)=>a+b,0))];
  return[o,starTxt(p.star)];}
const HEAD={plan:["Vị trí","Điểm còn dư"],kich:["Th.lực","Max","Số lần dư"],imp:["Th.lực","Max","Tổng điểm"],star:["Th.lực","Sao"]};
function mgrRender(){
  const p=cur(),team=T[MG.team];if(!MG.impSel)MG.impSel=Object.keys(p.imp).length?Object.keys(p.imp):p.plan.slice(0,3);
  const tabs=[["plan","Kế hoạch"],["kich","Kích"],["imp","Cải tiến"],["star","Lên sao"]];
  const rows=all().map((q,j)=>`<tr class="${j===MG.i?"sel":""}" data-j="${j}"><td><button class="pn" data-j="${j}" style="color:${tierOf(q).c};text-shadow:0 0 1px #0006">${q.n}${q.star?` <small style="color:${STAR_COL[q.star]}">★${q.star}</small>`:""}</button></td>${listCols(q).map(v=>`<td>${v}</td>`).join("")}</tr>`).join("");
  let right="";
  const head=`<div class="mh"><div class="mav" id="mgav"></div><div class="mi"><b style="color:${tierOf(p).c}">${p.n}</b><span>Bậc: <b style="color:${tierOf(p).c}">${tierOf(p).n}</b> (trần ${tierOf(p).cap})</span><span>Th.lực: <b>${fmt1(overall(p))}</b> / Max ${fmt1(overallMax(p))}</span><span>Vị trí: ${POSN[p.pos]} · Tuổi ${p.age}</span><span>Cao ${p.cao}cm · Nặng ${p.nang}kg</span><span>Kích thích ${p.kt}% · ${starTxt(p.star)}</span></div></div>`;
  const statRow=(k,extra)=>{const mx=maxOf(p,k),full=p.base[k]>=mx-0.05;return`<div class="sr"><span class="sl">${LBL[k]}</span><span class="sb2"><i style="width:${clamp(p.base[k]/Math.max(1,p.pot[k])*100,1,100)}%" class="${full?"full":""}"></i><em style="left:${clamp(mx/Math.max(1,p.pot[k])*100,0,100)}%"></em></span>${extra}</div>`};
  const order=[...ATTR_COL1,...ATTR_COL2];
  if(MG.tab==="plan"){
    right=head+`<div class="sgrid">${order.map(k=>statRow(k,`<span class="sv">${fmt1(p.base[k])}</span><input type="checkbox" id="pl_${k}" data-pl="${k}" ${p.plan.includes(k)?"checked":""} aria-label="Luyện ${LBL[k]}">`)).join("")}</div>
     <div class="mrow"><span>Điểm huấn luyện: <b>${fmt(Math.round(p.tp))}</b> (1 điểm = +${TP_PER} chỉ số)</span><button data-act="all">Chọn/Bỏ hết</button></div>
     <div class="mrow"><button class="pri" data-act="train">Thực hiện</button><button data-act="buytp">Cấp tốc nhận điểm (${TP_PACK[0]} Phiếu → ${fmt(TP_PACK[1])} điểm)</button></div>
     <p class="hint">Thanh đỏ là chỉ số đã luyện, vạch trắng là giới hạn hiện tại theo độ kích thích. Thanh đỏ đậm là đã chạm giới hạn. Kế hoạch được lưu ngay khi đánh dấu.</p>`;
  }else if(MG.tab==="kich"){
    right=head+`<div class="sgrid">${order.map(k=>`<div class="sr"><span class="sl">${LBL[k]}</span><span class="sv w">${fmt1(p.base[k])} / ${fmt1(maxOf(p,k))}</span></div>`).join("")}</div>
     <div class="kbox"><div>Độ kích thích hiện tại: <b>${p.kt}%</b></div><div>Phạm vi mỗi lần kích thích: 1%–7%</div>
      <div>Đã kích thích: <b>${p.ktUsed}/10</b> lần · Có thể kích thích thêm: ${10-p.ktUsed} lần</div>
      <div>Kích: tốn ${fmt(KICH_COST)} vàng · Làm lại: tốn <label><input type="radio" name="pay" id="pay_xu" value="xu" ${MG.pay==="xu"?"checked":""}> ${REDO_COST} Xu</label> <label><input type="radio" name="pay" id="pay_ph" value="phieu" ${MG.pay==="phieu"?"checked":""}> ${REDO_COST} Phiếu</label></div>
      <div class="mrow"><button class="pri" data-act="kich">Kích</button><button data-act="redo" ${p.ktLast&&p.ktLast<7?"":"disabled"}>Làm lại (lần vừa rồi +${p.ktLast||0}%)</button><button data-act="undo" ${p.ktLast?"":"disabled"}>Bỏ</button></div></div>
     <p class="hint">Kích thích nâng giới hạn của mọi chỉ số (giới hạn = tiềm năng × độ kích thích). Sau khi kích, sang tab Kế hoạch để luyện lên. Kích lần mới sẽ hủy hiệu quả Cải tiến.</p>`;
  }else if(MG.tab==="imp"){
    right=head+`<div class="sgrid">${order.map(k=>`<div class="sr"><span class="sl"><label><input type="checkbox" id="im_${k}" data-im="${k}" ${MG.impSel.includes(k)?"checked":""}> ${LBL[k]}</label></span><span class="sv w">${fmt1(p[k])}${p.imp[k]?` <small class="mok">(+${p.imp[k]})</small>`:""}${MG.preview&&MG.preview[k]?` <small class="nw">→ +${MG.preview[k]}</small>`:""}</span></div>`).join("")}</div>
     <div class="kbox"><div>Điểm cải tiến hiện tại: ${Object.keys(p.imp).length?Object.entries(p.imp).map(([k,v])=>`${LBL[k]} +${v}`).join(", "):"chưa có"}</div>
      <div>Thực lực cầu thủ là <b>${fmt1(overall(p))}</b>. Tổng điểm lớn nhất có thể: <b>${impPool(p)}</b></div>
      <div>Cải tiến tốn: <label><input type="radio" name="pay" id="pay_xu" value="xu" ${MG.pay==="xu"?"checked":""}> ${IMP_COST} Xu</label> <label><input type="radio" name="pay" id="pay_ph" value="phieu" ${MG.pay==="phieu"?"checked":""}> ${IMP_COST} Phiếu</label></div>
      <div class="mrow"><button class="pri" data-act="imp">Cải tiến</button><button data-act="saveimp" ${MG.preview?"":"disabled"}>Lưu</button></div></div>
     <p class="hint">Cầu thủ có thực lực càng cao thì điểm cải tiến càng lớn. Sau khi kích thích lần mới, hiệu quả cải tiến sẽ biến mất, cần cải tiến lại.</p>`;
  }else{
    const rate=starRate(p);
    right=head+`<div class="kbox star"><h4>Lên sao</h4><div>Số thẻ cầu thủ còn lại: <b class="r">${T.club.the}</b></div>
      <div class="mrow ctr"><span>Cấp hiện tại<br>${starTxt(p.star)}</span><span>→</span><span>Cấp tiếp theo<br>${p.star<10?starTxt(p.star+1):"Tối đa"}</span></div>
      <div class="r">Xác suất thăng cấp thành công: ${rate}%</div>
      <div class="mrow"><label for="bhn">Sử dụng bảo hiểm (+5%/tờ, đang có ${T.club.bh||0}):</label><input id="bhn" type="number" min="0" max="${T.club.bh||0}" value="${MG.bh}" style="width:4em"><button data-act="buybh">Mua 1 tờ (${BH_PRICE} Xu)</button></div>
      <div>Tính thích nghi: <b>${p.tn}%</b>. Mỗi cấp tăng 4 chỉ số mấu chốt của vị trí (${Object.entries(OVR[p.pos]).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>LBL[x[0]]).join(", ")}), thích nghi càng cao tăng càng nhiều.</div>
      <div class="mrow"><button class="pri" data-act="star" ${p.star>=10?"disabled":""}>Xác định</button></div></div>
     <div class="kbox">${skillList(p)}</div>`;
  }
  mgEl.innerHTML=`<div class="gw"><div class="gh">GOAL · Quản lý cầu thủ <span class="cur">Vàng ${fmt(T.club.gold)} · Xu ${fmt(T.club.xu)} · Phiếu ${fmt(T.club.phieu)}</span></div>
   <div class="gt">${tabs.map(([k,l])=>`<button class="${MG.tab===k?"on":""}" data-tab="${k}">${l}</button>`).join("")}
    <select id="mgteam" aria-label="Chọn đội"><option value="home" ${MG.team==="home"?"selected":""}>${T.home.name}</option><option value="away" ${MG.team==="away"?"selected":""}>${T.away.name}</option></select></div>
   <div class="gb"><div class="gl"><table><tr><th>Tên cầu thủ</th>${HEAD[MG.tab].map(h=>`<th>${h}</th>`).join("")}</tr>${rows}</table></div>
   <div class="gr">${right}<div class="msg" role="status">${MG.msg}</div></div></div></div>`;
  document.getElementById("mgav").appendChild(avatar(p,team));
}
mgEl.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;const p=cur();
  if(b.dataset.tab){MG.tab=b.dataset.tab;MG.msg="";MG.preview=null;mgrRender();return}
  if(b.dataset.j!==undefined){MG.i=+b.dataset.j;MG.msg="";MG.preview=null;MG.impSel=null;mgrRender();return}
  const a=b.dataset.act;if(!a)return;
  if(a==="all"){p.plan=p.plan.length===ATTR.length?[]:ATTR.map(x=>x[0]);MG.msg=""}
  else if(a==="train")train(p);
  else if(a==="buytp"){if(pay("phieu",TP_PACK[0])){p.tp+=TP_PACK[1];say(`Nhận ${fmt(TP_PACK[1])} điểm huấn luyện.`)}}
  else if(a==="kich")kich(p);else if(a==="redo")redo(p);else if(a==="undo")undoKich(p);
  else if(a==="imp")improve(p);else if(a==="saveimp")saveImp(p);
  else if(a==="buybh"){if(pay("xu",BH_PRICE)){T.club.bh=(T.club.bh||0)+1;say("Đã mua 1 giấy bảo hiểm.")}}
  else if(a==="star")starUp(p);
  after();
});
mgEl.addEventListener("change",e=>{const t=e.target,p=cur();
  if(t.dataset.pl){const k=t.dataset.pl;p.plan=t.checked?[...new Set([...p.plan,k])]:p.plan.filter(x=>x!==k);saveLocal();mgrRender()}
  else if(t.dataset.im){const k=t.dataset.im;MG.impSel=t.checked?[...new Set([...MG.impSel,k])]:MG.impSel.filter(x=>x!==k)}
  else if(t.name==="pay")MG.pay=t.value;
  else if(t.id==="bhn"){MG.bh=clamp(Math.floor(+t.value||0),0,T.club.bh||0);mgrRender()}
  else if(t.id==="mgteam"){MG.team=t.value;MG.i=0;MG.msg="";MG.impSel=null;mgrRender()}});
window.mgrRender=mgrRender;

const LU={sel:null,half:1,msg:""};
const luEl=document.getElementById("lineup");
function jersey(color,num,dim){return`<svg viewBox="0 0 40 40" class="jz" aria-hidden="true"><path d="M12 4 L6 8 L2 16 L8 19 L10 15 L10 36 L30 36 L30 15 L32 19 L38 16 L34 8 L28 4 Q20 9 12 4 Z" fill="${color}" stroke="#0008" stroke-width="1.2" opacity="${dim?0.45:1}"/><text x="20" y="28" text-anchor="middle" font-family="Saira Condensed,Impact,sans-serif" font-weight="800" font-size="12" fill="#fff" stroke="#0006" stroke-width=".6">${num}</text></svg>`}
const numOf=p=>(hashN(p.n)%23)+1;
function swapLU(a,b){const t=T.home;if(!t.subs)t.subs=[];
  const arr=k=>k.kind==="slot"?t.players:t.subs;
  if(a.kind===b.kind&&a.i===b.i)return;
  const A=arr(a),B=arr(b),pa=A[a.i],pb=B[b.i];
  if(!pa&&!pb)return;
  if(a.kind==="sub"&&!pa){ // kéo vào ô ghế trống
    if(b.kind==="slot"){LU.msg="Vị trí trên sân không được để trống: hãy đổi với một cầu thủ dự bị.";return}
    B.splice(b.i,1);A.push(pb)}
  else if(b.kind==="sub"&&!pb){if(a.kind==="slot"){LU.msg="Vị trí trên sân không được để trống: hãy đổi với một cầu thủ dự bị.";return}A.splice(a.i,1);B.push(pa)}
  else{A[a.i]=pb;B[b.i]=pa}
  applyLineup(t);LU.msg="";
  const moved=[pa,pb].filter(Boolean).map(p=>p.n).join(" ⇄ ");
  if(typeof M!=="undefined"&&M&&M.min>0&&!M.done)addLog(`Thay đổi đội hình: ${moved}`);
  afterLU()}
function afterLU(){if(window.flag)flag("lineup");saveLocal();if(M&&M.ad)M.ad=[atkDef(T.home),atkDef(T.away)];renderLineup();renderSquad();if(window.mgrRender)mgrRender();if(!M.busy&&!scene)showIdle(document.getElementById("clk").textContent)}
function renderLineup(){
  const t=T.home,c=tacOf(t),f=FORMS[c.form];if(!t.subs)t.subs=[];
  const AD=atkDef(t),avgOv=r1(t.players.reduce((s,p)=>s+overall(p),0)/t.players.length);
  const isSel=(k,i)=>LU.sel&&LU.sel.kind===k&&LU.sel.i===i?" sel":"";
  const slots=f.map(([r,x,y],i)=>{const p=t.players[i],bad=p.fit<1;
    return`<button class="slot${isSel("slot",i)}" draggable="true" data-kind="slot" data-i="${i}" style="left:${x}%;top:${y}%" title="${p.n} (${POSN[p.pos]}) → ${slotLabel(c.form,i)}${bad?` · sai vị trí, còn ${Math.round(p.fit*100)}% sức`:""}">
      ${jersey(t.color,numOf(p))}<span class="sn" style="color:${tierOf(p).c}">${p.n}</span><span class="sr${bad?" bad":""}">${slotLabel(c.form,i)}${bad?` ${Math.round(p.fit*100)}%`:""}</span></button>`}).join("");
  const bench=Array.from({length:7},(_,i)=>{const p=t.subs[i];return`<button class="bslot${isSel("sub",i)}" draggable="${p?"true":"false"}" data-kind="sub" data-i="${i}" title="${p?p.n+" ("+POSN[p.pos]+")":"Ghế trống"}">${p?jersey(t.color,numOf(p))+`<span class="sn" style="color:${tierOf(p).c}">${p.n}</span>`:jersey("#9aa4ae","",true)}</button>`}).join("");
  const rows=squad(t).map((p,j)=>{const k=j<11?"slot":"sub",i=j<11?j:j-11;return`<tr class="${isSel(k,i)}" draggable="true" data-kind="${k}" data-i="${i}">
    <td><button class="pn" data-kind="${k}" data-i="${i}" style="color:${tierOf(p).c}">${p.n}</button></td><td>${POSN[p.pos]}</td><td>${j<11?slotLabel(c.form,i):"Dự bị"}</td><td>${fmt1(overall(p))}</td><td>${fmt1(overallMax(p))}</td><td>${p.kt}%</td></tr>`}).join("");
  const tA=LU.half===1?c.atk:(c.atk2||c.atk),tD=LU.half===1?c.def:(c.def2||c.def);
  luEl.innerHTML=`<div class="gw"><div class="gh">GOAL · Lập đội hình — ${t.name}<span class="cur">Thực lực đội: ${avgOv}</span></div>
   <div class="gt"><button class="${LU.half===1?"on":""}" data-half="1">Hiệp 1</button><button class="${LU.half===2?"on":""}" data-half="2">Hiệp 2</button></div>
   <div class="lub">
    <div class="pitch" aria-label="Sân và 11 vị trí">${slots}</div>
    <div class="bench"><div class="bh">Ghế dự bị</div>${bench}</div>
    <div class="gl lul"><table><tr><th>Tên cầu thủ</th><th>Sở trường</th><th>Đang đá</th><th>Th.lực</th><th>Max</th><th>Kích</th></tr>${rows}</table></div>
   </div>
   <div class="luf">
    <label>Đội hình <select id="luForm">${Object.keys(FORMS).map(k=>`<option ${k===c.form?"selected":""}>${k}</option>`).join("")}</select></label>
    <span class="fn">${FORM_NOTE[c.form]}</span>
    <label>Tấn công (H${LU.half}) <select id="luAtk">${Object.keys(ATK_TAC).map(k=>`<option ${k===tA?"selected":""}>${k}</option>`).join("")}</select></label>
    <label>Phòng thủ (H${LU.half}) <select id="luDef">${Object.keys(DEF_TAC).map(k=>`<option ${k===tD?"selected":""}>${k}</option>`).join("")}</select></label>
    <span class="adv"><b class="ra">Tấn công: ${AD.a}</b> <b class="rd">Phòng thủ: ${AD.d}</b></span>
   </div>
   <p class="hint lh">Kéo cầu thủ (trong danh sách, trên sân hoặc ghế dự bị) thả vào vị trí muốn đổi; hoặc bấm chọn 2 cầu thủ để đổi chỗ. Nhãn đỏ = đá sai sở trường, bị giảm sức. Chiến thuật hiệp 2 tự áp dụng từ phút 45.</p>
   <div class="msg" role="status">${LU.msg?`<span class="${LU.ok?"mok":"mko"}">${LU.msg}</span>`:LU.sel?`Đã chọn <b>${(LU.sel.kind==="slot"?t.players:t.subs)[LU.sel.i].n}</b>, bấm cầu thủ hoặc vị trí khác để đổi chỗ.`:""}</div></div>`;
}
const keyOf=el=>{const x=el.closest("[data-kind]");return x?{kind:x.dataset.kind,i:+x.dataset.i}:null};
luEl.addEventListener("click",e=>{
  const h=e.target.closest("[data-half]");if(h){LU.half=+h.dataset.half;renderLineup();return}
  const k=keyOf(e.target);if(!k||!e.target.closest("button"))return;
  const t=T.home,has=(k.kind==="slot"?t.players:(t.subs||[]))[k.i];
  if(!LU.sel){if(!has)return;LU.sel=k;LU.msg="";renderLineup();return}
  const a=LU.sel;LU.sel=null;if(a.kind===k.kind&&a.i===k.i){renderLineup();return}swapLU(a,k);if(LU.msg)renderLineup()});
luEl.addEventListener("dragstart",e=>{const k=keyOf(e.target);if(!k)return;e.dataTransfer.setData("text/plain",JSON.stringify(k));e.dataTransfer.effectAllowed="move"});
luEl.addEventListener("dragover",e=>{if(keyOf(e.target)){e.preventDefault();e.dataTransfer.dropEffect="move"}});
luEl.addEventListener("drop",e=>{const k=keyOf(e.target);if(!k)return;e.preventDefault();try{const a=JSON.parse(e.dataTransfer.getData("text/plain"));LU.sel=null;swapLU(a,k);if(LU.msg)renderLineup()}catch(_){}});
luEl.addEventListener("change",e=>{const c=tacOf(T.home),v=e.target.value;
  if(e.target.id==="luForm"){c.form=v;autoArrange(T.home);LU.ok=true;LU.msg=`Đã chuyển sang ${v} và tự xếp lại 11 cầu thủ đá chính vào vị trí hợp nhất.`;afterLU();LU.msg="";LU.ok=false}
  else if(e.target.id==="luAtk"){if(LU.half===1)c.atk=v;else c.atk2=v;afterLU()}
  else if(e.target.id==="luDef"){if(LU.half===1)c.def=v;else c.def2=v;afterLU()}});

/* ================== FIREBASE ================== */
let db=null;const st=t=>document.getElementById("fbst").textContent=t;
function saveLocal(){try{localStorage.setItem("dmbd_v6",JSON.stringify(T))}catch(e){}}
const valid=t=>t&&t.home&&t.home.subs&&t.home.players&&t.home.players[0]&&t.home.players[0].skills!==undefined;
let uid=null;
/* Kết nối: dùng window.FIREBASE_CONFIG (file js/firebase-config.js) nếu có, không thì lấy từ ô nhập.
   Đăng nhập ẩn danh → mỗi người chơi có dữ liệu riêng ở users/{uid}. */
async function fbConnect(cfg){
  if(typeof firebase==="undefined"){st("Không tải được thư viện Firebase.");return false}
  if(!firebase.apps.length)firebase.initializeApp(cfg);db=firebase.firestore();
  if(firebase.auth){const cr=await firebase.auth().signInAnonymously();uid=cr.user.uid}else uid="guest";
  st(`Đã kết nối ${cfg.projectId} (người chơi ${uid.slice(0,6)}…)`);if(window.chatSubscribe)chatSubscribe();return true}
const clean=o=>JSON.parse(JSON.stringify(o)); // Firestore không nhận giá trị undefined
async function fbSave(withMatch){
  saveLocal();if(!db){st("Đã lưu trong trình duyệt (chưa kết nối Firebase)");return}
  const ref=db.collection("users").doc(uid);
  await ref.set(clean({club:T.club,home:T.home,away:T.away,updatedAt:Date.now()}));
  if(withMatch)await ref.collection("matches").add(clean({home:T.home.name,away:T.away.name,score:M.score,minute:M.min,log:M.log.slice(-40),at:Date.now()}));
  st("Đã lưu lên Firestore")}
async function fbLoad(){let n=null;
  if(db){const d=await db.collection("users").doc(uid).get();if(d.exists)n=d.data()}
  else{const s=localStorage.getItem("dmbd_v6");if(s)n=JSON.parse(s)}
  if(valid(n)){T=n;T.rival=T.rival||T.away;T.away=T.rival;squad(T.home).concat(squad(T.away)).forEach(refresh);applyLineup(T.home);applyLineup(T.away);st(db?"Đã tải đội từ Firestore":"Đã tải từ trình duyệt");newMatch();mgrRender();renderLineup();return true}
  st("Chưa có dữ liệu đã lưu");return false}
document.getElementById("bFb").onclick=async()=>{try{await fbConnect(JSON.parse(document.getElementById("fbcfg").value))}catch(e){st("Lỗi cấu hình: "+e.message)}};
document.getElementById("bSave").onclick=()=>fbSave(true).catch(e=>st("Lưu lỗi: "+e.message));
document.getElementById("bLoad").onclick=()=>fbLoad().catch(e=>st("Tải lỗi: "+e.message));
if(window.FIREBASE_CONFIG&&window.FIREBASE_CONFIG.apiKey)fbConnect(window.FIREBASE_CONFIG).then(ok=>ok&&fbLoad()).catch(e=>st("Kết nối lỗi: "+e.message));

document.getElementById("bPlay").onclick=()=>{if(M.done)newMatch();M.auto=true;playNext()};
document.getElementById("bNext").onclick=()=>{M.auto=false;playNext()};
document.getElementById("bFast").onclick=fastSim;
document.getElementById("bReset").onclick=()=>{M.auto=false;newMatch()};
newMatch();
mgrRender();
renderLineup();

/* ================== SẢNH GAME (lobby) ==================
   Hai chế độ trên cùng khung sân: "lobby" (sảnh, camera lia chậm) và "match" (đang đá).
   Các màn hình Đội hình / Quản lý / Cầu thủ / Phụ bản / Nhiệm vụ / Cửa hàng / Cài đặt mở dạng cửa sổ. */
var MODE="lobby";window.MODE=MODE;
const gameEl=document.getElementById("game"),wrapEl=document.querySelector(".wrap");
function club(){const c=T.club;c.mgr=c.mgr||{name:"Chủ tịch",lv:1,exp:0};c.flags=c.flags||{};c.claimed=c.claimed||{};c.news=c.news||[];c.campaign=c.campaign||0;c.the=c.the??8;c.bh=c.bh??0;return c}
function flag(k,v=true){const f=club().flags;if(typeof v==="number")f[k]=(f[k]||0)+v;else f[k]=v;if(MODE==="lobby")lobbyRender()}
function news(text){const n=club().news;n.unshift({t:Date.now(),text});n.length=Math.min(n.length,30);if(MODE==="lobby")lobbyRender()}
function toast(text){const el=document.getElementById("toast");el.textContent=text;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}

/* ---------- Phụ bản: 10 đội NPC mạnh dần ---------- */
const CAMPAIGN=[
 {n:"Đồng Tháp Xanh",c:"#16a34a",t:0,up:0,kt:35},{n:"Sông Lam Đỏ",c:"#b91c1c",t:0,up:1,kt:50},
 {n:"Cảng Biển FC",c:"#0e7490",t:1,up:0,kt:40},{n:"Phố Núi United",c:"#7c3aed",t:1,up:1,kt:55},
 {n:"Thủ Đô Xanh",c:"#1d4ed8",t:2,up:0,kt:45},{n:"Miền Tây Vàng",c:"#ca8a04",t:2,up:1,kt:60},
 {n:"Hải Đăng FC",c:"#0f766e",t:2,up:2,kt:75},{n:"Kinh Đô Hoàng Gia",c:"#9d174d",t:3,up:0,kt:55},
 {n:"Thủy Triều Đỏ",c:"#dc2626",t:3,up:2,kt:75},{n:"Ngôi Sao Phương Nam",c:"#a16207",t:4,up:1,kt:60}];
const reward=i=>({gold:6000*(i+1),phieu:5*(i+1),the:[2,5,8,9].includes(i)?1:0});
const NPC_NAMES=["Minh","Hùng","Phát","Long","Khoa","Tài","Bảo","Nam","Quân","Vũ","Thịnh","Lộc","Huy","Sơn","Trí"];
function npcTeam(i){const s=CAMPAIGN[i],F=FORMS["442A"];
  const players=F.map(([r],j)=>{const nm=`${NPC_NAMES[(i*3+j)%NPC_NAMES.length]} ${String.fromCharCode(65+((i+j*7)%26))}.`;
    const tier=Math.min(5,s.t+(j>=11-s.up?1:0)),p=mk(nm+" "+s.n,r,tier,"P",0);p.n=nm;p.kt=s.kt;for(const [k] of ATTR)p.base[k]=r1(maxOf(p,k)*0.95);refresh(p);return p});
  const t={name:s.n,color:s.c,players,subs:[],npc:i,tac:{form:"442A",atk:Object.keys(ATK_TAC)[i%4],atkLv:1,def:Object.keys(DEF_TAC)[i%3],defLv:1}};applyLineup(t);return t}

/* ---------- Nhiệm vụ tân thủ ---------- */
const TASKS=[
 {id:"lineup",n:"Xếp đội hình lần đầu",ok:f=>f.lineup,rw:{gold:5000},go:"doi"},
 {id:"match",n:"Đá 1 trận bất kỳ",ok:f=>(f.matches||0)>=1,rw:{phieu:10},go:"thidau"},
 {id:"train",n:"Huấn luyện cầu thủ",ok:f=>f.train,rw:{phieu:10},go:"ql"},
 {id:"pb1",n:"Vượt phụ bản 1",ok:()=>club().campaign>=1,rw:{the:1},go:"phuban"},
 {id:"kich",n:"Kích thích 1 cầu thủ",ok:f=>f.kich,rw:{gold:10000},go:"ql"},
 {id:"star",n:"Lên sao 1 cầu thủ",ok:f=>f.star,rw:{bh:2},go:"ql"},
 {id:"pb3",n:"Vượt phụ bản 3",ok:()=>club().campaign>=3,rw:{xu:50},go:"phuban"}];
const rwTxt=r=>Object.entries(r).filter(([,v])=>v).map(([k,v])=>`${fmt(v)} ${{gold:"vàng",phieu:"phiếu",xu:"xu",the:"thẻ cầu thủ",bh:"bảo hiểm"}[k]}`).join(", ");
function give(r){const c=club();for(const [k,v] of Object.entries(r))c[k]=(c[k]||0)+v}
const claimable=()=>TASKS.filter(t=>t.ok(club().flags)&&!club().claimed[t.id]).length;

/* ---------- kinh nghiệm quản lý ---------- */
function addExp(n){const m=club().mgr;m.exp+=n;let up=false;while(m.exp>=m.lv*300){m.exp-=m.lv*300;m.lv++;up=true}if(up)news(`${m.name} lên cấp quản lý Lv.${m.lv}!`)}

/* ---------- chế độ ---------- */
function setMode(m){MODE=m;window.MODE=m;gameEl.classList.toggle("is-lobby",m==="lobby");gameEl.classList.toggle("is-match",m==="match");wrapEl.classList.toggle("lobby-mode",m==="lobby");if(m==="lobby")lobbyRender()}
function startMatch(opp,ctx){if(M.busy){toast("Đang có tình huống diễn ra.");return}
  T.away=opp;applyLineup(T.away);closeWin();newMatch();M.ctx=ctx;setMode("match");renderSquad();
  setCmt(ctx.type==="campaign"?`Phụ bản ${ctx.stage+1}: ${opp.name}. Bấm “Đá trận” để bắt đầu.`:`Giao hữu với ${opp.name}. Bấm “Đá trận” để bắt đầu.`)}
function backToLobby(){if(M.busy){toast("Chờ tình huống hiện tại kết thúc.");return}M.auto=false;T.away=T.rival||T.away;applyLineup(T.away);newMatch();setMode("lobby")}
// gọi từ finish(): phần thưởng phụ bản, nhiệm vụ, kinh nghiệm, tin hệ thống
function onMatchEnd(){const c=club(),[h,a]=M.score,won=h>a,draw=h===a;flag("matches",1);addExp(won?100:draw?50:30);
  const ctx=M.ctx||{type:"friendly"};
  if(ctx.type==="campaign"){
    if(won&&ctx.stage===c.campaign){c.campaign++;const r=reward(ctx.stage);give(r);news(`Chúc mừng ${c.mgr.name} đã đánh bại ${T.away.name}, vượt phụ bản ${ctx.stage+1}! Thưởng ${rwTxt(r)}.`);toast(`Vượt phụ bản ${ctx.stage+1}! +${rwTxt(r)}`)}
    else if(won){const r={gold:2000*(ctx.stage+1)};give(r);toast(`Thắng lại phụ bản ${ctx.stage+1}: +${rwTxt(r)}`)}
    else toast(draw?"Hòa – chưa vượt được phụ bản.":"Thua – nâng cấp đội hình rồi thử lại nhé!")}
  else if(won&&h-a>=3)news(`${T.home.name} thắng đậm ${h}:${a} trước ${T.away.name}.`);
  render();saveLocal()}

/* ---------- cửa sổ ---------- */
const WIN_TITLE={doi:"Lập đội hình",ql:"Quản lý cầu thủ",ds:"Danh sách cầu thủ",phuban:"Phụ bản",nv:"Nhiệm vụ",shop:"Trung tâm mua sắm",caidat:"Cài đặt & Lưu dữ liệu",tc:"Tài chính câu lạc bộ"};
const winEl=document.getElementById("win");
function openWin(k,sub){winEl.querySelectorAll("[data-w]").forEach(e=>e.hidden=e.dataset.w!==k);document.getElementById("wtitle").textContent=WIN_TITLE[k];winEl.hidden=false;
  if(k==="doi")renderLineup();if(k==="ql"){if(sub)MG.tab=sub;MG.team="home";mgrRender()}if(k==="ds")renderSquad();if(k==="phuban")renderCampaign();if(k==="nv")renderTasks();if(k==="shop")renderShop();if(k==="tc")renderFin();if(k==="caidat")renderSettings();
  document.getElementById("wclose").focus()}
function closeWin(){winEl.hidden=true;if(MODE==="lobby")lobbyRender()}
document.getElementById("wclose").onclick=closeWin;
winEl.addEventListener("click",e=>{if(e.target===winEl)closeWin()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!winEl.hidden&&document.getElementById("modal").hidden)closeWin()});
// thẻ cầu thủ → mở tab quản lý tương ứng trong cửa sổ
window.mgrOpenOrig=mgrOpen;mgrOpen=(team,i,tab)=>{openWin("ql",tab);MG.team=team===T.away?"away":"home";MG.i=i;MG.msg="";mgrRender()};

function renderCampaign(){const c=club(),el=document.getElementById("phuban");
  el.innerHTML=`<p class="wl">Đánh bại lần lượt 10 câu lạc bộ để nhận thưởng lần đầu. Đội của bạn: Thực lực ${r1(avg(T.home.players.map(overall)))}.</p><div class="pbl">${CAMPAIGN.map((s,i)=>{
    const st=i<c.campaign?"done":i===c.campaign?"open":"lock",t=npcTeam(i),ov=r1(avg(t.players.map(overall)));
    return`<div class="pb ${st}"><i class="pbn" style="background:${s.c}">${i+1}</i><div class="pbi"><b>${s.n}</b><span>Bậc ${TIERS[s.t].n}${s.up?` + ${s.up} ${TIERS[Math.min(5,s.t+1)].n}`:""} · Kích ${s.kt}% · Thực lực ~${ov}</span><span class="rw">Thưởng lần đầu: ${rwTxt(reward(i))}</span></div>
      ${st==="lock"?`<span class="lk">Khóa</span>`:`<button class="${st==="open"?"pri":""}" data-pb="${i}">${st==="done"?"Đá lại":"Khiêu chiến"}</button>`}</div>`}).join("")}</div>`;
  el.querySelectorAll("[data-pb]").forEach(b=>b.onclick=()=>{const i=+b.dataset.pb;startMatch(npcTeam(i),{type:"campaign",stage:i})})}
function renderTasks(){const c=club(),el=document.getElementById("tasks");
  el.innerHTML=`<div class="tkl">${TASKS.map(t=>{const ok=t.ok(c.flags),got=c.claimed[t.id];return`<div class="tk ${got?"got":ok?"ok":""}"><span>${got?"✔":ok?"★":"○"} ${t.n}</span><span class="rw">${rwTxt(t.rw)}</span>${got?`<span class="lk">Đã nhận</span>`:ok?`<button class="pri" data-claim="${t.id}">Nhận</button>`:`<button data-go="${t.go}">Đi làm</button>`}</div>`}).join("")}</div>`;
  el.querySelectorAll("[data-claim]").forEach(b=>b.onclick=()=>{const t=TASKS.find(x=>x.id===b.dataset.claim);give(t.rw);c.claimed[t.id]=true;toast(`Nhận ${rwTxt(t.rw)}`);render();saveLocal();renderTasks()});
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>navGo(b.dataset.go))}
const SHOP=[{id:"the",n:"Thẻ cầu thủ (dùng để Lên sao)",cost:{xu:50},get:{the:1}},{id:"bh",n:"Giấy bảo hiểm (+5% lên sao)",cost:{xu:10},get:{bh:1}},
 {id:"phieu",n:"Gói 50 phiếu",cost:{gold:30000},get:{phieu:50}},{id:"tp",n:"Gói 2.000 điểm huấn luyện cho cả đội",cost:{phieu:60},get:{tpAll:2000}}];
function renderShop(){const c=club(),el=document.getElementById("shop");
  el.innerHTML=`<p class="wl">Đang có: ${fmt(c.gold)} vàng · ${fmt(c.xu)} xu · ${fmt(c.phieu)} phiếu · ${c.the} thẻ cầu thủ · ${c.bh} bảo hiểm</p><div class="tkl">${SHOP.map(s=>`<div class="tk"><span>${s.n}</span><span class="rw">Giá ${rwTxt(s.cost)}</span><button class="pri" data-buy="${s.id}">Mua</button></div>`).join("")}</div>`;
  el.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{const s=SHOP.find(x=>x.id===b.dataset.buy);const [k,v]=Object.entries(s.cost)[0];
    if((c[k]||0)<v){toast(`Không đủ ${rwTxt({[k]:v})}.`);return}c[k]-=v;
    if(s.get.tpAll)squad(T.home).forEach(p=>p.tp+=s.get.tpAll);else give(s.get);toast(`Đã mua: ${s.n}`);render();saveLocal();renderShop()})}
function renderFin(){const c=club();document.getElementById("tc").innerHTML=`<div class="tkl">
  <div class="tk"><span>Vàng</span><b>${fmt(c.gold)}</b><span class="rw">Thắng 20.000 · Hòa 8.000 · Thua 3.000 mỗi trận</span></div>
  <div class="tk"><span>Phiếu</span><b>${fmt(c.phieu)}</b><span class="rw">Thắng 10 · Hòa 5 · Thua 2 mỗi trận</span></div>
  <div class="tk"><span>Xu</span><b>${fmt(c.xu)}</b><span class="rw">Tiền nạp (chưa có cổng nạp)</span></div>
  <div class="tk"><span>Thẻ cầu thủ / Bảo hiểm</span><b>${c.the} / ${c.bh}</b><span class="rw">Từ phụ bản, nhiệm vụ, cửa hàng</span></div></div>`}
function renderSettings(){const c=club(),el=document.getElementById("setname");el.value=c.mgr.name}
document.getElementById("setname").addEventListener("change",e=>{const v=e.target.value.trim().slice(0,20);if(v){club().mgr.name=v;saveLocal();toast("Đã đổi tên quản lý.")}});

/* ---------- chat: kênh hệ thống + chat toàn server (khi đã kết nối Firebase) ---------- */
let CHAT=[],chatUnsub=null;
function chatSubscribe(){if(!db||chatUnsub)return;
  chatUnsub=db.collection("chat").orderBy("at","desc").limit(30).onSnapshot(s=>{CHAT=s.docs.map(d=>d.data()).filter(m=>m&&m.text);if(MODE==="lobby")lobbyRender()},e=>{CHAT=[{name:"Hệ thống",text:"Chưa đọc được kênh chat: "+e.message}]})}
async function chatSend(text){text=text.trim().slice(0,200);if(!text)return;
  if(!db){CHAT.unshift({name:club().mgr.name,text:text+" (chỉ bạn thấy – chưa kết nối Firebase)",at:Date.now()});lobbyRender();return}
  try{await db.collection("chat").add({uid,name:club().mgr.name,text,at:firebase.firestore.FieldValue.serverTimestamp()})}catch(e){toast("Gửi lỗi: "+e.message)}}

/* ---------- vẽ sảnh ---------- */
const ICON={
 bag:'<path d="M8 12h24l-2 20H10z M14 12a6 6 0 0 1 12 0" fill="none" stroke="currentColor" stroke-width="2.4"/>',
 whistle:'<circle cx="15" cy="23" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15 15h17v7h-9" fill="none" stroke="currentColor" stroke-width="2.4"/>',
 board:'<rect x="9" y="7" width="22" height="27" rx="2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14 16l4 4 8-8M14 27h12" fill="none" stroke="currentColor" stroke-width="2.4"/>',
 coin:'<circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M20 13v14M16 17h7a3 3 0 0 1 0 6h-6" fill="none" stroke="currentColor" stroke-width="2.4"/>',
 info:'<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M20 18v9M20 13v1" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
 gift:'<rect x="9" y="17" width="22" height="15" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M7 12h26v5H7zM20 12v20M20 12c-3-6-9-4-6 0M20 12c3-6 9-4 6 0" fill="none" stroke="currentColor" stroke-width="2.4"/>',
 star:'<path d="M20 7l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="none" stroke="currentColor" stroke-width="2.4"/>'};
const ico=(k)=>`<svg viewBox="0 0 40 40" aria-hidden="true">${ICON[k]}</svg>`;
const MENU=[["Sân tập","ql"],["Quán Bar",null],["Đoạt Sân",null],["T.T Mua sắm","shop"],["Sân đấu BOSS",null],["P.Thị Trường",null],["Hiệp hội Q.Lý",null],["Sân vận động","doi"],["Đài truyền hình",null]];
const NPCS=[["Môi giới","bag",null],["Huấn luyện","whistle","ql"],["Chiến thuật","board","doi"],["Tài chính","coin","tc"],["Chỉ dẫn","info","guide"]];
const NAV=[["N.Vụ","nv"],["Quản lý","ql"],["Đội","doi"],["Cầu thủ","ds"],["Thi đấu","thidau"],["Phụ bản","phuban"],["Shop","shop"]];
function guideText(){const c=club(),f=c.flags,t=TASKS.find(x=>!c.claimed[x.id]);
  if(t&&t.ok(f))return`Nhiệm vụ “${t.n}” đã hoàn thành! Bấm <b>N.Vụ</b> để nhận ${rwTxt(t.rw)}.`;
  if(t)return{lineup:"Hãy vào <b>Đội</b> để xếp đội hình: kéo cầu thủ vào vị trí, chọn thế trận và chiến thuật.",match:"Bấm <b>Thi đấu</b> để đá giao hữu, xem cầu thủ thi đấu theo chỉ số.",train:"Vào <b>Quản lý → Kế hoạch</b>, chọn chỉ số rồi bấm Thực hiện để luyện cầu thủ.",pb1:"Trong <b>Phụ bản</b>, bạn thách đấu các đội NPC. Thắng để nhận thưởng và kinh nghiệm.",kich:"<b>Kích thích</b> làm tăng giới hạn chỉ số của cầu thủ. Thử với cầu thủ giỏi nhất nhé.",star:"Dùng thẻ cầu thủ để <b>Lên sao</b>, mở khóa kỹ năng như Step Over, Ngả bàn đèn.",pb3:"Vượt phụ bản 3 để nhận 50 xu."}[t.id]||"";
  return`Bạn đã xong nhiệm vụ tân thủ. Phụ bản đang ở trận ${Math.min(10,c.campaign+1)}/10 — cố lên!`}
function lobbyRender(){if(MODE!=="lobby")return;const c=club(),m=c.mgr,el=document.getElementById("lobby");
  const ov=r1(avg(T.home.players.map(overall))),today=new Date().toDateString(),gift=c.lastGift!==today;
  const chat=[...CHAT.map(x=>({who:x.name,text:x.text})),...c.news.map(n=>({sys:1,text:n.text}))].slice(0,30);
  el.innerHTML=`
  <div class="lp prof"><div class="av2">${ico("star")}<b>${m.lv}</b></div><div><b class="mn">${m.name}</b><span>Lv.${m.lv} · ${T.home.name}</span>
    <span class="xp"><i style="width:${Math.min(100,m.exp/(m.lv*300)*100)}%"></i></span><span>Thực lực đội: <b>${ov}</b></span></div></div>
  <div class="lp tasks"><b>Nhiệm vụ tân thủ</b>${TASKS.slice(0,6).map(t=>{const ok=t.ok(c.flags),got=c.claimed[t.id];return`<button class="tl ${got?"got":ok?"ok":""}" data-go="${got?"nv":ok?"nv":t.go}">${got?"✔":ok?"★":"○"} ${t.n}</button>`}).join("")}</div>
  <div class="lp guide"><div class="gav" id="gav"></div><div class="gb2"><b>Chỉ dẫn</b><p>${guideText()}</p></div></div>
  <div class="lp big"><button data-go="phuban" class="bigb">Phụ bản <small>${Math.min(10,c.campaign+1)}/10</small></button><button data-go="world" class="bigb g">Thế giới</button></div>
  <div class="lp clubn">${T.home.name}</div>
  <div class="lp menu">${MENU.map(([n,g])=>`<button data-go="${g||"dev"}">${n}</button>`).join("")}</div>
  <div class="lp npcs">${NPCS.map(([n,i,g])=>`<button data-go="${g||"dev"}">${ico(i)}<span>${n}</span></button>`).join("")}</div>
  <div class="lp gifts"><button data-go="gift" class="${gift?"hot":""}">${ico("gift")}<span>Quà</span></button><button data-go="dev">${ico("star")}<span>Sự kiện</span></button></div>
  <div class="lp chat"><div class="ch">Chat <small>${db?"toàn server":"ngoại tuyến"}</small></div><div class="cl">${chat.map(x=>x.sys?`<p><span class="sy">[Hệ thống]</span> ${x.text}</p>`:`<p><span class="nm2">${(x.who||"?").replace(/</g,"&lt;")}:</span> ${String(x.text).replace(/</g,"&lt;")}</p>`).join("")||"<p class='mu'>Chưa có tin nhắn.</p>"}</div>
    <form class="cf" id="chatf"><input id="chati" maxlength="200" placeholder="Nhập tin nhắn…" aria-label="Tin nhắn chat"><button>Gửi</button></form></div>`;
  const ga=document.getElementById("gav");if(ga)ga.appendChild(avatar(T.home.players.find(p=>p.n==="Ronaldo")||T.home.players[9],{color:"#16a34a"},70,90));
  document.getElementById("nav").innerHTML=NAV.map(([n,g])=>`<button data-go="${g}">${n}${g==="nv"&&claimable()?`<b class="dot">${claimable()}</b>`:""}</button>`).join("")+`<button data-go="gift" class="r">Nhận túi quà</button><button data-go="caidat">Cài đặt</button>`;
  document.getElementById("chatf").onsubmit=e=>{e.preventDefault();const i=document.getElementById("chati");chatSend(i.value);i.value=""};
}
function navGo(g){
  if(g==="thidau"){startMatch(T.rival||T.away,{type:"friendly"});return}
  if(g==="world"){toast("Thế giới (đấu với người chơi khác) đang phát triển.");return}
  if(g==="dev"){toast("Tính năng đang phát triển.");return}
  if(g==="guide"){toast("Làm theo bảng Chỉ dẫn và Nhiệm vụ tân thủ để làm quen game.");return}
  if(g==="gift"){const c=club(),d=new Date().toDateString();if(c.lastGift===d){toast("Hôm nay bạn đã nhận quà rồi, quay lại vào ngày mai nhé.");return}
    c.lastGift=d;give({gold:5000,phieu:5});toast("Quà hằng ngày: +5.000 vàng, +5 phiếu");render();saveLocal();lobbyRender();return}
  openWin(g)}
document.getElementById("lobby").addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)navGo(b.dataset.go)});
document.getElementById("nav").addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)navGo(b.dataset.go)});
document.getElementById("bLobby").onclick=backToLobby;

window.flag=flag;window.onMatchEnd=onMatchEnd;window.lobbyRender=lobbyRender;window.chatSubscribe=chatSubscribe;
T.rival=T.rival||T.away;club();setMode("lobby");
