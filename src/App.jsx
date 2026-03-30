import { useState, useEffect, useRef, useCallback } from "react";

const SHOWS = [
  { id:0,  title:"Friends",            emoji:"☕", accent:"#D4A800", bg:"#1a1500", words:["RACHEL","MONICA","PHOEBE","JOEY","CHANDLER","ROSS","COFFEE","PIVOT","LOBSTER","GUNTHER","MANHATTAN","SANDWICH","SMELLY","DINOSAUR","DIVORCE"] },
  { id:1,  title:"Game of Thrones",    emoji:"🐉", accent:"#C0392B", bg:"#100000", words:["STARK","LANNISTER","TARGARYEN","DRAGON","DAENERYS","TYRION","ARYA","SANSA","SNOW","KHALEESI","DIREWOLF","THRONE","DOTHRAKI","WILDFIRE","WINTERFELL"] },
  { id:2,  title:"Breaking Bad",       emoji:"⚗️",  accent:"#27AE60", bg:"#001008", words:["WALTER","JESSE","HEISENBERG","CRYSTAL","SAUL","HANK","SKYLER","TUCO","MIKE","RICIN","LAUNDRY","CARTEL","CANCER","BARREL","COOKING"] },
  { id:3,  title:"The Crown",          emoji:"👑", accent:"#8E44AD", bg:"#0d0010", words:["ELIZABETH","PHILIP","MARGARET","CHARLES","DIANA","WINDSOR","PALACE","BUCKINGHAM","ROYAL","SCANDAL","CROWN","CAMILLA","ABDICATION","PORTRAIT","PROTOCOL"] },
  { id:4,  title:"Stranger Things",    emoji:"🔦", accent:"#E74C3C", bg:"#100005", words:["ELEVEN","DEMOGORGON","HAWKINS","DUSTIN","LUCAS","HOPPER","VECNA","MINDFLAYER","EGGO","BILLY","PSYCHIC","PORTAL","RUSSIA","UPSIDE","BARB"] },
  { id:5,  title:"Harry Potter",       emoji:"⚡", accent:"#C8900A", bg:"#120e00", words:["HARRY","HERMIONE","DUMBLEDORE","VOLDEMORT","HOGWARTS","GRYFFINDOR","SLYTHERIN","SNAPE","PATRONUS","HORCRUX","DOBBY","WAND","MALFOY","SORTING","BASILISK"] },
  { id:6,  title:"The Godfather",      emoji:"🌹", accent:"#D35400", bg:"#0d0800", words:["CORLEONE","MICHAEL","VITO","SONNY","FREDO","BARZINI","SICILY","OMERTA","GODFATHER","BAPTISM","REVENGE","BETRAYAL","CARLO","SOLLOZZO","SENATOR"] },
  { id:7,  title:"Titanic",            emoji:"🚢", accent:"#2471A3", bg:"#000a10", words:["JACK","ROSE","ICEBERG","DIAMOND","NECKLACE","LIFEBOAT","CARPATHIA","BOILER","COMPASS","DANCE","SURVIVAL","ATLANTIC","CALEDON","STEERAGE","PORTRAIT"] },
  { id:8,  title:"Inception",          emoji:"🌀", accent:"#17A589", bg:"#001010", words:["COBB","ARIADNE","ARTHUR","SAITO","LIMBO","DREAM","TOTEM","PARADOX","ARCHITECT","GRAVITY","SPINNING","SUBCONSCIOUS","EAMES","FISHER","SEDATIVE"] },
  { id:9,  title:"The Office",         emoji:"📎", accent:"#2471A3", bg:"#00080f", words:["MICHAEL","DWIGHT","JIM","PAM","ANGELA","CREED","TOBY","DUNDER","MIFFLIN","SCRANTON","BEARS","BATTLESTAR","PRETZEL","KELLY","STANLEY"] },
  { id:10, title:"Peaky Blinders",     emoji:"🎩", accent:"#B7950B", bg:"#120f00", words:["TOMMY","ARTHUR","POLLY","GRACE","ALFIE","CAMPBELL","SHELBY","GARRISON","RAZORS","CAPONE","WHISKY","BLINDERS","OPIUM","BIRMINGHAM","BETTING"] },
  { id:11, title:"Wuthering Heights",  emoji:"🌿", accent:"#717D7E", bg:"#080a0a", words:["HEATHCLIFF","CATHERINE","EDGAR","HINDLEY","LOCKWOOD","HARETON","EARNSHAW","MOORS","REVENGE","PASSION","GHOST","YORKSHIRE","OBSESSION","LINTON","NELLY"] },
  { id:12, title:"Interstellar",       emoji:"🪐", accent:"#1E8449", bg:"#000d04", words:["COOPER","MURPH","AMELIA","TARS","ENDURANCE","WORMHOLE","BLACKHOLE","TESSERACT","GRAVITY","GARGANTUA","QUANTUM","BLIGHT","SATURN","LAZARUS","DOCKING"] },
  { id:13, title:"Pulp Fiction",       emoji:"💼", accent:"#CA6F1E", bg:"#0f0800", words:["VINCENT","MIA","JULES","MARSELLUS","BUTCH","LANCE","BRIEFCASE","OVERDOSE","BURGER","WALLET","ROYALE","EZEKIEL","JIMMIE","PAWNSHOP","ZORRO"] },
  { id:14, title:"The Shawshank",      emoji:"🔑", accent:"#808B96", bg:"#080808", words:["ANDY","RED","NORTON","BROOKS","TUNNEL","POSTER","LIBRARY","WARDEN","PAROLE","HOPE","ESCAPE","FREEDOM","TOMMY","HADLEY","PACIFIC"] },
  { id:15, title:"Downton Abbey",      emoji:"🏰", accent:"#A04000", bg:"#0d0600", words:["CARSON","BATES","ANNA","THOMAS","DAISY","ROBERT","MARY","MATTHEW","VIOLET","BRANSON","ABBEY","GRANTHAM","HUGHES","EDITH","SYBIL"] },
  { id:16, title:"Sherlock",           emoji:"🔍", accent:"#117A65", bg:"#00100d", words:["HOLMES","WATSON","MORIARTY","IRENE","MYCROFT","LESTRADE","BAKER","VIOLIN","DEDUCTION","MAGNUSSEN","BASKERVILLE","PALACE","ADLER","REDBEARD","COCAINE"] },
  { id:17, title:"The Sopranos",       emoji:"🍝", accent:"#7D3C98", bg:"#0a0010", words:["TONY","CARMELA","CHRISTOPHER","PAULIE","SILVIO","JUNIOR","MEADOW","MELFI","BADA","BING","GABAGOOL","CAPO","LIVIA","JERSEY","THERAPY"] },
  { id:18, title:"The Wire",           emoji:"📡", accent:"#B7770D", bg:"#0a0800", words:["MCNULTY","OMAR","STRINGER","AVON","BUNK","GREGGS","DANIELS","LESTER","CARCETTI","MARLO","BARKSDALE","CORNER","BUBBLES","SNOOP","RAWLS"] },
  { id:19, title:"Schindler's List",   emoji:"🕯️", accent:"#717D7E", bg:"#050505", words:["SCHINDLER","STERN","GOETH","KRAKOW","FACTORY","REFUGEES","GHETTO","PLASZOW","RESCUE","HUMANITY","DIAMONDS","SURVIVAL","LISTEK","EMALIA","PRAYER"] },
  { id:20, title:"The Lion King",      emoji:"🦁", accent:"#D4900A", bg:"#120800", words:["SIMBA","MUFASA","NALA","TIMON","PUMBAA","SCAR","RAFIKI","SARABI","HAKUNA","MATATA","STAMPEDE","PRIDELANDS","ZAZU","HYENA","SAVANNAH"] },
  { id:21, title:"Frozen",             emoji:"❄️", accent:"#1A8FAA", bg:"#000d14", words:["ELSA","ANNA","KRISTOFF","OLAF","SVEN","HANS","ARENDELLE","BLIZZARD","TROLLS","CORONATION","SNOWMAN","CONCEAL","REVEAL","FJORD","REINDEER"] },
  { id:22, title:"Toy Story",          emoji:"🤠", accent:"#1F618D", bg:"#00060f", words:["WOODY","BUZZ","JESSIE","SLINKY","HAMM","LOTSO","BULLSEYE","ANDY","ZURG","SHERIFF","INFINITY","DAYCARE","FORKY","BONNIE","COWBOY"] },
  { id:23, title:"Finding Nemo",       emoji:"🐠", accent:"#CC4400", bg:"#000810", words:["NEMO","MARLIN","DORY","GILL","BLOAT","CRUSH","SQUIRT","DARLA","NIGEL","SHARK","DENTIST","CLOWNFISH","PELICAN","TURTLE","CORAL"] },
  { id:24, title:"The Incredibles",    emoji:"🦸", accent:"#B03030", bg:"#0f0000", words:["ROBERT","HELEN","VIOLET","DASH","EDNA","SYNDROME","FROZONE","OMNIDROID","SUPERHERO","COSTUME","ELASTIC","VILLAIN","MIRAGE","ISLAND","ROCKET"] },
  { id:25, title:"Shrek",              emoji:"🧅", accent:"#4A8A1A", bg:"#030d00", words:["SHREK","FIONA","DONKEY","FARQUAAD","PUSS","DRAGON","DULOC","SWAMP","FAIRY","CHARMING","OGRE","ONION","LAYERS","MIRROR","GINGERBREAD"] },
  { id:26, title:"Moana",              emoji:"🌊", accent:"#148A8A", bg:"#000d0d", words:["MOANA","MAUI","TAMATOA","GRAMMA","MOTUNUI","WAYFINDING","OCEAN","COCONUT","DEMIGOD","CANOE","VOYAGER","HEART","LAVA","HOOK","SPIRAL"] },
  { id:27, title:"Coco",               emoji:"💀", accent:"#C06000", bg:"#0d0400", words:["MIGUEL","HECTOR","IMELDA","ERNESTO","DANTE","RIVERA","OFRENDA","MARIGOLD","GUITAR","MEMORY","ALEBRIJE","BLESSING","SKELETON","BRIDGE","PHOTOGRAPH"] },
  { id:28, title:"How To Train Dragon",emoji:"🐲", accent:"#177A90", bg:"#000c10", words:["HICCUP","TOOTHLESS","ASTRID","STOICK","GOBBER","BERK","NIGHTFURY","GRONCKLE","ZIPPLEBACK","ALPHA","ACADEMY","TRAINING","SNOTLOUT","FISHLEGS","NADDER"] },
  { id:29, title:"Up",                 emoji:"🎈", accent:"#B8860B", bg:"#0d0c00", words:["CARL","ELLIE","RUSSELL","DUG","KEVIN","MUNTZ","PARADISE","FALLS","BALLOONS","ADVENTURE","EXPLORER","WILDERNESS","SQUIRREL","SCRAPBOOK","GRAPE"] },
  { id:30, title:"Encanto",            emoji:"🦋", accent:"#8E24AA", bg:"#0d0010", words:["MIRABEL","LUISA","ISABELA","DOLORES","CAMILO","ABUELA","BRUNO","CASITA","COLOMBIA","CANDLE","MIRACLE","PROPHECY","JULIETA","PEPA","VISION"] },
];

