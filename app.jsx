// Pim Fit broncode. De app zelf gebruikt index.html (al omgezet), dit bestand is om later verder te bouwen.
const {useState,useEffect,useRef,useMemo}=React;

// ─── CONSTANTEN ───────────────────────────────────────────────────────────────
const DAYS=["Upper A","Lower","Upper B","Upper C"];
const DAY_COLORS=["#a3e635","#38bdf8","#f472b6","#fb923c"];
const MUSCLES=["chest","back","shoulders","biceps","triceps","quads","hamstrings","glutes","calves","core"];
const MUSCLE_COLORS={chest:"#f472b6",back:"#38bdf8",shoulders:"#fb923c",biceps:"#a3e635",triceps:"#c084fc",quads:"#38bdf8",hamstrings:"#fb923c",glutes:"#f472b6",calves:"#a3e635",core:"#a8a8b0"};
const TARGETS={chest:6,back:8,shoulders:8,biceps:6,triceps:6,quads:8,hamstrings:3,glutes:4,calves:4,core:3};
const SUPPLEMENTS=[{id:"creatine",label:"Creatine",dose:"5 g"},{id:"vitd",label:"Vitamine D",dose:"2000 IE"},{id:"mag",label:"Magnesium + B6",dose:"voor het slapen"}];
const QUOTES=["Small steps every day beat giant leaps once in a while.","The body achieves what the mind believes.","Train hard, recover harder.","Progress, not perfection.","Every rep is a vote for the person you want to become.","Discipline is doing it even when you don't feel like it.","You don't have to be extreme, just consistent.","The pain you feel today is the strength you feel tomorrow.","Show up. That's already 80% of it.","Results happen over time, not overnight.","Your only competition is who you were yesterday.","Hard work beats talent when talent doesn't work hard.","Fall in love with the process.","Rest is part of the training.","You're one workout away from a better mood.","Earn it.","Make yourself proud.","Consistency is the key to results.","Harder than yesterday.","Don't stop when you're tired. Stop when you're done.","The secret is there is no secret. Just work.","Champions train, losers complain.","It never gets easier, you just get stronger.","Succes is de som van kleine inspanningen, dag na dag.","Jij bent sterker dan je excuses.","Doe het voor de versie van jou die trots op je is."];
const WORKOUTS={
  "Upper A":[
    {id:"ua1",name:"Incline Dumbbell Press",detail:"chest",muscle:"chest",sets:"3×6-8"},
    {id:"ua2",name:"Pec Deck",detail:"chest",muscle:"chest",sets:"3×10-12"},
    {id:"ua3",name:"Lat Pulldown",detail:"back · wide grip",muscle:"back",sets:"3×8-10"},
    {id:"ua4",name:"Cable Row",detail:"back",muscle:"back",sets:"3×8-10"},
    {id:"ua5",name:"Shoulder Press Machine",detail:"shoulders",muscle:"shoulders",sets:"3×8-10"},
    {id:"ua6",name:"Lateral Raise",detail:"shoulders",muscle:"shoulders",sets:"3×10-12"},
    {id:"ua7",name:"Reverse Pec Deck",detail:"rear delts",muscle:"shoulders",sets:"3×12-15"},
    {id:"ua8",name:"Cable Bicep Curl",detail:"biceps",muscle:"biceps",sets:"3×10-12"},
    {id:"ua9",name:"Cable Tricep Pushdown",detail:"triceps",muscle:"triceps",sets:"3×10-12"},
  ],
  "Lower":[
    {id:"lo1",name:"Leg Press",detail:"quads",muscle:"quads",sets:"3×6-8"},
    {id:"lo2",name:"Leg Extension",detail:"quads",muscle:"quads",sets:"3×10-12"},
    {id:"lo3",name:"Leg Curl",detail:"hamstrings",muscle:"hamstrings",sets:"3×10-12"},
    {id:"lo4",name:"Hip Thrust Machine",detail:"glutes",muscle:"glutes",sets:"3×8-10"},
    {id:"lo5",name:"Hip Adductors",detail:"inner legs",muscle:"quads",sets:"3×10-12"},
    {id:"lo6",name:"Hip Abductors",detail:"outer legs",muscle:"glutes",sets:"3×10-12"},
    {id:"lo7",name:"Calf Raise Machine",detail:"calves",muscle:"calves",sets:"4×10-12"},
    {id:"lo8",name:"Ab Crunch Machine",detail:"core · optioneel",muscle:"core",sets:"3×12-15"},
  ],
  "Upper B":[
    {id:"ub1",name:"Flat Dumbbell Press",detail:"chest",muscle:"chest",sets:"3×6-8"},
    {id:"ub2",name:"Cable Fly laag-hoog",detail:"chest",muscle:"chest",sets:"3×10-12"},
    {id:"ub3",name:"Cable Row",detail:"back · close grip",muscle:"back",sets:"3×8-10"},
    {id:"ub4",name:"Lat Pulldown",detail:"back · wide grip",muscle:"back",sets:"3×8-10"},
    {id:"ub5",name:"Lateral Raise",detail:"shoulders",muscle:"shoulders",sets:"3×10-12"},
    {id:"ub6",name:"Reverse Pec Deck",detail:"rear delts",muscle:"shoulders",sets:"3×12-15"},
    {id:"ub7",name:"Cable Bicep Curl",detail:"biceps",muscle:"biceps",sets:"3×10-12"},
    {id:"ub8",name:"Incline Dumbbell Curl",detail:"biceps · long head",muscle:"biceps",sets:"3×10-12"},
    {id:"ub9",name:"Cable Tricep Pushdown",detail:"triceps",muscle:"triceps",sets:"3×10-12"},
    {id:"ub10",name:"Skull Crusher",detail:"triceps",muscle:"triceps",sets:"3×8-10"},
  ],
  "Upper C":[
    {id:"uc1",name:"Shoulder Press Machine",detail:"shoulders",muscle:"shoulders",sets:"3×6-8"},
    {id:"uc2",name:"Lateral Raise",detail:"shoulders",muscle:"shoulders",sets:"3×10-12"},
    {id:"uc3",name:"Cable Fly hoog-laag",detail:"chest",muscle:"chest",sets:"3×10-12"},
    {id:"uc4",name:"Cable Row",detail:"back",muscle:"back",sets:"3×10-12"},
    {id:"uc5",name:"Cable Bicep Curl",detail:"biceps",muscle:"biceps",sets:"3×10-12"},
    {id:"uc6",name:"Incline Dumbbell Curl",detail:"biceps · long head",muscle:"biceps",sets:"3×10-12"},
    {id:"uc7",name:"Cable Tricep Pushdown",detail:"triceps",muscle:"triceps",sets:"3×10-12"},
    {id:"uc8",name:"Skull Crusher",detail:"triceps",muscle:"triceps",sets:"3×8-10"},
  ],
};
// Vast weekschema: maandag Upper A, dinsdag Lower, donderdag Upper B (getDay: 1=ma, 2=di, 4=do)
const SCHEDULE={1:0,2:1,4:2};
const PLAN=[[1,"ma"],[2,"di"],[4,"do"]];
const WEEK_TARGET=3;
const T12="T12:00:00";
const EX_DAY={};Object.entries(WORKOUTS).forEach(([d,arr])=>arr.forEach(e=>{EX_DAY[e.id]=d}));

// Rusttijd per oefening (seconden): zware basisoefeningen langer, isolatie korter
const REST_180=new Set(["Leg Press"]);
const REST_150=new Set(["Incline Dumbbell Press","Flat Dumbbell Press"]);
const REST_120=new Set(["Lat Pulldown","Cable Row","Shoulder Press Machine","Hip Thrust Machine"]);
function restFor(ex){
  if(!ex)return 90;
  if(ex.rest)return ex.rest;
  if(REST_180.has(ex.name))return 180;
  if(REST_150.has(ex.name))return 150;
  if(REST_120.has(ex.name))return 120;
  if(ex.custom)return 90;
  return 75;
}

// ─── OPSLAG ───────────────────────────────────────────────────────────────────
const localKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const todayKey=()=>localKey(new Date());
function weekStartOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
const fmtDate=d=>new Date(d+T12).toLocaleDateString("nl-NL",{day:"numeric",month:"short"});
function lsGet(k,fb=null){try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):fb}catch{return fb}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function lsDel(k){try{localStorage.removeItem(k)}catch{}}
const num=v=>parseFloat(String(v??"").replace(",","."))||0;
const fmtNum=v=>{const n=num(v);return String(Math.round(n*100)/100).replace(".",",")};
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
const fmtTime=s=>`${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}`;

