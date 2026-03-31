import { useState, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   ██████  ██████  ██    ██ ██████   ██████      ███████ ██████   ██████
  ██       ██   ██ ██    ██ ██   ██ ██    ██     ██      ██   ██ ██
  ██   ███ ██████  ██    ██ ██████  ██    ██     █████   ██████  ██
  ██    ██ ██   ██ ██    ██ ██      ██    ██     ██      ██      ██
   ██████  ██   ██  ██████  ██       ██████      ██      ██       ██████

   Sistema de Control de Instalaciones, Compensaciones & Scorecard
   Versión 2.0 — Marzo 2026
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══ TABLAS DE PAGO (Manual de Compensaciones FPC) ═══
const RATE={
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
const PRODS=Object.keys(RATE);

// ═══ EQUIPOS INICIALES ═══
const INIT_TEAMS=[
  {id:"T01",inst:"ROYVIN GUEVARA",ay:"KEVIN CHAMALE",cat:"B",on:true},
  {id:"T02",inst:"SAMUEL ORDOÑEZ",ay:"HENRY SANCHEZ",cat:"B",on:true},
  {id:"T03",inst:"CRISTOBAL ZAMORA",ay:"JOSE CARLOS CORADO",cat:"B",on:true},
  {id:"T04",inst:"EDY AQUINO",ay:"FREYBIN PACHECO",cat:"B",on:true},
  {id:"T05",inst:"FREDY CHAVEZ",ay:"LUIS VASQUEZ",cat:"B",on:true},
  {id:"T06",inst:"ALEX RIVERA",ay:"LESTER MIRON",cat:"B",on:true},
  {id:"T07",inst:"JAIME PUAQUE",ay:"WILSON QUIXAL",cat:"B",on:true},
  {id:"T08",inst:"JORGE FIGUEROA",ay:"RUDY ROMAN",cat:"B",on:true},
  {id:"T09",inst:"JUAN CARLOS JOLON",ay:"JONATHAN MIRON",cat:"B",on:true},
  {id:"T10",inst:"LUIS HERNANDEZ",ay:"MARLON PEREZ",cat:"B",on:true},
  {id:"T11",inst:"LUIS JEPTE",ay:"ERICKSON MUY",cat:"B",on:true},
  {id:"T12",inst:"FRANCISCO PEREZ",ay:"JOSUE ALEJANDRO DONIS",cat:"B",on:true},
];

// ═══ CRITERIOS SCORECARD (Manual Operativo FPC) ═══
const CRIT=[
  {id:"c1",l:"Errores de Medición",d:"Cero errores atribuibles al técnico",A:0,B:3,cnt:true},
  {id:"c2",l:"Errores de Instalación",d:"Cero errores atribuibles",A:0,B:3,cnt:true},
  {id:"c3",l:"Retrabajos",d:"Cero retrabajos atribuibles",A:0,B:3,cnt:true},
  {id:"c4",l:"Garantías",d:"Cero garantías por mala instalación",A:0,B:2,cnt:true},
  {id:"c5",l:"Reclamos de Cliente",d:"Cero reclamos formales",A:0,B:1,cnt:true},
  {id:"c6",l:"Llamadas de Atención",d:"Cero llamadas vigentes",A:0,B:1,cnt:true},
  {id:"c7",l:"Proceso de Llamadas",d:"Llamada inicio ruta + 1h antes + aviso retraso",A:100,B:90,cnt:false},
  {id:"c8",l:"Evidencia Fotográfica",d:"Inmediata (Cat A) / Mismo día (Cat B)",A:100,B:90,cnt:false},
  {id:"c9",l:"Constancia Firmada",d:"Entrega completa al finalizar",A:100,B:90,cnt:false},
  {id:"c10",l:"Liquidación Viáticos",d:"24hrs (Cat A) / 48hrs (Cat B)",A:100,B:80,cnt:false},
  {id:"c11",l:"Disciplina y Orden",d:"Uniforme, panel limpio, herramientas",A:100,B:80,cnt:false},
  {id:"c12",l:"Servicio al Cliente",d:"Trato, limpieza, explicación de producto",A:100,B:80,cnt:false},
  {id:"c13",l:"Revisión de Material",d:"Verificación completa antes de ruta",A:100,B:80,cnt:false},
  {id:"c14",l:"Checklist de Instalación",d:"Nivelación, fijación, funcionamiento",A:100,B:80,cnt:false},
];

// ═══ ROLES & ACCESOS ═══
const USERS={
  "admin":{pw:"fpc2026",name:"Administrador",role:"admin",canMoney:true,canEdit:true,canScore:true},
  "gerente":{pw:"gerente2026",name:"Gerente Operaciones",role:"gerente",canMoney:true,canEdit:true,canScore:true},
  "diana":{pw:"diana2026",name:"Diana — Asistente Instalaciones",role:"asistente",canMoney:false,canEdit:true,canScore:true},
};

// ═══ STORAGE ═══
const DB={
  async get(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch{return null}},
  async set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){console.error(e)}},
};

