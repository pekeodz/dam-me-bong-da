document.documentElement.classList.add("fifa");
/* ================== BỘ CHỈ SỐ (giống thẻ cầu thủ gốc) ================== */
const ATTR=[
 ["toc","Tốc độ","Cơ hội đá bổng (tấn công); đuổi theo cầu thủ Solo (phòng ngự)"],
 ["bat","Sức bật","(Nhảy) Hậu vệ chặn cơ hội đội đầu"],
 ["the","Thể lực","(Thể trạng) Tì đè ở cơ hội dứt điểm và vô-lê"],
 ["ben","S.Bền","Độ giảm thể lực mỗi phút (cao thì mệt chậm, cuối trận vẫn đá tốt)"],
 ["sut","Sút","Dứt điểm trong vòng cấm"],
 ["re","Rê dắt","(Lừa) Lừa qua hậu vệ ở cơ hội sút gần và sút xa"],
 ["chuyen","Chuyền","Phối hợp 2 đánh 1; kiểm soát tuyến giữa → giành quyền tấn công"],
 ["dau","Đ.Đầu","Đội đầu ghi bàn; hậu vệ chặn cơ hội đá bổng"],
 ["doat","Đoạt","(Cắt) Cắt bóng ở cơ hội sút gần 2 đánh 1 và sút xa"],
 ["xoac","Xoạc","Chặn cầu thủ lừa qua ở cơ hội sút gần 1 đấu 1; Xoạc thấp dễ phạm lỗi"],
 ["cdai","Ch.dài","Tạt bóng cho đồng đội đội đầu; bấm bóng qua đầu thủ môn ở cơ hội đá bổng"],
 ["sxa","Sút xa","Sút ngoài vòng cấm"],
 ["pden","Phạt đền","Sút phạt đền"],
 ["pgoc","Phạt góc","Độ chuẩn quả phạt góc"],
 ["dphat","Đá phạt","Sút phạt trực tiếp"],
 ["bpha","Bứt phá","Cơ hội Solo: bứt phá vòng vây, so với Tốc độ hậu vệ"],
 ["dbong","Đấm bóng","(Thủ môn) Đấm bóng ra xa khỏi vùng nguy hiểm sau khi cản phá"],
 ["kchien","Kh.Chiến","(Thủ môn) Chống đội đầu và cơ hội đá bổng"],
 ["cuu","Cứu bóng","(Thủ môn, \"Cứu/Càng\") Chống mọi cú sút: sút gần, vô-lê, Solo, sút xa, sút phạt, phạt đền"]];
const ATTR_COL1=["toc","bat","the","ben","sut","re","chuyen","dau","doat","xoac"],ATTR_COL2=["cdai","sxa","pden","pgoc","dphat","bpha","dbong","kchien","cuu"];
const LBL=Object.fromEntries(ATTR.map(a=>[a[0],a[1]]));
const POSN={TM:"Thủ môn",HV:"Trung vệ",HVC:"H.Vệ cánh",TV:"T.Vệ",TVC:"T.Vệ cánh","TĐ":"T.Đạo"};
const BASE={toc:300,bat:300,the:320,ben:380,sut:250,re:280,chuyen:320,dau:260,doat:250,xoac:250,cdai:260,sxa:240,pden:240,pgoc:200,dphat:200,bpha:300,dbong:60,kchien:60,cuu:60};
const ROLE={
 TM:{cuu:600,dbong:560,kchien:540,bat:480,the:420,cdai:380,toc:280,bpha:420,sut:120,re:120,xoac:120,doat:150,dau:120},
 HV:{xoac:580,doat:560,the:560,dau:520,bat:580,chuyen:380,toc:420,re:250,sut:200},
 HVC:{toc:560,bpha:520,xoac:500,doat:480,cdai:480,ben:540,re:420,chuyen:420,bat:420},
 TV:{chuyen:580,doat:440,cdai:520,sxa:480,ben:560,re:480,dphat:420,pgoc:380,sut:380,xoac:380},
 TVC:{toc:600,re:580,cdai:540,bpha:580,chuyen:480,ben:520,pgoc:480,dphat:380,sut:420,sxa:400},
 "TĐ":{sut:600,dau:520,re:520,bpha:560,toc:560,the:480,pden:520,sxa:460,bat:480}};
// Trọng số tính "Thực lực" theo vị trí
const OVR={
 TM:{cuu:.4,dbong:.15,kchien:.15,bat:.1,bpha:.1,cdai:.1},
 HV:{xoac:.25,doat:.2,bat:.2,the:.15,toc:.1,chuyen:.1},
 HVC:{toc:.2,xoac:.2,doat:.15,cdai:.15,bpha:.15,ben:.15},
 TV:{chuyen:.3,re:.15,doat:.15,cdai:.15,sxa:.1,ben:.15},
 TVC:{toc:.2,re:.2,cdai:.2,bpha:.15,chuyen:.1,ben:.15},
 "TĐ":{sut:.3,dau:.15,re:.15,bpha:.15,toc:.15,the:.1}};
// Thực lực = trung bình 19 chỉ số (khớp thẻ gốc: Messi trung bình 438.6 ≈ Thực lực 436.6)
const overall=p=>ATTR.reduce((s,[k])=>s+p[k],0)/ATTR.length;
/* Bậc cầu thủ: trần chỉ số khi Độ kích thích 100%. Vàng = 625 theo thẻ Messi (Sút/Rê/Chuyền 624.9). */
const TIERS=[{n:"Trắng",c:"#d6d9de",cap:250},{n:"Xanh lá",c:"#22c55e",cap:330},{n:"Xanh lam",c:"#3b82f6",cap:410},{n:"Tím",c:"#a855f7",cap:500},{n:"Vàng",c:"#eab308",cap:625},{n:"Đỏ",c:"#ef4444",cap:750},{n:"Icon",c:"#e9c56a",cap:900}]; // Icon: bậc cao nhất, không ra từ tìm kiếm thường
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
 qntt:{n:"Qua Người Tối Thượng",anim:"luamessi",rate:.5,mult:1.4,ult:1,desc:"Kỹ năng tối thượng của Icon Messi: đảo bóng qua người, sức đi bóng +40%"},
 bendit:{n:"Bend It Like Beckham",anim:"bendit",rate:.7,mult:1.35,ult:1,desc:"Kỹ năng tối thượng của Icon Beckham: đá phạt trực tiếp cứa lòng cong vào góc, sức sút phạt +35%"},
 gadote:{n:"Gà Đồ Tể",anim:"gadote",rate:.6,mult:1.35,foul:.15,ult:1,desc:"Kỹ năng tối thượng của Icon Pepe: xoạc bóng thô bạo, sức xoạc +35% nhưng 15% phạm lỗi (đối thủ được đá phạt)"},
 rabona:{n:"Rabona Fake",anim:"rabona",rate:.6,mult:1.3,ult:1,desc:"Kỹ năng tối thượng của Icon Lamine Yamal (cơ hội sút xa): giả sút rabona, sức lừa +30%, hậu vệ ngã và cú sút xa +15% vì thủ môn bị lừa"},
 bike:{n:"Ngả Bàn Đèn",anim:"bike",rate:.6,mult:1.2,desc:"Kỹ năng vô-lê khó nhất (độc quyền Ronaldo Icon): ở cơ hội vô-lê tung người ngả bàn đèn, sức sút vào +20%"},
 dibo:{n:"Đi Bộ Vượt Râu",anim:"dibo",rate:.6,mult:1,desc:"Kỹ năng độc quyền Icon Messi: khi cầm bóng cùng đồng đội đối mặt hàng thủ, Messi giả vờ đi bộ hút hậu vệ rồi chọc khe, đồng đội tự động vượt qua người"},
 msc:{n:"Ăn mừng Messi",anim:"msc",rate:1,mult:1,desc:"Màn ăn mừng độc quyền Icon Messi sau khi ghi bàn"},

 // ===== kỹ năng mới (dùng icon kỹ năng). on: tình huống áp dụng · mult: hệ số sức · rate: tỉ lệ kích hoạt
 matocdo:{n:"Ma Tốc Độ",rate:1,mult:1.075,pas:1,desc:"Solo / đua tốc độ: Bứt phá, Tốc độ +7.5% (bị động, luôn có tác dụng)"},
 sieubuttoc:{n:"Siêu Bứt Tốc",rate:1,mult:1.125,pas:1,desc:"Solo / đua tốc độ: Bứt phá, Tốc độ +12.5% (bị động, luôn có tác dụng)"},
 chaycho:{n:"Bậc Thầy Chạy Chỗ",rate:1,mult:1.075,pas:1,desc:"Là người nhận bóng trong pha phối hợp 2 đánh 1: sức lừa qua của cả pha +7.5% (bị động, luôn có tác dụng)"},
 satthu:{n:"Sát Thủ Băng Cắt",rate:1,mult:1,desc:"Dễ được đồng đội chọn làm người nhận bóng ở các pha bứt tốc Solo 1 đấu 1 (gấp 3 lần)"},
 sutxa:{n:"Sút Xa",rate:1,mult:1.075,pas:1,desc:"Cơ hội sút xa: Sút xa +7.5% (bị động, luôn có tác dụng)"},
 sutxoay:{n:"Sút Xoáy",rate:1,mult:1.045,pas:1,desc:"Sút xa, đá phạt: +4.5% và thủ môn chỉ dùng được Cứu bóng (không đấm được) (bị động, luôn có tác dụng)"},
 sutphat:{n:"Sút Phạt Mạnh",rate:1,mult:1.12,pas:1,desc:"Đá phạt trực tiếp: +12% (bị động, luôn có tác dụng)"},
 daumanh:{n:"Đánh Đầu Mạnh",rate:1,mult:1.075,pas:1,desc:"Cơ hội đội đầu: Đánh đầu +7.5% (bị động, luôn có tác dụng)"},
 vole:{n:"Chuyên Gia Vô-lê",rate:1,mult:1.11,pas:1,desc:"Cơ hội vô-lê: Sút vào +11% (bị động, luôn có tác dụng)"},
 trickA:{n:"Trickster A",rate:1,mult:1.05,pas:1,desc:"Lừa qua người: Rê dắt +5% (bị động, luôn có tác dụng)"},
 trickS:{n:"Trickster S",rate:1,mult:1.1,pas:1,desc:"Lừa qua người: Rê dắt +10% (bị động, luôn có tác dụng)"},
 aothuat:{n:"Ảo Thuật Gia",anim:"roulette",rate:.45,mult:1.2,desc:"Lừa qua người: Rê dắt +20%, kèm động tác xoay compa"},
 noluc:{n:"Nỗ Lực Đến Cùng",rate:.3,mult:1,desc:"Khi vừa bị cướp bóng: 30% giành lại bóng ngay và tự dứt điểm"},
 anva:{n:"Ăn Vạ",rate:.25,mult:1,desc:"Khi bị xoạc ngã: 25% được hưởng quả đá phạt"},
 thanhchuyen:{n:"Thánh Chuyền Bóng",rate:1,mult:1.1,pas:1,desc:"Là người chuyền trong pha phối hợp: phần Chuyền +10% (bị động, luôn có tác dụng)"},
 chuyendai:{n:"Chuyền Dài",rate:1,mult:1.075,pas:1,desc:"Chuyền dài, tạt cánh: Ch.dài +7.5% (bị động, luôn có tác dụng)"},
 tikiA:{n:"Tiki Taka A",rate:1,mult:1.04,pas:1,desc:"Pha phối hợp chuyền ngắn: sức cả pha +4% (bị động, luôn có tác dụng)"},
 tikiS:{n:"Tiki Taka S",rate:1,mult:1.075,pas:1,desc:"Pha phối hợp chuyền ngắn: sức cả pha +7.5% (bị động, luôn có tác dụng)"},
 nhactruong:{n:"Nhạc Trưởng S",rate:1,mult:1.05,desc:"Có mặt trên sân: cả đội +5% lừa qua"},
 lanhdao:{n:"Lãnh Đạo",rate:1,mult:1,desc:"Có mặt trên sân: tinh thần cả đội tụt một nửa khi bị thủng lưới"},
 tacbong:{n:"Cao Thủ Tắc Bóng",rate:1,mult:1.075,pas:1,desc:"Phòng ngự bằng Xoạc: +7.5% (bị động, luôn có tác dụng)"},
 deobam:{n:"Chuyên Gia Đeo Bám",rate:1,mult:1.075,pas:1,desc:"Phòng ngự bằng Đoạt bóng: +7.5% (bị động, luôn có tác dụng)"},
 cungthep:{n:"Cứng Như Thép",rate:1,mult:1.05,pas:1,desc:"Tì đè bằng Thể lực: +5% (bị động, luôn có tác dụng)"},
 bruiserA:{n:"Bruiser A",rate:1,mult:1.075,pas:1,desc:"Tì đè bằng Thể lực: +7.5% (bị động, luôn có tác dụng)"},
 bruiserS:{n:"Bruiser S",rate:1,mult:1.125,pas:1,desc:"Tì đè bằng Thể lực: +12.5% (bị động, luôn có tác dụng)"},
 gkphanung:{n:"Phản Ứng Nhanh",rate:1,mult:1.075,pas:1,desc:"Thủ môn cứu sút gần: Cứu bóng +7.5% (bị động, luôn có tác dụng)"},
 gkbatbai:{n:"Bắt Bài Sút Xa",rate:1,mult:1.11,pas:1,desc:"Thủ môn cứu sút xa: +11% (bị động, luôn có tác dụng)"},
 gkkhongchien:{n:"Áp Đảo Không Chiến",rate:1,mult:1.1,pas:1,desc:"Thủ môn tranh bóng bổng: Kh.Chiến +10% (bị động, luôn có tác dụng)"},
 siu:{n:"Ăn mừng SIUUU",anim:"siu",rate:1,mult:1,desc:"Màn ăn mừng độc quyền sau khi ghi bàn"}};
const SKILL_OWN={
 "Ronaldo":[["siu",0],["stepover",2],["bike",4]],
 "Messi":[["dibo",0],["msc",0],["roulette",2]],
 "Quang Hải":[["roulette",3]],
 "Công Phượng":[["stepover",2],["roulette",4]],
 "Tiến Linh":[],
 "Văn Quyết":[]};
const SKILL_BY={"Beckham#6":[["bendit",0],["chuyendai",2],["sutxoay",4]],"Buffon#6":[["gkphanung",0],["lanhdao",2],["gkkhongchien",4]],"Gullit#6":[["bruiserS",0],["daumanh",2],["lanhdao",4]],"Lamine Yamal#6":[["trickA",0],["rabona",2],["satthu",2],["roulette",4]],"Mbappé#6":[["sieubuttoc",0],["satthu",2],["trickA",4]],"Messi#6":[["dibo",0],["msc",0],["qntt",0],["trickS",0],["roulette",2],["sutxa",4]],"Modrić#6":[["thanhchuyen",0],["tikiS",2],["nhactruong",4]],"Neymar Jr#6":[["trickS",0],["aothuat",2],["anva",4]],"Pepe#6":[["tacbong",0],["gadote",2],["bruiserA",2],["lanhdao",4]],"Petr Čech#6":[["gkphanung",0],["gkkhongchien",2],["gkbatbai",4]],"Roberto Carlos#6":[["sutphat",0],["matocdo",2],["sutxa",4]],"Ronaldinho#6":[["aothuat",0],["trickS",2],["sutphat",4]],"Ronaldo#6":[["siu",0],["stepover",0],["sieubuttoc",0],["sutxa",2],["trickS",4],["bike",4]],"Ronaldo#5":[["siu",0],["stepover",2]],"Rooney#6":[["sutxa",0],["noluc",2],["vole",4]],"van Persie#6":[["vole",0],["sutxa",2],["satthu",4]],"van der Sar#6":[["gkkhongchien",0],["gkphanung",2],["chuyendai",4]],"Lamine Yamal#5":[["trickA",0],["satthu",2]],"Mbappé#5":[["matocdo",0],["satthu",2]],"Erling Haaland#5":[["bruiserS",0],["satthu",2]],"Vini Jr.#5":[["sieubuttoc",0],["trickA",2]],"Jude Bellingham#5":[["chaycho",0],["noluc",2]],"Harry Kane#5":[["sutxa",0],["thanhchuyen",2]],"Chanathip Songkrasin#5":[["trickA",0],["tikiA",2]],"Bukayo Saka#4":[["matocdo",0],["trickA",2]],"Phil Foden#4":[["tikiA",0],["sutxa",2]],"De Bruyne#4":[["thanhchuyen",0],["sutxa",2]],"Bruno Fernandes#4":[["sutxa",0],["thanhchuyen",2]],"Vitinha#4":[["tikiA",0]],"Emiliano Martínez#4":[["gkphanung",0]],"Casemiro#3":[["deobam",0],["cungthep",2]],"Enzo Fernández#3":[["chuyendai",0]],"Kyle Walker#3":[["matocdo",0]],"Kieran Trippier#3":[["sutphat",0]],"James Maddison#3":[["sutphat",0]],"Nick Pope#3":[["gkphanung",0]],"Michael Carrick#3":[["chuyendai",0]],"Kaoru Mitoma#3":[["trickA",0]],"Takefusa Kubo#3":[["trickA",0]],"Takehiro Tomiyasu#3":[["deobam",0]],"Hidetoshi Nakata#3":[["thanhchuyen",0]],"Keisuke Honda#3":[["sutphat",0]],"Đỗ Hoàng Hên#3":[["chaycho",0]],"Quế Ngọc Hải#3":[["lanhdao",0]],"Nguyễn Văn Toản#3":[["gkphanung",0]],"Declan Rice#2":[["deobam",0]],"John Terry#2":[["lanhdao",0]],"Raheem Sterling#2":[["matocdo",0]],"Joe Gomez#2":[["tacbong",0]],"Chris Smalling#2":[["daumanh",0]],"Danny Welbeck#2":[["noluc",0]],"Dean Henderson#2":[["gkbatbai",0]],"Daniel Sturridge#2":[["trickA",0]],"Daichi Kamada#2":[["chaycho",0]],"Ritsu Doan#2":[["sutxa",0]],"Junya Ito#2":[["matocdo",0]],"Ayase Ueda#2":[["daumanh",0]],"Makoto Hasebe#2":[["lanhdao",0]],"Kiatisuk Senamuang#2":[["satthu",0]],"Phạm Thành Lương#2":[["chuyendai",0]],"Nguyễn Anh Đức#2":[["daumanh",0]],"Mark Noble#1":[["sutphat",0]],"Takuma Asano#1":[["matocdo",0]],"Teerasil Dangda#1":[["daumanh",0]],"Nguyễn Hai Long#1":[["sutxa",0]],"Khuất Văn Khang#1":[["tikiA",0]],"Nhâm Mạnh Dũng#1":[["cungthep",0]]};
const skillsFor=(n,t)=>(SKILL_BY[n+"#"+t]||SKILL_OWN[n]||[]).map(([id,star])=>({id,star}));
const hasSkill=(p,id)=>(p.skills||[]).some(s=>s.id===id&&(p.star||0)>=s.star);
// chọn kỹ năng đi bóng mạnh nhất đang mở và tung xác suất kích hoạt
function trySkill(p,ids){const own=ids.filter(id=>hasSkill(p,id)).sort((a,b)=>SKILLS[b].mult-SKILLS[a].mult);for(const id of own)if(rnd()<SKILLS[id].rate)return id;return null}
/* pot = trần của bậc × tỉ lệ theo vị trí (chỉ số mấu chốt = trần, chỉ số phụ tối thiểu ~1/3 trần).
   Cầu thủ mới có Độ kích thích 30% (như game gốc); đội mẫu đã kích sẵn vài lần. */
/* ===== QUY TẮC GOAT: Icon Messi và Icon Ronaldo luôn là 2 cầu thủ mạnh nhất game =====
   Tiềm năng của họ được nhân 1,12; mọi Icon khác (kể cả Icon thêm sau này) tự bị giới hạn
   để tiềm năng trung bình không vượt quá 96% của người yếu hơn trong hai người. */
const GOAT=["Messi","Ronaldo"];
const isGoat=(n,tier)=>tier===6&&GOAT.includes(n);
let GOAT_REF=null,GOAT_BUSY=false;
const potAvg=p=>ATTR.reduce((s,[k])=>s+p.pot[k],0)/ATTR.length;
function goatRef(){if(GOAT_REF!==null)return GOAT_REF;if(GOAT_BUSY)return Infinity;GOAT_BUSY=true;
  try{GOAT_REF=Math.min(...GOAT.map(n=>{const s=STARS.find(x=>x[0]===n&&x[2]===6);return s?potAvg(mk(n,s[1],6,s[4]||"P",0)):Infinity}))}catch(e){GOAT_BUSY=false;return Infinity}
  GOAT_BUSY=false;return GOAT_REF}
function goatGuard(p){const lim=goatRef()*0.96,a=potAvg(p);if(!(a>lim))return;const f=lim/a;for(const [k] of ATTR)p.pot[k]=r1(p.pot[k]*f)}
function mk(n,pos,tier,chan,kicks){const r=seeded(hashN(n)),cap=TIERS[tier].cap,p={n,pos,chan,tier,sta:100,base:{},pot:{},imp:{},starB:{},plan:[],tp:2000,star:0,ktUsed:0,ktLast:0};
  p.kt=30;const nk=kicks??(2+Math.floor(r()*5));for(let i=0;i<nk;i++){const x=r();p.kt+=x<.3?1+Math.floor(r()*2):x<.75?3+Math.floor(r()*2):x<.95?5+Math.floor(r()*2):7}p.ktUsed=nk;
  p.tn=60+Math.floor(r()*41);p.age=18+Math.floor(r()*15);p.cao=168+Math.floor(r()*24);p.nang=p.cao-105+Math.floor(r()*10);
  const goat=isGoat(n,tier);
  for(const [k] of ATTR){const ratio=Math.max(0.33,Math.min(1,(ROLE[pos][k]??BASE[k])/505))*(0.9+0.1*r());p.pot[k]=r1(Math.min(cap-0.1,cap*ratio*(goat?1.12:1)))}
  if(tier===6&&!goat)goatGuard(p);
  for(const [k] of ATTR)p.base[k]=r1(p.pot[k]*p.kt/100*(0.8+0.15*r()));
  p.plan=Object.entries(OVR[pos]).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
  p.skills=skillsFor(n,tier);
  clampBase(p);refresh(p);return p}
const maxOf=(p,k)=>r1(p.pot[k]*p.kt/100);
function clampBase(p){for(const [k] of ATTR)p.base[k]=Math.min(p.base[k],maxOf(p,k))}
function refresh(p){for(const [k] of ATTR)p[k]=r1(p.base[k]+(p.imp[k]||0)+(p.starB[k]||0))}
const overallMax=p=>ATTR.reduce((s,[k])=>s+maxOf(p,k)+(p.imp[k]||0)+(p.starB[k]||0),0)/ATTR.length;
/* Đội khởi đầu: cầu thủ vô danh bậc Trắng / Xanh lá. Ngôi sao phải chiêu mộ ở Môi giới. */
function defaultTeams(){return{
 club:{gold:100000,xu:200,phieu:1000,the:8,bh:0},
 home:{name:"FC Sông Hồng",color:"#e8372c",players:[
  mk("Văn Phong","TM",0,"P"),mk("Đức Bình","HVC",0,"T"),mk("Minh Cường","HV",1,"P"),mk("Quốc Dũng","HV",0,"P"),mk("Hữu Hải","HVC",0,"P"),
  mk("Thành Khánh","TVC",0,"P"),mk("Công Lâm","TV",1,"P"),mk("Tuấn Long","TV",0,"P"),mk("Văn Nam","TVC",0,"T"),
  mk("Đức Sơn","TĐ",1,"P"),mk("Minh Tâm","TĐ",0,"P")]},
 away:{name:"Sài Gòn United",color:"#2f7ff0",players:[
  mk("Hữu Phát","TM",0,"P"),mk("Quốc Bảo","HVC",0,"T"),mk("Thành Trung","HV",0,"P"),mk("Văn Vinh","HV",1,"P"),mk("Công Toàn","HVC",0,"P"),
  mk("Tuấn Thắng","TVC",0,"P"),mk("Minh An","TV",0,"T"),mk("Đức Hải","TV",1,"P"),mk("Hữu Long","TVC",0,"P"),
  mk("Quốc Phong","TĐ",1,"P"),mk("Văn Khánh","TĐ",0,"P")]}
};}
/* ===== CHIẾN THUẬT (hiện ở màn hình giữa các pha) =====
   Tấn công: đổi tần suất loại pha. Phòng thủ: +3% mỗi cấp cho chỉ số phòng ngự liên quan. */
const ATK_TAC={"Chuyền ngắn":{pass:1.5,combo:1.5},"Dàn cánh":{cross:1.8},"Sút xa":{long:1.9},"Đột phá":{solo:1.6,drib:1.3,lob:1.3}};
const DEF_TAC={"Ép sân":{k:"xoac",foul:1.25},"Khu vực":{k:"doat"},"Kèm người":{k:"bat"}};
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
function applyLineup(t){const f=FORMS[tacOf(t).form]||FORMS["442A"];t.players.forEach((p,i)=>{p.role=f[i][0];p.sx=f[i][1];p.fit=fitOf(p.pos,p.role)});(t.subs||[]).forEach(p=>{p.role=null;p.sx=null;p.fit=1})}
// cánh của cầu thủ theo ô trong đội hình: T (trái) / P (phải) / "" (giữa)
const sideOf=p=>p.sx==null?"":p.sx<40?"T":p.sx>60?"P":"";
// tên vị trí như game gốc: T.M, Tr.Vệ, H.Vệ T/P, T.Vệ, T.Vệ T/P, T.Đạo T/P
function posLabel(p){const r=roleOf(p),s=sideOf(p);return r==="TM"?"T.M":r==="HV"?"Tr.Vệ":r==="HVC"?"H.Vệ "+(s||"T"):r==="TV"?"T.Vệ"+(s?" "+s:""):r==="TVC"?"T.Vệ "+(s||"P"):"T.Đạo"+(s?" "+s:"")}
// Đổi đội hình: xếp lại 11 người đá chính vào vị trí hợp nhất (ưu tiên đúng sở trường, rồi thực lực)
function autoArrange(t){const f=FORMS[tacOf(t).form],pool=t.players.slice(),out=Array(11),used=new Set(),pairs=[];
  // ghép toàn cục: cặp (vị trí, cầu thủ) điểm cao nhất được xếp trước — đúng sở trường quan trọng hơn thực lực
  f.forEach((s,i)=>pool.forEach((p,j)=>pairs.push([fitOf(p.pos,s[0])*10000+overall(p),i,j])));
  pairs.sort((a,b)=>b[0]-a[0]);
  for(const [,i,j] of pairs){if(out[i]||used.has(j))continue;out[i]=pool[j];used.add(j)}
  t.players=out;applyLineup(t)}
// Chiến thuật theo hiệp: hiệp 2 dùng atk2/def2 nếu có
function halfTac(t){const c=tacOf(t),h2=typeof M!=="undefined"&&M&&M.min>=45;return{atk:(h2&&c.atk2)||c.atk,def:(h2&&c.def2)||c.def,atkLv:c.atkLv,defLv:c.defLv}}
function freshT(){const t=defaultTeams();t.home.tac={form:"442A",atk:"Dàn cánh",atkLv:1,def:"Ép sân",defLv:1};t.away.tac={form:"442A",atk:"Chuyền ngắn",atkLv:1,def:"Khu vực",defLv:1};
  t.home.subs=[mk("Quốc Thắng","TM",0,"P"),mk("Hữu Toàn","HV",0,"P"),mk("Văn Trung","TV",0,"P"),mk("Công Vinh","TĐ",0,"P")];
  t.away.subs=[];squad(t.home).concat(squad(t.away)).forEach(p=>p.q="vn");applyLineup(t.home);applyLineup(t.away);return t}
let T=freshT();

/* ================== CÔNG THỨC ==================
   Chỉ số gốc ~100–700 được quy về thang ~0–100 (chia 6.5),
   rồi nhân với thể lực còn lại và độ kích thích.                               */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=Math.random;
// tinh thần đội (M.mor) ~ 200–800, 500 là trung tính: ±6% chỉ số
const morOf=p=>(typeof M!=="undefined"&&M&&M.mor&&p._side!==undefined)?M.mor[p._side]:500;
/* Tinh thần thi đấu (như game gốc): chỉ số cầu thủ ngoài sân × (0.5 + tinh thần/1000) → 500 giữ nguyên, 824 ×1.32, 352 ×0.85.
   Thủ môn không bị ảnh hưởng. Dò từ game gốc: đội đầu 151+138 vs 172+346 khi tinh thần 824/352 vẫn ra 26%. */
const morMul=p=>roleOf(p)==="TM"?1:0.5+morOf(p)/1000;
const eff=(p,k)=>(p.fit||1)*p[k]/6.5*(0.6+0.4*p.sta/100)*morMul(p);
/* Đối đầu theo TỈ LỆ (không theo hiệu số), nên cân bằng giữ nguyên dù chỉ số đang 80 hay 600.
   g = 48/k: k=12 → g=4 (mạnh hơn 20% thắng ~67%, mạnh hơn 50% thắng ~83%). */
/* ===== THAM SỐ CÂN BẰNG (dò bằng mô phỏng hàng nghìn trận / kịch bản, công cụ tools/mo-phong-can-bang.js) =====
   DUEL_G: độ dốc các pha tranh chấp trước khi dứt điểm (đi bóng, chuyền, tắc…)
   CH_G / CH_BASE: tỉ lệ "Sút vào" của cơ hội dứt điểm, dò theo game gốc (xem chanceP)
   GAP   : số phút giữa hai pha → ~9 pha, ~2.6 bàn/trận giữa hai đội ngang nhau
   MOR_E / POS_E: tinh thần đầu trận và lợi thế giành quyền tấn công theo Công/Thủ
   Kết quả: hơn 1 bậc thắng ~65–70%, hơn 2 bậc ~90%, kích 100% vs 70% ~85%, 10 sao vs 0 sao ~+20%.
   Mọi thế trận và chiến thuật ngang nhau (±3%); mỗi chỉ số +25% đều làm đội mạnh lên. */
const GK_F=0.65, DUEL_G=13, MOR_E=0.12, POS_E=0.4;
const GAP=()=>8+Math.floor(rnd()*8); // số phút giữa hai pha bóng → khoảng 8 pha/trận
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
const ATK_K={sut:.25,re:.15,toc:.15,bpha:.1,chuyen:.15,sxa:.1,dau:.1},DEF_K={xoac:.3,doat:.3,bat:.15,the:.1,toc:.15};
const WA={"TĐ":1,TVC:.8,TV:.6,HVC:.3,HV:.1,TM:0},WD={TM:1.2,HV:1,HVC:.8,TV:.5,TVC:.3,"TĐ":.1};
const rate=(p,K)=>Object.entries(K).reduce((s,[k,w])=>s+eff(p,k)*w,0);
function atkDef(t){let a=0,d=0;for(const p of t.players){a+=WA[roleOf(p)]*rate(p,ATK_K);d+=WD[roleOf(p)]*(roleOf(p)==="TM"?eff(p,"cuu"):rate(p,DEF_K))}return{a:r1(a*1.6),d:r1(d*1.6)}}
function control(t){let s=0,w=0;for(const p of t.players){const k=PW[roleOf(p)];if(!k)continue;s+=k*(0.4*eff(p,"chuyen")+0.3*eff(p,"re")+0.3*eff(p,"doat"));w+=k}return s/w}

let M;
function initMor(){T.home.players.forEach(p=>p._side=0);T.away.players.forEach(p=>p._side=1);
  M.mor=[500,500];const H=atkDef(T.home),A=atkDef(T.away);
  const mr=(a,d,a2,d2)=>clamp(Math.round(500*Math.pow(a/d,MOR_E)*Math.pow(d2/a2,MOR_E/2)),150,900);M.mor=[Math.min(950,Math.round(mr(H.a,A.d,A.a,H.d)*(1+0.005*(window.mstat?mstat("qu"):0)))),mr(A.a,H.d,H.a,A.d)];M.ad=[H,A]}

// Tải sẵn + giải mã ảnh chân dung của 2 đội trước trận (khung kỹ năng, bảng cơ hội hiện ra ngay, không bị khựng lần đầu)
const PRE=new Map();function preloadFaces(){const go=()=>{for(const t of [T.home,T.away])for(const p of squad(t)){const s=faceSrc(p);if(!s||PRE.has(s))continue;const im=new Image();im.decoding="async";im.src=s;PRE.set(s,im);if(im.decode)im.decode().catch(()=>{})}};(window.requestIdleCallback||setTimeout)(go)}
function newMatch(){preloadFaces();if(typeof showIdle==="function")setTimeout(()=>showIdle("00:00"),0);squad(T.home).concat(squad(T.away)).forEach(p=>{p.sta=100;refresh(p)});applyLineup(T.home);applyLineup(T.away);M={min:0,score:[0,0],log:[],shots:[0,0],done:false,busy:false,auto:false,hold:0,queue:null,inv:new Set()};initMor();scene=null;hidePop();render();renderSquad();document.getElementById("log").innerHTML="";document.getElementById("roll").innerHTML='<span class="note">Mỗi pha sẽ hiện xác suất và kết quả.</span>';setCmt("Bấm “Đá trận” để bắt đầu.")}
function setCmt(t){document.getElementById("cmt").textContent=t}
function addLog(t,g){M.log.push(t);const d=document.createElement("div");d.textContent=`${M.min}' ${t}`;if(g)d.className="g";document.getElementById("log").prepend(d);setCmt(t)}
let rolls=[];function roll(label,p,ok,detail){rolls.push({label,p,ok,detail});document.getElementById("roll").innerHTML=rolls.map(r=>`<div class="row"><span>${r.label}<br><span class="note">${r.detail}</span></span><span class="mono ${r.ok?"ok":"ko"}">${Math.round(r.p*100)}% ${r.ok?"✓":"✗"}</span><div class="bar"><i style="width:${r.p*100}%"></i></div></div>`).join("")}