function getExHist(id){const a=lsGet("pf_ex",{});return(a[id]||[]).slice().sort((x,y)=>y.date.localeCompare(x.date))}
function getTodaySets(id){return getExHist(id).find(x=>x.date===todayKey())?.sets||null}
function prevSession(id){return getExHist(id).find(h=>h.date!==todayKey()&&h.sets&&h.sets.length)||null}
function setTodaySets(id,sets){
  const tk=todayKey();
  const valid=sets.filter(s=>num(s.weight)>0||num(s.reps)>0).map(s=>({weight:String(s.weight),reps:String(s.reps)}));
  const a=lsGet("pf_ex",{});
  const rest=(a[id]||[]).filter(e=>e.date!==tk);
  if(valid.length)a[id]=[{date:tk,sets:valid},...rest].slice(0,60);
  else if(rest.length)a[id]=rest;
  else delete a[id];
  lsSet("pf_ex",a);
}
function getPR(id,skipToday=false){
  let pr=0;const tk=todayKey();
  getExHist(id).forEach(h=>{if(skipToday&&h.date===tk)return;h.sets.forEach(s=>{const w=num(s.weight);if(w>pr)pr=w})});
  return pr;
}

// Oefeningen: vaste lijst + eigen oefeningen; schema met eventuele vaste wissels
function customList(){return lsGet("pf_custom_ex",[])}
function catalog(){return[...Object.values(WORKOUTS).flat(),...customList().map(c=>({...c,custom:true}))]}
function exById(id){return catalog().find(e=>e.id===id)||null}
function dayIds(day){const plan=lsGet("pf_plan",{});return(plan[day]&&plan[day].length?plan[day]:WORKOUTS[day].map(e=>e.id))}
function todayIds(day,tk){
  const swaps=lsGet("pf_swap_"+tk,{});
  let ids=dayIds(day).map(id=>swaps[id]||id).filter((id,i,a)=>a.indexOf(id)===i&&exById(id));
  const order=lsGet(`pf_order_${tk}_${day}`,null);
  if(order){const ordered=order.filter(id=>ids.includes(id));ids=[...ordered,...ids.filter(id=>!ordered.includes(id))]}
  return ids;
}
function parseTarget(str){
  const m=String(str||"").match(/(\d+)\s*[×x]\s*(\d+)(?:\s*[-–]\s*(\d+))?/);
  if(!m)return{sets:3,lo:8,hi:12,label:"3 × 8–12"};
  const sets=+m[1],lo=+m[2],hi=m[3]?+m[3]:+m[2];
  return{sets,lo,hi,label:`${sets} × ${lo}${hi!==lo?"–"+hi:""}`};
}
function fmtSets(sets){
  if(!sets||!sets.length)return"";
  const ws=sets.map(s=>num(s.weight));
  if(ws.every(w=>w===ws[0])&&ws[0]>0)return`${fmtNum(ws[0])} kg × ${sets.map(s=>s.reps||"–").join(", ")}`;
  return sets.map(s=>`${fmtNum(s.weight)}×${s.reps||"–"}`).join(", ");
}
function estMinutes(ids){
  let s=0;ids.forEach(id=>{const ex=exById(id);if(ex)s+=parseTarget(ex.sets).sets*(40+restFor(ex))});
  return Math.max(5,Math.round(s/300)*5);
}
const noteKey=name=>String(name||"").trim().toLowerCase();
function getExNote(name){const n=lsGet("pf_exnote",{})[noteKey(name)];return n?n.text:""}
function setExNote(name,text){const all=lsGet("pf_exnote",{});const k=noteKey(name);if(text.trim())all[k]={name,text:text.trim()};else delete all[k];lsSet("pf_exnote",all)}

// Trainingsdagen: handmatig in de kalender gezet of dagen met gelogde sets
function trainedDates(){
  const set=new Set();
  const cal=lsGet("pf_cal",{});Object.keys(cal).forEach(k=>{if(cal[k])set.add(k)});
  const all=lsGet("pf_ex",{});Object.values(all).forEach(arr=>(arr||[]).forEach(h=>{if(h&&h.date&&h.sets&&h.sets.length)set.add(h.date)}));
  return set;
}
function weekCount(start,set){let n=0;for(let i=0;i<7;i++){const d=new Date(start);d.setDate(d.getDate()+i);if(set.has(localKey(d)))n++}return n}
function calcStreak(set){
  let s=0;const ws=weekStartOf(new Date());
  if(weekCount(ws,set)>=WEEK_TARGET)s++;
  for(let i=1;i<520;i++){const w=new Date(ws);w.setDate(w.getDate()-7*i);if(weekCount(w,set)>=WEEK_TARGET)s++;else break}
  return s;
}
function markTrained(tk){const cal=lsGet("pf_cal",{});if(!cal[tk]){cal[tk]=true;lsSet("pf_cal",cal)}}

// ─── GELUID ───────────────────────────────────────────────────────────────────
let _actx=null;
function getActx(){if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();return _actx}
function unlockAudio(){try{const c=getActx(),b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0);if(c.state==="suspended")c.resume()}catch{}}
function playBeep(){try{const c=getActx();if(c.state==="suspended")c.resume();[0,.22,.44].forEach(d=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=900;o.type="sine";const t=c.currentTime+d;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.01);g.gain.linearRampToValueAtTime(0,t+.18);o.start(t);o.stop(t+.2)})}catch{}}

const getDailyQuote=()=>QUOTES[Math.floor((Date.now()-new Date(new Date().getFullYear(),0,1))/86400000)%QUOTES.length];

// ─── ICONEN ───────────────────────────────────────────────────────────────────
const PATHS={
  check:<polyline points="20 6 9 17 4 12"/>,
  play:<polygon points="7 4 19 12 7 20 7 4"/>,
  right:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  left:<polyline points="15 18 9 12 15 6"/>,
  down:<polyline points="6 9 12 15 18 9"/>,
  clock:<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>,
  swap:<><polyline points="17 3 21 7 17 11"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 13 3 17 7 21"/><line x1="3" y1="17" x2="15" y2="17"/></>,
  edit:<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
  plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  minus:<line x1="5" y1="12" x2="19" y2="12"/>,
  x:<><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
  flame:<path d="M12 3c.8 3 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2 .8-3.2 2-4.3.2 1.8 1 2.8 2.2 3.1C11 8.4 10.8 6 12 3z"/>,
  scale:<><rect x="3" y="4" width="18" height="16" rx="4"/><path d="M8 11a4 4 0 0 1 8 0"/><line x1="12" y1="11" x2="13.6" y2="8.6"/></>,
  later:<><polyline points="5 5 13 12 5 19"/><line x1="17" y1="5" x2="17" y2="19"/></>,
  trophy:<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></>,
  list:<><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></>,
  calendar:<><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  chart:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  notes:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  moon:<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>,
};
function I({n,s=18,c="currentColor",w=2}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0,display:"block"}}>{PATHS[n]}</svg>}

// ─── KLEINE BOUWSTENEN ────────────────────────────────────────────────────────
function Sparkline({data,color,w=72,h=28}){
  if(!data||data.length<2)return null;
  const max=Math.max(...data),min=Math.min(...data),rng=max-min||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/rng)*(h-6)-3}`).join(" ");
  const lp=pts.split(" ").pop().split(",");
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/><circle cx={lp[0]} cy={lp[1]} r={3} fill={color}/></svg>;
}
function Sheet({onClose,title,children}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:400,backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} className="sheet">
        <div style={{width:40,height:4,background:"#2c2c33",borderRadius:2,margin:"10px auto 16px"}}/>
        {title&&<div className="h2" style={{marginBottom:14}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
function Check({on,color,onClick,size=28,label}){
  return <button onClick={onClick} aria-label={label} aria-pressed={on} style={{width:size,height:size,borderRadius:"50%",border:`1.6px solid ${on?color:"#4a4a54"}`,background:on?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#0a0a0c"}}>{on&&<I n="check" s={size*.55} w={3}/>}</button>;
}

// ─── WEEKOVERZICHT ────────────────────────────────────────────────────────────
function WeekHistModal({onClose}){
  const trained=trainedDates();
  const ws0=weekStartOf(new Date());
  const weeks=Array.from({length:12},(_,i)=>{const w=new Date(ws0);w.setDate(w.getDate()-7*i);return w});
  const DL=["ma","di","wo","do","vr","za","zo"];
  const tk=todayKey();
  return(
    <Sheet onClose={onClose} title="Weekoverzicht">
      <div className="muted" style={{fontSize:13,marginTop:-8,marginBottom:14}}>Doel: {WEEK_TARGET} trainingen per week</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {weeks.map((w,i)=>{
          const days=Array.from({length:7},(_,j)=>{const d=new Date(w);d.setDate(d.getDate()+j);return localKey(d)});
          const cnt=days.filter(k=>trained.has(k)).length;
          const end=new Date(w);end.setDate(end.getDate()+6);
          return(
            <div key={localKey(w)} style={{padding:"12px 14px",borderRadius:14,background:"#0e0e11",border:"1px solid #222228"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <div style={{fontSize:13.5,fontWeight:600}}>{i===0?"Deze week":`${fmtDate(localKey(w))} – ${fmtDate(localKey(end))}`}</div>
                <div style={{fontSize:13,fontWeight:600,color:cnt>=WEEK_TARGET?"#a3e635":cnt>=1?"#fb923c":"#8b8b95"}}>{cnt}/{WEEK_TARGET}</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {days.map((k,j)=>{const t=trained.has(k);return <div key={k} style={{flex:1,aspectRatio:"1",borderRadius:8,background:t?"#a3e63520":"#17171b",border:`1px solid ${k===tk?"#a3e635":t?"#a3e63540":"#26262d"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:k>tk?.35:1}}><div style={{fontSize:10,color:"#8b8b95"}}>{DL[j]}</div><div style={{fontSize:12,color:t?"#a3e635":"#5d5d67"}}>{t?"✓":"·"}</div></div>})}
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