// ═══ FORMATTERS ═══
const Q=n=>`Q${(n||0).toLocaleString("es-GT",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const N=n=>(n||0).toLocaleString("es-GT",{maximumFractionDigits:2});
const cPay=(p,m,c)=>{const r=RATE[p];if(!r)return{pi:0,pa:0};const t=r[c]||r.B;return{pi:+(m*t.i).toFixed(2),pa:+(m*t.a).toFixed(2)}};

function getScore(sd,tid,teams){
  const s=sd[tid]||{},t=teams.find(x=>x.id===tid);if(!t)return null;
  let tot=0,cnt=0;
  CRIT.forEach(c=>{const v=s[c.id];if(v===undefined)return;const mx=t.cat==="A"?c.A:c.B;
    if(c.cnt){tot+=v<=mx?100:Math.max(0,100-((v-mx)*25))}else{tot+=v>=mx?100:Math.round((v/Math.max(mx,1))*100)}cnt++});
  return cnt?Math.round(tot/cnt):null;
}

// ═══ REUSABLE COMPONENTS ═══
function Cat({c,lg}){const a=c==="A";return<span style={{padding:lg?"5px 16px":"3px 10px",borderRadius:99,fontSize:lg?13:10,fontWeight:800,letterSpacing:1,background:a?"rgba(16,185,129,.12)":"rgba(100,116,139,.12)",color:a?"#34d399":"#94a3b8",border:`1px solid ${a?"rgba(16,185,129,.25)":"rgba(100,116,139,.2)"}`,whiteSpace:"nowrap"}}>{a?"★ ELITE":"ESTÁNDAR"}</span>}

function Sem({v}){const c=v===null?"#334155":v>=85?"#10b981":v>=60?"#f59e0b":"#ef4444";return<div style={{width:10,height:10,borderRadius:"50%",background:c,boxShadow:`0 0 6px ${c}60`}}/>}

function KPI({label,value,sub,accent,icon}){return<div style={{background:"linear-gradient(135deg,rgba(15,23,42,.95),rgba(15,23,42,.8))",backdropFilter:"blur(10px)",borderRadius:14,padding:"18px 20px",border:"1px solid rgba(51,65,85,.4)",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:`${accent||"#3b82f6"}08`}}/>
  <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>{icon&&<span style={{fontSize:14}}>{icon}</span>}{label}</div>
  <div style={{fontSize:28,fontWeight:900,color:accent||"#f1f5f9",letterSpacing:-.5,lineHeight:1}}>{value}</div>
  {sub&&<div style={{fontSize:11,color:"#475569",marginTop:4}}>{sub}</div>}
</div>}

function HBar({data,h=160,color="#3b82f6"}){
  if(!data.length)return null;
  const mx=Math.max(...data.map(d=>d.v),1);
  return<div style={{display:"flex",flexDirection:"column",gap:4,padding:"4px 0"}}>
    {data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:10,color:"#64748b",width:100,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}}>{d.l}</span>
      <div style={{flex:1,height:20,background:"rgba(30,48,72,.4)",borderRadius:4,overflow:"hidden",position:"relative"}}>
        <div style={{height:"100%",background:`linear-gradient(90deg,${color},${color}aa)`,borderRadius:4,width:`${Math.max(2,(d.v/mx)*100)}%`,transition:"width .6s ease"}}/>
        <span style={{position:"absolute",right:6,top:2,fontSize:10,fontWeight:700,color:"#e2e8f0"}}>{typeof d.v==="number"?N(d.v):d.v}</span>
      </div>
    </div>)}
  </div>;
}

// ═══════════════════════════════════════════════════════════
// ███ MAIN APPLICATION ███
// ═══════════════════════════════════════════════════════════
export default function App(){
  const[ok,setOk]=useState(false);
  const[teams,setTeams]=useState([]);
  const[recs,setRecs]=useState([]);
  const[scores,setScores]=useState({});
  const[tab,setTab]=useState("dash");
  const[user,setUser]=useState(null); // null=público, object=logged in
  const[loginOpen,setLoginOpen]=useState(false);
  const[loginUser,setLoginUser]=useState("");
  const[loginPw,setLoginPw]=useState("");
  const[loginErr,setLoginErr]=useState("");
  const[mob,setMob]=useState(false);
  const[selT,setSelT]=useState(null);

  useEffect(()=>{(async()=>{
    let t=await DB.get("fpc8-t"),r=await DB.get("fpc8-r"),s=await DB.get("fpc8-s");
    if(!t||!t.length){t=INIT_TEAMS;await DB.set("fpc8-t",t)}
    setTeams(t);setRecs(r||[]);setScores(s||{});setOk(true);
  })()},[]);

  const svT=useCallback(async v=>{setTeams(v);await DB.set("fpc8-t",v)},[]);
  const svR=useCallback(async v=>{setRecs(v);await DB.set("fpc8-r",v)},[]);
  const svS=useCallback(async v=>{setScores(v);await DB.set("fpc8-s",v)},[]);

  // Summaries
  const bI=useMemo(()=>{const m={};recs.forEach(r=>{if(!m[r.i])m[r.i]={mt:0,pi:0,pa:0,n:0,pr:{}};m[r.i].mt+=r.ml||0;m[r.i].pi+=r.pi||0;m[r.i].pa+=r.pa||0;m[r.i].n+=1;if(!m[r.i].pr[r.p])m[r.i].pr[r.p]={mt:0,pi:0,pa:0,n:0};m[r.i].pr[r.p].mt+=r.ml||0;m[r.i].pr[r.p].pi+=r.pi||0;m[r.i].pr[r.p].pa+=r.pa||0;m[r.i].pr[r.p].n+=1});return m},[recs]);
  const bP=useMemo(()=>{const m={};recs.forEach(r=>{if(!m[r.p])m[r.p]={mt:0,pi:0,pa:0,n:0};m[r.p].mt+=r.ml||0;m[r.p].pi+=r.pi||0;m[r.p].pa+=r.pa||0;m[r.p].n+=1});return m},[recs]);

  const tMt=Object.values(bI).reduce((s,v)=>s+v.mt,0);
  const tPI=Object.values(bI).reduce((s,v)=>s+v.pi,0);
  const tPA=Object.values(bI).reduce((s,v)=>s+v.pa,0);

  const canMoney=user?.canMoney||false;
  const canEdit=user?.canEdit||false;

  function doLogin(){
    const u=USERS[loginUser.toLowerCase()];
    if(u&&u.pw===loginPw){setUser({...u,uid:loginUser.toLowerCase()});setLoginOpen(false);setLoginUser("");setLoginPw("");setLoginErr("")}
    else setLoginErr("Usuario o contraseña incorrectos");
  }

  const TABS=[
    {id:"dash",ic:"◻",l:"Dashboard",all:true},
    {id:"ing",ic:"✎",l:"Ingreso de Metros",edit:true},
    {id:"ri",ic:"◈",l:"Resumen Instalador",all:true},
    {id:"rp",ic:"▤",l:"Resumen Producto",all:true},
    {id:"sc",ic:"◎",l:"Scorecard",all:true},
    {id:"cl",ic:"⬆",l:"Clasificación A/B",all:true},
    {id:"eq",ic:"◉",l:"Equipos",edit:true},
    {id:"tb",ic:"▦",l:"Tablas de Pago",all:true},
    {id:"pg",ic:"$",l:"Pagos & Incentivos",money:true},
  ];

  const visTabs=TABS.filter(t=>{
    if(t.money)return canMoney;
    if(t.edit)return canEdit||!user; // public can see ingreso to understand, but form checks canEdit
    return true;
  });

  if(!ok)return<div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#060a13",fontFamily:"'Inter',system-ui,sans-serif"}}>
    <div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:800,letterSpacing:6,color:"#3b82f6",marginBottom:8}}>GRUPO FPC</div><div style={{fontSize:28,fontWeight:900,color:"#f1f5f9"}}>Sistema de Instalaciones</div><div style={{marginTop:16,width:40,height:4,background:"#1e3048",borderRadius:2,margin:"16px auto",overflow:"hidden"}}><div style={{width:"60%",height:"100%",background:"#3b82f6",borderRadius:2,animation:"load .8s ease infinite alternate"}}/>
    </div></div><style>{`@keyframes load{from{transform:translateX(0)}to{transform:translateX(67%)}}`}</style></div>;

  const SB={width:230,background:"linear-gradient(180deg,#080d19 0%,#0c1322 50%,#0f172a 100%)",position:"fixed",top:0,left:0,bottom:0,zIndex:100,display:"flex",flexDirection:"column",borderRight:"1px solid rgba(30,48,72,.6)"};

  return<div style={{fontFamily:"'Inter',-apple-system,'Segoe UI',sans-serif",background:"#060a13",minHeight:"100vh",color:"#e2e8f0"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0}
      ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e3048;border-radius:10px}::-webkit-scrollbar-track{background:transparent}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .4s ease-out}
      @media(max-width:840px){.dsk{display:none!important}.mmn{margin-left:0!important}}
      @media(min-width:841px){.mbo{display:none!important}.mbb{display:none!important}}
      input:focus,select:focus{border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.15)!important}
      tr:hover td{background:rgba(30,48,72,.15)!important}
      .card{background:rgba(15,23,42,.7);backdrop-filter:blur(12px);border:1px solid rgba(30,48,72,.5);border-radius:14px;overflow:hidden}
      .card-h{padding:16px 20px;border-bottom:1px solid rgba(30,48,72,.5);font-size:14px;font-weight:700;color:#f1f5f9;display:flex;align-items:center;gap:8px}
      .inp{padding:10px 14px;border-radius:10px;border:1px solid rgba(51,65,85,.5);background:rgba(15,23,42,.6);color:#e2e8f0;font-size:13px;outline:none;width:100%;box-sizing:border-box;transition:all .2s}
      .sel{padding:10px 14px;border-radius:10px;border:1px solid rgba(51,65,85,.5);background:rgba(15,23,42,.6);color:#e2e8f0;font-size:13px;outline:none;width:100%;box-sizing:border-box;appearance:auto;transition:all .2s}
      .btn{padding:10px 22px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.3px}
      .bp{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;box-shadow:0 2px 12px rgba(37,99,235,.3)}.bp:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,99,235,.4)}
      .bs{background:linear-gradient(135deg,#059669,#047857);color:#fff;box-shadow:0 2px 12px rgba(5,150,105,.3)}.bs:hover{transform:translateY(-1px)}
      .bg{background:transparent;color:#94a3b8;border:1px solid rgba(51,65,85,.5)}.bg:hover{background:rgba(30,48,72,.3)}
      .th{padding:10px 14px;text-align:left;font-weight:700;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid rgba(30,48,72,.5);white-space:nowrap;position:sticky;top:0;background:rgba(12,20,36,.95);z-index:1;backdrop-filter:blur(8px)}
      .td{padding:10px 14px;border-bottom:1px solid rgba(30,48,72,.2);white-space:nowrap;font-size:12.5px}
      select option{background:#0f172a;color:#e2e8f0}
    `}</style>

    {/* ═══ SIDEBAR ═══ */}
    <div className="dsk" style={SB}>
      <div style={{padding:"24px 20px 20px"}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:4,color:"#3b82f6",marginBottom:2}}>GRUPO FPC</div>
        <div style={{fontSize:15,fontWeight:800,color:"#f1f5f9",lineHeight:1.2}}>Control de<br/>Instalaciones</div>
      </div>

      <div style={{padding:"0 10px",flex:1}}>
        {visTabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:tab===t.id?"rgba(37,99,235,.12)":"transparent",color:tab===t.id?"#60a5fa":"#64748b",fontSize:12.5,fontWeight:tab===t.id?700:500,cursor:"pointer",marginBottom:2,textAlign:"left",transition:"all .2s",letterSpacing:.2}}>
          <span style={{width:20,textAlign:"center",fontSize:13,opacity:.7}}>{t.ic}</span>{t.l}
          {t.money&&<span style={{marginLeft:"auto",fontSize:9,background:"rgba(245,158,11,.15)",color:"#fbbf24",padding:"2px 6px",borderRadius:99}}>🔒</span>}
        </button>)}
      </div>

      {/* User status */}
      <div style={{padding:"14px 14px",borderTop:"1px solid rgba(30,48,72,.4)"}}>
        {user?<div>
          <div style={{fontSize:11,color:"#34d399",fontWeight:600,marginBottom:4}}>● {user.name}</div>
          <button onClick={()=>{setUser(null);if(tab==="pg")setTab("dash")}} style={{width:"100%",padding:"6px 10px",borderRadius:8,border:"1px solid rgba(51,65,85,.4)",background:"transparent",color:"#64748b",fontSize:11,cursor:"pointer"}}>Cerrar sesión</button>
        </div>:<button onClick={()=>setLoginOpen(true)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px dashed rgba(51,65,85,.5)",background:"transparent",color:"#475569",fontSize:12,cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>e.target.style.borderColor="#3b82f6"} onMouseLeave={e=>e.target.style.borderColor="rgba(51,65,85,.5)"}>🔐 Iniciar Sesión</button>}
        <div style={{fontSize:9,color:"#334155",marginTop:8}}>{recs.length} registros · v2.0</div>
      </div>
    </div>

    {/* ═══ MOBILE ═══ */}
    {mob&&<div className="mbo" style={{position:"fixed",inset:0,zIndex:200}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)"}} onClick={()=>setMob(false)}/>
      <div style={{...SB,position:"relative",zIndex:1,width:270}}>
        <div style={{padding:"20px 16px"}}><div style={{fontSize:10,fontWeight:800,letterSpacing:4,color:"#3b82f6"}}>GRUPO FPC</div><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>Control Instalaciones</div></div>
        <div style={{padding:"0 8px",flex:1,overflow:"auto"}}>{visTabs.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setMob(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,border:"none",background:tab===t.id?"rgba(37,99,235,.12)":"transparent",color:tab===t.id?"#60a5fa":"#64748b",fontSize:13,fontWeight:tab===t.id?700:500,cursor:"pointer",textAlign:"left"}}><span style={{width:20,textAlign:"center"}}>{t.ic}</span>{t.l}</button>)}</div>
      </div>
    </div>}

    {/* ═══ LOGIN MODAL ═══ */}
    {loginOpen&&<div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)"}} onClick={()=>{setLoginOpen(false);setLoginErr("")}}>
      <div className="card" style={{padding:0,width:380,maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"24px 28px 0"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:3,color:"#3b82f6",marginBottom:4}}>GRUPO FPC</div>
          <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Iniciar Sesión</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:20}}>Ingrese sus credenciales para acceder al sistema</div>
        </div>
        <div style={{padding:"0 28px 24px"}}>
          <div style={{marginBottom:12}}><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Usuario</label>
            <input className="inp" value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="admin, gerente, diana" autoFocus/></div>
          <div style={{marginBottom:16}}><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Contraseña</label>
            <input className="inp" type="password" value={loginPw} onChange={e=>setLoginPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
          {loginErr&&<div style={{fontSize:12,color:"#ef4444",marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,.1)",borderRadius:8}}>{loginErr}</div>}
          <div style={{display:"flex",gap:10}}><button className="btn bp" onClick={doLogin} style={{flex:1}}>Ingresar</button><button className="btn bg" onClick={()=>{setLoginOpen(false);setLoginErr("")}}>Cancelar</button></div>
        </div>
      </div>
    </div>}

    {/* ═══ MAIN ═══ */}
    <div className="mmn" style={{marginLeft:230,minHeight:"100vh"}}>
      <div style={{background:"rgba(8,13,25,.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(30,48,72,.4)",padding:"10px 24px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50}}>
        <button className="mbb" onClick={()=>setMob(true)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:20,padding:4}}>☰</button>
        <div style={{flex:1}}/>
        {user&&<span style={{fontSize:11,color:"#34d399",background:"rgba(5,150,105,.1)",padding:"4px 12px",borderRadius:99,border:"1px solid rgba(5,150,105,.2)",fontWeight:600}}>● {user.name}</span>}
        {!user&&<button onClick={()=>setLoginOpen(true)} style={{fontSize:11,color:"#64748b",background:"transparent",border:"1px solid rgba(51,65,85,.4)",padding:"4px 12px",borderRadius:99,cursor:"pointer"}}>🔐 Iniciar Sesión</button>}
        <span style={{fontSize:11,color:"#334155"}}>{new Date().toLocaleDateString("es-GT",{day:"numeric",month:"long",year:"numeric"})}</span>
      </div>

      <div style={{padding:"24px 28px",maxWidth:1440,margin:"0 auto"}} className="fu">
        {tab==="dash"&&<DashV teams={teams} bI={bI} bP={bP} tMt={tMt} tN={recs.length} cm={canMoney} tPI={tPI} tPA={tPA} scores={scores}/>}
        {tab==="ing"&&<IngV teams={teams} recs={recs} svR={svR} canEdit={canEdit} user={user}/>}
        {tab==="ri"&&<RIV teams={teams} bI={bI} cm={canMoney}/>}
        {tab==="rp"&&<RPV bP={bP} cm={canMoney}/>}
        {tab==="sc"&&<SCV teams={teams} scores={scores} svS={svS} selT={selT} bI={bI} canEdit={canEdit}/>}
        {tab==="cl"&&<CLV teams={teams} svT={svT} scores={scores} bI={bI} canEdit={canEdit}/>}
        {tab==="eq"&&<EQV teams={teams} svT={svT} canEdit={canEdit}/>}
        {tab==="tb"&&<TBV/>}
        {tab==="pg"&&canMoney&&<PGV teams={teams} bI={bI} recs={recs}/>}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════
// ██ DASHBOARD
// ═══════════════════════════════════════════════
function DashV({teams,bI,bP,tMt,tN,cm,tPI,tPA,scores}){
  const cA=teams.filter(t=>t.cat==="A"&&t.on).length;
  const cB=teams.filter(t=>t.cat==="B"&&t.on).length;
  const topI=Object.entries(bI).sort((a,b)=>b[1].mt-a[1].mt).slice(0,8);
  const topP=Object.entries(bP).sort((a,b)=>b[1].mt-a[1].mt).slice(0,10);

  // Score overview
  const teamScores=teams.filter(t=>t.on).map(t=>({...t,score:getScore(scores,t.id,teams),mt:bI[t.inst]?.mt||0,n:bI[t.inst]?.n||0})).sort((a,b)=>(b.score||0)-(a.score||0));

  return<div>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:10,fontWeight:800,letterSpacing:3,color:"#3b82f6",marginBottom:4}}>GRUPO FPC</div>
      <h1 style={{fontSize:26,fontWeight:900,color:"#f1f5f9",margin:0}}>Dashboard Ejecutivo</h1>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:12,marginBottom:22}}>
      <KPI label="Equipos Activos" value={teams.filter(t=>t.on).length} accent="#60a5fa" icon="◈"/>
      <KPI label="Categoría A" value={cA} sub={`${teams.filter(t=>t.on).length?Math.round(cA/(cA+cB)*100):0}% del equipo`} accent="#10b981" icon="★"/>
      <KPI label="Categoría B" value={cB} accent="#94a3b8" icon="◇"/>
      <KPI label="Instalaciones" value={tN.toLocaleString()} accent="#f1f5f9" icon="✎"/>
      <KPI label="Metros Totales" value={N(tMt)} accent="#f1f5f9" icon="▤"/>
      {cm&&<KPI label="Pago Total" value={Q(tPI+tPA)} accent="#fbbf24" icon="$"/>}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
      {/* Ranking instaladores */}
      <div className="card">
        <div className="card-h"><span style={{color:"#3b82f6"}}>◈</span> Ranking por Metros Instalados</div>
        <div style={{padding:"8px 20px 16px"}}>
          {topI.length?<HBar data={topI.map(([n,d])=>({l:n.split(" ").slice(0,2).join(" "),v:d.mt}))} color="#3b82f6"/>:<div style={{padding:30,textAlign:"center",color:"#334155",fontSize:12}}>Ingrese registros para ver el ranking</div>}
        </div>
      </div>

      {/* Productos */}
      <div className="card">
        <div className="card-h"><span style={{color:"#8b5cf6"}}>▤</span> Metros por Producto</div>
        <div style={{padding:"8px 20px 16px"}}>
          {topP.length?<HBar data={topP.map(([n,d])=>({l:n,v:d.mt}))} color="#8b5cf6"/>:<div style={{padding:30,textAlign:"center",color:"#334155",fontSize:12}}>Sin datos aún</div>}
        </div>
      </div>

      {/* Scorecard overview */}
      <div className="card" style={{gridColumn:"1/-1"}}>
        <div className="card-h"><span style={{color:"#10b981"}}>◎</span> Scorecard del Equipo</div>
        <div style={{padding:"12px 20px 16px"}}>
          {teamScores.length?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {teamScores.map(t=>{
              const c=t.score===null?"#334155":t.score>=85?"#10b981":t.score>=60?"#f59e0b":"#ef4444";
              return<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(15,23,42,.5)",borderRadius:10,border:`1px solid ${c}20`}}>
                <div style={{width:38,height:38,borderRadius:8,background:`${c}12`,color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,flexShrink:0}}>{t.score!==null?t.score:"—"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.inst}</div>
                  <div style={{fontSize:10,color:"#475569"}}>{t.n} inst · {N(t.mt)} mts</div>
                </div>
                <Cat c={t.cat}/>
              </div>})}
          </div>:<div style={{padding:20,textAlign:"center",color:"#334155",fontSize:12}}>Evalúe el scorecard de cada equipo para ver el resumen aquí</div>}
        </div>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════
