/* PickMe heart bubble background. Independent, pooled and visibility aware. */
(() => {
'use strict';
const canvas=document.getElementById('heart-bubble-stage');
if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
if(!ctx)return;
const windGlow=document.getElementById('heart-wind-glow');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const coarse=matchMedia('(pointer: coarse)');
const COLORS=['#ff2a5f','#ff174f','#ff6688','#ff91a9','#9b5de5','#c77dff','#7b2cbf','#00c9b7','#00a9e8','#4cc9f0','#f9d84a','#f15bb5'];
const LAYERS=['bg','mg','fg'],CACHE=88,TAU=Math.PI*2;
const pointer={x:-1000,y:-1000,lastX:-1000,isDown:false};
const wind={force:0,target:0,active:0,cooldown:90,glow:-1};
let width=innerWidth,height=innerHeight,dpr=1,lastTime=0,raf=0,visible=!document.hidden,lowMotion=reduced.matches;
let hearts=Object.create(null),starAsset=null;
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function heartPath(c){
 c.beginPath();c.moveTo(0,-.3);c.bezierCurveTo(0,-.9,.9,-.9,.9,-.3);c.bezierCurveTo(.9,.4,0,.9,0,1.2);c.bezierCurveTo(0,.9,-.9,.4,-.9,-.3);c.bezierCurveTo(-.9,-.9,0,-.9,0,-.3);c.closePath();
}
function prerender(){
 hearts=Object.create(null);
 for(const color of COLORS){
  hearts[color]=Object.create(null);
  for(const layer of LAYERS){
   const asset=document.createElement('canvas');asset.width=asset.height=Math.round(CACHE*dpr);
   const c=asset.getContext('2d');c.scale(dpr,dpr);c.translate(CACHE/2,CACHE/2-3);c.scale(29,29);
   c.filter=layer==='bg'?'blur(2px) brightness(.62)':layer==='fg'?'blur(.6px) brightness(1.15)':'none';
   c.shadowBlur=layer==='bg'?9:14;c.shadowColor=color;c.fillStyle=color;heartPath(c);c.fill();
   c.filter='none';c.shadowBlur=0;c.fillStyle='rgba(255,255,255,.38)';c.save();c.translate(-.2,-.2);c.scale(.62,.62);heartPath(c);c.fill();c.restore();
   hearts[color][layer]=asset;
  }
 }
 starAsset=document.createElement('canvas');starAsset.width=starAsset.height=48*dpr;
 const s=starAsset.getContext('2d');s.scale(dpr,dpr);s.translate(24,24);s.fillStyle='#fff';s.shadowBlur=9;s.shadowColor='#fff';s.beginPath();s.moveTo(0,-17);s.quadraticCurveTo(0,0,17,0);s.quadraticCurveTo(0,0,0,17);s.quadraticCurveTo(0,0,-17,0);s.quadraticCurveTo(0,0,0,-17);s.fill();
}
class Particle{
 constructor(){this.active=false}
 spawn(x,y,color,scale,layer){this.active=true;this.x=x;this.y=y;this.color=color;const speed=rand(2,layer==='fg'?8:layer==='bg'?4:6)*scale,angle=Math.random()*TAU;this.vx=Math.cos(angle)*speed;this.vy=Math.sin(angle)*speed;this.alpha=1;this.decay=rand(.025,.055);this.size=rand(1.2,3.2)}
 update(dt){if(!this.active)return;const f=Math.pow(.92,dt);this.vx*=f;this.vy=this.vy*f+.1*dt;this.vx+=wind.force*.08*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.alpha-=this.decay*dt;if(this.alpha<=0)this.active=false}
 draw(){if(!this.active)return;ctx.globalAlpha=this.alpha;ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,TAU);ctx.fill()}
}
class Star{
 constructor(){this.active=false}
 spawn(x,y,layer){this.active=true;this.x=x;this.y=y;this.scale=.1;this.target=layer==='fg'?.9:layer==='bg'?.28:.58;this.alpha=1;this.rotation=rand(0,Math.PI);this.spin=rand(-.05,.05)}
 update(dt){if(!this.active)return;this.scale+=(this.target-this.scale)*Math.min(1,.2*dt);this.rotation+=this.spin*dt;this.alpha-=.035*dt;if(this.alpha<=0)this.active=false}
 draw(){if(!this.active)return;ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rotation);ctx.scale(this.scale,this.scale);ctx.globalAlpha=this.alpha;ctx.drawImage(starAsset,-24,-24,48,48);ctx.restore()}
}
class Glimmer{
 constructor(){this.reset();this.phase=rand(0,TAU)}
 reset(){this.x=Math.random()*width;this.y=Math.random()*height;this.speed=rand(.008,.025);this.size=rand(.45,1.7)}
 update(dt){this.phase+=this.speed*dt}
 draw(){ctx.globalAlpha=(Math.sin(this.phase)+1)*.18;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,TAU);ctx.fill()}
}
class WindLine{
 constructor(){this.active=false}
 spawn(force){this.active=true;const dir=Math.sign(force)||1,strength=Math.abs(force);this.x=dir>0?rand(-width*.5,width*.5):rand(width*.5,width*1.5);this.y=this.baseY=Math.random()*height;this.length=rand(55,120)+strength*22;this.speed=dir*(rand(7,15)+strength*2);this.alpha=0;this.targetAlpha=rand(.035,.13);this.life=0;this.maxLife=rand(45,85);this.phase=rand(0,TAU)}
 update(dt){if(!this.active)return;this.x+=this.speed*dt;this.phase+=.1*dt;this.y=this.baseY+Math.sin(this.phase)*4;this.life+=dt;if(this.life<15)this.alpha+=(this.targetAlpha-this.alpha)*Math.min(1,.1*dt);else if(this.life>this.maxLife-15)this.alpha*=Math.pow(.8,dt);if(this.life>=this.maxLife||(this.life>15&&this.alpha<.008))this.active=false}
 draw(){if(!this.active)return;ctx.globalAlpha=this.alpha;ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.length*Math.sign(this.speed),this.y);ctx.stroke()}
}
const particles=Array.from({length:220},()=>new Particle()),stars=Array.from({length:20},()=>new Star()),glimmers=Array.from({length:48},()=>new Glimmer()),windLines=Array.from({length:28},()=>new WindLine());
function explosion(x,y,color,size,layer){
 let n=0,target=10+(Math.random()*9|0);for(const p of particles){if(!p.active){p.spawn(x,y,color,size,layer);if(++n>=target)break}}
 n=0;const total=Math.random()>.5?2:1;for(const s of stars){if(!s.active){s.spawn(x,y,layer);if(++n>=total)break}}
}
class Bubble{
 constructor(){this.reset(true)}
 reset(initial=false){
  this.baseX=this.x=Math.random()*width;this.y=initial?rand(height*.08,height*.92):height+rand(30,130);
  const depth=Math.random();this.layer=depth<.28?'bg':depth<.8?'mg':'fg';
  const base=this.layer==='bg'?.3:this.layer==='fg'?.82:.58;this.targetSize=rand(.78,1.2)*base;this.currentSize=initial?this.targetSize:0;
  const speed=this.layer==='bg'?.5:this.layer==='fg'?1.45:1;this.speed=rand(.8,2.2)*speed;this.angle=rand(0,TAU);this.spin=rand(-.025,.025);this.phase=rand(0,TAU);
  this.color=COLORS[Math.random()*COLORS.length|0];this.popHeight=rand(0,height*.85);this.state='rising';this.swell=0;this.alpha=this.layer==='bg'?rand(.38,.68):rand(.72,.96);this.respawn=0;
 }
 update(dt){
  if(this.state==='dead'){this.respawn-=dt;if(this.respawn<=0)this.reset();return}
  if(this.currentSize<this.targetSize&&this.state==='rising')this.currentSize+=(this.targetSize-this.currentSize)*Math.min(1,.08*dt);
  if(this.state==='rising'){
   this.y-=this.speed*dt;this.angle+=this.spin*dt;this.phase+=.05*dt;
   const dx=this.x-pointer.x,dy=this.y-pointer.y,distSq=dx*dx+dy*dy,r=145;
   if(distSq<r*r&&distSq>.01){const dist=Math.sqrt(distSq),force=(r-dist)/r;this.baseX+=dx/dist*force*8*dt;this.y+=dy/dist*force*8*dt}
   this.baseX+=wind.force*dt*this.speed*.38;if(this.baseX>width+55)this.baseX=-55;if(this.baseX< -55)this.baseX=width+55;
   this.x=this.baseX+Math.sin(this.angle)*(this.layer==='bg'?13:29);
   if(this.y<this.popHeight&&Math.random()<.009*dt)this.state='swelling';
   if(this.y< -100){this.state='dead';this.respawn=rand(0,10)}
  }else if(this.state==='swelling'){this.swell+=dt;this.currentSize+=.075*dt;this.alpha-=.055*dt;if(this.swell>7)this.pop()}
 }
 pop(){if(this.state==='dead')return;this.state='dead';this.respawn=rand(5,22);explosion(this.x,this.y,this.color,this.targetSize,this.layer)}
 draw(){
  if(this.state==='dead')return;const breath=Math.sin(this.phase)*.055,stretch=this.speed*.025;
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle*.12);ctx.scale(this.currentSize*(1+breath-stretch),this.currentSize*(1-breath+stretch));ctx.globalAlpha=Math.max(0,this.alpha);
  ctx.drawImage(hearts[this.color][this.layer],-CACHE/2,-CACHE/2,CACHE,CACHE);ctx.restore();
 }
}
const bubbles=Array.from({length:coarse.matches?18:24},()=>new Bubble());
function resize(){
 width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);const next=Math.min(devicePixelRatio||1,coarse.matches?1.5:2),changed=next!==dpr;dpr=next;
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(changed||!starAsset)prerender();
 for(const b of bubbles){b.x=clamp(b.x,-60,width+60);b.baseX=clamp(b.baseX,-60,width+60)}
 for(const g of glimmers){g.x=Math.random()*width;g.y=Math.random()*height}
 if(lowMotion)drawScene(0,false);
}
function updateWind(dt){
 if(wind.cooldown>0){wind.cooldown-=dt;wind.target=0;if(wind.cooldown<=0){wind.active=rand(60,210);wind.target=rand(-3,3)}}
 else if(wind.active>0){wind.active-=dt;if(wind.active<=0){wind.target=0;wind.cooldown=rand(150,450)}}
 wind.force+=(wind.target-wind.force)*Math.min(1,.02*dt);
 const glow=Math.min(1,Math.abs(wind.force)/4);if(windGlow&&Math.abs(glow-wind.glow)>.025){windGlow.style.opacity=String(glow);wind.glow=glow}
 if(Math.abs(wind.force)>.4&&Math.random()<Math.abs(wind.force)*.12*dt){const line=windLines.find(x=>!x.active);if(line)line.spawn(wind.force)}
}
function drawScene(dt,animate){
 ctx.clearRect(0,0,width,height);ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';
 for(const g of glimmers){if(animate)g.update(dt);g.draw()}
 ctx.globalCompositeOperation='source-over';
 for(const layer of LAYERS)for(const b of bubbles)if(b.layer===layer){if(animate)b.update(dt);b.draw()}
 ctx.globalCompositeOperation='lighter';
 for(const p of particles){if(animate)p.update(dt);p.draw()}
 for(const s of stars){if(animate)s.update(dt);s.draw()}
 for(const l of windLines){if(animate)l.update(dt);l.draw()}
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
}
function frame(now){
 raf=0;if(!visible||lowMotion)return;
 try{
  if(!lastTime)lastTime=now;const dt=clamp((now-lastTime)/16.667,0,2.5);lastTime=now;
  updateWind(dt);
  if(pointer.isDown&&pointer.lastX!==-1000){const drag=pointer.x-pointer.lastX;if(Math.abs(drag)>8){wind.target=clamp(drag/7,-4,4);wind.active=55;wind.cooldown=0}}
  drawScene(dt,true);raf=requestAnimationFrame(frame);
 }catch(error){console.error('PickMe ambient animation paused after a rendering error:',error);stop();staticFrame()}
}
function start(){if(!visible||lowMotion||raf)return;lastTime=0;raf=requestAnimationFrame(frame)}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0}
function staticFrame(){if(width&&height)drawScene(0,false)}
function interactive(target){return !!(target&&target.closest&&target.closest('button,a,input,textarea,select,[role="button"],[contenteditable="true"]'))}
addEventListener('pointermove',e=>{pointer.lastX=pointer.x;pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});
addEventListener('pointerdown',e=>{
 if(interactive(e.target))return;pointer.isDown=true;pointer.lastX=pointer.x=e.clientX;pointer.y=e.clientY;
 for(let i=bubbles.length-1;i>=0;i--){const b=bubbles[i];if(b.state==='dead')continue;const dx=b.x-pointer.x,dy=b.y-pointer.y,r=38*b.currentSize+13;if(dx*dx+dy*dy<r*r){b.pop();break}}
},{passive:true});
const release=()=>{pointer.isDown=false;pointer.lastX=-1000};
addEventListener('pointerup',release,{passive:true});addEventListener('pointercancel',release,{passive:true});addEventListener('blur',()=>{release();pointer.x=pointer.y=-1000});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)start();else stop()});
const motionChange=e=>{lowMotion=e.matches;if(lowMotion){stop();staticFrame();if(windGlow)windGlow.style.opacity='0'}else start()};
if(reduced.addEventListener)reduced.addEventListener('change',motionChange);else reduced.addListener(motionChange);
addEventListener('resize',resize,{passive:true});if(window.visualViewport)window.visualViewport.addEventListener('resize',resize,{passive:true});
resize();if(lowMotion)staticFrame();else start();
})();