/* ===== HỆ THỐNG KỸ NĂNG: skB(p,[ids]) tung tỉ lệ kích hoạt kỹ năng mạnh nhất cầu thủ có trong danh sách → {id,m} (m = hệ số sức) */
function skB(p,ids){if(!p)return{id:null,m:1,pid:null};const own=ids.filter(id=>SKILLS[id]&&hasSkill(p,id)).sort((a,b)=>SKILLS[b].mult-SKILLS[a].mult);
  let id=null,am=1;for(const k of own.filter(k=>!SKILLS[k].pas))if(rnd()<SKILLS[k].rate){roll(`Kỹ năng: ${SKILLS[k].n}`,SKILLS[k].rate,true,`${p.n} — ${SKILLS[k].desc}`);id=k;am=SKILLS[k].mult;break}
  const pid=own.find(k=>SKILLS[k].pas)||null,pm=pid?SKILLS[pid].mult:1;if(pid)roll(`Bị động: ${SKILLS[pid].n}`,1,true,`${p.n} ×${pm}`);
  return{id,m:am*pm,pid,pm}}
// hệ số bị động riêng (không tung tỉ lệ), dùng khi kỹ năng chủ động được chọn bằng trySkill
const pasM=(p,ids)=>{const s=skB(p,ids.filter(k=>SKILLS[k]&&SKILLS[k].pas));return s.pm||1};
const onPitch=(t,id)=>t.players.some(p=>hasSkill(p,id));
const auraLQ=t=>onPitch(t,"nhactruong")?SKILLS.nhactruong.mult:1;
const SK_DRIB=["aothuat","trickS","trickA"],SK_PASS=["thanhchuyen","tikiS","tikiA"],SK_PACE=["sieubuttoc","matocdo"],SK_PHYS=["bruiserS","bruiserA","cungthep"];
// gắn kỹ năng vào ô cầu thủ của bảng cơ hội (khung kỹ năng hiện dưới bảng); chỉ 1 kỹ năng/bảng
function skE(e,s){return s&&s.id?{...e,skill:s.id}:e}
// chọn cầu thủ có ưu tiên kỹ năng (vd Sát thủ băng cắt: dễ được chọn nhận bóng solo)
function rpSk(team,w,k,not,vs,id,mul){const keep=rnd;let pick=rp(team,w,k,not,vs);const own=team.players.filter(p=>p!==not&&roleOf(p)!=="TM"&&hasSkill(p,id));
  if(own.length&&!hasSkill(pick,id)){const n=team.players.filter(p=>p!==not&&roleOf(p)!=="TM").length,pr=own.length*mul/(own.length*mul+n-own.length);
    if(rnd()<pr*0.5)pick=own[(rnd()*own.length)|0]}return pick}
/* ================== TÌNH HUỐNG ================== */
const ent=(p,team,k,lab)=>({p,team,lab:lab||LBL[k],v:p[k]});
function makeCtx(atk,def,side){return{atk,def,side,S:[],actors:[],ids:{},G:def.players.find(p=>roleOf(p)==="TM")}}
function add(c,role,p,team,x,y){const a={p,team,x,y,role};c.actors.push(a);c.ids[role]=a;return a}
const OUT=[[8,10],[8,58],[6,34]];

// Kết thúc bằng cú sút: dùng chung cho mọi loại pha
/* ===== TỈ LỆ CỦA MỘT CƠ HỘI (theo game gốc): so chỉ số bên công với bên thủ
   x = (công/thủ)^g ; tỉ lệ = x / (x + (1-base)/base), giới hạn 3%–95%. base = tỉ lệ khi hai bên ngang nhau.
   "Lừa qua" (g=2.3, base 50%) — dò từ game gốc: Lừa 438 vs Cắt 454 → 48%, Lừa 522 vs Xoạc 408 → 61%,
        Thể trạng 353 vs 250 → 70%, Bứt phá 334 vs Tốc độ 154 → 90%, Tốc độ 245 vs Đội đầu 498 → 24%.
   "Sút vào" (g=2.675): Sút 766 vs Cứu 448 → 90%; Chuyền dài 495 vs Kh.Chiến 830 → 29%;
        đội đầu (tổng 2 người mỗi bên) 558+392 vs 290+592 → 39%, 101+218 vs 374+448 → 4%.
   Cơ hội dứt điểm (2 đánh 1): Thể trạng 435 (+Chuyền 69) vs 377 → 44%; 337 (+476) vs 164 → 90%.
   2 đấu 2: người chuyền tính 50% — Solo: Tốc độ 139 + ½·Chuyền dài 175 vs Bứt phá 304 → 34%; Sút xa 418 vs Cứu 777 → 35%. */
const CH_G=2.675,LQ_G=2.3,CH_BASE={lq:0.5,dd:0.344,sut:0.68,dau:0.344,cdai:0.62,sxa:0.72,dphat:0.5,pden:0.78};
function chanceP(att,def,base,gg=CH_G){const x=Math.pow(Math.max(att,.1)/Math.max(def,.1),gg),k=(1-base)/base;return clamp(x/(x+k),0.03,0.95)}
function finishShot(c,o){
  const {role,from,stat,title}=o;const Sh=c.ids[role].p,G=c.G;M.shots[c.side]++;
  let p,goal,pop;
  if(o.p!==undefined){p=o.p;goal=o.goal;pop=o.pop} // đánh đầu: đã tính sẵn ở sceneCross
  else{const dist=Math.hypot(52.5-from[0],34-from[1]),weak=!o.volley&&rnd()<0.3;
    if(o.volley&&hasSkill(Sh,"bike")&&rnd()<SKILLS.bike.rate){o.skill=true;o.title="Kỹ Năng: Ngả Bàn Đèn";roll("Kỹ năng: Ngả Bàn Đèn",SKILLS.bike.rate,true,`${Sh.n} ★${Sh.star} — sức sút vào ×${SKILLS.bike.mult}`)}
    const ss=o.skill?{id:null,m:1}:skB(Sh,stat==="sxa"?["sutxa","sutxoay"]:stat==="dphat"?["bendit","sutphat","sutxoay"]:o.volley?["vole"]:[]);
    const gsk=skB(G,stat==="sxa"||stat==="dphat"?["gkbatbai"]:stat==="sut"?["gkphanung"]:stat==="cdai"?["gkkhongchien"]:[]);
    const gs=stat==="cdai"?"kchien":"cuu",att=eff(Sh,stat)*(weak?0.9:1)*(o.pressure||1)*(o.skill?SKILLS.bike.mult:1)*ss.m,
      def=(stat==="sxa"&&ss.pid!=="sutxoay"?0.7*eff(G,"cuu")+0.3*eff(G,"dbong"):eff(G,gs))*gsk.m;o._ss=ss.id;o._gs=gsk.id;
    const base=CH_BASE[stat]*(stat==="sxa"?clamp(1.5-dist/40,0.8,1.05):stat==="sut"?clamp(1.25-dist/40,0.85,1.05):1);
    p=chanceP(att,def,base);goal=rnd()<p;
    roll("Sút vào",p,goal,`${LBL[stat]} ${Sh[stat]}${weak?" (chân không thuận ×0.9)":""} vs ${stat==="sxa"?`0.7·Cứu bóng ${G.cuu} + 0.3·Đấm bóng ${G.dbong}`:`${LBL[gs]} ${G[gs]}`}`);
    if(o._ss==="bendit")o.title="Kỹ Năng: Bend It Like Beckham";pop={title:o.title||title,sub:"Sút vào",L:[{...ent(Sh,c.atk,stat),skill:o.skill?"bike":o._ss}],R:[skE(ent(G,c.def,gs),{id:o._gs})],p,ok:goal}}
  const on=goal||rnd()<0.55,gk=eff(G,"cuu");
  const lab=o.header?`Đánh đầu: ${Sh.dau}`:`${LBL[stat]}: ${Sh[stat]}`;
  if(!o.header)c.S.push({dur:0.4,t:{G:[51-(gk-60)/40,34+(from[1]-34)*0.25]},ball:o.volley?{fly:null,to:[from[0]+0.3,from[1]],h:1.6,endH:1.4}:{carry:o.noCarry?undefined:role},popup:pop,label:{[role]:o.volley?(o.skill?"Ngả bàn đèn!":"Vô-lê!"):lab},txt:o.volley?(o.skill?`Bóng bổng tới, ${Sh.n} tung người ngả bàn đèn!`:`Bóng bổng tới, ${Sh.n} tung chân vô-lê!`):`${Sh.n} lấy đà dứt điểm!`});
  const air=o.header||(o.volley&&o.skill);
  outcome(c,{goal,on,role,from,popup:o.header&&!o.popShown?pop:null,label:air?{[role]:o.skill?"Ngả bàn đèn!":lab}:null,peak:o.peak??(air?0.9:1.2),kicker:air?null:(o.kicker||(o.volley?role:undefined)),kind:stat==="sxa"?"long":stat==="dphat"?(o._ss==="bendit"?"bendit":"fk"):o.volley?"volley":"shot",hAnim:o.skill||o.bike?"bike":"jump",header:o.header,header:o.header});
  return goal?"goal":on?"save":"miss";
}
function outcome(c,o){
  const ty=o.on?(rnd()<.5?30.8+rnd()*1.5:35.7+rnd()*1.5):(rnd()<.5?27+rnd()*2:39+rnd()*2);
  const endH=o.on?0.3+rnd()*1.8:rnd()<.4?3:0.6;
  const extra={popup:o.popup||undefined,label:o.label||undefined,kicker:o.kicker||undefined,kickSet:o.kind};
  const hA=o.label?{[o.role]:o.hAnim||"jump"}:{};
  const Sh=c.ids[o.role].p,G=c.G;
  if(o.goal){c.S.push({dur:0.7,t:{G:[51.5,ty+(ty<34?2.5:-2.5)]},ball:{fly:null,to:[53.4,ty],h:o.peak,endH},anim:{G:"dive",...hA},txt:o.kind==="long"?`Bóng bay rất nhanh nên dù thủ môn ${G.n} đã cố gắng đấm bóng ra ngoài vẫn không cản được. VÀOOO!`:`VÀOOO! ${Sh.n} ghi bàn cho ${c.atk.name}!`,goal:true,...extra});
    c.S.push({dur:2.2,t:{[o.role]:[o.from[0]-7,clamp(o.from[1]+(o.from[1]<34?-6:6),6,62)]},ball:{},anim:{[o.role]:"celebrate"},txt:`${Sh.n} chạy về phía khán đài ăn mừng`});c.scorer=Sh}
  else if(o.on){const deflect=[48,ty<34?ty-12:ty+12];
    c.S.push({dur:0.6,t:{G:[51.6,ty]},ball:{fly:null,to:[51.6,ty],h:o.peak,endH},anim:{G:"dive",...hA},txt:o.header?`${Sh.n} đánh đầu hiểm hóc, ${G.n} bay người cứu thua!`:o.kind==="long"?`${G.n} bay người đấm bóng ra ngoài!`:rnd()<.5?`${Sh.n} giơ chân sút bóng, thủ môn ${G.n} dùng sức cứu bóng ra khỏi đường biên dọc`:`${G.n} bay người cản phá xuất thần!`,...extra});
    const pHold=clamp(eff(G,"dbong")/110*(hasSkill(G,"gkdam")?1.3:1),0.1,0.8),hold=rnd()<pHold;roll("Đấm bóng giải nguy",pHold,hold,`Đấm bóng ${G.dbong}`);
    if(hold){c.S.push({dur:0.8,t:{},ball:{fly:null,to:[36+rnd()*6,ty<34?10+rnd()*8:50+rnd()*8],h:4},txt:`${G.n} đấm bóng ra xa, giải nguy thành công!`});}
    else{const corner=rnd()<0.55;
    c.S.push({dur:0.6,t:{},ball:{fly:null,to:corner?[53.5,ty<34?14:54]:deflect,h:1.2},txt:corner?`Bóng đi hết đường biên ngang, phạt góc cho ${c.atk.name}`:"Bóng bật ra, hậu vệ kịp phá"});
    if(corner)M.queue={type:"corner",side:c.side}}}
  else c.S.push({dur:0.8,t:{},ball:{fly:null,to:[53.6,ty],h:o.peak+1.5,endH},anim:o.label?hA:undefined,txt:"Bóng đi chệch khung thành",...extra});
  if(!o.goal&&rnd()<0.6)c.S.push({dur:1.6,t:{},ball:{},anim:{[o.role]:"regret"},txt:`${Sh.n} ôm đầu tiếc nuối`});
}

/* ===== CÁC TÌNH HUỐNG (giống game gốc, tối đa 4 cầu thủ). Mỗi cơ hội: bước "Lừa qua" rồi bước "Sút vào".
   Cơ hội sút gần 1 đấu 1 : Rê dắt vs Xoạc                         → Sút vs Cứu bóng        — sceneDribble
   Cơ hội sút gần 2 đánh 1: Rê dắt + Chuyền đồng đội vs Đoạt (Cắt)  → đồng đội Sút vs Cứu    — scenePass
   Cơ hội dứt điểm 2 đánh 1 [Sút vô-lê]: Thể lực + Chuyền vs Thể lực → Sút vs Cứu bóng     — sceneCombo
   Cơ hội vô-lê 1 đấu 1   [Sút vô-lê]: Thể lực vs Thể lực          → Sút vs Cứu bóng        — sceneVolley
   Cơ hội sút xa          [Sút xa]   : Rê dắt vs Đoạt (Cắt)        → Sút xa vs Cứu bóng     — sceneLong
   Cơ hội Solo                        : Bứt phá vs Tốc độ           → Sút vs Cứu bóng        — sceneSolo
   Cơ hội đá bổng                     : Tốc độ vs Đ.Đầu             → Ch.dài vs Kh.Chiến     — sceneLob
   2 đấu 2 Solo → Vô-lê: Tốc độ + ½·Ch.dài người chuyền vs Bứt phá → bật tường → Sút vs Cứu — sceneSoloVolley
   2 đấu 2 Sút xa      : Rê dắt + ½·Chuyền người chuyền vs Xoạc → Sút xa vs Cứu bóng       — sceneLong2
   Cơ hội đội đầu (tạt / phạt góc)    : Ch.dài + Đ.Đầu vs Nhảy + Kh.Chiến                  — sceneCross
   Cơ hội sút phạt: Đá phạt vs Cứu bóng · Phạt đền: Phạt đền vs Cứu bóng                                 */
// Bước "Lừa qua": hiện bảng, tung xác suất, diễn hoạt. Trả về true nếu qua được.
function lqStep(c,o){o.att*=auraLQ(c.atk);const p=chanceP(o.att,o.def,o.base??CH_BASE.lq,o.g??LQ_G),ok=rnd()<p;
  roll(o.rollLab||"Lừa qua",p,ok,o.detail);
  // bảng hiện trước (cầu thủ đứng đối mặt), động tác lừa/kỹ năng diễn SAU khi bảng đóng để người chơi nhìn thấy
  c.S.push({dur:0.6,t:o.t||{},ball:o.ball||{carry:o.holder||"A"},popup:{title:o.title,sub:"Lừa qua",L:o.L,R:o.R,p,ok},label:o.label,txt:o.txt});
  if(ok&&o.anim){const who=Object.keys(o.anim)[0],nm=o.anim[who],sk=SKILLS[nm];
    c.S.push({dur:sk?1.1:0.9,t:{},ball:{carry:who},anim:o.anim,label:sk?{[who]:sk.n+"!"}:undefined,txt:sk?`${c.ids[who].p.n} tung kỹ năng ${sk.n}!`:`${c.ids[who].p.n} đảo người lừa bóng`})}
  return ok}
function lostBall(c,D,who,txt){const A=c.ids[who].p;
  if(hasSkill(A,"anva")&&rnd()<SKILLS.anva.rate){roll("Kỹ năng: Ăn Vạ",SKILLS.anva.rate,true,`${A.n} ngã vật ra sân`);
    c.S.push({dur:1.2,t:{D:[c.ids[who].x+0.6,c.ids[who].y]},ball:{carry:who},anim:{D:"slide",[who]:"fall"},skfx:{role:who,id:"anva"},txt:`${D.n} vào bóng, ${A.n} ngã vật ra sân. Trọng tài thổi phạt!`});
    M.queue={type:"fk",side:c.side,pos:[33.5,c.ids[who].y]};return "foul"}
  if(hasSkill(A,"noluc")&&rnd()<SKILLS.noluc.rate){roll("Kỹ năng: Nỗ Lực Đến Cùng",SKILLS.noluc.rate,true,`${A.n} giành lại bóng`);
    const sp=shotSpot(c.ids[who].y);c.S.push({dur:0.9,t:{D:[c.ids[who].x+0.6,c.ids[who].y]},ball:{carry:"D"},anim:{D:"slide"},txt:txt||`${D.n} xoạc bóng chuẩn xác`});
    c.S.push({dur:1.2,t:{[who]:sp},ball:{carry:who},skfx:{role:who,id:"noluc"},txt:`${A.n} không bỏ cuộc, lăn xả giành lại bóng!`});
    return finishShot(c,{role:who,from:sp,stat:"sut",title:"Cơ Hội Sút Gần"})}
  c.S.push({dur:0.9,t:{D:[c.ids[who].x+0.6,c.ids[who].y]},ball:{carry:"D"},anim:{D:"slide",[who]:"fall"},txt:txt||`${D.n} xoạc bóng chuẩn xác`});
  c.S.push({dur:1,t:{},ball:{fly:null,to:OUT[(rnd()*3)|0],h:2},txt:`${D.n} phá bóng ra xa`});return "lost"}
// phạm lỗi khi bị vượt qua: Xoạc thấp thì dễ phạm lỗi → đá phạt / phạt đền
function tryFoul(c,A,D,y0,a){const pF=clamp((0.06+0.22*(1-duel(eff(D,"xoac"),a,12)))*(DEF_TAC[halfTac(c.def).def].foul||1),0.04,0.26);
  if(rnd()>=pF)return false;roll("Phạm lỗi",pF,true,`Xoạc ${D.xoac} càng thấp càng dễ phạm lỗi`);
  c.S.push({dur:1,t:{D:[33.4,y0]},ball:{carry:"A"},anim:{D:"slide",A:"fall"},txt:`${D.n} phạm lỗi với ${A.n}. Trọng tài thổi phạt trực tiếp!`});
  if(rnd()<0.25&&Math.abs(y0-34)<14){c.S[c.S.length-1].txt=`${D.n} phạm lỗi với ${A.n} trong vòng cấm. PHẠT ĐỀN!`;M.queue={type:"pen",side:c.side}}
  else M.queue={type:"fk",side:c.side,pos:[33.5,y0]};return true}
/* Chọn cầu thủ tham gia tình huống: MỌI cầu thủ trên sân (trừ thủ môn) đều có thể được chọn, như game gốc
   (tiền vệ vẫn ra chặn, hậu vệ vẫn dâng lên tấn công). Vị trí chỉ quyết định khả năng được chọn,
   ai có chỉ số liên quan cao hơn cũng dễ được chọn hơn một chút.                                         */
const RW={
 dNear:{HV:3,HVC:2.5,TV:1.6,TVC:1,"TĐ":.3},   // phòng ngự gần khung thành
 dFar :{TV:3,HV:2,HVC:2,TVC:1.5,"TĐ":.6},      // phòng ngự xa (sút xa, solo, chặn chuyền)
 aFin :{"TĐ":3,TVC:2,TV:1.4,HVC:.5,HV:.35},    // người dứt điểm
 aMid :{TV:3,TVC:2.5,HVC:1.6,"TĐ":1,HV:.7},    // người cầm bóng / chuyền
 aHead:{"TĐ":3,HV:1,TV:1,TVC:.8,HVC:.5}};       // người đội đầu
const mirror=s=>s==="T"?"P":s==="P"?"T":"";
function rp(team,w,k,not,vs){const arr=team.players.filter(p=>roleOf(p)!=="TM"&&p!==not);const mx=Math.max(...arr.map(p=>p[k]||1)),lane=vs?mirror(sideOf(vs)):null;
  const ws=arr.map(p=>(w[roleOf(p)]||.3)*(0.5+0.5*(p[k]||0)/mx)*(lane==null?1:sideOf(p)===lane?2.5:(sideOf(p)===""||lane==="")?1:0.35));let r=rnd()*ws.reduce((a,b)=>a+b,0);
  for(let i=0;i<arr.length;i++){r-=ws[i];if(r<=0)return arr[i]}return arr[arr.length-1]}