const GRID_SIZE = 16;
const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

function buildGrid(words) {
  const grid = Array.from({length:GRID_SIZE}, () => Array(GRID_SIZE).fill(''));
  const placed = [];
  const sorted = [...words].sort((a,b) => b.length - a.length);
  for (const word of sorted) {
    let placed2 = false;
    for (let attempt = 0; attempt < 500 && !placed2; attempt++) {
      const [dr,dc] = DIRS[Math.floor(Math.random()*DIRS.length)];
      const maxR = dr===1?GRID_SIZE-word.length:dr===-1?word.length-1:GRID_SIZE-1;
      const minR = dr===-1?word.length-1:0;
      const maxC = dc===1?GRID_SIZE-word.length:dc===-1?word.length-1:GRID_SIZE-1;
      const minC = dc===-1?word.length-1:0;
      if (maxR<minR||maxC<minC) continue;
      const r = minR+Math.floor(Math.random()*(maxR-minR+1));
      const c = minC+Math.floor(Math.random()*(maxC-minC+1));
      let ok = true;
      for (let i=0;i<word.length;i++){const nr=r+dr*i,nc=c+dc*i;if(grid[nr][nc]!==''&&grid[nr][nc]!==word[i]){ok=false;break;}}
      if (ok){for(let i=0;i<word.length;i++)grid[r+dr*i][c+dc*i]=word[i];placed.push({word,r,c,dr,dc});placed2=true;}
    }
  }
  const alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r=0;r<GRID_SIZE;r++)for(let c=0;c<GRID_SIZE;c++)if(!grid[r][c])grid[r][c]=alpha[Math.floor(Math.random()*26)];
  return {grid,placed};
}

