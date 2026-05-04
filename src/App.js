import { useState, useEffect, useCallback, useMemo, Fragment } from "react";

/* ═══════════════════════════════════════════════════════════════════
   GRUPO FPC — Sistema de Control de Instalaciones v3.0
   ─────────────────────────────────────────────────────────────────── */

// ───── TABLAS DE PAGO ─────
const RATE = {
  "ENROLLABLE":{A:{i:5,a:2.5},B:{i:4,a:2}},"HORIZONTAL 1\"":{A:{i:5,a:2.5},B:{i:4,a:2}},
  "HORIZONTAL 2\"":{A:{i:5,a:2.5},B:{i:4,a:2}},"VERTICALES":{A:{i:5,a:2.5},B:{i:4,a:2}},
  "PUERTA PLEGABLE":{A:{i:6,a:3},B:{i:5,a:2.5}},"MOTOR Y CANALETA":{A:{i:8,a:4},B:{i:8,a:4}},
  "CORTINAS":{A:{i:6,a:3},B:{i:5,a:2.5}},"CENEFA DE PVC":{A:{i:6,a:3},B:{i:5,a:2.5}},
  "CONEXION ELECTRICA":{A:{i:0,a:0},B:{i:0,a:0}},"CENEFAS CAJON":{A:{i:6,a:3},B:{i:5,a:2.5}},
  "PANEL DESLIZANTE":{A:{i:6,a:3},B:{i:5,a:2.5}},"GIGA":{A:{i:10,a:5},B:{i:9,a:4.5}},
  "LIENZO FIJO":{A:{i:4,a:2},B:{i:3,a:1.5}},"MEDICION":{A:{i:15,a:7.5},B:{i:10,a:5}},
  "FRANCESA":{A:{i:8,a:4},B:{i:5,a:2.5}},"ROMANA":{A:{i:8,a:4},B:{i:5,a:2.5}},
  "RIPPLEFOLD":{A:{i:8,a:4},B:{i:5,a:2.5}},"OJETES":{A:{i:8,a:4},B:{i:5,a:2.5}},
  "REMEDICION":{A:{i:15,a:7.5},B:{i:10,a:5}},"PALILLERIA":{A:{i:10,a:5},B:{i:10,a:5}},
  "GALERIAS":{A:{i:4,a:2},B:{i:3,a:1.5}},"PLANCHAR":{A:{i:3,a:1.5},B:{i:3,a:1.5}},
  "ENROLLABLE MOTORIZADA":{A:{i:10,a:5},B:{i:9,a:4.5}},"GIGA MOTORIZADA":{A:{i:10,a:5},B:{i:9,a:4.5}},
  "RIPPLEFOLD MOTORIZADA":{A:{i:10,a:5},B:{i:9,a:4.5}},"FRANCESA MOTORIZADA":{A:{i:10,a:5},B:{i:9,a:4.5}},
  "CASSETTE":{A:{i:10,a:5},B:{i:8,a:4}},"ROMANA MOTORIZADA":{A:{i:10,a:5},B:{i:9,a:4}},
  "GARANTIA":{A:{i:0,a:0},B:{i:0,a:0}},"SOBRELUZ":{A:{i:5,a:2.5},B:{i:4,a:2}},
  "VTI":{A:{i:10,a:5},B:{i:8,a:4}},"TOLDO":{A:{i:15,a:7.5},B:{i:15,a:7.5}},
};
const PRODS = Object.keys(RATE);

// ───── PERSONAL ─────
const INIT_INSTALADORES = [
  {id:"I01",name:"ROYVIN GUEVARA",cat:"B",on:true,defaultAyId:"A01"},
  {id:"I02",name:"SAMUEL ORDOÑEZ",cat:"B",on:true,defaultAyId:"A02"},
  {id:"I03",name:"CRISTOBAL ZAMORA",cat:"B",on:true,defaultAyId:"A03"},
  {id:"I04",name:"EDY AQUINO",cat:"B",on:true,defaultAyId:"A04"},
  {id:"I05",name:"FREDY CHAVEZ",cat:"B",on:true,defaultAyId:"A05"},
  {id:"I06",name:"ALEX RIVERA",cat:"B",on:true,defaultAyId:"A06"},
  {id:"I07",name:"JAIME PUAQUE",cat:"B",on:true,defaultAyId:"A07"},
  {id:"I08",name:"JORGE FIGUEROA",cat:"B",on:true,defaultAyId:"A08"},
  {id:"I09",name:"JUAN CARLOS JOLON",cat:"B",on:true,defaultAyId:"A09"},
  {id:"I10",name:"LUIS HERNANDEZ",cat:"B",on:true,defaultAyId:"A10"},
  {id:"I11",name:"LUIS JEPTE",cat:"B",on:true,defaultAyId:"A11"},
  {id:"I12",name:"FRANCISCO PEREZ",cat:"B",on:true,defaultAyId:"A12"},
];
const INIT_AYUDANTES = [
  {id:"A01",name:"KEVIN CHAMALE",cat:"B",on:true},
  {id:"A02",name:"HENRY SANCHEZ",cat:"B",on:true},
  {id:"A03",name:"JOSE CARLOS CORADO",cat:"B",on:true},
  {id:"A04",name:"FREYBIN PACHECO",cat:"B",on:true},
  {id:"A05",name:"LUIS VASQUEZ",cat:"B",on:true},
  {id:"A06",name:"LESTER MIRON",cat:"B",on:true},
  {id:"A07",name:"WILSON QUIXAL",cat:"B",on:true},
  {id:"A08",name:"RUDY ROMAN",cat:"B",on:true},
  {id:"A09",name:"JONATHAN MIRON",cat:"B",on:true},
  {id:"A10",name:"MARLON PEREZ",cat:"B",on:true},
  {id:"A11",name:"ERICKSON MUY",cat:"B",on:true},
  {id:"A12",name:"JOSUE ALEJANDRO DONIS",cat:"B",on:true},
  {id:"A13",name:"RODOLFO MARTINEZ",cat:"B",on:true},
];

// ───── CRITERIOS SCORECARD (todos por número de eventos/faltas) ─────
const CRIT = [
  {id:"c1",l:"Errores de Medición",d:"Cero errores atribuibles al técnico",A:0,B:3,cnt:true},
  {id:"c2",l:"Errores de Instalación",d:"Cero errores atribuibles",A:0,B:3,cnt:true},
  {id:"c3",l:"Retrabajos",d:"Cero retrabajos atribuibles",A:0,B:3,cnt:true},
  {id:"c4",l:"Garantías",d:"Cero garantías por mala instalación",A:0,B:2,cnt:true},
  {id:"c5",l:"Reclamos de Cliente",d:"Cero reclamos formales",A:0,B:1,cnt:true},
  {id:"c6",l:"Llamadas de Atención",d:"Cero llamadas vigentes",A:0,B:1,cnt:true},
  {id:"c7",l:"Proceso de Llamadas",d:"No llamó inicio ruta / no avisó retraso",A:0,B:2,cnt:true},
  {id:"c8",l:"Evidencia Fotográfica",d:"No entregó evidencia fotográfica",A:0,B:2,cnt:true},
  {id:"c9",l:"Constancia Firmada",d:"No entregó constancia firmada",A:0,B:2,cnt:true},
  {id:"c10",l:"Liquidación Viáticos",d:"No liquidó viáticos en tiempo",A:0,B:2,cnt:true},
  {id:"c11",l:"Disciplina y Orden",d:"Falta de uniforme, panel sucio, herramientas",A:0,B:2,cnt:true},
  {id:"c12",l:"Servicio al Cliente",d:"Mal trato, no limpió, no explicó producto",A:0,B:2,cnt:true},
  {id:"c13",l:"Revisión de Material",d:"No verificó material antes de ruta",A:0,B:2,cnt:true},
  {id:"c14",l:"Checklist de Instalación",d:"No cumplió nivelación, fijación o funcionamiento",A:0,B:2,cnt:true},
];

// ───── USUARIOS ─────
// publicOnly = solo dashboard con scorecards (rol instalador/ayudante)
const USERS = {
  "admin":     {pw:"fpc2026",     name:"Administrador",        role:"admin",     canMoney:true,  canEdit:true,  publicOnly:false},
  "gerente":   {pw:"gerente2026", name:"Gerente Operaciones",  role:"gerente",   canMoney:true,  canEdit:true,  publicOnly:false},
  "diana":     {pw:"diana2026",   name:"Diana — Asistente",    role:"asistente", canMoney:false, canEdit:true,  publicOnly:false},
  "instalador":{pw:"fpc123",      name:"Instalador",           role:"viewer",    canMoney:false, canEdit:false, publicOnly:true},
  "ayudante":  {pw:"fpc123",      name:"Ayudante",             role:"viewer",    canMoney:false, canEdit:false, publicOnly:true},
};

// ───── STORAGE — Firebase Firestore ─────
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOSKF8Eo8JXM8wkqprWV2viXatMSHI5Qg",
  authDomain: "fpc-sistema.firebaseapp.com",
  projectId: "fpc-sistema",
  storageBucket: "fpc-sistema.firebasestorage.app",
  messagingSenderId: "499421752797",
  appId: "1:499421752797:web:e306b639c349830d985a34",
  measurementId: "G-KE5JMC8VRT"
};

const fbApp = initializeApp(firebaseConfig);
const fbDb = getFirestore(fbApp);

const DB = {
  async get(k){
    try {
      const snap = await getDoc(doc(fbDb, "fpc_data", k));
      return snap.exists() ? snap.data().value : null;
    } catch(e){ console.error("DB get error:",e); return null; }
  },
  async set(k,v){
    try {
      await setDoc(doc(fbDb, "fpc_data", k), { value: v, updated: new Date().toISOString() });
    } catch(e){ console.error("DB set error:",e); }
  },
};