const laneY=p=>clamp(14+(p.sx??50)*0.4+(rnd()-.5)*8,12,56);
const setup=(c,A,D,y0,B)=>{add(c,"A",A,c.atk,20,y0);add(c,"D",D,c.def,35,clamp(y0+(rnd()-.5)*8,10,58));add(c,"G",c.G,c.def,51,34);if(B)add(c,"B",B,c.atk,24,clamp(y0+(y0<34?15:-15),6,62))};
const shotSpot=y=>[40+rnd()*4,clamp(y+(34-y)*.6,14,54)];
// 1) Cơ hội sút gần 1 đấu 1: lừa qua (Rê dắt vs Xoạc) rồi tự dứt điểm
function sceneDribble(c){
  const A=rp(c.atk,RW.aFin,"re"),D=rp(c.def,RW.dNear,"xoac",null,A),y0=laneY(A);setup(c,A,D,y0);
  c.S.push({dur:1.4,t:{A:[30,y0],D:[35,c.ids.D.y],G:[50.5,34+(y0-34)*.15]},ball:{carry:"A"},label:{A:`Rê dắt: ${A.re}`},txt:`${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  let skl=trySkill(A,["qntt","roulette","aothuat","stepover"]);const pm=pasM(A,["trickS","trickA"]);if(skl)roll(`Kỹ năng: ${SKILLS[skl].n}`,SKILLS[skl].rate,true,`${A.n} ★${A.star} — sức lừa ×${SKILLS[skl].mult}`);
  const a=eff(A,"re")*(skl?SKILLS[skl].mult:1)*pm,dsk=skB(D,["gadote","tacbong"]);
  const ok=lqStep(c,{title:skl?`Kỹ Năng: ${SKILLS[skl].n}`:"Cơ Hội Sút Gần",att:a,def:eff(D,"xoac")*defBoost(c.def,"xoac")*dsk.m,L:[{...ent(A,c.atk,"re"),skill:skl}],R:[skE(ent(D,c.def,"xoac"),dsk)],
    detail:`Rê dắt ${A.re}${skl?` ×${SKILLS[skl].mult}`:""}${pm>1?` ×${pm}`:""} vs Xoạc ${D.xoac}`,dur:skl?1.1:0.9,t:{A:[33.5,y0],D:[34.5,y0]},anim:{A:(skl&&(SKILLS[skl].anim||(["roulette","stepover"].includes(skl)&&skl)))||"lua",...(dsk.id==="gadote"?{D:"gadote"}:{})},label:{A:skl?SKILLS[skl].n+"!":`Rê dắt: ${A.re}`,D:`Xoạc: ${D.xoac}`},txt:skl?`${A.n} tung kỹ năng ${SKILLS[skl].n}!`:`${A.n} đối mặt ${D.n}`});
  if(!ok&&dsk.id==="gadote"&&rnd()<SKILLS.gadote.foul){roll("Phạm lỗi (Gà Đồ Tể)",SKILLS.gadote.foul,true,`${D.n} xoạc quá thô bạo`);
    c.S.push({dur:1,t:{D:[33.4,y0]},ball:{carry:"A"},anim:{A:"fall"},txt:`${D.n} xoạc quá thô bạo vào ${A.n}. Trọng tài thổi phạt trực tiếp!`});M.queue={type:"fk",side:c.side,pos:[33.5,y0]};return "foul"}
  if(!ok)return lostBall(c,D,"A");if(tryFoul(c,A,D,y0,a))return "foul";
  const sp=shotSpot(y0);c.S.push({dur:1.3,t:{A:sp,D:[sp[0]-3,sp[1]+(rnd()<.5?3:-3)]},ball:{carry:"A"},txt:`${A.n} đảo người qua ${D.n} đầy tinh tế!`});
  return finishShot(c,{role:"A",from:sp,stat:"sut",title:"Cơ Hội Sút Gần"});
}
// 2) Cơ hội sút gần 2 đánh 1: A lừa (Rê dắt) + B (Chuyền) vs hậu vệ cắt bóng (Đoạt) → A chuyền cho B dứt điểm
// Kỹ năng Đi Bộ Vượt Râu (Icon Messi): A (Messi) cầm bóng cùng đồng đội B đối mặt hậu vệ D → giả vờ đi bộ, chọc khe, B tự động lừa qua
function diboCombo(c,A,B,D,y0){if(!hasSkill(A,"dibo")||rnd()>=SKILLS.dibo.rate)return null;
  roll("Kỹ năng: Đi Bộ Vượt Râu",SKILLS.dibo.rate,true,`${A.n} ★${A.star||0} — đồng đội tự động lừa qua`);
  const at=r=>{for(let i=c.S.length-1;i>=0;i--)if(c.S[i].t&&c.S[i].t[r])return c.S[i].t[r];return[c.ids[r].x,c.ids[r].y]};
  const [ax]=at("A"),[bx,by]=at("B"),[dx,dy]=at("D");
  c.S.push({dur:0.6,t:{},ball:{carry:"A"},popup:{title:"Kỹ Năng: Đi Bộ Vượt Râu",sub:"Lừa qua",L:[{...ent(A,c.atk,"chuyen"),skill:"dibo"},ent(B,c.atk,"re")],R:[ent(D,c.def,"xoac")],p:1,ok:true},
    label:{A:`Chuyền bóng: ${A.chuyen}`,B:`Rê dắt: ${B.re}`},txt:`${A.n} cầm bóng, ${B.n} băng lên, ${D.n} lùi về đón lõng`});
  c.S.push({dur:1.2,t:{A:[ax+1.2,y0],D:[dx-1.2,(y0+dy)/2]},ball:{carry:"A"},anim:{A:"dibo"},label:{A:"Đi Bộ Vượt Râu!"},txt:`${A.n} thong thả đi bộ như không, ${D.n} bị hút theo!`});
  const rv=[Math.max(bx+2,dx),by];
  c.S.push({dur:0.8,t:{B:rv},ball:{fly:"B",to:rv},kicker:"A",kickSet:"pass",txt:`${A.n} bất ngờ chọc khe cho ${B.n}`});
  const sp=shotSpot(by);
  c.S.push({dur:1,t:{B:sp},ball:{carry:"B"},anim:{B:"lua"},txt:`${B.n} dễ dàng vượt qua ${D.n}, vượt qua rồi!`});
  return finishShot(c,{role:"B",from:sp,stat:"sut",title:"Cơ Hội Sút Gần"})}
function scenePass(c){
  const A=rp(c.atk,RW.aMid,"re"),B=rp(c.atk,RW.aFin,"sut",A),D=rp(c.def,RW.dNear,"doat",null,A),y0=laneY(A);setup(c,A,D,y0,B);
  c.S.push({dur:1.4,t:{A:[30,y0],D:[35,c.ids.D.y],G:[50.5,34+(y0-34)*.15],B:[33,c.ids.B.y]},ball:{carry:"A"},label:{A:`Rê dắt: ${A.re}`},txt:`${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  {const r=diboCombo(c,A,B,D,y0);if(r)return r}
  const sa=skB(A,SK_DRIB),sb=skB(B,["chaycho",...SK_PASS]),sd=skB(D,["deobam"]);
  const ok=lqStep(c,{title:"Cơ Hội Sút Gần",att:(eff(A,"re")*sa.m+0.5*eff(B,"chuyen")*(sb.pid==="thanhchuyen"?sb.m:1))*(["tikiS","tikiA","chaycho"].includes(sb.pid)?sb.m:1),def:eff(D,"doat")*defBoost(c.def,"doat")*sd.m,L:[skE(ent(A,c.atk,"re"),sa),skE(ent(B,c.atk,"chuyen"),sa.id?null:sb)],R:[skE(ent(D,c.def,"doat"),sd)],
    detail:`Rê dắt ${A.re} + 50%·Chuyền ${B.chuyen} vs Đoạt ${D.doat}`,t:{A:[33.5,y0],D:[34.5,y0]},anim:{A:"lua"},label:{A:`Rê dắt: ${A.re}`,D:`Đoạt: ${D.doat}`},txt:`${A.n} đối mặt ${D.n}, ${B.n} băng lên phối hợp`});
  if(!ok)return lostBall(c,D,"A",`${D.n} đọc tình huống và cắt bóng!`);
  const recv=shotSpot(c.ids.B.y);c.S.push({dur:0.9,t:{A:[36,y0],B:recv,D:[34,y0+1]},ball:{fly:"B",to:recv},kicker:"A",txt:`${A.n} chuyền bóng lên phía trên cho ${B.n}`});
  return finishShot(c,{role:"B",from:recv,stat:"sut",title:"Cơ Hội Sút Gần"});
}
// 3) Cơ hội dứt điểm 2 đánh 1 [Sút vô-lê]: A chuyền, B tì đè (Thể lực + 10% Chuyền A) vs Thể lực hậu vệ
function sceneCombo(c){
  const A=rp(c.atk,RW.aMid,"chuyen"),B=rp(c.atk,RW.aFin,"the",A),D=rp(c.def,RW.dNear,"the",null,B),y0=laneY(A);
  add(c,"A",A,c.atk,20,y0);add(c,"B",B,c.atk,26,clamp(y0+(y0<34?14:-14),6,62));add(c,"D",D,c.def,34,clamp(c.ids.B.y+(rnd()-.5)*4,8,60));add(c,"G",c.G,c.def,51,34);
  c.S.push({dur:1.3,t:{A:[27,y0],B:[31,c.ids.B.y],D:[34.5,c.ids.B.y+1],G:[50.5,34+(c.ids.B.y-34)*.15]},ball:{carry:"A"},label:{A:`Chuyền bóng: ${A.chuyen}`},txt:`${A.n} cầm bóng, ${B.n} băng lên chờ đường chuyền`});
  const recv=[32,c.ids.B.y],y=recv[1];c.S.push({dur:0.8,t:{B:recv},ball:{fly:"B",to:recv},kicker:"A",txt:`[Sút vô-lê] ${B.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  const sa=skB(A,SK_PASS),sb=skB(B,SK_PHYS),sd=skB(D,SK_PHYS);
  const ok=lqStep(c,{title:"Cơ Hội Dứt Điểm",base:CH_BASE.dd,g:CH_G,att:(eff(B,"the")*sb.m+0.1*eff(A,"chuyen")*(sa.pid==="thanhchuyen"?sa.m:1))*(sa.pid&&sa.pid!=="thanhchuyen"?sa.m:1),def:eff(D,"the")*defBoost(c.def,"the")*sd.m,L:[skE(ent(A,c.atk,"chuyen"),sb.id?null:sa),skE(ent(B,c.atk,"the"),sb)],R:[skE(ent(D,c.def,"the"),sd)],holder:"B",
    detail:`Thể lực ${B.the} + 10%·Chuyền ${A.chuyen} vs Thể lực ${D.the}`,t:{B:[34,y],D:[34.6,y+(rnd()<.5?1:-1)]},label:{B:`Thể lực: ${B.the}`,D:`Thể lực: ${D.the}`},txt:`${B.n} tì đè ${D.n}`});
  if(!ok)return lostBall(c,D,"B",`${D.n} tì vai lấy được bóng`);
  const sp=shotSpot(y);c.S.push({dur:1.1,t:{B:sp,D:[sp[0]-4,sp[1]+3],A:[36,y0]},ball:{carry:"B"},txt:`${B.n} vượt qua ${D.n}, tung cú vô-lê!`});
  return finishShot(c,{role:"B",from:sp,stat:"sut",title:"Cơ Hội Dứt Điểm",volley:true});
}
// 4) Cơ hội vô-lê 1 đấu 1 [Sút vô-lê]: Thể lực vs Thể lực
function sceneVolley(c){
  const A=rp(c.atk,RW.aFin,"the"),D=rp(c.def,RW.dNear,"the",null,A),y0=laneY(A);setup(c,A,D,y0);
  c.S.push({dur:1.3,t:{A:[31,y0],D:[34,c.ids.D.y],G:[50.5,34+(y0-34)*.15]},ball:{fly:null,to:[31,y0],h:2},label:{A:`Thể lực: ${A.the}`},txt:`[Sút vô-lê] ${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  const sa=skB(A,SK_PHYS),sd=skB(D,SK_PHYS);
  const ok=lqStep(c,{title:"Cơ Hội Vô-lê",att:eff(A,"the")*sa.m,def:eff(D,"the")*defBoost(c.def,"the")*sd.m,L:[skE(ent(A,c.atk,"the"),sa)],R:[skE(ent(D,c.def,"the"),sd)],
    detail:`Thể lực ${A.the} vs Thể lực ${D.the}`,t:{A:[33.5,y0],D:[34.2,y0+1]},label:{A:`Thể lực: ${A.the}`,D:`Thể lực: ${D.the}`},txt:`${A.n} tì đè ${D.n} chờ bóng rơi`});
  if(!ok)return lostBall(c,D,"A",`${D.n} tì vai lấy được bóng`);
  const sp=shotSpot(y0);c.S.push({dur:1,t:{A:sp,D:[sp[0]-3,sp[1]+3]},ball:{carry:"A"},txt:`${A.n} thoát khỏi ${D.n}, tung cú vô-lê!`});
  return finishShot(c,{role:"A",from:sp,stat:"sut",title:"Cơ Hội Vô-lê",volley:true});
}
// 5) Cơ hội đá bổng: Tốc độ vs Đ.Đầu hậu vệ, rồi bấm bóng qua đầu thủ môn (Ch.dài vs Kh.Chiến)
function sceneLob(c){
  const A=rp(c.atk,RW.aFin,"toc"),D=rp(c.def,RW.dNear,"dau",null,A),y0=laneY(A);
  add(c,"A",A,c.atk,22,y0);add(c,"D",D,c.def,34,clamp(y0+(rnd()-.5)*6,10,58));add(c,"G",c.G,c.def,51,34);
  c.S.push({dur:1.3,t:{A:[30,y0],D:[34,c.ids.D.y],G:[50.5,34+(y0-34)*.15]},ball:{carry:"A"},anim:{A:"bpha"},label:{A:`Tốc độ: ${A.toc}`},txt:`${A.n} dẫn bóng đột phá vòng vây`});
  const sa=skB(A,SK_PACE);
  const ok=lqStep(c,{title:"Cơ Hội Đá Bổng",att:eff(A,"toc")*sa.m,def:eff(D,"dau")*defBoost(c.def,"dau"),L:[skE(ent(A,c.atk,"toc"),sa)],R:[ent(D,c.def,"dau")],
    detail:`Tốc độ ${A.toc} vs Đ.Đầu ${D.dau}`,t:{A:[32.5,y0],D:[34,y0]},label:{A:`Tốc độ: ${A.toc}`,D:`Đ.Đầu: ${D.dau}`},txt:`${A.n} tăng tốc lao về phía ${D.n}`});
  if(!ok)return lostBall(c,D,"A",`${D.n} xoạc chân ra cắt đường bóng`);
  const sp=[39+rnd()*3,clamp(y0+(34-y0)*.5,14,54)];c.S.push({dur:1.1,t:{A:sp,D:[sp[0]-4,sp[1]+3],G:[49,34+(sp[1]-34)*.3]},ball:{carry:"A"},txt:`${A.n} vượt qua ${D.n}, thủ môn ${c.G.n} lao ra!`});
  return finishShot(c,{role:"A",from:sp,stat:"cdai",title:"Cơ Hội Đá Bổng",peak:3});
}
// 6) Cơ hội Solo: bứt phá vòng vây (Bứt phá vs Tốc độ) rồi đối mặt thủ môn
function sceneSolo(c){
  const A=rpSk(c.atk,RW.aFin,"bpha",null,null,"satthu",3),D=rp(c.def,RW.dFar,"toc",null,A),y0=laneY(A);
  add(c,"A",A,c.atk,22,y0);add(c,"D",D,c.def,33,clamp(y0+(rnd()<.5?6:-6),10,58));add(c,"G",c.G,c.def,51,34);
  c.S.push({dur:1.3,t:{A:[29,y0],D:[33,c.ids.D.y],G:[50.5,34+(y0-34)*.15]},ball:{carry:"A"},label:{A:`Bứt phá: ${A.bpha}`},txt:`[Solo] ${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  c.S.push({dur:1.1,t:{A:[33,y0],D:[34.5,y0+(c.ids.D.y<y0?-1.5:1.5)]},ball:{carry:"A"},anim:{A:"bpha"},label:{A:`Bứt phá: ${A.bpha}`},txt:`${A.n} dẫn bóng bứt phá vòng vây`});
  const sa=skB(A,SK_PACE),sd=skB(D,SK_PACE),st=!sa.id&&hasSkill(A,"satthu")?{id:"satthu"}:sa;
  const ok=lqStep(c,{title:"Cơ Hội Solo",att:eff(A,"bpha")*sa.m,def:eff(D,"toc")*defBoost(c.def,"toc")*sd.m,L:[skE(ent(A,c.atk,"bpha"),st)],R:[skE(ent(D,c.def,"toc"),sd)],
    detail:`Bứt phá ${A.bpha} vs Tốc độ ${D.toc}`,t:{A:[34,y0],D:[34.5,y0+(c.ids.D.y<y0?-1.5:1.5)]},label:{A:`Bứt phá: ${A.bpha}`,D:`Tốc độ: ${D.toc}`},txt:`${D.n} lao tới đuổi theo ${A.n}`});
  if(!ok)return lostBall(c,D,"A",`${D.n} đuổi kịp và lấy bóng trong chân ${A.n}`);
  const sp=[42+rnd()*3,clamp(y0+(34-y0)*.6,14,54)];c.S.push({dur:1.2,t:{A:sp,D:[sp[0]-5,sp[1]+(rnd()<.5?3:-3)]},ball:{carry:"A"},txt:`${A.n} dẫn bóng đột phá sâu vào khung thành, vượt qua rồi!`});
  return finishShot(c,{role:"A",from:sp,stat:"sut",title:"Cơ Hội Solo"});
}
// 3) Tạt bóng / phạt góc = "Cơ Hội Đội Đầu" (như game gốc):
//    Ch.dài (hoặc Phạt góc) người tạt + Đ.Đầu người đánh đầu  vs  Sức bật (Nhảy) hậu vệ + Kh.Chiến thủ môn → một tỉ lệ Sút vào.
function sceneCross(c,corner){
  const out=c.atk.players.filter(p=>roleOf(p)!=="TM");
  const C=corner?out.reduce((b,p)=>p.pgoc>b.pgoc?p:b):rp(c.atk,{TVC:3,HVC:2.5,TV:1.5,"TĐ":.6,HV:.4},"cdai");
  const H=rp(c.atk,corner?{"TĐ":3,HV:2.5,TV:1,TVC:.7,HVC:.6}:RW.aHead,"dau",C);
  const D=rp(c.def,{HV:3,HVC:1.5,TV:1.5,TVC:.6,"TĐ":.4},"bat",null,H);const wing=sideOf(C)==="T"?7:sideOf(C)==="P"?61:(rnd()<.5?7:61);
  if(corner){add(c,"C",C,c.atk,52.2,wing<34?1.3:66.7);add(c,"H",H,c.atk,40,34+(rnd()-.5)*10);add(c,"D",D,c.def,41,c.ids.H.y+1);add(c,"G",c.G,c.def,51.6,34);c.ballStart=[52.4,wing<34?1.5:66.5]}
  else{add(c,"C",C,c.atk,32,wing);add(c,"H",H,c.atk,37,34+(rnd()-.5)*8);add(c,"D",D,c.def,41,c.ids.H.y+1.5);add(c,"G",c.G,c.def,51,34)}
  const hp=[46+rnd()*2.5,31+rnd()*6],k=corner?"pgoc":"cdai";
  if(corner)c.S.push({dur:1.2,t:{H:[44,hp[1]+1],D:[44.5,hp[1]+1.8]},ball:{},label:{C:`Phạt góc: ${C.pgoc}`},txt:`${C.n} chuẩn bị đá phạt góc`});
  else c.S.push({dur:1.5,t:{C:[44,wing],H:[42,hp[1]],D:[43,hp[1]+1.2],G:[51,34+(wing-34)*.1]},ball:{carry:"C"},label:{C:`Ch.dài: ${C.cdai}`},txt:`${C.n} đi bóng dọc biên rồi chuẩn bị tạt`});
  const bike=false,sc=skB(C,corner?[]:["chuyendai"]),sh=skB(H,["daumanh"]),sg=skB(c.G,["gkkhongchien"]);
  const att=(eff(C,k)*sc.m+eff(H,"dau")*sh.m)*(bike?SKILLS.bike.mult:1),def=eff(D,"bat")*defBoost(c.def,"bat")+eff(c.G,"kchien")*sg.m;
  const p=chanceP(att,def,CH_BASE.dau),goal=rnd()<p;
  if(bike)roll("Kỹ năng: Ngả Bàn Đèn",SKILLS.bike.rate,true,`${H.n} ★${H.star} — sức đánh đầu ×${SKILLS.bike.mult}`);
  roll("Sút vào",p,goal,`${LBL[k]} ${C[k]} + Đ.Đầu ${H.dau} vs Sức bật ${D.bat} + Kh.Chiến ${c.G.kchien}`);
  const pop={sub:"Sút vào",title:bike?"Kỹ Năng: Ngả Bàn Đèn":corner?"Cơ Hội Đội Đầu · Phạt Góc":"Cơ Hội Đội Đầu",L:[skE(ent(C,c.atk,k),sc),skE(ent(H,c.atk,"dau"),sc.id?null:sh)],R:[ent(D,c.def,"bat","Nhảy"),skE(ent(c.G,c.def,"kchien"),sg)],p,ok:goal};
  // bóng tạt vào: người đội đầu, hậu vệ (Nhảy) và thủ môn (Kh.Chiến) cùng lao vào điểm rơi — bảng hiện cả 4 người
  const gOut=[hp[0]+2.2,hp[1]];
  c.S.push({dur:1,t:{H:[hp[0]-0.6,hp[1]],D:[hp[0]-0.2,hp[1]+0.9],G:gOut},ball:{fly:null,to:[hp[0]+0.4,hp[1]],h:4,endH:2.4},kicker:"C",txt:`${C.n} treo bóng vào vòng cấm, ${c.G.n} rời khung thành`});
  c.S.push({dur:0.45,t:{},ball:{},anim:{H:"jump",D:"jump",G:"jump"},popup:pop,label:{H:`Đ.Đầu: ${H.dau}`,D:`Nhảy: ${D.bat}`,G:`Kh.Chiến: ${c.G.kchien}`},txt:`${H.n}, ${D.n} và ${c.G.n} cùng bật cao tranh chấp`});
  if(!goal){const r=rnd();
    if(r<0.35){const punch=c.G.dbong>c.G.kchien||rnd()<.4;
      if(punch){c.S.push({dur:0.9,t:{},ball:{fly:null,to:[34,10+rnd()*48],h:3.5},kicker:"G",txt:`${c.G.n} vượt lên đấm bóng ra xa`});return "lost"}
      c.S.push({dur:0.9,t:{G:[hp[0]+0.8,hp[1]]},ball:{carry:"G"},txt:`${c.G.n} băng ra bắt gọn bóng trên không`});return "lost"}
    if(r<0.7){const cn=rnd()<0.4;c.S.push({dur:1,t:{},ball:{fly:null,to:cn?[53.5,hp[1]<34?10:58]:[34,10+rnd()*48],h:3},kicker:"D",txt:cn?`Hậu vệ ${D.n} về kịp lúc, dũng cảm phá bóng ra ngoài biên`:`${D.n} bật cao hơn, đánh đầu phá bóng`});if(cn)M.queue={type:"corner",side:c.side};return "lost"}}
  c.S.push({dur:0.4,t:{G:[51.2,hp[1]+(rnd()-.5)*2]},ball:{},txt:goal?`${H.n} bật cao hơn tất cả!`:`${H.n} chạm bóng trước ${D.n}`});
  return finishShot(c,{role:"H",from:hp,header:true,bike,p,goal,pop,popShown:true,title:pop.title});
}
// 8) 2 đấu 2: Cơ hội Solo → Vô-lê. A chuyền dài cho B bứt tốc: Tốc độ B + ½·Ch.dài A vs Bứt phá hậu vệ,
//    qua được thì "bật tường tam giác" rồi Cơ hội vô-lê: Sút B vs Cứu bóng.
function sceneSoloVolley(c){
  const A=rp(c.atk,{HVC:2.5,TV:2.5,TVC:2,HV:1.2,"TĐ":.8},"cdai"),B=rpSk(c.atk,RW.aFin,"toc",A,null,"satthu",3),D=rp(c.def,RW.dFar,"bpha",null,B),y0=laneY(A);
  add(c,"A",A,c.atk,14,y0);add(c,"B",B,c.atk,18,clamp(y0+(y0<34?-14:14),8,60));add(c,"D",D,c.def,36,clamp(c.ids.B.y+(rnd()-.5)*6,8,60));add(c,"G",c.G,c.def,51,34);
  c.S.push({dur:1.3,t:{A:[20,y0],B:[24,c.ids.B.y],D:[34,c.ids.D.y],G:[50.5,34+(c.ids.B.y-34)*.15]},ball:{carry:"A"},label:{A:`Ch.dài: ${A.cdai}`,B:`Tốc độ: ${B.toc}`,D:`Bứt phá: ${D.bpha}`},txt:`${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  const recv=[33,c.ids.B.y];c.S.push({dur:0.9,t:{B:recv,D:[35,c.ids.B.y+1.5]},ball:{fly:null,to:recv,h:3},kicker:"A",anim:{B:"bpha"},txt:`${A.n} chuyển bóng lên phía trên cho ${B.n}`});
  const sa=skB(A,["chuyendai"]),sb=skB(B,SK_PACE),sd=skB(D,SK_PACE),sbt=!sb.id&&hasSkill(B,"satthu")?{id:"satthu"}:sb;
  const ok=lqStep(c,{title:"Cơ Hội Solo",att:eff(B,"toc")*sb.m+0.5*eff(A,"cdai")*sa.m,def:eff(D,"bpha")*defBoost(c.def,"bpha")*sd.m,L:[skE(ent(A,c.atk,"cdai"),sa),skE(ent(B,c.atk,"toc"),sa.id?null:sbt)],R:[skE(ent(D,c.def,"bpha"),sd)],holder:"B",
    detail:`Tốc độ ${B.toc} + 50%·Ch.dài ${A.cdai} vs Bứt phá ${D.bpha}`,t:{B:[36,recv[1]],D:[36.5,recv[1]+1]},label:{B:`Tốc độ: ${B.toc}`,D:`Bứt phá: ${D.bpha}`},txt:`${B.n} và ${D.n} đua tốc độ`});
  if(!ok)return lostBall(c,D,"B",`${D.n} bứt tốc chặn trước ${B.n}`);
  const sp=shotSpot(recv[1]);c.S.push({dur:0.8,t:{B:[39,recv[1]],A:[38,y0]},ball:{fly:"A",to:[38,y0]},kicker:"B",txt:`${A.n} và ${B.n} thực hiện bật tường tam giác tuyệt đẹp`});
  c.S.push({dur:0.8,t:{B:sp,D:[sp[0]-4,sp[1]+3]},ball:{fly:null,to:sp,h:1.4},kicker:"A",txt:`${B.n} băng vào đón bóng`});
  return finishShot(c,{role:"B",from:sp,stat:"sut",title:"Cơ Hội Vô-lê",volley:true});
}
// 9) 2 đấu 2: Cơ hội sút xa. B lừa (Rê dắt) + ½·Chuyền A vs Xoạc hậu vệ, rồi A chuyền cho B sút xa
function sceneLong2(c){
  const A=rp(c.atk,RW.aMid,"chuyen"),B=rp(c.atk,RW.aFin,"sxa",A),D=rp(c.def,RW.dFar,"xoac",null,B),y0=laneY(A);
  add(c,"A",A,c.atk,16,y0);add(c,"B",B,c.atk,22,clamp(y0+(y0<34?12:-12),8,60));add(c,"D",D,c.def,30,clamp(c.ids.B.y+(rnd()-.5)*4,8,60));add(c,"G",c.G,c.def,51,34);
  c.S.push({dur:1.3,t:{A:[21,y0],B:[26,c.ids.B.y],D:[29.5,c.ids.B.y+1],G:[50.5,34+(c.ids.B.y-34)*.15]},ball:{carry:"A"},label:{A:`Chuyền bóng: ${A.chuyen}`},txt:`${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  {const r=diboCombo(c,A,B,D,y0);if(r)return r}
  const rb2=hasSkill(B,"rabona")&&rnd()<SKILLS.rabona.rate;if(rb2)roll("Kỹ năng: Rabona Fake",SKILLS.rabona.rate,true,`${B.n} ★${B.star} — giả sút, sức lừa ×${SKILLS.rabona.mult}`);
  const sb=rb2?{id:"rabona",m:SKILLS.rabona.mult*pasM(B,SK_DRIB)}:skB(B,SK_DRIB),sa=skB(A,SK_PASS),sd=skB(D,["gadote","tacbong"]);
  const ok=lqStep(c,{title:"Cơ Hội Sút Xa",att:(eff(B,"re")*sb.m+0.5*eff(A,"chuyen")*(sa.pid==="thanhchuyen"?sa.m:1))*(sa.pid&&sa.pid!=="thanhchuyen"?sa.m:1),def:eff(D,"xoac")*defBoost(c.def,"xoac")*sd.m,L:[skE(ent(B,c.atk,"re"),sb),skE(ent(A,c.atk,"chuyen"),sb.id?null:sa)],R:[skE(ent(D,c.def,"xoac"),sd)],holder:"A",
    detail:`Rê dắt ${B.re} + 50%·Chuyền ${A.chuyen} vs Xoạc ${D.xoac}`,t:{B:[28,c.ids.B.y],D:[29,c.ids.B.y+0.8]},anim:{B:rb2?"rabona":(sb.id&&SKILLS[sb.id].anim)||"lua",...(sd.id==="gadote"?{D:"gadote"}:{})},label:{B:`Rê dắt: ${B.re}`,D:`Xoạc: ${D.xoac}`},txt:`${B.n} thoát khỏi sự đeo bám của ${D.n}`});
  if(!ok){c.S.push({dur:0.8,t:{D:[27,(y0+c.ids.B.y)/2]},ball:{fly:"D",to:[27,(y0+c.ids.B.y)/2]},kicker:"A",anim:{D:"slide"},txt:`${D.n} xoạc chân ra cắt đường chuyền`});
    c.S.push({dur:1,t:{},ball:{fly:null,to:OUT[(rnd()*3)|0],h:2},txt:`${D.n} phá bóng ra xa`});return "lost"}
  const sp=[29+rnd()*3,clamp(c.ids.B.y+(34-c.ids.B.y)*.3,12,56)];
  c.S.push({dur:0.9,t:{B:sp,D:[sp[0]-2,sp[1]+2.5]},ball:{fly:"B",to:sp},kicker:"A",txt:`${A.n} chuyền bóng cho ${B.n}, ${B.n} giơ chân sút xa`});
  return finishShot(c,{role:"B",from:sp,stat:"sxa",title:"Cơ Hội Sút Xa",peak:1.8});
}
// 7) Cơ hội sút xa [Sút xa]: lừa qua (Rê dắt vs Đoạt) để có khoảng trống, rồi Sút xa vs Cứu bóng
function sceneLong(c){
  const A=rp(c.atk,{TV:3,TVC:2,"TĐ":2,HVC:.8,HV:.6},"sxa"),D=rp(c.def,RW.dFar,"doat",null,A),y0=laneY(A);
  add(c,"A",A,c.atk,18,y0);add(c,"D",D,c.def,30,clamp(y0+(rnd()-.5)*6,10,58));add(c,"G",c.G,c.def,51,34);
  c.S.push({dur:1.3,t:{A:[25,y0],D:[29,c.ids.D.y],G:[50.5,34+(y0-34)*.15]},ball:{carry:"A"},label:{A:`Rê dắt: ${A.re}`},txt:`[Sút xa] ${A.n} nhận bóng tuyệt đẹp từ đồng đội rồi dẫn bóng tiến về phía trước`});
  const rb=hasSkill(A,"rabona")&&rnd()<SKILLS.rabona.rate;if(rb)roll("Kỹ năng: Rabona Fake",SKILLS.rabona.rate,true,`${A.n} ★${A.star} — giả sút, sức lừa ×${SKILLS.rabona.mult}`);
  const sa=rb?{id:"rabona",m:SKILLS.rabona.mult*pasM(A,SK_DRIB)}:skB(A,SK_DRIB),sd=skB(D,["deobam"]);
  const ok=lqStep(c,{title:rb?"Kỹ Năng: Rabona Fake":"Cơ Hội Sút Xa",dur:rb?1.1:undefined,att:eff(A,"re")*sa.m,def:eff(D,"doat")*defBoost(c.def,"doat")*sd.m,L:[skE(ent(A,c.atk,"re"),sa)],R:[skE(ent(D,c.def,"doat"),sd)],
    detail:`Rê dắt ${A.re}${sa.m>1?` ×${+sa.m.toFixed(2)}`:""} vs Đoạt ${D.doat}`,t:{A:[27.5,y0],D:[28.5,y0]},anim:{A:rb?"rabona":(sa.id&&SKILLS[sa.id].anim)||"lua"},label:{A:`Rê dắt: ${A.re}`,D:`Đoạt: ${D.doat}`},txt:`${A.n} tìm khoảng trống trước ${D.n}`});
  if(!ok){const corner=rnd()<.35;c.S.push({dur:0.6,t:{D:[28.8,y0]},ball:{fly:null,to:[29,y0],h:0.8},anim:{D:"slide"},kicker:"A",txt:`${D.n} lao người chặn cú sút`});
    c.S.push({dur:0.9,t:{},ball:{fly:null,to:corner?[53.5,y0<34?12:56]:OUT[(rnd()*3)|0],h:2},txt:corner?"Bóng đổi hướng đi hết đường biên ngang. Phạt góc!":"Bóng bật ra, hàng thủ phá đi"});
    if(corner)M.queue={type:"corner",side:c.side};return "blocked"}
  const sp=[28+rnd()*3,clamp(y0+(34-y0)*.3,12,56)];c.S.push({dur:0.9,t:{A:sp,D:[sp[0]-1.5,sp[1]+2.5]},ball:{carry:"A"},...(rb?{anim:{D:"fall"}}:{}),txt:rb?`${D.n} lao ra chặn cú sút giả và ngã nhào! ${A.n} kéo bóng qua, thủ môn đã đổ người`:`${A.n} có khoảng trống trước vòng cấm!`});
  return finishShot(c,{role:"A",from:sp,stat:"sxa",title:"Cơ Hội Sút Xa",peak:1.8,pressure:rb?1.15:undefined});
}
// 5) Phạt đền
function scenePen(c){
  const K=c.atk.players.filter(p=>roleOf(p)!=="TM").reduce((b,p)=>p.pden>b.pden?p:b);
  add(c,"K",K,c.atk,38.5,32.5);add(c,"G",c.G,c.def,52.2,34);c.ballStart=[41.5,34];
  const pS=clamp(chanceP(eff(K,"pden"),eff(c.G,"cuu"),CH_BASE.pden),0.55,0.95),goal=rnd()<pS;
  roll("Phạt đền",pS,goal,`Phạt đền ${K.pden} vs Cứu bóng ${c.G.cuu}`);M.shots[c.side]++;
  c.S.push({dur:1.2,t:{K:[40.8,33.6]},ball:{},popup:{title:"Đá Phạt Đền",sub:"Sút vào",L:[ent(K,c.atk,"pden")],R:[ent(c.G,c.def,"cuu")],p:pS,ok:goal},label:{K:`Phạt đền: ${K.pden}`},txt:`${K.n} đặt bóng trên chấm phạt đền`});
  const ty=rnd()<.5?31.2:36.8,saved=!goal&&rnd()<.55,gDir=goal?(rnd()<.6?(ty<34?36.5:31.5):ty):ty;
  if(goal){c.S.push({dur:0.6,t:{G:[52,gDir]},ball:{fly:null,to:[53.4,ty],h:0.5,endH:0.6},kicker:"K",kickSet:"pen",anim:{G:"dive"},txt:`VÀOOO! ${K.n} sút phạt đền thành công`,goal:true});
    c.S.push({dur:2,t:{K:[38,ty<34?26:42]},ball:{},anim:{K:"celebrate"},txt:`${K.n} ăn mừng`});c.scorer=K;return "goal"}
  if(saved){c.S.push({dur:0.6,t:{G:[52,ty]},ball:{fly:null,to:[52,ty],h:0.6,endH:0.5},kicker:"K",kickSet:"pen",anim:{G:"dive"},txt:`${c.G.n} đoán đúng hướng và cản phá!`});
    c.S.push({dur:0.7,t:{},ball:{fly:null,to:[45,ty<34?20:48],h:1},txt:"Bóng bật ra, hậu vệ phá đi"});return "save"}
  c.S.push({dur:0.7,t:{G:[52,ty<34?36:32]},ball:{fly:null,to:[54,ty<34?29:39],h:2.5,endH:3},kicker:"K",kickSet:"pen",anim:{G:"dive"},txt:`${K.n} sút ra ngoài!`});return "miss";
}
// 6) Đá phạt trực tiếp (hậu vệ đứng làm hàng rào)
function sceneFK(c,pos){
  const fkV=p=>p.dphat*(hasSkill(p,"bendit")?SKILLS.bendit.mult:hasSkill(p,"sutphat")?SKILLS.sutphat.mult:1); // người có kỹ năng sút phạt được ưu tiên đá
  const K=c.atk.players.filter(p=>roleOf(p)!=="TM").reduce((b,p)=>fkV(p)>fkV(b)?p:b);
  const W=rp(c.def,{HV:3,HVC:2,TV:2,TVC:1,"TĐ":1},"bat");
  const dx=52.5-pos[0],dy=34-pos[1],dd=Math.hypot(dx,dy),wall=[pos[0]+dx/dd*9.15,pos[1]+dy/dd*9.15];
  add(c,"K",K,c.atk,pos[0]-2.5,pos[1]+1.2);add(c,"D",W,c.def,wall[0],wall[1]);add(c,"G",c.G,c.def,51.5,34+(pos[1]-34)*0.12);c.ballStart=pos;
  c.S.push({dur:1.2,t:{K:[pos[0]-0.8,pos[1]+0.4]},ball:{},label:{K:`Đá phạt: ${K.dphat}`,D:"Hàng rào"},txt:`${K.n} đứng trước quả đá phạt`});
  return finishShot(c,{role:"K",from:pos,stat:"dphat",title:"Cơ Hội Sút Phạt",extraR:[ent(W,c.def,"bat","Hàng rào · Sức bật")],peak:3.2,noCarry:true,kicker:"K"});
}

function buildScene(){
  rolls=[];let atk,def,side,type,q=M.queue;M.queue=null;
  if(q){side=q.side;atk=side?T.away:T.home;def=side?T.home:T.away;type=q.type}
  else{
    const H=atkDef(T.home),A=atkDef(T.away),wh=Math.pow(H.a/A.d*control(T.home),POS_E),wa=Math.pow(A.a/H.d*control(T.away),POS_E),pH=wh/(wh+wa);const homeAtk=rnd()<pH;
    atk=homeAtk?T.home:T.away;def=homeAtk?T.away:T.home;side=homeAtk?0:1;
    roll("Giành quyền tấn công",homeAtk?pH:1-pH,true,`Công ${homeAtk?H.a:A.a} vs Thủ ${homeAtk?A.d:H.d}, kèm kiểm soát tuyến giữa`);
    // loại pha phụ thuộc điểm mạnh của đội tấn công
    const ov=avg(atk.players.map(overall)),wC=0.42*avg(byPos(atk,"TVC","HVC").map(p=>p.cdai))/ov*avg(byPos(atk,"TĐ").map(p=>p.dau))/ov;
    const wL=0.5*avg(byPos(atk,"TV","TVC").map(p=>p.sxa))/ov,wS=0.35*avg(byPos(atk,"TĐ","TVC").map(p=>p.bpha))/ov;
    const at=ATK_TAC[halfTac(atk).atk]||{},lv=1+0.15*(tacOf(atk).atkLv-1),m=k=>at[k]?at[k]*lv:1;
    type=pick([["drib",0.6*m("drib")],["pass",0.4*m("pass")],["combo",0.45*m("combo")],["volley",0.3*m("volley")],["solo",wS*m("solo")],["solo2",0.3*m("solo")],["lob",0.3*m("lob")],["cross",wC*m("cross")],["long",wL*0.5*m("long")],["long2",wL*0.5*m("long")]],x=>x[1]*100)[0];
  }
  const c=makeCtx(atk,def,side);
  const SC={drib:sceneDribble,pass:scenePass,combo:sceneCombo,volley:sceneVolley,solo:sceneSolo,solo2:sceneSoloVolley,lob:sceneLob,long:sceneLong,long2:sceneLong2,pen:scenePen};
  c.res=SC[type]?SC[type](c):type==="cross"?sceneCross(c,false):type==="corner"?sceneCross(c,true):sceneFK(c,q.pos);
  return{actors:c.actors,steps:c.S,side,atk,def,res:c.res,scorer:c.scorer,ballStart:c.ballStart};
}

/* ================== CAMERA PHỐI CẢNH ================== */
const cv=document.getElementById("cv"),ctx=cv.getContext("2d",{alpha:false});
const W=cv.width,H=cv.height; // kích thước "logic" để tính toán, luôn 1020×640
// ĐỘ NÉT CAO: canvas vẽ đúng số điểm ảnh thật trên màn hình (tối đa 2.5 lần), thay vì vẽ 1020×640 rồi phóng to bị mờ
let RS=1,HIRES=true;try{HIRES=localStorage.getItem("dmbd_hires")!=="0"}catch(e){}
function fitCanvas(){const r=cv.getBoundingClientRect().width||W,k=HIRES?Math.min(2.5,Math.max(1,r*(window.devicePixelRatio||1)/W)):1;
  if(Math.abs(k-RS)<0.02&&cv.width===Math.round(W*RS))return;RS=k;cv.width=Math.round(W*k);cv.height=Math.round(H*k);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";crowdPat=null;frame.sig=null}
window.addEventListener("resize",()=>fitCanvas());document.addEventListener("fullscreenchange",()=>setTimeout(fitCanvas,50));
if(window.ResizeObserver)new ResizeObserver(()=>fitCanvas()).observe(cv);
function setHires(on){HIRES=on;try{localStorage.setItem("dmbd_hires",on?"1":"0")}catch(e){}fitCanvas()}
let camX=30;
function proj(x,y,h=0){const d=60+(68-y);const s=1920/d;return[W/2+(x-camX)*s,-219+25.9*s-h*s,s]}
function poly(pts,fill){ctx.beginPath();pts.forEach((p,i)=>{const q=proj(...p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});ctx.fillStyle=fill;ctx.fill()}
function line3(pts,lw){ctx.beginPath();pts.forEach((p,i)=>{const q=proj(...p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});ctx.lineWidth=lw;ctx.stroke()}
const crowdC=document.createElement("canvas");crowdC.width=240;crowdC.height=120;
(()=>{const g=crowdC.getContext("2d");g.fillStyle="#2a2d33";g.fillRect(0,0,240,120);
  const cols=["#e8372c","#ffffff","#f2c94c","#2f7ff0","#1f1f1f","#e8372c","#d9d9d9","#ff8a3d"];
  for(let r=0;r<12;r++)for(let c=0;c<40;c++){const x=c*6+(r%2)*3,y=r*10+4;g.fillStyle=cols[(Math.random()*cols.length)|0];g.beginPath();g.arc(x,y,2.6,0,7);g.fill();g.fillStyle="#c99877";g.beginPath();g.arc(x,y-3.2,1.6,0,7);g.fill()}})();
let crowdPat=null;
// chữ "Goal!!" trên biển quảng cáo: vẽ sẵn 1 lần thành ảnh, mỗi khung chỉ dán ảnh (fillText mỗi khung rất tốn)
const GOALTXT=["#fff","#d8261b"].map(col=>{const c=document.createElement("canvas");c.width=160;c.height=56;const g=c.getContext("2d");
  g.fillStyle=col;g.font="italic 800 40px Impact,'Saira Condensed',sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText("Goal!!",80,29);return c});
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
    const q=proj(x+3,-2,0.5),k=q[2]*0.62/40;ctx.drawImage(GOALTXT[(x/6|0)%2?0:1],q[0]-80*k,q[1]-29*k,160*k,56*k)}
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
  const shirt=gk?"#f2c94c":kitColor(a.team),shorts=gk?"#1d1d1d":"#f4f4f4",sock=gk?"#1d1d1d":kitColor(a.team);
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
const FPS={bendit:11,gadote:11,rabona:11,dibo:11,luamessi:11,msc:6,bpha:10,nga:8,lua:10,volley:16,stepover:11,roulette:11,siu:6,run:0,drib:0,pass:14,shot:13,fk:14,long:13,pen:15,slide:11,head:12,bike:12,cele:6,regret:7,catch:14,dive:14,divelow:14,punch:14};
const KICK_FALLBACK={bendit:["bendit","fk","shot"],volley:["volley","shot","fk"],pass:["pass","fk","shot"],shot:["shot","fk"],long:["long","shot"],fk:["fk","shot"],pen:["fk","shot"]};
const CONTACT={bendit:.6,volley:.66,pass:.62,shot:.72,long:.68,fk:.62};
function hasAnim(key,an){return !!SPRITE_META[key].anims[an]}
function kickAnim(key,set){for(const a of (KICK_FALLBACK[set]||["shot"]))if(hasAnim(key,a))return a;return null}
function kickInfo(a){const key=charKey(a.p),an=kickAnim(key,a.kickSet||"shot");if(!an)return{dur:0.4,contact:0};
  const n=SPRITE_META[key].anims[an].length,f=FPS[an]||15;return{dur:n/f,contact:n/f*(CONTACT[an]||.6)}}
// màu áo trong trận: đội nhà ĐỎ, đối thủ XANH (màu gốc của sprite, không đổi). Thủ môn giữ màu sprite.
const kitColor=t=>(typeof T!=="undefined"&&T&&t===T.home)?"#e8372c":"#2f7ff0";
function hexRgb(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]}
function tinted(key,color){
  const S=SPR[key];if(key!=="std")return S.img;
  const [tr,tg,tb]=hexRgb(color);if(tb>tr+60&&tb>tg)return S.img; // đội áo xanh: giữ nguyên
  if(S.tint[color])return S.tint[color];
  const c=document.createElement("canvas");c.width=S.img.width;c.height=S.img.height;const g=c.getContext("2d");g.drawImage(S.img,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),px=d.data;
    for(let i=0;i<px.length;i+=4){const r=px[i],gg=px[i+1],b=px[i+2];
      if(px[i+3]>0&&b>70&&b>r+35&&b>gg+15){const l=Math.min(1.25,(b/255)*1.15+0.05);px[i]=Math.min(255,tr*l);px[i+1]=Math.min(255,tg*l);px[i+2]=Math.min(255,tb*l)}}
    g.putImageData(d,0,0)}catch(e){return S.tint[color]=S.img} // lỗi (mở file trực tiếp): nhớ luôn để không thử lại mỗi khung
  // chép sang canvas mới (chưa từng getImageData) để trình duyệt giữ trên GPU, vẽ mỗi khung hình không phải tải lại ảnh
  const c2=document.createElement("canvas");c2.width=c.width;c2.height=c.height;c2.getContext("2d").drawImage(c,0,0);
  return S.tint[color]=c2;
}
function pickFrame(a,key,now){
  const A=SPRITE_META[key].anims,an=a.anim,t=Math.max(0,a.at||0);
  const once=(name)=>{const n=A[name].length;return[name,Math.min(n-1,Math.floor(t*(FPS[name]||14)))]};
  const loop=(name,fps)=>{const n=A[name].length;return[name,Math.floor(t*fps+hashN(a.p.n)%7)%n]};
  let r={rot:0,dy:0};
  if(an==="pose"){r.an="idle";r.i=0;return r}
  if(an==="kick"){const k=kickAnim(key,a.kickSet||"shot");if(k){[r.an,r.i]=once(k);return r}}
  if(an==="slide"){if(A.slide){[r.an,r.i]=once("slide");return r}const k=clamp(t/0.25,0,1);r.an=A.run?"run":"idle";r.i=A.run?2:0;r.rot=-1.1*k;r.dy=0.25*k;return r}
  if(an==="fall"&&A.nga){[r.an,r.i]=once("nga");return r}
  if(an==="fall"){const k=clamp(t/0.4,0,1);r.an="idle";r.i=0;r.rot=1.35*k;r.dy=0.2*k;return r}
  if(an==="dive"||(an==="jump"&&key==="gk")){const set=A[a.diveSet]?a.diveSet:"dive";[r.an,r.i]=once(set);if(a.at<0)r.i=0;r.dy=set==="dive"?-0.35*Math.sin(clamp(t/0.5,0,1)*Math.PI):0;return r}
  if(an==="jump"){[r.an,r.i]=A.head?once("head"):["idle",0];r.dy=-0.55*Math.sin(clamp(t/0.6,0,1)*Math.PI);return r}
  if(an==="bike"&&A.bike){[r.an,r.i]=once("bike");r.dy=-0.5*Math.sin(clamp(t/0.7,0,1)*Math.PI);return r}
  if(an==="regret"&&A.regret){[r.an,r.i]=once("regret");return r}
  // động tác riêng: Icon Messi lừa bóng bằng kiểu đảo bóng của mình
  if(an==="lua"&&a.p.n==="Messi"&&a.p.tier===6&&A.luamessi){[r.an,r.i]=once("luamessi");return r}
  if((an==="stepover"||an==="roulette"||an==="lua"||an==="bpha"||an==="dibo"||an==="rabona"||an==="gadote"||an==="luamessi")&&A[an]){[r.an,r.i]=once(an);return r}
  if(an==="celebrate"){const sv=hasSkill(a.p,"siu")&&A.siu?"siu":hasSkill(a.p,"msc")&&A.msc?"msc":"cele";if(A[sv]){[r.an,r.i]=once(sv);return r}r.an="idle";r.i=0;r.dy=-0.35*Math.abs(Math.sin(t*7));return r}
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
  g.drawImage(tinted(key,kitColor(a.team)),fr[0],fr[1],fr[2],fr[3],-fr[2]/2,-fr[3],fr[2],fr[3]);g.restore();
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
  d.innerHTML=`<span class="nm" style="color:${(e.p.tier??2)<1?"#10240f":TCOL[e.p.tier]}">${e.p.n}</span><span class="ln">Vị trí: ${posLabel(e.p)}</span><span class="ln">${e.lab}: <b class="lv">${fmt1(e.v)}</b></span>`;
  d.appendChild(miniSprite(e,flip));return d}
function showPop(pp){
  const L=document.getElementById("popL"),R=document.getElementById("popR2");L.innerHTML="";R.innerHTML="";
  pp.L.forEach(e=>L.appendChild(popCol(e,false)));pp.R.forEach(e=>R.appendChild(popCol(e,true)));
  document.getElementById("popT").textContent=pp.title;const lb=document.getElementById("popLb");if(lb)lb.textContent=(pp.sub||"Hiệu quả")+":";document.getElementById("popP").textContent=Math.round(pp.p*100)+"%";
  const rs=document.getElementById("popR");rs.textContent="";rs.className="rs";popEl.classList.add("on");
  const se=pp.L.find(e=>e.skill)||pp.R.find(e=>e.skill);if(se){skillFx(se.p,se.skill,se.team,pp.R.includes(se)?"r":"l");M.skWait=performance.now()+3000}}
function revealPop(pp){const rs=document.getElementById("popR");rs.textContent=pp.ok?"THÀNH CÔNG!":"THẤT BẠI";rs.className="rs "+(pp.ok?"ok":"ko")}
function hidePop(){popEl.classList.remove("on");const s=document.getElementById("skfx");if(s&&s.classList.contains("under")&&s.classList.contains("on")&&!s.classList.contains("out")){s.classList.add("out");clearTimeout(skfxT);skfxT=setTimeout(()=>s.className="skfx",380)}}

/* ===== Hiệu ứng tung kỹ năng kiểu FIFA: chân dung + tên kỹ năng ===== */
let skfxT=0;
function skillFx(p,id,team,pos){const sk=SKILLS[id];if(!sk||!p)return;const g=document.getElementById("game");if(!g)return;
  let el=document.getElementById("skfx");if(!el){el=document.createElement("div");el.id="skfx";el.className="skfx";el.setAttribute("aria-live","polite");g.appendChild(el)}
  const home=team?team===T.home:squad(T.home).includes(p),img=faceSrc(p),st=(p.skills||[]).find(s=>s.id===id);
  el.className="skfx";void el.offsetWidth;
  el.innerHTML=`<div class="sk-card">
    <div class="sk-face"><i class="sk-rays"></i>${img?`<img src="${img}" alt="">`:`<canvas width="160" height="160"></canvas>`}<i class="sk-shine"></i><i class="sk-spark a"></i><i class="sk-spark b"></i></div>
    <div class="sk-plate"><small>Kỹ năng${st&&st.star?` · ★${st.star}`:""}</small><b>${sk.n}</b><span>${p.n}</span></div></div>`;
  const cv=el.querySelector("canvas");if(cv)drawChar(cv.getContext("2d"),{p,team:home?T.home:T.away,face:1,anim:"pose"},0,80,345,290,true);
  el.className=`skfx on ${home?"h":"a"} t${p.tier??2}${pos?" under":""}`;el.style.cssText="";
  const place=()=>{if(!pos||!popEl)return;const gr=g.getBoundingClientRect(),pr=popEl.getBoundingClientRect(),k=gr.width/100,cx=pr.left+pr.width/2,w=popEl.offsetWidth,hh=popEl.offsetHeight;
    el.style.top=((pr.top-gr.top)+hh+0.8*k)+"px";
    if(pos==="r"){el.style.right=(gr.right-(cx+w/2))+"px";el.classList.remove("h");el.classList.add("a")}else{el.style.left=(cx-w/2-gr.left)+"px";el.classList.remove("a");el.classList.add("h")}
    el.style.setProperty("--edge",home?"#e8372c":"#2f7ff0")};place();setTimeout(place,260);
  clearTimeout(skfxT);if(!pos)skfxT=setTimeout(()=>{el.classList.add("out");skfxT=setTimeout(()=>el.className="skfx",400)},Math.max(1500,2600/Math.max(1,spd()/2)))}

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
    if(an==="dive"){k.diveDir=Math.sign((st.ball.to?st.ball.to[1]:34)-k.y)||1;k.diveSet=(st.ball.endH??0)>1.1?"dive":Math.abs((st.ball.to?st.ball.to[1]:k.y)-k.y)>2.2?"divelow":"catch";k.at=-(ball.delay||0)}
    if(an==="jump"&&roleOf(k.p)==="TM")k.diveSet="punch"; // tranh chấp bóng bổng: thủ môn đấm bóng
    if(an==="slide"||an==="fall"||an==="dive")puff(k.x,k.y,8,"#cfe3c0")}
  for(const [r,an] of Object.entries(st.anim||{})){const k=byRole(r);if(!k)continue;
    if(an==="celebrate"&&hasSkill(k.p,"siu"))skillFx(k.p,"siu");else if(an==="celebrate"&&hasSkill(k.p,"msc"))skillFx(k.p,"msc")}
  addLog(st.txt,st.goal);
  if(st.skfx){const k=byRole(st.skfx.role);if(k){skillFx(k.p,st.skfx.id,k.team);M.skWait=performance.now()+2200;M.hold=Math.max(M.hold||0,0.001)}}
  if(st.popup){showPop(st.popup);M.hold=2.4;M.holdPop=st.popup}
  if(st.goal){M.score[scene.side]++;goalMor(scene.side,scene.scorer);render();setTimeout(()=>{fx.net=1;fx.shake=1;fx.banner=2},st.dur*600/spd())}
}
let last=0;
function frame(ts){
  const dt=Math.min(0.05,(ts-last)/1000||0)*spd();last=ts;
  if(M.hold>0&&scene){
    M.hold-=dt;if(M.hold<0.9&&M.holdPop){revealPop(M.holdPop);M.holdPop=null}
    if(M.skWait){if(ts<M.skWait)M.hold=Math.max(M.hold,0.001);else M.skWait=0}
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
  // không vẽ lại khi sảnh che kín sân, hoặc khi khung hình y hệt khung trước (đứng yên) → đỡ tốn CPU/GPU
  const sig=window.MODE==="lobby"?"L":scene||parts.length||fx.net||fx.shake||fx.banner?null:camX.toFixed(3)+","+ball.x+","+ball.y+","+ball.h;
  if(sig&&sig===frame.sig){requestAnimationFrame(frame);return}frame.sig=sig;
  if(sig==="L"){requestAnimationFrame(frame);return}
  ctx.setTransform(RS,0,0,RS,0,0);
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
function tickMinutes(n){M.min=Math.min(90,M.min+n);T.home.players.concat(T.away.players).forEach(p=>{p.sta=clamp(p.sta-n*0.6*(1-0.6*Math.min(1,p.ben/tierOf(p).cap)),0,100)})}
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
  const n=M.queue?1:GAP(),from=M.min,to=Math.min(90,from+n),dur=1600/spd(),t0=performance.now();
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
function goalMor(side,scorer){const lt=(1-side)?T.away:T.home;M.mor[side]=Math.min(950,M.mor[side]+40);M.mor[1-side]=Math.max(100,M.mor[1-side]-(lt&&lt.players.some(p=>hasSkill(p,"lanhdao"))?12:25));scorer._goals=(scorer._goals||0)+1}
function finish(){M.done=true;M.auto=false;M.min=90;M.queue=null;hidePop();
  const won=M.score[0]>M.score[1],draw=M.score[0]===M.score[1];T.club.gold+=Math.round((won?20000:draw?8000:3000)*(1+0.02*(window.mstat?mstat("kd"):0)));T.club.phieu+=won?10:draw?5:2;
  // điểm huấn luyện sau trận: ra sân +200, tham gia tình huống +50, ghi bàn +150/bàn, đội thắng +100
  T.home.players.concat(T.away.players).forEach(p=>{const w=(p._side===0&&won)||(p._side===1&&M.score[1]>M.score[0]);p.tp=(p.tp||0)+Math.round((200+(M.inv.has(p)?50:0)+(p._goals||0)*150+(w?100:0))*(p._side===0?1+0.02*(window.mstat?mstat("kh"):0):1));p._goals=0});
  if(window.onMatchEnd)onMatchEnd();render();addLog(`Hết trận: ${T.home.name} ${M.score[0]} – ${M.score[1]} ${T.away.name}. Cầu thủ nhận điểm huấn luyện.`,true);saveLocal();scene=null;showIdle(mmss(90,0));if(typeof db!=="undefined"&&db)fbSave(true).catch(()=>{});if(window.mgrRender)mgrRender()}
function fastSim(){
  M.auto=false;scene=null;M.hold=0;M.skWait=0;hidePop();
  while(M.min<90){tickMinutes(M.queue?1:GAP());if(M.min>=90)break;const s=buildScene();s.actors.forEach(a=>a.p.sta-=1.5);
    s.actors.forEach(a=>M.inv.add(a.p));if(s.res==="goal"){M.score[s.side]++;goalMor(s.side,s.scorer);addLog(`${s.scorer.n} ghi bàn cho ${s.atk.name}`,true)}}
  M.busy=false;finish();renderSquad();
}
const fmt=n=>n.toLocaleString("vi-VN");
function badge(svg,team){const c=kitColor(team),ini=team.name.split(" ").map(w=>w[0]).join("").slice(0,3);
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
const skIco=id=>typeof SKILL_IMG!=="undefined"&&SKILL_IMG[id]?`<img class="skic" src="${SKILL_IMG[id]}" alt="">`:"";
function skillList(p){if(!(p.skills||[]).length)return"<b>Kỹ năng:</b> chưa sở hữu kỹ năng nào.";
  return"<b>Kỹ năng:</b> "+p.skills.map(s=>{const k=SKILLS[s.id],on=(p.star||0)>=s.star;return`<span class="sk ${on?"on":""}" title="${k.desc}">${skIco(s.id)||(on?"✔":"🔒")} ${k.n} <small>(cần ★${s.star})</small></span>`}).join(" ")}
const COLS=["toc","sut","re","chuyen","xoac","dau","cuu"];
function natName(p){try{return NATIONS[p.q]?NATIONS[p.q].n:"Việt Nam"}catch(e){return""}}
function renderSquad(){natFix();
  const POSA={TM:"TM",HV:"TRV",HVC:"HVC",TV:"TV",TVC:"TVC","TĐ":"TĐ"};
  const row=(t,ti,p,i)=>{const sub=(t.subs||[]).includes(p),img=faceSrc(p),ov=Math.round(overall(p));
    return`<tr class="${sub?"sub":""}"><td><span class="sq-ovr t${p.tier??2}">${ov}</span></td>
     <td class="sq-pl"><button data-t="${ti}" data-i="${i}"><span class="sq-face">${img?`<img src="${img}" alt="">`:`<i>${p.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</i>`}</span>
      <span class="sq-nm"><b style="color:${p.tier===6?"#f3d98a":tierOf(p).c}">${p.n}</b><small>${natName(p)}${p.star?` · <em style="color:${STAR_COL[p.star]}">★${p.star}</em>`:""}</small></span></button></td>
     <td><span class="sq-pos">${POSA[p.pos]||p.pos}</span>${sub?`<small class="sq-sub">Dự bị</small>`:""}</td>
     <td><span class="sq-tier t${p.tier??2}">${tierOf(p).n}</span></td>
     ${COLS.map(k=>{const v=Math.round(p[k]),q=v>=750?6:v>=625?5:v>=500?4:v>=410?3:v>=330?2:v>=250?1:0;return`<td class="sq-v q${q}">${v}</td>`}).join("")}
     <td><span class="sta"><i style="width:${p.sta}%"></i></span></td></tr>`};
  const head=`<tr><th>TL</th><th>Cầu thủ</th><th>VT</th><th>Bậc</th>${COLS.map(k=>`<th>${LBL[k]}</th>`).join("")}<th>Thể lực</th></tr>`;
  const sec=(t,ti)=>`<tr class="sq-sec"><td colspan="${COLS.length+5}"><i style="background:${ti==="home"?"#e8372c":"#2f7ff0"}"></i>${t.name}<span>${squad(t).length} cầu thủ · Thực lực ${fmt1(avg(t.players.map(overall)))}</span></td></tr>`;
  sqChrome();
  if(SQV.tab==="db"){renderDB(row,head);return}
  document.getElementById("sq").innerHTML=head+sec(T.home,"home")+squad(T.home).map((p,i)=>row(T.home,"home",p,i)).join("");
}
/* ---------- Tra cứu toàn bộ cầu thủ trong hệ thống ---------- */
const SQV={tab:"mine",q:"",tier:"",nat:"",pos:""};let DBT=null;
function dbTeam(){if(DBT)return DBT;const seen=new Set(),ps=[];
  for(const [n,pos,t,q,ch] of STARS){const k=n+"#"+t;if(seen.has(k))continue;seen.add(k);const p=mk(n,pos,t,ch||"P",0);p.q=q;p.sta=100;ps.push(p)} // giống hệt lúc vừa tuyển về: kích thích 0/10
  ps.sort((a,b)=>b.tier-a.tier||overall(b)-overall(a));return DBT={name:"Hệ thống",color:"#888",players:ps,subs:[]}}
function sqChrome(){const card=document.querySelector('[data-w="ds"]');let bar=card.querySelector(".sqbar");
  if(!bar){bar=document.createElement("div");bar.className="sqbar";card.prepend(bar);
    bar.addEventListener("click",e=>{const b=e.target.closest("[data-sqt]");if(b){SQV.tab=b.dataset.sqt;renderSquad()}});
    bar.addEventListener("input",e=>{const k=e.target.dataset.f;if(k){SQV[k]=e.target.value;renderSquad();if(k==="q"){const i=bar.querySelector('[data-f="q"]');i.focus();i.setSelectionRange(i.value.length,i.value.length)}}})}
  const db=SQV.tab==="db",opt=(arr,v)=>arr.map(([k,n])=>`<option value="${k}" ${String(v)===String(k)?"selected":""}>${n}</option>`).join("");
  bar.innerHTML=`<div class="sqtabs" role="tablist"><button role="tab" data-sqt="mine" class="${db?"":"on"}" aria-selected="${!db}">Đội của tôi</button><button role="tab" data-sqt="db" class="${db?"on":""}" aria-selected="${db}">Tất cả cầu thủ</button></div>
   ${db?`<div class="sqf"><input data-f="q" placeholder="Tìm tên cầu thủ…" value="${SQV.q.replace(/"/g,"&quot;")}" aria-label="Tìm tên">
    <select data-f="tier" aria-label="Bậc"><option value="">Mọi bậc</option>${opt(TIERS.map((t,i)=>[i,t.n]).reverse(),SQV.tier)}</select>
    <select data-f="nat" aria-label="Quốc gia"><option value="">Mọi quốc gia</option>${opt(Object.entries(NATIONS).map(([k,v])=>[k,v.n]),SQV.nat)}</select>
    <select data-f="pos" aria-label="Vị trí"><option value="">Mọi vị trí</option>${opt(Object.entries(POSN),SQV.pos)}</select></div>`:""}`;
  card.querySelector(".note").textContent=db?"Chỉ số hiển thị là lúc cầu thủ vừa tuyển về (kích thích 0/10). Bấm tên để xem thẻ và mức tối đa có thể luyện. Cầu thủ ra ở thị trường Môi giới của nước mình hoặc Toàn cầu.":"Bấm tên cầu thủ để xem thẻ đủ 19 chỉ số. Thanh xanh là thể lực còn lại trong trận."}
function renderDB(row,head){const t=dbTeam(),mine=new Set(squad(T.home).map(p=>p.n+"#"+p.tier)),q=SQV.q.trim().toLowerCase();
  const nm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLowerCase();
  const list=t.players.map((p,i)=>[p,i]).filter(([p])=>(!q||nm(p.n).includes(nm(q)))&&(SQV.tier===""||p.tier===+SQV.tier)&&(!SQV.nat||p.q===SQV.nat)&&(!SQV.pos||p.pos===SQV.pos));
  document.getElementById("sq").innerHTML=head.replace("<th>Thể lực</th>","<th></th>")+`<tr class="sq-sec"><td colspan="${COLS.length+5}"><i style="background:#c6ff3d"></i>Hệ thống<span>${list.length} / ${t.players.length} cầu thủ</span></td></tr>`
    +list.map(([p,i])=>row(t,"db",p,i).replace(/<td><span class="sta">.*?<\/span><\/td><\/tr>$/,`<td>${mine.has(p.n+"#"+p.tier)?'<span class="sq-own">Đã có</span>':""}</td></tr>`)).join("")||`<tr><td colspan="${COLS.length+5}">Không tìm thấy cầu thủ.</td></tr>`}
/* ---------- Thẻ cầu thủ ---------- */
const modal=document.getElementById("modal");
document.getElementById("sq").addEventListener("click",e=>{const b=e.target.closest("button[data-t]");if(b)openCard(b.dataset.t==="db"?dbTeam():T[b.dataset.t],+b.dataset.i)});
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
  {const _m=document.getElementById("mav");_m.classList.toggle("hasface",!!faceSrc(p));_m.appendChild(avatar(p,team,110,140))}
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
// ảnh chân dung cầu thủ (assets/players/*.webp); không có ảnh thì vẽ sprite như cũ
const IMG_ALIAS={"Kane":"Harry Kane","Bellingham":"Jude Bellingham","Saka":"Bukayo Saka","Foden":"Phil Foden","Rice":"Declan Rice","Trippier":"Kieran Trippier","Mitoma":"Kaoru Mitoma","Kubo":"Takefusa Kubo","Tomiyasu":"Takehiro Tomiyasu","Doan Ritsu":"Ritsu Doan","Ueda Ayase":"Ayase Ueda","Chanathip":"Chanathip Songkrasin","Teerasil":"Teerasil Dangda","Kawin":"Kawin Thamsatchanan","Suphanat":"Suphanat Mueanta"};
// ảnh chân dung: theo tên (kể cả tên cũ), Icon chưa có ảnh đầu thì dùng ảnh thẻ Icon, không có ảnh thì dùng ảnh "unknown"
const faceSrc=p=>{if(typeof PLAYER_IMG==="undefined"||!p)return null;const n=p.n;if(p.tier===6&&typeof ICON_IMG!=="undefined"&&ICON_IMG[n])return ICON_IMG[n]; // Icon: dùng ảnh thẻ Icon ở mọi nơi
  return PLAYER_IMG[n]||PLAYER_IMG[IMG_ALIAS[n]]||(typeof UNKNOWN_IMG!=="undefined"?UNKNOWN_IMG:null)};
const faceTag=(p,cls="fc")=>{const s=faceSrc(p);return s?`<img class="${cls}" src="${s}" alt="">`:""};
function avatar(p,team,w=96,h=120){const s=faceSrc(p);if(s){const im=new Image();im.src=s;im.className="favatar";im.alt=p.n;const z=Math.min(128,Math.min(w,h)>=110?128:Math.min(w,h));im.width=z;im.height=z;im.style.width=z+"px";im.style.height=z+"px";return im}const c=document.createElement("canvas");c.width=w;c.height=h;drawChar(c.getContext("2d"),{p,team,face:1,anim:"pose"},0,w/2,h-6,h*0.86,true);return c}
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
     <p class="hint">Thanh xanh là chỉ số đã luyện, vạch trắng là giới hạn hiện tại theo độ kích thích. Thanh vàng là đã chạm giới hạn. Kế hoạch được lưu ngay khi đánh dấu.</p>`;
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
  {const _m=document.getElementById("mgav");_m.classList.toggle("hasface",!!faceSrc(p));_m.appendChild(avatar(p,team))}
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
    return`<button class="slot${isSel("slot",i)}" draggable="false" data-kind="slot" data-i="${i}" style="left:${x}%;top:${y}%" title="${p.n} (${POSN[p.pos]}) → ${slotLabel(c.form,i)}${bad?` · sai vị trí, còn ${Math.round(p.fit*100)}% sức`:""}">
      ${jersey(t.color,numOf(p))}<span class="sn" style="color:${tierOf(p).c}">${p.n}</span><span class="sr${bad?" bad":""}">${slotLabel(c.form,i)}${bad?` ${Math.round(p.fit*100)}%`:""}</span></button>`}).join("");
  const bench=Array.from({length:7},(_,i)=>{const p=t.subs[i];return`<button class="bslot${isSel("sub",i)}" draggable="false" data-kind="sub" data-i="${i}" title="${p?p.n+" ("+POSN[p.pos]+")":"Ghế trống"}">${p?jersey(t.color,numOf(p))+`<span class="sn" style="color:${tierOf(p).c}">${p.n}</span>`:jersey("#9aa4ae","",true)}</button>`}).join("");
  const rows=squad(t).map((p,j)=>{const k=j<11?"slot":"sub",i=j<11?j:j-11;return`<tr class="${isSel(k,i)}" draggable="false" data-kind="${k}" data-i="${i}">
    <td>${faceTag(p)}<button class="pn" data-kind="${k}" data-i="${i}" style="color:${tierOf(p).c}">${p.n}</button></td><td>${POSN[p.pos]}</td><td>${j<11?slotLabel(c.form,i):"Dự bị"}</td><td>${fmt1(overall(p))}</td><td>${fmt1(overallMax(p))}</td><td>${p.kt}%</td></tr>`}).join("");
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
   <p class="hint lh">Bấm chọn 1 cầu thủ (trên sân, ghế dự bị hoặc trong danh sách), rồi bấm cầu thủ hoặc vị trí muốn đổi chỗ. Bấm lại để bỏ chọn. Nhãn đỏ = đá sai sở trường, bị giảm sức. Chiến thuật hiệp 2 tự áp dụng từ phút 45.</p>
   <div class="msg" role="status">${LU.msg?`<span class="${LU.ok?"mok":"mko"}">${LU.msg}</span>`:LU.sel?`Đã chọn <b>${(LU.sel.kind==="slot"?t.players:t.subs)[LU.sel.i].n}</b>, bấm cầu thủ hoặc vị trí khác để đổi chỗ.`:""}</div></div>`;
}
const keyOf=el=>{const x=el.closest("[data-kind]");return x?{kind:x.dataset.kind,i:+x.dataset.i}:null};
luEl.addEventListener("click",e=>{
  const h=e.target.closest("[data-half]");if(h){LU.half=+h.dataset.half;renderLineup();return}
  // bấm chọn cầu thủ thứ nhất, bấm cầu thủ/vị trí thứ hai để đổi chỗ; bấm lại chính nó để bỏ chọn
  const k=keyOf(e.target);if(!k||!e.target.closest("button,tr[data-kind]"))return;
  const t=T.home,has=(k.kind==="slot"?t.players:(t.subs||[]))[k.i];
  if(!LU.sel){if(!has)return;LU.sel=k;LU.msg="";renderLineup();return}
  const a=LU.sel;LU.sel=null;if(a.kind===k.kind&&a.i===k.i){renderLineup();return}swapLU(a,k);renderLineup()});
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
   Các màn hình Đội hình / Quản lý / Cầu thủ / Giải đấu / Nhiệm vụ / Cửa hàng / Cài đặt mở dạng cửa sổ. */
var MODE="lobby";window.MODE=MODE;
const gameEl=document.getElementById("game"),wrapEl=document.querySelector(".wrap");
function club(){const c=T.club;c.mgr=c.mgr||{name:"Chủ tịch",lv:1,exp:0};c.flags=c.flags||{};c.claimed=c.claimed||{};c.news=c.news||[];c.campaign=c.campaign||0;c.the=c.the??8;c.bh=c.bh??0;return c}
function flag(k,v=true){const f=club().flags;if(typeof v==="number")f[k]=(f[k]||0)+v;else f[k]=v;if(MODE==="lobby")lobbyRender()}
function news(text){const n=club().news;n.unshift({t:Date.now(),text});n.length=Math.min(n.length,30);if(MODE==="lobby")lobbyRender()}
function toast(text){const el=document.getElementById("toast");el.textContent=text;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}

/* ---------- Giải đấu: 10 đội NPC mạnh dần ---------- */
const CAMPAIGN=[ // độ khó tăng đều: thực lực ~55 → 75 → 90 → 110 → 135 → 160 → 190 → 225 → 265 → 310
 {n:"Đồng Tháp Xanh",q:"vn",c:"#16a34a",t:0,up:0,kt:35},{n:"Sông Lam Đỏ",q:"vn",c:"#b91c1c",t:0,up:0,kt:48},
 {n:"Voi Trắng Bangkok",q:"th",c:"#0e7490",t:1,up:0,kt:45},{n:"Samurai Tokyo",q:"jp",c:"#1e3a8a",t:1,up:0,kt:54},
 {n:"Hổ Trắng Seoul",q:"kr",c:"#be123c",t:2,up:0,kt:54},{n:"Sư Tử London",q:"en",c:"#ca8a04",t:2,up:0,kt:64},
 {n:"Đại Bàng Bavaria",q:"de",c:"#111827",t:3,up:0,kt:62},{n:"Bò Tót Madrid",q:"es",c:"#9d174d",t:3,up:0,kt:73},
 {n:"Thủy Thủ Lisbon",q:"pt",c:"#15803d",t:4,up:0,kt:70},{n:"Tango Buenos Aires",q:"ar",c:"#0284c7",t:4,up:1,kt:78}];
const reward=i=>({gold:6000*(i+1),phieu:5*(i+1),the:[2,5,8,9].includes(i)?1:0});
function npcTeam(i){const s=CAMPAIGN[i],F=FORMS["442A"];
  const players=F.map(([r],j)=>{const nm=nameAt(s.q,i*11+j*7);
    const tier=Math.min(5,s.t+(j>=11-s.up?1:0)),p=mk(nm+" "+s.n,r,tier,"P",0);p.n=nm;p.q=s.q;p.kt=s.kt;for(const [k] of ATTR)p.base[k]=r1(maxOf(p,k)*0.95);refresh(p);return p});
  const t={name:s.n,color:s.c,players,subs:[],npc:i,tac:{form:"442A",atk:Object.keys(ATK_TAC)[i%4],atkLv:1,def:Object.keys(DEF_TAC)[i%3],defLv:1}};applyLineup(t);return t}

/* ================== QUỐC GIA · MÔI GIỚI · CHIÊU MỘ ==================
   Tìm cầu thủ ở Môi giới là "quay may mắn": mỗi lần ra 4 ứng viên, bậc càng cao càng hiếm.
   Thị trường một quốc gia mở khi đội tới giải đấu của nước đó: chỉ ra cầu thủ nước đó, tỉ lệ Tím/Vàng/Đỏ ×2.
   Thắng giải đấu: lần đầu chắc chắn, đá lại 30% được Môi giới "tiến cử" 1 cầu thủ nước đó (tỉ lệ cao ×3). */
const NATIONS={vn:{n:"Việt Nam"},th:{n:"Thái Lan"},jp:{n:"Nhật Bản"},kr:{n:"Hàn Quốc"},en:{n:"Anh"},de:{n:"Đức"},es:{n:"Tây Ban Nha"},pt:{n:"Bồ Đào Nha"},ar:{n:"Argentina"},br:{n:"Brazil"},fr:{n:"Pháp"},nl:{n:"Hà Lan"},it:{n:"Ý"},hr:{n:"Croatia"},cz:{n:"Séc"},be:{n:"Bỉ"},no:{n:"Na Uy"},tr:{n:"Thổ Nhĩ Kỳ"},sa:{n:"Ả Rập Xê Út"},us:{n:"Mỹ"},id:{n:"Indonesia"},my:{n:"Malaysia"}};
const FLAG_SVG={vn:'<rect width="30" height="20" fill="#da251d"/><polygon points="15,4 16.8,9.4 22.4,9.4 17.8,12.6 19.6,18 15,14.7 10.4,18 12.2,12.6 7.6,9.4 13.2,9.4" fill="#ff0"/>',
th:'<rect width="30" height="20" fill="#a51931"/><rect y="3.33" width="30" height="13.33" fill="#f4f5f8"/><rect y="6.67" width="30" height="6.67" fill="#2d2a4a"/>',
jp:'<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/>',
kr:'<rect width="30" height="20" fill="#fff"/><path d="M10 10a5 5 0 0 1 10 0z" fill="#cd2e3a"/><path d="M10 10a5 5 0 0 0 10 0z" fill="#0047a0"/><g fill="#000"><rect x="3" y="3" width="4" height="1.2" transform="rotate(34 5 4)"/><rect x="23" y="3" width="4" height="1.2" transform="rotate(-34 25 4)"/><rect x="3" y="15.8" width="4" height="1.2" transform="rotate(-34 5 16)"/><rect x="23" y="15.8" width="4" height="1.2" transform="rotate(34 25 16)"/></g>',
en:'<rect width="30" height="20" fill="#fff"/><rect x="12.5" width="5" height="20" fill="#ce1124"/><rect y="7.5" width="30" height="5" fill="#ce1124"/>',
de:'<rect width="30" height="20" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#dd0000"/><rect y="13.33" width="30" height="6.67" fill="#ffce00"/>',
es:'<rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/>',
pt:'<rect width="30" height="20" fill="#ff0000"/><rect width="12" height="20" fill="#006600"/><circle cx="12" cy="10" r="3.6" fill="#ffcc00"/><circle cx="12" cy="10" r="2.2" fill="#ff0000"/>',
ar:'<rect width="30" height="20" fill="#74acdf"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2" fill="#f6b40e"/>',
br:'<rect width="30" height="20" fill="#009c3b"/><polygon points="15,2.5 27,10 15,17.5 3,10" fill="#ffdf00"/><circle cx="15" cy="10" r="4" fill="#002776"/>',
fr:'<rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#002395"/><rect x="20" width="10" height="20" fill="#ed2939"/>',
nl:'<rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#ae1c28"/><rect y="13.33" width="30" height="6.67" fill="#21468b"/>',
it:'<rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#009246"/><rect x="20" width="10" height="20" fill="#ce2b37"/>',
hr:'<rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#ff0000"/><rect y="13.33" width="30" height="6.67" fill="#171796"/><rect x="12" y="5" width="6" height="7" fill="#fff" stroke="#ff0000" stroke-width=".6"/><g fill="#ff0000"><rect x="12" y="5" width="2" height="2"/><rect x="16" y="5" width="2" height="2"/><rect x="14" y="7" width="2" height="2"/><rect x="12" y="9" width="2" height="2"/><rect x="16" y="9" width="2" height="2"/></g>',
cz:'<rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#d7141a"/><polygon points="0,0 15,10 0,20" fill="#11457e"/>',
be:'<rect width="30" height="20" fill="#ef3340"/><rect width="10" height="20" fill="#000"/><rect x="10" width="10" height="20" fill="#fdda24"/>',
tr:'<rect width="30" height="20" fill="#e30a17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.4" cy="10" r="4" fill="#e30a17"/><polygon points="16,10 19.4,8.9 17.3,11.8 17.3,8.2 19.4,11.1" fill="#fff"/>',
sa:'<rect width="30" height="20" fill="#006c35"/><rect x="7" y="7" width="16" height="2.2" rx="1" fill="#fff"/><rect x="8" y="12.5" width="14" height="1.2" fill="#fff"/>',
us:'<rect width="30" height="20" fill="#fff"/><g fill="#b22234"><rect width="30" height="1.54"/><rect y="3.08" width="30" height="1.54"/><rect y="6.15" width="30" height="1.54"/><rect y="9.23" width="30" height="1.54"/><rect y="12.3" width="30" height="1.54"/><rect y="15.4" width="30" height="1.54"/><rect y="18.46" width="30" height="1.54"/></g><rect width="12" height="10.77" fill="#3c3b6e"/>',
id:'<rect width="30" height="20" fill="#fff"/><rect width="30" height="10" fill="#ce1126"/>',
my:'<rect width="30" height="20" fill="#fff"/><g fill="#cc0001"><rect width="30" height="1.43"/><rect y="2.86" width="30" height="1.43"/><rect y="5.71" width="30" height="1.43"/><rect y="8.57" width="30" height="1.43"/><rect y="11.43" width="30" height="1.43"/><rect y="14.29" width="30" height="1.43"/><rect y="17.14" width="30" height="1.43"/></g><rect width="15" height="11.43" fill="#010066"/><circle cx="6.5" cy="5.7" r="3.6" fill="#fc0"/><circle cx="7.6" cy="5.7" r="3" fill="#010066"/><circle cx="11.6" cy="5.7" r="1.6" fill="#fc0"/>',
no:'<rect width="30" height="20" fill="#ba0c2f"/><rect x="8" width="6" height="20" fill="#fff"/><rect y="7" width="30" height="6" fill="#fff"/><rect x="9.5" width="3" height="20" fill="#00205b"/><rect y="8.5" width="30" height="3" fill="#00205b"/>'};
const flagSvg=q=>`<svg viewBox="0 0 30 20" preserveAspectRatio="none">${FLAG_SVG[q]||FLAG_SVG.vn}</svg>`;
const RAND_NAT=["vn","th","jp","kr","en","de","es","pt","ar"]; // quốc gia có bộ tên để sinh cầu thủ vô danh
const NAME_PARTS={
 vn:[["Văn","Đức","Minh","Quốc","Thành","Hữu","Công","Tuấn","Xuân","Trọng"],["An","Bình","Cường","Dũng","Hải","Khánh","Lâm","Long","Nam","Phong","Sơn","Tâm","Thắng","Toàn","Trung","Vinh","Phát","Bảo"]],
 th:[["Somchai","Anon","Kittisak","Prasit","Nattapong","Wichai","Thanakorn","Pongsak","Sarawut","Ekkachai"]],
 jp:[["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato","Yoshida","Matsumoto"]],
 kr:[["Kim","Lee","Park","Choi","Jung","Kang","Cho","Yoon"],["Min-ho","Ji-sung","Dong-hyun","Seung-woo","Jae-won","Hyun-jun","Tae-yang","Sung-min"]],
 en:[["Smith","Jones","Taylor","Brown","Wilson","Walker","Wright","Hughes","Green","Hall","Cole","Ward"]],
 de:[["Müller","Schmidt","Schneider","Fischer","Weber","Becker","Wagner","Hoffmann","Krause","Brandt"]],
 es:[["García","López","Martín","Sánchez","Pérez","Gómez","Ruiz","Moreno","Navarro","Torres"]],
 pt:[["Silva","Santos","Ferreira","Pereira","Costa","Oliveira","Rodrigues","Sousa","Gomes","Lopes"]],
 fr:[["Martin","Bernard","Dubois","Laurent","Moreau","Girard","Lefèvre","Mercier","Fontaine","Rousseau"]],
 it:[["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco"]],
 nl:[["de Jong","Jansen","de Vries","van Dijk","Bakker","Visser","Smit","Meijer","de Boer","Mulder"]],
 br:[["Silva","Souza","Santos","Oliveira","Lima","Pereira","Carvalho","Ribeiro","Almeida","Barbosa"]],
 hr:[["Horvat","Kovačević","Babić","Marić","Jurić","Novak","Knežević","Vuković","Perić","Pavlović"]],
 id:[["Pratama","Saputra","Hidayat","Nugroho","Setiawan","Santoso","Wijaya","Kurniawan","Siregar","Rahman"]],
 my:[["Rahman","Ismail","Hassan","Yusof","Abdullah","Aziz","Othman","Salleh","Hamid","Ibrahim"]],
 tr:[["Yılmaz","Kaya","Demir","Şahin","Çelik","Yıldız","Aydın","Öztürk","Arslan","Doğan"]],
 sa:[["Al-Dawsari","Al-Shahrani","Al-Malki","Al-Faraj","Al-Ghamdi","Al-Harbi","Al-Qahtani","Al-Otaibi","Al-Zahrani","Al-Shehri"]],
 ar:[["González","Rodríguez","Fernández","Sosa","Romero","Acosta","Benítez","Medina","Ríos","Paredes"]]};
function nameAt(q,k){const P=NAME_PARTS[q]||NAME_PARTS.vn;k=Math.abs(k|0);
  const a=P[0][k%P[0].length],n=Math.floor(k/P[0].length);
  return P.length>1?`${a} ${P[1][n%P[1].length]}`:`${String.fromCharCode(65+n%26)}. ${a}`}
// [tên, vị trí, bậc (0 Trắng … 5 Đỏ), quốc gia, chân]
const STARS=[["Ronaldo","TĐ",5,"pt","P"],["Beckham","TVC",6,"en","P"],["Buffon","TM",6,"it","P"],["Gullit","TV",6,"nl","P"],["Lamine Yamal","TVC",6,"es","T"],["Mbappé","TĐ",6,"fr","P"],["Messi","TĐ",6,"ar","T"],["Modrić","TV",6,"hr","P"],["Neymar Jr","TVC",6,"br","P"],["Pepe","HV",6,"pt","P"],["Petr Čech","TM",6,"cz","T"],["Roberto Carlos","HVC",6,"br","T"],["Ronaldinho","TV",6,"br","P"],["Ronaldo","TVC",6,"pt","P"],["Rooney","TĐ",6,"en","P"],["van Persie","TĐ",6,"nl","T"],["van der Sar","TM",6,"nl","P"],["Lamine Yamal","TVC",5,"es","T"],["Mbappé","TĐ",5,"fr","P"],["Erling Haaland","TĐ",5,"no","T"],["Vini Jr.","TVC",5,"br","P"],["Jude Bellingham","TV",5,"en","P"],["Harry Kane","TĐ",5,"en","P"],["Chanathip Songkrasin","TV",5,"th","P"],["Bukayo Saka","TVC",4,"en","T"],["Phil Foden","TVC",4,"en","T"],["De Bruyne","TV",4,"be","P"],["Bruno Fernandes","TV",4,"pt","P"],["Vitinha","TV",4,"pt","P"],["Emiliano Martínez","TM",4,"ar","P"],["Casemiro","TV",3,"br","P"],["Enzo Fernández","TV",3,"ar","P"],["Kyle Walker","HVC",3,"en","P"],["Kieran Trippier","HVC",3,"en","P"],["James Maddison","TV",3,"en","P"],["Nick Pope","TM",3,"en","P"],["Michael Carrick","TV",3,"en","P"],["Kaoru Mitoma","TVC",3,"jp","P"],["Takefusa Kubo","TVC",3,"jp","T"],["Takehiro Tomiyasu","HV",3,"jp","P"],["Hidetoshi Nakata","TV",3,"jp","P"],["Keisuke Honda","TV",3,"jp","T"],["Đỗ Hoàng Hên","TVC",3,"vn","P"],["Quế Ngọc Hải","HV",3,"vn","P"],["Nguyễn Văn Toản","TM",3,"vn","P"],["Declan Rice","TV",2,"en","P"],["John Terry","HV",2,"en","P"],["Raheem Sterling","TVC",2,"en","P"],["Joe Gomez","HV",2,"en","P"],["Chris Smalling","HV",2,"en","P"],["Danny Welbeck","TĐ",2,"en","P"],["Dean Henderson","TM",2,"en","P"],["Daniel Sturridge","TĐ",2,"en","T"],["Daichi Kamada","TV",2,"jp","P"],["Ritsu Doan","TVC",2,"jp","T"],["Junya Ito","TVC",2,"jp","P"],["Ayase Ueda","TĐ",2,"jp","P"],["Makoto Hasebe","TV",2,"jp","P"],["Kiatisuk Senamuang","TĐ",2,"th","P"],["Phạm Thành Lương","TVC",2,"vn","T"],["Nguyễn Anh Đức","TĐ",2,"vn","P"],["Patrick Bamford","TĐ",1,"en","T"],["Mark Noble","TV",1,"en","P"],["Glenn Murray","TĐ",1,"en","T"],["Takuma Asano","TĐ",1,"jp","P"],["Kodai Sano","TV",1,"jp","P"],["Takashi Usami","TVC",1,"jp","P"],["Gōtoku Sakai","HVC",1,"jp","P"],["Teerasil Dangda","TĐ",1,"th","P"],["Suphanat Mueanta","TVC",1,"th","P"],["Kawin Thamsatchanan","TM",1,"th","P"],["Nguyễn Hai Long","TV",1,"vn","P"],["Khuất Văn Khang","TV",1,"vn","T"],["Nguyễn Thanh Bình","HV",1,"vn","P"],["Nhâm Mạnh Dũng","TĐ",1,"vn","P"],["Bùi Tấn Trường","TM",1,"vn","P"],["Phạm Đức Huy","TV",1,"vn","T"],["Bùi Hoàng Việt Anh","HV",1,"vn","P"],["Dương Hồng Sơn","TM",1,"vn","P"],["Adam Smith","HVC",0,"en","P"],["Andrew Davies","HV",0,"en","P"],["Brad Walker","TV",0,"en","P"],["Bradley Barry","HVC",0,"en","P"],["Chris Whelpdale","TV",0,"en","P"],["Craig Roddan","TV",0,"en","P"],["Harry Middleton","TV",0,"en","P"],["J. Binnom-Williams","HVC",0,"en","T"],["Joe Skarz","HVC",0,"en","T"],["Laurence Maguire","HV",0,"en","T"],["Luke Summerfield","TV",0,"en","P"],["Michael Nelson","HV",0,"en","P"],["Reece Flanagan","TV",0,"en","P"],["Ryan Seager","TĐ",0,"en","P"],["Simon Francis","HVC",0,"en","P"],["Atsuki Wada","TV",0,"jp","T"],["Daisuke Suzuki","HV",0,"jp","P"],["Jin Izumisawa","TVC",0,"jp","P"],["Justin Tokishi Kinjo","TV",0,"jp","P"],["Kaishū Sano","TV",0,"jp","P"],["Kosuke Kinoshita","TĐ",0,"jp","P"],["Sergio Escudero","HVC",0,"jp","T"],["Takahiro Sekine","TVC",0,"jp","P"],["Theo Ryuki","TV",0,"jp","P"],["Tsuyoshi Watanabe","HV",0,"jp","P"],["Y. Toyoda","TĐ",0,"jp","P"],["Yosuke Ideguchi","TV",0,"jp","P"],["Jonathan Khemdee","HV",0,"th","P"],["Jude Soonsup-Bell","TĐ",0,"th","P"],["Kapol Thongplub","TV",0,"th","P"],["Nicholas Mickelson","HVC",0,"th","P"],["Pramote Pathan","TV",0,"th","P"],["T. Suengchitthawon","TV",0,"th","P"],["Teng","HV",0,"th","P"],["Dụng Quang Nho","TVC",0,"vn","P"],["Nguyễn Quốc Việt","TĐ",0,"vn","P"],["Phan Văn Tài Em","TV",0,"vn","P"],["Trần Trung Kiên","TM",0,"vn","P"],["Lautaro Martínez","TĐ",4,"ar","P"],["Julián Álvarez","TĐ",4,"ar","P"],["Di María","TVC",4,"ar","T"],["Mac Allister","TV",3,"ar","P"],["De Paul","TV",3,"ar","P"],["Otamendi","HV",2,"ar","P"],["Tagliafico","HVC",2,"ar","T"],["Bernardo Silva","TVC",4,"pt","T"],["Rúben Dias","HV",4,"pt","P"],["Rafael Leão","TVC",3,"pt","P"],["João Félix","TĐ",3,"pt","P"],["Diogo Costa","TM",3,"pt","P"],["Nuno Mendes","HVC",3,"pt","T"],["Gonçalo Ramos","TĐ",2,"pt","P"],["Pedri","TV",4,"es","P"],["Rodri","TV",4,"es","P"],["Nico Williams","TVC",3,"es","P"],["Dani Olmo","TV",3,"es","P"],["Unai Simón","TM",3,"es","P"],["Cucurella","HVC",2,"es","T"],["Morata","TĐ",2,"es","P"],["Musiala","TV",4,"de","P"],["Wirtz","TV",4,"de","P"],["Neuer","TM",4,"de","P"],["Kimmich","TV",3,"de","P"],["Rüdiger","HV",3,"de","P"],["Havertz","TĐ",3,"de","T"],["Sané","TVC",3,"de","T"],["Gnabry","TVC",2,"de","P"],["Stones","HV",3,"en","P"],["Pickford","TM",3,"en","T"],["Son Heung-min","TĐ",4,"kr","P"],["Kim Min-jae","HV",3,"kr","P"],["Lee Kang-in","TV",3,"kr","T"],["Hwang Hee-chan","TĐ",2,"kr","P"],["Jo Hyeon-woo","TM",2,"kr","P"],["Hwang In-beom","TV",2,"kr","P"],["Endo","TV",3,"jp","P"],["Minamino","TĐ",2,"jp","P"],["Supachok","TVC",2,"th","P"],["Theerathon","HVC",2,"th","T"],["Quang Hải","TVC",3,"vn","T"],["Xuân Son","TĐ",5,"vn","P"],["Công Phượng","TVC",2,"vn","P"],["Tiến Linh","TĐ",2,"vn","P"],["Văn Hậu","HVC",2,"vn","T"],["Hoàng Đức","TV",2,"vn","P"],["Văn Lâm","TM",2,"vn","P"],["Tuấn Anh","TV",2,"vn","P"],["Văn Quyết","TĐ",2,"vn","P"],["Duy Mạnh","HV",2,"vn","P"],["Văn Toàn","TĐ",2,"vn","P"],["Tiến Dũng","HV",2,"vn","P"],["Xuân Mạnh","HVC",2,"vn","P"],["Hùng Dũng","TV",2,"vn","P"]];
/* ================== THÀNH PHỐ: quả địa cầu · câu lạc bộ thật ==================
   Bấm một nước trên địa cầu → danh sách CLB của giải nước đó, xếp từ yếu đến mạnh (thắng CLB trước mới mở CLB sau).
   Thắng một CLB: cầu thủ có tên thật của CLB đó được đưa vào Môi giới (từ giờ có thể quay ra),
   lần đầu thắng chắc chắn được tiến cử 1 cầu thủ của CLB, đá lại 30%. Mở thị trường Môi giới của nước đó.
   Danh sách cầu thủ theo CLB lấy theo mùa giải gần nhất mình biết; cầu thủ chưa gắn CLB nào (đã giải nghệ…) vẫn quay ra như cũ. */
const CITY=[
 {q:"vn",lg:"V.League 1",ll:[106,16],clubs:[
  {id:"vn_hagl",n:"Hoàng Anh Gia Lai",c:"#f59e0b",t:0,kt:34,ov:55,p:["Trần Trung Kiên","Phan Văn Tài Em"]},
  {id:"vn_hp",n:"Hải Phòng",c:"#7c2d12",t:0,kt:40,ov:70,p:["Dụng Quang Nho"]},
  {id:"vn_slna",n:"Sông Lam Nghệ An",c:"#facc15",t:0,kt:46,ov:90,p:["Quế Ngọc Hải"]},
  {id:"vn_tc",n:"Thể Công Viettel",c:"#b91c1c",t:1,kt:42,ov:110,p:["Khuất Văn Khang","Nguyễn Thanh Bình","Nhâm Mạnh Dũng"]},
  {id:"vn_nb",n:"Ninh Bình",c:"#0ea5e9",t:1,kt:48,ov:135,p:["Hoàng Đức","Văn Lâm","Nguyễn Quốc Việt"]},
  {id:"vn_hn",n:"Hà Nội FC",c:"#7e22ce",t:1,kt:55,ov:160,p:["Văn Quyết","Duy Mạnh","Xuân Mạnh","Hùng Dũng","Nguyễn Hai Long","Đỗ Hoàng Hên"]},
  {id:"vn_nd",n:"Thép Xanh Nam Định",c:"#1e3a8a",t:2,kt:50,ov:185,p:["Xuân Son","Văn Toàn","Tuấn Anh","Nguyễn Văn Toản","Phạm Đức Huy"]},
  {id:"vn_cahn",n:"Công An Hà Nội",c:"#dc2626",t:2,kt:57,ov:210,p:["Quang Hải","Văn Hậu","Tiến Linh","Bùi Hoàng Việt Anh","Tiến Dũng","Bùi Tấn Trường"]}]},
 {q:"th",lg:"Thai League 1",ll:[101,15],clubs:[
  {id:"th_port",n:"Port FC",c:"#1d4ed8",t:1,kt:40,ov:100,p:["Kawin Thamsatchanan"]},
  {id:"th_bg",n:"BG Pathum United",c:"#1e40af",t:1,kt:48,ov:130,p:["Chanathip Songkrasin","Teerasil Dangda","Jonathan Khemdee"]},
  {id:"th_bur",n:"Buriram United",c:"#1e3a8a",t:2,kt:48,ov:160,p:["Supachok","Theerathon","Nicholas Mickelson"]}]},
 {q:"jp",lg:"J1 League",ll:[138,36],clubs:[
  {id:"jp_tosu",n:"Sagan Tosu",c:"#38bdf8",t:0,kt:48,ov:90,p:["Y. Toyoda"]},
  {id:"jp_gamba",n:"Gamba Osaka",c:"#1d4ed8",t:1,kt:46,ov:120,p:["Takashi Usami"]},
  {id:"jp_kobe",n:"Vissel Kobe",c:"#991b1b",t:1,kt:54,ov:150,p:["Gōtoku Sakai","Yosuke Ideguchi"]}]},
 {q:"kr",lg:"K League 1",ll:[128,36.5],clubs:[
  {id:"kr_ulsan",n:"Ulsan HD",c:"#1d4ed8",t:2,kt:46,ov:170,p:["Jo Hyeon-woo"]}]},
 {q:"sa",lg:"Saudi Pro League",ll:[45,24],clubs:[
  {id:"sa_nassr",n:"Al Nassr",c:"#facc15",t:4,kt:56,ov:360,p:["Ronaldo","João Félix"]}]},
 {q:"tr",lg:"Süper Lig",ll:[35,39],clubs:[
  {id:"tr_gala",n:"Galatasaray",c:"#b91c1c",t:3,kt:56,ov:300,p:["Sané"]}]},
 {q:"en",lg:"Premier League",ll:[-1.5,52.5],clubs:[
  {id:"en_bou",n:"Bournemouth",c:"#b91c1c",t:1,kt:48,ov:120,p:["Adam Smith"]},
  {id:"en_wol",n:"Wolverhampton",c:"#f59e0b",t:1,kt:56,ov:145,p:["Hwang Hee-chan"]},
  {id:"en_bur",n:"Burnley",c:"#7f1d1d",t:2,kt:46,ov:170,p:["Kyle Walker"]},
  {id:"en_cry",n:"Crystal Palace",c:"#1d4ed8",t:2,kt:50,ov:195,p:["Daichi Kamada","Dean Henderson"]},
  {id:"en_bri",n:"Brighton",c:"#2563eb",t:2,kt:55,ov:220,p:["Kaoru Mitoma","Danny Welbeck"]},
  {id:"en_eve",n:"Everton",c:"#1e40af",t:2,kt:59,ov:245,p:["Pickford"]},
  {id:"en_tot",n:"Tottenham",c:"#e5e7eb",t:3,kt:52,ov:270,p:["James Maddison"]},
  {id:"en_new",n:"Newcastle",c:"#111827",t:3,kt:56,ov:300,p:["Nick Pope","Kieran Trippier"]},
  {id:"en_avl",n:"Aston Villa",c:"#7f1d1d",t:3,kt:60,ov:330,p:["Emiliano Martínez"]},
  {id:"en_mu",n:"Manchester United",c:"#dc2626",t:3,kt:64,ov:360,p:["Bruno Fernandes","Casemiro"]},
  {id:"en_che",n:"Chelsea",c:"#1d4ed8",t:4,kt:56,ov:390,p:["Enzo Fernández","Cucurella"]},
  {id:"en_liv",n:"Liverpool",c:"#c8102e",t:4,kt:62,ov:420,p:["Mac Allister","Wirtz","Endo","Joe Gomez"]},
  {id:"en_ars",n:"Arsenal",c:"#ef4444",t:4,kt:66,ov:450,p:["Bukayo Saka","Declan Rice","Havertz"]},
  {id:"en_mci",n:"Manchester City",c:"#38bdf8",t:4,kt:70,ov:480,p:["Erling Haaland","Phil Foden","Rodri","Bernardo Silva","Rúben Dias","Stones"]}]},
 {q:"nl",lg:"Eredivisie",ll:[5.3,52.3],clubs:[
  {id:"nl_nec",n:"NEC Nijmegen",c:"#b91c1c",t:1,kt:50,ov:130,p:["Kodai Sano"]},
  {id:"nl_fey",n:"Feyenoord",c:"#dc2626",t:2,kt:54,ov:175,p:["Ayase Ueda","Tsuyoshi Watanabe","Hwang In-beom"]},
  {id:"nl_ajax",n:"Ajax",c:"#e11d48",t:2,kt:60,ov:215,p:["Takehiro Tomiyasu"]}]},
 {q:"be",lg:"Pro League",ll:[4.6,50.6],clubs:[
  {id:"be_ohl",n:"OH Leuven",c:"#16a34a",t:1,kt:46,ov:120,p:["Suphanat Mueanta"]},
  {id:"be_genk",n:"Genk",c:"#1d4ed8",t:2,kt:50,ov:165,p:["Junya Ito"]}]},
 {q:"fr",lg:"Ligue 1",ll:[2.4,46.6],clubs:[
  {id:"fr_lyon",n:"Lyon",c:"#1d4ed8",t:3,kt:48,ov:230,p:["Tagliafico"]},
  {id:"fr_mon",n:"Monaco",c:"#dc2626",t:3,kt:54,ov:270,p:["Minamino"]},
  {id:"fr_psg",n:"Paris Saint-Germain",c:"#1e3a8a",t:5,kt:56,ov:450,p:["Vitinha","Nuno Mendes","Gonçalo Ramos","Lee Kang-in"]}]},
 {q:"de",lg:"Bundesliga",ll:[10.4,51.2],clubs:[
  {id:"de_mainz",n:"Mainz 05",c:"#dc2626",t:2,kt:50,ov:180,p:["Kaishū Sano"]},
  {id:"de_sge",n:"Eintracht Frankfurt",c:"#111827",t:3,kt:52,ov:260,p:["Ritsu Doan"]},
  {id:"de_fcb",n:"Bayern München",c:"#dc2626",t:5,kt:58,ov:460,p:["Harry Kane","Musiala","Kimmich","Neuer","Kim Min-jae","Gnabry"]}]},
 {q:"it",lg:"Serie A",ll:[12.5,42.6],clubs:[
  {id:"it_como",n:"Como",c:"#1d4ed8",t:2,kt:56,ov:200,p:["Morata"]},
  {id:"it_mil",n:"AC Milan",c:"#b91c1c",t:3,kt:60,ov:280,p:["Rafael Leão"]},
  {id:"it_nap",n:"Napoli",c:"#0ea5e9",t:4,kt:56,ov:360,p:["De Bruyne"]},
  {id:"it_int",n:"Inter",c:"#1e3a8a",t:4,kt:64,ov:420,p:["Lautaro Martínez"]}]},
 {q:"pt",lg:"Liga Portugal",ll:[-8.2,39.6],clubs:[
  {id:"pt_por",n:"Porto",c:"#1d4ed8",t:3,kt:52,ov:250,p:["Diogo Costa"]},
  {id:"pt_ben",n:"Benfica",c:"#dc2626",t:3,kt:58,ov:310,p:["Otamendi"]}]},
 {q:"es",lg:"La Liga",ll:[-3.7,40.3],clubs:[
  {id:"es_mal",n:"Mallorca",c:"#b91c1c",t:2,kt:50,ov:170,p:["Takuma Asano"]},
  {id:"es_rso",n:"Real Sociedad",c:"#1d4ed8",t:3,kt:52,ov:240,p:["Takefusa Kubo"]},
  {id:"es_ath",n:"Athletic Bilbao",c:"#dc2626",t:3,kt:60,ov:300,p:["Nico Williams","Unai Simón"]},
  {id:"es_atm",n:"Atlético Madrid",c:"#b91c1c",t:4,kt:58,ov:370,p:["Julián Álvarez"]},
  {id:"es_bar",n:"Barcelona",c:"#7f1d1d",t:4,kt:66,ov:440,p:["Lamine Yamal","Pedri","Dani Olmo"]},
  {id:"es_rma",n:"Real Madrid",c:"#f8fafc",t:5,kt:60,ov:490,p:["Jude Bellingham","Mbappé","Vini Jr.","Rüdiger"]}]},
 {q:"us",lg:"MLS",ll:[-98,39],clubs:[
  {id:"us_lafc",n:"LAFC",c:"#111827",t:3,kt:50,ov:220,p:["Son Heung-min"]},
  {id:"us_mia",n:"Inter Miami",c:"#f472b6",t:3,kt:56,ov:260,p:["De Paul"]}]},
 {q:"ar",lg:"Liga Profesional",ll:[-64,-34],clubs:[
  {id:"ar_ros",n:"Rosario Central",c:"#1d4ed8",t:3,kt:54,ov:280,p:["Di María"]}]}];

// cầu thủ có tên thật thuộc CLB nào (khóa theo tên + bậc, để Icon cùng tên không bị ảnh hưởng)
const STAR_OF=n=>STARS.filter(s=>s[0]===n&&s[2]<6).sort((a,b)=>b[2]-a[2])[0];
const CLUB_OF={},CLUB_BY={};
for(const C of CITY)for(const k of C.clubs){k.q=C.q;CLUB_BY[k.id]=k;k.p=k.p.filter(n=>{const s=STAR_OF(n);if(s)CLUB_OF[s[0]+"#"+s[2]]=k.id;return !!s})}
const cityWon=()=>{const c=club();c.cityWon=c.cityWon||{};return c.cityWon};
const starOpen=s=>{const id=CLUB_OF[s[0]+"#"+s[2]];return !id||!!cityWon()[id]}; // cầu thủ của CLB chưa thắng chưa ra ở Môi giới

// đội hình CLB: cầu thủ thật đứng đúng vị trí, chỗ trống là cầu thủ trẻ cùng nước của CLB
const FILL_NAT=q=>NAME_PARTS[q]?q:({us:"en",be:"nl",sa:"sa",tr:"tr"}[q]||"en");
function buildSquad(name,q,named,t,kt,seed,color,tag,target){const F=FORMS["442A"],slots=F.map(([r])=>r),used=new Array(11).fill(null);
  const fit=(pos,r)=>pos===r?3:(pos==="HVC"&&r==="HV")||(pos==="HV"&&r==="HVC")||(pos==="TVC"&&r==="TV")||(pos==="TV"&&r==="TVC")||(pos==="TVC"&&r==="TĐ")||(pos==="TĐ"&&r==="TVC")?2:pos==="TM"||r==="TM"?-9:1;
  const list=named.map(STAR_OF).filter(Boolean).sort((a,b)=>b[2]-a[2]);
  for(const s of list){let bi=-1,bv=-99;slots.forEach((r,i)=>{if(!used[i]&&fit(s[1],r)>bv){bv=fit(s[1],r);bi=i}});if(bi<0||bv<0)continue;
    const p=mk(s[0],s[1],s[2],s[4]||"P",0);p.q=s[3];p.kt=Math.max(p.kt,kt+8);for(const [k] of ATTR)p.base[k]=r1(maxOf(p,k)*0.95);refresh(p);used[bi]=p}
  const fn=FILL_NAT(q);
  slots.forEach((r,i)=>{if(used[i])return;const nm=nameAt(fn,seed+i*7);const p=mk(nm+" "+name,r,t,"P",0);p.n=nm;p.q=q;p.kt=kt;for(const [k] of ATTR)p.base[k]=r1(maxOf(p,k)*0.95);refresh(p);used[i]=p});
  used.forEach((p,i)=>p.pos=p.pos||slots[i]);
  if(target){const f=target/avg(used.map(overall));for(const p of used){for(const [k] of ATTR)p.base[k]=r1(p.base[k]*f);refresh(p)}}
  const t2={name,color,players:used,subs:[],npc:tag,tac:{form:"442A",atk:Object.keys(ATK_TAC)[seed%4],atkLv:1,def:Object.keys(DEF_TAC)[seed%3],defLv:1}};applyLineup(t2);return t2}
const clubTeam=(k,ov)=>buildSquad(k.n,k.q,k.p,k.t,k.kt,hashN(k.id)%997,k.c,"city",ov||k.ov);
const CLUB_OV={};const clubOv=k=>CLUB_OV[k.id]??(CLUB_OV[k.id]=r1(avg(clubTeam(k).players.map(overall))));
// CLB trong một nước, từ yếu đến mạnh
const cityClubs=C=>C.clubs.slice().sort((a,b)=>clubOv(a)-clubOv(b));
const clubOpen=(C,k)=>{const L=cityClubs(C),i=L.indexOf(k);return i===0||!!cityWon()[L[i-1].id]};
const cityReward=k=>{const o=clubOv(k);return{gold:Math.round(o*80/500)*500,phieu:Math.max(3,Math.round(o/12))}};
function cityScout(k,first){if(!first&&Math.random()>=.3)return;const b=brokerState(),taken=takenNames();
  const pool=k.p.filter(n=>!taken.has(n));if(!pool.length)return;const s=STAR_OF(pool[Math.floor(Math.random()*pool.length)]);
  const p=mk(s[0],s[1],s[2],s[4]||"P",0);p.q=s[3];p.fee=HIRE_FEE[s[2]];p.rec=1;
  b.list=[p,...b.list.filter(x=>x.rec).slice(0,1),...b.list.filter(x=>!x.rec)].slice(0,6);
  news(`Môi giới tiến cử ${p.n} (${TIERS[p.tier].n}) của ${k.n}. Vào Môi giới để tuyển dụng.`);setTimeout(()=>toast(`Môi giới tiến cử: ${p.n} (${TIERS[p.tier].n})`),5600)}
// chuyển tiến độ 10 giải đấu cũ sang Thành Phố: mỗi trận đã thắng = thắng CLB yếu nhất còn lại của nước đó
function cityMigrate(){const c=club();if(c.cityMig)return;c.cityMig=1;const W=cityWon();
  for(let i=0;i<Math.min(c.campaign||0,OLD_CAMP_Q.length);i++){const C=CITY.find(x=>x.q===OLD_CAMP_Q[i]);if(!C)continue;const k=cityClubs(C).find(x=>!W[x.id]);if(k)W[k.id]=1}}
const OLD_CAMP_Q=["vn","vn","th","jp","kr","en","de","es","pt","ar"];

/* ================== PHỤ BẢN: các giải đấu loại trực tiếp ==================
   Thua (hoặc thua luân lưu) là bị loại, đá lại từ vòng đầu. Vô địch giải trước mới mở giải sau. */
const CUPS=[
 {id:"vl",n:"V.League Cup",c:"#dc2626",sub:"Cúp quốc gia Việt Nam",rounds:[["Tứ kết",{club:"vn_hp",ov:120}],["Bán kết",{club:"vn_slna",ov:150}],["Chung kết",{club:"vn_tc",ov:180}]],rw:{gold:30000,phieu:20,the:1},drop:"mu1"},
 {id:"asean",n:"ASEAN Cup",c:"#0ea5e9",sub:"Đông Nam Á",rounds:[["Tứ kết",{q:"id",t:1,kt:48,ov:200}],["Bán kết",{q:"my",t:1,kt:56,ov:230}],["Chung kết",{q:"th",t:2,kt:44,ov:260}]],rw:{gold:50000,phieu:30,the:1},drop:"giay1"},
 {id:"nl",n:"Nations League",c:"#7c3aed",sub:"Giải các quốc gia châu Âu",rounds:[["Tứ kết",{q:"be",t:2,kt:56,ov:280}],["Bán kết",{q:"nl",t:3,kt:54,ov:310}],["Chung kết",{q:"hr",t:3,kt:60,ov:340}]],rw:{gold:80000,phieu:40,the:2},drop:"ao1"},
 {id:"euro",n:"Euro",c:"#1d4ed8",sub:"Vô địch châu Âu",rounds:[["Vòng 1/8",{q:"de",t:4,kt:56,ov:360}],["Tứ kết",{q:"pt",t:3,kt:62,ov:390}],["Bán kết",{q:"en",t:4,kt:62,ov:420}],["Chung kết",{q:"es",t:4,kt:68,ov:450}]],rw:{gold:120000,phieu:60,the:2,xu:100},drop:"giay2"},
 {id:"wc",n:"World Cup",c:"#ca8a04",sub:"Đỉnh cao bóng đá thế giới",rounds:[["Vòng 1/8",{q:"jp",t:5,kt:72,ov:460}],["Tứ kết",{q:"fr",t:4,kt:66,ov:490}],["Bán kết",{q:"br",t:5,kt:58,ov:520}],["Chung kết",{q:"ar",t:5,kt:74,ov:560}]],rw:{gold:200000,phieu:100,the:3,xu:300},drop:"dh2"}];
const cupSt=id=>{const c=club();c.cups=c.cups||{};return c.cups[id]=c.cups[id]||{r:0,champ:0}};
const cupOpen=i=>i===0||cupSt(CUPS[i-1].id).champ>0;
// đội tuyển quốc gia: các ngôi sao thật (không gồm Icon) của nước đó + cầu thủ cùng nước
function nationTeam(q,t,kt,ov){const named=STARS.filter(s=>s[3]===q&&s[2]<6).sort((a,b)=>b[2]-a[2]).map(s=>s[0]).filter((n,i,a)=>a.indexOf(n)===i).slice(0,9);
  return buildSquad(`ĐT ${NATIONS[q]?NATIONS[q].n:q}`,q,named,t,kt,hashN(q)%997,"#1f2937","cup",ov)}
const cupOpp=(cup,r)=>{const o=cup.rounds[r][1];return o.club?clubTeam(CLUB_BY[o.club],o.ov):nationTeam(o.q,o.t,o.kt,o.ov)};
const cupOppName=(cup,r)=>{const o=cup.rounds[r][1];return o.club?CLUB_BY[o.club].n:`ĐT ${NATIONS[o.q].n}`};
// đá luân lưu khi hòa ở giải loại trực tiếp: Phạt đền của 5 người sút tốt nhất vs Cứu bóng thủ môn
function shootout(A,B){const sh=t=>t.players.filter(p=>roleOf(p)!=="TM").map(p=>p.pden).sort((a,b)=>b-a).slice(0,5),gk=t=>(t.players.find(p=>roleOf(p)==="TM")||t.players[0]).cuu;
  const sA=sh(A),sB=sh(B);let a=0,b=0;const pr=(s,g)=>clamp(0.75+(s-g)/1600,0.55,0.92);
  for(let i=0;i<5;i++){if(Math.random()<pr(sA[i],gk(B)))a++;if(Math.random()<pr(sB[i],gk(A)))b++}
  let k=0;while(a===b&&k<20){const x=Math.random()<pr(sA[k%5],gk(B)),y=Math.random()<pr(sB[k%5],gk(A));a+=x;b+=y;k++}return[a,b]}

/* ---------- quả địa cầu (canvas, tự vẽ, không cần thư viện) ---------- */
// lục địa vẽ giản lược bằng các điểm [kinh độ, vĩ độ], hiển thị dạng chấm
const LAND=[
 [[-168,66],[-162,70],[-156,71.5],[-140,70],[-128,70],[-115,68.5],[-95,69],[-85,70],[-80,63],[-94,60],[-93,57],[-82,55],[-79,51.5],[-77,58],[-70,61],[-64,60],[-61,56],[-56,52],[-59,48],[-66,45],[-70,43],[-74,40.5],[-76,37],[-76,35],[-81,31],[-80,26],[-81,25],[-83,29],[-90,30],[-97,28],[-97,22],[-94,18.5],[-91,19],[-87,21.5],[-88,16],[-84,15],[-83,10],[-79.5,9],[-77,8],[-80,7.5],[-85,10],[-92,14.5],[-105,20],[-110,24],[-114,30],[-117,32.5],[-121,35],[-124,40],[-124,46],[-123,49],[-130,55],[-136,58.5],[-140,60],[-148,60],[-153,57.5],[-158,56.5],[-163,55],[-158,58],[-162,60],[-165,62.5],[-164,64.5]],
 [[-73,78],[-60,82],[-35,83.5],[-20,82],[-18,77],[-20,70],[-26,68],[-40,65],[-43,60],[-48,61],[-52,65],[-54,69],[-58,75],[-66,76.5]],
 [[-80,9],[-75,11],[-71,12],[-63,10.5],[-60,8],[-52,5],[-50,0],[-44,-2],[-35,-5],[-35,-9],[-39,-13],[-39,-18],[-41,-22],[-48,-26],[-49,-29],[-53,-34],[-58,-34.5],[-57,-38],[-62,-39],[-65,-42],[-65,-47],[-68,-50],[-69,-52],[-68,-55],[-71,-54],[-74,-51],[-75,-46],[-73,-40],[-71.5,-30],[-70.5,-20],[-71,-18],[-76,-14],[-80,-7],[-81,-4],[-80,0],[-78.5,3],[-77,7]],
 [[-9,43],[-9,39],[-9,37],[-6,36.5],[-2,36.8],[0,39],[3,42],[3,43.3],[7,43.7],[9,44.3],[12,42],[16,38],[16,40],[18.5,40.2],[16,41.5],[13,45.5],[15,45],[19.5,42],[20,40],[23,36.5],[23.5,38],[26,40],[27,37],[30,36.3],[36,36.6],[35.8,35],[35,33],[34.5,31.5],[32.5,30],[34.5,28],[39,21.5],[43,13],[45,13],[52,16],[58,22],[56,26],[52,24],[50,26],[48,30],[50,30],[56,27],[62,25],[67,24.5],[70,21],[73,16],[77,8],[80,10],[80,15],[86,20],[90,22],[92,22],[94,17],[98,16],[98,8],[100.5,4],[104,1.3],[103,5],[101,7],[100,13],[103,12.5],[105,9],[109,11.5],[106,20.5],[108,21.5],[112,21.5],[117,23],[120,26],[122,30],[121,32],[119,35],[122,37],[118,38],[119,40],[122,40.5],[125,40],[126.5,37.5],[126.5,34.5],[129,35],[129.5,38],[128,40],[130,42.5],[133,43],[138,46],[141,48.5],[141,52],[137,54],[135,55],[141,59],[150,59.5],[155,59],[156,52],[163,56],[162,58],[170,60],[180,65],[180,69],[170,70],[160,70],[150,72],[140,72],[130,71],[115,73],[105,77],[95,76],[85,74],[80,73],[70,73],[68,69],[60,69],[53,68.5],[45,68],[40,67],[35,69],[30,70],[25,71],[18,70],[14,68],[12,65],[8,63],[5,61],[5,59],[7,58],[10,59],[11,58],[12,56],[13,55.5],[16,56],[18,59],[17,61],[19,63.5],[22,65.5],[25,65],[22,63],[21,61],[23,60],[30,60],[26,57.5],[21,57],[21,55],[14,54],[10,54.5],[8.5,55.5],[8,57],[10,57.5],[10.5,56],[9,54],[8.5,53.5],[5,53.5],[3.5,51.5],[1.5,51],[-1.5,49.5],[-4.5,48.5],[-1.5,46.5],[-1.5,43.5]],
 [[-17,21],[-16,24],[-13,27.5],[-10,30],[-9.5,32],[-6,35.8],[0,35.8],[10,37],[11,35],[10,33.5],[15,32],[20,31],[20,32.5],[25,32],[29,31],[32.5,31.5],[34,29.5],[33,27],[36,22],[38,18],[43,12],[51,12],[49,8],[42,0],[40,-3],[39,-7],[40,-11],[40.5,-15],[35,-20],[35.5,-24],[32.5,-26],[32,-29],[28,-33],[22,-34.5],[18,-34],[17,-30],[15,-26.5],[12,-18],[13.5,-12],[12,-6],[9,-1],[9.5,3.5],[6,4.3],[3,6.3],[-2,5],[-7.5,4.4],[-11,6.8],[-13.5,9.5],[-15,11],[-17,14.5]],
 [[49,-12],[50.5,-15.5],[47,-25],[44,-24.5],[43.5,-21],[44.5,-16],[47,-14]],
 [[114,-22],[114,-26],[115,-34],[118,-35],[124,-33.8],[130,-31.5],[135,-34.5],[138,-35.5],[140,-38],[146,-39],[150,-37.5],[153,-32],[153,-25],[150,-22],[146,-19],[145,-15],[142.5,-10.7],[141.5,-13],[141,-17],[136,-15],[137,-12],[132,-11],[130,-13],[127,-14],[122,-17],[120,-20]],
 [[-5.5,50],[1.5,51],[1.7,52.7],[0,53.5],[-1.5,55],[-2,57],[-1.8,57.6],[-4,58.6],[-5,58.6],[-6.2,56.5],[-4.8,55],[-3,54],[-4.5,53.3],[-5,51.7]],
 [[-10,51.6],[-6,52],[-6,54],[-8,55.2],[-10,54]],
 [[130,31],[132,34],[135,33.5],[140,35],[141,38],[141.5,41.5],[140,40],[139,38],[137,37],[134,35.5],[131,34.5]],
 [[140,41.8],[143,42],[145.5,43.3],[141.5,45.4],[140,43.3]],
 [[95.5,5.5],[98,3.5],[104,-2],[106,-6],[104,-5.8],[101,-2],[96,2]],
 [[105.5,-6.8],[114.5,-7.7],[114.5,-8.6],[106,-7.5]],
 [[109,2],[111,1.5],[114,4.5],[117,7],[119,5],[118,1],[116,-4],[111,-3],[109.5,-1]],
 [[119.5,-5.5],[120.5,1],[124.5,1.5],[121.5,-1],[123,-5.5]],
 [[131,-1],[138,-1.5],[145,-4],[150.5,-10.5],[147,-10.2],[141,-9],[138,-8.3],[134.5,-4]],
 [[120,18.5],[122,18.5],[122.5,14],[124,13],[126,9],[126,7],[122,7],[123.5,10],[121,13.7],[120,14.5]],
 [[120,22],[121,25],[122,25],[121,22]],[[80,6],[81.8,7.5],[80,9.8],[79.7,8]],
 [[172.7,-34.5],[178.5,-37.7],[176.8,-40],[174.8,-41.4],[172,-40.5],[174,-38]],
 [[172.7,-40.5],[174.3,-41.7],[172.5,-43.7],[171,-45.9],[167,-46.3],[166.5,-45.5],[170,-43]],
 [[-24,65.5],[-22,66.5],[-15,66.5],[-13.5,65],[-18,63.4],[-22.5,63.8]],
 [[-85,22],[-80,23.2],[-74,20],[-77.5,19.8]]];
const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
let LAND_DOTS=null;
function landDots(){if(LAND_DOTS)return LAND_DOTS;const D=[],bb=LAND.map(P=>{const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);return[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)]});
  for(let la=-56;la<=82;la+=1.6){const st=1.6/Math.max(.25,Math.cos(la*Math.PI/180));for(let lo=-180;lo<180;lo+=st)if(LAND.some((P,i)=>lo>=bb[i][0]&&lo<=bb[i][1]&&la>=bb[i][2]&&la<=bb[i][3]&&inPoly(lo,la,P)))D.push([lo,la])}
  return LAND_DOTS=D}
const GLOBE={rot:[-100,-18],vel:0,drag:null,sel:null,raf:0,anim:null,hover:null};
function globeProject(lo,la,R,cx,cy){const r=Math.PI/180,l=(lo+GLOBE.rot[0])*r,p=la*r,p0=-GLOBE.rot[1]*r;
  const x=Math.cos(p)*Math.sin(l),y=Math.cos(p0)*Math.sin(p)-Math.sin(p0)*Math.cos(p)*Math.cos(l),z=Math.sin(p0)*Math.sin(p)+Math.cos(p0)*Math.cos(p)*Math.cos(l);
  return[cx+R*x,cy-R*y,z]}
function globeDraw(cv){const g=cv.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;
  if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  const R=Math.min(W,H)*0.42,cx=W/2,cy=H/2;
  const halo=g.createRadialGradient(cx,cy,R*0.9,cx,cy,R*1.25);halo.addColorStop(0,"rgba(198,255,61,.18)");halo.addColorStop(1,"rgba(198,255,61,0)");g.fillStyle=halo;g.beginPath();g.arc(cx,cy,R*1.25,0,7);g.fill();
  const sea=g.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);sea.addColorStop(0,"#1f4d3a");sea.addColorStop(1,"#071510");g.fillStyle=sea;g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
  g.strokeStyle="rgba(143,167,151,.16)";g.lineWidth=1;
  for(let lo=-180;lo<180;lo+=30){g.beginPath();let on=false;for(let la=-80;la<=80;la+=4){const [x,y,z]=globeProject(lo,la,R,cx,cy);if(z>0){on?g.lineTo(x,y):g.moveTo(x,y);on=true}else on=false}g.stroke()}
  for(let la=-60;la<=60;la+=30){g.beginPath();let on=false;for(let lo=-180;lo<=180;lo+=4){const [x,y,z]=globeProject(lo,la,R,cx,cy);if(z>0){on?g.lineTo(x,y):g.moveTo(x,y);on=true}else on=false}g.stroke()}
  for(const [lo,la] of landDots()){const [x,y,z]=globeProject(lo,la,R,cx,cy);if(z<=0.02)continue;g.fillStyle=`rgba(198,240,205,${0.35+0.6*z})`;const s=Math.max(1.2,R/110)*(0.65+0.45*z);g.fillRect(x-s/2,y-s/2,s,s)}
  const W2=cityWon();GLOBE.pins=[];
  for(const C of CITY){const [x,y,z]=globeProject(C.ll[0],C.ll[1],R,cx,cy);if(z<=0.05)continue;
    const won=C.clubs.filter(k=>W2[k.id]).length,all=C.clubs.length,sel=GLOBE.sel===C.q,hov=GLOBE.hover===C.q,r0=sel?9:hov?8:6;
    const done=won===all;g.globalAlpha=0.35+0.65*z;
    g.fillStyle=done?"#ffcf4a":"#c6ff3d";g.beginPath();g.arc(x,y,r0+4+2*Math.sin(Date.now()/300+C.ll[0]),0,7);g.globalAlpha*=.25;g.fill();g.globalAlpha=0.35+0.65*z;
    g.beginPath();g.arc(x,y,r0,0,7);g.fill();g.lineWidth=2;g.strokeStyle="#08110d";g.stroke();
    if(z>0.35&&(sel||hov)){g.font=`700 ${sel?13:11}px "Barlow Condensed","Arial Narrow",sans-serif`;g.textAlign="center";g.fillStyle="#08110dcc";const tw=g.measureText(NATIONS[C.q].n).width;g.fillRect(x-tw/2-5,y+r0+4,tw+10,16);g.fillStyle=sel?"#c6ff3d":"#eef5f0";g.fillText(NATIONS[C.q].n,x,y+r0+16)}
    g.globalAlpha=1;GLOBE.pins.push({q:C.q,x,y,r:r0+6})}
  const sh=g.createRadialGradient(cx-R*.4,cy-R*.45,0,cx-R*.4,cy-R*.45,R*1.2);sh.addColorStop(0,"rgba(255,255,255,.10)");sh.addColorStop(.5,"rgba(255,255,255,0)");g.fillStyle=sh;g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
  g.strokeStyle="rgba(198,255,61,.35)";g.lineWidth=1.5;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke()}
function globeLoop(){const cv=document.getElementById("cityGlobe");if(!cv||!cv.isConnected||document.getElementById("thanhpho").hidden){GLOBE.raf=0;return}
  if(GLOBE.anim){const a=GLOBE.anim,k=Math.min(1,(performance.now()-a.t0)/650),e=1-Math.pow(1-k,3);GLOBE.rot=[a.from[0]+(a.to[0]-a.from[0])*e,a.from[1]+(a.to[1]-a.from[1])*e];if(k>=1)GLOBE.anim=null}
  else if(!GLOBE.drag){GLOBE.rot[0]+=GLOBE.vel;GLOBE.vel*=0.95;if(Math.abs(GLOBE.vel)<0.02&&!matchMedia("(prefers-reduced-motion: reduce)").matches)GLOBE.rot[0]+=0.04}
  globeDraw(cv);GLOBE.raf=requestAnimationFrame(globeLoop)}
function globeFocus(q){const C=CITY.find(x=>x.q===q);if(!C)return;let tx=-C.ll[0];const cur=GLOBE.rot[0];while(tx-cur>180)tx-=360;while(tx-cur<-180)tx+=360;GLOBE.anim={t0:performance.now(),from:GLOBE.rot.slice(),to:[tx,clamp(-C.ll[1]*0.8,-40,40)]}}
function globeBind(cv){
  const pt=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  const hit=(x,y)=>(GLOBE.pins||[]).find(p=>Math.hypot(p.x-x,p.y-y)<=p.r);
  cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);GLOBE.anim=null;const [x,y]=pt(e);GLOBE.drag={x,y,x0:x,y0:y,t:performance.now()};GLOBE.vel=0};
  cv.onpointermove=e=>{const [x,y]=pt(e);if(GLOBE.drag){const d=GLOBE.drag,k=180/Math.min(cv.clientWidth,cv.clientHeight);GLOBE.vel=(x-d.x)*k*0.6;GLOBE.rot[0]+=(x-d.x)*k;GLOBE.rot[1]=clamp(GLOBE.rot[1]+(y-d.y)*k,-60,60);d.x=x;d.y=y}
    else{const h=hit(x,y);GLOBE.hover=h?h.q:null;cv.style.cursor=h?"pointer":"grab"}};
  cv.onpointerup=e=>{const d=GLOBE.drag;GLOBE.drag=null;if(!d)return;const [x,y]=pt(e);if(Math.hypot(x-d.x0,y-d.y0)<6){const h=hit(x,y);if(h)citySelect(h.q)}};
  cv.onpointercancel=()=>{GLOBE.drag=null}}

/* ---------- cửa sổ Thành Phố ---------- */
function citySelect(q){GLOBE.sel=q;globeFocus(q);try{localStorage.setItem("cityQ",q)}catch(e){}renderCityList()}
function renderCity(){cityMigrate();const el=document.getElementById("thanhpho");
  if(!GLOBE.sel){let q="vn";try{q=localStorage.getItem("cityQ")||"vn"}catch(e){}GLOBE.sel=CITY.some(x=>x.q===q)?q:"vn";const C=CITY.find(x=>x.q===GLOBE.sel);GLOBE.rot=[-C.ll[0],clamp(-C.ll[1]*0.8,-40,40)]}
  const W=cityWon(),tot=CITY.reduce((s,C)=>s+C.clubs.length,0),won=Object.keys(W).filter(k=>CLUB_BY[k]).length;
  el.innerHTML=`<div class="cty"><div class="cty-g"><div class="cty-gh"><div><small>Bản đồ bóng đá</small><b>${won}/${tot} câu lạc bộ đã chinh phục</b></div><span>Kéo để xoay · bấm chấm sáng để chọn nước</span></div>
    <canvas id="cityGlobe" aria-label="Quả địa cầu: chọn quốc gia để xem các câu lạc bộ"></canvas>
    <div class="cty-ch" role="tablist" aria-label="Quốc gia">${CITY.map(C=>{const w=C.clubs.filter(k=>W[k.id]).length;return`<button type="button" role="tab" data-cq="${C.q}" class="${C.q===GLOBE.sel?"on":""}${w===C.clubs.length?" done":""}"><u class="fc-flag">${flagSvg(C.q)}</u>${NATIONS[C.q].n}<small>${w}/${C.clubs.length}</small></button>`}).join("")}</div></div>
    <div class="cty-l" id="cityList"></div></div>`;
  el.querySelectorAll("[data-cq]").forEach(b=>b.onclick=()=>citySelect(b.dataset.cq));
  const cv=document.getElementById("cityGlobe");globeBind(cv);renderCityList();if(!GLOBE.raf)GLOBE.raf=requestAnimationFrame(globeLoop)}
function renderCityList(){const el=document.getElementById("cityList");if(!el)return;const C=CITY.find(x=>x.q===GLOBE.sel)||CITY[0],W=cityWon(),my=r1(avg(T.home.players.map(overall)));
  document.querySelectorAll("#thanhpho [data-cq]").forEach(b=>b.classList.toggle("on",b.dataset.cq===C.q));
  const L=cityClubs(C);
  el.innerHTML=`<div class="cty-hd"><u class="fc-flag">${flagSvg(C.q)}</u><div><h3>${NATIONS[C.q].n}</h3><span>${C.lg} · ${L.length} câu lạc bộ · Đội bạn ${my}</span></div></div>
   <p class="cty-tip">Thắng một câu lạc bộ để đưa cầu thủ của họ vào Môi giới. Lần thắng đầu được tiến cử ngay 1 cầu thủ.</p>
   <ol class="cty-cl">${L.map((k,i)=>{const w=!!W[k.id],open=clubOpen(C,k),ov=clubOv(k),diff=ov-my;
     return`<li class="${w?"won":open?"open":"lock"}"><i class="cty-n" style="--cc:${k.c}">${i+1}</i><div class="cty-ci"><b>${k.n}</b>
      <span class="cty-ov">Thực lực ${ov} <em class="${diff>15?"hard":diff>0?"mid":"easy"}">${diff>15?"Rất khó":diff>0?"Khó":"Vừa sức"}</em></span>
      <span class="cty-ps">${k.p.map(n=>{const s=STAR_OF(n);return`<span class="cty-p t${s[2]}" title="${TIERS[s[2]].n}">${n}</span>`}).join("")}</span>
      <span class="cty-rw">${w?"Đã thắng · cầu thủ đã vào Môi giới":`Thưởng lần đầu: ${rwTxt(cityReward(k))} + tiến cử 1 cầu thủ`}</span></div>
      ${open?`<button type="button" class="${w?"":"pri"}" data-club="${k.id}">${w?"Đá lại":"Khiêu chiến"}</button>`:`<span class="cty-lk">Thắng ${L[i-1].n} để mở</span>`}</li>`}).join("")}</ol>`;
  el.querySelectorAll("[data-club]").forEach(b=>b.onclick=()=>{const k=CLUB_BY[b.dataset.club];startMatch(clubTeam(k),{type:"city",club:k.id})})}

/* ---------- cửa sổ Giải đấu (giải đấu) ---------- */
// cửa sổ Giải đấu: banner lớn của giải đang chọn + chi tiết các vòng, hàng ảnh nhỏ để chuyển giải
const CUP_IMG=id=>`assets/ui/cups/${id}.webp`;let CUPSEL=null;
function renderCups(){const el=document.getElementById("phuban"),my=r1(avg(T.home.players.map(overall)));
  if(!CUPSEL||!CUPS.some(x=>x.id===CUPSEL))CUPSEL=cupNext().id;
  const i=CUPS.findIndex(x=>x.id===CUPSEL),cup=CUPS[i],s=cupSt(cup.id),open=cupOpen(i);
  const RW_I={gold:"vang",phieu:"phieu",xu:"xu"},rwChips=r=>Object.entries(r).filter(([,v])=>v).map(([k,v])=>`<span class="cx-rw">${RW_I[k]&&typeof CUR_IMG!=="undefined"&&CUR_IMG[RW_I[k]]?`<img src="${CUR_IMG[RW_I[k]]}" alt="">`:""}<b>${fmt(v)}</b> ${{gold:"vàng",phieu:"phiếu",xu:"xu",the:"thẻ cầu thủ",bh:"bảo hiểm"}[k]}</span>`).join("");
  el.innerHTML=`<div class="cx">
   <div class="cx-main">
    <div class="cx-ban ${open?"":"lock"}${s.champ?" champ":""}" style="--cc:${cup.c}"><img src="${CUP_IMG(cup.id)}" alt="${cup.n}">
      ${s.champ?`<em class="cx-cs">Vô địch ×${s.champ}</em>`:""}${open?"":`<div class="cx-lock"><b>Chưa mở</b><span>Vô địch ${CUPS[i-1].n} để mở giải này</span></div>`}
      <ol class="cx-steps">${cup.rounds.map(([rn],r)=>`<li class="${r<s.r?"d":r===s.r&&open?"c":""}"><i></i><span>${rn}</span></li>`).join("")}<li class="${s.champ?"d":""}"><i></i><span>Vô địch</span></li></ol></div>
    <div class="cx-side">
     <div class="cx-hd"><small>${cup.sub}</small><h3>${cup.n}</h3><span>Đội bạn <b>${my}</b></span></div>
     <ol class="cx-r">${cup.rounds.map(([rn],r)=>{const ov=r1(avg(cupOpp(cup,r).players.map(overall)));return`<li class="${r<s.r?"d":r===s.r&&open?"c":""}"><small>${rn}</small><b>${cupOppName(cup,r)}</b><span class="${ov-my>15?"hard":ov>my?"mid":"easy"}">${ov}</span></li>`}).join("")}</ol>
     <div class="cx-rws"><small>Thưởng vô địch${s.champ?" (lần sau)":""}</small><div>${rwChips(s.champ?cupRepeat(cup):cup.rw)}${!s.champ&&cup.drop&&ITEMS[cup.drop]?`<span class="cx-rw"><b>${ITEMS[cup.drop].n}</b></span>`:""}</div></div>
     ${open?`<button type="button" class="pri cx-go" data-cup="${cup.id}">${s.r?"Đá tiếp":"Bắt đầu"} · ${cup.rounds[s.r][0]}</button>`:`<span class="cty-lk cx-lk">Vô địch ${CUPS[i-1].n} để mở</span>`}
     <p class="cx-note">Thua là bị loại, đá lại từ vòng đầu. Hòa thì đá luân lưu.</p></div></div>
   <div class="cx-th" role="tablist" aria-label="Chọn giải đấu">${CUPS.map((c,j)=>{const st=cupSt(c.id),op=cupOpen(j);return`<button type="button" role="tab" aria-selected="${c.id===CUPSEL}" class="${c.id===CUPSEL?"on":""} ${op?"":"lock"}" data-cupsel="${c.id}" style="--cc:${c.c}"><img src="${CUP_IMG(c.id)}" alt=""><span><b>${c.n}</b><small>${!op?"Chưa mở":st.champ?`Vô địch ×${st.champ}`:st.r?`Đang ở ${c.rounds[st.r][0]}`:"Sẵn sàng"}</small></span></button>`}).join("")}</div></div>`;
  el.querySelectorAll("[data-cupsel]").forEach(b=>b.onclick=()=>{CUPSEL=b.dataset.cupsel;renderCups()});
  el.querySelectorAll("[data-cup]").forEach(b=>b.onclick=()=>cupPlay(b.dataset.cup))}
const cupRepeat=cup=>({gold:Math.round(cup.rw.gold/4),phieu:Math.round(cup.rw.phieu/4)});
function cupPlay(id){const i=CUPS.findIndex(x=>x.id===id),cup=CUPS[i];if(!cupOpen(i))return;const s=cupSt(id);startMatch(cupOpp(cup,s.r),{type:"cup",cup:id,round:s.r})}
// giải đang đá dở hoặc giải tiếp theo chưa vô địch (cho ô Thi đấu ở sảnh)
function cityNext(){const W=cityWon();let best=null;for(const C of CITY)for(const k of cityClubs(C))if(!W[k.id]&&clubOpen(C,k)&&(!best||clubOv(k)<clubOv(best)))best=k;return best}
function heroNext(){const my=avg(T.home.players.map(overall)),cup=cupNext(),s=cupSt(cup.id),cov=cup.rounds[s.r][1].ov||0,k=cityNext();
  if(k&&my<cov*0.85)return{kind:"city",k,team:clubTeam(k),label:`Thành Phố · ${NATIONS[k.q].n}`,sub:`${CITY.find(C=>C.q===k.q).lg} · thắng để mở cầu thủ của họ`,prog:null};
  return{kind:"cup",cup,s,team:cupOpp(cup,s.r),label:`${cup.n} · ${cup.rounds[s.r][0]}${s.champ?` · đã vô địch ${s.champ} lần`:""}`,sub:`${cup.sub} · thua là bị loại`,prog:cup.rounds.map((_,i)=>i<s.r?"d":i===s.r?"c":"")}}
function cupNext(){for(let i=0;i<CUPS.length;i++){if(!cupOpen(i))return CUPS[i-1];const s=cupSt(CUPS[i].id);if(s.r||!s.champ)return CUPS[i]}return CUPS[CUPS.length-1]}

// kết quả trận Thành Phố / Giải đấu (gọi trong onMatchEnd)
function cityCupEnd(ctx,won,draw){const c=club();
  if(ctx.type==="city"){const k=CLUB_BY[ctx.club],W=cityWon();
    if(won&&!W[k.id]){W[k.id]=1;const r=cityReward(k);give(r);cityScout(k,true);news(`${c.mgr.name} đánh bại ${k.n}! Cầu thủ của ${k.n} đã có mặt ở Môi giới. Thưởng ${rwTxt(r)}.`);toast(`Thắng ${k.n}: +${rwTxt(r)}`)}
    else if(won){const r={gold:Math.round(cityReward(k).gold/4)};give(r);cityScout(k,false);toast(`Thắng lại ${k.n}: +${rwTxt(r)}`)}
    else toast(draw?`Hòa ${k.n} – chưa chinh phục được.`:`Thua ${k.n} – nâng cấp đội hình rồi thử lại nhé!`);return}
  if(ctx.type==="cup"){const cup=CUPS.find(x=>x.id===ctx.cup),s=cupSt(cup.id),rn=cup.rounds[ctx.round][0];
    if(ctx.round!==s.r)return;let pass=won;
    if(draw){const [a,b]=shootout(T.home,T.away);pass=a>b;news(`${cup.n} · ${rn}: hòa ${M.score.join("-")}, luân lưu ${a}-${b}${pass?", đi tiếp!":", bị loại."}`);toast(`Luân lưu ${a}-${b}: ${pass?"đi tiếp!":"bị loại"}`)}
    if(!pass){s.r=0;if(!draw)toast(`Bị loại ở ${rn} ${cup.n}. Đá lại từ vòng đầu nhé!`);return}
    s.r++;give({gold:1500*(CUPS.indexOf(cup)+1)});
    if(s.r>=cup.rounds.length){s.r=0;const first=!s.champ;s.champ++;const r=first?cup.rw:cupRepeat(cup);give(r);
      if(first&&cup.drop&&window.addItem&&ITEMS[cup.drop]){addItem(cup.drop,1,true);setTimeout(()=>toast(`Rơi vật phẩm: ${ITEMS[cup.drop].n} (xem Rương → Tạm thời)`),2800)}
      flag("cup_"+cup.id);news(`${T.home.name} VÔ ĐỊCH ${cup.n}! Thưởng ${rwTxt(r)}.`);toast(`Vô địch ${cup.n}! +${rwTxt(r)}`)}
    else toast(`Thắng ${rn}! Vào ${cup.rounds[s.r][0]} ${cup.n}.`)}}
const MAXSQ=25,HIRE_FEE=[3000,8000,25000,70000,180000,450000,1200000],ODDS=[46,30,14,7,2.5,0.5,0.05];
const TCOL=["#4b5563","#15803d","#1d4ed8","#7e22ce","#b45309","#dc2626","#a1782a"]; // màu chữ bậc trên nền sáng
if(document.documentElement.classList.contains("fifa"))TCOL.splice(0,7,"#d6d9de","#3ddc84","#5aa9ff","#c58bff","#ffcf4a","#ff5a52","#f3d98a");
const TROLY=typeof TROLY_SRC!=="undefined"?TROLY_SRC:"";
function dayStat(){const c=club(),d=new Date().toDateString();
  if(!c.day||c.day.d!==d){c.day={d,m:0,w:0,s:0};for(const k of Object.keys(c.claimed))if(k.includes("@"))delete c.claimed[k]}return c.day}
function brokerState(){const c=club();c.broker=c.broker||{q:"all",list:[]};return c.broker}
function unlockedQ(){cityMigrate();const W=cityWon(),s=new Set(["vn"]);CITY.forEach(C=>{if(C.clubs.some(k=>W[k.id]))s.add(C.q)});return s}
function natFix(){let S;try{S=STARS}catch(e){return}for(const p of squad(T.home).concat(squad(T.away))){const s=S.find(x=>x[0]===p.n&&x[2]===p.tier)||S.find(x=>x[0]===p.n);if(s&&p.q!==s[3])p.q=s[3];
  if(p.tier===6&&p.potV!==2&&s){const f=mk(p.n,s[1],6,s[4]||"P",0);for(const [k] of ATTR){const o=p.pot[k]||1;p.base[k]=r1(Math.min(f.pot[k],p.base[k]*f.pot[k]/o));if(p.starB[k])p.starB[k]=r1(p.starB[k]*f.pot[k]/o);p.pot[k]=f.pot[k]}p.potV=2;refresh(p)} // save cũ: áp dụng quy tắc GOAT
  const want=skillsFor(p.n,p.tier);const has=(p.skills||[]).map(x=>x.id+"@"+x.star).sort().join(),need=want.map(x=>x.id+"@"+x.star).sort().join();if(want.length&&has!==need)p.skills=want}} // cầu thủ có tên thật luôn đúng quốc tịch (vd Ronaldo → Bồ Đào Nha)
function rollTier(boost,noIcon){const w=ODDS.map((v,i)=>i===6?(noIcon?0:v*boost):i>=3?v*boost:v),sum=w.reduce((a,b)=>a+b);let r=Math.random()*sum;for(let i=0;i<w.length;i++)if((r-=w[i])<0)return i;return 0}
function rollPlayer(q,boost,taken,noIcon){const t=rollTier(boost,noIcon),pick=a=>a[Math.floor(Math.random()*a.length)];
  let pool=STARS.filter(s=>s[2]===t&&(q==="all"||s[3]===q)&&!taken.has(s[0])&&starOpen(s));let name,pos,nat,chan;
  if(t===6&&!pool.length)return rollPlayer(q,boost,taken,true); // Icon chỉ là cầu thủ có tên thật; không có thì tìm lại (không tính tỉ lệ Icon)
  if(pool.length&&(t>=2||rnd()<0.35)){[name,pos,,nat,chan="P"]=pick(pool)} // cầu thủ có tên thật (bậc thấp cũng có, ít hơn)
  else{nat=q==="all"?pick(RAND_NAT):(RAND_NAT.includes(q)?q:"vn");pos=pick(["TM","HV","HV","HVC","TV","TV","TVC","TĐ","TĐ"]);chan=Math.random()<.25?"T":"P";
    let n=0;do name=nameAt(nat,Math.floor(Math.random()*99999))+(++n>40?" "+n:"");while(taken.has(name))}
  taken.add(name);const p=mk(name,pos,t,chan,0);p.q=nat;p.fee=HIRE_FEE[t];return p} // cầu thủ tuyển về: chưa kích thích lần nào (0/10, 30%)
function takenNames(){const s=new Set(squad(T.home).map(p=>p.n));brokerState().list.forEach(p=>s.add(p.n));return s}
function brokerSearch(pay){const b=brokerState(),c=club(),cost=b.q==="all"?200:500;
  if(pay){if((c.gold||0)<cost){toast(`Không đủ ${fmt(cost)} vàng để tìm.`);return false}c.gold-=cost;dayStat().s++}
  const rec=b.list.filter(p=>p.rec).slice(0,2);b.list=rec;const taken=takenNames();
  for(let i=0;i<4;i++)b.list.push(rollPlayer(b.q,b.q==="all"?1:2,taken));return true}
function scoutDrop(stage,first){if(!first&&Math.random()>=.3)return;const q=CAMPAIGN[stage].q,b=brokerState();
  const p=rollPlayer(q,3,takenNames());p.rec=1;b.list=[p,...b.list.filter(x=>x.rec).slice(0,1),...b.list.filter(x=>!x.rec)].slice(0,6);
  news(`Môi giới tiến cử ${p.n} (${TIERS[p.tier].n}, ${NATIONS[q].n}). Vào Môi giới để tuyển dụng.`);setTimeout(()=>toast(`Môi giới tiến cử: ${p.n} (${TIERS[p.tier].n})`),5600)}
function hire(i){const b=brokerState(),c=club(),p=b.list[i];if(!p)return;
  if(squad(T.home).length>=MAXSQ){toast(`Đội đã đủ ${MAXSQ} cầu thủ.`);return}
  if((c.gold||0)<p.fee){toast(`Không đủ ${fmt(p.fee)} vàng để tuyển ${p.n}.`);return}
  c.gold-=p.fee;b.list.splice(i,1);delete p.fee;delete p.rec;(T.home.subs=T.home.subs||[]).push(p);refresh(p);applyLineup(T.home);
  const f=c.flags;f.hire=(f.hire||0)+1;f.hireTop=Math.max(f.hireTop??-1,p.tier);
  if(p.tier>=3)news(`${c.mgr.name} chiêu mộ thành công ${p.n} (${TIERS[p.tier].n})!`);
  toast(`Đã tuyển ${p.n}. Cầu thủ vào danh sách dự bị, vào Đội để xếp đá chính.`);render();saveLocal();renderBroker()}
function renderBroker(){const b=brokerState(),c=club(),un=unlockedQ(),el=document.getElementById("broker");
  if(!un.has(b.q)&&b.q!=="all")b.q="all";if(!b.list.length)brokerSearch(false);const cost=b.q==="all"?200:500;
  el.innerHTML=`<div class="bk"><div class="bkm">
   <div class="bkq" role="group" aria-label="Thị trường tìm kiếm"><button class="${b.q==="all"?"on":""}" data-q="all">Toàn cầu</button>${Object.entries(NATIONS).map(([k,v])=>un.has(k)?`<button class="${b.q===k?"on":""}" data-q="${k}">${v.n}</button>`:`<button disabled title="Mở khi thắng 1 câu lạc bộ ở ${v.n} (Thành Phố)">🔒 ${v.n}</button>`).join("")}</div>
   <p class="wl">${b.q==="all"?"Tìm khắp các nước, 200 vàng mỗi lần.":`Chỉ tìm cầu thủ ${NATIONS[b.q].n}, 500 vàng mỗi lần, tỉ lệ ra bậc Tím/Vàng/Đỏ gấp đôi.`} Tỉ lệ cơ bản: ${ODDS.map((o,i)=>`<b style="color:${TCOL[i]}">${TIERS[i].n}</b> ${String(o).replace(".",",")}%`).join(" · ")}</p>
   <div class="bkw"><table class="bkt"><caption class="sr">Cầu thủ tìm được</caption><thead><tr><th>Tên cầu thủ</th><th>Quốc tịch</th><th>Vị trí</th><th>Th.lực</th><th>Max</th><th>Phí thuê</th><th>Thao tác</th></tr></thead><tbody>
   ${b.list.map((p,i)=>`<tr><td>${faceTag(p)}<b style="color:${TCOL[p.tier]}">${p.n}</b> <small>${TIERS[p.tier].n}</small>${p.rec?' <em class="rec">Tiến cử</em>':""}</td><td>${NATIONS[p.q]?NATIONS[p.q].n:""}</td><td>${POSN[p.pos]}</td><td>${r1(overall(p))}</td><td>${r1(overallMax(p))}</td><td>${fmt(p.fee)}</td><td><button class="lnk" data-hire="${i}">Tuyển dụng</button></td></tr>`).join("")||`<tr><td colspan="7">Chưa có ứng viên.</td></tr>`}
   </tbody></table></div>
   <div class="bkf"><span>Chưa có ứng viên phù hợp? Bạn có thể tốn ${fmt(cost)} vàng để tìm lần nữa.</span><button class="pri" id="bkAgain">Tìm lần nữa</button></div>
   <p class="wl">Đang có ${fmt(c.gold)} vàng · Đội ${squad(T.home).length}/${MAXSQ} cầu thủ.</p></div>
   <aside class="bkg">${TROLY?`<img src="${TROLY}" alt="">`:""}<div class="bkb"><b>Chỉ dẫn!</b><p>Tuyển cầu thủ cần tốn vàng, bậc càng cao phí càng đắt. Ngôi sao đang khoác áo câu lạc bộ (Haaland ở Man City, Mbappé ở Real Madrid…) chỉ xuất hiện sau khi bạn đánh bại câu lạc bộ đó ở <b>Thành Phố</b>.</p></div></aside></div>`;
  el.querySelectorAll("[data-q]").forEach(x=>x.onclick=()=>{if(b.q===x.dataset.q)return;b.q=x.dataset.q;renderBroker()});
  el.querySelectorAll("[data-hire]").forEach(x=>x.onclick=()=>hire(+x.dataset.hire));
  document.getElementById("bkAgain").onclick=()=>{if(brokerSearch(true)){flag("scout");render();saveLocal();renderBroker()}}}

/* ---------- Nhiệm vụ: N.Vụ chính · Thương mại · Hoạt động (hằng ngày) · Sự kiện ---------- */
const NV_TABS=[["main","N.Vụ chính"],["tm","Thương mại"],["hd","Hoạt động"],["sk","Sự kiện"]];
const TASKS=[
 {id:"lineup",tab:"main",n:"Xếp đội hình lần đầu",cond:"Vào Đội, xếp 11 cầu thủ đá chính và chọn thế trận.",ok:f=>f.lineup,rw:{gold:5000},go:"doi"},
 {id:"match",tab:"main",n:"Trận đấu đầu tiên",cond:"Đá 1 trận bất kỳ (giao hữu hoặc giải đấu).",ok:f=>(f.matches||0)>=1,rw:{phieu:10},go:"thidau"},
 {id:"train",tab:"main",n:"Huấn luyện cầu thủ",cond:"Vào Huấn luyện → Kế hoạch, luyện 1 cầu thủ.",ok:f=>f.train,rw:{phieu:10},go:"ql"},
 {id:"city1",tab:"main",n:"Chinh phục câu lạc bộ",cond:"Vào Thành Phố, đánh bại 1 câu lạc bộ bất kỳ.",ok:()=>Object.keys(cityWon()).length>=1,rw:{the:1},go:"thanhpho"},
 {id:"kich",tab:"main",n:"Kích thích cầu thủ",cond:"Kích thích 1 cầu thủ để tăng giới hạn chỉ số.",ok:f=>f.kich,rw:{gold:10000},go:"ql"},
 {id:"star",tab:"main",n:"Lên sao",cond:"Dùng thẻ cầu thủ để lên sao 1 cầu thủ.",ok:f=>f.star,rw:{bh:2},go:"ql"},
 {id:"cupvl",tab:"main",n:"Vô địch V.League Cup",cond:"Vào Giải đấu, thắng cả 3 vòng V.League Cup.",ok:()=>cupSt("vl").champ>0,rw:{xu:50},go:"phuban"},
 {id:"city10",tab:"main",n:"Chinh phục 10 câu lạc bộ",cond:"Đánh bại 10 câu lạc bộ ở Thành Phố.",prog:()=>`${Math.min(10,Object.keys(cityWon()).length)}/10`,ok:()=>Object.keys(cityWon()).length>=10,rw:{the:2,gold:30000},go:"thanhpho"},
 {id:"cupwc",tab:"main",n:"Vô địch World Cup",cond:"Lần lượt vô địch V.League Cup, ASEAN Cup, Nations League, Euro rồi World Cup.",ok:()=>cupSt("wc").champ>0,rw:{xu:300},go:"phuban"},
 {id:"hire1",tab:"tm",n:"Tuyển cầu thủ đầu tiên",cond:"Tuyển 1 cầu thủ ở Môi giới.",ok:f=>(f.hire||0)>=1,rw:{gold:10000},go:"mg"},
 {id:"hireB",tab:"tm",n:"Đội hình Xanh lam",cond:"Sở hữu 3 cầu thủ bậc Xanh lam trở lên.",prog:()=>`${squad(T.home).filter(p=>p.tier>=2).length}/3`,ok:()=>squad(T.home).filter(p=>p.tier>=2).length>=3,rw:{phieu:30},go:"mg"},
 {id:"hireP",tab:"tm",n:"Ngôi sao bậc Tím",cond:"Chiêu mộ 1 cầu thủ bậc Tím trở lên.",ok:f=>(f.hireTop??-1)>=3,rw:{xu:50},go:"mg"},
 {id:"buy",tab:"tm",n:"Khách hàng mới",cond:"Mua 1 món bất kỳ ở T.T Mua sắm.",ok:f=>f.buy,rw:{gold:5000},go:"shop"},
 {id:"d_gift",tab:"hd",daily:1,n:"Quà hằng ngày",cond:"Nhận quà hằng ngày.",ok:()=>club().lastGift===new Date().toDateString(),rw:{phieu:5},go:"gift"},
 {id:"d_m3",tab:"hd",daily:1,n:"Chăm chỉ ra sân",cond:"Đá 3 trận trong hôm nay.",prog:(f,d)=>`${Math.min(3,d.m)}/3`,ok:(f,d)=>d.m>=3,rw:{phieu:10},go:"thidau"},
 {id:"d_w1",tab:"hd",daily:1,n:"Chiến thắng",cond:"Thắng 1 trận trong hôm nay.",prog:(f,d)=>`${Math.min(1,d.w)}/1`,ok:(f,d)=>d.w>=1,rw:{gold:5000},go:"phuban"},
 {id:"d_s3",tab:"hd",daily:1,n:"Săn tài năng",cond:"Bấm “Tìm lần nữa” ở Môi giới 3 lần trong hôm nay.",prog:(f,d)=>`${Math.min(3,d.s)}/3`,ok:(f,d)=>d.s>=3,rw:{gold:1000},go:"mg"}];
const tkKey=t=>t.daily?t.id+"@"+new Date().toDateString():t.id;
const tkOk=t=>!!t.ok(club().flags,dayStat());
const tkSt=t=>club().claimed[tkKey(t)]?"got":tkOk(t)?"ok":"";
const NVS={tab:"main",sel:null};
const rwTxt=r=>Object.entries(r).filter(([,v])=>v).map(([k,v])=>`${fmt(v)} ${{gold:"vàng",phieu:"phiếu",xu:"xu",the:"thẻ cầu thủ",bh:"bảo hiểm"}[k]}`).join(", ");
function give(r){const c=club();for(const [k,v] of Object.entries(r))c[k]=(c[k]||0)+v}
const claimable=()=>TASKS.filter(t=>tkSt(t)==="ok").length;

/* ---------- kinh nghiệm quản lý ---------- */
function addExp(n){const m=club().mgr;m.exp+=n;let up=false;while(m.exp>=m.lv*300){m.exp-=m.lv*300;m.lv++;up=true}if(up)news(`${m.name} lên cấp quản lý Lv.${m.lv}!`)}

/* ---------- chế độ ---------- */
function setMode(m){MODE=m;window.MODE=m;gameEl.classList.toggle("is-lobby",m==="lobby");gameEl.classList.toggle("is-match",m==="match");wrapEl.classList.toggle("lobby-mode",m==="lobby");if(m==="lobby")lobbyRender()}
function startMatch(opp,ctx){if(M.busy){toast("Đang có tình huống diễn ra.");return}
  T.away=opp;applyLineup(T.away);closeWin();newMatch();M.ctx=ctx;setMode("match");renderSquad();
  setCmt(ctx.type==="cup"?`${CUPS.find(x=>x.id===ctx.cup).n} · ${CUPS.find(x=>x.id===ctx.cup).rounds[ctx.round][0]}: gặp ${opp.name}. Bấm “Đá trận” để bắt đầu.`:ctx.type==="city"?`Thành Phố: khiêu chiến ${opp.name}. Bấm “Đá trận” để bắt đầu.`:ctx.type==="campaign"?`Giải đấu ${ctx.stage+1}: ${opp.name}. Bấm “Đá trận” để bắt đầu.`:`Giao hữu với ${opp.name}. Bấm “Đá trận” để bắt đầu.`)}
function backToLobby(){if(M.busy){toast("Chờ tình huống hiện tại kết thúc.");return}M.auto=false;T.away=T.rival||T.away;applyLineup(T.away);newMatch();setMode("lobby")}
// gọi từ finish(): phần thưởng giải đấu, nhiệm vụ, kinh nghiệm, tin hệ thống
function onMatchEnd(){const c=club(),[h,a]=M.score,won=h>a,draw=h===a;const ds=dayStat();ds.m++;if(won)ds.w++;flag("matches",1);addExp(won?100:draw?50:30);
  const ctx=M.ctx||{type:"friendly"};
  if(ctx.type==="city"||ctx.type==="cup")cityCupEnd(ctx,won,draw);
  if(ctx.type==="campaign"){
    if(won&&ctx.stage===c.campaign){c.campaign++;scoutDrop(ctx.stage,true);const r=reward(ctx.stage);give(r);if(window.addItem){addItem(CAMP_DROP[ctx.stage],1,true);setTimeout(()=>toast(`Rơi vật phẩm: ${ITEMS[CAMP_DROP[ctx.stage]].n} (xem Rương → Tạm thời)`),2800)}news(`Chúc mừng ${c.mgr.name} đã đánh bại ${T.away.name}, vượt giải đấu ${ctx.stage+1}! Thưởng ${rwTxt(r)}.`);toast(`Vượt giải đấu ${ctx.stage+1}! +${rwTxt(r)}`)}
    else if(won){const r={gold:2000*(ctx.stage+1)};give(r);scoutDrop(ctx.stage,false);toast(`Thắng lại giải đấu ${ctx.stage+1}: +${rwTxt(r)}`)}
    else toast(draw?"Hòa – chưa vượt được giải đấu.":"Thua – nâng cấp đội hình rồi thử lại nhé!")}
  else if(won&&h-a>=3)news(`${T.home.name} thắng đậm ${h}:${a} trước ${T.away.name}.`);
  render();saveLocal()}

/* ---------- cửa sổ ---------- */
const WIN_TITLE={mg:"Môi giới cầu thủ",qlnv:"Quản lý",doi:"Lập đội hình",ql:"Quản lý cầu thủ",ds:"Danh sách cầu thủ",phuban:"Giải đấu",thanhpho:"Thành Phố",nv:"Nhiệm vụ",shop:"Trung tâm mua sắm",caidat:"Cài đặt & Lưu dữ liệu",tc:"Tài chính câu lạc bộ"};
const winEl=document.getElementById("win");
function openWin(k,sub){winEl.querySelectorAll("[data-w]").forEach(e=>e.hidden=e.dataset.w!==k);document.getElementById("wtitle").textContent=WIN_TITLE[k];winEl.hidden=false;
  if(k==="doi")renderLineup();if(k==="ql"){if(sub)MG.tab=sub;MG.team="home";mgrRender()}if(k==="ds")renderSquad();if(k==="phuban")renderCups();if(k==="thanhpho")renderCity();if(k==="nv")renderTasks();if(k==="mg")renderBroker();if(k==="shop")renderShop();if(k==="tc")renderFin();if(k==="caidat")renderSettings();if(k==="qlnv")renderQLNV();
  document.getElementById("wclose").focus()}
function closeWin(){winEl.hidden=true;if(MODE==="lobby")lobbyRender()}
document.getElementById("wclose").onclick=closeWin;
winEl.addEventListener("click",e=>{if(e.target===winEl)closeWin()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!winEl.hidden&&document.getElementById("modal").hidden)closeWin()});
// thẻ cầu thủ → mở tab quản lý tương ứng trong cửa sổ
window.mgrOpenOrig=mgrOpen;mgrOpen=(team,i,tab)=>{openWin("ql",tab);MG.team=team===T.away?"away":"home";MG.i=i;MG.msg="";mgrRender()};

function renderCampaign(){const c=club(),el=document.getElementById("phuban");
  el.innerHTML=`<p class="wl">Đánh bại lần lượt 10 câu lạc bộ ở 9 quốc gia. Tới giải đấu nước nào sẽ mở thị trường Môi giới nước đó. Đội của bạn: Thực lực ${r1(avg(T.home.players.map(overall)))}.</p><div class="pbl">${CAMPAIGN.map((s,i)=>{
    const st=i<c.campaign?"done":i===c.campaign?"open":"lock",t=npcTeam(i),ov=r1(avg(t.players.map(overall)));
    return`<div class="pb ${st}"><i class="pbn" style="background:${s.c}">${i+1}</i><div class="pbi"><b>${s.n} <small class="mu">· ${NATIONS[s.q].n}</small></b><span>Bậc ${TIERS[s.t].n}${s.up?` + ${s.up} ${TIERS[Math.min(5,s.t+1)].n}`:""} · Kích ${s.kt}% · Thực lực ~${ov}</span><span class="rw">Thưởng lần đầu: ${rwTxt(reward(i))} + tiến cử 1 cầu thủ ${NATIONS[s.q].n}</span></div>
      ${st==="lock"?`<span class="lk">Khóa</span>`:`<button class="${st==="open"?"pri":""}" data-pb="${i}">${st==="done"?"Đá lại":"Khiêu chiến"}</button>`}</div>`}).join("")}</div>`;
  el.querySelectorAll("[data-pb]").forEach(b=>b.onclick=()=>{const i=+b.dataset.pb;startMatch(npcTeam(i),{type:"campaign",stage:i})})}
function renderTasks(){const c=club(),el=document.getElementById("tasks"),list=TASKS.filter(t=>t.tab===NVS.tab);dayStat();
  if(!list.some(t=>t.id===NVS.sel))NVS.sel=(list.find(t=>tkSt(t)==="ok")||list.find(t=>!tkSt(t))||list[0]||{}).id;
  const t=list.find(x=>x.id===NVS.sel),tabN=k=>NV_TABS.find(x=>x[0]===k)[1];
  el.innerHTML=`<div class="nvw"><div class="nvtabs" role="tablist">${NV_TABS.map(([k,n])=>{const cnt=TASKS.filter(x=>x.tab===k&&tkSt(x)==="ok").length;
      return`<button role="tab" aria-selected="${k===NVS.tab}" class="${k===NVS.tab?"on":""}" data-nvt="${k}">${n}${cnt?` <b>(${cnt})</b>`:""}</button>`}).join("")}</div>
   <div class="nvb">${list.length?`<div class="nvl">${list.map(x=>{const s=tkSt(x);return`<button class="${x.id===NVS.sel?"sel ":""}${s}" data-nvs="${x.id}">${x.n}${s==="ok"?' <i class="ck" aria-label="xong">✔</i>':""}</button>`}).join("")}</div>
    <div class="nvd">${t?`<dl><dt>Tên nhiệm vụ:</dt><dd><b>[${t.n}]</b> <span class="mu">${tabN(t.tab)}${t.daily?" · làm lại mỗi ngày":""}</span></dd>
      <dt>Điều kiện hoàn thành:</dt><dd>${t.cond}${t.prog?` <span class="mu">(${t.prog(c.flags,dayStat())})</span>`:""}</dd>
      <dt>Phần thưởng:</dt><dd>${rwTxt(t.rw)}</dd></dl>
      <div class="nva">${tkSt(t)==="got"?`<span class="lk">Đã nhận thưởng${t.daily?" hôm nay":""}</span>`:tkSt(t)==="ok"?`<button class="pri" data-claim="${t.id}">Nhận</button>`:`<button data-go="${t.go}">Đi làm</button>`}</div>`:""}</div>`
    :`<p class="nve">Hiện chưa có sự kiện nào. Hãy quay lại sau nhé!</p>`}</div></div>`;
  el.querySelectorAll("[data-nvt]").forEach(b=>b.onclick=()=>{NVS.tab=b.dataset.nvt;NVS.sel=null;renderTasks()});
  el.querySelectorAll("[data-nvs]").forEach(b=>b.onclick=()=>{NVS.sel=b.dataset.nvs;renderTasks()});
  el.querySelectorAll("[data-claim]").forEach(b=>b.onclick=()=>{const t=TASKS.find(x=>x.id===b.dataset.claim);if(tkSt(t)!=="ok")return;give(t.rw);c.claimed[tkKey(t)]=true;toast(`Nhận ${rwTxt(t.rw)}`);render();saveLocal();renderTasks()});
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>navGo(b.dataset.go))}
const SHOP=[{id:"the",n:"Thẻ cầu thủ (dùng để Lên sao)",cost:{xu:50},get:{the:1}},{id:"bh",n:"Giấy bảo hiểm (+5% lên sao)",cost:{xu:10},get:{bh:1}},
 {id:"phieu",n:"Gói 50 phiếu",cost:{gold:30000},get:{phieu:50}},{id:"tp",n:"Gói 2.000 điểm huấn luyện cho cả đội",cost:{phieu:60},get:{tpAll:2000}}];
const SHOP_IC={the:"_the",bh:"bh"};
function curPill(k,v){const ic={vang:"vang",gold:"vang",xu:"xu",phieu:"phieu"}[k];return`<span class="cp">${ic&&typeof CUR_IMG!=="undefined"&&CUR_IMG[ic]?`<img src="${CUR_IMG[ic]}" alt="">`:""}<b>${fmt(v)}</b>${ic?"":` ${k==="the"?"thẻ":k==="bh"?"bảo hiểm":k}`}</span>`}
function wallet(c){return`<div class="wal">${curPill("gold",c.gold||0)}${curPill("xu",c.xu||0)}${curPill("phieu",c.phieu||0)}<span class="cp"><b>${c.the||0}</b> thẻ cầu thủ</span><span class="cp"><b>${c.bh||0}</b> bảo hiểm</span></div>`}
const SHOP_DESC={the:"Nguyên liệu để Lên sao cầu thủ",bh:"Mỗi tờ +5% tỉ lệ Lên sao thành công",phieu:"Dùng để Làm lại kích thích, Cải tiến, nhận điểm cấp tốc",tp:"Mỗi cầu thủ trong đội nhận thêm 2.000 điểm huấn luyện"};
function renderShop(){const c=club(),el=document.getElementById("shop");
  const ico=s=>s.get.the?ITEM_SVG("the"):s.get.bh?ITEM_SVG("bh"):s.get.phieu?ITEM_SVG("phieu"):ITEM_SVG("tp");
  el.innerHTML=`${wallet(c)}<div class="shg">${SHOP.map(s=>{const [k,v]=Object.entries(s.cost)[0],can=(c[k==="vang"?"gold":k]||0)>=v;
    return`<div class="shc"><div class="shi">${ico(s)}</div><div class="sht"><b>${s.n.replace(/ \(.*\)/,"")}</b><small>${SHOP_DESC[s.id]||(s.n.match(/\((.*)\)/)||[,""])[1]||s.n}</small></div>
     <div class="shp">${curPill(k==="vang"?"gold":k,v)}</div><button class="pri" data-buy="${s.id}" ${can?"":"disabled"}>Mua</button></div>`}).join("")}</div>`;
  el.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{const s=SHOP.find(x=>x.id===b.dataset.buy);const [k,v]=Object.entries(s.cost)[0];
    if((c[k]||0)<v){toast(`Không đủ ${rwTxt({[k]:v})}.`);return}c[k]-=v;
    if(s.get.tpAll)squad(T.home).forEach(p=>p.tp+=s.get.tpAll);else give(s.get);c.flags.buy=true;toast(`Đã mua: ${s.n}`);render();saveLocal();renderShop()})}
function ITEM_SVG(k){const P={the:'<rect x="9" y="5" width="22" height="30" rx="3" fill="#a855f7"/><circle cx="20" cy="16" r="5" fill="#fff"/><path d="M12 30c1-6 4-8 8-8s7 2 8 8" fill="#fff"/>',
  bh:'<path d="M20 4l13 5v9c0 9-6 15-13 18C13 33 7 27 7 18V9z" fill="#22c55e"/><path d="M14 19l4 4 8-8" stroke="#fff" stroke-width="3" fill="none"/>',
  phieu:'<path d="M5 12h30v5a3 3 0 0 0 0 6v5H5v-5a3 3 0 0 0 0-6z" fill="#ea580c"/><path d="M14 13v14" stroke="#fff" stroke-dasharray="2 2"/>',
  tp:'<circle cx="20" cy="20" r="14" fill="#2563eb"/><path d="M20 10v10l7 4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>'};return`<svg viewBox="0 0 40 40" aria-hidden="true">${P[k]}</svg>`}
function renderFin(){const c=club();
  const R=(ic,n,v,src)=>`<div class="fnc"><div class="shi">${ic}</div><div class="sht"><small>${n}</small><b>${v}</b></div><div class="fns">${src}</div></div>`;
  const I=k=>typeof CUR_IMG!=="undefined"&&CUR_IMG[k]?`<img src="${CUR_IMG[k]}" alt="">`:"";
  document.getElementById("tc").innerHTML=`<div class="fng">
   ${R(I("vang"),"Vàng",fmt(c.gold||0),`<span class="w">Thắng <b>+20.000</b></span><span>Hòa <b>+8.000</b></span><span class="l">Thua <b>+3.000</b></span><em>mỗi trận</em>`)}
   ${R(I("phieu"),"Phiếu",fmt(c.phieu||0),`<span class="w">Thắng <b>+10</b></span><span>Hòa <b>+5</b></span><span class="l">Thua <b>+2</b></span><em>mỗi trận</em>`)}
   ${R(I("xu"),"Xu",fmt(c.xu||0),`<em>Tiền nạp · chưa có cổng nạp</em>`)}
   ${R(ITEM_SVG("the"),"Thẻ cầu thủ / Bảo hiểm",`${c.the||0} / ${c.bh||0}`,`<em>Từ giải đấu, nhiệm vụ, cửa hàng</em>`)}</div>`}
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
const MENU=[["Sân tập","ql"],["Quán Bar",null],["Đoạt Sân",null],["T.T Mua sắm","shop"],["Sân đấu BOSS",null],["P.Thị Trường","mg"],["Hiệp hội Q.Lý",null],["SVĐ Sông Hồng","doi"],["Đài truyền hình",null]];
const NPCS=[["Môi giới","bag","mg"],["Huấn luyện","whistle","ql"],["Chiến thuật","board","doi"],["Tài chính","coin","tc"],["Chỉ dẫn","info","guide"]];
const NAV=[["N.Vụ","nv"],["Quản lý","qlnv"],["Đội","doi"],["Cầu thủ","ds"],["Huấn luyện","ql"],["Thi đấu","thidau"],["T.Phố","thanhpho"],["Giải đấu","phuban"],["Rương","ruong"],["Shop","shop"]];
function guideText(){const c=club(),f=c.flags,t=TASKS.find(x=>x.tab==="main"&&!c.claimed[x.id]);
  if(t&&tkOk(t))return`Nhiệm vụ “${t.n}” đã hoàn thành! Bấm <b>N.Vụ</b> để nhận ${rwTxt(t.rw)}.`;
  if(t)return{lineup:"Hãy vào <b>Đội</b> để xếp đội hình: kéo cầu thủ vào vị trí, chọn thế trận và chiến thuật.",match:"Bấm <b>Thi đấu</b> để đá giao hữu, xem cầu thủ thi đấu theo chỉ số.",train:"Vào <b>Quản lý → Kế hoạch</b>, chọn chỉ số rồi bấm Thực hiện để luyện cầu thủ.",city1:"Vào <b>Thành Phố</b>, xoay quả địa cầu và chọn một nước. Thắng câu lạc bộ nào thì cầu thủ của họ vào Môi giới.",kich:"<b>Kích thích</b> làm tăng giới hạn chỉ số của cầu thủ. Thử với cầu thủ giỏi nhất nhé.",star:"Dùng thẻ cầu thủ để <b>Lên sao</b>, mở khóa kỹ năng như Step Over, Ngả bàn đèn.",cupvl:"Vào <b>Giải đấu</b>, vô địch V.League Cup để nhận 50 xu và mở ASEAN Cup. Thua là bị loại, nhớ xếp đội mạnh nhất.",city10:"Mỗi câu lạc bộ thắng được sẽ mở khóa cầu thủ của họ ở Môi giới. Hạ 10 đội để nhận thưởng lớn.",cupwc:"World Cup là giải mạnh nhất, chung kết gặp Argentina. Vô địch để nhận 300 xu."}[t.id]||"";
  return`Bạn đã xong nhiệm vụ tân thủ. Giải đấu đang ở ${cupNext().n}, Thành Phố đã chinh phục ${Object.keys(cityWon()).length} câu lạc bộ. Cố lên!`}
/* ---------- chân dung vẽ bằng SVG (nhân vật tự thiết kế, không dùng ảnh ngoài) ---------- */
function portrait(kind){
  if(typeof NPC_IMG!=="undefined"&&NPC_IMG[kind])return`<img class="pt ni" src="${NPC_IMG[kind]}" alt="">`;
  if(kind==="trolý"&&TROLY)return`<img class="pt tl" src="${TROLY}" alt="">`;
  const P={
   moigioi:{bg:["#7a5c3a","#3b2a18"],skin:"#e8b98f",hair:"#2b1a10",suit:"#3b3f46",shirt:"#f3f3f3",tie:"#8b1e1e",hat:true},
   hlv:{bg:["#2f6d9a","#173a55"],skin:"#e2ad83",hair:"#1d1410",suit:"#1f2937",shirt:"#dfe7ef",tie:"#1e40af",stub:true},
   chienthuat:{bg:["#5a6b7d","#2b3440"],skin:"#e9bc95",hair:"#3a2a20",suit:"#4b5563",shirt:"#ffffff",tie:"#374151",slick:true},
   taichinh:{bg:["#4c7a5a","#22402c"],skin:"#e6b48c",hair:"#141414",suit:"#111827",shirt:"#ffffff",tie:"#b91c1c",glasses:true},
   trolý:{bg:["#c2697a","#6b2e3c"],skin:"#f1c7a6",hair:"#5a3420",suit:"#ffffff",shirt:"#ffffff",tie:null,long:true}};
  const c=P[kind]||P.hlv,id="g"+kind.replace(/\W/g,"");
  return`<svg viewBox="0 0 80 80" class="pt" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.bg[0]}"/><stop offset="1" stop-color="${c.bg[1]}"/></linearGradient></defs>
  <rect width="80" height="80" fill="url(#${id})"/>
  ${c.long?`<path d="M18 40 Q16 18 40 14 Q64 18 62 40 L64 66 L16 66 Z" fill="${c.hair}"/>`:""}
  <path d="M10 80 Q12 58 40 56 Q68 58 70 80 Z" fill="${c.suit}"/>
  ${c.tie?`<path d="M34 57 L40 66 L46 57 Z" fill="${c.shirt}"/><path d="M38.5 60 L41.5 60 L43 76 L40 79 L37 76 Z" fill="${c.tie}"/>`:`<path d="M33 57 Q40 66 47 57" fill="none" stroke="#e5d0c0" stroke-width="2"/>`}
  <rect x="35" y="44" width="10" height="13" rx="3" fill="${c.skin}"/>
  <ellipse cx="40" cy="34" rx="13" ry="15.5" fill="${c.skin}"/>
  <ellipse cx="27" cy="35" rx="2.5" ry="4" fill="${c.skin}"/><ellipse cx="53" cy="35" rx="2.5" ry="4" fill="${c.skin}"/>
  ${c.long?`<path d="M26 30 Q28 16 40 16 Q54 16 55 30 Q47 22 34 26 Z" fill="${c.hair}"/>`:c.slick?`<path d="M26 31 Q26 16 41 16 Q55 17 54 30 Q50 20 27 30 Z" fill="${c.hair}"/>`:c.stub?`<path d="M27 29 Q28 18 40 18 Q52 18 53 29 Q47 23 40 23 Q33 23 27 29 Z" fill="${c.hair}"/><path d="M29 41 Q40 52 51 41 Q50 49 40 50 Q30 49 29 41 Z" fill="${c.hair}" opacity=".35"/>`:`<path d="M26 31 Q27 17 40 17 Q53 17 54 31 Q50 24 40 24 Q30 24 26 31 Z" fill="${c.hair}"/>`}
  ${c.hat?`<ellipse cx="40" cy="21" rx="20" ry="4" fill="#3a2a1a"/><path d="M28 21 Q29 8 40 8 Q51 8 52 21 Z" fill="#4a3522"/><rect x="28" y="17" width="24" height="3" fill="#7a1f1f"/>`:""}
  <ellipse cx="35" cy="34" rx="1.6" ry="2" fill="#2a1a12"/><ellipse cx="45" cy="34" rx="1.6" ry="2" fill="#2a1a12"/>
  <path d="M33 30 h5 M42 30 h5" stroke="${c.hair}" stroke-width="1.4" stroke-linecap="round"/>
  ${c.glasses?`<circle cx="35" cy="34" r="4" fill="none" stroke="#111" stroke-width="1.3"/><circle cx="45" cy="34" r="4" fill="none" stroke="#111" stroke-width="1.3"/><path d="M39 34 h2" stroke="#111" stroke-width="1.3"/>`:""}
  <path d="M40 36 Q39 40 41 41" fill="none" stroke="#b07a58" stroke-width="1.2"/>
  <path d="M36 44 Q40 ${c.long?47:46} 44 44" fill="none" stroke="#9b4a3a" stroke-width="1.5" stroke-linecap="round"/>
  ${c.long?`<path d="M54 36 Q58 52 56 64 L62 64 Q62 48 55 32 Z M26 36 Q22 52 24 64 L18 64 Q18 48 25 32 Z" fill="${c.hair}"/>`:""}
  </svg>`}
const NPC_PT={"Môi giới":"moigioi","Huấn luyện":"hlv","Chiến thuật":"chienthuat","Tài chính":"taichinh","Chỉ dẫn":"trolý"};
/* ===== SẢNH KIỂU FIFA (thay sảnh cũ) ===== */
const FL_SVG=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const FLI={globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',home:'<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',play:'<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z" fill="currentColor"/>',team:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 12h16M12 3v4M12 17v4"/>',
 train:'<circle cx="9" cy="14" r="5"/><path d="M9 9h11v5h-6"/>',market:'<path d="M5 8h14l-1.5 12h-11z"/><path d="M9 8a3 3 0 0 1 6 0"/>',pb:'<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z"/>',
 task:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',shop:'<path d="M4 7h16l-1 4H5z"/><path d="M5 11v9h14v-9"/>',bag:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M4 12h16M9 7V5h6v2"/>',
 list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
 gift:'<rect x="4" y="10" width="16" height="10"/><path d="M3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-4 0M12 7c2-4 6-3 4 0"/>',full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 friend:'<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c1-3 3-4 5-4s4 1 5 4M11 19c1-3 3-4 5-4s4 1 5 4"/>',save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h8V3M8 21v-7h8v7"/>'};
const FL_NAV=[["home","Trang chủ","home"],["play","Thi đấu","thidau"],["team","Đội hình","doi"],["list","Cầu thủ","ds"],["train","Huấn luyện","ql"],["market","Môi giới","mg"],["globe","Thành phố","thanhpho"],["pb","Giải đấu","phuban"],["task","Nhiệm vụ","nv"],["shop","Cửa hàng","shop"],["bag","Rương","ruong"],["cog","Cài đặt","caidat"]];
const flEsc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const CUR=k=>typeof CUR_IMG!=="undefined"&&CUR_IMG[k]?`<img src="${CUR_IMG[k]}" alt="">`:"";
let FL_STARS=null;
function flStars(){if(FL_STARS)return FL_STARS;FL_STARS=["Ronaldo","Xuân Son","Quang Hải"].map(n=>{const s=STARS.find(x=>x[0]===n);const p=mk(n,s[1],s[2],s[4]||"P");return{n,pos:s[1],tier:s[2],ovr:Math.round(overall(p)),img:faceSrc(p)}});return FL_STARS}
function flCrest(t){const ini=t.name.split(" ").map(w=>w[0]).join("").slice(0,3).toUpperCase();
  return`<svg class="fl-crest" viewBox="0 0 46 52" aria-hidden="true"><path d="M23 1 44 7v18c0 13-9 21-21 26C11 46 2 38 2 25V7z" fill="#d1222a" stroke="#ffd36b" stroke-width="2"/><path d="M23 9 36 13v12c0 8-6 13-13 17-7-4-13-9-13-17V13z" fill="#8f1016"/><text x="23" y="31" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="800" font-size="13" fill="#fff">${ini}</text></svg>`}
/* ---------- sảnh kiểu sáng (giống game gốc): ảnh sân vận động làm nền, bảng trắng mờ, nút vàng ---------- */
function lobbyRender(){if(MODE!=="lobby")return;const c=club(),m=c.mgr,el=document.getElementById("lobby");
  const ov=Math.round(avg(T.home.players.map(overall))),today=new Date().toDateString(),gift=c.lastGift!==today;
  const HN=heroNext(),oppT=HN.team,oppOv=Math.round(avg(oppT.players.map(overall)));
  const cl=claimable(),expPct=Math.min(100,Math.round(m.exp/(m.lv*300)*100));
  const canTrain=squad(T.home).filter(p=>p.tp>=500&&p.plan.some(k=>p.base[k]<maxOf(p,k))).length;
  const chat=[...CHAT.map(x=>({who:x.name,text:x.text})),...c.news.slice(0,14).map(n=>({sys:1,text:n.text}))].slice(0,30);
  const news=c.news.slice(0,3).map(n=>n.text).join(" · ")||`Chào mừng ${m.name} đến với Đam Mê Bóng Đá! Hoàn thành nhiệm vụ tân thủ để nhận quà.`;
  const won=Object.keys(cityWon()).length,tot=CITY.reduce((s,C)=>s+C.clubs.length,0);
  const st=[[`Trận tiếp: gặp ${oppT.name} (${oppOv})`,"pbnext",true],[`Nhiệm vụ chờ nhận (${cl})`,"nv",cl>0],[`Cầu thủ có thể luyện (${canTrain})`,"ql",canTrain>0],[`Thành phố: ${won}/${tot} CLB`,"thanhpho",false],[gift?"Quà hằng ngày: nhận được":"Quà hằng ngày: đã nhận","gift",gift]];
  const MENU2=[["Thi đấu","thidau"],["Đội hình","doi"],["Cầu thủ","ds"],["Huấn luyện","ql"],["P. Thị trường","mg"],["Nhiệm vụ","nv"],["T.T Mua sắm","shop"],["Rương","ruong"],["Tài chính","tc"]];
  const NPC2=[["moigioi","Môi giới","mg"],["hlv","Huấn luyện","ql"],["chienthuat","Chiến thuật","doi"],["taichinh","Tài chính","tc"],["trolý","Chỉ dẫn","guide"]];
  const BOT=[[`N.Vụ${cl?`(${cl})`:""}`,"nv"],["Quản lý","qlnv"],["Đội","doi"],["Thi đấu","thidau"],["Cầu thủ","ds"],["Thành phố","thanhpho"],["Giải đấu","phuban"],["Rương","ruong"],["Shop","shop"]];
  el.innerHTML=`<div class="cl">
  <header class="cl-top"><span class="cl-sn">Tin hệ thống</span><div class="cl-tick"><span>${flEsc(news)}</span></div>
    <nav class="cl-links"><span>Xin chào, <b>${flEsc(m.name)}</b></span><button type="button" data-go="save">Lưu</button><button type="button" data-go="caidat">Cài đặt</button><button type="button" data-go="nap">Nạp xu</button><button type="button" data-go="full">Toàn màn hình</button></nav></header>
  <section class="cl-prof"><button type="button" class="cl-av" data-go="qlnv" title="Quản lý nhân vật">${flCrest(T.home)}<em>${m.lv}</em></button>
    <div class="cl-pi"><b>${flEsc(T.home.name)}</b><span>${flEsc(m.name)} · Thực lực ${ov}</span><span class="cl-bar" title="Kinh nghiệm ${expPct}%"><i style="width:${expPct}%"></i><small>${expPct}%</small></span></div>
    <div class="cl-cur"><span>${CUR("vang")}<b>${fmt(c.gold||0)}</b></span><span>${CUR("xu")}<b>${fmt(c.xu||0)}</b></span><span>${CUR("phieu")}<b>${fmt(c.phieu||0)}</b></span></div></section>
  <section class="cl-stat" aria-label="Trạng thái">${st.map(([t,g,hot])=>`<button type="button" data-go="${g}" class="${hot?"hot":""}"><i></i>${flEsc(t)}</button>`).join("")}</section>
  <section class="cl-guide"><span class="cl-gimg">${portrait("trolý")}</span><div class="cl-bub"><b>Chỉ dẫn!</b><p>${guideText()}</p></div></section>
  <div class="cl-big"><button type="button" data-go="phuban">Giải đấu</button><button type="button" data-go="thanhpho">Thành phố</button></div>
  <button type="button" class="cl-loc" data-go="pbnext"><i></i>${flEsc(HN.label)}<small>Thi đấu ngay ▸</small></button>
  <nav class="cl-menu" aria-label="Khu vực">${MENU2.map(([n,g])=>`<button type="button" data-go="${g}">${n}${g==="nv"&&cl?` <em>${cl}</em>`:""}</button>`).join("")}</nav>
  <div class="cl-npcs">${NPC2.map(([k,n,g])=>`<button type="button" data-go="${g}"><span>${portrait(k)}</span><b>${n}</b></button>`).join("")}</div>
  <button type="button" class="cl-gift ${gift?"hot":""}" data-go="gift">${FL_SVG(FLI.gift)}<b>${gift?"Quà":"Đã nhận"}</b></button>
  <aside class="cl-chat"><div class="cl-ct"><b>Chat</b><span>${db?"Online":"Ngoại tuyến"}</span></div>
    <div class="cl-cm">${chat.map(x=>x.sys?`<p><b class="sys">[Hệ thống]</b> ${flEsc(x.text)}</p>`:`<p><b>${flEsc(x.who||"?")}:</b> ${flEsc(x.text)}</p>`).join("")||"<p class='mu'>Chưa có tin nhắn.</p>"}</div>
    <form class="cl-cin" id="chatf"><label for="chati" class="sr">Tin nhắn</label><input id="chati" maxlength="200" placeholder="Nhập tin nhắn…" autocomplete="off"><button aria-label="Gửi">Gửi</button></form></aside>
  <nav class="cl-bot" aria-label="Menu nhanh">${BOT.map(([n,g])=>`<button type="button" data-go="${g}">${n}</button>`).join("")}<button type="button" class="cl-r" data-go="gift">Nhận quà</button></nav></div>`;
  document.getElementById("chatf").onsubmit=e=>{e.preventDefault();const i=document.getElementById("chati");chatSend(i.value);i.value=""};
}
function navGo(g){
  if(g==="home")return;
  if(g==="full"){const f=document.getElementById("bFull");if(f)f.click();return}
  if(g==="pbnext"){const h=heroNext();if(h.kind==="city")startMatch(h.team,{type:"city",club:h.k.id});else cupPlay(h.cup.id);return}
  if(g==="thidau"){startMatch(T.rival||T.away,{type:"friendly"});return}
  if(g==="world"){toast("Thế giới (đấu với người chơi khác) đang phát triển.");return}
  if(g==="dev"){toast("Tính năng đang phát triển.");return}
  if(g==="ruong"){QL.tab="ruong";openWin("qlnv");return}
  if(g==="nap"){toast("Cổng nạp xu chưa mở.");return}
  if(g==="save"){if(db)fbSave(false).then(()=>toast("Đã lưu lên máy chủ")).catch(e=>toast("Lưu lỗi: "+e.message));else{saveLocal();toast("Đã lưu trong trình duyệt")}return}
  if(g==="guide"){toast("Làm theo bảng Chỉ dẫn và Nhiệm vụ tân thủ để làm quen game.");return}
  if(g==="gift"){const c=club(),d=new Date().toDateString();if(c.lastGift===d){toast("Hôm nay bạn đã nhận quà rồi, quay lại vào ngày mai nhé.");return}
    c.lastGift=d;give({gold:5000,phieu:5});const gi=GIFT_DROP[Math.floor(Math.random()*GIFT_DROP.length)];addItem(gi);toast(`Quà hằng ngày: +5.000 vàng, +5 phiếu, ${ITEMS[gi].n}`);render();saveLocal();lobbyRender();return}
  openWin(g)}
document.getElementById("lobby").addEventListener("click",e=>{if(e.target.closest("form"))return;const b=e.target.closest("[data-go]");if(b){e.stopPropagation();navGo(b.dataset.go)}});
document.getElementById("nav").addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)navGo(b.dataset.go)});
document.getElementById("bLobby").onclick=backToLobby;


