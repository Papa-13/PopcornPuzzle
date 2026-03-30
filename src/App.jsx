import { useState, useEffect, useRef, useCallback } from "react";

const DIFF = {
  easy:   { gridSize:14, time:300, penalty:5,  revealCost:6,  label:'Easy',   emoji:'🟢', color:'#27AE60', desc:'5:00 · small grid · −5s penalty' },
  hard:   { gridSize:16, time:180, penalty:10, revealCost:8,  label:'Hard',   emoji:'🟡', color:'#E67E22', desc:'3:00 · standard grid · −10s penalty' },
  expert: { gridSize:18, time:120, penalty:15, revealCost:10, label:'Expert', emoji:'🔴', color:'#C0392B', desc:'2:00 · big grid · −15s penalty' },
};

// Each show has 3 × 15 unique words: easy (iconic) / hard (supporting) / expert (deep cuts)
const SHOWS = [
  { id:0, title:"Friends", emoji:"☕", accent:"#D4A800", bg:"#1a1500", words:{
    easy:  ["RACHEL","MONICA","PHOEBE","JOEY","CHANDLER","ROSS","COFFEE","PIVOT","LOBSTER","GUNTHER","SANDWICH","SMELLY","DINOSAUR","DIVORCE","TURKEY"],
    hard:  ["UNAGI","MANHATTAN","HUGSY","WEDDING","JANICE","EMILY","RUGBY","SEVEN","NAKED","LONDON","MUFFIN","NUBBIN","UGLY","HOLIDAY","CONDOMS"],
    expert:["RICHARD","ESTELLE","FRANK","ALICE","URSULA","DAVID","MIKE","MONA","KATHY","CAROL","BARRY","ZELNER","MINSK","TULSA","BEEPER"],
  }},
  { id:1, title:"Game of Thrones", emoji:"🐉", accent:"#C0392B", bg:"#100000", words:{
    easy:  ["STARK","LANNISTER","TARGARYEN","DRAGON","DAENERYS","TYRION","ARYA","SANSA","SNOW","KHALEESI","DIREWOLF","THRONE","DOTHRAKI","WILDFIRE","WINTERFELL"],
    hard:  ["CERSEI","JOFFREY","HODOR","WESTEROS","BRAN","SAMWELL","TORMUND","MELISANDRE","VARYS","THEON","ROBB","STANNIS","CASTLE","RAVENS","LITTLEFINGER"],
    expert:["OLENNA","MARGAERY","EDMURE","ROOSE","RAMSAY","SHIREEN","GENDRY","BRIENNE","DAVOS","PODRICK","BRONN","OBERYN","YARA","LYANNA","ELLARIA"],
  }},
  { id:2, title:"Breaking Bad", emoji:"⚗️", accent:"#27AE60", bg:"#001008", words:{
    easy:  ["WALTER","JESSE","HEISENBERG","CRYSTAL","SAUL","HANK","SKYLER","TUCO","MIKE","RICIN","LAUNDRY","CARTEL","CANCER","BARREL","COOKING"],
    hard:  ["GALE","JANE","LYDIA","TODD","JACK","MARIE","FRING","VACUUM","MAGNETS","ANDREA","BROCK","BADGER","SKINNY","TRAIN","LAPTOP"],
    expert:["COMBO","WENDY","KUBY","HUELL","TYRUS","DECLAN","DONALD","KRAZY","EMILIO","HOMER","SPOOGE","GONZO","CLOVIS","DENNIS","RIVAL"],
  }},
  { id:3, title:"The Crown", emoji:"👑", accent:"#8E44AD", bg:"#0d0010", words:{
    easy:  ["ELIZABETH","PHILIP","MARGARET","CHARLES","DIANA","WINDSOR","PALACE","BUCKINGHAM","ROYAL","SCANDAL","CROWN","CAMILLA","ABDICATION","PORTRAIT","PROTOCOL"],
    hard:  ["THATCHER","ANNE","ANDREW","EDWARD","WALLIS","SIMPSON","BALMORAL","SANDRINGHAM","PRIVY","GARTER","HAROLD","HEATH","FERGIE","WILSON","TATLER"],
    expert:["LASCELLES","CRAWFIE","PORCHEY","PLUNKET","COLVILLE","CHARTERIS","GORDONSTOUN","ADEANE","BOBO","TOWNSEND","EDEN","MACMILLAN","CALLAGHAN","BLUNT","NASSER"],
  }},
  { id:4, title:"Stranger Things", emoji:"🔦", accent:"#E74C3C", bg:"#100005", words:{
    easy:  ["ELEVEN","DEMOGORGON","HAWKINS","DUSTIN","LUCAS","HOPPER","VECNA","MINDFLAYER","EGGO","BILLY","PSYCHIC","PORTAL","RUSSIA","UPSIDE","BARB"],
    hard:  ["WILL","MIKE","JOYCE","MAX","STEVE","ROBIN","MURRAY","BRENNER","DART","STARCOURT","SCOOPS","AHOY","INDIANA","DEMODOG","SHADY"],
    expert:["LONNIE","BOB","TERRY","KALI","ARGYLE","DMITRI","YURI","CHRISSY","PATRICK","EDDIE","REEFER","PENNHURST","CREEL","TATIANA","PIZZA"],
  }},
  { id:5, title:"Harry Potter", emoji:"⚡", accent:"#C8900A", bg:"#120e00", words:{
    easy:  ["HARRY","HERMIONE","DUMBLEDORE","VOLDEMORT","HOGWARTS","GRYFFINDOR","SLYTHERIN","SNAPE","PATRONUS","HORCRUX","DOBBY","WAND","MALFOY","SORTING","BASILISK"],
    hard:  ["SIRIUS","LUPIN","BELLATRIX","UMBRIDGE","NEVILLE","GINNY","LUNA","HAGRID","MCGONAGALL","HUFFLEPUFF","RAVENCLAW","QUIDDITCH","DEMENTOR","PHOENIX","DIAGON"],
    expert:["FILCH","LOCKHART","TRELAWNEY","MOODY","TONKS","GRINDELWALD","SCABBERS","CROOKSHANKS","FLITWICK","SPROUT","POMFREY","SLUGHORN","LONGBOTTOM","KRUM","FLEUR"],
  }},
  { id:6, title:"The Godfather", emoji:"🌹", accent:"#D35400", bg:"#0d0800", words:{
    easy:  ["CORLEONE","MICHAEL","VITO","SONNY","FREDO","BARZINI","SICILY","OMERTA","GODFATHER","BAPTISM","REVENGE","BETRAYAL","CARLO","SOLLOZZO","SENATOR"],
    hard:  ["CONNIE","TOM","KAY","VIRGIL","WOLTZ","LUCA","PAULIE","TESSIO","CALO","FABRIZIO","JOHNNY","HAGEN","ROTH","NINO","JACK"],
    expert:["LAMPONE","CICCI","NERI","ABBANDANDO","CUNEO","TATTAGLIA","STRACCI","BRASI","APPOLONIA","MORAN","DEANNA","WILLI","ZALUCHI","GEMINI","FANUCCI"],
  }},
  { id:7, title:"Titanic", emoji:"🚢", accent:"#2471A3", bg:"#000a10", words:{
    easy:  ["JACK","ROSE","ICEBERG","DIAMOND","NECKLACE","LIFEBOAT","CARPATHIA","BOILER","COMPASS","DANCE","SURVIVAL","ATLANTIC","CALEDON","STEERAGE","PORTRAIT"],
    hard:  ["RUTH","MOLLY","BRUCE","ISMAY","ANDREWS","LOVEJOY","FABRIZIO","HELGA","SPICER","BROCK","LEWIS","BODINE","TRUDY","HAROLD","THOMAS"],
    expert:["LOWE","MURDOCH","LIGHTOLLER","MOODY","BOXHALL","HITCHENS","FLEET","PITMAN","WILDE","BERTRAM","JOUGHIN","ETCHES","PRENTICE","DAHL","MARGARET"],
  }},
  { id:8, title:"Inception", emoji:"🌀", accent:"#17A589", bg:"#001010", words:{
    easy:  ["COBB","ARIADNE","ARTHUR","SAITO","LIMBO","DREAM","TOTEM","PARADOX","ARCHITECT","GRAVITY","SPINNING","SUBCONSCIOUS","EAMES","FISHER","SEDATIVE"],
    hard:  ["MAL","YUSUF","BROWNING","COBOL","MOMBASA","KICK","LAYERS","SNOWFORT","VAULT","FREIGHT","REALITY","CHEMIST","SHADE","PROJECTION","FORGER"],
    expert:["TADASHI","PHILIPPA","JAMES","PENROSE","STAIRCASE","MIRROR","EXTRACTOR","COMPOUND","DREAMER","MILITARIZE","POINT","RAIN","ELEVATOR","ZERO","TARGET"],
  }},
  { id:9, title:"The Office", emoji:"📎", accent:"#2471A3", bg:"#00080f", words:{
    easy:  ["MICHAEL","DWIGHT","JIM","PAM","ANGELA","CREED","TOBY","DUNDER","MIFFLIN","SCRANTON","BEARS","BATTLESTAR","PRETZEL","KELLY","STANLEY"],
    hard:  ["RYAN","ANDY","OSCAR","PHYLLIS","MEREDITH","KEVIN","DARRYL","KAREN","JAN","HOLLY","DUNDIES","PARKOUR","PRINTER","THREAT","GALACTICA"],
    expert:["HANK","DONNA","CATHY","NATE","PETE","CLARK","SENATOR","ESTHER","BUZZ","WAREHOUSE","ANNEX","VANCE","TRIVIA","ROLF","HIDE"],
  }},
  { id:10, title:"Peaky Blinders", emoji:"🎩", accent:"#B7950B", bg:"#120f00", words:{
    easy:  ["TOMMY","ARTHUR","POLLY","GRACE","ALFIE","CAMPBELL","SHELBY","GARRISON","RAZORS","CAPONE","WHISKY","BLINDERS","OPIUM","BIRMINGHAM","BETTING"],
    hard:  ["JOHN","LINDA","ESME","MICHAEL","LIZZIE","CHARLIE","CURLY","HEATH","LONDON","JEWISH","SABINI","EDEN","COMMUNIST","SMALL","ITALIAN"],
    expert:["RUBEN","CHANGRETTA","LUCA","ABERAMA","BARNEY","JOHNNY","GINA","DIANA","ISAIAH","BRILLIANT","MOSLEY","TATIANA","VICENTE","FABIAN","WINSTON"],
  }},
  { id:11, title:"Wuthering Heights", emoji:"🌿", accent:"#717D7E", bg:"#080a0a", words:{
    easy:  ["HEATHCLIFF","CATHERINE","EDGAR","HINDLEY","LOCKWOOD","HARETON","EARNSHAW","MOORS","REVENGE","PASSION","GHOST","YORKSHIRE","OBSESSION","LINTON","NELLY"],
    hard:  ["FRANCES","JOSEPH","ZILLAH","CATHY","THRUSHCROSS","GRANGE","CHAPEL","HAUNTING","ORPHAN","SERVANT","STORM","WILD","RUIN","HEIGHTS","CHILDHOOD"],
    expert:["KENNETH","ELLEN","PENISTONE","CRAG","GIBBETS","RAMBLER","TYKE","SORROW","VENGEANCE","GYPSY","FIEND","SPECTER","WAILING","MANOR","BOGGART"],
  }},
  { id:12, title:"Interstellar", emoji:"🪐", accent:"#1E8449", bg:"#000d04", words:{
    easy:  ["COOPER","MURPH","AMELIA","TARS","ENDURANCE","WORMHOLE","BLACKHOLE","TESSERACT","GRAVITY","GARGANTUA","QUANTUM","BLIGHT","SATURN","LAZARUS","DOCKING"],
    hard:  ["MANN","CASE","BRAND","EDMUNDS","ROMILLY","NASA","WAVE","MILLER","RELATIVITY","OXYGEN","LOVE","CORN","PLAN","PLANET","TIME"],
    expert:["DOYLE","KIPP","GETTY","LOIS","DONALD","POLLY","ERIN","RIDGE","FIFTH","DIMENSION","BOOKSHELF","SIGNAL","GHOST","WATCH","FARM"],
  }},
  { id:13, title:"Pulp Fiction", emoji:"💼", accent:"#CA6F1E", bg:"#0f0800", words:{
    easy:  ["VINCENT","MIA","JULES","MARSELLUS","BUTCH","LANCE","BRIEFCASE","OVERDOSE","BURGER","WALLET","ROYALE","EZEKIEL","JIMMIE","PAWNSHOP","ZORRO"],
    hard:  ["HONEY","PUMPKIN","FABIENNE","WOLF","JODY","TRUDI","MAYNARD","ZEDD","GIMP","WATCH","MOTORCYCLE","DANCE","ADRENALINE","CHEST","ESMARELDA"],
    expert:["RAQUEL","BUDDY","ENGLISH","DAVE","KOONS","BELLBOY","ANTWAN","ROCKY","ALABAMA","MONTY","CHEEKS","CHESTER","PEDRO","INGLEWOOD","FOURTH"],
  }},
  { id:14, title:"The Shawshank", emoji:"🔑", accent:"#808B96", bg:"#080808", words:{
    easy:  ["ANDY","RED","NORTON","BROOKS","TUNNEL","POSTER","LIBRARY","WARDEN","PAROLE","HOPE","ESCAPE","FREEDOM","TOMMY","HADLEY","PACIFIC"],
    hard:  ["HEYWOOD","SNOOZE","CHESTER","FLOYD","SKEET","BOGS","CHESS","GEOLOGY","BEER","RITA","ROOFTOP","LETTER","MOZART","HAMMER","SISTERS"],
    expert:["ERNIE","DEKINS","TROUT","WILEY","PETE","ROOSTER","AUDITOR","HARGROVE","SAMUEL","ZIHUATANEJO","TRISCUIT","NORMADEN","CELLMATE","JACKRABBIT","JIGGER"],
  }},
  { id:15, title:"Downton Abbey", emoji:"🏰", accent:"#A04000", bg:"#0d0600", words:{
    easy:  ["CARSON","BATES","ANNA","THOMAS","DAISY","ROBERT","MARY","MATTHEW","VIOLET","BRANSON","ABBEY","GRANTHAM","HUGHES","EDITH","SYBIL"],
    hard:  ["CORA","ISOBEL","LAVINIA","RICHARD","ROSE","ALFRED","JIMMY","WILLIAM","MOLESLEY","SPRATT","DENKER","DREWE","PATMORE","BAXTER","ATTICUS"],
    expert:["NEVILLE","ROSAMUND","MARIGOLD","GREGSON","ALDRIDGE","BARROW","HARDING","PELHAM","STOWELL","BLAKE","JARVIS","HEXHAM","GILLINGHAM","BUNTING","WARD"],
  }},
  { id:16, title:"Sherlock", emoji:"🔍", accent:"#117A65", bg:"#00100d", words:{
    easy:  ["HOLMES","WATSON","MORIARTY","IRENE","MYCROFT","LESTRADE","BAKER","VIOLIN","DEDUCTION","MAGNUSSEN","BASKERVILLE","PALACE","ADLER","REDBEARD","COCAINE"],
    hard:  ["MARY","JANINE","MOLLY","ANDERSON","SALLY","HUDSON","WIGGINS","KILLER","DISGUISE","HOUND","SKULL","MIND","CRIME","SHERRINFORD","JANINE"],
    expert:["EURUS","STAMFORD","CULVERTON","AJAY","SHAN","GOLEM","CONNIE","SELDEN","HENRY","BARRYMORE","STAPLETON","FRANKLAND","GARRIDEB","MELAS","ABBEY"],
  }},
  { id:17, title:"The Sopranos", emoji:"🍝", accent:"#7D3C98", bg:"#0a0010", words:{
    easy:  ["TONY","CARMELA","CHRISTOPHER","PAULIE","SILVIO","JUNIOR","MEADOW","MELFI","BADA","BING","GABAGOOL","CAPO","LIVIA","JERSEY","THERAPY"],
    hard:  ["AJ","JANICE","BOBBY","ARTIE","RALPH","RICHIE","FURIO","PUSSY","HESH","GLORIA","ADRIANA","NOAH","FEBBY","SOBRIETY","DUCKS"],
    expert:["BLUNDETTO","VITO","PATSY","CORKY","GIGI","LARRY","BEPPY","PETEY","ALBERT","MURF","RUSTY","JOHNNY","COCO","FABIAN","CREDENZO"],
  }},
  { id:18, title:"The Wire", emoji:"📡", accent:"#B7770D", bg:"#0a0800", words:{
    easy:  ["MCNULTY","OMAR","STRINGER","AVON","BUNK","GREGGS","DANIELS","LESTER","CARCETTI","MARLO","BARKSDALE","CORNER","BUBBLES","SNOOP","RAWLS"],
    hard:  ["BODIE","PREZ","HERC","CARVER","PROP","SLIM","RANDY","MICHAEL","DUKIE","NAMOND","PEARLMAN","RHONDA","LEVY","CHEESE","BRIANNA"],
    expert:["WALON","KENARD","MONK","SPIDER","VINSON","DONUT","STINKUM","WENDELL","LANDSMAN","JAYBIRD","RENALDO","BEADIE","FAT","TILGHMAN","DONNELLY"],
  }},
  { id:19, title:"Schindler's List", emoji:"🕯️", accent:"#717D7E", bg:"#050505", words:{
    easy:  ["SCHINDLER","STERN","GOETH","KRAKOW","FACTORY","REFUGEES","GHETTO","PLASZOW","RESCUE","HUMANITY","DIAMONDS","SURVIVAL","LISTEK","EMALIA","PRAYER"],
    hard:  ["HELEN","POLDEK","MILA","RAIMUND","JULIAN","ROMAN","GENIA","DIANA","MARCEL","JOSEPH","GOLDBERG","BANKIER","CHAJA","NATAN","WULKAN"],
    expert:["TOFFEL","PEMPER","WILEK","OLEK","LENA","JONAS","MORDECAI","REITER","HUJAR","KENEALLY","BEJSKI","FINDER","GARDE","SPIRA","JERUSALEM"],
  }},
  { id:20, title:"The Lion King", emoji:"🦁", accent:"#D4900A", bg:"#120800", words:{
    easy:  ["SIMBA","MUFASA","NALA","TIMON","PUMBAA","SCAR","RAFIKI","SARABI","HAKUNA","MATATA","STAMPEDE","PRIDELANDS","ZAZU","HYENA","SAVANNAH"],
    hard:  ["BANZAI","SHENZI","VITANI","KOVU","KIARA","SARAFINA","MHEETU","CHUMVI","MALKA","TAMA","KION","BUNGA","SIMBA","CLAW","PRIDE"],
    expert:["AHADI","FIKIRI","UBORA","MTOTO","MAKINI","ANGA","BESHTE","FULI","JASIRI","JANJA","CHUNGU","CHEEZI","USHARI","KIBURI","ATKA"],
  }},
  { id:21, title:"Frozen", emoji:"❄️", accent:"#1A8FAA", bg:"#000d14", words:{
    easy:  ["ELSA","ANNA","KRISTOFF","OLAF","SVEN","HANS","ARENDELLE","BLIZZARD","TROLLS","CORONATION","SNOWMAN","CONCEAL","REVEAL","FJORD","REINDEER"],
    hard:  ["PABBIE","BULDA","OAKEN","DUKE","WESELTON","GLOVES","SISTERS","SUMMER","WINTER","CASTLE","NORTH","MOUNTAIN","MAGIC","WOLF","ICE"],
    expert:["YELANA","HONEYMAREN","RYDER","BRUNI","NOKK","GALE","GIANTS","AHTOHALLAN","NORTHULDRA","FOURTH","ENCHANTED","SPIRIT","FOREST","DARK","MEMORY"],
  }},
  { id:22, title:"Toy Story", emoji:"🤠", accent:"#1F618D", bg:"#00060f", words:{
    easy:  ["WOODY","BUZZ","JESSIE","SLINKY","HAMM","LOTSO","BULLSEYE","ANDY","ZURG","SHERIFF","INFINITY","DAYCARE","FORKY","BONNIE","COWBOY"],
    hard:  ["REX","POTATO","WHEEZY","ETCH","SNAKE","LENNY","ROCKY","STINKY","SID","HANNAH","SCUD","MOLLY","BUSTER","MIKE","RC"],
    expert:["BABYFACE","LEGS","JINGLE","TWITCH","CHUNK","SPARKS","STRETCH","BOOKWORM","CHATTER","TOTORO","COMBAT","CARL","ROLLERBOB","SKIPPY","DUCKY"],
  }},
  { id:23, title:"Finding Nemo", emoji:"🐠", accent:"#CC4400", bg:"#000810", words:{
    easy:  ["NEMO","MARLIN","DORY","GILL","BLOAT","CRUSH","SQUIRT","DARLA","NIGEL","SHARK","DENTIST","CLOWNFISH","PELICAN","TURTLE","CORAL"],
    hard:  ["PEACH","GURGLE","BUBBLES","DEB","BRUCE","ANCHOR","CHUM","WHALE","SEAGULL","FILTER","MASK","TANK","SYDNEY","CURRENT","FLOCK"],
    expert:["GERALD","BECKY","DESTINY","FLUKE","RUDDER","HANK","BAILEY","PEARL","TAD","SHELDON","OTTO","KNICK","NOTCH","BANNER","CARL"],
  }},
  { id:24, title:"The Incredibles", emoji:"🦸", accent:"#B03030", bg:"#0f0000", words:{
    easy:  ["ROBERT","HELEN","VIOLET","DASH","EDNA","SYNDROME","FROZONE","OMNIDROID","SUPERHERO","COSTUME","ELASTIC","VILLAIN","MIRAGE","ISLAND","ROCKET"],
    hard:  ["LUCIUS","HONEY","RICK","GILBERT","BOMB","DYNAGUY","META","STRATOGALE","THUNDERHEAD","NOVA","GAZERBEAM","LARRY","CHUCK","SPLASHDOWN","JACK"],
    expert:["VOYD","REFLUX","BRICK","KRUSHAUER","SCREECH","DICKER","WINSTON","EVELYN","TONY","UNDERMINER","FIRONIC","APOGEE","HYPERSHOCK","TRADEWIND","BLAZESTONE"],
  }},
  { id:25, title:"Shrek", emoji:"🧅", accent:"#4A8A1A", bg:"#030d00", words:{
    easy:  ["SHREK","FIONA","DONKEY","FARQUAAD","PUSS","DRAGON","DULOC","SWAMP","FAIRY","CHARMING","OGRE","ONION","LAYERS","MIRROR","GINGERBREAD"],
    hard:  ["RUMPELSTILTSKIN","ARTHUR","MERLIN","LANCELOT","PINOCCHIO","MUFFIN","GINGY","CAPTAIN","MONGO","THELONIUS","WITCH","WOLF","COOKIE","GUINEVERE","CYCLOPS"],
    expert:["LILLIAN","HAROLD","DORIS","BROGAN","MABEL","GRETCHED","PIED","GNOME","HUMPTY","HANSEL","GRETEL","JACK","JILL","DRAGON","FELICIA"],
  }},
  { id:26, title:"Moana", emoji:"🌊", accent:"#148A8A", bg:"#000d0d", words:{
    easy:  ["MOANA","MAUI","TAMATOA","GRAMMA","MOTUNUI","WAYFINDING","OCEAN","COCONUT","DEMIGOD","CANOE","VOYAGER","HEART","LAVA","HOOK","SPIRAL"],
    hard:  ["SINA","TALA","TEKA","KAKAMORA","LALOTAI","FISHHOOK","TATTOO","SHINY","CHIEF","STINGRAY","VILLAGE","DARKNESS","SAILING","RESTORE","ISLAND"],
    expert:["NAMONA","PEKA","MATAGI","VAKAI","REALM","ANCESTORS","WAYFINDER","PADDLE","ABYSS","NAVIGATOR","CHORUS","CAVERN","BARRIER","CURRENT","ROOSTER"],
  }},
  { id:27, title:"Coco", emoji:"💀", accent:"#C06000", bg:"#0d0400", words:{
    easy:  ["MIGUEL","HECTOR","IMELDA","ERNESTO","DANTE","RIVERA","OFRENDA","MARIGOLD","GUITAR","MEMORY","ALEBRIJE","BLESSING","SKELETON","BRIDGE","PHOTOGRAPH"],
    hard:  ["COCO","ABUELA","ROSITA","OSCAR","JORGE","JULIO","FRIDA","CHICHARRON","PEPITA","AZTEC","PORTAL","FESTIVAL","REMEMBER","MAMA","PAPA"],
    expert:["VICTORIA","SOCORRO","ENRIQUE","LUISA","BERTO","ABEL","ROSA","MANNY","STAGE","CEMETERY","CARNIVAL","PETALS","FOOTPATH","CASKET","CANDLE"],
  }},
  { id:28, title:"How To Train Dragon", emoji:"🐲", accent:"#177A90", bg:"#000c10", words:{
    easy:  ["HICCUP","TOOTHLESS","ASTRID","STOICK","GOBBER","BERK","NIGHTFURY","GRONCKLE","ZIPPLEBACK","ALPHA","ACADEMY","TRAINING","SNOTLOUT","FISHLEGS","NADDER"],
    hard:  ["RUFFNUT","TUFFNUT","VALKA","DRAGO","ERET","CLOUDJUMPER","STORMFLY","MEATLUG","HOOKFANG","BELCH","BARF","SKULLCRUSHER","GRUMP","DART","POUNCER"],
    expert:["GRIMMEL","RUFFRUNNER","HHCCUP","HEATHER","DAGUR","MILDEW","ALVIN","SAVAGE","RYKER","VIGGO","KROGAN","WINDSHEAR","SLEUTHER","TORCH","SMIDVARG"],
  }},
  { id:29, title:"Up", emoji:"🎈", accent:"#B8860B", bg:"#0d0c00", words:{
    easy:  ["CARL","ELLIE","RUSSELL","DUG","KEVIN","MUNTZ","PARADISE","FALLS","BALLOONS","ADVENTURE","EXPLORER","WILDERNESS","SQUIRREL","SCRAPBOOK","GRAPE"],
    hard:  ["ALPHA","BETA","GAMMA","CHARLES","SPIRIT","MERIT","BADGE","SOUTH","SODA","TALKING","BIRD","COLLAR","CONE","CHOC","PACKARD"],
    expert:["PHYLLIS","HENRIETTA","CAMPSITE","TEPUI","VENEZUELA","DIRIGIBLE","NEWSREEL","YOUNGSTER","BINOCULARS","ASTER","STORM","CAMPFIRE","PORCH","COMPASS","GLORY"],
  }},
  { id:30, title:"Encanto", emoji:"🦋", accent:"#8E24AA", bg:"#0d0010", words:{
    easy:  ["MIRABEL","LUISA","ISABELA","DOLORES","CAMILO","ABUELA","BRUNO","CASITA","COLOMBIA","CANDLE","MIRACLE","PROPHECY","JULIETA","PEPA","VISION"],
    hard:  ["FELIX","AGUSTIN","ANTONIO","MARIANO","DOLORES","CRACKS","GIFT","FAMILY","MAGIC","CEREMONY","HEALING","SHAPESHIFTER","CLOUD","FLOWER","RATS"],
    expert:["ALMA","PEDRO","OSVALDO","SENORA","PRIME","COGNITO","AREPA","RUANA","PARROT","CAPYBARA","TOUCAN","BUTTERFLY","JAGUAR","VINE","TAPIR"],
  }},
];