// ───── HELPERS ─────
const Q = n => `Q${(n||0).toLocaleString("es-GT",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const N = n => (n||0).toLocaleString("es-GT",{maximumFractionDigits:2});
const today = () => new Date().toISOString().split("T")[0];

// Pagos calculados con cat de instalador y cat de ayudante por separado
const cPay = (p,m,cI,cA) => {
  const r = RATE[p]; if(!r) return {pi:0,pa:0};
  const tI = r[cI] || r.B;
  const tA = r[cA] || r.B;
  return { pi:+(m*tI.i).toFixed(2), pa:+(m*tA.a).toFixed(2) };
};

// scoreData puede ser:
//  - número (formato viejo)
//  - { value: N, events: [{date, coti, cliente, descripcion}] }
// Esta función obtiene el valor numérico para calcular score.
function getCritValue(sd, tid, cid){
  const s = sd[tid]||{}; const v = s[cid];
  if(v===undefined||v===null) return undefined;
  if(typeof v === "object") return v.value;
  return v;
}

function getCritEvents(sd, tid, cid){
  const s = sd[tid]||{}; const v = s[cid];
  if(v && typeof v === "object" && Array.isArray(v.events)) return v.events;
  return [];
}

function getScore(sd, tid, list){
  const t = list.find(x=>x.id===tid); if(!t) return null;
  let tot=0, cnt=0;
  CRIT.forEach(c=>{
    const v = getCritValue(sd,tid,c.id);
    if(v===undefined) return;
    const mx = t.cat==="A"?c.A:c.B;
    // Todos los criterios son por conteo de eventos (faltas)
    tot += v<=mx ? 100 : Math.max(0, 100-((v-mx)*25));
    cnt++;
  });
  return cnt ? Math.round(tot/cnt) : null;
}

// ───── PERÍODOS MENSUALES (25 al 25) ─────
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// Período "Marzo 2026" = 25 Feb 2026 → 25 Mar 2026
// mesIdx: 0=Enero, 1=Febrero...
function getPeriodRange(mesIdx, anio){
  // Inicio: día 25 del mes ANTERIOR
  const startMonth = mesIdx === 0 ? 11 : mesIdx - 1;
  const startYear  = mesIdx === 0 ? anio - 1 : anio;
  const start = `${startYear}-${String(startMonth+1).padStart(2,"0")}-25`;
  // Fin: día 25 del mes actual
  const end = `${anio}-${String(mesIdx+1).padStart(2,"0")}-25`;
  return { start, end, label: `${MESES[mesIdx]} ${anio}`, labelCorto: `25/${startMonth+1<10?"0":""}${startMonth+1} — 25/${mesIdx+1<10?"0":""}${mesIdx+1}/${anio}` };
}

// Filtrar registros por período (fecha >= start AND fecha < end)
function filterByPeriod(recs, mesIdx, anio){
  const { start, end } = getPeriodRange(mesIdx, anio);
  return recs.filter(r => r.dt >= start && r.dt < end);
}

// Obtener período actual basado en la fecha de hoy
function getCurrentPeriod(){
  const hoy = new Date();
  const d = hoy.getDate();
  let m = hoy.getMonth(); // 0-indexed
  let y = hoy.getFullYear();
  // Si estamos antes del 25, el período actual es este mes
  // Si estamos el 25 o después, el período actual es el próximo mes
  if(d >= 25){
    m = m + 1;
    if(m > 11){ m = 0; y++; }
  }
  return { mes: m, anio: y };
}

// ───── COMPONENTES UI ─────
function Cat({c,lg}){
  const a=c==="A";
  return <span style={{padding:lg?"5px 16px":"3px 10px",borderRadius:99,fontSize:lg?13:10,fontWeight:800,letterSpacing:1,background:a?"rgba(16,185,129,.12)":"rgba(100,116,139,.12)",color:a?"#34d399":"#94a3b8",border:`1px solid ${a?"rgba(16,185,129,.25)":"rgba(100,116,139,.2)"}`,whiteSpace:"nowrap"}}>{a?"★ ELITE":"ESTÁNDAR"}</span>;
}

function KPI({label,value,sub,accent,icon}){
  return <div style={{background:"linear-gradient(135deg,rgba(15,23,42,.95),rgba(15,23,42,.8))",borderRadius:14,padding:"18px 20px",border:"1px solid rgba(51,65,85,.4)",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:`${accent||"#3b82f6"}08`}}/>
    <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>{icon&&<span style={{fontSize:14}}>{icon}</span>}{label}</div>
    <div style={{fontSize:28,fontWeight:900,color:accent||"#f1f5f9",letterSpacing:-.5,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:"#475569",marginTop:4}}>{sub}</div>}
  </div>;
}

function HBar({data,color="#3b82f6"}){
  if(!data.length) return null;
  const mx = Math.max(...data.map(d=>d.v),1);
  return <div style={{display:"flex",flexDirection:"column",gap:4,padding:"4px 0"}}>
    {data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:10,color:"#64748b",width:120,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}}>{d.l}</span>
      <div style={{flex:1,height:20,background:"rgba(30,48,72,.4)",borderRadius:4,overflow:"hidden",position:"relative"}}>
        <div style={{height:"100%",background:`linear-gradient(90deg,${color},${color}aa)`,borderRadius:4,width:`${Math.max(2,(d.v/mx)*100)}%`,transition:"width .6s ease"}}/>
        <span style={{position:"absolute",right:6,top:2,fontSize:10,fontWeight:700,color:"#e2e8f0"}}>{typeof d.v==="number"?N(d.v):d.v}</span>
      </div>
    </div>)}
  </div>;
}

// Tarjeta de scorecard grande (para dashboard) — clic abre detalle
function ScoreCard({person,score,n,mt,onClick}){
  const c = score===null?"#475569":score>=85?"#10b981":score>=60?"#f59e0b":"#ef4444";
  return <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"rgba(15,23,42,.6)",borderRadius:12,border:`1px solid ${c}25`,cursor:"pointer",textAlign:"left",width:"100%",transition:"all .2s",fontFamily:"inherit"}}
    onMouseEnter={e=>{e.currentTarget.style.background="rgba(15,23,42,.9)";e.currentTarget.style.transform="translateY(-2px)"}}
    onMouseLeave={e=>{e.currentTarget.style.background="rgba(15,23,42,.6)";e.currentTarget.style.transform="translateY(0)"}}>
    <div style={{width:54,height:54,borderRadius:12,background:`${c}15`,color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,flexShrink:0,border:`2px solid ${c}30`}}>{score!==null?score:"—"}</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13,fontWeight:800,color:"#f1f5f9",marginBottom:2}}>{person.name}</div>
      <div style={{fontSize:10,color:"#64748b",marginBottom:6}}>{n} inst · {N(mt)} mts</div>
      <Cat c={person.cat}/>
    </div>
  </button>;
}

// ═══════════════════════════════════════════════════════════
// ██ MAIN APP ██
// ═══════════════════════════════════════════════════════════
export default function App(){
  const [ok,setOk] = useState(false);
  const [inst,setInst] = useState([]);
  const [ayud,setAyud] = useState([]);
  const [recs,setRecs] = useState([]);
  const [scores,setScores] = useState({});       // scores instaladores
  const [scoresA,setScoresA] = useState({});     // scores ayudantes
  const [tab,setTab] = useState("dash");
  const [user,setUser] = useState(null);
  const [loginOpen,setLoginOpen] = useState(false);
  const [loginUser,setLoginUser] = useState("");
  const [loginPw,setLoginPw] = useState("");
  const [loginErr,setLoginErr] = useState("");
  const [mob,setMob] = useState(false);
  const [detailPerson,setDetailPerson] = useState(null); // {kind:'inst'|'ayud', person}

  useEffect(()=>{(async()=>{
    let i = await DB.get("fpc11-inst"), a = await DB.get("fpc11-ayud"), r = await DB.get("fpc11-r"), s = await DB.get("fpc11-s"), sa = await DB.get("fpc11-sa");
    if(!i||!i.length){i=INIT_INSTALADORES; await DB.set("fpc11-inst",i)}
    if(!a||!a.length){a=INIT_AYUDANTES; await DB.set("fpc11-ayud",a)}
    a = a.map(x=>x.cat?x:{...x,cat:"B"});
    setInst(i); setAyud(a); setRecs(r||[]); setScores(s||{}); setScoresA(sa||{}); setOk(true);
  })()},[]);

  const svI = useCallback(async v=>{setInst(v); await DB.set("fpc11-inst",v)},[]);
  const svA = useCallback(async v=>{setAyud(v); await DB.set("fpc11-ayud",v)},[]);
  const svR = useCallback(async v=>{setRecs(v); await DB.set("fpc11-r",v)},[]);
  const svS = useCallback(async v=>{setScores(v); await DB.set("fpc11-s",v)},[]);
  const svSA = useCallback(async v=>{setScoresA(v); await DB.set("fpc11-sa",v)},[]);

  // Resumen por instalador (por nombre, ya que el record guarda nombre)
  const bI = useMemo(()=>{
    const m={};
    recs.forEach(r=>{
      if(!m[r.i]) m[r.i]={mt:0,pi:0,pa:0,n:0,pr:{}};
      m[r.i].mt+=r.ml||0; m[r.i].pi+=r.pi||0; m[r.i].pa+=r.pa||0; m[r.i].n+=1;
      if(!m[r.i].pr[r.p]) m[r.i].pr[r.p]={mt:0,pi:0,pa:0,n:0};
      m[r.i].pr[r.p].mt+=r.ml||0; m[r.i].pr[r.p].pi+=r.pi||0; m[r.i].pr[r.p].pa+=r.pa||0; m[r.i].pr[r.p].n+=1;
    });
    return m;
  },[recs]);

  const bA = useMemo(()=>{
    const m={};
    recs.forEach(r=>{
      if(!r.a || r.a==="—") return;
      if(!m[r.a]) m[r.a]={mt:0,pa:0,n:0,pr:{}};
      m[r.a].mt+=r.ml||0; m[r.a].pa+=r.pa||0; m[r.a].n+=1;
      if(!m[r.a].pr[r.p]) m[r.a].pr[r.p]={mt:0,pa:0,n:0};
      m[r.a].pr[r.p].mt+=r.ml||0; m[r.a].pr[r.p].pa+=r.pa||0; m[r.a].pr[r.p].n+=1;
    });
    return m;
  },[recs]);

  const bP = useMemo(()=>{
    const m={};
    recs.forEach(r=>{
      if(!m[r.p]) m[r.p]={mt:0,pi:0,pa:0,n:0};
      m[r.p].mt+=r.ml||0; m[r.p].pi+=r.pi||0; m[r.p].pa+=r.pa||0; m[r.p].n+=1;
    });
    return m;
  },[recs]);

  const tMt = Object.values(bI).reduce((s,v)=>s+v.mt,0);
  const tPI = Object.values(bI).reduce((s,v)=>s+v.pi,0);
  const tPA = Object.values(bI).reduce((s,v)=>s+v.pa,0);

  const canMoney  = user?.canMoney  || false;
  const canEdit   = user?.canEdit   || false;
  const publicOnly= user?.publicOnly|| false;

  function doLogin(){
    const u = USERS[loginUser.toLowerCase().trim()];
    if(u && u.pw===loginPw){
      setUser({...u,uid:loginUser.toLowerCase().trim()});
      setLoginOpen(false); setLoginUser(""); setLoginPw(""); setLoginErr("");
      setTab("dash");
    } else setLoginErr("Usuario o contraseña incorrectos");
  }

  const TABS = [
    {id:"dash",ic:"◻",l:"Dashboard"},
    {id:"ing", ic:"✎",l:"Ingreso de Metros",edit:true},
    {id:"ri",  ic:"◈",l:"Resumen"},
    {id:"rp",  ic:"▤",l:"Resumen Producto"},
    {id:"sc",  ic:"◎",l:"Scorecard",edit:true},
    {id:"rep", ic:"📊",l:"Reportes Mensuales",money:true},
    {id:"adm", ic:"⚙",l:"Administración Personal",edit:true},
    {id:"tb",  ic:"▦",l:"Tablas de Pago"},
    {id:"pg",  ic:"$",l:"Pagos & Incentivos",money:true},
  ];
  const visTabs = TABS.filter(t=>{
    if(publicOnly) return t.id==="dash"; // solo dashboard
    if(t.money) return canMoney;
    if(t.edit) return canEdit || !user;
    return true;
  });

  useEffect(()=>{ if(publicOnly && tab!=="dash") setTab("dash") },[publicOnly,tab]);

  // ─── PANTALLA DE CARGA ───
  if(!ok) return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#020617 0%,#0a1628 40%,#0f172a 100%)",fontFamily:"'Inter',system-ui,sans-serif"}}>
    <div style={{textAlign:"center"}}>
      <img src="/logo-fpc.png" alt="FPC" style={{width:120,height:120,objectFit:"contain",marginBottom:20,opacity:.9}}/>
      <div style={{fontSize:13,fontWeight:700,letterSpacing:3,color:"#d97706",marginBottom:6}}>SOLUCIONES DECORATIVAS</div>
      <div style={{fontSize:11,color:"#475569",marginTop:12}}>Cargando sistema...</div>
    </div>
  </div>;

  // ─── PORTADA DE LOGIN (cuando no hay usuario logueado) ───
  if(!user) return <div style={{fontFamily:"'Inter',-apple-system,sans-serif",minHeight:"100vh",background:"linear-gradient(135deg,#020617 0%,#0a1628 40%,#0f172a 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0}
      @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes glow{0%,100%{opacity:.3}50%{opacity:.6}}
      @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      .login-card{animation:fadeIn .8s ease-out}
      .login-glow{position:absolute;width:400px;height:400px;border-radius:50%;filter:blur(120px);animation:glow 4s ease-in-out infinite}
      .login-inp{padding:14px 18px;border-radius:12px;border:1px solid rgba(51,65,85,.5);background:rgba(15,23,42,.8);color:#e2e8f0;font-size:14px;outline:none;width:100%;box-sizing:border-box;font-family:inherit;transition:all .3s}
      .login-inp:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.15)}
      .login-inp::placeholder{color:#475569}
      .login-btn{width:100%;padding:14px;border-radius:12px;border:none;font-size:14px;font-weight:800;cursor:pointer;transition:all .3s;font-family:inherit;letter-spacing:.5px;text-transform:uppercase}
    `}</style>

    {/* Glows decorativos */}
    <div className="login-glow" style={{top:-100,left:-100,background:"rgba(217,119,6,.08)"}}/>
    <div className="login-glow" style={{bottom:-100,right:-100,background:"rgba(37,99,235,.06)"}}/>

    <div className="login-card" style={{width:440,maxWidth:"100%",position:"relative",zIndex:1}}>
      {/* Logo y branding */}
      <div style={{textAlign:"center",marginBottom:36}}>
        <img src="/logo-fpc.png" alt="FPC Soluciones Decorativas" style={{width:160,height:160,objectFit:"contain",marginBottom:16,filter:"drop-shadow(0 8px 24px rgba(0,0,0,.4))"}}/>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:4,color:"#d97706",marginBottom:6}}>SOLUCIONES DECORATIVAS</div>
        <div style={{fontSize:22,fontWeight:900,color:"#f1f5f9",letterSpacing:-.5}}>Sistema de Control de Instalaciones</div>
      </div>

      {/* Formulario */}
      <div style={{background:"rgba(15,23,42,.6)",backdropFilter:"blur(20px)",borderRadius:20,padding:"36px 32px",border:"1px solid rgba(51,65,85,.3)",boxShadow:"0 25px 60px rgba(0,0,0,.5)"}}>
        <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",marginBottom:6}}>Iniciar Sesión</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:24}}>Ingrese sus credenciales para acceder</div>

        <div style={{marginBottom:16}}>
          <label style={{fontSize:10,fontWeight:700,color:"#94a3b8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Usuario</label>
          <input className="login-inp" value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="Ej: instalador, gerente, admin" autoFocus/>
        </div>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:10,fontWeight:700,color:"#94a3b8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Contraseña</label>
          <input className="login-inp" type="password" value={loginPw} onChange={e=>setLoginPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
        </div>

        {loginErr&&<div style={{fontSize:12,color:"#ef4444",marginBottom:16,padding:"10px 14px",background:"rgba(239,68,68,.1)",borderRadius:10,border:"1px solid rgba(239,68,68,.2)",textAlign:"center"}}>{loginErr}</div>}

        <button className="login-btn" onClick={doLogin} style={{background:"linear-gradient(135deg,#d97706,#b45309)",color:"#fff",boxShadow:"0 4px 20px rgba(217,119,6,.3)",marginBottom:16}}
          onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 8px 30px rgba(217,119,6,.4)"}}
          onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 4px 20px rgba(217,119,6,.3)"}}>
          Ingresar al Sistema
        </button>

        <div style={{fontSize:10,color:"#334155",textAlign:"center",lineHeight:1.7,marginTop:8}}>
          Sistema exclusivo para personal autorizado de Grupo FPC
        </div>
      </div>

      {/* Footer */}
      <div style={{textAlign:"center",marginTop:24}}>
        <div style={{fontSize:10,color:"#1e293b"}}>FPC Soluciones Decorativas © {new Date().getFullYear()}</div>
      </div>
    </div>
  </div>;

  const SB = {width:230,background:"linear-gradient(180deg,#080d19,#0f172a)",position:"fixed",top:0,left:0,bottom:0,zIndex:100,display:"flex",flexDirection:"column",borderRight:"1px solid rgba(30,48,72,.6)"};

  return <div style={{fontFamily:"'Inter',-apple-system,sans-serif",background:"#060a13",minHeight:"100vh",color:"#e2e8f0"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0}
      ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-thumb{background:#1e3048;border-radius:10px}::-webkit-scrollbar-track{background:transparent}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .4s ease-out}
      @media(max-width:840px){.dsk{display:none!important}.mmn{margin-left:0!important}}
      @media(min-width:841px){.mbo{display:none!important}.mbb{display:none!important}}
      input:focus,select:focus,textarea:focus{border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.15)!important}
      tr:hover td{background:rgba(30,48,72,.15)!important}
      .card{background:rgba(15,23,42,.7);border:1px solid rgba(30,48,72,.5);border-radius:14px;overflow:hidden}
      .card-h{padding:16px 20px;border-bottom:1px solid rgba(30,48,72,.5);font-size:14px;font-weight:700;color:#f1f5f9;display:flex;align-items:center;gap:8px}
      .inp,.sel,.txa{padding:10px 14px;border-radius:10px;border:1px solid rgba(51,65,85,.5);background:rgba(15,23,42,.6);color:#e2e8f0;font-size:13px;outline:none;width:100%;box-sizing:border-box;font-family:inherit}
      .txa{min-height:60px;resize:vertical}
      .btn{padding:10px 22px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.3px;font-family:inherit}
      .bp{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff}.bp:hover{transform:translateY(-1px)}
      .bs{background:linear-gradient(135deg,#059669,#047857);color:#fff}.bs:hover{transform:translateY(-1px)}
      .bd{background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff}.bd:hover{transform:translateY(-1px)}
      .bg{background:transparent;color:#94a3b8;border:1px solid rgba(51,65,85,.5)}.bg:hover{background:rgba(30,48,72,.3)}
      .th{padding:10px 14px;text-align:left;font-weight:700;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid rgba(30,48,72,.5);white-space:nowrap;background:rgba(12,20,36,.6)}
      .td{padding:10px 14px;border-bottom:1px solid rgba(30,48,72,.2);white-space:nowrap;font-size:12.5px}
      select option{background:#0f172a;color:#e2e8f0}
      .pill{padding:8px 16px;border-radius:10px;border:1px solid rgba(51,65,85,.4);background:transparent;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit}
      .pill.on{background:rgba(37,99,235,.12);border-color:rgba(37,99,235,.4);color:#60a5fa}
      .plus{width:38px;height:38px;border-radius:10px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);color:#34d399;font-size:18px;font-weight:900;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s}
      .plus:hover{background:rgba(16,185,129,.2)}
      .clickName{cursor:pointer;color:#f1f5f9;font-weight:700;text-decoration:none;border-bottom:1px dashed transparent;transition:all .2s}
      .clickName:hover{color:#60a5fa;border-bottom-color:#60a5fa}
      .modalBg{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);padding:20px}
    `}</style>

    {/* SIDEBAR */}
    <div className="dsk" style={SB}>
      <div style={{padding:"20px 16px 16px",textAlign:"center",borderBottom:"1px solid rgba(30,48,72,.3)"}}>
        <img src="/logo-fpc.png" alt="FPC" style={{width:60,height:60,objectFit:"contain",marginBottom:8,opacity:.85}}/>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#d97706",marginBottom:2}}>SOLUCIONES DECORATIVAS</div>
        <div style={{fontSize:12,fontWeight:800,color:"#f1f5f9",lineHeight:1.2}}>Control de Instalaciones</div>
      </div>
      <div style={{padding:"8px 10px",flex:1,overflowY:"auto"}}>
        {visTabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:tab===t.id?"rgba(37,99,235,.12)":"transparent",color:tab===t.id?"#60a5fa":"#64748b",fontSize:12.5,fontWeight:tab===t.id?700:500,cursor:"pointer",marginBottom:2,textAlign:"left",fontFamily:"inherit"}}>
          <span style={{width:20,textAlign:"center",fontSize:13,opacity:.7}}>{t.ic}</span>{t.l}
          {t.money&&<span style={{marginLeft:"auto",fontSize:9,background:"rgba(245,158,11,.15)",color:"#fbbf24",padding:"2px 6px",borderRadius:99}}>🔒</span>}
        </button>)}
      </div>
      <div style={{padding:"14px 14px",borderTop:"1px solid rgba(30,48,72,.4)"}}>
        <div style={{fontSize:11,color:"#34d399",fontWeight:600,marginBottom:4}}>● {user.name}</div>
        <button onClick={()=>{setUser(null);setLoginUser("");setLoginPw("");setLoginErr("")}} style={{width:"100%",padding:"6px 10px",borderRadius:8,border:"1px solid rgba(51,65,85,.4)",background:"transparent",color:"#64748b",fontSize:11,cursor:"pointer"}}>Cerrar sesión</button>
        <div style={{fontSize:9,color:"#334155",marginTop:8}}>{recs.length} reg · {inst.length} inst · {ayud.length} ayud</div>
      </div>
    </div>

    {/* MOBILE NAV */}
    {mob&&<div className="mbo" style={{position:"fixed",inset:0,zIndex:200}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)"}} onClick={()=>setMob(false)}/>
      <div style={{...SB,position:"relative",zIndex:1,width:270}}>
        <div style={{padding:"20px 16px"}}><div style={{fontSize:10,fontWeight:800,letterSpacing:4,color:"#3b82f6"}}>GRUPO FPC</div><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>Control Instalaciones</div></div>
        <div style={{padding:"0 8px",flex:1,overflow:"auto"}}>{visTabs.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setMob(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,border:"none",background:tab===t.id?"rgba(37,99,235,.12)":"transparent",color:tab===t.id?"#60a5fa":"#64748b",fontSize:13,fontWeight:tab===t.id?700:500,cursor:"pointer",textAlign:"left"}}><span style={{width:20,textAlign:"center"}}>{t.ic}</span>{t.l}</button>)}</div>
      </div>
    </div>}

    {/* DETAIL MODAL — clic en nombre del scorecard */}
    {detailPerson && <PersonDetailModal
      kind={detailPerson.kind}
      person={detailPerson.person}
      scores={detailPerson.kind==="inst"?scores:scoresA}
      bData={detailPerson.kind==="inst"?bI[detailPerson.person.name]:bA[detailPerson.person.name]}
      onClose={()=>setDetailPerson(null)}
    />}

    {/* MAIN */}
    <div className="mmn" style={{marginLeft:230,minHeight:"100vh"}}>
      <div style={{background:"rgba(8,13,25,.9)",borderBottom:"1px solid rgba(30,48,72,.4)",padding:"10px 24px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50}}>
        <button className="mbb" onClick={()=>setMob(true)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:20,padding:4}}>☰</button>
        <div style={{flex:1}}/>
        <span style={{fontSize:11,color:"#34d399",background:"rgba(5,150,105,.1)",padding:"4px 12px",borderRadius:99,border:"1px solid rgba(5,150,105,.2)",fontWeight:600}}>● {user.name}</span>
        <span style={{fontSize:11,color:"#334155"}}>{new Date().toLocaleDateString("es-GT",{day:"numeric",month:"long",year:"numeric"})}</span>
      </div>

      <div style={{padding:"24px 28px",maxWidth:1440,margin:"0 auto"}} className="fu">
        {tab==="dash" && <DashV inst={inst} ayud={ayud} bI={bI} bA={bA} bP={bP} tMt={tMt} tN={recs.length} cm={canMoney} tPI={tPI} tPA={tPA} scores={scores} scoresA={scoresA} publicOnly={publicOnly} onPersonClick={(kind,person)=>setDetailPerson({kind,person})}/>}
        {tab==="ing"  && !publicOnly && <IngV inst={inst} ayud={ayud} svI={svI} svA={svA} recs={recs} svR={svR} canEdit={canEdit} user={user}/>}
        {tab==="ri"   && !publicOnly && <ResumenV inst={inst} ayud={ayud} bI={bI} bA={bA} recs={recs} cm={canMoney}/>}
        {tab==="rp"   && !publicOnly && <RPV bP={bP} cm={canMoney}/>}
        {tab==="sc"   && !publicOnly && <SCV inst={inst} ayud={ayud} scores={scores} svS={svS} scoresA={scoresA} svSA={svSA} bI={bI} bA={bA} canEdit={canEdit}/>}
        {tab==="adm"  && !publicOnly && <AdminV inst={inst} svI={svI} ayud={ayud} svA={svA} canEdit={canEdit} scores={scores} scoresA={scoresA}/>}
        {tab==="rep"  && canMoney && <ReportV inst={inst} ayud={ayud} recs={recs}/>}
        {tab==="tb"   && !publicOnly && <TBV/>}
        {tab==="pg"   && canMoney && <PGV inst={inst} ayud={ayud} bI={bI} bA={bA}/>}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// MODAL DETALLE DE PERSONA — clic en nombre del scorecard
// Muestra el desglose del score con eventos documentados
// ═══════════════════════════════════════════════════════════
function PersonDetailModal({kind,person,scores,bData,onClose}){
  const score = getScore(scores, person.id, [person]);
  const c = score===null?"#475569":score>=85?"#10b981":score>=60?"#f59e0b":"#ef4444";

  return <div className="modalBg" onClick={onClose}>
    <div className="card" style={{padding:0,width:760,maxWidth:"95vw",maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(30,48,72,.5)",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,background:"rgba(15,23,42,.95)",zIndex:5}}>
        <div style={{width:62,height:62,borderRadius:14,background:`${c}15`,color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,border:`2px solid ${c}30`,flexShrink:0}}>{score!==null?score:"—"}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase"}}>{kind==="inst"?"Instalador":"Ayudante"}</div>
          <div style={{fontSize:18,fontWeight:900,color:"#f1f5f9",marginBottom:4}}>{person.name}</div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <Cat c={person.cat} lg/>
            {bData&&<span style={{fontSize:11,color:"#64748b"}}>{bData.n} instalaciones · {N(bData.mt)} mts</span>}
          </div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:24,cursor:"pointer",padding:4}}>✕</button>
      </div>

      <div style={{padding:"20px 24px"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",marginBottom:12}}>Detalle del Scorecard</div>
        <div style={{fontSize:11,color:"#64748b",marginBottom:14,padding:"10px 14px",background:"rgba(15,23,42,.4)",borderRadius:8,lineHeight:1.6}}>
          Aquí puedes ver cada criterio evaluado y, en los criterios donde tuviste eventos negativos, el detalle de qué cotización, fecha y cliente afectó tu puntaje.
        </div>

        {CRIT.map(crit=>{
          const v = getCritValue(scores, person.id, crit.id);
          const events = getCritEvents(scores, person.id, crit.id);
          const mx = person.cat==="A"?crit.A:crit.B;
          let ic="⚪", cl="#475569", st="Sin evaluar";
          if(v!==undefined){
            if(v===0){ic="🟢";cl="#10b981";st="Cero eventos — Excelente"}
            else if(v<=mx){ic="🟡";cl="#f59e0b";st=`${v} evento(s) — Dentro del límite`}
            else{ic="🔴";cl="#ef4444";st=`${v} evento(s) — Excede límite (máx ${mx})`}
          }
          return <div key={crit.id} style={{marginBottom:10,padding:"12px 14px",background:"rgba(15,23,42,.5)",borderRadius:10,border:`1px solid ${cl}20`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:events.length?8:0}}>
              <span style={{fontSize:18,flexShrink:0}}>{ic}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{crit.l}</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{crit.d}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:700,color:cl}}>{st}</div>
                <div style={{fontSize:10,color:"#475569"}}>Meta: máx {mx} eventos</div>
              </div>
            </div>
            {events.length>0 && <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(30,48,72,.4)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Eventos documentados ({events.length})</div>
              {events.map((ev,i)=><div key={i} style={{padding:"8px 10px",background:"rgba(8,13,25,.6)",borderRadius:8,marginBottom:6,fontSize:11,borderLeft:`2px solid ${cl}`}}>
                <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:ev.descripcion?6:0}}>
                  <span style={{color:"#94a3b8"}}>📅 <b style={{color:"#cbd5e1"}}>{ev.date||"—"}</b></span>
                  {ev.coti && <span style={{color:"#94a3b8"}}>📋 Coti: <b style={{color:"#60a5fa"}}>{ev.coti}</b></span>}
                  {ev.cliente && <span style={{color:"#94a3b8"}}>👤 <b style={{color:"#cbd5e1"}}>{ev.cliente}</b></span>}
                </div>
                {ev.descripcion && <div style={{color:"#94a3b8",fontSize:11,fontStyle:"italic",lineHeight:1.5}}>"{ev.descripcion}"</div>}
              </div>)}
            </div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD — con scorecards grandes de instaladores y ayudantes
// ═══════════════════════════════════════════════════════════
function DashV({inst,ayud,bI,bA,bP,tMt,tN,cm,tPI,tPA,scores,scoresA,publicOnly,onPersonClick}){
  const cA=inst.filter(t=>t.cat==="A"&&t.on).length;
  const cB=inst.filter(t=>t.cat==="B"&&t.on).length;
  const topI=Object.entries(bI).sort((a,b)=>b[1].mt-a[1].mt).slice(0,8);
  const topP=Object.entries(bP).sort((a,b)=>b[1].mt-a[1].mt).slice(0,10);

  const scInst = inst.filter(t=>t.on).map(t=>({...t,score:getScore(scores,t.id,inst),mt:bI[t.name]?.mt||0,n:bI[t.name]?.n||0})).sort((a,b)=>(b.score!==null?b.score:-1)-(a.score!==null?a.score:-1));
  const scAyud = ayud.filter(t=>t.on).map(t=>({...t,score:getScore(scoresA,t.id,ayud),mt:bA[t.name]?.mt||0,n:bA[t.name]?.n||0})).sort((a,b)=>(b.score!==null?b.score:-1)-(a.score!==null?a.score:-1));

  return <div>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:10,fontWeight:800,letterSpacing:3,color:"#3b82f6",marginBottom:4}}>GRUPO FPC</div>
      <h1 style={{fontSize:26,fontWeight:900,color:"#f1f5f9",margin:0}}>{publicOnly?"Dashboard de Equipo":"Dashboard Ejecutivo"}</h1>
      {publicOnly && <p style={{fontSize:13,color:"#64748b",margin:"6px 0 0"}}>Haz clic en tu nombre para ver el detalle de tu scorecard</p>}
    </div>

    {!publicOnly && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:12,marginBottom:22}}>
      <KPI label="Instaladores" value={inst.filter(t=>t.on).length} accent="#60a5fa" icon="◈"/>
      <KPI label="Ayudantes" value={ayud.filter(t=>t.on).length} accent="#60a5fa" icon="◇"/>
      <KPI label="Inst. Cat A" value={cA} sub={`${cA+cB?Math.round(cA/(cA+cB)*100):0}% elite`} accent="#10b981" icon="★"/>
      <KPI label="Inst. Cat B" value={cB} accent="#94a3b8" icon="◇"/>
      <KPI label="Instalaciones" value={tN.toLocaleString()} accent="#f1f5f9" icon="✎"/>
      <KPI label="Metros Totales" value={N(tMt)} accent="#f1f5f9" icon="▤"/>
      {cm&&<KPI label="Pago Total" value={Q(tPI+tPA)} accent="#fbbf24" icon="$"/>}
    </div>}

    {/* SCORECARD INSTALADORES — más grande, con click */}
    <div className="card" style={{marginBottom:18}}>
      <div className="card-h"><span style={{color:"#60a5fa"}}>◈</span> Scorecard Instaladores <span style={{fontSize:11,fontWeight:400,color:"#64748b",marginLeft:8}}>(Clic en cada nombre para ver detalle)</span></div>
      <div style={{padding:18}}>
        {scInst.length?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {scInst.map(t=><ScoreCard key={t.id} person={t} score={t.score} n={t.n} mt={t.mt} onClick={()=>onPersonClick("inst",t)}/>)}
        </div>:<div style={{padding:30,textAlign:"center",color:"#334155",fontSize:13}}>Sin instaladores activos</div>}
      </div>
    </div>

    {/* SCORECARD AYUDANTES */}
    <div className="card" style={{marginBottom:18}}>
      <div className="card-h"><span style={{color:"#a78bfa"}}>◇</span> Scorecard Ayudantes <span style={{fontSize:11,fontWeight:400,color:"#64748b",marginLeft:8}}>(Clic en cada nombre para ver detalle)</span></div>
      <div style={{padding:18}}>
        {scAyud.length?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {scAyud.map(t=><ScoreCard key={t.id} person={t} score={t.score} n={t.n} mt={t.mt} onClick={()=>onPersonClick("ayud",t)}/>)}
        </div>:<div style={{padding:30,textAlign:"center",color:"#334155",fontSize:13}}>Sin ayudantes activos</div>}
      </div>
    </div>

    {!publicOnly && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
      <div className="card"><div className="card-h"><span style={{color:"#3b82f6"}}>◈</span> Ranking por Metros</div>
        <div style={{padding:"8px 20px 16px"}}>{topI.length?<HBar data={topI.map(([n,d])=>({l:n.split(" ").slice(0,2).join(" "),v:d.mt}))} color="#3b82f6"/>:<div style={{padding:30,textAlign:"center",color:"#334155",fontSize:12}}>Sin registros</div>}</div></div>
      <div className="card"><div className="card-h"><span style={{color:"#8b5cf6"}}>▤</span> Metros por Producto</div>
        <div style={{padding:"8px 20px 16px"}}>{topP.length?<HBar data={topP.map(([n,d])=>({l:n,v:d.mt}))} color="#8b5cf6"/>:<div style={{padding:30,textAlign:"center",color:"#334155",fontSize:12}}>Sin datos</div>}</div></div>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════
// INGRESO DE METROS — instalador y ayudante 100% independientes
// ═══════════════════════════════════════════════════════════
function IngV({inst,ayud,svI,svA,recs,svR,canEdit,user}){
  const aI = inst.filter(t=>t.on);
  const aA = ayud.filter(t=>t.on);
  const [selI,setSelI]=useState(""); const [selA,setSelA]=useState("");
  const [prod,setProd]=useState(""); const [mts,setMts]=useState(""); const [unis,setUnis]=useState("1");
  const [cot,setCot]=useState(""); const [cli,setCli]=useState(""); const [msg,setMsg]=useState("");
  const [addI,setAddI]=useState(false); const [addA,setAddA]=useState(false);
  const [newName,setNewName]=useState(""); const [newCat,setNewCat]=useState("B");

  const tI = aI.find(x=>x.name===selI);
  const tA = aA.find(x=>x.name===selA);
  const mn=parseFloat(mts)||0; const un=parseInt(unis)||1; const ml=+(mn*un).toFixed(2);
  const pay = prod&&tI ? cPay(prod,ml,tI.cat,tA?.cat||"B") : {pi:0,pa:0};

  function add(){
    if(!canEdit){setMsg("❌ Sin permisos");return}
    if(!selI||!prod||!mn){setMsg("❌ Seleccione instalador, producto y metros");return}
    svR([{id:Date.now().toString(36),dt:today(),co:cot.trim(),cl:cli.trim(),
      i:selI,a:selA||"—",cI:tI.cat,cA:tA?.cat||"B",p:prod,m:mn,u:un,ml,pi:pay.pi,pa:pay.pa,
      by:user?.name||"Sistema"},...recs]);
    setMsg(`✅ Registrado: ${selI} · ${prod} · ${N(ml)} mts`);
    setProd("");setMts("");setUnis("1");setCot("");setCli("");setTimeout(()=>setMsg(""),4000);
  }

  function doAddPerson(which){
    const n=newName.trim().toUpperCase(); if(!n)return;
    const item={id:(which==="i"?"I":"A")+Date.now().toString(36),name:n,cat:newCat,on:true};
    if(which==="i"){svI([...inst,item]);setSelI(n);setAddI(false)}
    else{svA([...ayud,item]);setSelA(n);setAddA(false)}
    setNewName("");setNewCat("B");
  }

  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Ingreso de Metros</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 20px"}}>Instalador y ayudante son independientes — los metros se asignan a quien tú elijas en cada registro</p>

    <div className="card" style={{marginBottom:18}}>
      <div className="card-h"><span style={{color:"#10b981"}}>✎</span> Nuevo Registro</div>
      <div style={{padding:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div>
            <label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Instalador *</label>
            <div style={{display:"flex",gap:8}}>
              <select className="sel" value={selI} onChange={e=>setSelI(e.target.value)}>
                <option value="">— Seleccionar —</option>
                {aI.map(x=><option key={x.id} value={x.name}>{x.name} {x.cat==="A"?"(★A)":"(B)"}</option>)}
              </select>
              {canEdit&&<button className="plus" onClick={()=>setAddI(true)} title="Agregar nuevo instalador">+</button>}
            </div>
            {addI&&<div style={{marginTop:8,padding:10,background:"rgba(15,23,42,.5)",borderRadius:8,display:"flex",gap:6,flexWrap:"wrap"}}>
              <input className="inp" style={{flex:2,minWidth:140}} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nombre completo"/>
              <select className="sel" style={{flex:1,minWidth:90}} value={newCat} onChange={e=>setNewCat(e.target.value)}><option value="B">Cat B</option><option value="A">Cat A</option></select>
              <button className="btn bs" style={{padding:"6px 12px",fontSize:11}} onClick={()=>doAddPerson("i")}>Agregar</button>
              <button className="btn bg" style={{padding:"6px 12px",fontSize:11}} onClick={()=>setAddI(false)}>Cancelar</button>
            </div>}
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Ayudante (opcional)</label>
            <div style={{display:"flex",gap:8}}>
              <select className="sel" value={selA} onChange={e=>setSelA(e.target.value)}>
                <option value="">— Sin ayudante —</option>
                {aA.map(x=><option key={x.id} value={x.name}>{x.name} {x.cat==="A"?"(★A)":"(B)"}</option>)}
              </select>
              {canEdit&&<button className="plus" onClick={()=>setAddA(true)} title="Agregar nuevo ayudante">+</button>}
            </div>
            {addA&&<div style={{marginTop:8,padding:10,background:"rgba(15,23,42,.5)",borderRadius:8,display:"flex",gap:6,flexWrap:"wrap"}}>
              <input className="inp" style={{flex:2,minWidth:140}} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nombre completo"/>
              <select className="sel" style={{flex:1,minWidth:90}} value={newCat} onChange={e=>setNewCat(e.target.value)}><option value="B">Cat B</option><option value="A">Cat A</option></select>
              <button className="btn bs" style={{padding:"6px 12px",fontSize:11}} onClick={()=>doAddPerson("a")}>Agregar</button>
              <button className="btn bg" style={{padding:"6px 12px",fontSize:11}} onClick={()=>setAddA(false)}>Cancelar</button>
            </div>}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Producto *</label>
            <select className="sel" value={prod} onChange={e=>setProd(e.target.value)}><option value="">— Seleccionar —</option>{PRODS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Metros *</label>
            <input className="inp" type="number" step="0.01" value={mts} onChange={e=>setMts(e.target.value)} placeholder="6.84"/></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Unidades</label>
            <input className="inp" type="number" value={unis} onChange={e=>setUnis(e.target.value)} placeholder="1"/></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Cotización</label><input className="inp" value={cot} onChange={e=>setCot(e.target.value)} placeholder="C02SA7830"/></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Cliente</label><input className="inp" value={cli} onChange={e=>setCli(e.target.value)} placeholder="Nombre"/></div>
        </div>

        {selI&&prod&&mn>0&&<div style={{background:"rgba(15,23,42,.5)",borderRadius:12,padding:14,marginBottom:16,border:"1px solid rgba(30,48,72,.4)",display:"flex",flexWrap:"wrap",gap:20,fontSize:12,alignItems:"center"}}>
          <div><span style={{color:"#475569",fontSize:10,textTransform:"uppercase"}}>Instalador</span><div style={{fontWeight:700,color:"#f1f5f9",fontSize:13,display:"flex",gap:6,alignItems:"center"}}>{selI} <Cat c={tI?.cat}/></div></div>
          <div><span style={{color:"#475569",fontSize:10,textTransform:"uppercase"}}>Ayudante</span><div style={{fontWeight:700,color:"#f1f5f9",fontSize:13,display:"flex",gap:6,alignItems:"center"}}>{selA||"—"} {tA&&<Cat c={tA.cat}/>}</div></div>
          <div><span style={{color:"#475569",fontSize:10,textTransform:"uppercase"}}>Metros</span><div style={{fontWeight:900,color:"#f1f5f9",fontSize:20}}>{N(ml)}</div></div>
          <div><span style={{color:"#475569",fontSize:10,textTransform:"uppercase"}}>Pago Inst</span><div style={{fontWeight:700,color:"#10b981",fontSize:14}}>{Q(pay.pi)}</div></div>
          <div><span style={{color:"#475569",fontSize:10,textTransform:"uppercase"}}>Pago Ayud</span><div style={{fontWeight:700,color:"#10b981",fontSize:14}}>{Q(pay.pa)}</div></div>
        </div>}

        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <button className="btn bs" onClick={add}>✓ Registrar</button>
          {msg&&<span style={{fontSize:12,color:msg[0]==="✅"?"#10b981":"#ef4444",fontWeight:600}}>{msg}</span>}
          {!canEdit&&!user&&<span style={{fontSize:11,color:"#f59e0b"}}>⚠ Inicie sesión para registrar</span>}
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-h" style={{justifyContent:"space-between"}}><span><span style={{color:"#64748b"}}>▤</span> Registros ({recs.length})</span>
        {recs.length>0&&canEdit&&<button className="btn bg" style={{fontSize:11,padding:"5px 12px"}} onClick={()=>{if(window.confirm("¿Eliminar TODOS los registros?"))svR([])}}>Limpiar todo</button>}</div>
      <div style={{overflowX:"auto",maxHeight:480}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
          {["Fecha","Cot","Cliente","Instalador","Ayudante","Producto","Mts","Cat I","Cat A",""].map(h=><th key={h} className="th" style={h==="Mts"?{textAlign:"right"}:{}}>{h}</th>)}
        </tr></thead><tbody>{recs.slice(0,30).map(r=><tr key={r.id}>
          <td className="td" style={{color:"#475569"}}>{r.dt}</td>
          <td className="td" style={{color:"#64748b"}}>{r.co||"—"}</td>
          <td className="td" style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis"}}>{r.cl||"—"}</td>
          <td className="td" style={{fontWeight:700}}>{r.i}</td>
          <td className="td" style={{color:"#94a3b8"}}>{r.a}</td>
          <td className="td" style={{color:"#60a5fa",fontWeight:600}}>{r.p}</td>
          <td className="td" style={{textAlign:"right",fontWeight:800,fontSize:13}}>{N(r.ml)}</td>
          <td className="td"><Cat c={r.cI||r.c||"B"}/></td>
          <td className="td"><Cat c={r.cA||"B"}/></td>
          <td className="td">{canEdit&&<button style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}} onClick={()=>svR(recs.filter(x=>x.id!==r.id))}>✕</button>}</td>
        </tr>)}</tbody></table>
        {!recs.length&&<div style={{padding:40,textAlign:"center",color:"#334155",fontSize:13}}>Sin registros</div>}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// RESUMEN — pestañas Instaladores / Ayudantes
// Click en nombre despliega cotización, cliente, producto, metros y valor
// ═══════════════════════════════════════════════════════════
function ResumenV({inst,ayud,bI,bA,recs,cm}){
  const [sub,setSub]=useState("inst");
  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 14px"}}>Resumen por Personal</h1>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      <button className={`pill ${sub==="inst"?"on":""}`} onClick={()=>setSub("inst")}>◈ Instaladores</button>
      <button className={`pill ${sub==="ayud"?"on":""}`} onClick={()=>setSub("ayud")}>◇ Ayudantes</button>
    </div>
    {sub==="inst" ? <RIV list={inst} bI={bI} recs={recs} cm={cm}/> : <RAyV list={ayud} bA={bA} recs={recs} cm={cm}/>}
  </div>;
}

function RIV({list,bI,recs,cm}){
  const [open,setOpen] = useState({});
  const s = Object.entries(bI).sort((a,b)=>b[1].mt-a[1].mt);
  const totN=s.reduce((a,x)=>a+x[1].n,0), totMt=s.reduce((a,x)=>a+x[1].mt,0);
  const totPI=s.reduce((a,x)=>a+x[1].pi,0), totPA=s.reduce((a,x)=>a+x[1].pa,0);

  return <div className="card">
    <div className="card-h"><span style={{color:"#60a5fa"}}>◈</span> Instaladores <span style={{fontSize:11,fontWeight:400,color:"#64748b",marginLeft:8}}>(Clic en el nombre para ver el detalle)</span></div>
    <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>
        {["#","Instalador","Cat","Inst.","Mts Lineales",...(cm?["Q Inst","Q Ayud","Q Total"]:[])].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}
      </tr></thead>
      <tbody>
      {s.map(([n,d],i)=>{
        const t=list.find(x=>x.name===n);
        const isOpen = open[n];
        const myRecs = recs.filter(r=>r.i===n);
        return <Fragment key={n}>
          <tr>
            <td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td>
            <td className="td"><span className="clickName" onClick={()=>setOpen({...open,[n]:!isOpen})}>{isOpen?"▼ ":"▶ "}{n}</span></td>
            <td className="td">{t&&<Cat c={t.cat}/>}</td>
            <td className="td" style={{textAlign:"right"}}>{d.n}</td>
            <td className="td" style={{textAlign:"right",fontWeight:800,color:"#60a5fa",fontSize:13}}>{N(d.mt)}</td>
            {cm&&<>
              <td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:600}}>{Q(d.pi)}</td>
              <td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pa)}</td>
              <td className="td" style={{textAlign:"right",fontWeight:800,color:"#fbbf24"}}>{Q(d.pi+d.pa)}</td>
            </>}
          </tr>
          {isOpen && <tr key={n+"-d"}>
            <td colSpan={cm?8:5} style={{padding:0,background:"rgba(8,13,25,.5)"}}>
              <div style={{padding:"14px 20px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Detalle de Instalaciones de {n}</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
                  <thead><tr>
                    {["Fecha","Cotización","Cliente","Producto","Mts",...(cm?["Q Inst","Q Ayud"]:[])].map((h,i)=><th key={h} style={{padding:"7px 10px",textAlign:i>=4?"right":"left",color:"#64748b",fontSize:10,fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid rgba(30,48,72,.5)",background:"rgba(12,20,36,.4)"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                  {myRecs.map(r=><tr key={r.id}>
                    <td style={{padding:"6px 10px",color:"#94a3b8",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.dt}</td>
                    <td style={{padding:"6px 10px",color:"#cbd5e1",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.co||"—"}</td>
                    <td style={{padding:"6px 10px",color:"#cbd5e1",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.cl||"—"}</td>
                    <td style={{padding:"6px 10px",color:"#60a5fa",fontWeight:600,borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.p}</td>
                    <td style={{padding:"6px 10px",textAlign:"right",fontWeight:700,color:"#f1f5f9",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{N(r.ml)}</td>
                    {cm&&<>
                      <td style={{padding:"6px 10px",textAlign:"right",color:"#10b981",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{Q(r.pi)}</td>
                      <td style={{padding:"6px 10px",textAlign:"right",color:"#10b981",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{Q(r.pa)}</td>
                    </>}
                  </tr>)}
                  {!myRecs.length && <tr><td colSpan={cm?7:5} style={{padding:14,textAlign:"center",color:"#475569",fontSize:11}}>Sin registros</td></tr>}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>}
        </Fragment>;
      })}
      {s.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
        <td className="td" colSpan={3} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL</td>
        <td className="td" style={{textAlign:"right",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{totN}</td>
        <td className="td" style={{textAlign:"right",fontWeight:900,color:"#60a5fa",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(totMt)}</td>
        {cm&&<>
          <td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPI)}</td>
          <td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPA)}</td>
          <td className="td" style={{textAlign:"right",fontWeight:900,color:"#fbbf24",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPI+totPA)}</td>
        </>}
      </tr>}
      </tbody>
    </table>
    {!s.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin registros</div>}
    </div>
  </div>;
}

function RAyV({list,bA,recs,cm}){
  const [open,setOpen] = useState({});
  const s = Object.entries(bA).sort((a,b)=>b[1].mt-a[1].mt);
  const totN=s.reduce((a,x)=>a+x[1].n,0), totMt=s.reduce((a,x)=>a+x[1].mt,0);
  const totPA=s.reduce((a,x)=>a+x[1].pa,0);

  return <div className="card">
    <div className="card-h"><span style={{color:"#a78bfa"}}>◇</span> Ayudantes <span style={{fontSize:11,fontWeight:400,color:"#64748b",marginLeft:8}}>(Clic en el nombre para ver el detalle)</span></div>
    <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>
        {["#","Ayudante","Cat","Inst.","Mts Lineales",...(cm?["Q Pago"]:[])].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}
      </tr></thead>
      <tbody>
      {s.map(([n,d],i)=>{
        const t=list.find(x=>x.name===n);
        const isOpen=open[n];
        const myRecs = recs.filter(r=>r.a===n);
        return <Fragment key={n}>
          <tr>
            <td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td>
            <td className="td"><span className="clickName" onClick={()=>setOpen({...open,[n]:!isOpen})}>{isOpen?"▼ ":"▶ "}{n}</span></td>
            <td className="td">{t&&<Cat c={t.cat}/>}</td>
            <td className="td" style={{textAlign:"right"}}>{d.n}</td>
            <td className="td" style={{textAlign:"right",fontWeight:800,color:"#a78bfa",fontSize:13}}>{N(d.mt)}</td>
            {cm&&<td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981"}}>{Q(d.pa)}</td>}
          </tr>
          {isOpen && <tr key={n+"-d"}>
            <td colSpan={cm?6:5} style={{padding:0,background:"rgba(8,13,25,.5)"}}>
              <div style={{padding:"14px 20px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Detalle — {n} (con qué instalador trabajó cada vez)</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
                  <thead><tr>
                    {["Fecha","Cotización","Cliente","Instalador","Producto","Mts",...(cm?["Q Pago"]:[])].map((h,i)=><th key={h} style={{padding:"7px 10px",textAlign:i>=5?"right":"left",color:"#64748b",fontSize:10,fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid rgba(30,48,72,.5)",background:"rgba(12,20,36,.4)"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                  {myRecs.map(r=><tr key={r.id}>
                    <td style={{padding:"6px 10px",color:"#94a3b8",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.dt}</td>
                    <td style={{padding:"6px 10px",color:"#cbd5e1",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.co||"—"}</td>
                    <td style={{padding:"6px 10px",color:"#cbd5e1",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.cl||"—"}</td>
                    <td style={{padding:"6px 10px",color:"#cbd5e1",fontWeight:600,borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.i}</td>
                    <td style={{padding:"6px 10px",color:"#a78bfa",fontWeight:600,borderBottom:"1px solid rgba(30,48,72,.2)"}}>{r.p}</td>
                    <td style={{padding:"6px 10px",textAlign:"right",fontWeight:700,color:"#f1f5f9",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{N(r.ml)}</td>
                    {cm&&<td style={{padding:"6px 10px",textAlign:"right",color:"#10b981",borderBottom:"1px solid rgba(30,48,72,.2)"}}>{Q(r.pa)}</td>}
                  </tr>)}
                  {!myRecs.length && <tr><td colSpan={cm?7:6} style={{padding:14,textAlign:"center",color:"#475569",fontSize:11}}>Sin registros</td></tr>}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>}
        </Fragment>;
      })}
      {s.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
        <td className="td" colSpan={3} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL</td>
        <td className="td" style={{textAlign:"right",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{totN}</td>
        <td className="td" style={{textAlign:"right",fontWeight:900,color:"#a78bfa",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(totMt)}</td>
        {cm&&<td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPA)}</td>}
      </tr>}
      </tbody>
    </table>
    {!s.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin registros</div>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// RESUMEN PRODUCTO
// ═══════════════════════════════════════════════════════════
function RPV({bP,cm}){
  const s=Object.entries(bP).sort((a,b)=>b[1].mt-a[1].mt);
  const totN=s.reduce((a,x)=>a+x[1].n,0), totMt=s.reduce((a,x)=>a+x[1].mt,0);
  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 20px"}}>Resumen por Producto</h1>
    <div className="card"><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>{["#","Producto","Cantidad","Mts Lineales",...(cm?["Q Inst","Q Ayud"]:[])].map((h,i)=><th key={h} className="th" style={i>=2?{textAlign:"right"}:{}}>{h}</th>)}</tr></thead>
      <tbody>
      {s.map(([n,d],i)=><tr key={n}>
        <td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td>
        <td className="td" style={{fontWeight:700}}>{n}</td>
        <td className="td" style={{textAlign:"right"}}>{d.n}</td>
        <td className="td" style={{textAlign:"right",fontWeight:800,color:"#60a5fa",fontSize:13}}>{N(d.mt)}</td>
        {cm&&<><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pi)}</td><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pa)}</td></>}
      </tr>)}
      {s.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
        <td className="td" colSpan={2} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL</td>
        <td className="td" style={{textAlign:"right",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{totN}</td>
        <td className="td" style={{textAlign:"right",fontWeight:900,color:"#60a5fa",borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(totMt)}</td>
        {cm&&<>
          <td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(s.reduce((a,x)=>a+x[1].pi,0))}</td>
          <td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(s.reduce((a,x)=>a+x[1].pa,0))}</td>
        </>}
      </tr>}
      </tbody></table>
      {!s.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin datos</div>}
    </div></div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// SCORECARD — Instaladores y Ayudantes con eventos documentados
// Cada criterio cuenta puede registrar EVENTOS con fecha/coti/cliente/descripción
// ═══════════════════════════════════════════════════════════
function SCV({inst,ayud,scores,svS,scoresA,svSA,bI,bA,canEdit}){
  const [sub,setSub]=useState("inst");
  const list = sub==="inst"?inst:ayud;
  const sd = sub==="inst"?scores:scoresA;
  const sv = sub==="inst"?svS:svSA;
  const summary = sub==="inst"?bI:bA;

  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 6px"}}>Scorecard de Cumplimiento</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 14px"}}>Documenta cada error o evento con cotización, fecha, cliente y descripción</p>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      <button className={`pill ${sub==="inst"?"on":""}`} onClick={()=>setSub("inst")}>◈ Instaladores</button>
      <button className={`pill ${sub==="ayud"?"on":""}`} onClick={()=>setSub("ayud")}>◇ Ayudantes</button>
    </div>
    <SCEditor list={list.filter(t=>t.on)} sd={sd} svSd={sv} summary={summary} canEdit={canEdit} kind={sub}/>
  </div>;
}

function SCEditor({list,sd,svSd,summary,canEdit,kind}){
  const [sel,setSel] = useState("");
  const tm = list.find(t=>t.id===sel);
  const ov = sel ? getScore(sd, sel, list) : null;
  const oc = ov===null?"#475569":ov>=85?"#10b981":ov>=60?"#f59e0b":"#ef4444";

  // Estado para form de evento nuevo
  const [evtCrit,setEvtCrit] = useState(null); // crit object
  const [evtDate,setEvtDate] = useState(today());
  const [evtCoti,setEvtCoti] = useState("");
  const [evtCli,setEvtCli] = useState("");
  const [evtDesc,setEvtDesc] = useState("");

  function setRawValue(cid, val){
    if(!canEdit||!sel) return;
    const cur = sd[sel]?.[cid];
    let next;
    if(typeof cur === "object" && cur !== null){
      next = {...cur, value: parseInt(val)||0};
    } else {
      next = {value: parseInt(val)||0, events: []};
    }
    svSd({...sd, [sel]: {...(sd[sel]||{}), [cid]: next}});
  }

  function addEvent(){
    if(!canEdit||!sel||!evtCrit) return;
    const cur = sd[sel]?.[evtCrit.id];
    let curObj;
    if(typeof cur === "object" && cur !== null){
      curObj = cur;
    } else {
      curObj = {value: typeof cur === "number"?cur:0, events: []};
    }
    const newEvents = [...(curObj.events||[]), {date:evtDate,coti:evtCoti.trim(),cliente:evtCli.trim(),descripcion:evtDesc.trim()}];
    // Si es criterio "cnt" (contador de errores), incrementar value automáticamente
    const newValue = evtCrit.cnt ? newEvents.length : curObj.value;
    svSd({...sd, [sel]: {...(sd[sel]||{}), [evtCrit.id]: {value:newValue, events:newEvents}}});
    setEvtCrit(null); setEvtCoti(""); setEvtCli(""); setEvtDesc(""); setEvtDate(today());
  }

  function removeEvent(cid, idx){
    if(!canEdit||!sel) return;
    const cur = sd[sel]?.[cid];
    if(!cur || typeof cur !== "object") return;
    const newEvents = (cur.events||[]).filter((_,i)=>i!==idx);
    const crit = CRIT.find(c=>c.id===cid);
    const newValue = crit?.cnt ? newEvents.length : cur.value;
    svSd({...sd, [sel]: {...(sd[sel]||{}), [cid]: {value:newValue, events:newEvents}}});
  }

  return <div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:18}}>
      {list.map(t=>{
        const o=getScore(sd,t.id,list);
        const c=o===null?"#475569":o>=85?"#10b981":o>=60?"#f59e0b":"#ef4444";
        return <button key={t.id} onClick={()=>setSel(t.id)} style={{padding:"8px 14px",borderRadius:10,border:sel===t.id?`2px solid ${c}`:"1px solid rgba(51,65,85,.3)",background:sel===t.id?`${c}10`:"transparent",color:sel===t.id?"#f1f5f9":"#94a3b8",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>
          <span style={{fontWeight:700}}>{t.name.split(" ")[0]}</span>
          {o!==null&&<span style={{background:`${c}18`,color:c,padding:"2px 7px",borderRadius:99,fontSize:10,fontWeight:800}}>{o}</span>}
        </button>;
      })}
    </div>

    {sel&&tm?<div>
      <div className="card" style={{marginBottom:14}}><div style={{padding:18,display:"flex",flexWrap:"wrap",gap:16,alignItems:"center"}}>
        <div style={{width:56,height:56,borderRadius:12,background:`${oc}12`,border:`2px solid ${oc}30`,color:oc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900}}>{ov!==null?ov:"—"}</div>
        <div style={{flex:1,minWidth:180}}>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>{kind==="inst"?"Instalador":"Ayudante"}</div>
          <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{tm.name}</div>
        </div>
        <Cat c={tm.cat} lg/>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:.5}}>Metros</div>
          <div style={{fontSize:20,fontWeight:900,color:"#60a5fa"}}>{N(summary[tm.name]?.mt||0)}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:.5}}>Instalaciones</div>
          <div style={{fontSize:20,fontWeight:900,color:"#f1f5f9"}}>{summary[tm.name]?.n||0}</div>
        </div>
      </div></div>

      <div className="card">
        <div className="card-h"><span style={{color:oc}}>◎</span> Criterios — Categoría {tm.cat} ({tm.cat==="A"?"Cero tolerancia":"Tolerancia limitada"})</div>
        <div>
        {CRIT.map(c=>{
          const v = getCritValue(sd, sel, c.id);
          const events = getCritEvents(sd, sel, c.id);
          const mx = tm.cat==="A"?c.A:c.B;
          let ic="⚪",cl="#475569";
          if(v!==undefined){
            if(c.cnt){ic=v===0?"🟢":v<=mx?"🟡":"🔴"; cl=v===0?"#10b981":v<=mx?"#f59e0b":"#ef4444"}
            else{ic=v>=mx?"🟢":v>=mx*.8?"🟡":"🔴"; cl=v>=mx?"#10b981":v>=mx*.8?"#f59e0b":"#ef4444"}
          }
          return <div key={c.id} style={{padding:"14px 18px",borderBottom:"1px solid rgba(30,48,72,.3)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:18,flexShrink:0}}>{ic}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{c.l}</div>
                <div style={{fontSize:11,color:"#475569"}}>{c.d} · Meta: máx {mx} eventos</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:11,color:"#64748b"}}>Eventos:</span>
                <span style={{minWidth:40,textAlign:"center",fontSize:18,fontWeight:900,color:cl}}>{events.length||(v||0)}</span>
                {canEdit&&<button className="btn bp" style={{padding:"6px 12px",fontSize:11}} onClick={()=>{setEvtCrit(c);setEvtDate(today())}}>+ Documentar</button>}
              </div>
            </div>

            {events.length>0 && <div style={{marginTop:10,marginLeft:30}}>
              {events.map((ev,i)=><div key={i} style={{padding:"8px 12px",background:"rgba(8,13,25,.6)",borderRadius:8,marginBottom:6,fontSize:11,borderLeft:`2px solid ${cl}`,display:"flex",gap:10,alignItems:"start"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:ev.descripcion?6:0}}>
                    <span style={{color:"#94a3b8"}}>📅 <b style={{color:"#cbd5e1"}}>{ev.date||"—"}</b></span>
                    {ev.coti && <span style={{color:"#94a3b8"}}>📋 <b style={{color:"#60a5fa"}}>{ev.coti}</b></span>}
                    {ev.cliente && <span style={{color:"#94a3b8"}}>👤 <b style={{color:"#cbd5e1"}}>{ev.cliente}</b></span>}
                  </div>
                  {ev.descripcion && <div style={{color:"#94a3b8",fontStyle:"italic",lineHeight:1.5}}>"{ev.descripcion}"</div>}
                </div>
                {canEdit&&<button onClick={()=>removeEvent(c.id,i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,padding:0,flexShrink:0}} title="Eliminar evento">✕</button>}
              </div>)}
            </div>}
          </div>;
        })}
        </div>
      </div>
    </div>:<div style={{padding:50,textAlign:"center",color:"#334155"}}><div style={{fontSize:40,marginBottom:10}}>◎</div><div style={{fontSize:14}}>Seleccione un {kind==="inst"?"instalador":"ayudante"} arriba</div></div>}

    {/* MODAL DOCUMENTAR EVENTO */}
    {evtCrit && <div className="modalBg" onClick={()=>setEvtCrit(null)}>
      <div className="card" style={{padding:0,width:520,maxWidth:"95vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(30,48,72,.5)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>Documentar evento</div>
          <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{evtCrit.l}</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{tm?.name}</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Fecha *</label>
              <input className="inp" type="date" value={evtDate} onChange={e=>setEvtDate(e.target.value)}/></div>
            <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Cotización</label>
              <input className="inp" value={evtCoti} onChange={e=>setEvtCoti(e.target.value)} placeholder="C02SA7830"/></div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Cliente</label>
            <input className="inp" value={evtCli} onChange={e=>setEvtCli(e.target.value)} placeholder="Nombre del cliente"/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Descripción del evento</label>
            <textarea className="txa" value={evtDesc} onChange={e=>setEvtDesc(e.target.value)} placeholder="¿Qué pasó? Ej: Error de medición en cortina, faltaron 5cm de ancho. Tuvo que reprogramarse."/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn bs" onClick={addEvent} style={{flex:1}}>✓ Registrar Evento</button>
            <button className="btn bg" onClick={()=>setEvtCrit(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════
// ADMINISTRACIÓN DE PERSONAL
// - Agregar/eliminar/desactivar instaladores y ayudantes
// - Cambiar categoría A/B
// - ASCENDER ayudante → instalador
// - Asignar ayudante por defecto a cada instalador
// ═══════════════════════════════════════════════════════════
function AdminV({inst,svI,ayud,svA,canEdit,scores,scoresA}){
  const [sub,setSub] = useState("inst");
  const [showAddI,setShowAddI] = useState(false);
  const [showAddA,setShowAddA] = useState(false);
  const [newName,setNewName] = useState(""); const [newCat,setNewCat] = useState("B");
  const [assignFor,setAssignFor] = useState(null); // instalador id para asignar ayudante
  const [confirmDel,setConfirmDel] = useState(null); // {kind, item}
  const [promoteAy,setPromoteAy] = useState(null); // ayudante a ascender

  function addInst(){
    const n=newName.trim().toUpperCase(); if(!n)return;
    svI([...inst,{id:"I"+Date.now().toString(36),name:n,cat:newCat,on:true,defaultAyId:""}]);
    setNewName("");setNewCat("B");setShowAddI(false);
  }
  function addAyud(){
    const n=newName.trim().toUpperCase(); if(!n)return;
    svA([...ayud,{id:"A"+Date.now().toString(36),name:n,cat:newCat,on:true}]);
    setNewName("");setNewCat("B");setShowAddA(false);
  }
  function toggleCat(kind,id){
    if(kind==="i") svI(inst.map(x=>x.id===id?{...x,cat:x.cat==="A"?"B":"A"}:x));
    else svA(ayud.map(x=>x.id===id?{...x,cat:x.cat==="A"?"B":"A"}:x));
  }
  function toggleOn(kind,id){
    if(kind==="i") svI(inst.map(x=>x.id===id?{...x,on:!x.on}:x));
    else svA(ayud.map(x=>x.id===id?{...x,on:!x.on}:x));
  }
  function doDelete(){
    if(!confirmDel) return;
    if(confirmDel.kind==="i") svI(inst.filter(x=>x.id!==confirmDel.item.id));
    else svA(ayud.filter(x=>x.id!==confirmDel.item.id));
    setConfirmDel(null);
  }
  function doPromote(){
    if(!promoteAy) return;
    // Mover ayudante a instaladores (con su misma categoría)
    const newInst = {id:"I"+Date.now().toString(36),name:promoteAy.name,cat:promoteAy.cat,on:true,defaultAyId:""};
    svI([...inst,newInst]);
    svA(ayud.filter(x=>x.id!==promoteAy.id));
    setPromoteAy(null);
  }
  function assignAyToInst(instId, ayId){
    svI(inst.map(x=>x.id===instId?{...x,defaultAyId:ayId}:x));
    setAssignFor(null);
  }

  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Administración de Personal</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 18px"}}>Gestionar instaladores, ayudantes, categorías, ascensos y asignaciones</p>

    <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
      <button className={`pill ${sub==="inst"?"on":""}`} onClick={()=>setSub("inst")}>◈ Instaladores ({inst.length})</button>
      <button className={`pill ${sub==="ayud"?"on":""}`} onClick={()=>setSub("ayud")}>◇ Ayudantes ({ayud.length})</button>
      <div style={{flex:1}}/>
      {canEdit && sub==="inst" && <button className="btn bp" onClick={()=>setShowAddI(true)}>+ Nuevo Instalador</button>}
      {canEdit && sub==="ayud" && <button className="btn bp" onClick={()=>setShowAddA(true)}>+ Nuevo Ayudante</button>}
    </div>

    {/* MODAL AGREGAR */}
    {(showAddI||showAddA) && <div className="modalBg" onClick={()=>{setShowAddI(false);setShowAddA(false)}}>
      <div className="card" style={{padding:0,width:420,maxWidth:"95vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(30,48,72,.5)"}}>
          <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>Nuevo {showAddI?"Instalador":"Ayudante"}</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Nombre completo *</label>
            <input className="inp" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Ej: JUAN PEREZ" autoFocus/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Categoría inicial</label>
            <select className="sel" value={newCat} onChange={e=>setNewCat(e.target.value)}>
              <option value="B">Estándar (B)</option>
              <option value="A">Elite (A)</option>
            </select>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn bs" onClick={showAddI?addInst:addAyud} style={{flex:1}}>✓ Agregar</button>
            <button className="btn bg" onClick={()=>{setShowAddI(false);setShowAddA(false)}}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>}

    {/* MODAL CONFIRMAR ELIMINAR */}
    {confirmDel && <div className="modalBg" onClick={()=>setConfirmDel(null)}>
      <div className="card" style={{padding:0,width:440,maxWidth:"95vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(30,48,72,.5)"}}>
          <div style={{fontSize:17,fontWeight:800,color:"#ef4444"}}>⚠ Eliminar permanentemente</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <p style={{fontSize:13,color:"#cbd5e1",marginBottom:14,lineHeight:1.6}}>
            Se eliminará a <b style={{color:"#f1f5f9"}}>{confirmDel.item.name}</b> de la lista.<br/>
            <span style={{color:"#64748b",fontSize:11}}>Los registros históricos (metros instalados) NO se borran. Si solo quieres ocultarlo, mejor desactívalo.</span>
          </p>
          <div style={{display:"flex",gap:10}}>
            <button className="btn bd" onClick={doDelete} style={{flex:1}}>Eliminar permanentemente</button>
            <button className="btn bg" onClick={()=>setConfirmDel(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>}

    {/* MODAL ASCENDER AYUDANTE */}
    {promoteAy && <div className="modalBg" onClick={()=>setPromoteAy(null)}>
      <div className="card" style={{padding:0,width:460,maxWidth:"95vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(30,48,72,.5)"}}>
          <div style={{fontSize:17,fontWeight:800,color:"#10b981"}}>↑ Ascender a Instalador</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <p style={{fontSize:13,color:"#cbd5e1",marginBottom:16,lineHeight:1.6}}>
            <b style={{color:"#f1f5f9"}}>{promoteAy.name}</b> pasará de Ayudante a Instalador con categoría <b>{promoteAy.cat}</b>.<br/>
            <span style={{color:"#64748b",fontSize:11}}>Será removido de la lista de ayudantes y agregado a la lista de instaladores. Después podrás asignarle un ayudante por defecto.</span>
          </p>
          <div style={{display:"flex",gap:10}}>
            <button className="btn bs" onClick={doPromote} style={{flex:1}}>↑ Confirmar Ascenso</button>
            <button className="btn bg" onClick={()=>setPromoteAy(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>}

    {/* MODAL ASIGNAR AYUDANTE */}
    {assignFor && <div className="modalBg" onClick={()=>setAssignFor(null)}>
      <div className="card" style={{padding:0,width:480,maxWidth:"95vw",maxHeight:"80vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(30,48,72,.5)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5}}>Asignar ayudante a</div>
          <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{assignFor.name}</div>
        </div>
        <div style={{padding:"16px 24px",overflowY:"auto",flex:1}}>
          <button onClick={()=>assignAyToInst(assignFor.id,"")} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid rgba(51,65,85,.4)",background:assignFor.defaultAyId===""?"rgba(37,99,235,.12)":"transparent",color:"#94a3b8",fontSize:13,cursor:"pointer",marginBottom:8,textAlign:"left",fontFamily:"inherit"}}>— Sin ayudante asignado —</button>
          {ayud.filter(a=>a.on).map(a=><button key={a.id} onClick={()=>assignAyToInst(assignFor.id,a.id)} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:assignFor.defaultAyId===a.id?"2px solid #10b981":"1px solid rgba(51,65,85,.4)",background:assignFor.defaultAyId===a.id?"rgba(16,185,129,.08)":"transparent",fontSize:13,cursor:"pointer",marginBottom:8,textAlign:"left",display:"flex",alignItems:"center",gap:10,color:"#e2e8f0",fontFamily:"inherit"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(167,139,250,.15)",color:"#a78bfa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900}}>{a.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{a.name}</div>
              <div style={{fontSize:10,color:"#64748b"}}>Ayudante</div>
            </div>
            <Cat c={a.cat}/>
            {assignFor.defaultAyId===a.id && <span style={{color:"#10b981",fontSize:14}}>✓</span>}
          </button>)}
        </div>
        <div style={{padding:"14px 24px",borderTop:"1px solid rgba(30,48,72,.5)"}}>
          <button className="btn bg" onClick={()=>setAssignFor(null)} style={{width:"100%"}}>Cerrar</button>
        </div>
      </div>
    </div>}

    {/* LISTA */}
    <div style={{display:"grid",gap:8}}>
      {sub==="inst" ? inst.map(t=>{
        const ay = ayud.find(a=>a.id===t.defaultAyId);
        const score = getScore(scores,t.id,inst);
        return <div key={t.id} className="card" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",flexWrap:"wrap",opacity:t.on?1:.45}}>
          <div style={{width:44,height:44,borderRadius:10,background:"rgba(96,165,250,.12)",color:"#60a5fa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,flexShrink:0}}>{t.name[0]}</div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{t.name}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>Ayudante asignado: <b style={{color:ay?"#a78bfa":"#475569"}}>{ay?ay.name:"— Sin asignar —"}</b></div>
          </div>
          {score!==null && <div style={{padding:"4px 10px",borderRadius:8,background:`${score>=85?"#10b981":score>=60?"#f59e0b":"#ef4444"}15`,color:score>=85?"#10b981":score>=60?"#f59e0b":"#ef4444",fontSize:11,fontWeight:800}}>Score {score}</div>}
          <Cat c={t.cat} lg/>
          {canEdit && <>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11}} onClick={()=>setAssignFor(t)} title="Cambiar ayudante asignado">⇄ Asignar Ayudante</button>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11}} onClick={()=>toggleCat("i",t.id)}>{t.cat==="A"?"↓ Bajar a B":"↑ Subir a A"}</button>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11}} onClick={()=>toggleOn("i",t.id)}>{t.on?"Desactivar":"Activar"}</button>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11,color:"#ef4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setConfirmDel({kind:"i",item:t})}>🗑</button>
          </>}
        </div>;
      }) : ayud.map(t=>{
        const score = getScore(scoresA,t.id,ayud);
        return <div key={t.id} className="card" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",flexWrap:"wrap",opacity:t.on?1:.45}}>
          <div style={{width:44,height:44,borderRadius:10,background:"rgba(167,139,250,.12)",color:"#a78bfa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,flexShrink:0}}>{t.name[0]}</div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{t.name}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>Ayudante</div>
          </div>
          {score!==null && <div style={{padding:"4px 10px",borderRadius:8,background:`${score>=85?"#10b981":score>=60?"#f59e0b":"#ef4444"}15`,color:score>=85?"#10b981":score>=60?"#f59e0b":"#ef4444",fontSize:11,fontWeight:800}}>Score {score}</div>}
          <Cat c={t.cat} lg/>
          {canEdit && <>
            <button className="btn bs" style={{padding:"7px 12px",fontSize:11}} onClick={()=>setPromoteAy(t)} title="Ascender a instalador">↑ Ascender a Instalador</button>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11}} onClick={()=>toggleCat("a",t.id)}>{t.cat==="A"?"↓ Bajar a B":"↑ Subir a A"}</button>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11}} onClick={()=>toggleOn("a",t.id)}>{t.on?"Desactivar":"Activar"}</button>
            <button className="btn bg" style={{padding:"7px 12px",fontSize:11,color:"#ef4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setConfirmDel({kind:"a",item:t})}>🗑</button>
          </>}
        </div>;
      })}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// REPORTES MENSUALES — Período 25 al 25, exportar a PDF
// ═══════════════════════════════════════════════════════════
function ReportV({inst,ayud,recs}){
  const cur = getCurrentPeriod();
  const [mes,setMes] = useState(cur.mes);
  const [anio,setAnio] = useState(cur.anio);
  const [pdfLoading,setPdfLoading] = useState(false);

  const period = getPeriodRange(mes,anio);
  const fRecs = filterByPeriod(recs, mes, anio);

  // Resumen instaladores del período
  const rI = useMemo(()=>{
    const m={};
    fRecs.forEach(r=>{
      if(!m[r.i]) m[r.i]={mt:0,pi:0,n:0};
      m[r.i].mt+=r.ml||0; m[r.i].pi+=r.pi||0; m[r.i].n+=1;
    });
    return Object.entries(m).sort((a,b)=>b[1].mt-a[1].mt);
  },[fRecs]);

  // Resumen ayudantes del período
  const rA = useMemo(()=>{
    const m={};
    fRecs.forEach(r=>{
      if(!r.a||r.a==="—") return;
      if(!m[r.a]) m[r.a]={mt:0,pa:0,n:0};
      m[r.a].mt+=r.ml||0; m[r.a].pa+=r.pa||0; m[r.a].n+=1;
    });
    return Object.entries(m).sort((a,b)=>b[1].mt-a[1].mt);
  },[fRecs]);

  const totMt=rI.reduce((a,x)=>a+x[1].mt,0);
  const totPI=rI.reduce((a,x)=>a+x[1].pi,0);
  const totPA=rA.reduce((a,x)=>a+x[1].pa,0);

  // Años disponibles (basado en registros)
  const years = useMemo(()=>{
    const ySet = new Set([anio]);
    recs.forEach(r=>{ if(r.dt) ySet.add(parseInt(r.dt.substring(0,4))) });
    return [...ySet].sort();
  },[recs,anio]);

  // Navegar meses
  function prevMonth(){
    if(mes===0){setMes(11);setAnio(anio-1)} else setMes(mes-1);
  }
  function nextMonth(){
    if(mes===11){setMes(0);setAnio(anio+1)} else setMes(mes+1);
  }

  // EXPORTAR A PDF usando html2canvas + jsPDF vía CDN
  async function exportPDF(){
    setPdfLoading(true);
    try {
      // Cargar libs dinámicamente si no están cargadas
      if(!window.html2canvas){
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      }
      if(!window.jspdf){
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      }

      const el = document.getElementById("report-content");
      if(!el) return;

      const canvas = await window.html2canvas(el, {
        backgroundColor: "#060a13",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "letter"
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableW = pageW - margin*2;
      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;

      // Si es más alto que una página, dividir en múltiples páginas
      let yOffset = 0;
      const pageImgH = pageH - margin*2;

      if(imgH <= pageImgH){
        pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      } else {
        // Multi-page
        let remaining = imgH;
        let srcY = 0;
        let pageNum = 0;
        while(remaining > 0){
          if(pageNum > 0) pdf.addPage();
          const sliceH = Math.min(remaining, pageImgH);
          // Render full image offset
          pdf.addImage(imgData, "PNG", margin, margin - (srcY * imgW / canvas.width), imgW, imgH);
          // Clip to page
          srcY += (sliceH * canvas.width / imgW);
          remaining -= sliceH;
          pageNum++;
          if(pageNum > 10) break; // safety
        }
      }

      pdf.save(`FPC_Reporte_${MESES[mes]}_${anio}.pdf`);
    } catch(e) {
      console.error("Error generando PDF:", e);
      alert("Error al generar PDF. Intente de nuevo o use Ctrl+P para imprimir como PDF.");
    }
    setPdfLoading(false);
  }

  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src=src; s.onload=resolve; s.onerror=reject;
      document.head.appendChild(s);
    });
  }

  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>📊 Reportes Mensuales</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 18px"}}>Período de pago: del 25 al 25 de cada mes</p>

    {/* Selector de período */}
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:20}}>
      <button className="btn bg" onClick={prevMonth} style={{padding:"8px 14px",fontSize:18}}>◀</button>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <select className="sel" value={mes} onChange={e=>setMes(parseInt(e.target.value))} style={{width:160}}>
          {MESES.map((m,i)=><option key={i} value={i}>{m}</option>)}
        </select>
        <select className="sel" value={anio} onChange={e=>setAnio(parseInt(e.target.value))} style={{width:100}}>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <button className="btn bg" onClick={nextMonth} style={{padding:"8px 14px",fontSize:18}}>▶</button>
      <div style={{flex:1}}/>
      <button className="btn bp" onClick={exportPDF} disabled={pdfLoading} style={{padding:"10px 20px",display:"flex",alignItems:"center",gap:8}}>
        {pdfLoading ? "⏳ Generando..." : "📄 Exportar PDF"}
      </button>
      <button className="btn bg" onClick={()=>window.print()} style={{padding:"10px 16px"}}>🖨 Imprimir</button>
    </div>

    {/* Contenido del reporte (se captura para PDF) */}
    <div id="report-content" style={{background:"#060a13",padding:4}}>
      {/* Header del reporte */}
      <div style={{padding:"20px 24px",background:"linear-gradient(135deg,rgba(15,23,42,.95),rgba(15,23,42,.7))",borderRadius:14,marginBottom:16,border:"1px solid rgba(30,48,72,.5)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:4,color:"#3b82f6",marginBottom:4}}>GRUPO FPC</div>
            <div style={{fontSize:22,fontWeight:900,color:"#f1f5f9"}}>Reporte de Pagos — {period.label}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Período: {period.labelCorto}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Generado</div>
            <div style={{fontSize:13,color:"#94a3b8"}}>{new Date().toLocaleDateString("es-GT",{day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
        </div>
      </div>

      {/* KPIs del período */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:16}}>
        <KPI label="Registros" value={fRecs.length} accent="#f1f5f9" icon="✎"/>
        <KPI label="Metros Totales" value={N(totMt)} accent="#60a5fa" icon="▤"/>
        <KPI label="Pago Instaladores" value={Q(totPI)} accent="#10b981" icon="$"/>
        <KPI label="Pago Ayudantes" value={Q(totPA)} accent="#a78bfa" icon="$"/>
        <KPI label="Gran Total" value={Q(totPI+totPA)} accent="#fbbf24" icon="★"/>
      </div>

      {/* Tabla Instaladores */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-h"><span style={{color:"#60a5fa"}}>◈</span> Pago Instaladores — {period.label}</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["#","Instalador","Cat","Inst.","Metros","Q Pago"].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}
            </tr></thead>
            <tbody>
            {rI.map(([n,d],i)=>{
              const t=inst.find(x=>x.name===n);
              return <tr key={n}>
                <td className="td" style={{color:"#475569",fontWeight:700}}>{i+1}</td>
                <td className="td" style={{fontWeight:700}}>{n}</td>
                <td className="td">{t&&<Cat c={t.cat}/>}</td>
                <td className="td" style={{textAlign:"right"}}>{d.n}</td>
                <td className="td" style={{textAlign:"right",color:"#60a5fa",fontWeight:700}}>{N(d.mt)}</td>
                <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:13}}>{Q(d.pi)}</td>
              </tr>;
            })}
            {rI.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
              <td className="td" colSpan={4} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL INSTALADORES</td>
              <td className="td" style={{textAlign:"right",fontWeight:800,color:"#60a5fa",borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(totMt)}</td>
              <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPI)}</td>
            </tr>}
            </tbody>
          </table>
          {!rI.length&&<div style={{padding:30,textAlign:"center",color:"#475569",fontSize:13}}>Sin registros en este período</div>}
        </div>
      </div>

      {/* Tabla Ayudantes */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-h"><span style={{color:"#a78bfa"}}>◇</span> Pago Ayudantes — {period.label}</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["#","Ayudante","Cat","Inst.","Metros","Q Pago"].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}
            </tr></thead>
            <tbody>
            {rA.map(([n,d],i)=>{
              const t=ayud.find(x=>x.name===n);
              return <tr key={n}>
                <td className="td" style={{color:"#475569",fontWeight:700}}>{i+1}</td>
                <td className="td" style={{fontWeight:700}}>{n}</td>
                <td className="td">{t&&<Cat c={t.cat}/>}</td>
                <td className="td" style={{textAlign:"right"}}>{d.n}</td>
                <td className="td" style={{textAlign:"right",color:"#a78bfa",fontWeight:700}}>{N(d.mt)}</td>
                <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:13}}>{Q(d.pa)}</td>
              </tr>;
            })}
            {rA.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
              <td className="td" colSpan={4} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL AYUDANTES</td>
              <td className="td" style={{textAlign:"right",fontWeight:800,color:"#a78bfa",borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(rA.reduce((a,x)=>a+x[1].mt,0))}</td>
              <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPA)}</td>
            </tr>}
            </tbody>
          </table>
          {!rA.length&&<div style={{padding:30,textAlign:"center",color:"#475569",fontSize:13}}>Sin registros en este período</div>}
        </div>
      </div>

      {/* Detalle de registros del período */}
      <div className="card">
        <div className="card-h" style={{justifyContent:"space-between"}}>
          <span><span style={{color:"#64748b"}}>▤</span> Detalle de Instalaciones — {period.label}</span>
          <span style={{fontSize:11,color:"#64748b"}}>{fRecs.length} registros</span>
        </div>
        <div style={{overflowX:"auto",maxHeight:500}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["Fecha","Cotización","Cliente","Instalador","Ayudante","Producto","Mts","Q Inst","Q Ayud"].map((h,i)=><th key={h} className="th" style={i>=6?{textAlign:"right"}:{}}>{h}</th>)}
            </tr></thead>
            <tbody>
            {fRecs.map(r=><tr key={r.id}>
              <td className="td" style={{color:"#94a3b8"}}>{r.dt}</td>
              <td className="td" style={{color:"#cbd5e1"}}>{r.co||"—"}</td>
              <td className="td" style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis"}}>{r.cl||"—"}</td>
              <td className="td" style={{fontWeight:700}}>{r.i}</td>
              <td className="td" style={{color:"#a78bfa"}}>{r.a||"—"}</td>
              <td className="td" style={{color:"#60a5fa",fontWeight:600}}>{r.p}</td>
              <td className="td" style={{textAlign:"right",fontWeight:800}}>{N(r.ml)}</td>
              <td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(r.pi)}</td>
              <td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(r.pa)}</td>
            </tr>)}
            </tbody>
          </table>
          {!fRecs.length&&<div style={{padding:40,textAlign:"center",color:"#475569",fontSize:13}}>No hay registros en el período {period.labelCorto}</div>}
        </div>
      </div>

      {/* Footer del reporte */}
      <div style={{padding:"14px 20px",marginTop:12,textAlign:"center"}}>
        <div style={{fontSize:10,color:"#334155"}}>GRUPO FPC — Reporte generado el {new Date().toLocaleDateString("es-GT")} — Período {period.labelCorto}</div>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// TABLAS DE PAGO
// ═══════════════════════════════════════════════════════════
function TBV(){
  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Tablas de Pago por Metro</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 20px"}}>Categoría A (Elite 125%) vs Categoría B (Estándar 100%)</p>
    <div className="card"><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>
        <th className="th">#</th><th className="th">Producto</th>
        <th className="th" style={{textAlign:"right",color:"#10b981"}}>A — Inst</th>
        <th className="th" style={{textAlign:"right",color:"#10b981"}}>A — Ayud</th>
        <th className="th" style={{textAlign:"right",color:"#94a3b8"}}>B — Inst</th>
        <th className="th" style={{textAlign:"right",color:"#94a3b8"}}>B — Ayud</th>
      </tr></thead>
      <tbody>{PRODS.map((p,i)=>{const r=RATE[p];return <tr key={p}>
        <td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td>
        <td className="td" style={{fontWeight:600}}>{p}</td>
        <td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:700}}>{Q(r.A.i)}</td>
        <td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(r.A.a)}</td>
        <td className="td" style={{textAlign:"right",color:"#94a3b8",fontWeight:700}}>{Q(r.B.i)}</td>
        <td className="td" style={{textAlign:"right",color:"#94a3b8"}}>{Q(r.B.a)}</td>
      </tr>;})}</tbody>
    </table></div></div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// PAGOS — solo gerente/admin
// ═══════════════════════════════════════════════════════════
function PGV({inst,ayud,bI,bA}){
  const sI = Object.entries(bI).sort((a,b)=>b[1].pi-a[1].pi);
  const sA = Object.entries(bA).sort((a,b)=>b[1].pa-a[1].pa);
  const tPI = sI.reduce((a,x)=>a+x[1].pi,0);
  const tPA = sA.reduce((a,x)=>a+x[1].pa,0);

  return <div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 20px"}}>💰 Pagos & Incentivos</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:20}}>
      <KPI label="Pago Instaladores" value={Q(tPI)} accent="#60a5fa" icon="$"/>
      <KPI label="Pago Ayudantes" value={Q(tPA)} accent="#a78bfa" icon="$"/>
      <KPI label="Gran Total" value={Q(tPI+tPA)} accent="#fbbf24" icon="★"/>
    </div>

    <div className="card" style={{marginBottom:18}}>
      <div className="card-h"><span style={{color:"#60a5fa"}}>◈</span> Pago Instaladores</div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["#","Instalador","Cat","Inst.","Mts","Q Pago"].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}</tr></thead>
        <tbody>
        {sI.map(([n,d],i)=>{const t=inst.find(x=>x.name===n);return <tr key={n}>
          <td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td>
          <td className="td" style={{fontWeight:700}}>{n}</td>
          <td className="td">{t&&<Cat c={t.cat}/>}</td>
          <td className="td" style={{textAlign:"right"}}>{d.n}</td>
          <td className="td" style={{textAlign:"right",color:"#60a5fa",fontWeight:700}}>{N(d.mt)}</td>
          <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:13}}>{Q(d.pi)}</td>
        </tr>;})}
        {sI.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
          <td className="td" colSpan={5} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL INSTALADORES</td>
          <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(tPI)}</td>
        </tr>}
        </tbody></table>
        {!sI.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin datos</div>}
      </div>
    </div>

    <div className="card">
      <div className="card-h"><span style={{color:"#a78bfa"}}>◇</span> Pago Ayudantes</div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["#","Ayudante","Cat","Inst.","Mts","Q Pago"].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}</tr></thead>
        <tbody>
        {sA.map(([n,d],i)=>{const t=ayud.find(x=>x.name===n);return <tr key={n}>
          <td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td>
          <td className="td" style={{fontWeight:700}}>{n}</td>
          <td className="td">{t&&<Cat c={t.cat}/>}</td>
          <td className="td" style={{textAlign:"right"}}>{d.n}</td>
          <td className="td" style={{textAlign:"right",color:"#a78bfa",fontWeight:700}}>{N(d.mt)}</td>
          <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:13}}>{Q(d.pa)}</td>
        </tr>;})}
        {sA.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}>
          <td className="td" colSpan={5} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL AYUDANTES</td>
          <td className="td" style={{textAlign:"right",fontWeight:900,color:"#10b981",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(tPA)}</td>
        </tr>}
        </tbody></table>
        {!sA.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin datos</div>}
      </div>
    </div>
  </div>;
}