/* ================== QUẢN LÝ NHÂN VẬT: thuộc tính · trang bị · rương ==================
   Kinh doanh: +2% vàng sau trận / điểm. Kế hoạch: +2% điểm huấn luyện sau trận / điểm.
   Quyền uy: +0.5% tinh thần đầu trận của đội nhà / điểm. Điểm = 19 + 2 mỗi cấp quản lý. */
const MATTR=[["kd","Kinh doanh","+2% vàng nhận sau mỗi trận"],["kh","Kế hoạch","+2% điểm huấn luyện sau mỗi trận"],["qu","Quyền uy","+0.5% tinh thần thi đấu đầu trận"]];
const SLOTS=[["mu","Mũ",50,4],["hh","Huy hiệu",82,26],["ao","Áo",50,30],["dh","Đồng hồ",18,44],["quan","Quần",50,60],["giay","Giày",50,90]];
const ITEMS={
 mu1:{n:"Mũ lưỡi trai",slot:"mu",b:{qu:1},ic:"hat",c:"#2563eb"}, mu2:{n:"Mũ phớt quý ông",slot:"mu",b:{qu:3},ic:"hat",c:"#7c3aed"},
 ao1:{n:"Áo vest HLV",slot:"ao",b:{kd:2},ic:"shirt",c:"#334155"}, ao2:{n:"Áo vest vàng",slot:"ao",b:{kd:4,qu:1},ic:"shirt",c:"#ca8a04"},
 dh1:{n:"Đồng hồ chiến thuật",slot:"dh",b:{kh:2},ic:"watch",c:"#0f766e"}, dh2:{n:"Đồng hồ vàng",slot:"dh",b:{kh:4},ic:"watch",c:"#ca8a04"},
 quan1:{n:"Quần âu",slot:"quan",b:{qu:1,kd:1},ic:"pants",c:"#1f2937"}, giay1:{n:"Giày da",slot:"giay",b:{kh:1},ic:"shoe",c:"#7c2d12"}, giay2:{n:"Giày da cá sấu",slot:"giay",b:{kh:2,kd:1},ic:"shoe",c:"#365314"},
 hh1:{n:"Huy hiệu CLB",slot:"hh",b:{qu:2},ic:"badge",c:"#b91c1c"}, hh2:{n:"Huy hiệu vàng",slot:"hh",b:{qu:4},ic:"badge",c:"#ca8a04"},
 phieu20:{n:"Túi 20 phiếu",use:()=>{give({phieu:20});return"+20 phiếu"},ic:"ticket",c:"#ea580c"},
 vang10k:{n:"Túi 10.000 vàng",use:()=>{give({gold:10000});return"+10.000 vàng"},ic:"coinbag",c:"#ca8a04"},
 thehl:{n:"Thẻ huấn luyện",use:()=>{squad(T.home).forEach(p=>p.tp+=500);return"+500 điểm huấn luyện cho cả đội"},ic:"scroll",c:"#16a34a"}};