// ─── GEWICHT ──────────────────────────────────────────────────────────────────
function weeklyAverages(hist){
  const byWeek={};
  hist.forEach(h=>{const k=localKey(weekStartOf(new Date(h.date+T12)));(byWeek[k]=byWeek[k]||[]).push(num(h.w))});
  return Object.keys(byWeek).sort().map(k=>({week:k,avg:byWeek[k].reduce((a,b)=>a+b,0)/byWeek[k].length,n:byWeek[k].length}));
}
function BWModal({onClose}){
  const [w,setW]=useState("");
  const [ok,setOk]=useState(false);
  const [hist,setHist]=useState(()=>lsGet("pf_bw",[]));
  function save(){
    const n=num(w);if(!n||n<30||n>250)return;
    const u=[{date:todayKey(),w:n},...hist.filter(h=>h.date!==todayKey())].slice(0,400);
    lsSet("pf_bw",u);setHist(u);setOk(true);setTimeout(onClose,600);
  }
  return(
    <Sheet onClose={onClose} title="Gewicht">
      <input type="number" inputMode="decimal" placeholder="Gewicht in kg" value={w} onChange={e=>setW(e.target.value)} className="inp" style={{fontSize:22,height:56,marginBottom:10,borderColor:"#38bdf855"}}/>
      <button onClick={save} className="btn-primary" style={{background:ok?"#a3e635":"#38bdf8",marginBottom:18}}>{ok?"Opgeslagen":"Opslaan"}</button>
      {hist.length>0&&<>
        <div className="lbl" style={{marginBottom:6}}>Laatste wegingen</div>
        {hist.slice(0,10).map(h=><div key={h.date} className="row" style={{justifyContent:"space-between"}}><span className="muted" style={{fontSize:14}}>{fmtDate(h.date)}</span><span style={{fontSize:15,fontWeight:600}}>{fmtNum(h.w)} kg</span></div>)}
      </>}
    </Sheet>
  );
}

// ─── RUSTTIMER (onderin) ──────────────────────────────────────────────────────
function RestBar({rest,setRest}){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{if(!rest)return;setNow(Date.now());const t=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(t)},[rest]);
  useEffect(()=>{
    if(!rest)return;
    if(!rest.doneAt&&now>=rest.endAt){playBeep();try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch{}setRest(r=>r&&{...r,doneAt:Date.now()})}
    else if(rest.doneAt&&now-rest.doneAt>6000)setRest(null);
  },[now,rest]);
  if(!rest)return null;
  const left=Math.max(0,Math.ceil((rest.endAt-now)/1000));
  const pct=rest.doneAt?1:Math.min(1,1-left/rest.total);
  const done=!!rest.doneAt;
  const c=done?"#a3e635":"#38bdf8";
  return(
    <div style={{flexShrink:0,background:done?"#a3e63514":"#38bdf812",borderTop:`1px solid ${c}55`,padding:"10px 16px",display:"flex",alignItems:"center",gap:12}}>
      <I n="clock" s={20} c={c}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,color:done?"#c5f07a":"#7dd3fc",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{done?"Klaar, volgende set":`Rust${rest.name?" na "+rest.name:""}`}</div>
        <div style={{height:4,borderRadius:2,background:"#1f2b33",marginTop:5}}><div style={{width:`${pct*100}%`,height:"100%",borderRadius:2,background:c,transition:"width .25s linear"}}/></div>
      </div>
      <div className="syne" style={{fontSize:22,color:done?"#a3e635":"#e0f2fe",minWidth:52,textAlign:"right"}}>{fmtTime(left)}</div>
      {!done&&<button onClick={()=>setRest(r=>r&&{...r,endAt:r.endAt+30000,total:r.total+30})} className="pill" style={{color:"#7dd3fc",borderColor:"#38bdf855"}}>+30 s</button>}
      <button onClick={()=>setRest(null)} aria-label="Timer stoppen" className="pill" style={{padding:"6px 8px"}}><I n="x" s={14}/></button>
    </div>
  );
}