// ██ INGRESO DE METROS
// ═══════════════════════════════════════════════
function IngV({teams,recs,svR,canEdit,user}){
  const at=teams.filter(t=>t.on);
  const[tid,setTid]=useState("");const[prod,setProd]=useState("");const[mts,setMts]=useState("");const[unis,setUnis]=useState("1");const[cot,setCot]=useState("");const[cli,setCli]=useState("");const[msg,setMsg]=useState("");
  const tm=at.find(t=>t.id===tid);const mn=parseFloat(mts)||0;const un=parseInt(unis)||1;const ml=+(mn*un).toFixed(2);const pay=prod&&tm?cPay(prod,ml,tm.cat):{pi:0,pa:0};

  function add(){
    if(!canEdit){setMsg("❌ Sin permisos de edición. Inicie sesión.");return}
    if(!tid||!prod||!mn){setMsg("❌ Seleccione equipo, producto y metros");return}
    const t=at.find(x=>x.id===tid);
    svR([{id:Date.now().toString(36),dt:new Date().toISOString().split("T")[0],co:cot.trim(),cl:cli.trim(),i:t.inst,a:t.ay,c:t.cat,p:prod,m:mn,u:un,ml,pi:pay.pi,pa:pay.pa,by:user?.name||"Sistema"},...recs]);
    setMsg(`✅ Registrado: ${t.inst} · ${prod} · ${N(ml)} mts`);
    setProd("");setMts("");setUnis("1");setCot("");setCli("");setTimeout(()=>setMsg(""),4000);
  }

  return<div>
    <h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Ingreso de Metros</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 20px"}}>Registrar instalaciones realizadas por equipo</p>

    <div className="card" style={{marginBottom:18}}>
      <div className="card-h"><span style={{color:"#10b981"}}>✎</span> Nuevo Registro</div>
      <div style={{padding:20}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:14}}>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Equipo Instalador *</label>
            <select className="sel" value={tid} onChange={e=>setTid(e.target.value)}><option value="">— Seleccionar equipo —</option>{at.map(t=><option key={t.id} value={t.id}>{t.inst} + {t.ay}</option>)}</select></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Producto *</label>
            <select className="sel" value={prod} onChange={e=>setProd(e.target.value)}><option value="">— Seleccionar producto —</option>{PRODS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Metros *</label>
            <input className="inp" type="number" step="0.01" value={mts} onChange={e=>setMts(e.target.value)} placeholder="Ej: 6.84"/></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Unidades</label>
            <input className="inp" type="number" value={unis} onChange={e=>setUnis(e.target.value)} placeholder="1"/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:16}}>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Cotización</label><input className="inp" value={cot} onChange={e=>setCot(e.target.value)} placeholder="C02SA7830"/></div>
          <div><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Cliente</label><input className="inp" value={cli} onChange={e=>setCli(e.target.value)} placeholder="Nombre del cliente"/></div>
        </div>

        {/* Preview */}
        {tid&&prod&&mn>0&&<div style={{background:"rgba(15,23,42,.5)",borderRadius:12,padding:14,marginBottom:16,border:"1px solid rgba(30,48,72,.4)",display:"flex",flexWrap:"wrap",gap:16,fontSize:12,alignItems:"center"}}>
          <div><span style={{color:"#475569"}}>Instalador</span><div style={{fontWeight:700,color:"#f1f5f9"}}>{tm?.inst}</div></div>
          <div><span style={{color:"#475569"}}>Ayudante</span><div style={{fontWeight:700,color:"#f1f5f9"}}>{tm?.ay}</div></div>
          <div><span style={{color:"#475569"}}>Producto</span><div style={{fontWeight:700,color:"#60a5fa"}}>{prod}</div></div>
          <div><span style={{color:"#475569"}}>Metros Lineal</span><div style={{fontWeight:900,color:"#f1f5f9",fontSize:18}}>{N(ml)}</div></div>
          <div><Cat c={tm?.cat||"B"}/></div>
        </div>}

        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <button className="btn bs" onClick={add}>✓ Registrar Instalación</button>
          {msg&&<span style={{fontSize:12,color:msg[0]==="✅"?"#10b981":"#ef4444",fontWeight:600}}>{msg}</span>}
          {!canEdit&&!user&&<span style={{fontSize:11,color:"#f59e0b"}}>⚠ Inicie sesión para registrar</span>}
        </div>
      </div>
    </div>

    {/* Records table */}
    <div className="card">
      <div className="card-h" style={{justifyContent:"space-between"}}><span><span style={{color:"#64748b"}}>▤</span> Registros ({recs.length})</span>
        {recs.length>0&&canEdit&&<button className="btn bg" style={{fontSize:11,padding:"5px 12px"}} onClick={()=>{if(confirm("¿Eliminar TODOS los registros?"))svR([])}}>Limpiar</button>}</div>
      <div style={{overflowX:"auto",maxHeight:420}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
          {["Fecha","Cotización","Cliente","Instalador","Ayudante","Producto","Mts","Cat",""].map(h=><th key={h} className="th" style={h==="Mts"?{textAlign:"right"}:{}}>{h}</th>)}
        </tr></thead><tbody>{recs.slice(0,25).map(r=><tr key={r.id}>
          <td className="td" style={{color:"#475569"}}>{r.dt}</td>
          <td className="td" style={{color:"#64748b"}}>{r.co||"—"}</td>
          <td className="td" style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis"}}>{r.cl||"—"}</td>
          <td className="td" style={{fontWeight:700}}>{r.i}</td>
          <td className="td" style={{color:"#94a3b8"}}>{r.a}</td>
          <td className="td" style={{color:"#60a5fa",fontWeight:600}}>{r.p}</td>
          <td className="td" style={{textAlign:"right",fontWeight:800,fontSize:13}}>{N(r.ml)}</td>
          <td className="td"><Cat c={r.c}/></td>
          <td className="td">{canEdit&&<button style={{background:"none",border:"none",color:"#334155",cursor:"pointer",fontSize:14}} onClick={()=>svR(recs.filter(x=>x.id!==r.id))}>✕</button>}</td>
        </tr>)}</tbody></table>
        {!recs.length&&<div style={{padding:40,textAlign:"center",color:"#334155",fontSize:13}}>No hay registros. Ingrese la primera instalación arriba.</div>}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════
// ██ RESUMEN INSTALADOR
// ═══════════════════════════════════════════════
function RIV({teams,bI,cm}){
  const s=Object.entries(bI).sort((a,b)=>b[1].mt-a[1].mt);
  const totN=s.reduce((a,x)=>a+x[1].n,0),totMt=s.reduce((a,x)=>a+x[1].mt,0),totPI=s.reduce((a,x)=>a+x[1].pi,0),totPA=s.reduce((a,x)=>a+x[1].pa,0);
  return<div><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 20px"}}>Resumen por Instalador</h1>
    <div className="card"><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
      {["#","Instalador","Cat","Inst.","Mts Lineales",...(cm?["Q Instalador","Q Ayudante","Q Total"]:[])].map((h,i)=><th key={h} className="th" style={i>=3?{textAlign:"right"}:{}}>{h}</th>)}
    </tr></thead><tbody>
      {s.map(([n,d],i)=>{const t=teams.find(x=>x.inst===n);return<tr key={n}><td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td><td className="td" style={{fontWeight:700}}>{n}</td><td className="td">{t&&<Cat c={t.cat}/>}</td><td className="td" style={{textAlign:"right"}}>{d.n}</td><td className="td" style={{textAlign:"right",fontWeight:800,color:"#60a5fa",fontSize:13}}>{N(d.mt)}</td>{cm&&<><td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:600}}>{Q(d.pi)}</td><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pa)}</td><td className="td" style={{textAlign:"right",fontWeight:800,color:"#fbbf24"}}>{Q(d.pi+d.pa)}</td></>}</tr>})}
      {s.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}><td className="td" colSpan={3} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL</td><td className="td" style={{textAlign:"right",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{totN}</td><td className="td" style={{textAlign:"right",fontWeight:900,color:"#60a5fa",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(totMt)}</td>{cm&&<><td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPI)}</td><td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPA)}</td><td className="td" style={{textAlign:"right",fontWeight:900,color:"#fbbf24",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(totPI+totPA)}</td></>}</tr>}
    </tbody></table>{!s.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin registros.</div>}</div></div></div>;
}