const CAMP_DROP=["mu1","giay1","quan1","ao1","dh1","hh1","giay2","mu2","dh2","ao2"],GIFT_DROP=["phieu20","vang10k","thehl"];
function cm(){const c=club();c.attr=c.attr||{kd:1,kh:1,qu:1};c.equip=c.equip||{};c.inv=c.inv||[{id:"phieu20",q:2},{id:"thehl",q:1},{id:"mu1",q:1}];c.temp=c.temp||[];c.resets=c.resets||0;return c}
const attrTotal=()=>19+2*(club().mgr.lv-1);
const attrFree=()=>{const a=cm().attr;return attrTotal()-a.kd-a.kh-a.qu};
function mstat(k){const c=cm();let v=c.attr[k]||0;for(const id of Object.values(c.equip))if(id&&ITEMS[id].b&&ITEMS[id].b[k])v+=ITEMS[id].b[k];return v}
function addItem(id,q=1,temp=false){const c=cm(),L=temp?c.temp:c.inv,x=L.find(i=>i.id===id);if(x)x.q+=q;else L.push({id,q})}
function takeItem(id){const c=cm(),x=c.inv.find(i=>i.id===id);if(!x)return false;x.q--;if(x.q<=0)c.inv.splice(c.inv.indexOf(x),1);return true}
const bTxt=b=>Object.entries(b).map(([k,v])=>`${MATTR.find(a=>a[0]===k)[1]} +${v}`).join(", ");
const IC={hat:'<path d="M8 26h24M12 26c0-9 4-14 8-14s8 5 8 14" fill="currentColor"/><rect x="6" y="25" width="28" height="4" rx="2" fill="currentColor"/>',
 shirt:'<path d="M13 7l-7 5 3 6 4-2v17h14V16l4 2 3-6-7-5c-1 3-3 4-7 4s-6-1-7-4z" fill="currentColor"/>',
 watch:'<rect x="15" y="4" width="10" height="32" rx="3" fill="currentColor" opacity=".55"/><circle cx="20" cy="20" r="9" fill="currentColor"/><circle cx="20" cy="20" r="6" fill="#fff"/><path d="M20 16v4l3 2" stroke="#111" stroke-width="1.6" fill="none"/>',
 pants:'<path d="M11 6h18l2 28h-7l-4-17-4 17H9z" fill="currentColor"/>',
 shoe:'<path d="M6 26c0-5 2-11 4-13h7c1 4 4 6 9 7 5 1 8 3 8 6v3H6z" fill="currentColor"/>',
 badge:'<path d="M20 4l13 5v10c0 9-6 14-13 17C13 33 7 28 7 19V9z" fill="currentColor"/><path d="M20 12l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8z" fill="#fff"/>',
 ticket:'<path d="M5 12h30v5a3 3 0 0 0 0 6v5H5v-5a3 3 0 0 0 0-6z" fill="currentColor"/><path d="M14 13v14" stroke="#fff" stroke-dasharray="2 2"/>',
 coinbag:'<path d="M14 9h12l-3 5c6 2 10 8 10 13 0 5-6 7-13 7S7 32 7 27c0-5 4-11 10-13z" fill="currentColor"/><text x="20" y="29" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">$</text>',
 scroll:'<rect x="9" y="7" width="22" height="26" rx="3" fill="currentColor"/><path d="M14 14h12M14 19h12M14 24h8" stroke="#fff" stroke-width="2"/>',
 card:'<rect x="9" y="5" width="22" height="30" rx="3" fill="currentColor"/><circle cx="20" cy="16" r="5" fill="#fff"/><path d="M12 30c1-6 4-8 8-8s7 2 8 8" fill="#fff"/>',
 shield:'<path d="M20 4l13 5v10c0 9-6 14-13 17C13 33 7 28 7 19V9z" fill="currentColor"/><path d="M14 20l4 4 8-9" stroke="#fff" stroke-width="3" fill="none"/>'};
