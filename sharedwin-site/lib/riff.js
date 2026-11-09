/* ====== guitar riff that evolves over time (Web Audio, no file needed) ====== */
var AC=null,master=null,gtrBus=null,noiseBuf=null,riffTimer=null,nextT=0,gstep=0,soundOn=false,TEMPO=118;
var bassBus=null,bassSat=null,leadBus=null,gtrLP=null,gtrPre=null,startT=0,bassIn=false,BASS_DELAY=30;
var RIFF=[
 [[0,0,1,1],[1,0,1,1],[2,0,1,1],[3,0,1,0],[4,0,2,0],[6,3,2,0],[8,0,1,1],[9,0,1,1],[10,0,1,1],[11,0,1,0],[12,5,2,0],[14,3,2,0]],
 [[0,0,1,1],[1,0,1,1],[2,0,1,1],[3,0,1,0],[4,0,2,0],[6,3,2,0],[8,0,1,1],[9,0,1,1],[10,0,1,1],[11,0,1,0],[12,7,2,0],[14,5,2,0]],
 [[0,5,1,1],[1,5,1,1],[2,5,1,1],[3,5,1,0],[4,5,2,0],[6,8,2,0],[8,5,1,1],[9,5,1,1],[10,5,1,1],[11,5,1,0],[12,10,2,0],[14,8,2,0]],
 [[0,7,1,1],[1,7,1,1],[2,7,1,1],[3,7,1,0],[4,7,2,0],[6,5,2,0],[8,3,2,0],[10,0,2,0],[12,0,4,0]]
];
/* busier last bar (second half of the song) */
var RIFF_ALT4=[[0,7,1,1],[1,7,1,1],[2,7,1,1],[3,7,1,0],[4,5,1,1],[5,5,1,1],[6,5,1,0],[7,3,1,1],[8,3,1,1],[9,3,1,0],[10,0,1,1],[11,0,1,1],[12,0,2,0],[14,7,2,0]];
/* breakdown: long ringing chords */
var BREAK=[[[0,0,16,0]],[[0,5,16,0]],[[0,7,16,0]],[[0,0,8,0],[8,3,8,0]]];
/* lead guitar lick, E minor pentatonic, semitones from E4 */
var LEAD=[
 [[0,12,4],[4,10,2],[6,7,2],[8,5,4],[12,7,4]],
 [[0,3,4],[4,5,2],[6,7,2],[8,10,4],[12,7,4]],
 [[0,15,4],[4,12,2],[6,10,2],[8,12,8]],
 [[0,10,2],[2,12,2],[4,10,2],[6,7,2],[8,5,4],[12,0,4]]
];
function dcurve(k){var n=2048,c=new Float32Array(n);for(var i=0;i<n;i++){var x=i*2/n-1;c[i]=(1+k)*x/(1+k*Math.abs(x))}return c}
function initAudio(){
  if(AC)return;
  var Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return;
  AC=new Ctx();
  var comp=AC.createDynamicsCompressor();
  master=AC.createGain();master.gain.value=0;
  master.connect(comp);comp.connect(AC.destination);
  /* rhythm guitar: highpass > preamp > 2-stage distortion > cabinet (speaker) filters */
  gtrBus=AC.createGain();gtrBus.gain.value=1;
  var hp=AC.createBiquadFilter();hp.type="highpass";hp.frequency.value=110;
  gtrPre=AC.createGain();gtrPre.gain.value=1.6;
  var sh1=AC.createWaveShaper();sh1.curve=dcurve(35);sh1.oversample="4x";
  var mid=AC.createBiquadFilter();mid.type="peaking";mid.frequency.value=900;mid.Q.value=0.9;mid.gain.value=6;
  var sh2=AC.createWaveShaper();sh2.curve=dcurve(70);sh2.oversample="4x";
  var cab1=AC.createBiquadFilter();cab1.type="peaking";cab1.frequency.value=2800;cab1.Q.value=1.1;cab1.gain.value=4;
  gtrLP=AC.createBiquadFilter();gtrLP.type="lowpass";gtrLP.frequency.value=3200;gtrLP.Q.value=0.8;
  var post=AC.createGain();post.gain.value=0.7;
  gtrBus.connect(hp);hp.connect(gtrPre);gtrPre.connect(sh1);sh1.connect(mid);mid.connect(sh2);sh2.connect(cab1);cab1.connect(gtrLP);gtrLP.connect(post);post.connect(master);
  /* bass: saturated saw (audible on small speakers) + sub sine */
  bassBus=AC.createGain();bassBus.gain.value=1.3;bassBus.connect(master);
  bassSat=AC.createWaveShaper();bassSat.curve=dcurve(30);
  var blp=AC.createBiquadFilter();blp.type="lowpass";blp.frequency.value=900;blp.Q.value=0.7;
  bassSat.connect(blp);blp.connect(bassBus);
  /* lead guitar: lighter distortion + echo */
  leadBus=AC.createGain();leadBus.gain.value=0.5;
  var lsh=AC.createWaveShaper();lsh.curve=dcurve(25);
  var llp=AC.createBiquadFilter();llp.type="lowpass";llp.frequency.value=4500;
  var dly=AC.createDelay(1);dly.delayTime.value=60/TEMPO*0.75;
  var fb=AC.createGain();fb.gain.value=0.33;var wet=AC.createGain();wet.gain.value=0.35;
  leadBus.connect(lsh);lsh.connect(llp);llp.connect(master);
  llp.connect(dly);dly.connect(fb);fb.connect(dly);dly.connect(wet);wet.connect(master);
  noiseBuf=AC.createBuffer(1,AC.sampleRate*0.5,AC.sampleRate);
  var d=noiseBuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
}
function chord(t,semi,dur){
  var base=82.41*Math.pow(2,semi/12);
  /* power chord: root, fifth, octave; one oscillator each, slightly different tuning like real strings */
  [[1,-3],[1.4983,2],[2,-2]].forEach(function(r){
    var o=AC.createOscillator();o.type="sawtooth";o.frequency.value=base*r[0];o.detune.value=r[1];
    var g=AC.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.linearRampToValueAtTime(0.28,t+0.004);
    g.gain.exponentialRampToValueAtTime(0.16,t+Math.min(0.12,dur*0.4));
    g.gain.setValueAtTime(0.16,t+dur*0.7);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(gtrBus);
    o.start(t);o.stop(t+dur+0.05);
  });
  /* pick attack: very short burst of noise through the same amp */
  var n=AC.createBufferSource();n.buffer=noiseBuf;
  var nf=AC.createBiquadFilter();nf.type="bandpass";nf.frequency.value=2400;nf.Q.value=0.8;
  var ng=AC.createGain();ng.gain.setValueAtTime(0.18,t);ng.gain.exponentialRampToValueAtTime(0.001,t+0.025);
  n.connect(nf);nf.connect(ng);ng.connect(gtrBus);n.start(t);n.stop(t+0.04);
}
function bass(t,semi,dur){
  var f=41.2*Math.pow(2,semi/12);
  var o=AC.createOscillator();o.type="sawtooth";o.frequency.value=f;
  var s=AC.createOscillator();s.type="sine";s.frequency.value=f;
  var g=AC.createGain(),g2=AC.createGain();
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.55,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  g2.gain.setValueAtTime(0.0001,t);g2.gain.linearRampToValueAtTime(0.7,t+0.012);g2.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(bassSat);s.connect(g2);g2.connect(bassBus);
  o.start(t);s.start(t);o.stop(t+dur+0.05);s.stop(t+dur+0.05);
}
function lead(t,semi,dur){
  var f=329.63*Math.pow(2,semi/12);
  var o=AC.createOscillator();o.type="sawtooth";o.frequency.value=f;
  var o2=AC.createOscillator();o2.type="square";o2.frequency.value=f;o2.detune.value=6;
  var m2=AC.createGain();m2.gain.value=0.4;
  var lfo=AC.createOscillator();lfo.frequency.value=5.5;
  var lg=AC.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(14,t+Math.min(0.3,dur));
  lfo.connect(lg);lg.connect(o.detune);lg.connect(o2.detune);
  var g=AC.createGain();
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.5,t+0.02);
  g.gain.setValueAtTime(0.5,t+dur*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);o2.connect(m2);m2.connect(g);g.connect(leadBus);
  lfo.start(t);o.start(t);o2.start(t);
  lfo.stop(t+dur+0.05);o.stop(t+dur+0.05);o2.stop(t+dur+0.05);
}
function kick(t){
  var o=AC.createOscillator(),g=AC.createGain();
  o.type="sine";o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);
  g.gain.setValueAtTime(0.9,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+0.22);
}
function noise(t,type,freq,vol,dur){
  var s=AC.createBufferSource();s.buffer=noiseBuf;
  var f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;
  var g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+dur+0.02);
}
/* song structure: 12 cycles of 4 bars (about 97 s), then it loops from cycle 2 */
function cyc(){var c=Math.floor(gstep/64);return c<12?c:2+((c-2)%10)}
function playStep(n,t){
  var bar=Math.floor((n%64)/16),st=n%16,sx=60/TEMPO/4,ci=cyc();
  var notes=ci===10?BREAK[bar]:((ci>=8&&ci<10&&bar===3)?RIFF_ALT4:RIFF[bar]);
  notes.forEach(function(x){
    if(x[0]===st)chord(t,x[1],x[3]?sx*0.55:x[2]*sx*0.95);
  });
  /* bass joins after BASS_DELAY seconds, on the first beat of a bar, with a crash */
  if(!bassIn&&st===0&&t>=startT+BASS_DELAY){bassIn=true;noise(t,"highpass",5000,0.35,1.4);}
  if(bassIn){
    notes.forEach(function(x){
      if(x[0]===st)bass(t,x[1],x[3]?sx*0.7:x[2]*sx*0.98);
    });
  }
  /* lead guitar from the 7th cycle (about 49 s) */
  if(ci>=6&&ci<10){
    LEAD[bar].forEach(function(x){
      if(x[0]===st)lead(t,x[1],x[2]*sx*0.95);
    });
  }
  /* drums */
  var intro=ci<2,brk=ci===10,roll=ci===11;
  if(st===0&&bar===0&&(ci===2||ci===6||ci===8))noise(t,"highpass",5000,0.3,1.2);
  if(!intro&&!brk){
    if(st===0||st===8||(st===6&&(bar===1||bar===3))||(st===10&&bar===3))kick(t);
    if((st===4||st===12)&&!(roll&&bar===3&&st===12))noise(t,"bandpass",1800,0.45,0.16);
  }
  if(brk&&st===0)kick(t);
  if(roll&&bar===3&&st>=8)noise(t,"bandpass",1800,0.18+(st-8)*0.05,0.1);
  if(intro){if(st%4===0)noise(t,"highpass",7000,0.07,0.04);}
  else if(brk){if(st%8===0)noise(t,"highpass",7000,0.09,0.05);}
  else if(ci>=8&&ci<10){noise(t,"highpass",7000,st%2===0?0.13:0.05,0.035);}
  else if(st%2===0)noise(t,"highpass",7000,st%4===0?0.16:0.09,0.04);
}
function schedule(){
  while(nextT<AC.currentTime+0.12){playStep(gstep,nextT);nextT+=60/TEMPO/4;gstep++}
}
function toggleSound(){
  initAudio();
  if(!AC)return;
  if(AC.state==="suspended")AC.resume();
  soundOn=!soundOn;
  if(soundOn){
    var now=AC.currentTime;
    nextT=now+0.06;gstep=0;startT=nextT;bassIn=false;
    /* the guitar gets brighter and angrier during the first minute */
    gtrLP.frequency.cancelScheduledValues(now);gtrLP.frequency.setValueAtTime(2600,now);gtrLP.frequency.linearRampToValueAtTime(4200,now+60);
    gtrPre.gain.cancelScheduledValues(now);gtrPre.gain.setValueAtTime(1.4,now);gtrPre.gain.linearRampToValueAtTime(2.2,now+60);
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(0.55,now,0.03);
    riffTimer=setInterval(schedule,25);
  }else{
    clearInterval(riffTimer);riffTimer=null;
    master.gain.setTargetAtTime(0,AC.currentTime,0.05);
  }
}
function soundLabel(){return soundOn?"♪ On":"♪ Off"}
export function toggleRiff(){toggleSound();return soundOn}
export function isRiffOn(){return soundOn}