// ═══ RESUMEN PRODUCTO ═══
function RPV({bP,cm}){
  const s=Object.entries(bP).sort((a,b)=>b[1].mt-a[1].mt);const totN=s.reduce((a,x)=>a+x[1].n,0),totMt=s.reduce((a,x)=>a+x[1].mt,0);
  return<div><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 20px"}}>Resumen por Producto</h1>
    <div className="card"><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
      {["#","Producto","Cantidad","Mts Lineales",...(cm?["Q Inst","Q Ayud"]:[])].map((h,i)=><th key={h} className="th" style={i>=2?{textAlign:"right"}:{}}>{h}</th>)}
    </tr></thead><tbody>
      {s.map(([n,d],i)=><tr key={n}><td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td><td className="td" style={{fontWeight:700}}>{n}</td><td className="td" style={{textAlign:"right"}}>{d.n}</td><td className="td" style={{textAlign:"right",fontWeight:800,color:"#60a5fa",fontSize:13}}>{N(d.mt)}</td>{cm&&<><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pi)}</td><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pa)}</td></>}</tr>)}
      {s.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}><td className="td" colSpan={2} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL</td><td className="td" style={{textAlign:"right",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{totN}</td><td className="td" style={{textAlign:"right",fontWeight:900,color:"#60a5fa",borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(totMt)}</td>{cm&&<><td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(s.reduce((a,x)=>a+x[1].pi,0))}</td><td className="td" style={{textAlign:"right",fontWeight:800,color:"#10b981",borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(s.reduce((a,x)=>a+x[1].pa,0))}</td></>}</tr>}
    </tbody></table>{!s.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin datos.</div>}</div></div></div>;
}

// ═══ SCORECARD ═══
function SCV({teams,scores,svS,selT,bI,canEdit}){
  const at=teams.filter(t=>t.on);const[sel,setSel]=useState(selT||"");
  const tm=at.find(t=>t.id===sel);const sc=scores[sel]||{};
  function upd(cid,v){if(!canEdit)return;svS({...scores,[sel]:{...sc,[cid]:parseInt(v)||0}})}
  const ov=sel?getScore(scores,sel,teams):null;
  const oc=ov===null?"#334155":ov>=85?"#10b981":ov>=60?"#f59e0b":"#ef4444";

  return<div><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Scorecard de Cumplimiento</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 18px"}}>Evaluación según Manual Operativo de Instalación FPC</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:18}}>{at.map(t=>{const o=getScore(scores,t.id,teams);const c=o===null?"#334155":o>=85?"#10b981":o>=60?"#f59e0b":"#ef4444";
      return<button key={t.id} onClick={()=>setSel(t.id)} style={{padding:"8px 14px",borderRadius:10,border:sel===t.id?`2px solid ${c}`:"1px solid rgba(51,65,85,.3)",background:sel===t.id?`${c}08`:"transparent",color:sel===t.id?"#f1f5f9":"#64748b",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all .2s"}}><span style={{fontWeight:700}}>{t.inst.split(" ")[0]}</span>{o!==null&&<span style={{background:`${c}18`,color:c,padding:"2px 7px",borderRadius:99,fontSize:10,fontWeight:800}}>{o}</span>}</button>})}</div>

    {sel&&tm?<div>
      <div className="card" style={{marginBottom:14}}><div style={{padding:18,display:"flex",flexWrap:"wrap",gap:16,alignItems:"center"}}>
        <div style={{width:56,height:56,borderRadius:12,background:`${oc}12`,border:`2px solid ${oc}30`,color:oc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900}}>{ov!==null?ov:"—"}</div>
        <div style={{flex:1,minWidth:180}}><div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{tm.inst}</div><div style={{fontSize:12,color:"#64748b"}}>Ayudante: {tm.ay}</div></div>
        <Cat c={tm.cat} lg/>
        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:.5}}>Metros</div><div style={{fontSize:20,fontWeight:900,color:"#60a5fa"}}>{N(bI[tm.inst]?.mt||0)}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:.5}}>Instalaciones</div><div style={{fontSize:20,fontWeight:900,color:"#f1f5f9"}}>{bI[tm.inst]?.n||0}</div></div>
      </div></div>

      <div className="card"><div className="card-h"><span style={{color:oc}}>◎</span> Criterios — Categoría {tm.cat} ({tm.cat==="A"?"Cero tolerancia":"Tolerancia limitada"})</div>
        <div>{CRIT.map(c=>{const v=sc[c.id];const mx=tm.cat==="A"?c.A:c.B;
          let ic="⚪",cl="#334155";if(v!==undefined){if(c.cnt){ic=v===0?"🟢":v<=mx?"🟡":"🔴";cl=v===0?"#10b981":v<=mx?"#f59e0b":"#ef4444"}else{ic=v>=mx?"🟢":v>=mx*.8?"🟡":"🔴";cl=v>=mx?"#10b981":v>=mx*.8?"#f59e0b":"#ef4444"}}
          return<div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:"1px solid rgba(30,48,72,.2)",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(15,23,42,.4)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{c.l}</div><div style={{fontSize:11,color:"#475569"}}>{c.d} · Meta: {c.cnt?`máx ${mx}`:`${mx}%`}</div></div>
            <input className="inp" type="number" value={v!==undefined?v:""} onChange={e=>upd(c.id,e.target.value)} placeholder={c.cnt?"0":"100"} style={{width:72,textAlign:"center",fontSize:15,fontWeight:800,color:cl}} disabled={!canEdit}/>
          </div>})}</div>
      </div>
    </div>:<div style={{padding:50,textAlign:"center",color:"#334155"}}><div style={{fontSize:40,marginBottom:10}}>◎</div><div style={{fontSize:14}}>Seleccione un equipo para evaluar su scorecard</div></div>}
  </div>;
}