const icSvg=(ic,c)=>`<svg viewBox="0 0 40 40" style="color:${c}" aria-hidden="true">${IC[ic]}</svg>`;
// ô rương: vật phẩm thật + thẻ cầu thủ / bảo hiểm (lưu dạng số đếm)
function bagList(){const c=cm(),L=[];if(c.the)L.push({id:"_the",q:c.the,n:"Thẻ cầu thủ",ic:"card",col:"#a855f7",tip:"Dùng để Lên sao cầu thủ"});if(c.bh)L.push({id:"_bh",q:c.bh,n:"Giấy bảo hiểm",ic:"shield",col:"#0ea5e9",tip:"+5% tỉ lệ Lên sao"});
  for(const x of c.inv){const it=ITEMS[x.id];if(it)L.push({id:x.id,q:x.q,n:it.n,ic:it.ic,col:it.c,tip:it.slot?`Trang bị (${SLOTS.find(s=>s[0]===it.slot)[1]}): ${bTxt(it.b)}`:"Bấm để dùng"})}return L}
const QL={tab:"ruong",msg:""};
function renderQLNV(){const c=cm(),el=document.getElementById("qlnv"),free=attrFree();
  const slot=([k,n,x,y])=>{const id=c.equip[k],it=id&&ITEMS[id];return`<button class="eq" data-unequip="${k}" style="left:${x}%;top:${y}%" title="${it?`${it.n}: ${bTxt(it.b)} — bấm để tháo`:`Ô ${n} (trống)`}">${it?icSvg(it.ic,it.c):`<span>${n}</span>`}</button>`};
  const bag=QL.tab==="ruong"?bagList():c.temp.map(x=>({id:x.id,q:x.q,n:ITEMS[x.id].n,ic:ITEMS[x.id].ic,col:ITEMS[x.id].c,tip:"Vật phẩm chờ nhận"}));
  const cells=Array.from({length:33},(_,i)=>{const b=bag[i];return b?`<button class="cell" data-item="${b.id}" title="${b.n} — ${b.tip}">${icSvg(b.ic,b.col)}<b>${b.q}</b></button>`:`<span class="cell"></span>`}).join("");
  el.innerHTML=`<div class="qn"><div class="qtop"><span class="qtab">Thuộc tính</span><span class="qfree">Hiện đang dư: <b>${free}</b> điểm thuộc tính quản lý</span><button data-reset="1" class="qbtn">Tẩy điểm</button></div>
   <div class="qbody"><div class="qleft"><b class="qname">${c.mgr.name.replace(/</g,"&lt;")}</b><div class="body">
     <svg viewBox="0 0 100 100" class="sil" aria-hidden="true"><circle cx="50" cy="16" r="9" fill="#9aa3ad"/><path d="M33 30h34l6 30-7 1-3-18v52h-9V64h-4v31h-9V43l-3 18-7-1z" fill="#9aa3ad"/></svg>${SLOTS.map(slot).join("")}</div>
     <span class="qsys">Hệ thống trang bị · Lv.${c.mgr.lv}</span></div>
    <div class="qright"><div class="attrs2">${MATTR.map(([k,n,d])=>{const e=mstat(k)-c.attr[k];return`<div class="ar" title="${d}"><span class="an">${n}</span><span class="ab"><i style="width:${Math.min(100,c.attr[k]*2)}%"></i></span><b>${c.attr[k]}${e?` <small>+${e}</small>`:""}</b><button class="plus" data-plus="${k}" ${free?"":"disabled"} aria-label="Cộng 1 điểm ${n}">+</button></div>`}).join("")}</div>
     <p class="qeff">Hiệu quả hiện tại: vàng sau trận +${mstat("kd")*2}% · điểm huấn luyện +${mstat("kh")*2}% · tinh thần đầu trận +${r1(mstat("qu")*0.5)}%</p>
     <div class="btabs"><button class="${QL.tab==="ruong"?"on":""}" data-btab="ruong">Rương</button><button class="${QL.tab==="tam"?"on":""}" data-btab="tam">Tạm thời${c.temp.length?` (${c.temp.length})`:""}</button>${QL.tab==="tam"&&c.temp.length?`<button class="qbtn" data-takeall="1">Chuyển hết vào rương</button>`:""}</div>
     <div class="grid33">${cells}</div><div class="msg">${QL.msg}</div></div></div></div>`;
}
document.getElementById("qlnv").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const c=cm();QL.msg="";
  if(b.dataset.plus){if(attrFree()>0&&c.attr[b.dataset.plus]<50)c.attr[b.dataset.plus]++}
  else if(b.dataset.reset){const cost=c.resets?20:0;if(cost&&c.xu<cost){QL.msg=`<span class="mko">Tẩy điểm cần ${cost} xu.</span>`}else{c.xu-=cost;c.resets++;c.attr={kd:1,kh:1,qu:1};QL.msg=`<span class="mok">Đã tẩy điểm${cost?` (−${cost} xu)`:" (lần đầu miễn phí)"}. Hãy cộng lại điểm.</span>`}}
  else if(b.dataset.btab){QL.tab=b.dataset.btab}
  else if(b.dataset.takeall){for(const x of c.temp)addItem(x.id,x.q);c.temp=[];QL.msg=`<span class="mok">Đã chuyển vào rương.</span>`}
  else if(b.dataset.unequip){const id=c.equip[b.dataset.unequip];if(id){addItem(id);delete c.equip[b.dataset.unequip];QL.msg=`<span class="mok">Đã tháo ${ITEMS[id].n}.</span>`}}
  else if(b.dataset.item&&QL.tab==="ruong"){const id=b.dataset.item;
    if(id==="_the"||id==="_bh"){openWin("ql","star");return}
    const it=ITEMS[id];if(it.slot){if(takeItem(id)){const old=c.equip[it.slot];if(old)addItem(old);c.equip[it.slot]=id;QL.msg=`<span class="mok">Đã trang bị ${it.n}: ${bTxt(it.b)}.</span>`}}
    else if(it.use&&takeItem(id)){QL.msg=`<span class="mok">Dùng ${it.n}: ${it.use()}.</span>`}}
  saveLocal();render();renderQLNV()});