const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

function buildGrid(words, gridSize) {
  const grid = Array.from({length:gridSize}, () => Array(gridSize).fill(''));
  const placed = [];
  const sorted = [...words].filter(w=>w.length<=gridSize).sort((a,b)=>b.length-a.length);
  for (const word of sorted) {
    let ok2=false;
    for (let attempt=0;attempt<600&&!ok2;attempt++) {
      const [dr,dc]=DIRS[Math.floor(Math.random()*DIRS.length)];
      const maxR=dr===1?gridSize-word.length:dr===-1?word.length-1:gridSize-1;
      const minR=dr===-1?word.length-1:0;
      const maxC=dc===1?gridSize-word.length:dc===-1?word.length-1:gridSize-1;
      const minC=dc===-1?word.length-1:0;
      if(maxR<minR||maxC<minC)continue;
      const r=minR+Math.floor(Math.random()*(maxR-minR+1));
      const c=minC+Math.floor(Math.random()*(maxC-minC+1));
      let ok=true;
      for(let i=0;i<word.length;i++){const nr=r+dr*i,nc=c+dc*i;if(grid[nr][nc]!==''&&grid[nr][nc]!==word[i]){ok=false;break;}}
      if(ok){for(let i=0;i<word.length;i++)grid[r+dr*i][c+dc*i]=word[i];placed.push({word,r,c,dr,dc});ok2=true;}
    }
  }
  const alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r=0;r<gridSize;r++)for(let c=0;c<gridSize;c++)if(!grid[r][c])grid[r][c]=alpha[Math.floor(Math.random()*26)];
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