// ═══ CLASIFICACIÓN ═══
function CLV({teams,svT,scores,bI,canEdit}){
  return<div><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Clasificación A / B</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 6px"}}>Cat A = Técnico Elite (125% tabla) · Cat B = Estándar (100% tabla)</p>
    <p style={{fontSize:11,color:"#334155",margin:"0 0 18px"}}>Ascenso: 3 meses consecutivos cumplimiento total · Descenso: 1 evento crítico</p>
    <div style={{display:"grid",gap:10}}>{teams.filter(t=>t.on).map(t=>{const ov=getScore(scores,t.id,teams);const d=bI[t.inst]||{mt:0,n:0};const c=ov===null?"#334155":ov>=85?"#10b981":ov>=60?"#f59e0b":"#ef4444";
      return<div key={t.id} className="card" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",flexWrap:"wrap"}}>
        <div style={{width:44,height:44,borderRadius:10,background:`${c}10`,border:`1px solid ${c}25`,color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,flexShrink:0}}>{ov!==null?ov:"—"}</div>
        <div style={{flex:1,minWidth:160}}><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{t.inst}</div><div style={{fontSize:11,color:"#475569"}}>{t.ay} · {d.n} inst · {N(d.mt)} mts</div></div>
        <Cat c={t.cat} lg/>
        {canEdit&&<button className="btn" style={{background:t.cat==="A"?"rgba(239,68,68,.1)":"rgba(16,185,129,.1)",color:t.cat==="A"?"#f87171":"#34d399",fontSize:12,padding:"7px 14px",border:`1px solid ${t.cat==="A"?"rgba(239,68,68,.2)":"rgba(16,185,129,.2)"}`}} onClick={()=>svT(teams.map(x=>x.id===t.id?{...x,cat:x.cat==="A"?"B":"A"}:x))}>{t.cat==="A"?"↓ Bajar a B":"↑ Subir a A"}</button>}
      </div>})}</div></div>;
}

