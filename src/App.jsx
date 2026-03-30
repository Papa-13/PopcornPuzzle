import { useState, useEffect, useRef, useCallback } from "react";

const SHOWS = [
  { id:0,  title:"Friends",            emoji:"☕", accent:"#D4A800", bg:"#1a1500", words:["RACHEL","MONICA","PHOEBE","JOEY","CHANDLER","ROSS","COFFEE","PIVOT","UNAGI","LOBSTER","DIVORCE","APARTMENT","LONDON","WEDDING","GUNTHER","JANICE","HUGSY","MANHATTAN","DINOSAUR","SANDWICH","SMELLY","SEVEN","TURKEY","RUGBY"] },
  { id:1,  title:"Game of Thrones",    emoji:"🐉", accent:"#C0392B", bg:"#100000", words:["STARK","LANNISTER","TARGARYEN","DRAGON","WINTERFELL","CERSEI","DAENERYS","TYRION","WESTEROS","WILDFIRE","DOTHRAKI","HODOR","ARYA","SANSA","JOFFREY","THRONE","WOLVES","SNOW","KHALEESI","CASTLE","DIREWOLF","RAVENS","KINGS","STORM"] },
  { id:2,  title:"Breaking Bad",       emoji:"⚗️",  accent:"#27AE60", bg:"#001008", words:["WALTER","JESSE","HEISENBERG","CRYSTAL","CHEMISTRY","CANCER","SAUL","HANK","SKYLER","CARTEL","TUCO","GALE","MIKE","DANGER","COOKING","BARREL","RICIN","HAZMAT","LAUNDRY","YELLOW","SCHOOL","METH","BLUE","PLAZA"] },
  { id:3,  title:"The Crown",          emoji:"👑", accent:"#8E44AD", bg:"#0d0010", words:["ELIZABETH","PHILIP","MARGARET","CHARLES","DIANA","WINDSOR","PALACE","THRONE","CORGIS","ABDICATION","CAMILLA","PREMIER","BUCKINGHAM","ROYAL","DUTY","NATION","PORTRAIT","PROTOCOL","SCANDAL","WEDDING","CROWN","EMPIRE","UNION","FLEET"] },
  { id:4,  title:"Stranger Things",    emoji:"🔦", accent:"#E74C3C", bg:"#100005", words:["ELEVEN","DEMOGORGON","UPSIDE","HAWKINS","DUSTIN","LUCAS","WILL","MIKE","JOYCE","HOPPER","VECNA","MINDFLAYER","EGGO","NETHER","DEMODOGS","BARB","MAX","BILLY","RUSSIA","MALL","WALKIE","PSYCHIC","PORTAL","LAB"] },
  { id:5,  title:"Harry Potter",       emoji:"⚡", accent:"#C8900A", bg:"#120e00", words:["HARRY","HERMIONE","RON","DUMBLEDORE","VOLDEMORT","HOGWARTS","GRYFFINDOR","SLYTHERIN","HUFFLEPUFF","RAVENCLAW","SNAPE","MALFOY","QUIDDITCH","PATRONUS","HORCRUX","DOBBY","SORTING","BROOM","LUPIN","WAND","CASTLE","BASILISK","DEMENTOR","PHOENIX"] },
  { id:6,  title:"The Godfather",      emoji:"🌹", accent:"#D35400", bg:"#0d0800", words:["CORLEONE","MICHAEL","VITO","SONNY","FREDO","CONNIE","TOM","CARLO","BARZINI","SOLLOZZO","SICILY","OFFER","FAMILY","OMERTA","GODFATHER","WEDDING","HORSE","BAPTISM","SENATOR","GARDEN","OLIVE","REVENGE","POWER","BETRAYAL"] },
  { id:7,  title:"Titanic",            emoji:"🚢", accent:"#2471A3", bg:"#000a10", words:["JACK","ROSE","ICEBERG","OCEAN","DIAMOND","NECKLACE","CALEDON","SHIP","RUTH","MOLLY","LIFEBOAT","STEERAGE","CORRIDOR","DRAWING","PORTRAIT","CARPATHIA","BELFAST","PROPELLER","BOILER","COMPASS","DANCE","PROMISE","SURVIVAL","ATLANTIC"] },
  { id:8,  title:"Inception",          emoji:"🌀", accent:"#17A589", bg:"#001010", words:["COBB","ARIADNE","ARTHUR","EAMES","YUSUF","FISHER","SAITO","LIMBO","DREAM","TOTEM","KICK","PARADOX","ARCHITECT","EXTRACTOR","LAYERS","GRAVITY","SPINNING","MAL","SUBCONSCIOUS","SNOWFORT","VAULT","SEDATIVE","REALITY","FREIGHT"] },
  { id:9,  title:"The Office",         emoji:"📎", accent:"#2471A3", bg:"#00080f", words:["MICHAEL","DWIGHT","JIM","PAM","KELLY","RYAN","ANDY","STANLEY","PHYLLIS","MEREDITH","KEVIN","ANGELA","CREED","TOBY","DUNDER","MIFFLIN","SCRANTON","PRETZEL","BEARS","BEETS","BATTLESTAR","THREAT","STAMFORD","SALESMAN"] },
  { id:10, title:"Peaky Blinders",     emoji:"🎩", accent:"#B7950B", bg:"#120f00", words:["TOMMY","ARTHUR","POLLY","JOHN","GRACE","ALFIE","CAMPBELL","SHELBY","GARRISON","BIRMINGHAM","RAZORS","CAPONE","WHISKY","HORSES","BETTING","OPIUM","SABINI","EDEN","COMMUNIST","FASCIST","BLINDERS","BAKER","CHARLIE","GOLD"] },
  { id:11, title:"Wuthering Heights",  emoji:"🌿", accent:"#717D7E", bg:"#080a0a", words:["HEATHCLIFF","CATHERINE","EDGAR","LINTON","HINDLEY","NELLY","LOCKWOOD","HARETON","EARNSHAW","MOORS","REVENGE","PASSION","GHOST","CATHY","THRUSHCROSS","GRANGE","YORKSHIRE","OBSESSION","ORPHAN","STORM","CLIFFS","WILD","GRACE","SPIRIT"] },
  { id:12, title:"Interstellar",       emoji:"🪐", accent:"#1E8449", bg:"#000d04", words:["COOPER","MURPH","AMELIA","MANN","TARS","CASE","ENDURANCE","SATURN","WORMHOLE","BLACKHOLE","TESSERACT","GRAVITY","RELATIVITY","OXYGEN","BLIGHT","GARGANTUA","LAZARUS","QUANTUM","BOOKSHELF","DOCKING","FARMHOUSE","SIGNAL","RESCUE","PLANET"] },
  { id:13, title:"Pulp Fiction",       emoji:"💼", accent:"#CA6F1E", bg:"#0f0800", words:["VINCENT","MIA","JULES","MARSELLUS","BUTCH","HONEY","FABIENNE","LANCE","JIMMIE","WOLF","BRIEFCASE","DINER","OVERDOSE","BURGER","WALLET","ROYALE","REDEMPTION","EZEKIEL","MOTORCYCLE","PAWNSHOP","GIMP","WATCH","ZORRO","DANCE"] },
  { id:14, title:"The Shawshank",      emoji:"🔑", accent:"#808B96", bg:"#080808", words:["ANDY","RED","NORTON","HADLEY","BROOKS","TOMMY","SISTERS","TUNNEL","POSTER","LIBRARY","MOZART","WARDEN","PRISON","PAROLE","HOPE","HAMMER","RITA","ESCAPE","FREEDOM","ZIHUATANEJO","CHESS","GEOLOGY","BEER","PACIFIC"] },
  { id:15, title:"Downton Abbey",      emoji:"🏰", accent:"#A04000", bg:"#0d0600", words:["CARSON","HUGHES","BATES","ANNA","THOMAS","DAISY","ROBERT","CORA","MARY","EDITH","SYBIL","MATTHEW","BRANSON","VIOLET","BUTLER","KITCHEN","UPSTAIRS","DOWNSTAIRS","SERVANT","ABBEY","YORKSHIRE","GRANTHAM","MANOR","FOOTMAN"] },
  { id:16, title:"Sherlock",           emoji:"🔍", accent:"#117A65", bg:"#00100d", words:["HOLMES","WATSON","MORIARTY","IRENE","MYCROFT","LESTRADE","BAKER","STREET","VIOLIN","COCAINE","DISGUISE","DEDUCTION","CRIME","MAGNUSSEN","REDBEARD","MARY","MIND","PALACE","SKULL","BASKERVILLE","HOUND","ADLER","ANDERSON","VATICAN"] },
  { id:17, title:"The Sopranos",       emoji:"🍝", accent:"#7D3C98", bg:"#0a0010", words:["TONY","CARMELA","CHRISTOPHER","PAULIE","SILVIO","BOBBY","JANICE","LIVIA","JUNIOR","MEADOW","MELFI","BADA","BING","JERSEY","DUCKS","THERAPY","GABAGOOL","CAPO","SOLDIER","WISEGUY","FEDERAL","PILOT","SUNDAY","SATRIALE"] },
  { id:18, title:"The Wire",           emoji:"📡", accent:"#B7770D", bg:"#0a0800", words:["MCNULTY","OMAR","STRINGER","AVON","BUNK","GREGGS","DANIELS","HERC","CARVER","BUBBLES","PROP","PREZ","LESTER","CARCETTI","MARLO","SNOOP","CHRIS","MICHAEL","DUKIE","RANDY","RAWLS","BARKSDALE","WEST","CORNER"] },
  { id:19, title:"Schindler's List",   emoji:"🕯️", accent:"#717D7E", bg:"#050505", words:["SCHINDLER","STERN","GOETH","LISTEK","EMALIA","KRAKOW","FACTORY","HOLOCAUST","JUDAISM","REFUGEES","GHETTO","LAMPSHADE","LIQUIDATION","PLASZOW","RESCUE","PROFIT","HUMANITY","CONSCIENCE","DIAMONDS","SURVIVAL","GERMAN","POLISH","TRAIN","PRAYER"] },
  { id:20, title:"The Lion King",      emoji:"🦁", accent:"#D4900A", bg:"#120800", words:["SIMBA","MUFASA","NALA","TIMON","PUMBAA","SCAR","RAFIKI","ZAZU","SARABI","BANZAI","SHENZI","PRIDELANDS","HAKUNA","MATATA","GRUBS","STAMPEDE","SAVANNAH","ELEPHANT","HYENA","CANYONS","KINGDOM","CIRCLE","SUNRISE","PRIDE"] },
  { id:21, title:"Frozen",             emoji:"❄️", accent:"#1A8FAA", bg:"#000d14", words:["ELSA","ANNA","KRISTOFF","OLAF","SVEN","HANS","WESELTON","ARENDELLE","SNOWFLAKE","MAGIC","WINTER","BLIZZARD","REINDEER","TROLLS","CORONATION","FJORD","SNOWMAN","GLOVES","CONCEAL","REVEAL","CHOCOLATE","SISTERS","CASTLE","STORM"] },
  { id:22, title:"Toy Story",          emoji:"🤠", accent:"#1F618D", bg:"#00060f", words:["WOODY","BUZZ","JESSIE","REX","SLINKY","HAMM","LOTSO","BULLSEYE","FORKY","ANDY","BONNIE","SID","ZURG","PROSPECTOR","SHERIFF","INFINITY","BEYOND","DAYCARE","PIZZA","CLAW","COWBOY","ROCKET","SNAKE","POTATO"] },
  { id:23, title:"Finding Nemo",       emoji:"🐠", accent:"#CC4400", bg:"#000810", words:["NEMO","MARLIN","DORY","GILL","BLOAT","PEACH","GURGLE","BUBBLES","CRUSH","SQUIRT","DARLA","NIGEL","CORAL","SHARK","JELLYFISH","DENTIST","SYDNEY","TURTLE","BARRACUDA","FILTER","OCEAN","DIVING","PELICAN","CLOWNFISH"] },
  { id:24, title:"The Incredibles",    emoji:"🦸", accent:"#B03030", bg:"#0f0000", words:["ROBERT","HELEN","VIOLET","DASH","EDNA","SYNDROME","FROZONE","MIRAGE","GAZERBEAM","OMNIDROID","NOMANISAN","SUPERS","SUPERHERO","COSTUME","INVISIBLE","SPEED","ELASTIC","ROCKET","VILLAIN","ISLAND","MONOLOGUE","BABY","MASK","CAPE"] },
  { id:25, title:"Shrek",              emoji:"🧅", accent:"#4A8A1A", bg:"#030d00", words:["SHREK","FIONA","DONKEY","FARQUAAD","PUSS","GINGERBREAD","DRAGON","DULOC","SWAMP","FAIRY","GODMOTHER","RUMPELSTILTSKIN","ARTHUR","CHARMING","OGRE","LAYERS","ONION","PRINCESS","KISSED","HAPPILY","KINGDOM","KNIGHTS","MIRROR","MUFFIN"] },
  { id:26, title:"Moana",              emoji:"🌊", accent:"#148A8A", bg:"#000d0d", words:["MOANA","MAUI","TAMATOA","GRAMMA","SINA","MOTUNUI","WAYFINDING","OCEAN","COCONUT","HOOK","TATTOO","DEMIGOD","PRINCESS","CANOE","LAVA","CRAB","SPIRAL","VOYAGER","ISLAND","DARKNESS","RESTORE","HEART","CHIEF","WIND"] },
  { id:27, title:"Coco",               emoji:"💀", accent:"#C06000", bg:"#0d0400", words:["MIGUEL","HECTOR","IMELDA","ERNESTO","DANTE","RIVERA","OFRENDA","MARIGOLD","GUITAR","MUSICIAN","MEMORY","LAND","DEAD","REMEMBER","ALEBRIJE","SKELETON","PHOTOGRAPH","CONTEST","BRIDGE","PETAL","TALENT","BLESSING","SONG","FAMILY"] },
  { id:28, title:"How To Train Dragon",emoji:"🐲", accent:"#177A90", bg:"#000c10", words:["HICCUP","TOOTHLESS","ASTRID","STOICK","GOBBER","SNOTLOUT","FISHLEGS","RUFFNUT","TUFFNUT","BERK","DRAGON","RIDER","NIGHTFURY","LIGHTNFURY","GRONCKLE","NADDER","NIGHTMARE","ZIPPLEBACK","ALPHA","FURIES","ACADEMY","CHIEF","ISLAND","TRAINING"] },
  { id:29, title:"Up",                 emoji:"🎈", accent:"#B8860B", bg:"#0d0c00", words:["CARL","ELLIE","RUSSELL","DUG","KEVIN","MUNTZ","ALPHA","BETA","GAMMA","PARADISE","FALLS","BALLOONS","ADVENTURE","SQUIRREL","WILDERNESS","EXPLORER","BADGE","GRAPE","SODA","SCRAPBOOK","DOGS","TALKING","HOUSE","SOUTH"] },
  { id:30, title:"Encanto",            emoji:"🦋", accent:"#8E24AA", bg:"#0d0010", words:["MIRABEL","LUISA","ISABELA","DOLORES","CAMILO","JULIETA","PEPA","FELIX","AGUSTIN","ABUELA","BRUNO","CASITA","COLOMBIA","CANDLE","MIRACLE","GIFT","MAGIC","FAMILY","PROPHECY","CRACK","VISION","FLOWERS","HEALING","SHAPESHIFTER"] },
];

