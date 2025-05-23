const SHEET_ID = "2PACX-1vRJELEbRqHtvqYSiDxrJ0ZTASU2IDmmpICfkU4JIt3xlnd66xbhZ4KJgtDY29Fe3XR3TD0n76rSBE6y";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
let topics=[];

async function loadData(){
  const txt = await fetch(GVIZ_URL).then(r=>r.text());
  const json = JSON.parse(txt.slice(47,-2));
  const cols = json.table.cols.map(c=>c.label);
  topics = json.table.rows.map(r=>{
    const tmp={};
    r.c.forEach((cell,i)=>{
      const h=cols[i]; const v=cell?.v??"";
      if(h.startsWith("Correct words")||h.startsWith("Distractors")){
        if(!tmp[h])tmp[h]=[];
        try{ if(v) tmp[h].push(JSON.parse(v)); }catch(e){}
      }else tmp[h]=v;
    });
    return {
      topic:tmp["Topic name"],
      lang:tmp["Language code"],
      unit:tmp["Unit"],
      level:tmp["Level"],
      correct:Object.entries(tmp).filter(([k])=>k.startsWith("Correct words")).flatMap(([,v])=>v),
      distractors:Object.entries(tmp).filter(([k])=>k.startsWith("Distractors")).flatMap(([,v])=>v)
    };
  });
  buildMenu();
}
function buildMenu(){
  const menu=document.getElementById("menu");
  menu.innerHTML="";
  const lvls=[...new Set(topics.map(t=>t.level))];
  lvls.forEach(lvl=>{
    const h=document.createElement("h3");h.textContent=lvl;menu.appendChild(h);
    topics.filter(t=>t.level===lvl).forEach(t=>{
      const btn=document.createElement("button");
      btn.className="button";
      btn.textContent=t.topic;
      btn.onclick=()=>startQuiz(t);
      menu.appendChild(btn);
    });
  });
}
let current, qIndex, score;
function startQuiz(topic){
  current=topic;
  qIndex=0;score=0;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  nextQuestion();
}
function nextQuestion(){
  if(qIndex>=15){showResult();return;}
  const quiz=document.getElementById("quiz");
  quiz.innerHTML="";
  const q=current.correct[Math.floor(Math.random()*current.correct.length)];
  const opts=[q.it,...shuffle(current.correct.filter(x=>x!==q).map(x=>x.it)).slice(0,1),...shuffle(current.distractors).slice(0,2).map(x=>x.it)];
  const card=document.createElement("div");card.className="card";quiz.appendChild(card);
  const btnSpeak=document.createElement("button");btnSpeak.textContent="🔊";btnSpeak.className="button secondary";
  btnSpeak.onclick=()=>speak(q.it);card.appendChild(btnSpeak);
  opts.forEach(o=>{
    const b=document.createElement("button");b.className="button";b.textContent=o;
    b.onclick=()=>{
      if(o===q.it){score++;} qIndex++; nextQuestion();
    };card.appendChild(b);
  });
  speak(q.it);
}
function showResult(){
  const quiz=document.getElementById("quiz");
  quiz.innerHTML=`<div class="card"><h2>Finished!</h2><p>Score: ${score}/15</p><button class="button" onclick="endQuiz()">Back</button></div>`;
}
function endQuiz(){
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}
function shuffle(a){return [...a].sort(()=>Math.random()-0.5);}
function speak(text){
  const u=new SpeechSynthesisUtterance(text);u.lang="it-IT";speechSynthesis.speak(u);
}

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}
loadData();