// ═══ EQUIPOS ═══
function EQV({teams,svT,canEdit}){
  const[sh,setSh]=useState(false);const[ni,setNi]=useState("");const[na,setNa]=useState("");
  function add(){if(!ni.trim()||!canEdit)return;svT([...teams,{id:"T"+Date.now().toString(36),inst:ni.trim().toUpperCase(),ay:na.trim().toUpperCase(),cat:"B",on:true}]);setNi("");setNa("");setSh(false)}
  return<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:0}}>Equipos de Instalación</h1>{canEdit&&<button className="btn bp" onClick={()=>setSh(true)}>+ Nuevo Equipo</button>}</div>
    {sh&&<div className="card" style={{marginBottom:14,padding:18}}><div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"end"}}><div style={{flex:1,minWidth:180}}><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Instalador</label><input className="inp" value={ni} onChange={e=>setNi(e.target.value)}/></div><div style={{flex:1,minWidth:180}}><label style={{fontSize:10,fontWeight:700,color:"#64748b",display:"block",marginBottom:5,textTransform:"uppercase"}}>Ayudante</label><input className="inp" value={na} onChange={e=>setNa(e.target.value)}/></div><button className="btn bs" onClick={add}>Guardar</button><button className="btn bg" onClick={()=>setSh(false)}>Cancelar</button></div></div>}
    <div style={{display:"grid",gap:8}}>{teams.map(t=><div key={t.id} className="card" style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",opacity:t.on?1:.4}}>
      <div style={{width:36,height:36,borderRadius:8,background:"rgba(30,48,72,.4)",color:"#60a5fa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900}}>{t.inst[0]}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{t.inst}</div><div style={{fontSize:11,color:"#475569"}}>Ayudante: {t.ay}</div></div>
      <Cat c={t.cat}/>
      {canEdit&&<button className="btn bg" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>svT(teams.map(x=>x.id===t.id?{...x,on:!x.on}:x))}>{t.on?"Desactivar":"Activar"}</button>}
    </div>)}</div></div>;
}