function Confetti({active}){
  const canvasRef=useRef(null);
  useEffect(()=>{
    if(!active)return;
    const canvas=canvasRef.current;if(!canvas)return;
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const ctx=canvas.getContext('2d');
    const COLORS=['#F7C948','#E74C3C','#2ECC71','#3498DB','#9B59B6','#E67E22','#1ABC9C','#FF6B9D'];
    const particles=Array.from({length:160},()=>({
      x:Math.random()*canvas.width,y:-20-Math.random()*100,
      vx:(Math.random()-0.5)*5,vy:Math.random()*4+2,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      w:Math.random()*10+5,h:Math.random()*6+4,
      rot:Math.random()*360,rotV:(Math.random()-0.5)*10,
      gravity:0.12+Math.random()*0.08,
    }));
    let frame,alive=true;
    function draw(){
      if(!alive)return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      let any=false;
      for(const p of particles){
        p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.rot+=p.rotV;
        if(p.y<canvas.height+60)any=true;
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color;ctx.globalAlpha=Math.max(0,1-(p.y/(canvas.height*0.9)));
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
      }
      if(any)frame=requestAnimationFrame(draw);
    }
    frame=requestAnimationFrame(draw);
    return()=>{alive=false;cancelAnimationFrame(frame);};
  },[active]);
  if(!active)return null;
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1000}}/>;
}