const GRID_SIZE = 22;
const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

function buildGrid(words) {
  const grid = Array.from({length:GRID_SIZE}, () => Array(GRID_SIZE).fill(''));
  const placed = [];
  const sorted = [...words].sort((a,b) => b.length - a.length);
  for (const word of sorted) {
    let ok2 = false;
    for (let attempt = 0; attempt < 400 && !ok2; attempt++) {
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
      if (ok){for(let i=0;i<word.length;i++)grid[r+dr*i][c+dc*i]=word[i];placed.push({word,r,c,dr,dc});ok2=true;}
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

  const gRef=useRef(null),selRef=useRef(null),commitRef=useRef(null);
  const timerRef=useRef(null),startRef=useRef(null),gridContRef=useRef(null);

  const winW=useWindowWidth();
  const isMobile=winW<640;
  const isTablet=winW>=640&&winW<900;
  const show=showIdx!==null?SHOWS[showIdx]:null;
  const accentColor=show?.accent||'#C8900A';
  const dk=darkMode;

  // ── Cell sizing ──────────────────────────────────────────────────
  // Mobile: minimum 20px so letters are readable; grid scrolls horizontally if needed
  // Tablet/desktop: scale to fit the sidebar layout
  const cellPx = isMobile
    ? Math.max(20, Math.floor((winW - 16) / GRID_SIZE))
    : isTablet
      ? Math.max(16, Math.floor((winW * 0.54 - 16) / GRID_SIZE))
      : Math.max(18, Math.floor(Math.min(winW * 0.45, 500) / GRID_SIZE));

  // ── Theme tokens ─────────────────────────────────────────────────
  // Light mode: warm ink-on-parchment cinema palette
  const T = dk ? {
    pageBg: screen==='game'?(show?.bg||'#0a0a0a'):'#0a0a0a',
    text:'#e8e8e8', muted:'#888', subtle:'#555', faint:'#2a2a2a',
    surface:'rgba(255,255,255,0.04)', surfaceHover:'rgba(255,255,255,0.09)',
    border:'rgba(255,255,255,0.09)', borderHover:'rgba(255,255,255,0.32)',
    gridBg:'rgba(255,255,255,0.03)', cellDefault:'#666', cellHover:'rgba(255,255,255,0.07)',
    scrollTrack:'#111', scrollThumb:'#444',
    btnBg:'rgba(255,255,255,0.06)', btnBorder:'rgba(255,255,255,0.13)', btnText:'#aaa',
    toggleIcon:'☀️',
    progressTrack:'rgba(255,255,255,0.08)',
    footerText:'#333', footerAccent:'#666',
    sectionColor:{tv:'#999',disney:'#5BB8D4',pixar:'#E08C2A',dreamworks:'#72B030'},
    taglineColor:'#D4A800',
    pillFoundBg: (a)=>a+'22', pillFoundText:(a)=>a, pillFoundBorder:(a)=>a+'55',
    pillText:'#555', pillBg:'rgba(255,255,255,0.04)',
  } : {
    // Warm parchment — like an old cinema programme
    pageBg: screen==='game'?'#EDE5D0':'#F5EDD8',
    text:'#261A08', muted:'#7A6040', subtle:'#A08858', faint:'#D8C8A8',
    surface:'rgba(80,45,10,0.06)', surfaceHover:'rgba(80,45,10,0.11)',
    border:'rgba(80,45,10,0.16)', borderHover:'rgba(80,45,10,0.42)',
    gridBg:'rgba(80,45,10,0.04)', cellDefault:'#A89070', cellHover:'rgba(80,45,10,0.09)',
    scrollTrack:'#DDD0B4', scrollThumb:'#B8A07A',
    btnBg:'rgba(80,45,10,0.07)', btnBorder:'rgba(80,45,10,0.18)', btnText:'#7A6040',
    toggleIcon:'🌙',
    progressTrack:'rgba(80,45,10,0.1)',
    footerText:'#C0AA80', footerAccent:'#8A7050',
    sectionColor:{tv:'#6A5030',disney:'#0068A0',pixar:'#B05000',dreamworks:'#386010'},
    taglineColor:'#B07800',
    // Word pills in light mode: found = accent on light cream, unfound = warm ink
    pillFoundBg:(a)=>a+'22', pillFoundText:(a)=>a, pillFoundBorder:(a)=>a+'66',
    pillText:'#7A6040', pillBg:'rgba(80,45,10,0.06)',
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
    setSel(null);setElapsed(0);setFlash(null);setScreen('game');
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
      setFlash({cells:cells.map(([r,c])=>cellKey(r,c)),type:'good'});
      setTimeout(()=>setFlash(null),700);
    } else {
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

  const selCellSet=new Set();
  if(sel)getCells(sel.r1,sel.c1,sel.r2,sel.c2).forEach(([r,c])=>selCellSet.add(cellKey(r,c)));

  const foundCellMap=new Map();
  if(gameData)for(const p of gameData.placed){
    if(!found.has(p.word))continue;
    getCells(p.r,p.c,p.r+p.dr*(p.word.length-1),p.c+p.dc*(p.word.length-1)).forEach(([r,c])=>foundCellMap.set(cellKey(r,c),p.word));
  }

  const flashSet=new Set(flash?.cells||[]);

  function triggerGameOver(word) {
    clearInterval(timerRef.current);
    setRevealedWord(word);
    setScreen('gameover');
  }

  const fmtTime=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');

  const SECTIONS=[
    {label:'📺 TV Shows & Films',color:T.sectionColor.tv,       ids:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]},
    {label:'🏰 Disney',          color:T.sectionColor.disney,    ids:[21,26,30]},
    {label:'🤖 Pixar',           color:T.sectionColor.pixar,     ids:[22,23,24,27,29]},
    {label:'🐉 DreamWorks',      color:T.sectionColor.dreamworks, ids:[20,25,28]},
  ];

  const cardMin=isMobile?140:185;
  const gridTotalPx=GRID_SIZE*cellPx+GRID_SIZE; // cells + gaps

  return (
    <div style={{minHeight:'100vh',background:T.pageBg,fontFamily:"'Georgia',serif",color:T.text,display:'flex',flexDirection:'column',alignItems:'center',transition:'background 0.35s,color 0.25s',padding:isMobile?'0 8px 28px':'0 12px 36px',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        html,body{margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${T.scrollTrack};}
        ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px;}
        .cine-cell{display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;font-family:'Crimson Text',serif;font-weight:700;border-radius:3px;transition:background 0.07s,color 0.07s;}
        .cine-cell:hover{background:${T.cellHover};}
        .word-pill{padding:4px 10px;border-radius:20px;font-family:'Crimson Text',serif;letter-spacing:0.07em;cursor:pointer;transition:all 0.15s;border:1px solid ${T.border};text-transform:uppercase;white-space:nowrap;}
        .word-pill:hover{transform:scale(1.05);}
        .show-card{border:1px solid ${T.border};border-radius:12px;padding:14px 12px;cursor:pointer;transition:all 0.2s;background:${T.surface};display:flex;flex-direction:column;gap:5px;position:relative;overflow:hidden;}
        .show-card:hover{transform:translateY(-2px);border-color:${T.borderHover};background:${T.surfaceHover};}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
        .found-pop{animation:pop 0.28s ease;}
        .grid-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px;}
        .grid-scroll::-webkit-scrollbar{height:3px;}
      `}</style>

      {/* Toggle sits in each screen's header — not fixed */}

      {/* ══ PICKER ══ */}
      {screen==='picker'&&(
        <div style={{width:'100%',maxWidth:980,animation:'fadeIn 0.5s ease'}}>
          <div style={{textAlign:'center',padding:isMobile?'36px 0 22px':'44px 0 30px',position:'relative'}}>
            {/* Theme toggle — top-left of picker */}
            <button onClick={()=>setDarkMode(d=>!d)} title="Toggle theme"
              style={{position:'absolute',top:isMobile?10:14,left:0,background:T.btnBg,border:'1px solid '+T.btnBorder,borderRadius:20,padding:'5px 12px',cursor:'pointer',fontSize:'0.9rem',lineHeight:1}}>
              {T.toggleIcon}
            </button>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.9rem':'clamp(1.9rem,4vw,3rem)',fontWeight:900,letterSpacing:'0.1em',color:T.text,textShadow:dk?'0 0 50px rgba(255,255,255,0.18)':'0 2px 12px rgba(80,45,10,0.15)'}}>
              🍿 PopcornPuzzle
            </div>
            <div style={{fontFamily:"'Crimson Text',serif",color:T.taglineColor,fontSize:'0.7rem',letterSpacing:'0.26em',marginTop:6,textTransform:'uppercase',opacity:0.9}}>
              The Ultimate Screen Word Search
            </div>
            <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'0.82rem',marginTop:8,fontStyle:'italic'}}>
              {SHOWS.length} titles · choose one to begin
            </div>
          </div>

          {SECTIONS.map(section=>(
            <div key={section.label} style={{marginBottom:isMobile?20:28}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.65rem',letterSpacing:'0.2em',color:section.color,marginBottom:10,paddingBottom:7,borderBottom:'1px solid '+T.border}}>
                {section.label}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax('+cardMin+'px, 1fr))',gap:isMobile?8:11}}>
                {section.ids.map(id=>{
                  const i=SHOWS.findIndex(s=>s.id===id);const s=SHOWS[i];if(!s)return null;
                  return(
                    <div key={s.id} className="show-card" onClick={()=>startGame(i)}>
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:s.accent,borderRadius:'0 0 12px 12px'}}/>
                      <div style={{fontSize:isMobile?'1.3rem':'1.5rem'}}>{s.emoji}</div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'0.72rem':'0.78rem',fontWeight:700,color:s.accent,letterSpacing:'0.04em'}}>{s.title}</div>
                      <div style={{fontSize:'0.64rem',color:T.subtle}}>{s.words.length} words</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{textAlign:'center',marginTop:36,paddingTop:22,borderTop:'1px solid '+T.border}}>
            <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.68rem',letterSpacing:'0.16em',color:T.footerText,textTransform:'uppercase'}}>Produced by</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.95rem',fontWeight:700,color:T.footerAccent,letterSpacing:'0.12em',marginTop:4}}>Papa Bona Owusu</div>
          </div>
        </div>
      )}

      {/* ══ GAME ══ */}
      {screen==='game'&&show&&gameData&&(
        <div style={{width:'100%',maxWidth:1100,animation:'fadeIn 0.4s ease'}}>
          {/* Header */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'12px 0 8px':'18px 0 12px',gap:8}}>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:isMobile?'6px 11px':'6px 14px',borderRadius:8,cursor:'pointer',fontFamily:"'Crimson Text',serif",fontSize:isMobile?'0.82rem':'0.9rem',whiteSpace:'nowrap'}}>
              ← {isMobile?'Back':'PopcornPuzzle'}
            </button>
            <div style={{textAlign:'center',flex:1,overflow:'hidden'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'0.95rem':'clamp(1rem,2.5vw,1.6rem)',fontWeight:700,color:accentColor,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                {show.emoji} {show.title}
              </div>
            </div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.05rem':'1.2rem',color:accentColor,minWidth:isMobile?52:58,textAlign:'right',flexShrink:0}}>
              {fmtTime(elapsed)}
            </div>
            <button onClick={()=>setDarkMode(d=>!d)} title="Toggle theme"
              style={{background:T.btnBg,border:'1px solid '+T.btnBorder,borderRadius:20,padding:'5px 10px',cursor:'pointer',fontSize:'0.88rem',lineHeight:1,flexShrink:0}}>
              {T.toggleIcon}
            </button>
          </div>

          {/* Progress */}
          <div style={{height:3,background:T.progressTrack,borderRadius:2,marginBottom:isMobile?10:14,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:2,background:accentColor,width:((found.size/gameData.placed.length)*100)+'%',transition:'width 0.4s ease',boxShadow:'0 0 6px '+accentColor}}/>
          </div>

          {/* Grid + words */}
          <div style={{display:'flex',flexDirection:isMobile?'column':'row',gap:isMobile?14:20,alignItems:'flex-start'}}>

            {/* Grid — scrollable wrapper on mobile */}
            <div className="grid-scroll" style={{width:'100%',flexShrink:0,maxWidth:isMobile?'100%':(gridTotalPx+16)+'px'}}>
              <div
                ref={gridContRef}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                style={{
                  display:'inline-grid',
                  gridTemplateColumns:'repeat('+GRID_SIZE+', '+cellPx+'px)',
                  gap:1,
                  background:T.gridBg,
                  border:'1px solid '+accentColor+(dk?'44':'66'),
                  borderRadius:10,
                  padding:isMobile?5:6,
                  touchAction:'none',
                  boxShadow:'0 0 24px '+accentColor+(dk?'15':'22'),
                }}
              >
                {gameData.grid.map((row,r)=>row.map((ch,c)=>{
                  const key=cellKey(r,c);
                  const isFound=foundCellMap.has(key),isSel=selCellSet.has(key),isFlash=flashSet.has(key);
                  let bg='transparent',color=T.cellDefault;
                  if(isFound){bg=accentColor+'30';color=accentColor;}
                  if(isSel){bg=dk?'rgba(255,255,255,0.2)':'rgba(80,45,10,0.18)';color=dk?'#fff':'#1a0800';}
                  if(isFlash){bg=flash.type==='good'?accentColor+'90':'rgba(200,40,40,0.55)';color='#fff';}
                  const fs=Math.max(9,Math.floor(cellPx*0.55))+'px';
                  return(
                    <div key={key} className="cine-cell" data-r={r} data-c={c}
                      onMouseDown={e=>onCellDown(r,c,e)} onMouseEnter={()=>onCellEnter(r,c)}
                      style={{width:cellPx+'px',height:cellPx+'px',fontSize:fs,background:bg,color,fontWeight:(isFound||isSel)?700:600}}>
                      {ch}
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* Word list */}
            <div style={{flex:1,minWidth:0,width:'100%'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.12em',color:T.subtle,marginBottom:8}}>
                FIND {gameData.placed.length} WORDS — {found.size} FOUND
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:isMobile?5:6}}>
                {gameData.placed.map(p=>{
                  const isFound=found.has(p.word);
                  return(
                    <div key={p.word} className={'word-pill'+(isFound?' found-pop':'')}
                      onClick={()=>{ if(!isFound) triggerGameOver(p.word); }}
                      style={{
                        background:isFound?T.pillFoundBg(accentColor):T.pillBg,
                        color:isFound?T.pillFoundText(accentColor):T.pillText,
                        textDecoration:isFound?'line-through':'none',
                        borderColor:isFound?T.pillFoundBorder(accentColor):T.border,
                        fontSize:isMobile?'0.67rem':'0.72rem',
                        cursor:isFound?'default':'pointer',
                      }}>
                      {p.word}
                    </div>
                  );
                })}
              </div>
              {isMobile&&(
                <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.62rem',color:T.subtle,marginTop:8,fontStyle:'italic',opacity:0.7}}>
                  ← scroll the grid if needed
                </div>
              )}
            </div>
          </div>

          <div style={{textAlign:'center',marginTop:isMobile?16:22,fontFamily:"'Crimson Text',serif",fontSize:'0.62rem',color:T.faint,letterSpacing:'0.1em'}}>
            PopcornPuzzle · Produced by Papa Bona Owusu
          </div>
        </div>
      )}

      {/* ══ GAME OVER ══ */}
      {screen==='gameover'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.5s ease',textAlign:'center',padding:'20px'}}>
          <div style={{fontSize:'3.5rem'}}>💀</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'clamp(1.5rem,5vw,2.5rem)',fontWeight:900,color:'#C0392B',letterSpacing:'0.06em'}}>
            Game Over
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:isMobile?'0.95rem':'1.05rem',fontStyle:'italic',maxWidth:320}}>
            You peeked at <span style={{color:'#C0392B',fontWeight:700,fontStyle:'normal',letterSpacing:'0.08em'}}>{revealedWord}</span> — that's cheating!
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.subtle,fontSize:'0.85rem',marginTop:4}}>
            {found.size} of {gameData?.placed.length} words found · {fmtTime(elapsed)}
          </div>
          <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx)} style={{background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.5)',color:'#C0392B',padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>
              Try Again
            </button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>
              Choose Another
            </button>
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.65rem',color:T.faint,letterSpacing:'0.12em',marginTop:8}}>
            PopcornPuzzle · Produced by Papa Bona Owusu
          </div>
        </div>
      )}

      {/* ══ DONE ══ */}
      {screen==='done'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.6s ease',textAlign:'center',padding:'20px'}}>
          <div style={{fontSize:'3.5rem'}}>🎉</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'clamp(1.5rem,5vw,2.5rem)',fontWeight:900,color:accentColor}}>Completed!</div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:isMobile?'1rem':'1.1rem',fontStyle:'italic'}}>
            {show.emoji} {show.title} — all words found
          </div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'2rem',color:T.text}}>{fmtTime(elapsed)}</div>
          <div style={{display:'flex',gap:12,marginTop:8,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx)} style={{background:accentColor+'22',border:'1px solid '+accentColor+'88',color:accentColor,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>Play Again</button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer',letterSpacing:'0.05em'}}>Choose Another</button>
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.65rem',color:T.faint,letterSpacing:'0.12em',marginTop:8}}>
            PopcornPuzzle · Produced by Papa Bona Owusu
          </div>
        </div>
      )}
    </div>
  );
}