// ═══ TABLAS DE PAGO ═══
function TBV(){
  return<div><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Tablas de Pago por Metro</h1>
    <p style={{fontSize:13,color:"#475569",margin:"0 0 20px"}}>Categoría A (Técnico Elite 125%) vs Categoría B (Estándar 100%)</p>
    <div className="card"><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
      <th className="th">#</th><th className="th">Producto</th>
      <th className="th" style={{textAlign:"right",color:"#10b981"}}>A - Inst</th><th className="th" style={{textAlign:"right",color:"#10b981"}}>A - Ayud</th>
      <th className="th" style={{textAlign:"right",color:"#94a3b8"}}>B - Inst</th><th className="th" style={{textAlign:"right",color:"#94a3b8"}}>B - Ayud</th>
    </tr></thead><tbody>{PRODS.map((p,i)=>{const r=RATE[p];return<tr key={p}><td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td><td className="td" style={{fontWeight:600}}>{p}</td>
      <td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:700}}>{Q(r.A.i)}</td><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(r.A.a)}</td>
      <td className="td" style={{textAlign:"right",color:"#94a3b8",fontWeight:700}}>{Q(r.B.i)}</td><td className="td" style={{textAlign:"right",color:"#94a3b8"}}>{Q(r.B.a)}</td>
    </tr>})}</tbody></table></div></div></div>;
}

