export class Synth{private ctx:AudioContext|null=null;private mg:GainNode|null=null;private ag:GainNode|null=null;private fg:GainNode|null=null;ok=false;
unlock(){if(this.ok){if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();return;}try{this.ctx=new AudioContext();this.mg=this.ctx.createGain();this.ag=this.ctx.createGain();this.fg=this.ctx.createGain();this.mg.connect(this.ctx.destination);this.ag.connect(this.mg);this.fg.connect(this.mg);this.ok=true;this.hum();}catch{}}
state(){return{ok:this.ok,st:this.ctx?.state??'none',t:this.ctx?.currentTime??0,mg:this.mg?.gain.value??-1,fg:this.fg?.gain.value??-1};}
set(master:number,amb:number,fx:number){if(!this.ctx)return;const t=this.ctx.currentTime;this.mg!.gain.setTargetAtTime(master*master,t,0.02);this.ag!.gain.setTargetAtTime(amb,t,0.05);this.fg!.gain.setTargetAtTime(fx,t,0.05);}
suspend(){this.ctx?.suspend();}resume(){this.ctx?.resume();}
private env(g:GainNode,t0:number,a:number,peak:number,dec:number){g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(peak,t0+a);g.gain.exponentialRampToValueAtTime(0.001,t0+a+dec);}
tone(f0:number,f1:number,dur:number,vol:number,type:OscillatorType='square'){if(!this.ok)return;const c=this.ctx!,t=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);this.env(g,t,0.005,vol,dur);o.connect(g);g.connect(this.fg!);o.start(t);o.stop(t+dur+0.1);}
noise(dur:number,vol:number,fc:number,q=1){if(!this.ok)return;const c=this.ctx!,t=c.currentTime;const len=Math.ceil(c.sampleRate*dur);const buf=c.createBuffer(1,len,c.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=buf;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fc;f.Q.value=q;const g=c.createGain();this.env(g,t,0.004,vol,dur);s.connect(f);f.connect(g);g.connect(this.fg!);s.start(t);}
shot(kind:string){if(!this.ok)return;const c=this.ctx!,t=c.currentTime;
const crack=(fc:number,v:number)=>{const s=this.nz(0.03);const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=fc;const g=c.createGain();this.env(g,t,0.002,v,0.03);s.connect(f);f.connect(g);g.connect(this.fg!);s.start(t);};
const body=(dur:number,v:number,fc:number,q:number)=>{const s=this.nz(dur);const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fc;f.Q.value=q;const g=c.createGain();this.env(g,t,0.004,v,dur);s.connect(f);f.connect(g);g.connect(this.fg!);s.start(t);};
const tail=(dt:number,dur:number,v:number)=>{const s=this.nz(dur);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=500;const g=c.createGain();g.gain.setValueAtTime(0,t+dt);g.gain.linearRampToValueAtTime(v,t+dt+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+dt+dur);s.connect(f);f.connect(g);g.connect(this.fg!);s.start(t+dt);};
if(kind==='shotgun'){crack(2500,0.8);body(0.25,0.9,300,0.7);this.tone(120,40,0.2,0.5,'sine');tail(0.05,0.4,0.2);}
else if(kind==='smg'||kind==='rapid'){crack(4000,0.5);body(0.08,0.5,1800,1.2);this.tone(300,120,0.06,0.3);tail(0.03,0.15,0.08);}
else if(kind==='rifle'||kind==='marksman'){crack(kind==='marksman'?2800:3200,0.7);body(0.15,0.7,900,1);this.tone(kind==='marksman'?160:200,kind==='marksman'?50:60,0.12,0.4);tail(0.04,0.3,0.15);}
else if(kind==='lmg'){crack(3000,0.7);body(0.18,0.75,700,1);this.tone(180,55,0.14,0.4);tail(0.04,0.32,0.16);}
else{crack(3800,0.6);body(0.1,0.6,1400,1);this.tone(250,90,0.09,0.35);tail(0.03,0.2,0.1);}}
private nz(dur:number){const c=this.ctx!;const len=Math.max(1,Math.ceil(c.sampleRate*dur));const buf=c.createBuffer(1,len,c.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=buf;return s;}
click(){this.noise(0.03,0.3,3000,2);}
flesh(){this.noise(0.08,0.5,350,1);this.tone(140,70,0.08,0.3,'sine');}
snarl(){if(!this.ok)return;const r=0.8+Math.random()*0.4;this.tone(300*r,120*r,0.25,0.3,'sawtooth');this.noise(0.2,0.25,700,1);}
growl(){if(!this.ok)return;const r=0.7+Math.random()*0.5;this.tone(110*r,70*r,0.5,0.25,'sawtooth');}
foeDie(){this.noise(0.3,0.5,450,1);this.tone(220,50,0.3,0.35,'sawtooth');}
sting(){this.tone(440,880,0.15,0.25,'sine');this.tone(660,1320,0.2,0.2,'sine');}
ui(ok=true){this.tone(ok?700:250,ok?900:180,0.07,0.25,'sine');}
hit(head:boolean){this.tone(head?1200:900,head?1400:700,0.05,0.2,'sine');}
hurt(){this.tone(160,60,0.25,0.5,'sawtooth');}
wave(){this.tone(220,440,0.3,0.3,'sawtooth');this.tone(440,880,0.3,0.2,'sine');}
buy(){this.tone(500,1000,0.12,0.3,'sine');}
empty(){this.tone(1500,1200,0.03,0.15);}
reload(){this.noise(0.06,0.3,2500,2);}
private hum(){if(!this.ok)return;const c=this.ctx!;const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=55;f.type='lowpass';f.frequency.value=120;g.gain.value=0.05;o.connect(f);f.connect(g);g.connect(this.ag!);o.start();}}