function getCells(r1,c1,r2,c2){
  const dr=r2-r1,dc=c2-c1,len=Math.max(Math.abs(dr),Math.abs(dc));
  if(len===0)return[[r1,c1]];
  const sr=Math.sign(dr),sc=Math.sign(dc);
  if(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc))
    return Math.abs(dr)>Math.abs(dc)?Array.from({length:Math.abs(dr)+1},(_,i)=>[r1+sr*i,c1]):Array.from({length:Math.abs(dc)+1},(_,i)=>[r1,c1+sc*i]);
  return Array.from({length:len+1},(_,i)=>[r1+sr*i,c1+sc*i]);
}

const cellKey=(r,c)=>r+','+c;

function useWindowWidth(){
  const [w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener('resize',fn);return()=>window.removeEventListener('resize',fn);},[]);
  return w;
}

export default function WordSearch() {
  const [screen,setScreen]=useState('picker');
  const [showIdx,setShowIdx]=useState(null);
  const [gameData,setGameData]=useState(null);
  const [found,setFound]=useState(new Set());
  const [sel,setSel]=useState(null);
  const [dragging,setDragging]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [flash,setFlash]=useState(null);
  const [darkMode,setDarkMode]=useState(true);
  const [revealedWord,setRevealedWord]=useState(null);
  const [points,setPoints]=useState(0);
  const [revealMode,setRevealMode]=useState(false);

  const gRef=useRef(null),selRef=useRef(null),commitRef=useRef(null);
  const timerRef=useRef(null),startRef=useRef(null),gridContRef=useRef(null);

  const winW=useWindowWidth();
  const isMobile=winW<640;
  const isTablet=winW>=640&&winW<900;
  const show=showIdx!==null?SHOWS[showIdx]:null;
  const accentColor=show?.accent||'#C8900A';
  const dk=darkMode;

  // Cell size — 16x16 grid fits comfortably on any phone
  const availW = isMobile ? winW - 24 : isTablet ? Math.min(winW*0.55, 420) : Math.min(winW*0.45, 460);
  const cellPx = Math.floor(availW / GRID_SIZE);

  // ── Theme ──────────────────────────────────────────────────────────
  const T = dk ? {
    pageBg: screen==='game'?(show?.bg||'#0a0a0a'):'#0a0a0a',
    text:'#F0F0F0', muted:'#AAAAAA', subtle:'#777777', faint:'#2a2a2a',
    surface:'rgba(255,255,255,0.06)', surfaceHover:'rgba(255,255,255,0.11)',
    border:'rgba(255,255,255,0.12)', borderHover:'rgba(255,255,255,0.38)',
    gridBorder: (a)=>a+'66',
    gridBg:'rgba(255,255,255,0.03)',
    cellDefault:'#888888',
    cellHover:'rgba(255,255,255,0.1)',
    selBg:'rgba(255,255,255,0.25)', selColor:'#ffffff',
    scrollTrack:'#111', scrollThumb:'#555',
    btnBg:'rgba(255,255,255,0.08)', btnBorder:'rgba(255,255,255,0.18)', btnText:'#CCCCCC',
    toggleBg:'rgba(255,255,255,0.08)', toggleBorder:'rgba(255,255,255,0.18)',
    toggleIcon:'☀️',
    progressTrack:'rgba(255,255,255,0.12)',
    footerText:'#444', footerAccent:'#666',
    sectionColor:{tv:'#BBBBBB',disney:'#5BBFDF',pixar:'#F09030',dreamworks:'#7EC840'},
    taglineColor:'#D4A800',
    pillBg:'rgba(255,255,255,0.07)', pillText:'#BBBBBB',
    pillFoundBg:(a)=>a+'30', pillFoundText:(a)=>a, pillFoundBorder:(a)=>a+'77',
    wordCount:'#888',
  } : {
    // Warm ink-on-parchment
    pageBg: screen==='game'?'#EDE5D0':'#F5EDD8',
    text:'#1E1208', muted:'#6A5030', subtle:'#8A6A40', faint:'#D8C8A8',
    surface:'rgba(60,30,5,0.07)', surfaceHover:'rgba(60,30,5,0.13)',
    border:'rgba(60,30,5,0.18)', borderHover:'rgba(60,30,5,0.45)',
    gridBorder:(a)=>a+'99',
    gridBg:'rgba(60,30,5,0.04)',
    cellDefault:'#8A6A40',
    cellHover:'rgba(60,30,5,0.1)',
    selBg:'rgba(60,30,5,0.22)', selColor:'#1E1208',
    scrollTrack:'#DDD0B4', scrollThumb:'#B8A07A',
    btnBg:'rgba(60,30,5,0.08)', btnBorder:'rgba(60,30,5,0.22)', btnText:'#6A5030',
    toggleBg:'rgba(60,30,5,0.08)', toggleBorder:'rgba(60,30,5,0.22)',
    toggleIcon:'🌙',
    progressTrack:'rgba(60,30,5,0.12)',
    footerText:'#C0AA80', footerAccent:'#8A7050',
    sectionColor:{tv:'#5A3A18',disney:'#005F99',pixar:'#A04500',dreamworks:'#2E6010'},
    taglineColor:'#A07000',
    pillBg:'rgba(60,30,5,0.08)', pillText:'#6A5030',
    pillFoundBg:(a)=>a+'28', pillFoundText:(a)=>a, pillFoundBorder:(a)=>a+'88',
    wordCount:'#9A7A50',
  };

  useEffect(()=>{
    if(screen!=='game'){clearInterval(timerRef.current);return;}
    startRef.current=Date.now()-elapsed*1000;
    timerRef.current=setInterval(()=>setElapsed(Math.floor((Date.now()-startRef.current)/1000)),500);
    return()=>clearInterval(timerRef.current);
  },[screen]);

  function startGame(idx){
    const s=SHOWS[idx];
    const{grid,placed}=buildGrid(s.words);
    gRef.current={grid,placed};
    setShowIdx(idx);setGameData({grid,placed});setFound(new Set());
    setSel(null);setElapsed(0);setFlash(null);setRevealedWord(null);setPoints(0);setRevealMode(false);setScreen('game');
  }

  const commit=useCallback(()=>{
    if(!selRef.current||!gRef.current){setDragging(false);setSel(null);return;}
    const{r1,c1,r2,c2}=selRef.current;
    const cells=getCells(r1,c1,r2,c2);
    const word=cells.map(([r,c])=>gRef.current.grid[r][c]).join('');
    const wordRev=word.split('').reverse().join('');
    const match=gRef.current.placed.find(p=>(p.word===word||p.word===wordRev)&&!Array.from(found).includes(p.word));
    if(match){
      setFound(prev=>{const next=new Set(prev);next.add(match.word);if(next.size===gRef.current.placed.length)setTimeout(()=>setScreen('done'),600);return next;});
      setPoints(p=>p+1);
      setFlash({cells:cells.map(([r,c])=>cellKey(r,c)),type:'good'});
      setTimeout(()=>setFlash(null),700);
    }else{
      setFlash({cells:cells.map(([r,c])=>cellKey(r,c)),type:'bad'});
      setTimeout(()=>setFlash(null),400);
    }
    setDragging(false);setSel(null);selRef.current=null;
  },[found]);

  useEffect(()=>{commitRef.current=commit;},[commit]);
  useEffect(()=>{
    const up=()=>commitRef.current?.();
    window.addEventListener('mouseup',up);
    return()=>window.removeEventListener('mouseup',up);
  },[]);

  function cellFromPoint(x,y){
    const els=document.elementsFromPoint(x,y);
    for(const el of els)if(el.dataset.r!==undefined&&el.dataset.c!==undefined)return{r:+el.dataset.r,c:+el.dataset.c};
    return null;
  }
  const onCellDown=(r,c,e)=>{e.preventDefault();setDragging(true);const s={r1:r,c1:c,r2:r,c2:c};selRef.current=s;setSel(s);};
  const onCellEnter=(r,c)=>{if(!dragging||!selRef.current)return;const s={...selRef.current,r2:r,c2:c};selRef.current=s;setSel(s);};
  const onTouchStart=(e)=>{e.preventDefault();const t=e.touches[0];const cell=cellFromPoint(t.clientX,t.clientY);if(!cell)return;setDragging(true);const s={r1:cell.r,c1:cell.c,r2:cell.r,c2:cell.c};selRef.current=s;setSel(s);};
  const onTouchMove=(e)=>{e.preventDefault();const t=e.touches[0];const cell=cellFromPoint(t.clientX,t.clientY);if(!cell||!selRef.current)return;const s={...selRef.current,r2:cell.r,c2:cell.c};selRef.current=s;setSel({...s});};
  const onTouchEnd=(e)=>{e.preventDefault();commitRef.current?.();};

  function triggerGameOver(word){
    clearInterval(timerRef.current);
    setRevealedWord(word);
    setRevealMode(false);
    setScreen('gameover');
  }

  function handlePillClick(word){
    if(found.has(word)) return;
    if(revealMode){
      // spend 8 points, auto-complete this word
      setFound(prev=>{
        const next=new Set(prev);
        next.add(word);
        if(next.size===gRef.current.placed.length) setTimeout(()=>setScreen('done'),600);
        return next;
      });
      setPoints(p=>p-8);
      setRevealMode(false);
    } else {
      triggerGameOver(word);
    }
  }

  const selCellSet=new Set();
  if(sel)getCells(sel.r1,sel.c1,sel.r2,sel.c2).forEach(([r,c])=>selCellSet.add(cellKey(r,c)));

  const foundCellMap=new Map();
  if(gameData)for(const p of gameData.placed){
    if(!found.has(p.word))continue;
    getCells(p.r,p.c,p.r+p.dr*(p.word.length-1),p.c+p.dc*(p.word.length-1)).forEach(([r,c])=>foundCellMap.set(cellKey(r,c),p.word));
  }
  const flashSet=new Set(flash?.cells||[]);
  const fmtTime=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');

  const SECTIONS=[
    {label:'📺 TV Shows & Films',color:T.sectionColor.tv,       ids:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]},
    {label:'🏰 Disney',          color:T.sectionColor.disney,    ids:[21,26,30]},
    {label:'🤖 Pixar',           color:T.sectionColor.pixar,     ids:[22,23,24,27,29]},
    {label:'🐉 DreamWorks',      color:T.sectionColor.dreamworks, ids:[20,25,28]},
  ];

  const cardMin=isMobile?140:185;
  const fs=Math.max(11,Math.floor(cellPx*0.52))+'px';

  const ToggleBtn = ()=>(
    <button onClick={()=>setDarkMode(d=>!d)} title="Toggle theme"
      style={{background:T.toggleBg,border:'1px solid '+T.toggleBorder,borderRadius:20,padding:'5px 11px',cursor:'pointer',fontSize:'0.9rem',lineHeight:1,flexShrink:0}}>
      {T.toggleIcon}
    </button>
  );

  return (
    <div style={{minHeight:'100vh',background:T.pageBg,fontFamily:"'Georgia',serif",color:T.text,display:'flex',flexDirection:'column',alignItems:'center',transition:'background 0.35s,color 0.25s',padding:isMobile?'0 8px 28px':'0 14px 36px',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        html,body{margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${T.scrollTrack};}
        ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px;}
        .cine-cell{display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;font-family:'Crimson Text',serif;font-weight:800;border-radius:3px;transition:background 0.07s,color 0.07s;}
        .cine-cell:hover{background:${T.cellHover};}
        .word-pill{padding:5px 11px;border-radius:20px;font-family:'Cinzel',serif;letter-spacing:0.06em;cursor:pointer;transition:all 0.15s;border:1px solid ${T.border};text-transform:uppercase;white-space:nowrap;font-size:${isMobile?'0.7rem':'0.75rem'};}
        .word-pill:hover{transform:scale(1.04);}
        .show-card{border:1px solid ${T.border};border-radius:12px;padding:14px 12px;cursor:pointer;transition:all 0.2s;background:${T.surface};display:flex;flex-direction:column;gap:5px;position:relative;overflow:hidden;}
        .show-card:hover{transform:translateY(-2px);border-color:${T.borderHover};background:${T.surfaceHover};}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
        .found-pop{animation:pop 0.28s ease;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
      `}</style>

      {/* ══ PICKER ══ */}
      {screen==='picker'&&(
        <div style={{width:'100%',maxWidth:980,animation:'fadeIn 0.5s ease'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'20px 0 4px':'28px 0 6px'}}>
            <div style={{flex:1}}/>
            <div style={{textAlign:'center',flex:2}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'clamp(1.8rem,4vw,2.8rem)',fontWeight:900,letterSpacing:'0.08em',color:T.text,textShadow:dk?'0 0 40px rgba(255,255,255,0.15)':'0 2px 10px rgba(60,30,5,0.12)'}}>
                🍿 PopcornPuzzle
              </div>
              <div style={{fontFamily:"'Crimson Text',serif",color:T.taglineColor,fontSize:'0.68rem',letterSpacing:'0.24em',marginTop:5,textTransform:'uppercase'}}>
                The Ultimate Screen Word Search
              </div>
              <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'0.8rem',marginTop:6,fontStyle:'italic'}}>
                {SHOWS.length} titles · choose one to begin
              </div>
            </div>
            <div style={{flex:1,display:'flex',justifyContent:'flex-end'}}><ToggleBtn/></div>
          </div>

          <div style={{height:'1px',background:T.border,margin:isMobile?'18px 0':'22px 0'}}/>

          {SECTIONS.map(section=>(
            <div key={section.label} style={{marginBottom:isMobile?20:28}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.63rem',letterSpacing:'0.2em',color:section.color,marginBottom:10,paddingBottom:7,borderBottom:'1px solid '+T.border}}>
                {section.label}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax('+cardMin+'px, 1fr))',gap:isMobile?8:11}}>
                {section.ids.map(id=>{
                  const i=SHOWS.findIndex(s=>s.id===id);const s=SHOWS[i];if(!s)return null;
                  return(
                    <div key={s.id} className="show-card" onClick={()=>startGame(i)}>
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:s.accent,borderRadius:'0 0 12px 12px'}}/>
                      <div style={{fontSize:isMobile?'1.3rem':'1.4rem'}}>{s.emoji}</div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'0.7rem':'0.76rem',fontWeight:700,color:s.accent,letterSpacing:'0.04em',lineHeight:1.3}}>{s.title}</div>
                      <div style={{fontSize:'0.62rem',color:T.muted}}>{s.words.length} words</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{textAlign:'center',marginTop:32,paddingTop:20,borderTop:'1px solid '+T.border}}>
            <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.66rem',letterSpacing:'0.16em',color:T.footerText,textTransform:'uppercase'}}>Produced by</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.92rem',fontWeight:700,color:T.footerAccent,letterSpacing:'0.12em',marginTop:4}}>Papa Bona Owusu</div>
          </div>
        </div>
      )}

      {/* ══ GAME ══ */}
      {screen==='game'&&show&&gameData&&(
        <div style={{width:'100%',maxWidth:1100,animation:'fadeIn 0.4s ease'}}>

          {/* Header */}
          <div style={{display:'flex',alignItems:'center',gap:8,padding:isMobile?'14px 0 8px':'20px 0 12px'}}>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:isMobile?'6px 10px':'6px 14px',borderRadius:8,cursor:'pointer',fontFamily:"'Crimson Text',serif",fontSize:isMobile?'0.8rem':'0.88rem',whiteSpace:'nowrap',flexShrink:0}}>
              ← {isMobile?'Back':'PopcornPuzzle'}
            </button>
            <div style={{textAlign:'center',flex:1,overflow:'hidden'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'0.95rem':'clamp(1rem,2.5vw,1.6rem)',fontWeight:700,color:accentColor,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                {show.emoji} {show.title}
              </div>
            </div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1rem':'1.15rem',color:accentColor,flexShrink:0,minWidth:50,textAlign:'right'}}>
              {fmtTime(elapsed)}
            </div>
            <ToggleBtn/>
          </div>

          {/* Points + Reveal */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:isMobile?8:10,flexWrap:'wrap'}}>
            {/* Points bar */}
            <div style={{display:'flex',alignItems:'center',gap:6,background:T.surface,border:'1px solid '+T.border,borderRadius:20,padding:'5px 14px',flexShrink:0}}>
              <span style={{fontSize:'0.85rem'}}>⭐</span>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:'0.82rem',fontWeight:700,color:T.text}}>{points}</span>
              <span style={{fontFamily:"'Crimson Text',serif",fontSize:'0.72rem',color:T.muted}}>pts</span>
            </div>
            {/* Reveal button */}
            {points>=8 ? (
              <button
                onClick={()=>setRevealMode(r=>!r)}
                style={{
                  background: revealMode ? accentColor : T.btnBg,
                  border:'1px solid '+(revealMode ? accentColor : T.btnBorder),
                  color: revealMode ? '#fff' : T.btnText,
                  padding:'5px 14px', borderRadius:20, cursor:'pointer',
                  fontFamily:"'Cinzel',serif", fontSize:'0.78rem', fontWeight:700,
                  letterSpacing:'0.04em',
                  boxShadow: revealMode ? '0 0 12px '+accentColor+'88' : 'none',
                  transition:'all 0.2s',
                  animation: revealMode ? 'pulse 1.2s infinite' : 'none',
                }}>
                💡 {revealMode ? 'Tap a word to reveal (−8pts)' : 'Reveal a word (8pts)'}
              </button>
            ) : (
              <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.72rem',color:T.subtle,fontStyle:'italic'}}>
                {8-points} more point{8-points===1?'':'s'} to unlock a reveal
              </div>
            )}
          </div>
          <div style={{height:4,background:T.progressTrack,borderRadius:2,marginBottom:isMobile?10:14,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:2,background:accentColor,width:((found.size/gameData.placed.length)*100)+'%',transition:'width 0.4s ease',boxShadow:'0 0 8px '+accentColor}}/>
          </div>

          {/* Grid + words */}
          <div style={{display:'flex',flexDirection:isMobile?'column':'row',gap:isMobile?14:22,alignItems:'flex-start'}}>

            {/* Grid — always fits screen, no scroll needed */}
            <div style={{display:'flex',justifyContent:isMobile?'center':'flex-start',flexShrink:0,width:isMobile?'100%':'auto'}}>
              <div
                ref={gridContRef}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                style={{
                  display:'grid',
                  gridTemplateColumns:'repeat('+GRID_SIZE+', '+cellPx+'px)',
                  gap:2,
                  background:T.gridBg,
                  border:'2px solid '+T.gridBorder(accentColor),
                  borderRadius:12,
                  padding:isMobile?6:8,
                  touchAction:'none',
                  boxShadow:'0 0 32px '+accentColor+(dk?'25':'33'),
                }}
              >
                {gameData.grid.map((row,r)=>row.map((ch,c)=>{
                  const key=cellKey(r,c);
                  const isFound=foundCellMap.has(key),isSel=selCellSet.has(key),isFlash=flashSet.has(key);
                  let bg='transparent',color=T.cellDefault;
                  if(isFound){bg=accentColor+'38';color=accentColor;}
                  if(isSel){bg=T.selBg;color=T.selColor;}
                  if(isFlash){bg=flash.type==='good'?accentColor+'AA':'rgba(200,40,40,0.6)';color='#fff';}
                  return(
                    <div key={key} className="cine-cell" data-r={r} data-c={c}
                      onMouseDown={e=>onCellDown(r,c,e)} onMouseEnter={()=>onCellEnter(r,c)}
                      style={{width:cellPx+'px',height:cellPx+'px',fontSize:fs,background:bg,color,fontWeight:isFound?900:700}}>
                      {ch}
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* Word list */}
            <div style={{flex:1,minWidth:0,width:'100%'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.14em',color:T.wordCount,marginBottom:10}}>
                {found.size} / {gameData.placed.length} FOUND
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:isMobile?6:7}}>
                {gameData.placed.map(p=>{
                  const isFound=found.has(p.word);
                  return(
                    <div key={p.word} className={'word-pill'+(isFound?' found-pop':'')}
                      onClick={()=>handlePillClick(p.word)}
                      style={{
                        background:isFound?T.pillFoundBg(accentColor): revealMode&&!isFound ? accentColor+'18' : T.pillBg,
                        color:isFound?T.pillFoundText(accentColor):revealMode&&!isFound ? accentColor : T.pillText,
                        textDecoration:isFound?'line-through':'none',
                        borderColor:isFound?T.pillFoundBorder(accentColor):revealMode&&!isFound ? accentColor+'88' : T.border,
                        cursor:isFound?'default':revealMode?'cell':'pointer',
                        fontWeight:isFound?700:600,
                        transform: revealMode&&!isFound ? 'scale(1.03)' : 'scale(1)',
                      }}>
                      {p.word}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{textAlign:'center',marginTop:isMobile?16:24,fontFamily:"'Crimson Text',serif",fontSize:'0.6rem',color:T.faint,letterSpacing:'0.1em'}}>
            PopcornPuzzle · Produced by Papa Bona Owusu
          </div>
        </div>
      )}

      {/* ══ GAME OVER ══ */}
      {screen==='gameover'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.5s ease',textAlign:'center',padding:'24px'}}>
          <div style={{fontSize:'3.5rem'}}>💀</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'2.4rem',fontWeight:900,color:'#C0392B',letterSpacing:'0.06em'}}>
            Game Over
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:isMobile?'1rem':'1.1rem',fontStyle:'italic',maxWidth:320,lineHeight:1.6}}>
            You peeked at <span style={{color:'#C0392B',fontWeight:700,fontStyle:'normal',letterSpacing:'0.08em'}}>{revealedWord}</span> — that's cheating!
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.subtle,fontSize:'0.88rem'}}>
            {found.size} of {gameData?.placed.length} words found · {fmtTime(elapsed)}
          </div>
          <div style={{display:'flex',gap:12,marginTop:10,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx)} style={{background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.55)',color:'#C0392B',padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>
              Try Again
            </button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>
              Choose Another
            </button>
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.62rem',color:T.faint,letterSpacing:'0.1em',marginTop:6}}>
            PopcornPuzzle · Produced by Papa Bona Owusu
          </div>
        </div>
      )}

      {/* ══ DONE ══ */}
      {screen==='done'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.6s ease',textAlign:'center',padding:'24px'}}>
          <div style={{fontSize:'3.5rem'}}>🎉</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'clamp(1.5rem,5vw,2.5rem)',fontWeight:900,color:accentColor}}>Completed!</div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:isMobile?'1rem':'1.1rem',fontStyle:'italic'}}>
            {show.emoji} {show.title} — all {gameData?.placed.length} words found
          </div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'2.2rem',color:T.text,marginTop:4}}>{fmtTime(elapsed)}</div>
          <div style={{display:'flex',gap:12,marginTop:10,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx)} style={{background:accentColor+'22',border:'1px solid '+accentColor+'88',color:accentColor,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>Play Again</button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>Choose Another</button>
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.62rem',color:T.faint,letterSpacing:'0.1em',marginTop:6}}>
            PopcornPuzzle · Produced by Papa Bona Owusu
          </div>
        </div>
      )}
    </div>
  );
}