// ═══ PAGOS (Solo gerente/admin) ═══
function PGV({teams,bI,recs}){
  const s=Object.entries(bI).sort((a,b)=>b[1].pi-a[1].pi);const tPI=s.reduce((a,x)=>a+x[1].pi,0);const tPA=s.reduce((a,x)=>a+x[1].pa,0);
  return<div><h1 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:"0 0 20px"}}>💰 Pagos & Incentivos</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:20}}>
      <KPI label="Total Instaladores" value={Q(tPI)} accent="#60a5fa" icon="$"/>
      <KPI label="Total Ayudantes" value={Q(tPA)} accent="#60a5fa" icon="$"/>
      <KPI label="Gran Total" value={Q(tPI+tPA)} accent="#fbbf24" icon="★"/>
    </div>
    <div className="card"><div className="card-h"><span style={{color:"#fbbf24"}}>$</span> Detalle por Equipo</div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
        {["#","Instalador","Ayudante","Cat","Inst.","Mts","Q Inst","Q Ayud","Total Q"].map((h,i)=><th key={h} className="th" style={i>=4?{textAlign:"right"}:{}}>{h}</th>)}
      </tr></thead><tbody>
        {s.map(([n,d],i)=>{const t=teams.find(x=>x.inst===n);return<tr key={n}><td className="td" style={{color:"#334155",fontWeight:700}}>{i+1}</td><td className="td" style={{fontWeight:700}}>{n}</td><td className="td" style={{color:"#64748b"}}>{t?.ay||"—"}</td><td className="td">{t&&<Cat c={t.cat}/>}</td><td className="td" style={{textAlign:"right"}}>{d.n}</td><td className="td" style={{textAlign:"right",color:"#60a5fa",fontWeight:700}}>{N(d.mt)}</td><td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:700}}>{Q(d.pi)}</td><td className="td" style={{textAlign:"right",color:"#10b981"}}>{Q(d.pa)}</td><td className="td" style={{textAlign:"right",fontWeight:900,color:"#fbbf24",fontSize:13}}>{Q(d.pi+d.pa)}</td></tr>})}
        {s.length>0&&<tr style={{background:"rgba(12,20,36,.5)"}}><td className="td" colSpan={5} style={{fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>TOTAL</td><td className="td" style={{textAlign:"right",color:"#60a5fa",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{N(s.reduce((a,x)=>a+x[1].mt,0))}</td><td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(tPI)}</td><td className="td" style={{textAlign:"right",color:"#10b981",fontWeight:800,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(tPA)}</td><td className="td" style={{textAlign:"right",fontWeight:900,color:"#fbbf24",fontSize:14,borderTop:"2px solid rgba(30,48,72,.5)"}}>{Q(tPI+tPA)}</td></tr>}
      </tbody></table>{!s.length&&<div style={{padding:40,textAlign:"center",color:"#334155"}}>Sin datos.</div>}</div>
    </div>

    {s.length>0&&<div className="card" style={{marginTop:16}}>
      <div className="card-h"><span style={{color:"#8b5cf6"}}>▤</span> Desglose por Producto por Instalador</div>
      <div style={{padding:14}}>{s.map(([n,d])=>{if(!d.pr||!Object.keys(d.pr).length)return null;const ps=Object.entries(d.pr).sort((a,b)=>b[1].mt-a[1].mt);
        return<details key={n} style={{marginBottom:6}}><summary style={{cursor:"pointer",padding:"8px 0",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{n} — {N(d.mt)} mts — {Q(d.pi+d.pa)}</summary>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,margin:"4px 0 8px 20px"}}><thead><tr>{["Producto","Cant","Mts","Q Inst","Q Ayud"].map((h,i)=><th key={h} style={{padding:"4px 8px",textAlign:i>=1?"right":"left",color:"#475569",borderBottom:"1px solid rgba(30,48,72,.3)",fontSize:10,fontWeight:700}}>{h}</th>)}</tr></thead>
            <tbody>{ps.map(([p,v])=><tr key={p}><td style={{padding:"4px 8px",color:"#94a3b8"}}>{p}</td><td style={{padding:"4px 8px",textAlign:"right"}}>{v.n}</td><td style={{padding:"4px 8px",textAlign:"right",color:"#60a5fa"}}>{N(v.mt)}</td><td style={{padding:"4px 8px",textAlign:"right",color:"#10b981"}}>{Q(v.pi)}</td><td style={{padding:"4px 8px",textAlign:"right",color:"#10b981"}}>{Q(v.pa)}</td></tr>)}</tbody></table>
        </details>})}</div>
    </div>}
  </div>;
}
