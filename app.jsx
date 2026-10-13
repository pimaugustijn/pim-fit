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
const DOW=["ma","di","wo","do","vr","za","zo"];
const MON=["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];

// ─── LOOPSCHEMA ───────────────────────────────────────────────────────────────
// Per week: s = maandag, p = fase, runs = [datum, tekst, soort, km]. gymOff = weekdagen zonder gym (0 = ma).
const RUN_COLOR="#2dd4bf";
const RUNPLAN=[
    { s:'2026-10-12', p:1, runs:[['2026-10-15','30 min rustig','easy'],['2026-10-17','7 km rustig','long',7]] },
    { s:'2026-10-19', p:1, runs:[['2026-10-22','35 min rustig + 4 strides','easy'],['2026-10-24','8 km rustig','long',8]] },
    { s:'2026-10-26', p:1, tag:'Lichte week', light:true, runs:[['2026-10-29','30 min rustig','easy'],['2026-10-31','6 km rustig','long',6]] },
    { s:'2026-11-02', p:1, runs:[['2026-11-05','40 min rustig + 4 strides','easy'],['2026-11-07','9 km rustig','long',9]] },
    { s:'2026-11-09', p:1, tag:'Lichte week', light:true, runs:[['2026-11-12','30 min rustig','easy'],['2026-11-14','7 km rustig','long',7]] },
    { s:'2026-11-16', p:1, tag:'Je eerste 10 km', goal:true, note:'Dinsdag lower niet tot falen, zaterdag wil je frisse benen.', runs:[['2026-11-19','25 min heel rustig','easy'],['2026-11-21','10 km, rustig tempo','goal',10]] },

    { s:'2026-11-23', p:2, tag:'Herstel', light:true, runs:[['2026-11-26','30 min rustig','easy'],['2026-11-28','7 km rustig','long',7]] },
    { s:'2026-11-30', p:2, runs:[['2026-12-03','40 min rustig + 4 strides','easy'],['2026-12-05','10 km rustig','long',10]] },
    { s:'2026-12-07', p:2, runs:[['2026-12-10','40 min rustig + 6 strides','easy'],['2026-12-12','11 km rustig','long',11]] },
    { s:'2026-12-14', p:2, tag:'Lichte week', light:true, runs:[['2026-12-17','30 min rustig','easy'],['2026-12-19','8 km rustig','long',8]] },
    { s:'2026-12-21', p:2, tag:'Kerst', note:'Komt een dag niet uit door de feestdagen, schuif dan een dag op. Niet twee dagen achter elkaar lopen.', runs:[['2026-12-24','40 min rustig + 6 strides','easy'],['2026-12-26','12 km rustig','long',12]] },
    { s:'2026-12-28', p:2, tag:'Oud en nieuw', runs:[['2026-12-31','40 min rustig','easy'],['2027-01-02','13 km rustig','long',13]] },

    { s:'2027-01-04', p:3, tag:'Lichte week met testloop', light:true, note:'Nieuw: maandagochtend een korte rustige run. Lukt maandag niet, doe hem dan woensdagochtend.', runs:[['2027-01-04','30 min rustig','easy'],['2027-01-07','Testloop: 15 min inlopen, 5 km zo hard als je volhoudt, 10 min uitlopen. Noteer je tijd en hoogste hartslag.','test'],['2027-01-09','10 km rustig','long',10]] },
    { s:'2027-01-11', p:3, note:'Vanaf nu ben je zaterdag langer dan anderhalf uur onderweg. Neem iets te eten mee, en drink vrijdagavond liefst niet.', runs:[['2027-01-11','30 min rustig','easy'],['2027-01-14','45 min rustig + 6 strides','easy'],['2027-01-16','14 km rustig','long',14]] },
    { s:'2027-01-18', p:3, runs:[['2027-01-18','30 min rustig','easy'],['2027-01-21','10 min inlopen, 2 × 10 min stevig met 3 min rustig ertussen, 10 min uitlopen','tempo'],['2027-01-23','15 km rustig','long',15]] },
    { s:'2027-01-25', p:3, runs:[['2027-01-25','35 min rustig','easy'],['2027-01-28','45 min rustig + 6 strides','easy'],['2027-01-30','16 km rustig','long',16]] },
    { s:'2027-02-01', p:3, tag:'Vastenavond', carnaval:true, runs:[['2027-02-01','30 min rustig','easy'],['2027-02-04','50 min rustig','easy'],['2027-02-06','Vastenavond, geen run','off']] },
    { s:'2027-02-08', p:3, tag:'Vastenavond', gymOff:[0,1], note:'Maandag en dinsdag geen gym. Donderdag rustig weer opstarten.', runs:[['2027-02-11','30 min rustig','easy'],['2027-02-13','15 km rustig','long',15]] },
    { s:'2027-02-15', p:3, runs:[['2027-02-15','35 min rustig','easy'],['2027-02-18','10 min inlopen, 3 × 8 min stevig met 3 min rustig ertussen, 10 min uitlopen','tempo'],['2027-02-20','17 km rustig','long',17]] },
    { s:'2027-02-22', p:3, tag:'Langste loop', runs:[['2027-02-22','35 min rustig','easy'],['2027-02-25','45 min rustig + 6 strides','easy'],['2027-02-27','18 km rustig','long',18]] },
    { s:'2027-03-01', p:3, tag:'Afbouwen', light:true, note:'Lower lichter: minder sets, niet tot falen.', runs:[['2027-03-01','30 min rustig','easy'],['2027-03-04','10 min inlopen, 2 × 8 min stevig met 3 min rustig ertussen, 10 min uitlopen','tempo'],['2027-03-06','12 km rustig','long',12]] },
    { s:'2027-03-08', p:3, tag:'Raceweek', goal:true, gymOff:[1], note:'Geen lower deze week. Vanaf vrijdag geen alcohol, zaterdag rust en niet stappen.', runs:[['2027-03-08','25 min rustig','easy'],['2027-03-11','25 min rustig + 4 strides','easy'],['2027-03-14','Halve marathon Den Haag, 21,1 km','race',21.1]] },

    { s:'2027-03-15', p:4, tag:'Herstel', light:true, note:'De eerste dagen na Den Haag niet lopen, wandelen mag. Lower deze week licht.', runs:[['2027-03-18','25 min heel rustig','easy'],['2027-03-20','6 km rustig','long',6]] },
    { s:'2027-03-22', p:4, runs:[['2027-03-22','30 min rustig','easy'],['2027-03-25','10 min inlopen, 6 × 2 min vlot met 2 min joggen ertussen, 10 min uitlopen','tempo'],['2027-03-27','9 km rustig + 4 strides','long',9]] },
    { s:'2027-03-29', p:4, tag:'Raceweek', goal:true, gymOff:[1], note:'Geen lower deze week. Vrijdag hooguit een of twee drankjes, zaterdag niks en niet stappen.', runs:[['2027-03-29','25 min rustig','easy'],['2027-04-01','10 min inlopen, 3 × 1 min vlot met 2 min rustig ertussen, 10 min uitlopen','tempo'],['2027-04-04','Singelloop Breda, 5 km','race',5]] }
];
const RUN_PHASES={
    1: { t:'Naar 10 km', when:'12 oktober tot 22 november', intro:'Twee runs per week, alles rustig. Je bouwt afstand op, tempo maakt nu niet uit.' },
    2: { t:'Basis houden', when:'23 november tot 3 januari', intro:'Na je 10 km niet meteen doorknallen. De zaterdag groeit rustig naar 13 km, met de feestdagen ertussen.' },
    3: { t:'Naar de halve marathon', when:'4 januari tot 14 maart', intro:'Een derde run op maandagochtend, af en toe stevig op donderdag, en de zaterdag naar 18 km. Vastenavond is je rustweek.' },
    4: { t:'Naar de Singelloop', when:'15 maart tot 4 april', intro:'Eerst herstellen van de halve, dan een paar vlotte blokjes. Minder kilometers, wel wat sneller, zodat je fris en scherp aan de start staat.' }
};
const MARATHON=[["april","Herstellen van de Singelloop, daarna rustig weer opbouwen met 3 runs per week."],["mei–juni","Basis: de lange loop rustig van 12 naar 18 km, één keer per week wat vlotter. Gym nog 3 keer."],["14 juni","Start van de marathonvoorbereiding: 4 runs per week. Gym naar 2 keer, met een lichte lower."],["juli–aug","Lange duurlopen naar 25–28 km. Vrijdagavond dan droog. In de zomer vroeg lopen en genoeg water drinken."],["begin sep","Je langste loop: 30–32 km."],["half sep","Een halve marathon als test, bijvoorbeeld in Rotterdam. Check de datum voor 2027."],["eind sep","Afbouwen: minder kilometers, maar wel je ritme houden."],["zo 10 okt","Marathon Eindhoven, 42,2 km"]];
const GOALS=[["2026-11-21","je 10 km"],["2027-03-14","Den Haag"],["2027-04-04","de Singelloop"],["2027-10-10","de marathon"]];
const RUN_HELP=[["Rustig","Zone 2, 142–156 slagen per minuut. Tot een slag of 160 is prima zolang je hele zinnen kunt praten. Ongeveer 6:30–7:15 per km. Klopt het getal niet met hoe het voelt, dan gaat de praattest voor."],["Strides","Aan het eind van je run 15–20 seconden versnellen tot vlot, niet sprinten. Daarna rustig joggen of wandelen tot je weer op adem bent, en de volgende."],["Stevig","Zone 3, 157–170. Korte zinnen lukken nog, kletsen niet meer. Alleen in de blokjes op donderdag, nooit op zaterdag."],["Vlot","Ongeveer het tempo dat je 5 km zou volhouden. Dat komt pas na Den Haag, in de blokjes voor de Singelloop."],["Testloop","15 min inlopen, 5 km zo hard als je volhoudt, 10 min uitlopen. Noteer je tijd en hoogste hartslag. Kom je hoger uit dan 201, zet dat dan als max in je app."],["Pijn","Wordt het tijdens het lopen erger (scheenbeen, knie, achillespees), stop dan. Doe de week erna de vorige week nog een keer. Is het na een paar dagen niet weg, laat er dan naar kijken."],["Run gemist","Niet inhalen door twee dagen achter elkaar te lopen. Gewoon door met de volgende."],["Ziek","Met koorts loop je niet. Daarna stap je een week terug in het schema."],["Alcohol","Voor een wedstrijd de laatste twee avonden niks. Is je zaterdagloop 14 km of meer, drink dan vrijdag niet of nauwelijks."]];

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
function weekTarget(ws){
  const w=RUNPLAN.find(x=>x.s===localKey(ws));
  if(!w||!w.gymOff)return WEEK_TARGET;
  return Math.max(1,WEEK_TARGET-w.gymOff.filter(d=>[0,1,3].includes(d)).length);
}
function calcStreak(set){
  let s=0;const ws=weekStartOf(new Date());
  if(weekCount(ws,set)>=weekTarget(ws))s++;
  for(let i=1;i<520;i++){const w=new Date(ws);w.setDate(w.getDate()-7*i);if(weekCount(w,set)>=weekTarget(w))s++;else break}
  return s;
}
function markTrained(tk){const cal=lsGet("pf_cal",{});if(!cal[tk]){cal[tk]=true;lsSet("pf_cal",cal)}}

// Hardlopen: elke run heeft als id zijn oorspronkelijke datum. Verplaatsen en invullen staan apart opgeslagen.
const RUN_LIST=[];RUNPLAN.forEach((w,wi)=>w.runs.forEach(r=>RUN_LIST.push({id:r[0],date:r[0],text:r[1],kind:r[2],km:r[3]||null,wi})));
function runMoves(){return lsGet("pf_runmove",{})}
function runDate(run){return runMoves()[run.id]||run.date}
function runLog(id){return lsGet("pf_run_"+id,null)}
function runsOn(date){const mv=runMoves();return RUN_LIST.filter(r=>(mv[r.id]||r.date)===date)}
function weekIdxOf(date){const k=localKey(weekStartOf(new Date(date+T12)));return RUNPLAN.findIndex(w=>w.s===k)}
function gymOffInfo(date){const wi=weekIdxOf(date);if(wi<0)return null;const w=RUNPLAN[wi];const d=(new Date(date+T12).getDay()+6)%7;return w.gymOff&&w.gymOff.includes(d)?w:null}
function runStatus(run,tk){
  if(run.kind==="off")return"off";
  const l=runLog(run.id);
  if(l&&l.done)return"done";
  if(l&&l.skipped)return"skipped";
  const d=runDate(run);
  return d<tk?"missed":d===tk?"today":"planned";
}
function runsInWeek(ws){const k=localKey(ws);return RUN_LIST.filter(r=>r.kind!=="off"&&localKey(weekStartOf(new Date(runDate(r)+T12)))===k)}
const isSpecial=run=>run.kind==="race"||run.kind==="goal";
function runShort(run){
  if(run.kind==="off")return"geen run";
  if(run.km)return`${fmtNum(run.km)} km`;
  if(run.kind==="test")return"testloop";
  if(run.kind==="tempo")return"blokjes";
  const m=run.text.match(/(\d+)\s*min/);return m?`${m[1]} min`:"run";
}
function runSub(run){
  if(run.kind==="race")return"Wedstrijd. Start rustiger dan je wil.";
  if(run.kind==="goal")return"Rustig tempo, het gaat om de afstand.";
  if(run.kind==="test")return"Zo hard als je 5 km volhoudt, met inlopen en uitlopen.";
  if(run.kind==="tempo")return/vlot/.test(run.text)?"Vlotte blokjes op ongeveer 5 km-tempo, de rest rustig.":"Stevige blokjes in zone 3, de rest rustig.";
  if(run.kind==="off")return"";
  return/strides/.test(run.text)?"Rustig in zone 2, met strides aan het eind.":"Rustig in zone 2, op praattempo.";
}
const fmtDur=sec=>{sec=Math.round(sec);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),x=sec%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`:`${m}:${String(x).padStart(2,"0")}`};
function parseDur(str){
  const p=String(str).trim().split(/[:.,]/);
  if(!p.length||p.length>3||p.some(x=>!/^\d+$/.test(x)))return null;
  const n=p.map(Number);let s;
  if(n.length===1)s=n[0]*60;
  else if(n.length===2){if(n[1]>59)return null;s=n[0]*60+n[1]}
  else{if(n[1]>59||n[2]>59)return null;s=n[0]*3600+n[1]*60+n[2]}
  return s>0&&s<6*3600?s:null;
}
function runSummary(l){
  if(!l)return{main:"",sub:""};
  let main="";const parts=[];
  if(l.km)main=`${fmtNum(l.km)} km`;
  if(l.sec)main+=(main?" in ":"")+fmtDur(l.sec);
  if(l.km&&l.sec)parts.push(`${fmtDur(l.sec/l.km)} per km`);
  if(l.hr)parts.push(`hartslag ${l.hr}`);
  if(l.feel)parts.push(l.feel);
  if(l.note)parts.push(l.note);
  if(!main){main="Gedaan";if(!parts.length)parts.push("tik om details in te vullen")}
  return{main,sub:parts.join(", ")};
}
const fmtDayShort=k=>{const d=new Date(k+T12);return`${DOW[(d.getDay()+6)%7]} ${d.getDate()} ${MON[d.getMonth()]}`};
const fmtDayLong=k=>new Date(k+T12).toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"});
function nextGoals(tk,n=2){return GOALS.map(([d,l])=>({d,l,days:Math.round((new Date(d+T12)-new Date(tk+T12))/864e5)})).filter(g=>g.days>0).slice(0,n)}

// ─── SCHERMHOOGTE (iPhone) ────────────────────────────────────────────────────
// iOS geeft in app-modus soms alleen het "veilige" deel van het scherm door. Dan vullen we zelf de volle hoogte.
const FIT={h:0,inner:0,top:0,bottom:0,standalone:false};
function fitScreen(){
  const root=document.getElementById("root");
  const probe=document.createElement("div");
  probe.style.cssText="position:fixed;left:0;top:0;width:0;visibility:hidden;pointer-events:none;height:env(safe-area-inset-top)";
  const probeB=probe.cloneNode();probeB.style.height="env(safe-area-inset-bottom)";
  document.body.appendChild(probe);document.body.appendChild(probeB);
  const standalone=window.navigator.standalone===true||(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches);
  function apply(){
    const top=probe.offsetHeight||0,bottom=probeB.offsetHeight||0;
    let h=window.innerHeight;
    const portrait=window.innerHeight>=window.innerWidth;
    const full=portrait?Math.max(screen.width,screen.height):Math.min(screen.width,screen.height);
    if(standalone&&top>0&&full>h&&full-h<=120)h=full;
    root.style.height=h+"px";
    Object.assign(FIT,{h,inner:window.innerHeight,top,bottom,standalone});
  }
  apply();
  window.addEventListener("resize",apply);
  window.addEventListener("orientationchange",()=>setTimeout(apply,350));
}

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
  run:<><circle cx="14.5" cy="4.5" r="1.8"/><path d="M7 21l3.2-5.5L13 17v4"/><path d="M5 12.5l3.2-3 4 .8 2.3 3.2 3.5 1"/><path d="M10.2 15.5l2-5.2"/></>,
  sun:<><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.9" y1="19.1" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.1" y2="4.9"/></>,
  map:<><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></>,
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
      <div className="muted" style={{fontSize:13,marginTop:-8,marginBottom:14}}>Doel: {WEEK_TARGET} trainingen per week, minder in rust- en raceweken</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {weeks.map((w,i)=>{
          const days=Array.from({length:7},(_,j)=>{const d=new Date(w);d.setDate(d.getDate()+j);return localKey(d)});
          const cnt=days.filter(k=>trained.has(k)).length;
          const tg=weekTarget(w);
          const end=new Date(w);end.setDate(end.getDate()+6);
          return(
            <div key={localKey(w)} style={{padding:"12px 14px",borderRadius:14,background:"#0e0e11",border:"1px solid #222228"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <div style={{fontSize:13.5,fontWeight:600}}>{i===0?"Deze week":`${fmtDate(localKey(w))} – ${fmtDate(localKey(end))}`}</div>
                <div style={{fontSize:13,fontWeight:600,color:cnt>=tg?"#a3e635":cnt>=1?"#fb923c":"#8b8b95"}}>{cnt}/{tg}</div>
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
function TodayTab({onStart,onSchema}){
  const now=new Date();
  const tk=todayKey();
  const plannedIdx=SCHEDULE[now.getDay()];
  const off=plannedIdx!==undefined?gymOffInfo(tk):null;
  const isGymDay=plannedIdx!==undefined&&!off;
  const [splitIdx,setSplitIdx]=useState(()=>lsGet("pf_split_"+tk,plannedIdx!==undefined?plannedIdx:0));
  const [restDay,setRestDay]=useState(()=>lsGet("pf_rest_"+tk,!isGymDay));
  const [exDone,setExDone]=useState(()=>lsGet("pf_done_"+tk,{}));
  const [supps,setSupps]=useState(()=>lsGet("pf_supps_"+tk,{}));
  const [note,setNote]=useState(()=>lsGet("pf_note_"+tk,""));
  const [showBW,setShowBW]=useState(false);
  const [showWeeks,setShowWeeks]=useState(false);
  const [showDays,setShowDays]=useState(false);
  const [runSheet,setRunSheet]=useState(null);
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
  const target=weekTarget(ws);
  const weekN=weekCount(ws,trained);
  const streak=useMemo(()=>calcStreak(trained),[trained]);
  const bw=lsGet("pf_bw",[])[0];

  const todays=runsOn(tk);
  const runsToday=todays.filter(r=>r.kind!=="off");
  const offRun=todays.find(r=>r.kind==="off");
  const wi=weekIdxOf(tk),week=wi>=0?RUNPLAN[wi]:null;
  const weekRuns=runsInWeek(ws);
  const weekRunsDone=weekRuns.filter(r=>runStatus(r,tk)==="done").length;

  const day=DAYS[splitIdx],col=DAY_COLORS[splitIdx];
  const ids=todayIds(day,tk);
  const exs=ids.map(exById).filter(Boolean);
  const doneCount=exs.filter(e=>exDone[e.id]).length;
  const firstOpen=exs.find(e=>!exDone[e.id]);
  const suppCount=SUPPLEMENTS.filter(s=>supps[s.id]).length;
  const both=runsToday.length>0&&!restDay;

  // Eerstvolgende training of run (voor op rustdagen)
  let next=null;
  for(let i=1;i<=10&&!next;i++){
    const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i),k=localKey(d);
    const gi=SCHEDULE[d.getDay()],g=gi!==undefined&&!gymOffInfo(k);
    const rs=runsOn(k).filter(r=>r.kind!=="off");
    if(g||rs.length)next={d,gi:g?gi:undefined,rs};
  }
  const nextText=next?[next.rs.length?`run van ${next.rs.map(runShort).join(", ")}`:null,next.gi!==undefined?DAYS[next.gi]:null].filter(Boolean).join(" en "):"";
  const refresh=()=>setRev(r=>r+1);

  return(
    <div className="fu">
      {/* Kop */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{fontSize:14,color:"#a8a8b0"}}>{cap(now.toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"}))}</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setShowWeeks(true)} className="pill" style={streak>0?{color:"#fb923c",borderColor:"#fb923c55"}:{}}><I n="flame" s={14}/>{streak>0?`${streak} ${streak===1?"week":"weken"}`:`${weekN}/${target}`}</button>
          <button onClick={()=>setShowBW(true)} className="pill"><I n="scale" s={14}/>{bw?`${fmtNum(bw.w)} kg`:"gewicht"}</button>
        </div>
      </div>

      <WeekStrip tk={tk} trained={trained}/>
      <div className="muted" style={{fontSize:12.5,marginTop:8,marginBottom:12}}>Gym {weekN}/{target}{weekRuns.length?`, lopen ${weekRunsDone}/${weekRuns.length}`:""} deze week</div>
      {week&&(week.tag||week.note)&&<div style={{marginBottom:12,padding:"10px 13px",borderRadius:12,background:"#121215",border:"1px solid #222228",fontSize:13.5,lineHeight:1.5,color:"#c4c4cc"}}>
        {week.tag&&<span style={{color:week.goal?"#fbbf24":RUN_COLOR,fontWeight:600}}>{week.tag}{week.note?". ":""}</span>}{week.note||""}
      </div>}

      {runsToday.map(run=><RunCard key={run.id} run={run} tk={tk} label={both?"Ochtendrun":"Hardlopen"} onChange={refresh} onSheet={type=>setRunSheet({type,run})} onSchema={onSchema}/>)}
      {offRun&&<div className="card"><div className="lbl" style={{color:RUN_COLOR}}>Hardlopen</div><div style={{fontSize:15,marginTop:6}}>{offRun.text}</div></div>}

      {!restDay?(
        <div className="card" style={{paddingBottom:6}}>
          {both&&<div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,color:col,fontWeight:600,marginBottom:8}}><I n="moon" s={14} c={col}/>Avondtraining</div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <div className="syne" style={{fontSize:32,color:col,lineHeight:1.05,letterSpacing:"-1px"}}>{day}</div>
              <div className="muted" style={{fontSize:13.5,marginTop:4}}>{exs.length} oefeningen, ongeveer {estMinutes(ids)} minuten</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
              <button onClick={()=>setShowDays(s=>!s)} className="pill">Andere dag <I n="down" s={13}/></button>
              <button onClick={()=>setRestDay(true)} className="pill"><I n="moon" s={13}/>Geen gym</button>
            </div>
          </div>
          {off&&<div style={{fontSize:13,color:"#fb923c",marginTop:10}}>Volgens je loopschema train je vandaag niet: {off.tag?off.tag.toLowerCase():"rustweek"}.</div>}
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
      ):plannedIdx!==undefined&&off?(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <div className="syne" style={{fontSize:24}}>Geen gym vandaag</div>
              <div className="muted" style={{fontSize:13.5,marginTop:4,lineHeight:1.5}}>Zo staat het in je loopschema voor deze week.</div>
            </div>
            <button onClick={()=>setRestDay(false)} className="pill">Toch trainen</button>
          </div>
        </div>
      ):runsToday.length?(
        runsToday.some(isSpecial)?null:<button onClick={()=>setRestDay(false)} className="btn-ghost" style={{marginBottom:12}}>Toch naar de gym vandaag</button>
      ):(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <div className="syne" style={{fontSize:26}}>Rustdag</div>
              {next&&<div className="muted" style={{fontSize:13.5,marginTop:4}}>Volgende: <span style={{color:next.gi!==undefined?DAY_COLORS[next.gi]:RUN_COLOR}}>{next.d.toLocaleDateString("nl-NL",{weekday:"long"})}, {nextText}</span></div>}
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
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={restDay&&!runsToday.length?"Hoe voel je je vandaag?":"Hoe ging het vandaag?"} rows={2} className="inp" style={{height:"auto",padding:"11px 13px",fontSize:14.5,lineHeight:1.5}}/>
      </div>

      {showBW&&<BWModal onClose={()=>{setShowBW(false);refresh()}}/>}
      {showWeeks&&<WeekHistModal onClose={()=>setShowWeeks(false)}/>}
      {runSheet&&runSheet.type==="log"&&<RunLogSheet run={runSheet.run} onClose={()=>{setRunSheet(null);refresh()}}/>}
      {runSheet&&runSheet.type==="move"&&<MoveSheet run={runSheet.run} onClose={()=>{setRunSheet(null);refresh()}}/>}
      {runSheet&&runSheet.type==="help"&&<HelpSheet onClose={()=>setRunSheet(null)}/>}
    </div>
  );
}

// ─── HARDLOPEN ────────────────────────────────────────────────────────────────
function WeekStrip({tk,trained}){
  const ws=weekStartOf(new Date(tk+T12));
  const days=[];
  for(let i=0;i<7;i++){
    const d=new Date(ws);d.setDate(d.getDate()+i);const k=localKey(d);
    const gi=SCHEDULE[d.getDay()],gym=gi!==undefined&&!gymOffInfo(k);
    const runs=runsOn(k).filter(r=>r.kind!=="off");
    if(gym||runs.length)days.push({d,k,gi:gym?gi:undefined,runs});
  }
  return(
    <div style={{display:"flex",gap:5}}>
      {days.map(x=>{
        const gymDone=x.gi!==undefined&&trained.has(x.k);
        const runsDone=x.runs.every(r=>runStatus(r,tk)==="done");
        const allDone=(x.gi===undefined||gymDone)&&runsDone;
        const isT=x.k===tk,past=x.k<tk;
        const c=x.gi!==undefined?DAY_COLORS[x.gi]:(x.runs.some(isSpecial)?"#fbbf24":RUN_COLOR);
        const main=x.gi!==undefined?DAYS[x.gi]:runShort(x.runs[0]);
        const status=allDone?"gedaan":past?"gemist":isT?"vandaag":"gepland";
        const runDone=x.runs.length&&runsDone;
        return(
          <div key={x.k} style={{flex:1,minWidth:0,padding:"7px 3px",borderRadius:12,background:allDone?c+"16":"transparent",border:`1px solid ${isT?c:allDone?c+"40":"#26262d"}`,textAlign:"center"}}>
            <div style={{fontSize:11.5,color:isT||allDone?c:"#8b8b95"}}>{DOW[(x.d.getDay()+6)%7]} {x.d.getDate()}</div>
            <div className="syne" style={{fontSize:13,color:isT||allDone?c:"#e8e8e8",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{main}</div>
            {x.gi!==undefined&&x.runs.length?(
              <div style={{fontSize:11,marginTop:1,color:runDone?RUN_COLOR:past?"#f87171":"#8b8b95",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><I n="run" s={11}/>{runShort(x.runs[0])}</div>
            ):(
              <div style={{fontSize:11,marginTop:1,color:allDone?c:past?"#f87171":"#6b6b75"}}>{status}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RunCard({run,tk,label,onChange,onSheet,onSchema}){
  const l=runLog(run.id)||{};
  const st=runStatus(run,tk);
  const moved=runDate(run)!==run.date;
  const special=isSpecial(run);
  const c=special?"#fbbf24":RUN_COLOR;
  const sum=runSummary(l);
  function quickDone(){lsSet("pf_run_"+run.id,{...l,done:true,skipped:false,savedAt:new Date().toISOString()});onChange()}
  function undo(){lsDel("pf_run_"+run.id);onChange()}
  return(
    <div className="card" style={{borderColor:c+"55"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,color:c,fontWeight:600}}><I n={special?"trophy":"run"} s={15} c={c}/>{label}</span>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>onSheet("help")} className="pill" style={{padding:"5px 10px"}}>Uitleg</button>
          <button onClick={onSchema} className="pill" style={{padding:"5px 10px"}}><I n="map" s={13}/>Schema</button>
        </div>
      </div>
      <div className="syne" style={{fontSize:22,lineHeight:1.2,marginTop:8}}>{run.text}</div>
      <div className="muted" style={{fontSize:13.5,marginTop:3,lineHeight:1.45}}>{runSub(run)}{moved?` Verplaatst van ${fmtDayShort(run.date)}.`:""}</div>
      {st==="done"?(
        <button onClick={()=>onSheet("log")} style={{width:"100%",marginTop:12,padding:"10px 12px",borderRadius:12,background:c+"14",border:`1px solid ${c}45`,display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
          <span style={{width:26,height:26,borderRadius:"50%",background:c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I n="check" s={15} c="#0a0a0c" w={3}/></span>
          <span style={{flex:1,minWidth:0}}><span style={{display:"block",fontSize:15}}>{sum.main}</span>{sum.sub&&<span style={{display:"block",fontSize:12.5,color:special?"#fde68a":"#99f6e4",marginTop:1}}>{sum.sub}</span>}</span>
          <I n="edit" s={15} c="#8b8b95"/>
        </button>
      ):st==="skipped"?(
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,gap:8}}>
          <span className="muted" style={{fontSize:14}}>Overgeslagen</span>
          <button onClick={undo} className="pill">Ongedaan maken</button>
        </div>
      ):(
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={quickDone} className="btn-primary" style={{flex:2,height:46,background:c,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><I n="check" s={16} c="#0a0a0c" w={3}/>Gedaan</button>
          <button onClick={()=>onSheet("log")} className="btn-ghost" style={{flex:1.25,height:46,fontSize:13.5,padding:0}}>Invullen</button>
          <button onClick={()=>onSheet("move")} className="btn-ghost" style={{flex:1.45,height:46,fontSize:13.5,padding:0}}>Verplaatsen</button>
        </div>
      )}
    </div>
  );
}

function RunLogSheet({run,onClose}){
  const l=runLog(run.id)||{};
  const [km,setKm]=useState(l.km?fmtNum(l.km):"");
  const [t,setT]=useState(l.sec?fmtDur(l.sec):"");
  const [hr,setHr]=useState(l.hr?String(l.hr):"");
  const [feel,setFeel]=useState(l.feel||null);
  const [note,setNote]=useState(l.note||"");
  const [err,setErr]=useState("");
  const c=isSpecial(run)?"#fbbf24":RUN_COLOR;
  function save(){
    const o={done:true,savedAt:new Date().toISOString()};
    const k=km.trim(),tt=t.trim(),h=hr.trim();
    if(k){const v=num(k);if(!(v>0&&v<100)||!/^\d+([.,]\d+)?$/.test(k)){setErr("Afstand klopt niet. Vul bijvoorbeeld 4,6 in.");return}o.km=Math.round(v*100)/100}
    if(tt){const sec=parseDur(tt);if(sec==null){setErr("Tijd klopt niet. Vul minuten en seconden in, bijvoorbeeld 31.10.");return}o.sec=sec}
    if(h){if(!/^\d{2,3}$/.test(h)||+h<60||+h>230){setErr("Hartslag klopt niet. Vul je gemiddelde in, bijvoorbeeld 149.");return}o.hr=+h}
    if(feel)o.feel=feel;
    if(note.trim())o.note=note.trim().slice(0,200);
    lsSet("pf_run_"+run.id,o);onClose();
  }
  function clear(){lsDel("pf_run_"+run.id);onClose()}
  const onEdit=f=>e=>{f(e.target.value);setErr("")};
  return(
    <Sheet onClose={onClose} title="Run invullen">
      <div className="muted" style={{fontSize:13.5,marginTop:-8,marginBottom:14}}>{cap(fmtDayLong(runDate(run)))}: {run.text}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8}}>
        <label className="fl">Afstand (km)<input value={km} onChange={onEdit(setKm)} inputMode="decimal" placeholder={run.km?fmtNum(run.km):"4,6"} className="inp set-inp"/></label>
        <label className="fl">Tijd<input value={t} onChange={onEdit(setT)} inputMode="decimal" placeholder="31.10" className="inp set-inp"/></label>
        <label className="fl">Hartslag<input value={hr} onChange={onEdit(setHr)} inputMode="numeric" placeholder="gem." className="inp set-inp"/></label>
      </div>
      <div className="lbl" style={{marginTop:14,marginBottom:8}}>Hoe voelde het?</div>
      <div style={{display:"flex",gap:6}}>
        {["makkelijk","goed","zwaar"].map(f=><button key={f} onClick={()=>setFeel(feel===f?null:f)} className="pill" style={{padding:"8px 14px",fontSize:13.5,...(feel===f?{background:"#e8e8e8",color:"#0a0a0c",borderColor:"#e8e8e8"}:{})}}>{cap(f)}</button>)}
      </div>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Notitie, zoals kuiten iets stijf" maxLength={200} className="inp" style={{marginTop:14}}/>
      {err&&<div style={{fontSize:13,color:"#f87171",marginTop:10}}>{err}</div>}
      <button onClick={save} className="btn-primary" style={{background:c,marginTop:14}}>Opslaan</button>
      {(l.done||l.skipped)&&<button onClick={clear} className="btn-ghost" style={{marginTop:8}}>Wissen</button>}
      <div className="muted" style={{fontSize:12.5,textAlign:"center",marginTop:10}}>Alleen afvinken kan ook, de rest is optioneel.</div>
    </Sheet>
  );
}

function MoveSheet({run,onClose}){
  const tk=todayKey();
  const cur=runDate(run);
  const ws=weekStartOf(new Date(run.date+T12));
  const days=Array.from({length:7},(_,i)=>{const d=new Date(ws);d.setDate(d.getDate()+i);return localKey(d)});
  const busy=k=>runsOn(k).some(r=>r.id!==run.id&&r.kind!=="off");
  const near=k=>{const d=new Date(k+T12),a=new Date(d),b=new Date(d);a.setDate(d.getDate()-1);b.setDate(d.getDate()+1);return busy(localKey(a))||busy(localKey(b))};
  const l=runLog(run.id)||{};
  function moveTo(k){const mv=runMoves();if(k===run.date)delete mv[run.id];else mv[run.id]=k;lsSet("pf_runmove",mv);onClose()}
  function skip(){lsSet("pf_run_"+run.id,{skipped:true,savedAt:new Date().toISOString()});onClose()}
  return(
    <Sheet onClose={onClose} title="Run verplaatsen">
      <div className="muted" style={{fontSize:13.5,marginTop:-8,marginBottom:6}}>{run.text}</div>
      {days.map(k=>{const b=busy(k),isCur=k===cur;return(
        <button key={k} disabled={b} onClick={()=>moveTo(k)} className="row" style={{width:"100%",textAlign:"left",opacity:b?.4:1}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:600,color:isCur?RUN_COLOR:"#e8e8e8"}}>{cap(fmtDayLong(k))}</div>
            <div style={{fontSize:12.5,color:!b&&near(k)?"#fb923c":"#8b8b95"}}>{b?"daar staat al een run":k===run.date?"oorspronkelijke dag":near(k)?"let op: dan loop je twee dagen achter elkaar":k<tk?"al geweest, alleen om in te vullen":""}</div>
          </div>
          {isCur&&<I n="check" s={18} c={RUN_COLOR} w={3}/>}
        </button>
      )})}
      {!l.skipped&&!l.done&&<button onClick={skip} className="btn-ghost" style={{marginTop:14}}>Deze run overslaan</button>}
      <div className="muted" style={{fontSize:12.5,marginTop:10,lineHeight:1.5}}>Een gemiste run haal je niet in door twee dagen achter elkaar te lopen. Ga gewoon door met de volgende.</div>
    </Sheet>
  );
}

function HelpSheet({onClose}){
  return(
    <Sheet onClose={onClose} title="Zo loop je de runs">
      {RUN_HELP.map(([t,d],i)=><div key={t} className="row" style={{flexDirection:"column",alignItems:"flex-start",gap:3,borderTop:i?undefined:"none"}}>
        <div style={{fontSize:14.5,fontWeight:600}}>{t}</div>
        <div style={{fontSize:14,color:"#c4c4cc",lineHeight:1.55}}>{d}</div>
      </div>)}
    </Sheet>
  );
}

function RunPlanView({onBack}){
  const tk=todayKey();
  const [sheet,setSheet]=useState(null);
  const [,setRev]=useState(0);
  const curRef=useRef(null);
  const curWi=weekIdxOf(tk);
  useEffect(()=>{const el=curRef.current;if(el){const p=el.closest(".page");if(p)p.scrollTop=Math.max(0,el.offsetTop-90)}},[]);
  const goals=nextGoals(tk,2);
  function statusEl(run){
    const st=runStatus(run,tk);
    if(st==="done")return <I n="check" s={17} c={isSpecial(run)?"#fbbf24":RUN_COLOR} w={3}/>;
    if(st==="missed")return <span style={{fontSize:12,color:"#f87171"}}>gemist</span>;
    if(st==="skipped")return <span className="muted" style={{fontSize:12}}>overgeslagen</span>;
    if(st==="today")return <span style={{fontSize:12,color:RUN_COLOR}}>vandaag</span>;
    return null;
  }
  return(
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={onBack} className="pill" style={{border:"none",paddingLeft:0,fontSize:14}}><I n="left" s={18}/>Terug</button>
        <button onClick={()=>setSheet({type:"help"})} className="pill">Uitleg</button>
      </div>
      <div className="h1">Loopschema</div>
      <div className="muted" style={{fontSize:13.5,marginTop:4,lineHeight:1.5}}>10 km op 21 november, Den Haag op 14 maart, de Singelloop op 4 april en Eindhoven op 10 oktober.</div>
      {goals.length>0&&<div style={{fontSize:13.5,color:RUN_COLOR,marginTop:6}}>{goals.map(g=>`Nog ${g.days} dagen tot ${g.l}.`).join(" ")}</div>}
      {[1,2,3,4].map(p=>{const P=RUN_PHASES[p];return(
        <div key={p} style={{marginTop:24}}>
          <div className="h2">{P.t}</div>
          <div className="muted" style={{fontSize:13,marginTop:2}}>{P.when}</div>
          <div style={{fontSize:14,color:"#c4c4cc",lineHeight:1.5,margin:"6px 0 10px"}}>{P.intro}</div>
          {RUNPLAN.map((w,wi)=>{
            if(w.p!==p)return null;
            const en=new Date(w.s+T12);en.setDate(en.getDate()+6);
            const isCur=wi===curWi,past=localKey(en)<tk;
            const runs=RUN_LIST.filter(r=>r.wi===wi);
            return(
              <div key={w.s} ref={isCur?curRef:null} className="card" style={{padding:"12px 14px",marginBottom:8,borderColor:isCur?RUN_COLOR+"90":undefined,opacity:past?.78:1}}>
                <div style={{display:"flex",flexWrap:"wrap",alignItems:"baseline",gap:"2px 10px",marginBottom:4}}>
                  <span className="syne" style={{fontSize:15}}>{fmtDate(w.s)} – {fmtDate(localKey(en))}</span>
                  {isCur&&<span style={{fontSize:12.5,color:RUN_COLOR,fontWeight:600}}>deze week</span>}
                  {w.tag&&<span style={{fontSize:12.5,color:w.goal?"#fbbf24":"#8b8b95",fontWeight:w.goal?600:400}}>{w.tag}</span>}
                </div>
                {runs.map(r=>(
                  <button key={r.id} onClick={()=>r.kind!=="off"&&setSheet({type:"log",run:r})} style={{width:"100%",display:"grid",gridTemplateColumns:"66px minmax(0,1fr) auto",gap:10,alignItems:"start",padding:"6px 0",textAlign:"left"}}>
                    <span className="muted" style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>{fmtDayShort(runDate(r))}</span>
                    <span style={{fontSize:14,lineHeight:1.45,color:isSpecial(r)?"#fbbf24":r.kind==="off"?"#8b8b95":"#e8e8e8",fontWeight:isSpecial(r)?600:400}}>{r.text}{runDate(r)!==r.date&&<span className="muted" style={{fontSize:12,fontWeight:400}}> (verplaatst)</span>}</span>
                    {statusEl(r)}
                  </button>
                ))}
                {w.note&&<div className="muted" style={{fontSize:12.5,marginTop:4,lineHeight:1.5}}>{w.note}</div>}
              </div>
            );
          })}
        </div>
      )})}
      <div style={{marginTop:24}}>
        <div className="h2">Daarna: marathon Eindhoven</div>
        <div className="muted" style={{fontSize:13,marginTop:2,marginBottom:10}}>5 april tot 10 oktober 2027, in grote lijnen</div>
        <div className="card" style={{padding:"4px 14px"}}>
          {MARATHON.map(([d,t],i)=><div key={d} className="row" style={{alignItems:"flex-start",borderTop:i?undefined:"none"}}><span className="muted" style={{width:74,flexShrink:0,fontSize:13,fontWeight:600}}>{d}</span><span style={{fontSize:14,lineHeight:1.5,color:i===MARATHON.length-1?"#fbbf24":"#e8e8e8"}}>{t}</span></div>)}
        </div>
      </div>
      {sheet&&sheet.type==="log"&&<RunLogSheet run={sheet.run} onClose={()=>{setSheet(null);setRev(r=>r+1)}}/>}
      {sheet&&sheet.type==="help"&&<HelpSheet onClose={()=>setSheet(null)}/>}
    </div>
  );
}

function RunningCard({onSchema}){
  const tk=todayKey();
  const ws0=weekStartOf(new Date());
  const kmIn=ws=>runsInWeek(ws).reduce((a,r)=>{const l=runLog(r.id);return a+(l&&l.done&&l.km?l.km:0)},0);
  const weeks=Array.from({length:8},(_,i)=>{const w=new Date(ws0);w.setDate(w.getDate()-7*(7-i));return{w,km:kmIn(w)}});
  const cur=weeks[7].km,mx=Math.max(1,...weeks.map(x=>x.km));
  const thisWeek=runsInWeek(ws0);
  const done=thisWeek.filter(r=>runStatus(r,tk)==="done").length;
  const goals=nextGoals(tk,2);
  return(
    <div className="card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="lbl">Hardlopen deze week</div>
          <div className="syne" style={{fontSize:30,color:RUN_COLOR,marginTop:4}}>{fmtNum(cur.toFixed(1))} km</div>
          <div className="muted" style={{fontSize:13}}>{done}/{thisWeek.length} runs gedaan</div>
        </div>
        <button onClick={onSchema} className="pill" style={{color:RUN_COLOR,borderColor:RUN_COLOR+"55"}}><I n="map" s={13}/>Schema</button>
      </div>
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:62,marginTop:14}}>
        {weeks.map((x,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:"100%",height:x.km?8+x.km/mx*36:4,borderRadius:6,background:i===7?RUN_COLOR:x.km?RUN_COLOR+"55":"#26262d"}}/>
          <div style={{fontSize:10.5,color:"#8b8b95"}}>{x.w.getDate()}/{x.w.getMonth()+1}</div>
        </div>)}
      </div>
      {goals.length>0&&<div style={{fontSize:13.5,color:"#c4c4cc",marginTop:12}}>{goals.map(g=>`Nog ${g.days} dagen tot ${g.l}.`).join(" ")}</div>}
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
function ProgressTab({onSchema}){
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

      <RunningCard onSchema={onSchema}/>

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
      <div className="muted" style={{fontSize:11.5,textAlign:"center",lineHeight:1.6,marginTop:4}}>
        Pim Fit 3.1<br/>scherm {screen.width}×{screen.height}, app {FIT.h}, venster {FIT.inner}, boven {FIT.top}, onder {FIT.bottom}, {FIT.standalone?"app-modus":"browser"}
      </div>
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
  const runDays=new Set(RUN_LIST.filter(r=>{const l=runLog(r.id);return l&&l.done}).map(runDate));
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
          const ran=runDays.has(ds);
          return(
            <button key={ds} onClick={()=>toggle(ds)} style={{aspectRatio:"1",borderRadius:9,background:trained?"#a3e63516":"#17171b",border:`1px solid ${isToday?"#a3e635":trained?"#a3e63538":"#222228"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,opacity:isFuture?.3:1}}>
              <div style={{fontSize:12.5,color:isToday?"#a3e635":trained?"#e8e8e8":"#8b8b95",fontWeight:isToday?700:400}}>{day}</div>
              {(trained||ran)&&<div style={{display:"flex",gap:2}}>{trained&&(ms.length?ms.slice(0,3):["x"]).map(m=><div key={m} style={{width:4,height:4,borderRadius:"50%",background:MUSCLE_COLORS[m]||"#a3e635"}}/>)}{ran&&<div style={{width:4,height:4,borderRadius:"50%",background:RUN_COLOR}}/>}</div>}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:12,display:"flex",justifyContent:"space-between",fontSize:13}}>
        <div className="muted">{trainedCount} {trainedCount===1?"training":"trainingen"}{(()=>{const n=[...runDays].filter(d=>d.startsWith(moStr)).length;return n?`, ${n} ${n===1?"run":"runs"}`:""})()}</div>
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
  RUN_LIST.forEach(r=>{const l=runLog(r.id);if(l&&l.note)notes.push({date:runDate(r),text:l.note,run:r})});
  notes.sort((a,b)=>b.date.localeCompare(a.date)||(a.run?1:-1));
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
        const label=n.run?{text:"Hardlopen",color:RUN_COLOR}:getWorkoutLabel(n.date);
        return(
          <div key={(n.run?"r":"d")+n.date} className="card">
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
  const [view,setView]=useState(null);
  const [training,setTraining]=useState(()=>{const t=lsGet("pf_training",null);return t&&t.date===todayKey()?t:null});
  const [rest,setRest]=useState(()=>{const r=lsGet("pf_timer",null);return r&&r.endAt>Date.now()-3000?r:null});
  useEffect(()=>{if(rest)lsSet("pf_timer",rest);else lsDel("pf_timer")},[rest]);
  useEffect(()=>{if(training)lsSet("pf_training",training);else lsDel("pf_training")},[training]);
  return(
    <div className="app-shell">
      <div className="page" key={training?"training":view||tab}>
        {training?<TrainingMode dayIdx={training.dayIdx} startId={training.id}
            onExit={()=>setTraining(null)}
            onMove={id=>setTraining(t=>t&&t.id!==id?{...t,id}:t)}
            onRest={(sec,name)=>setRest({endAt:Date.now()+sec*1000,total:sec,name})}/>
          :view==="schema"?<RunPlanView onBack={()=>setView(null)}/>
          :tab==="today"?<TodayTab onStart={(dayIdx,id)=>setTraining({dayIdx,id,date:todayKey()})} onSchema={()=>setView("schema")}/>
          :tab==="progress"?<ProgressTab onSchema={()=>setView("schema")}/>
          :<NotesTab/>}
      </div>
      <RestBar rest={rest} setRest={setRest}/>
      {!training&&!view&&<div className="tabbar">
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

fitScreen();
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