// ─── VANDAAG ──────────────────────────────────────────────────────────────────
function TodayTab({onStart}){
  const now=new Date();
  const tk=todayKey();
  const plannedIdx=SCHEDULE[now.getDay()];
  const isGymDay=plannedIdx!==undefined;
  const [splitIdx,setSplitIdx]=useState(()=>lsGet("pf_split_"+tk,isGymDay?plannedIdx:0));
  const [restDay,setRestDay]=useState(()=>lsGet("pf_rest_"+tk,!isGymDay));
  const [exDone,setExDone]=useState(()=>lsGet("pf_done_"+tk,{}));
  const [supps,setSupps]=useState(()=>lsGet("pf_supps_"+tk,{}));
  const [note,setNote]=useState(()=>lsGet("pf_note_"+tk,""));
  const [showBW,setShowBW]=useState(false);
  const [showWeeks,setShowWeeks]=useState(false);
  const [showDays,setShowDays]=useState(false);
  const [rev,setRev]=useState(0);
  const mounted=useRef(false);

  useEffect(()=>{lsSet("pf_split_"+tk,splitIdx)},[splitIdx]);
  useEffect(()=>{lsSet("pf_rest_"+tk,restDay)},[restDay]);
  useEffect(()=>{lsSet("pf_supps_"+tk,supps)},[supps]);
  useEffect(()=>{lsSet("pf_note_"+tk,note)},[note]);
  useEffect(()=>{
    if(!mounted.current){mounted.current=true;return}
    lsSet("pf_done_"+tk,exDone);
    const cal=lsGet("pf_cal",{});
    if(Object.values(exDone).some(Boolean))cal[tk]=true;else delete cal[tk];
    lsSet("pf_cal",cal);
    setRev(r=>r+1);
  },[exDone]);

  const trained=useMemo(()=>trainedDates(),[rev]);
  const ws=weekStartOf(now);
  const weekN=weekCount(ws,trained);
  const streak=useMemo(()=>calcStreak(trained),[trained]);
  const bw=lsGet("pf_bw",[])[0];

  const day=DAYS[splitIdx],col=DAY_COLORS[splitIdx];
  const ids=todayIds(day,tk);
  const exs=ids.map(exById).filter(Boolean);
  const doneCount=exs.filter(e=>exDone[e.id]).length;
  const firstOpen=exs.find(e=>!exDone[e.id]);
  const suppCount=SUPPLEMENTS.filter(s=>supps[s.id]).length;

  let next=null;
  for(let i=1;i<=7;i++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);if(SCHEDULE[d.getDay()]!==undefined){next={d,idx:SCHEDULE[d.getDay()]};break}}

  return(
    <div className="fu">
      {/* Kop */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{fontSize:14,color:"#a8a8b0"}}>{cap(now.toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"}))}</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setShowWeeks(true)} className="pill" style={streak>0?{color:"#fb923c",borderColor:"#fb923c55"}:{}}><I n="flame" s={14}/>{streak>0?`${streak} ${streak===1?"week":"weken"}`:`${weekN}/${WEEK_TARGET}`}</button>
          <button onClick={()=>setShowBW(true)} className="pill"><I n="scale" s={14}/>{bw?`${fmtNum(bw.w)} kg`:"gewicht"}</button>
        </div>
      </div>

      {/* Weekstrip */}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {PLAN.map(([wd,l])=>{
          const d=new Date(ws);d.setDate(d.getDate()+((wd+6)%7));
          const k=localKey(d),idx=SCHEDULE[wd],c=DAY_COLORS[idx];
          const ok=trained.has(k),isT=k===tk,past=k<tk;
          return(
            <div key={wd} style={{flex:1,padding:"8px 4px",borderRadius:12,background:ok?c+"16":"transparent",border:`1px solid ${isT?c:ok?c+"40":"#26262d"}`,textAlign:"center"}}>
              <div style={{fontSize:11.5,color:isT||ok?c:"#8b8b95"}}>{l} {d.getDate()}</div>
              <div className="syne" style={{fontSize:13.5,color:isT||ok?c:"#e8e8e8",marginTop:1}}>{DAYS[idx]}</div>
              <div style={{fontSize:11,marginTop:1,color:ok?c:past?"#f87171":"#6b6b75"}}>{ok?"gedaan":past?"gemist":isT?"vandaag":"gepland"}</div>
            </div>
          );
        })}
      </div>

      {!restDay?(
        <div className="card" style={{paddingBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <div className="syne" style={{fontSize:32,color:col,lineHeight:1.05,letterSpacing:"-1px"}}>{day}</div>
              <div className="muted" style={{fontSize:13.5,marginTop:4}}>{exs.length} oefeningen, ongeveer {estMinutes(ids)} minuten</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
              <button onClick={()=>setShowDays(s=>!s)} className="pill">Andere dag <I n="down" s={13}/></button>
              <button onClick={()=>setRestDay(true)} className="pill"><I n="moon" s={13}/>Rustdag</button>
            </div>
          </div>
          {showDays&&<div style={{display:"flex",gap:6,marginTop:12}}>
            {DAYS.map((d,i)=><button key={d} onClick={()=>{setSplitIdx(i);setShowDays(false)}} style={{flex:1,padding:"8px 2px",borderRadius:10,fontSize:12.5,fontWeight:600,background:i===splitIdx?DAY_COLORS[i]+"20":"#17171b",border:`1px solid ${i===splitIdx?DAY_COLORS[i]+"70":"#26262d"}`,color:i===splitIdx?DAY_COLORS[i]:"#a8a8b0"}}>{d}</button>)}
          </div>}
          <button onClick={()=>onStart(splitIdx,(firstOpen||exs[0])?.id)} className="btn-primary" style={{background:col,marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <I n="play" s={16} c="#0a0a0c"/>{doneCount===0?"Start training":doneCount<exs.length?`Verder met training (${doneCount}/${exs.length})`:"Training bekijken"}
          </button>
          <div style={{marginTop:10}}>
            {exs.map(ex=>{
              const d=!!exDone[ex.id];
              const tSets=getTodaySets(ex.id);
              const prev=prevSession(ex.id);
              const t=parseTarget(ex.sets);
              const sub=tSets?`vandaag ${tSets.length}/${t.sets} sets`:prev?`vorige: ${fmtSets(prev.sets)}`:`doel ${t.label}`;
              return(
                <div key={ex.id} className="row">
                  <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>onStart(splitIdx,ex.id)}>
                    <div className="syne" style={{fontSize:15,color:d?"#8b8b95":"#e8e8e8",textDecoration:d?"line-through":"none"}}>{ex.name}</div>
                    <div style={{fontSize:13,color:tSets?col:"#8b8b95",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sub}</div>
                  </div>
                  <Check on={d} color={col} label={`${ex.name} afvinken`} onClick={()=>setExDone(p=>({...p,[ex.id]:!p[ex.id]}))}/>
                </div>
              );
            })}
          </div>
        </div>
      ):(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <div className="syne" style={{fontSize:26}}>Rustdag</div>
              {next&&<div className="muted" style={{fontSize:13.5,marginTop:4}}>Volgende training: <span style={{color:DAY_COLORS[next.idx]}}>{next.d.toLocaleDateString("nl-NL",{weekday:"long"})}, {DAYS[next.idx]}</span></div>}
            </div>
            <button onClick={()=>setRestDay(false)} className="pill">Toch trainen</button>
          </div>
          <div style={{fontSize:14,color:"#c4c4cc",fontStyle:"italic",lineHeight:1.6,marginTop:16}}>"{getDailyQuote()}"</div>
        </div>
      )}

      {/* Supplementen */}
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div className="lbl">Supplementen</div>
          <div style={{fontSize:12.5,color:suppCount===SUPPLEMENTS.length?"#a3e635":"#8b8b95"}}>{suppCount}/{SUPPLEMENTS.length}</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {SUPPLEMENTS.map(s=>{const d=!!supps[s.id];return(
            <button key={s.id} onClick={()=>setSupps(p=>({...p,[s.id]:!p[s.id]}))} className="pill" style={{padding:"9px 13px",fontSize:13.5,...(d?{color:"#a3e635",borderColor:"#a3e63570",background:"#a3e63512"}:{})}}>
              {d&&<I n="check" s={14} w={3}/>}{s.label}<span style={{color:d?"#a3e635aa":"#6b6b75",fontSize:12}}>{s.dose}</span>
            </button>
          )})}
        </div>
      </div>

      {/* Notitie */}
      <div className="card">
        <div className="lbl" style={{marginBottom:8}}>Notitie</div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={restDay?"Hoe voel je je vandaag?":"Hoe ging de training?"} rows={2} className="inp" style={{height:"auto",padding:"11px 13px",fontSize:14.5,lineHeight:1.5}}/>
      </div>

      {showBW&&<BWModal onClose={()=>{setShowBW(false);setRev(r=>r+1)}}/>}
      {showWeeks&&<WeekHistModal onClose={()=>setShowWeeks(false)}/>}
    </div>
  );
}

// ─── TRAININGSMODUS ───────────────────────────────────────────────────────────
function initialRows(ex,prev,target){
  const saved=getTodaySets(ex.id);
  const base=prev?prev.sets.map(s=>({weight:String(s.weight??""),reps:String(s.reps??""),done:false})):[];
  if(saved){
    const rows=saved.map(s=>({weight:String(s.weight),reps:String(s.reps),done:true}));
    for(let i=rows.length;i<target.sets;i++)rows.push(base[i]||{...(base[base.length-1]||{weight:"",reps:""}),done:false});
    return rows;
  }
  const rows=base.slice(0,Math.max(target.sets,base.length));
  while(rows.length<target.sets)rows.push({...(rows[rows.length-1]||{weight:"",reps:""}),done:false});
  return rows.map(r=>({...r,done:false}));
}
function hintFor(ex,prev,target){
  if(!prev)return{text:`Eerste keer. Doel: ${target.label} reps.`,up:false};
  const reps=prev.sets.map(s=>num(s.reps));
  const topW=Math.max(...prev.sets.map(s=>num(s.weight)));
  const allTop=prev.sets.length>=target.sets&&reps.every(r=>r>=target.hi)&&topW>0;
  if(allTop){
    const inc=/dumbbell/i.test(ex.name)?2:2.5;
    return{text:`Vorige keer ${fmtSets(prev.sets)}. Je haalde overal ${target.hi} reps, probeer vandaag ${fmtNum(topW+inc)} kg.`,up:true};
  }
  return{text:`Vorige keer ${fmtSets(prev.sets)}. Haal je overal ${target.hi} reps, dan mag het gewicht omhoog.`,up:false};
}

function TrainingMode({dayIdx,startId,onExit,onMove,onRest}){
  const tk=todayKey();
  const day=DAYS[dayIdx],col=DAY_COLORS[dayIdx];
  const [rev,setRev]=useState(0);
  const ids=useMemo(()=>todayIds(day,tk),[rev]);
  const [curId,setCurId]=useState(()=>ids.includes(startId)?startId:ids[0]);
  const [done,setDone]=useState(()=>lsGet("pf_done_"+tk,{}));
  const [drafts,setDrafts]=useState(()=>lsGet("pf_draft_"+tk,{}));
  const [sheet,setSheet]=useState(null);
  const [toast,setToast]=useState("");
  const [showHist,setShowHist]=useState(false);
  const [finished,setFinished]=useState(false);
  const [,force]=useState(0);
  const topRef=useRef(null);

  useEffect(()=>{lsSet("pf_done_"+tk,done);if(Object.values(done).some(Boolean))markTrained(tk)},[done]);
  useEffect(()=>{lsSet("pf_draft_"+tk,drafts)},[drafts]);
  useEffect(()=>{onMove&&onMove(curId);setShowHist(false);const p=topRef.current&&topRef.current.closest(".page");if(p)p.scrollTop=0},[curId]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),2600);return()=>clearTimeout(t)},[toast]);

  const ex=exById(curId)||exById(ids[0]);
  if(!ex)return <div className="card">Geen oefeningen gevonden. <button className="pill" onClick={onExit}>Terug</button></div>;
  const idx=ids.indexOf(ex.id);
  const target=parseTarget(ex.sets);
  const prev=prevSession(ex.id);
  const rows=drafts[ex.id]||initialRows(ex,prev,target);
  const hint=hintFor(ex,prev,target);
  const exNote=getExNote(ex.name);
  const doneSets=rows.filter(r=>r.done).length;

  function setRows(next){setDrafts(d=>({...d,[ex.id]:next}))}
  function edit(i,field,val){setRows(rows.map((r,j)=>j===i?{...r,[field]:val}:r))}
  function toggleSet(i){
    const r=rows[i];
    if(!r.done&&!(num(r.weight)>0||num(r.reps)>0)){setToast("Vul eerst kg of reps in");return}
    const next=rows.map((x,j)=>j===i?{...x,done:!x.done}:x);
    setRows(next);
    const ds=next.filter(x=>x.done);
    setTodaySets(ex.id,ds);
    if(!r.done){
      unlockAudio();
      onRest(restFor(ex),ex.name);
      const w=num(r.weight),before=getPR(ex.id,true),todayOther=Math.max(0,...rows.filter((x,j)=>x.done&&j!==i).map(x=>num(x.weight)));
      if(before>0&&w>before&&w>todayOther)setToast(`Nieuw PR: ${fmtNum(w)} kg`);
      if(ds.length>=target.sets&&!done[ex.id])setDone(d=>({...d,[ex.id]:true}));
      markTrained(tk);
    }else if(ds.length<target.sets&&done[ex.id]){
      setDone(d=>{const n={...d};delete n[ex.id];return n});
    }
  }
  function addSet(){const last=rows[rows.length-1]||{weight:"",reps:""};setRows([...rows,{weight:last.weight,reps:last.reps,done:false}])}
  function removeSet(){
    let i=rows.length-1;while(i>=0&&rows[i].done)i--;
    if(i<0||rows.length<=1)return;
    setRows(rows.filter((_,j)=>j!==i));
  }
  function goNext(fromIds=ids,fromIdx=idx){
    for(let k=1;k<=fromIds.length;k++){
      const id=fromIds[(fromIdx+k)%fromIds.length];
      if(id!==ex.id&&!done[id]){setCurId(id);return}
    }
    setFinished(true);
  }
  function later(){
    const order=[...ids.filter(id=>id!==ex.id),ex.id];
    lsSet(`pf_order_${tk}_${day}`,order);
    setRev(r=>r+1);
    goNext(order,idx-1<0?order.length-1:idx-1);
  }
  function doSwap(newId,permanent){
    const swaps=lsGet("pf_swap_"+tk,{});
    const orig=Object.keys(swaps).find(k=>swaps[k]===ex.id)||ex.id;
    if(permanent){
      const plan=lsGet("pf_plan",{});
      plan[day]=dayIds(day).map(id=>id===orig?newId:id);
      lsSet("pf_plan",plan);
      delete swaps[orig];
    }else if(newId===orig)delete swaps[orig];
    else swaps[orig]=newId;
    lsSet("pf_swap_"+tk,swaps);
    const order=lsGet(`pf_order_${tk}_${day}`,null);
    if(order)lsSet(`pf_order_${tk}_${day}`,order.map(id=>id===ex.id?newId:id));
    setSheet(null);setRev(r=>r+1);setCurId(newId);
  }

  if(finished){
    const tIds=ids;let sets=0,vol=0,prs=0;
    tIds.forEach(id=>{const s=getTodaySets(id)||[];sets+=s.length;s.forEach(x=>{vol+=num(x.weight)*num(x.reps)});const w=Math.max(0,...s.map(x=>num(x.weight))),b=getPR(id,true);if(b>0&&w>b)prs++});
    const nDone=tIds.filter(id=>done[id]).length;
    return(
      <div className="fu" ref={topRef}>
        <div className="card" style={{textAlign:"center",padding:"28px 18px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><I n="trophy" s={34} c={col}/></div>
          <div className="syne" style={{fontSize:28,color:col}}>{nDone===tIds.length?"Training klaar":"Training afgerond"}</div>
          <div className="muted" style={{fontSize:14,marginTop:4}}>{day}, {nDone} van {tIds.length} oefeningen</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,marginTop:20}}>
            {[["Sets",sets],["Volume",`${Math.round(vol).toLocaleString("nl-NL")} kg`],["PR's",prs]].map(([l,v])=><div key={l} style={{background:"#0e0e11",border:"1px solid #222228",borderRadius:14,padding:"12px 6px"}}><div className="muted" style={{fontSize:12}}>{l}</div><div className="syne" style={{fontSize:19,marginTop:2}}>{v}</div></div>)}
          </div>
          <button onClick={onExit} className="btn-primary" style={{background:col,marginTop:20}}>Terug naar vandaag</button>
          {nDone<tIds.length&&<button onClick={()=>{setFinished(false);goNext()}} className="btn-ghost" style={{marginTop:8}}>Toch verder</button>}
        </div>
      </div>
    );
  }

  return(
    <div className="fu" ref={topRef}>
      {/* Bovenbalk */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={onExit} className="pill" style={{border:"none",paddingLeft:0,fontSize:14}}><I n="left" s={18}/>{day}</button>
        <button onClick={()=>setSheet("list")} className="pill" style={{fontSize:13.5}}><I n="list" s={15}/>{idx+1} van {ids.length}</button>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:18}} onClick={()=>setSheet("list")}>
        {ids.map(id=><div key={id} style={{flex:1,height:5,borderRadius:3,background:done[id]?col:id===ex.id?col+"88":"#26262d"}}/>)}
      </div>

      {/* Oefening */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
        <div style={{minWidth:0}}>
          <div className="syne" style={{fontSize:28,lineHeight:1.12,letterSpacing:"-.5px"}}>{ex.name}</div>
          <div className="muted" style={{fontSize:13.5,marginTop:4}}>{ex.detail||ex.muscle}, doel {target.label}, rust {fmtTime(restFor(ex))}</div>
        </div>
        <button onClick={()=>setSheet("swap")} className="pill" style={{flexShrink:0}}><I n="swap" s={14}/>Wisselen</button>
      </div>

      <button onClick={()=>setSheet("note")} style={{display:"flex",alignItems:"center",gap:7,marginTop:10,fontSize:13.5,color:exNote?"#e8e8e8":"#8b8b95",textAlign:"left"}}>
        <I n="edit" s={14} c={exNote?col:"#8b8b95"}/>{exNote||"Notitie toevoegen, zoals een stoelstand"}
      </button>

      <div style={{marginTop:12,padding:"11px 13px",borderRadius:12,background:hint.up?col+"14":"#121215",border:`1px solid ${hint.up?col+"45":"#222228"}`,fontSize:13.5,lineHeight:1.5,color:hint.up?"#e8e8e8":"#c4c4cc"}}>{hint.text}</div>

      {/* Sets */}
      <div style={{marginTop:14}}>
        <div style={{display:"grid",gridTemplateColumns:"22px minmax(0,1fr) minmax(0,1fr) 44px",gap:8,fontSize:12,color:"#8b8b95",marginBottom:6,paddingLeft:2}}><span/> <span style={{textAlign:"center"}}>kg</span><span style={{textAlign:"center"}}>reps</span><span/></div>
        {rows.map((r,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"22px minmax(0,1fr) minmax(0,1fr) 44px",gap:8,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:14,color:r.done?col:"#8b8b95",textAlign:"center"}}>{i+1}</span>
            <input type="number" inputMode="decimal" value={r.weight} disabled={r.done} onChange={e=>edit(i,"weight",e.target.value)} placeholder="kg" className="inp set-inp" style={r.done?{color:col,borderColor:col+"40",background:col+"0c"}:{}}/>
            <input type="number" inputMode="numeric" value={r.reps} disabled={r.done} onChange={e=>edit(i,"reps",e.target.value)} placeholder="reps" className="inp set-inp" style={r.done?{color:col,borderColor:col+"40",background:col+"0c"}:{}}/>
            <div style={{display:"flex",justifyContent:"center"}}><Check on={r.done} color={col} size={38} label={`Set ${i+1} ${r.done?"terugzetten":"afvinken"}`} onClick={()=>toggleSet(i)}/></div>
          </div>
        ))}
        <div style={{display:"flex",gap:8}}>
          <button onClick={addSet} className="btn-ghost" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><I n="plus" s={15}/>set</button>
          <button onClick={removeSet} className="btn-ghost" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><I n="minus" s={15}/>set</button>
        </div>
      </div>

      {/* Verder */}
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button onClick={later} className="btn-ghost" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><I n="later" s={15}/>Later</button>
        <button onClick={()=>goNext()} style={{flex:2,height:50,borderRadius:14,border:`1.5px solid ${col}`,color:col,fontSize:15,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
          {ids.every(id=>id===ex.id||done[id])?"Afronden":"Volgende oefening"}<I n="right" s={16}/>
        </button>
      </div>
      <div className="muted" style={{fontSize:12.5,textAlign:"center",marginTop:8}}>{doneSets}/{target.sets} sets gedaan</div>

      {/* Geschiedenis */}
      <ExerciseHistory ex={ex} col={col} open={showHist} setOpen={setShowHist}/>

      {toast&&<div style={{position:"fixed",left:"50%",transform:"translateX(-50%)",top:"max(20px,env(safe-area-inset-top))",background:"#1c1c21",border:`1px solid ${col}66`,color:"#e8e8e8",padding:"10px 16px",borderRadius:12,fontSize:14,zIndex:500,whiteSpace:"nowrap"}}>{toast}</div>}

      {sheet==="list"&&<Sheet onClose={()=>setSheet(null)} title={day}>
        {ids.map((id,i)=>{const e=exById(id),s=getTodaySets(id),t=parseTarget(e.sets);return(
          <button key={id} onClick={()=>{setCurId(id);setSheet(null)}} className="row" style={{width:"100%",textAlign:"left"}}>
            <span style={{width:20,fontSize:13,color:"#8b8b95"}}>{i+1}</span>
            <div style={{flex:1,minWidth:0}}>
              <div className="syne" style={{fontSize:15,color:id===ex.id?col:"#e8e8e8"}}>{e.name}</div>
              <div className="muted" style={{fontSize:12.5}}>{s?`${s.length}/${t.sets} sets`:`doel ${t.label}`}</div>
            </div>
            {done[id]&&<I n="check" s={18} c={col} w={3}/>}
          </button>
        )})}
        <button onClick={()=>{setSheet(null);setFinished(true)}} className="btn-ghost" style={{marginTop:14}}>Training afronden</button>
      </Sheet>}
      {sheet==="swap"&&<SwapSheet ex={ex} ids={ids} day={day} col={col} onClose={()=>setSheet(null)} onPick={doSwap}/>}
      {sheet==="note"&&<NoteSheet ex={ex} col={col} onClose={()=>{setSheet(null);force(x=>x+1)}}/>}
    </div>
  );
}

function ExerciseHistory({ex,col,open,setOpen}){
  const hist=getExHist(ex.id).filter(h=>h.date!==todayKey());
  if(!hist.length)return null;
  const pr=getPR(ex.id);
  const spark=[...hist].reverse().slice(-10).map(h=>Math.max(...h.sets.map(s=>num(s.weight))));
  return(
    <div className="card" style={{marginTop:18,padding:"14px 16px"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <span className="lbl">Geschiedenis</span>
        <span style={{display:"flex",alignItems:"center",gap:10}}>
          {pr>0&&<span style={{fontSize:13,color:"#fbbf24"}}>PR {fmtNum(pr)} kg</span>}
          <Sparkline data={spark} color={col} w={56} h={22}/>
          <span style={{transform:open?"rotate(180deg)":"none",color:"#8b8b95"}}><I n="down" s={16}/></span>
        </span>
      </button>
      {open&&<div style={{marginTop:8}}>
        {hist.slice(0,8).map(h=><div key={h.date} className="row" style={{justifyContent:"space-between",gap:10}}><span className="muted" style={{fontSize:13}}>{fmtDate(h.date)}</span><span style={{fontSize:13.5,textAlign:"right"}}>{fmtSets(h.sets)}</span></div>)}
      </div>}
    </div>
  );
}

function SwapSheet({ex,ids,day,col,onClose,onPick}){
  const [permanent,setPermanent]=useState(false);
  const [showAll,setShowAll]=useState(false);
  const [name,setName]=useState("");
  const [muscle,setMuscle]=useState(ex.muscle||"chest");
  const [err,setErr]=useState("");
  const todayNames=new Set(ids.map(id=>exById(id)?.name.toLowerCase()));
  const dayDefault=new Set(WORKOUTS[day].map(e=>e.id));
  const seen=new Map();
  catalog().forEach(e=>{
    const k=e.name.toLowerCase();
    if(todayNames.has(k))return;
    if(!seen.has(k)||dayDefault.has(e.id))seen.set(k,e);
  });
  const options=[...seen.values()];
  const same=options.filter(e=>e.muscle===ex.muscle);
  const others=options.filter(e=>e.muscle!==ex.muscle).sort((a,b)=>MUSCLES.indexOf(a.muscle)-MUSCLES.indexOf(b.muscle));
  function addNew(){
    const n=name.trim();
    if(!n){setErr("Vul een naam in");return}
    const existing=catalog().find(e=>e.name.toLowerCase()===n.toLowerCase());
    if(existing){onPick(existing.id,permanent);return}
    const c={id:"cx_"+Date.now().toString(36),name:n,muscle,detail:muscle,sets:"3×8-12"};
    lsSet("pf_custom_ex",[...customList(),c]);
    onPick(c.id,permanent);
  }
  const Opt=e=><button key={e.id} onClick={()=>onPick(e.id,permanent)} className="row" style={{width:"100%",textAlign:"left"}}>
    <div style={{flex:1}}><div className="syne" style={{fontSize:15}}>{e.name}</div><div className="muted" style={{fontSize:12.5}}>{e.detail||e.muscle}{e.custom?", eigen oefening":""}</div></div>
    <I n="swap" s={16} c="#8b8b95"/>
  </button>;
  return(
    <Sheet onClose={onClose} title={`${ex.name} wisselen`}>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[[false,"Alleen vandaag"],[true,"Voortaan in mijn schema"]].map(([v,l])=><button key={l} onClick={()=>setPermanent(v)} style={{flex:1,padding:"9px 6px",borderRadius:10,fontSize:13,fontWeight:600,border:`1px solid ${permanent===v?col+"80":"#26262d"}`,background:permanent===v?col+"18":"transparent",color:permanent===v?col:"#a8a8b0"}}>{l}</button>)}
      </div>
      <div className="lbl" style={{marginBottom:2}}>Zelfde spiergroep</div>
      {same.length?same.map(Opt):<div className="muted" style={{fontSize:13.5,padding:"10px 0"}}>Geen andere oefeningen voor {ex.muscle} in je schema.</div>}
      <button onClick={()=>setShowAll(s=>!s)} className="btn-ghost" style={{marginTop:10}}>{showAll?"Minder tonen":"Alle oefeningen tonen"}</button>
      {showAll&&<div style={{marginTop:6}}>{others.map(Opt)}</div>}
      <div className="lbl" style={{marginTop:18,marginBottom:8}}>Nieuwe oefening</div>
      <input value={name} onChange={e=>{setName(e.target.value);setErr("")}} placeholder="Bijvoorbeeld Chest Press Machine" className="inp" style={{marginBottom:8}}/>
      <select value={muscle} onChange={e=>setMuscle(e.target.value)} className="inp" style={{marginBottom:8}}>
        {MUSCLES.map(m=><option key={m} value={m}>{m}</option>)}
      </select>
      {err&&<div style={{fontSize:13,color:"#f87171",marginBottom:8}}>{err}</div>}
      <button onClick={addNew} className="btn-primary" style={{background:col}}>Toevoegen en wisselen</button>
    </Sheet>
  );
}

function NoteSheet({ex,col,onClose}){
  const [text,setText]=useState(()=>getExNote(ex.name));
  function save(){setExNote(ex.name,text);onClose()}
  return(
    <Sheet onClose={save} title={`Notitie bij ${ex.name}`}>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={3} autoFocus placeholder="Stoelstand 4, brede grip, kabel op stand 2" className="inp" style={{height:"auto",padding:"12px 14px",fontSize:15,lineHeight:1.5,marginBottom:10}}/>
      <div className="muted" style={{fontSize:12.5,marginBottom:12}}>Deze notitie zie je elke keer bij {ex.name}, ook op andere trainingsdagen.</div>
      <button onClick={save} className="btn-primary" style={{background:col}}>Opslaan</button>
    </Sheet>
  );
}

// ─── VOORTGANG ────────────────────────────────────────────────────────────────
function ProgressTab(){
  const [showBW,setShowBW]=useState(false);
  const [rev,setRev]=useState(0);
  const bwHist=lsGet("pf_bw",[]);
  const weeks=weeklyAverages(bwHist).slice(-8);
  const cur=weeks[weeks.length-1],prevW=weeks[weeks.length-2];
  const diff=cur&&prevW?cur.avg-prevW.avg:null;

  const weekStart=weekStartOf(new Date());
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return localKey(d)});
  const all=lsGet("pf_ex",{});
  const cat=catalog();
  const volByMuscle={};
  cat.forEach(ex=>{
    const n=(all[ex.id]||[]).filter(h=>weekDays.includes(h.date)).reduce((a,h)=>a+h.sets.filter(x=>num(x.weight)>0||num(x.reps)>0).length,0);
    if(n>0)volByMuscle[ex.muscle]=(volByMuscle[ex.muscle]||0)+n;
  });
  const prs=cat.map(ex=>({...ex,pr:getPR(ex.id),lastDate:getExHist(ex.id)[0]?.date||null})).filter(e=>e.pr>0);
  const prByName=new Map();prs.forEach(p=>{const k=p.name.toLowerCase();if(!prByName.has(k)||prByName.get(k).pr<p.pr)prByName.set(k,p)});
  const prList=[...prByName.values()].sort((a,b)=>(b.lastDate||"").localeCompare(a.lastDate||"")).slice(0,12);
  const maxAvg=weeks.length?Math.max(...weeks.map(w=>w.avg)):0,minAvg=weeks.length?Math.min(...weeks.map(w=>w.avg)):0;

  return(
    <div className="fu" key={rev}>
      <div className="h1" style={{marginBottom:14}}>Voortgang</div>

      {/* Gewicht als weekgemiddelde */}
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div className="lbl">Gewicht, gemiddeld per week</div>
            {cur?<>
              <div className="syne" style={{fontSize:30,color:"#38bdf8",marginTop:4}}>{fmtNum(cur.avg.toFixed(1))} kg</div>
              <div className="muted" style={{fontSize:13}}>{diff!=null?`${diff>0?"+":""}${fmtNum(diff.toFixed(1))} kg t.o.v. vorige week, `:""}{cur.n} {cur.n===1?"weging":"wegingen"} deze week</div>
            </>:<div className="muted" style={{fontSize:14,marginTop:6}}>Nog geen wegingen.</div>}
          </div>
          <button onClick={()=>setShowBW(true)} className="pill" style={{color:"#38bdf8",borderColor:"#38bdf855"}}><I n="plus" s={14}/>Weging</button>
        </div>
        {weeks.length>=2&&<div style={{display:"flex",alignItems:"flex-end",gap:6,height:64,marginTop:14}}>
          {weeks.map((w,i)=>{const h=maxAvg===minAvg?40:14+((w.avg-minAvg)/(maxAvg-minAvg))*46;return(
            <div key={w.week} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",height:h,borderRadius:6,background:i===weeks.length-1?"#38bdf8":"#38bdf840"}}/>
              <div style={{fontSize:10.5,color:"#8b8b95"}}>{fmtDate(w.week).replace(".","")}</div>
            </div>
          )})}
        </div>}
      </div>

      {/* Volume */}
      <div className="card">
        <div className="lbl" style={{marginBottom:12}}>Sets deze week</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {MUSCLES.map(m=>{
            const sets=volByMuscle[m]||0,target=TARGETS[m],p=Math.min(sets/target,1),c=MUSCLE_COLORS[m];
            return(
              <div key={m}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontSize:13.5,color:"#c4c4cc",textTransform:"capitalize"}}>{m}</div>
                  <div style={{fontSize:12.5,color:p>=1?c:"#8b8b95"}}>{sets}/{target}</div>
                </div>
                <div style={{height:4,background:"#1f1f25",borderRadius:2}}><div style={{height:"100%",borderRadius:2,background:c,width:`${p*100}%`,transition:"width .6s ease"}}/></div>
              </div>
            );
          })}
        </div>
      </div>

      <CalendarCard/>

      {/* PR's */}
      <div className="card">
        <div className="lbl" style={{marginBottom:6}}>Persoonlijke records</div>
        {prList.length===0?<div className="muted" style={{fontSize:14,padding:"10px 0"}}>Log je eerste sets, dan verschijnen hier je PR's.</div>:
          prList.map(ex=><div key={ex.id} className="row" style={{justifyContent:"space-between"}}>
            <div style={{minWidth:0}}><div className="syne" style={{fontSize:14.5}}>{ex.name}</div>{ex.lastDate&&<div className="muted" style={{fontSize:12.5}}>laatst {fmtDate(ex.lastDate)}</div>}</div>
            <div className="syne" style={{fontSize:16,color:MUSCLE_COLORS[ex.muscle]||"#e8e8e8"}}>{fmtNum(ex.pr)} kg</div>
          </div>)}
      </div>

      <BackupCard/>
      {showBW&&<BWModal onClose={()=>{setShowBW(false);setRev(r=>r+1)}}/>}
    </div>
  );
}

