# Gộp các khung hình PNG thành atlas: python3 tools/build_atlas.py <thư mục frames> <thư mục ra>
# Sau đó cập nhật SPRITE_META trong js/sprites.js bằng phần meta in trong sprites.js được tạo ra.
import os,sys,json,base64,io
from PIL import Image
SRC=sys.argv[1];OUT=sys.argv[2]
CH={
 "std":{"ref":215,"anims":{"idle":"cau thu idle","run":"cau thu chay","pass":"cau thu chuyen bong","slide":"cau thu cuop bong","head":"cau thu danh dau","shot":"cau thu sut",
   "long":"sut xa","cele":"an mung","siu":"an mung doc quyen cua cr7","stepover":"ki nang dao banh cua CR7","bike":"nga ban den","regret":"sut hut","roulette":"xoay compa ki nang"}},
 "gk":{"ref":172,"anims":{"idle":["thu mon idle",345],"catch":"thu mon bat bong","dive":"thu mon bay nguoi bat bong"}}}
TARGET=130
meta={};js=[]
for key,c in CH.items():
  rows=[]
  for an,d in c["anims"].items():
    ref=c["ref"]
    if isinstance(d,list):d,ref=d
    fs=sorted(f for f in os.listdir(os.path.join(SRC,d)) if f.endswith('.png'))
    k=TARGET/ref
    ims=[Image.open(os.path.join(SRC,d,f)).convert('RGBA') for f in fs]
    ims=[i.resize((max(1,round(i.width*k)),max(1,round(i.height*k))),Image.LANCZOS) for i in ims]
    rows.append((an,ims))
  W=max(sum(i.width+2 for i in ims) for _,ims in rows);H=sum(max(i.height for i in ims)+2 for _,ims in rows)
  at=Image.new('RGBA',(W,H),(0,0,0,0));y=0;m={}
  for an,ims in rows:
    rh=max(i.height for i in ims);x=0;fr=[]
    for i in ims:at.paste(i,(x,y+rh-i.height));fr.append([x,y+rh-i.height,i.width,i.height]);x+=i.width+2
    m[an]=fr;y+=rh+2
  buf=io.BytesIO();at.save(buf,'PNG',optimize=True);b=buf.getvalue()
  at.save(os.path.join(OUT,f'atlas_{key}.png'))
  meta[key]={"ref":TARGET,"anims":m};js.append(f'"{key}":"data:image/png;base64,{base64.b64encode(b).decode()}"')
  print(key,at.size,len(b)//1024,'KB',{a:len(f) for a,f in m.items()})
open(os.path.join(OUT,'sprites.js'),'w').write('const SPRITE_META='+json.dumps(meta,separators=(",",":"))+';\nconst SPRITE_SRC={'+','.join(js)+'};\n')
print(os.path.getsize(os.path.join(OUT,'sprites.js'))//1024,'KB js')