/* ---------- thẻ cầu thủ (bố cục giống bản gốc) ---------- */
const SELL={p:null};
function openCard(team,i){
  const p=squad(team)[i];if(!p)return;const top=Object.entries(OVR[p.pos]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
  const at=k=>`<div class="at" title="${ATTR.find(a=>a[0]===k)[2]}"><span>${LBL[k]}</span><span class="b"><i style="width:${clamp(p[k]/7,2,100)}%"></i></span><span class="v ${top.includes(k)?"hi":""}">${fmt1(p[k])}</span></div>`;
  const isSub=(team.subs||[]).includes(p),own=team===T.home,price=Math.round(overall(p)*80/100)*100;
  const sk=Array.from({length:8},(_,j)=>{const s=(p.skills||[])[j];if(!s)return`<span class="sk2"></span>`;const k=SKILLS[s.id],on=(p.star||0)>=s.star;
    return`<span class="sk2 ${on?"on":""}" title="${k.n}${on?"":` — cần ★${s.star}`}: ${k.desc}">${skIco(s.id)||`<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="${on?"#f59e0b":"#6b7280"}"/><text x="20" y="25" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${k.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</text></svg>`}${on?"":"<i>🔒</i>"}</span>`}).join("");
  /* thẻ kiểu FIFA: khiên màu theo bậc + 19 chỉ số chia nhóm (màu số theo mức bậc mà chỉ số đạt tới) */
  const POS_AB={TM:"TM",HV:"TRV",HVC:"HVC",TV:"TV",TVC:"TVC","TĐ":"TĐ"},CAPS=[250,330,410,500,625,750];
  const qv=v=>{let k=0;while(k<6&&v>=CAPS[k])k++;return k},av=a=>a.reduce((s,x)=>s+x,0)/a.length;
  const six=p.pos==="TM"?[["CỨU",p.cuu],["ĐẤM",p.dbong],["KHC",p.kchien],["NHẢY",p.bat],["TĐ",p.toc],["THỂ",p.the]]
    :[["TĐ",av([p.toc,p.bpha])],["SÚT",av([p.sut,p.sxa])],["CHU",av([p.chuyen,p.cdai])],["RÊ",p.re],["THỦ",av([p.xoac,p.doat])],["THỂ",av([p.the,p.ben,p.bat])]];
  const GR=[["Tấn công",["sut","sxa","dau","pden","dphat"]],["Kỹ thuật",["re","chuyen","cdai","pgoc"]],["Thể chất",["toc","bpha","bat","the","ben"]],["Phòng ngự",["xoac","doat"]],["Thủ môn",["cuu","dbong","kchien"]]];
  natFix();const ord=p.pos==="TM"?[4,2,0,1,3]:[0,1,2,3,4],nat=NATIONS[p.q]?NATIONS[p.q].n:"Việt Nam",img=(p.tier===6&&typeof ICON_IMG!=="undefined"&&ICON_IMG[p.n])||faceSrc(p);
  const grp=gi=>{const [gn,ks]=GR[gi],ga=av(ks.map(k=>p[k]));return`<div class="fc-grp"><h4>${gn}<b class="fq${qv(ga)}">${Math.round(ga)}</b></h4>${ks.map(k=>{const v=p[k],m=maxOf(p,k)+(p.imp[k]||0)+(p.starB[k]||0),c=qv(v);
    return`<div class="fc-row" title="${ATTR.find(x=>x[0]===k)[2]}"><span>${LBL[k]}</span><span class="fc-bar"><i class="fc-lim" style="width:${Math.min(100,m/7.5)}%"></i><i class="fc-cur fb${c}" style="width:${Math.min(100,v/7.5)}%"></i></span><span class="fc-v fq${c}">${fmt1(v)}</span></div>`}).join("")}</div>`};
  modal.innerHTML=`<div class="pcard fc" role="dialog" aria-label="Thẻ cầu thủ ${p.n}"><div class="hd"><span class="ctab">Cầu thủ</span><button id="mclose" aria-label="Đóng">✕</button></div>
   <div class="fc-main"><div class="fc-col">
     <div class="fc-card ft${p.tier??2}${p.tier===6?"":" fs"}"><div class="fc-ovr"><b>${Math.round(overall(p))}</b><span>${POS_AB[p.pos]}</span><i>${nat}</i><em>${tierOf(p).n}</em><u class="fc-flag" title="${nat}">${flagSvg(p.q)}</u></div><s class="fc-st sg${(p.star||0)>=8?3:(p.star||0)>=5?2:(p.star||0)>=2?1:0}${(p.star||0)>=10?" smax":""}" title="Cấp sao ${p.star||0}">${p.star||0}</s>
      <div class="fc-face">${img?`<img src="${img}" alt="">`:`<canvas id="fcav" width="150" height="170"></canvas>`}</div>
      <div class="fc-nm${p.n.length>12?" nl":""}">${p.n}</div><div class="fc-rule"></div>
      <div class="fc-six">${six.map(([k,v])=>`<div><b>${Math.round(v)}</b><span>${k}</span></div>`).join("")}</div>${p.tier===6?'<i class="ic-fx ic-sweep"></i><i class="ic-fx ic-holo"></i><i class="ic-fx ic-glare"></i>'+[[22,14,0],[80,24,.8],[28,46,1.5],[74,56,.4],[52,7,2],[88,40,1.1]].map(([x,y,dl])=>`<i class="ic-sp" style="left:${x}%;top:${y}%;animation-delay:${dl}s"></i>`).join(""):""}</div>
     <div class="fc-stars" aria-label="${p.star||0} sao">${"★".repeat(p.star||0)}<i>${"★".repeat(10-(p.star||0))}</i></div>
     <div class="skg">${sk}</div></div>
    <div class="fc-info">
     <div class="fc-head"><h3>${p.n}</h3><span class="fc-chip" style="border-color:${tierOf(p).c};color:${tierOf(p).c}">Bậc ${tierOf(p).n} · trần ${tierOf(p).cap}</span><span class="fc-chip">${POSN[p.pos]}</span><span class="fc-chip">Chân ${p.chan==="T"?"trái":"phải"}</span><span class="fc-chip">${nat}</span></div>
     <div class="fc-meta"><div><small>Thực lực</small><b>${fmt1(overall(p))}</b></div><div><small>Tối đa hiện tại</small><b>${fmt1(overallMax(p))}</b></div>
      <div><small>Độ kích thích · ${p.ktUsed}/10 lần</small><b>${Math.round(p.kt)}%</b><span class="fc-kt"><i style="width:${p.kt}%"></i></span></div>
      <div><small>Tuổi · Cao · Nặng</small><b>${p.age} · ${p.cao} · ${p.nang}</b></div></div>
     <div class="fc-groups">${ord.map(grp).join("")}</div>
     <div class="fc-leg"><span>Màu theo mức bậc:</span><span><i class="fb0"></i>&lt;250</span><span><i class="fb1"></i>250+</span><span><i class="fb2"></i>330+</span><span><i class="fb3"></i>410+</span><span><i class="fb4"></i>500+</span><span><i class="fb5"></i>625+</span><span><i class="fb6"></i>750+</span><span><i class="fc-limk"></i>giới hạn luyện hiện tại</span></div>
     ${team===DBT?`<p class="fc-tp">Thích nghi ${p.tn}% · Ra ở Môi giới: ${RAND_NAT.includes(p.q)?`thị trường ${natName(p)} hoặc Toàn cầu`:"thị trường Toàn cầu"}</p>`:`<p class="fc-tp">Điểm huấn luyện: <b>${fmt(Math.round(p.tp))}</b> · Thích nghi ${p.tn}% <button class="lnk" data-go="buytp">Cấp tốc nhận điểm</button></p>`}
     <div class="fc-acts">${own?`<button class="pri" data-go="plan">Huấn luyện</button><button data-go="kich">Kích thích</button><button data-go="imp">Cải tiến</button><button data-go="star">Lên sao</button><button data-go="sell" ${isSub?"":"disabled title=\"Chỉ bán được cầu thủ dự bị\""}>${SELL.p===p?`Xác nhận bán (+${fmt(price)} vàng)`:"Bán cầu thủ"}</button>`:`<span class="note2">${team===DBT?(squad(T.home).some(x=>x.n===p.n&&x.tier===p.tier)?"Đã có trong đội của bạn":"Cầu thủ trong hệ thống · chỉ số lúc vừa tuyển"):"Cầu thủ đội bạn"}</span>`}</div>
    </div></div></div>`;
  {const ic=modal.querySelector(".fc-card.ft6");if(ic){ic.classList.add("reveal");
    ic.addEventListener("pointermove",e=>{const r=ic.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;ic.classList.add("live");
      ic.style.setProperty("--ry",((px-.5)*26)+"deg");ic.style.setProperty("--rx",((.5-py)*22)+"deg");ic.style.setProperty("--mx",px*100+"%");ic.style.setProperty("--my",py*100+"%");ic.style.setProperty("--o",1)});
    ic.addEventListener("pointerleave",()=>{ic.classList.remove("live");ic.style.setProperty("--rx","0deg");ic.style.setProperty("--ry","0deg");ic.style.setProperty("--o",0)})}}
  modal.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{const g=b.dataset.go;
    if(g==="sell"){if(SELL.p!==p){SELL.p=p;openCard(team,i);return}team.subs.splice(team.subs.indexOf(p),1);give({gold:price});SELL.p=null;modal.hidden=true;toast(`Đã bán ${p.n}: +${fmt(price)} vàng`);news(`${club().mgr.name} đã bán ${p.n}.`);applyLineup(team);saveLocal();render();renderSquad();if(!winEl.hidden){renderLineup()}return}
    if(g==="buytp"){if(T.club.phieu<10){toast("Cần 10 phiếu.");return}T.club.phieu-=10;p.tp+=1000;saveLocal();render();openCard(team,i);toast("+1.000 điểm huấn luyện");return}
    SELL.p=null;modal.hidden=true;mgrOpen(team,i,g)});
  {const cv=document.getElementById("fcav");if(cv)drawChar(cv.getContext("2d"),{p,team,face:1,anim:"pose"},0,75,166,150,true)}
  modal.hidden=false;document.getElementById("mclose").focus();
}

window.mstat=mstat;window.addItem=addItem;cm();
window.flag=flag;window.onMatchEnd=onMatchEnd;window.lobbyRender=lobbyRender;window.chatSubscribe=chatSubscribe;
T.rival=T.rival||T.away;club();setMode("lobby");
/* ---------- nút Toàn màn hình (như F11, ẩn thanh công cụ trình duyệt) ---------- */
(function(){const b=document.getElementById("bFull");if(!b)return;
  const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  const sync=()=>{b.textContent=isFs()?"✕ Thoát toàn màn hình":"⛶ Toàn màn hình"};
  async function toggle(){try{if(isFs()){await (document.exitFullscreen||document.webkitExitFullscreen).call(document)}
    else{const el=document.documentElement;await (el.requestFullscreen||el.webkitRequestFullscreen).call(el)}}
    catch(e){toast("Trình duyệt không cho bật toàn màn hình ở trang này. Hãy bấm phím F11.")}}
  b.onclick=toggle;document.addEventListener("fullscreenchange",sync);document.addEventListener("webkitfullscreenchange",sync);
  document.addEventListener("keydown",e=>{if((e.key==="f"||e.key==="F")&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!e.ctrlKey&&!e.metaKey&&!e.altKey)toggle()});
  if(!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen))b.hidden=true;sync()})();
/* ---------- Chơi lại từ đầu (Cài đặt) ---------- */
(function(){const b=document.getElementById("bNewGame");if(!b)return;let armed=0;
  b.onclick=async()=>{if(!armed){armed=setTimeout(()=>{armed=0;b.textContent="Chơi lại từ đầu"},4000);b.textContent="Bấm lần nữa để xác nhận xóa đội";return}
    clearTimeout(armed);armed=0;b.textContent="Chơi lại từ đầu";const name=club().mgr.name;
    T=freshT();T.rival=T.away;club().mgr.name=name;newMatch();mgrRender();renderLineup();
    try{if(db)await fbSave(false);else saveLocal()}catch(e){saveLocal()}
    closeWin();setMode("lobby");toast("Đã tạo đội mới. Chúc bạn may mắn ở Môi giới!")}})();
// Cài đặt: bật/tắt độ nét cao của sân
{const h=document.getElementById("setHires");if(h){h.checked=HIRES;h.onchange=()=>setHires(h.checked)}}
natFix();