function CalendarCard(){
  const now=new Date();
  const [yr,setYr]=useState(now.getFullYear());
  const [mo,setMo]=useState(now.getMonth());
  const [calData,setCalData]=useState(()=>lsGet("pf_cal",{}));
  const monthName=new Date(yr,mo,1).toLocaleDateString("nl-NL",{month:"long",year:"numeric"});
  const offset=(new Date(yr,mo,1).getDay()+6)%7;
  const dim=new Date(yr,mo+1,0).getDate();
  const todayStr=todayKey();
  const moStr=`${yr}-${String(mo+1).padStart(2,"0")}`;
  function prevMo(){if(mo===0){setYr(y=>y-1);setMo(11)}else setMo(m=>m-1)}
  function nextMo(){if(mo===11){setYr(y=>y+1);setMo(0)}else setMo(m=>m+1)}
  function toggle(ds){if(ds>todayStr)return;const u={...calData,[ds]:!calData[ds]};if(!u[ds])delete u[ds];setCalData(u);lsSet("pf_cal",u)}
  const all=lsGet("pf_ex",{});
  const dayMuscles={};
  catalog().forEach(ex=>{(all[ex.id]||[]).filter(h=>h.date.startsWith(moStr)).forEach(h=>{(dayMuscles[h.date]=dayMuscles[h.date]||[]);if(!dayMuscles[h.date].includes(ex.muscle))dayMuscles[h.date].push(ex.muscle)})});
  let trainedCount=0,planned=0;
  for(let i=1;i<=dim;i++){
    const ds=`${moStr}-${String(i).padStart(2,"0")}`;
    if(ds>todayStr)break;
    if(calData[ds]||dayMuscles[ds]?.length>0)trainedCount++;
    if(SCHEDULE[new Date(yr,mo,i).getDay()]!==undefined)planned++;
  }
  const cells=[];for(let i=0;i<offset;i++)cells.push(null);for(let i=1;i<=dim;i++)cells.push(i);
  return(
    <div className="card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={prevMo} className="pill" aria-label="Vorige maand"><I n="left" s={14}/></button>
        <div className="syne" style={{fontSize:15}}>{cap(monthName)}</div>
        <button onClick={nextMo} className="pill" aria-label="Volgende maand" style={{transform:"scaleX(-1)"}}><I n="left" s={14}/></button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
        {["ma","di","wo","do","vr","za","zo"].map(d=><div key={d} style={{textAlign:"center",fontSize:11.5,color:"#8b8b95"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {cells.map((day,i)=>{
          if(!day)return <div key={"e"+i}/>;
          const ds=`${moStr}-${String(day).padStart(2,"0")}`;
          const trained=calData[ds]||dayMuscles[ds]?.length>0;
          const isToday=ds===todayStr,isFuture=ds>todayStr;
          const ms=dayMuscles[ds]||[];
          return(
            <button key={ds} onClick={()=>toggle(ds)} style={{aspectRatio:"1",borderRadius:9,background:trained?"#a3e63516":"#17171b",border:`1px solid ${isToday?"#a3e635":trained?"#a3e63538":"#222228"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,opacity:isFuture?.3:1}}>
              <div style={{fontSize:12.5,color:isToday?"#a3e635":trained?"#e8e8e8":"#8b8b95",fontWeight:isToday?700:400}}>{day}</div>
              {trained&&<div style={{display:"flex",gap:2}}>{(ms.length?ms.slice(0,3):["x"]).map(m=><div key={m} style={{width:4,height:4,borderRadius:"50%",background:MUSCLE_COLORS[m]||"#a3e635"}}/>)}</div>}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:12,display:"flex",justifyContent:"space-between",fontSize:13}}>
        <div className="muted">{trainedCount} {trainedCount===1?"training":"trainingen"}</div>
        <div style={{color:planned&&trainedCount>=planned?"#a3e635":"#8b8b95"}}>{planned?`${Math.min(trainedCount,planned)}/${planned} van je schema`:"nog geen geplande dagen"}</div>
      </div>
    </div>
  );
}

// ─── BACK-UP ──────────────────────────────────────────────────────────────────
function BackupCard(){
  const [msg,setMsg]=useState("");
  const [last,setLast]=useState(()=>lsGet("pf_last_backup",null));
  const fileRef=useRef(null);
  const age=last?Math.round((new Date(todayKey()+T12)-new Date(last+T12))/86400000):null;
  async function exportData(){
    const data={};
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("pf_")&&k!=="pf_last_backup")data[k]=localStorage.getItem(k)}
    const name="pimfit-backup-"+todayKey()+".json";
    const json=JSON.stringify({app:"pim-fit",versie:2,gemaakt:new Date().toISOString(),data});
    const blob=new Blob([json],{type:"application/json"});
    let file=null;try{file=new File([blob],name,{type:"application/json"})}catch{}
    try{
      if(file&&navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],title:"Pim Fit back-up"});
      else{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},1500)}
      lsSet("pf_last_backup",todayKey());setLast(todayKey());setMsg("Back-up gemaakt");
    }catch(e){if(e&&e.name==="AbortError")return;setMsg("Back-up maken lukte niet.")}
  }
  function importData(e){
    const f=e.target.files&&e.target.files[0];e.target.value="";if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      let j=null;try{j=JSON.parse(r.result)}catch{}
      if(!j||j.app!=="pim-fit"||!j.data||typeof j.data!=="object"){setMsg("Dit bestand is geen Pim Fit back-up.");return}
      const keys=Object.keys(j.data).filter(k=>k.startsWith("pf_")&&typeof j.data[k]==="string");
      if(!keys.length){setMsg("Deze back-up is leeg.");return}
      const when=j.gemaakt?new Date(j.gemaakt).toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"}):"een onbekende datum";
      if(!window.confirm(`Back-up van ${when} terugzetten? Wat nu in de app staat wordt vervangen.`))return;
      const old={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("pf_"))old[k]=localStorage.getItem(k)}
      try{Object.keys(old).forEach(k=>localStorage.removeItem(k));keys.forEach(k=>localStorage.setItem(k,j.data[k]))}
      catch{
        try{Object.keys(localStorage).filter(k=>k.startsWith("pf_")).forEach(k=>localStorage.removeItem(k));Object.keys(old).forEach(k=>localStorage.setItem(k,old[k]))}catch{}
        setMsg("Terugzetten lukte niet. Je oude data staat er nog.");return;
      }
      location.reload();
    };
    r.readAsText(f);
  }
  return(
    <div className="card">
      <div className="lbl" style={{marginBottom:6}}>Back-up</div>
      <div style={{fontSize:13.5,color:"#a8a8b0",lineHeight:1.55,marginBottom:12}}>
        Je data staat alleen op deze telefoon. {last?<>Laatste back-up: <span style={{color:age>=14?"#fb923c":"#e8e8e8"}}>{fmtDate(last)}</span>{age>=14?", tijd voor een nieuwe.":"."}</>:"Je hebt nog geen back-up gemaakt."}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={exportData} className="btn-primary" style={{flex:1,background:"#a3e635"}}>Back-up maken</button>
        <button onClick={()=>fileRef.current&&fileRef.current.click()} className="btn-ghost" style={{flex:1,height:50}}>Terugzetten</button>
      </div>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={importData} style={{display:"none"}}/>
      {msg&&<div className="muted" style={{fontSize:13,marginTop:10}}>{msg}</div>}
    </div>
  );
}

// ─── NOTITIES ─────────────────────────────────────────────────────────────────
function NotesTab(){
  const notes=[];
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    if(k&&k.startsWith("pf_note_")){const text=lsGet(k,"");if(text&&String(text).trim())notes.push({date:k.replace("pf_note_",""),text:String(text).trim()})}
  }
  notes.sort((a,b)=>b.date.localeCompare(a.date));
  const exNotes=Object.values(lsGet("pf_exnote",{})).sort((a,b)=>a.name.localeCompare(b.name));
  const today=todayKey();
  const allEx=lsGet("pf_ex",{});
  const cal=lsGet("pf_cal",{});
  const fmtFull=d=>new Date(d+T12).toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"});
  function getWorkoutLabel(date){
    const logged=Object.keys(allEx).filter(id=>(allEx[id]||[]).some(h=>h.date===date));
    if(logged.length){
      const si=lsGet("pf_split_"+date,null);
      const d=si!=null&&DAYS[si]?DAYS[si]:EX_DAY[logged.find(id=>EX_DAY[id])];
      if(d)return{text:d,color:DAY_COLORS[DAYS.indexOf(d)]};
      return{text:"getraind",color:"#a3e635"};
    }
    if(cal[date])return{text:"getraind",color:"#a3e635"};
    return{text:"rustdag",color:null};
  }
  return(
    <div className="fu">
      <div className="h1" style={{marginBottom:14}}>Notities</div>
      {exNotes.length>0&&<div className="card">
        <div className="lbl" style={{marginBottom:4}}>Instellingen per oefening</div>
        {exNotes.map(n=><div key={n.name} className="row" style={{alignItems:"flex-start",flexDirection:"column",gap:2}}><div className="syne" style={{fontSize:14.5}}>{n.name}</div><div style={{fontSize:14,color:"#c4c4cc"}}>{n.text}</div></div>)}
      </div>}
      {notes.length===0?(
        <div className="card"><div className="muted" style={{fontSize:14,textAlign:"center",padding:"20px 0"}}>Nog geen notities. Schrijf iets na je training.</div></div>
      ):notes.map(n=>{
        const label=getWorkoutLabel(n.date);
        return(
          <div key={n.date} className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:8}}>
              <div className="syne" style={{fontSize:15,color:n.date===today?"#a3e635":"#e8e8e8"}}>{cap(fmtFull(n.date))}</div>
              <div style={{fontSize:12,fontWeight:600,color:label.color||"#8b8b95",background:label.color?label.color+"15":"transparent",border:`1px solid ${label.color?label.color+"35":"#26262d"}`,padding:"3px 9px",borderRadius:7,whiteSpace:"nowrap"}}>{label.text}</div>
            </div>
            <div style={{fontSize:14.5,color:"#c4c4cc",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{n.text}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const TABS=[{id:"today",label:"Vandaag",icon:"calendar",color:"#a3e635"},{id:"progress",label:"Voortgang",icon:"chart",color:"#38bdf8"},{id:"notes",label:"Notities",icon:"notes",color:"#fb923c"}];

function App(){
  const [tab,setTab]=useState("today");
  const [training,setTraining]=useState(()=>{const t=lsGet("pf_training",null);return t&&t.date===todayKey()?t:null});
  const [rest,setRest]=useState(()=>{const r=lsGet("pf_timer",null);return r&&r.endAt>Date.now()-3000?r:null});
  useEffect(()=>{if(rest)lsSet("pf_timer",rest);else lsDel("pf_timer")},[rest]);
  useEffect(()=>{if(training)lsSet("pf_training",training);else lsDel("pf_training")},[training]);
  return(
    <div className="app-shell">
      <div className="page" key={training?"training":tab}>
        {training?<TrainingMode dayIdx={training.dayIdx} startId={training.id}
            onExit={()=>setTraining(null)}
            onMove={id=>setTraining(t=>t&&t.id!==id?{...t,id}:t)}
            onRest={(sec,name)=>setRest({endAt:Date.now()+sec*1000,total:sec,name})}/>
          :tab==="today"?<TodayTab onStart={(dayIdx,id)=>setTraining({dayIdx,id,date:todayKey()})}/>
          :tab==="progress"?<ProgressTab/>
          :<NotesTab/>}
      </div>
      <RestBar rest={rest} setRest={setRest}/>
      {!training&&<div className="tabbar">
        {TABS.map(t=>(
          <button key={t.id} className="tabbtn" onClick={()=>setTab(t.id)} aria-current={tab===t.id?"page":undefined}>
            <I n={t.icon} s={21} c={tab===t.id?t.color:"#8b8b95"}/>
            <div style={{fontSize:11.5,fontWeight:600,color:tab===t.id?t.color:"#8b8b95"}}>{t.label}</div>
          </button>
        ))}
      </div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