export default function WordSearch(){
  const [screen,setScreen]=useState('picker');
  const [showIdx,setShowIdx]=useState(null);
  const [diff,setDiff]=useState(null);
  const [gameData,setGameData]=useState(null);
  const [found,setFound]=useState(new Set());
  const [sel,setSel]=useState(null);
  const [dragging,setDragging]=useState(false);
  const [timeLeft,setTimeLeft]=useState(0);
  const [flash,setFlash]=useState(null);
  const [penaltyMsg,setPenaltyMsg]=useState(null);
  const [darkMode,setDarkMode]=useState(true);
  const [revealedWord,setRevealedWord]=useState(null);
  const [points,setPoints]=useState(0);
  const [revealMode,setRevealMode]=useState(false);
  const [confetti,setConfetti]=useState(false);

  const gRef=useRef(null),selRef=useRef(null),commitRef=useRef(null);
  const timerRef=useRef(null),gridContRef=useRef(null);

  const winW=useWindowWidth();
  const isMobile=winW<640;
  const isTablet=winW>=640&&winW<900;
  const show=showIdx!==null?SHOWS[showIdx]:null;
  const diffCfg=diff?DIFF[diff]:null;
  const accentColor=show?.accent||'#C8900A';
  const dk=darkMode;
  const gridSize=diffCfg?.gridSize||16;
  const availW=isMobile?winW-24:isTablet?Math.min(winW*0.55,420):Math.min(winW*0.45,460);
  const cellPx=Math.floor(availW/gridSize);
  const fs=Math.max(10,Math.floor(cellPx*0.52))+'px';

  const T=dk?{
    pageBg:screen==='game'?(show?.bg||'#0a0a0a'):'#0a0a0a',
    text:'#F0F0F0',muted:'#AAAAAA',subtle:'#777',faint:'#2a2a2a',
    surface:'rgba(255,255,255,0.06)',surfaceHover:'rgba(255,255,255,0.11)',
    border:'rgba(255,255,255,0.12)',borderHover:'rgba(255,255,255,0.38)',
    gridBg:'rgba(255,255,255,0.03)',cellDefault:'#888',cellHover:'rgba(255,255,255,0.1)',
    selBg:'rgba(255,255,255,0.25)',selColor:'#fff',
    scrollTrack:'#111',scrollThumb:'#555',
    btnBg:'rgba(255,255,255,0.08)',btnBorder:'rgba(255,255,255,0.18)',btnText:'#CCC',
    progressTrack:'rgba(255,255,255,0.12)',footerText:'#444',footerAccent:'#666',
    sectionColor:{tv:'#BBB',disney:'#5BBFDF',pixar:'#F09030',dreamworks:'#7EC840'},
    taglineColor:'#D4A800',pillBg:'rgba(255,255,255,0.07)',pillText:'#BBB',
    pillFoundBg:(a)=>a+'30',pillFoundText:(a)=>a,pillFoundBorder:(a)=>a+'77',
    diffCardBg:'rgba(255,255,255,0.05)',diffCardHover:'rgba(255,255,255,0.1)',
  }:{
    pageBg:screen==='game'?'#EDE5D0':'#F5EDD8',
    text:'#1E1208',muted:'#6A5030',subtle:'#8A6A40',faint:'#D8C8A8',
    surface:'rgba(60,30,5,0.07)',surfaceHover:'rgba(60,30,5,0.13)',
    border:'rgba(60,30,5,0.18)',borderHover:'rgba(60,30,5,0.45)',
    gridBg:'rgba(60,30,5,0.04)',cellDefault:'#8A6A40',cellHover:'rgba(60,30,5,0.1)',
    selBg:'rgba(60,30,5,0.22)',selColor:'#1E1208',
    scrollTrack:'#DDD0B4',scrollThumb:'#B8A07A',
    btnBg:'rgba(60,30,5,0.08)',btnBorder:'rgba(60,30,5,0.22)',btnText:'#6A5030',
    progressTrack:'rgba(60,30,5,0.12)',footerText:'#C0AA80',footerAccent:'#8A7050',
    sectionColor:{tv:'#5A3A18',disney:'#005F99',pixar:'#A04500',dreamworks:'#2E6010'},
    taglineColor:'#A07000',pillBg:'rgba(60,30,5,0.08)',pillText:'#6A5030',
    pillFoundBg:(a)=>a+'28',pillFoundText:(a)=>a,pillFoundBorder:(a)=>a+'88',
    diffCardBg:'rgba(60,30,5,0.05)',diffCardHover:'rgba(60,30,5,0.11)',
  };

  useEffect(()=>{
    if(screen!=='game'){clearInterval(timerRef.current);return;}
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{const next=t-1;if(next<=0){clearInterval(timerRef.current);setScreen('timeout');}return Math.max(0,next);});
    },1000);
    return()=>clearInterval(timerRef.current);
  },[screen]);

  function startGame(idx,d){
    const s=SHOWS[idx];const cfg=DIFF[d];
    const words=s.words[d];
    const{grid,placed}=buildGrid(words,cfg.gridSize);
    gRef.current={grid,placed};
    setShowIdx(idx);setDiff(d);setGameData({grid,placed});setFound(new Set());
    setSel(null);setTimeLeft(cfg.time);setFlash(null);setPenaltyMsg(null);
    setRevealedWord(null);setPoints(0);setRevealMode(false);setConfetti(false);
    setScreen('game');
  }

  const commit=useCallback(()=>{
    if(!selRef.current||!gRef.current){setDragging(false);setSel(null);return;}
    const{r1,c1,r2,c2}=selRef.current;
    const cells=getCells(r1,c1,r2,c2);
    const word=cells.map(([r,c])=>gRef.current.grid[r][c]).join('');
    const wordRev=word.split('').reverse().join('');
    const match=gRef.current.placed.find(p=>(p.word===word||p.word===wordRev)&&!Array.from(found).includes(p.word));
    if(match){
      setFound(prev=>{const next=new Set(prev);next.add(match.word);if(next.size===gRef.current.placed.length){clearInterval(timerRef.current);setConfetti(true);setTimeout(()=>setScreen('done'),400);}return next;});
      setPoints(p=>p+1);
      setFlash({cells:cells.map(([r,c])=>cellKey(r,c)),type:'good'});
      setTimeout(()=>setFlash(null),700);
    }else{
      const pen=diffCfg?.penalty||10;
      setTimeLeft(t=>{const next=Math.max(0,t-pen);if(next<=0){clearInterval(timerRef.current);setTimeout(()=>setScreen('timeout'),300);}return next;});
      setPenaltyMsg('−'+pen+'s');setTimeout(()=>setPenaltyMsg(null),900);
      setFlash({cells:cells.map(([r,c])=>cellKey(r,c)),type:'bad'});
      setTimeout(()=>setFlash(null),400);
    }
    setDragging(false);setSel(null);selRef.current=null;
  },[found,diffCfg]);

  useEffect(()=>{commitRef.current=commit;},[commit]);
  useEffect(()=>{const up=()=>commitRef.current?.();window.addEventListener('mouseup',up);return()=>window.removeEventListener('mouseup',up);},[]);

  function cellFromPoint(x,y){const els=document.elementsFromPoint(x,y);for(const el of els)if(el.dataset.r!==undefined&&el.dataset.c!==undefined)return{r:+el.dataset.r,c:+el.dataset.c};return null;}
  const onCellDown=(r,c,e)=>{e.preventDefault();setDragging(true);const s={r1:r,c1:c,r2:r,c2:c};selRef.current=s;setSel(s);};
  const onCellEnter=(r,c)=>{if(!dragging||!selRef.current)return;const s={...selRef.current,r2:r,c2:c};selRef.current=s;setSel(s);};
  const onTouchStart=(e)=>{e.preventDefault();const t=e.touches[0];const cell=cellFromPoint(t.clientX,t.clientY);if(!cell)return;setDragging(true);const s={r1:cell.r,c1:cell.c,r2:cell.r,c2:cell.c};selRef.current=s;setSel(s);};
  const onTouchMove=(e)=>{e.preventDefault();const t=e.touches[0];const cell=cellFromPoint(t.clientX,t.clientY);if(!cell||!selRef.current)return;const s={...selRef.current,r2:cell.r,c2:cell.c};selRef.current=s;setSel({...s});};
  const onTouchEnd=(e)=>{e.preventDefault();commitRef.current?.();};

  function handlePillClick(word){
    if(found.has(word))return;
    if(revealMode){
      setFound(prev=>{const next=new Set(prev);next.add(word);if(next.size===gRef.current.placed.length){clearInterval(timerRef.current);setConfetti(true);setTimeout(()=>setScreen('done'),400);}return next;});
      setPoints(p=>p-(diffCfg?.revealCost||8));setRevealMode(false);
    }else{clearInterval(timerRef.current);setRevealedWord(word);setScreen('gameover');}
  }

  const selCellSet=new Set();
  if(sel)getCells(sel.r1,sel.c1,sel.r2,sel.c2).forEach(([r,c])=>selCellSet.add(cellKey(r,c)));
  const foundCellMap=new Map();
  if(gameData)for(const p of gameData.placed){if(!found.has(p.word))continue;getCells(p.r,p.c,p.r+p.dr*(p.word.length-1),p.c+p.dc*(p.word.length-1)).forEach(([r,c])=>foundCellMap.set(cellKey(r,c),p.word));}
  const flashSet=new Set(flash?.cells||[]);
  const fmtTime=t=>{const s=Math.max(0,t);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
  const timerColor=timeLeft>60?T.text:timeLeft>30?'#E67E22':'#C0392B';
  const timerAnim=timeLeft<=10&&timeLeft>0?'pulse 0.8s infinite':'none';
  const revealCost=diffCfg?.revealCost||8;

  const SECTIONS=[
    {label:'📺 TV Shows & Films',color:T.sectionColor.tv,       ids:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]},
    {label:'🏰 Disney',          color:T.sectionColor.disney,    ids:[21,26,30]},
    {label:'🤖 Pixar',           color:T.sectionColor.pixar,     ids:[22,23,24,27,29]},
    {label:'🐉 DreamWorks',      color:T.sectionColor.dreamworks, ids:[20,25,28]},
  ];

  const ToggleBtn=()=>(<button onClick={()=>setDarkMode(d=>!d)} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,borderRadius:20,padding:'5px 11px',cursor:'pointer',fontSize:'0.88rem',lineHeight:1,flexShrink:0}}>{dk?'☀️':'🌙'}</button>);
  const Footer=()=>(<div style={{textAlign:'center',marginTop:isMobile?16:24,fontFamily:"'Crimson Text',serif",fontSize:'0.6rem',color:T.faint,letterSpacing:'0.1em'}}>PopcornPuzzle · Produced by Papa Bona Owusu</div>);

  return (
    <div style={{minHeight:'100vh',background:T.pageBg,fontFamily:"'Georgia',serif",color:T.text,display:'flex',flexDirection:'column',alignItems:'center',transition:'background 0.35s,color 0.25s',padding:isMobile?'0 8px 28px':'0 14px 36px',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        html,body{margin:0;padding:0;-webkit-tap-highlight-color:transparent;}*{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:${T.scrollTrack};}::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px;}
        .cine-cell{display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;font-family:'Crimson Text',serif;font-weight:800;border-radius:3px;transition:background 0.07s,color 0.07s;}
        .cine-cell:hover{background:${T.cellHover};}
        .word-pill{padding:5px 11px;border-radius:20px;font-family:'Cinzel',serif;letter-spacing:0.05em;cursor:pointer;transition:all 0.15s;border:1px solid ${T.border};text-transform:uppercase;white-space:nowrap;font-size:${isMobile?'0.67rem':'0.72rem'};}
        .word-pill:hover{transform:scale(1.04);}
        .show-card{border:1px solid ${T.border};border-radius:12px;padding:14px 12px;cursor:pointer;transition:all 0.2s;background:${T.surface};display:flex;flex-direction:column;gap:5px;position:relative;overflow:hidden;}
        .show-card:hover{transform:translateY(-2px);border-color:${T.borderHover};background:${T.surfaceHover};}
        .diff-card{border:2px solid ${T.border};border-radius:14px;padding:18px 20px;cursor:pointer;transition:all 0.18s;background:${T.diffCardBg};display:flex;flex-direction:column;gap:6px;position:relative;}
        .diff-card:hover{transform:translateY(-2px);background:${T.diffCardHover};}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.55}}
        @keyframes penaltyFade{0%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}100%{opacity:0;transform:translate(-50%,-80%) scale(0.9)}}
        .found-pop{animation:pop 0.28s ease;}
      `}</style>
      <Confetti active={confetti}/>

      {/* ══ PICKER ══ */}
      {screen==='picker'&&(
        <div style={{width:'100%',maxWidth:980,animation:'fadeIn 0.5s ease'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'20px 0 4px':'28px 0 6px'}}>
            <div style={{flex:1}}/>
            <div style={{textAlign:'center',flex:2}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'clamp(1.8rem,4vw,2.8rem)',fontWeight:900,letterSpacing:'0.08em',color:T.text,textShadow:dk?'0 0 40px rgba(255,255,255,0.15)':'0 2px 10px rgba(60,30,5,0.12)'}}>🍿 PopcornPuzzle</div>
              <div style={{fontFamily:"'Crimson Text',serif",color:T.taglineColor,fontSize:'0.68rem',letterSpacing:'0.24em',marginTop:5,textTransform:'uppercase'}}>The Ultimate Screen Word Search</div>
              <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'0.8rem',marginTop:6,fontStyle:'italic'}}>{SHOWS.length} titles · 3 difficulty levels each</div>
            </div>
            <div style={{flex:1,display:'flex',justifyContent:'flex-end'}}><ToggleBtn/></div>
          </div>
          <div style={{height:'1px',background:T.border,margin:isMobile?'16px 0':'20px 0'}}/>
          {SECTIONS.map(section=>(
            <div key={section.label} style={{marginBottom:isMobile?20:28}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.63rem',letterSpacing:'0.2em',color:section.color,marginBottom:10,paddingBottom:7,borderBottom:'1px solid '+T.border}}>{section.label}</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax('+(isMobile?140:185)+'px, 1fr))',gap:isMobile?8:11}}>
                {section.ids.map(id=>{
                  const i=SHOWS.findIndex(s=>s.id===id);const s=SHOWS[i];if(!s)return null;
                  return(
                    <div key={s.id} className="show-card" onClick={()=>{setShowIdx(i);setScreen('difficulty');}}>
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:s.accent,borderRadius:'0 0 12px 12px'}}/>
                      <div style={{fontSize:isMobile?'1.3rem':'1.4rem'}}>{s.emoji}</div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'0.7rem':'0.76rem',fontWeight:700,color:s.accent,letterSpacing:'0.04em',lineHeight:1.3}}>{s.title}</div>
                      <div style={{fontSize:'0.62rem',color:T.muted}}>3 levels · 15 words each</div>
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

      {/* ══ DIFFICULTY ══ */}
      {screen==='difficulty'&&show&&(
        <div style={{width:'100%',maxWidth:520,animation:'fadeIn 0.35s ease',padding:isMobile?'30px 0':'50px 0'}}>
          <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'6px 14px',borderRadius:8,cursor:'pointer',fontFamily:"'Crimson Text',serif",fontSize:'0.88rem',marginBottom:28}}>← Back</button>
          <div style={{textAlign:'center',marginBottom:32}}>
            <div style={{fontSize:'2.5rem',marginBottom:8}}>{show.emoji}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.3rem':'1.8rem',fontWeight:700,color:show.accent}}>{show.title}</div>
            <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'0.88rem',marginTop:6,fontStyle:'italic'}}>Each difficulty has different words — choose your level</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {Object.entries(DIFF).map(([key,cfg])=>(
              <div key={key} className="diff-card" onClick={()=>startGame(showIdx,key)} style={{borderColor:cfg.color+'55'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:'1.5rem'}}>{cfg.emoji}</span>
                  <div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:'1rem',fontWeight:700,color:cfg.color,letterSpacing:'0.06em'}}>{cfg.label}</div>
                    <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.82rem',color:T.muted,marginTop:2}}>{cfg.desc}</div>
                  </div>
                  <div style={{marginLeft:'auto',fontFamily:"'Cinzel',serif",fontSize:'0.72rem',color:T.subtle,textAlign:'right'}}>
                    <div>Reveal: {cfg.revealCost}pts</div>
                    <div style={{marginTop:2}}>{cfg.gridSize}×{cfg.gridSize} grid</div>
                  </div>
                </div>
                <div style={{height:3,background:cfg.color+'33',borderRadius:2,marginTop:8,overflow:'hidden'}}>
                  <div style={{height:'100%',background:cfg.color,width:key==='easy'?'33%':key==='hard'?'66%':'100%',borderRadius:2}}/>
                </div>
              </div>
            ))}
          </div>
          <Footer/>
        </div>
      )}

      {/* ══ GAME ══ */}
      {screen==='game'&&show&&gameData&&diffCfg&&(
        <div style={{width:'100%',maxWidth:1100,animation:'fadeIn 0.4s ease'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:isMobile?'12px 0 8px':'18px 0 10px'}}>
            <button onClick={()=>{clearInterval(timerRef.current);setScreen('picker');}} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:isMobile?'6px 10px':'6px 14px',borderRadius:8,cursor:'pointer',fontFamily:"'Crimson Text',serif",fontSize:isMobile?'0.8rem':'0.88rem',whiteSpace:'nowrap',flexShrink:0}}>
              ← {isMobile?'Back':'PopcornPuzzle'}
            </button>
            <div style={{textAlign:'center',flex:1,overflow:'hidden'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'0.9rem':'clamp(1rem,2.5vw,1.5rem)',fontWeight:700,color:accentColor,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{show.emoji} {show.title}</div>
              <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.65rem',color:DIFF[diff].color,letterSpacing:'0.1em',marginTop:2,textTransform:'uppercase'}}>{diffCfg.label} — unique words</div>
            </div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.1rem':'1.3rem',color:timerColor,flexShrink:0,minWidth:54,textAlign:'right',animation:timerAnim,fontWeight:700}}>{fmtTime(timeLeft)}</div>
            <ToggleBtn/>
          </div>
          <div style={{height:4,background:T.progressTrack,borderRadius:2,marginBottom:8,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:2,background:accentColor,width:((found.size/gameData.placed.length)*100)+'%',transition:'width 0.4s ease',boxShadow:'0 0 8px '+accentColor}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:isMobile?10:12,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,background:T.surface,border:'1px solid '+T.border,borderRadius:20,padding:'4px 12px',flexShrink:0}}>
              <span style={{fontSize:'0.8rem'}}>⭐</span>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:'0.8rem',fontWeight:700,color:T.text}}>{points}</span>
              <span style={{fontFamily:"'Crimson Text',serif",fontSize:'0.7rem',color:T.muted}}>pts</span>
            </div>
            {points>=revealCost?(
              <button onClick={()=>setRevealMode(r=>!r)} style={{background:revealMode?accentColor:T.btnBg,border:'1px solid '+(revealMode?accentColor:T.btnBorder),color:revealMode?'#fff':T.btnText,padding:'4px 12px',borderRadius:20,cursor:'pointer',fontFamily:"'Cinzel',serif",fontSize:'0.75rem',fontWeight:700,boxShadow:revealMode?'0 0 14px '+accentColor+'88':'none',transition:'all 0.2s',animation:revealMode?'pulse 1.2s infinite':'none'}}>
                💡 {revealMode?`Tap a word (−${revealCost}pts)`:`Reveal (${revealCost}pts)`}
              </button>
            ):(
              <div style={{fontFamily:"'Crimson Text',serif",fontSize:'0.7rem',color:T.subtle,fontStyle:'italic'}}>{revealCost-points} more {revealCost-points===1?'point':'points'} to unlock reveal</div>
            )}
          </div>
          <div style={{display:'flex',flexDirection:isMobile?'column':'row',gap:isMobile?14:22,alignItems:'flex-start'}}>
            <div style={{position:'relative',display:'flex',justifyContent:isMobile?'center':'flex-start',flexShrink:0,width:isMobile?'100%':'auto'}}>
              {penaltyMsg&&(<div style={{position:'absolute',top:'50%',left:'50%',zIndex:10,fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.6rem':'2rem',fontWeight:900,color:'#E74C3C',textShadow:'0 0 20px rgba(231,76,60,0.8)',pointerEvents:'none',animation:'penaltyFade 0.9s ease forwards'}}>{penaltyMsg}</div>)}
              <div ref={gridContRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                style={{display:'grid',gridTemplateColumns:'repeat('+gridSize+', '+cellPx+'px)',gap:2,background:T.gridBg,border:'2px solid '+accentColor+'66',borderRadius:12,padding:isMobile?5:7,touchAction:'none',boxShadow:'0 0 32px '+accentColor+(dk?'25':'33')}}>
                {gameData.grid.map((row,r)=>row.map((ch,c)=>{
                  const key=cellKey(r,c);
                  const isFound=foundCellMap.has(key),isSel=selCellSet.has(key),isFlash=flashSet.has(key);
                  let bg='transparent',color=T.cellDefault;
                  if(isFound){bg=accentColor+'38';color=accentColor;}
                  if(isSel){bg=T.selBg;color=T.selColor;}
                  if(isFlash){bg=flash.type==='good'?accentColor+'AA':'rgba(200,40,40,0.6)';color='#fff';}
                  return(<div key={key} className="cine-cell" data-r={r} data-c={c} onMouseDown={e=>onCellDown(r,c,e)} onMouseEnter={()=>onCellEnter(r,c)} style={{width:cellPx+'px',height:cellPx+'px',fontSize:fs,background:bg,color,fontWeight:isFound?900:700}}>{ch}</div>);
                }))}
              </div>
            </div>
            <div style={{flex:1,minWidth:0,width:'100%'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.14em',color:T.subtle,marginBottom:8}}>{found.size} / {gameData.placed.length} FOUND</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:isMobile?6:7}}>
                {gameData.placed.map(p=>{
                  const isFound=found.has(p.word);
                  return(<div key={p.word} className={'word-pill'+(isFound?' found-pop':'')} onClick={()=>handlePillClick(p.word)}
                    style={{background:isFound?T.pillFoundBg(accentColor):revealMode&&!isFound?accentColor+'18':T.pillBg,color:isFound?T.pillFoundText(accentColor):revealMode&&!isFound?accentColor:T.pillText,textDecoration:isFound?'line-through':'none',borderColor:isFound?T.pillFoundBorder(accentColor):revealMode&&!isFound?accentColor+'88':T.border,cursor:isFound?'default':revealMode?'cell':'pointer',fontWeight:isFound?700:600,transform:revealMode&&!isFound?'scale(1.04)':'scale(1)'}}>
                    {p.word}
                  </div>);
                })}
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      )}

      {/* ══ TIMEOUT ══ */}
      {screen==='timeout'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.5s ease',textAlign:'center',padding:'24px'}}>
          <div style={{fontSize:'3.5rem'}}>⏰</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'2.4rem',fontWeight:900,color:'#E67E22'}}>Time's Up!</div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'1.05rem',fontStyle:'italic'}}>{show.emoji} {show.title} · {diffCfg?.label}</div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.subtle,fontSize:'0.9rem'}}>{found.size} of {gameData?.placed.length} words found</div>
          <div style={{display:'flex',gap:12,marginTop:10,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx,diff)} style={{background:'rgba(230,126,34,0.15)',border:'1px solid rgba(230,126,34,0.55)',color:'#E67E22',padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Try Again</button>
            <button onClick={()=>setScreen('difficulty')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Change Difficulty</button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Choose Another</button>
          </div>
          <Footer/>
        </div>
      )}

      {/* ══ GAME OVER ══ */}
      {screen==='gameover'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.5s ease',textAlign:'center',padding:'24px'}}>
          <div style={{fontSize:'3.5rem'}}>💀</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'2.4rem',fontWeight:900,color:'#C0392B'}}>Game Over</div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'1.05rem',fontStyle:'italic',maxWidth:320,lineHeight:1.6}}>
            You peeked at <span style={{color:'#C0392B',fontWeight:700,fontStyle:'normal'}}>{revealedWord}</span> — that's cheating!
          </div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.subtle,fontSize:'0.88rem'}}>{found.size} of {gameData?.placed.length} words found · {fmtTime(timeLeft)} remaining</div>
          <div style={{display:'flex',gap:12,marginTop:10,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx,diff)} style={{background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.55)',color:'#C0392B',padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Try Again</button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Choose Another</button>
          </div>
          <Footer/>
        </div>
      )}

      {/* ══ DONE ══ */}
      {screen==='done'&&show&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:16,animation:'fadeIn 0.6s ease',textAlign:'center',padding:'24px'}}>
          <div style={{fontSize:'3.5rem'}}>🎉</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:isMobile?'1.7rem':'2.5rem',fontWeight:900,color:accentColor}}>Completed!</div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.muted,fontSize:'1.05rem',fontStyle:'italic'}}>{show.emoji} {show.title} · {diffCfg?.label} mode</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'2.2rem',color:T.text,marginTop:4}}>{fmtTime(timeLeft)} <span style={{fontSize:'0.9rem',color:T.muted}}>remaining</span></div>
          <div style={{fontFamily:"'Crimson Text',serif",color:T.subtle,fontSize:'0.9rem'}}>Finished with {points} ⭐ points</div>
          <div style={{display:'flex',gap:12,marginTop:10,flexWrap:'wrap',justifyContent:'center'}}>
            <button onClick={()=>startGame(showIdx,diff)} style={{background:accentColor+'22',border:'1px solid '+accentColor+'88',color:accentColor,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Play Again</button>
            <button onClick={()=>setScreen('difficulty')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Change Difficulty</button>
            <button onClick={()=>setScreen('picker')} style={{background:T.btnBg,border:'1px solid '+T.btnBorder,color:T.btnText,padding:'10px 22px',borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:'0.88rem',cursor:'pointer'}}>Choose Another</button>
          </div>
          <Footer/>
        </div>
      )}
    </div>
  );
}