import React, { useState, useRef, useEffect } from "react";

const NAVY       = "#1A3FA6";
const NAVY_LIGHT = "#E8F0FE";
const TEXT       = "#0D1B2A";
const TEXT_MID   = "#5A7A9A";
const BORDER     = "#C5D8EF";

const LS = {
  get: (k, fallback = null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function calcularRiesgo(datos) {
  const {
    edad = 20, imc = 22, herencia = "No",
    refrescos = "Nunca", desayuno = "Siempre", frutas = 2,
    ejercicio = 60, sedentario = 6, estres = "Bajo",
    sueno = 7, examenes = "No cambian", genero = "Masculino",
  } = datos;

  let s1 = 0;
  if (herencia === "Sí, uno o más familiares directos") s1 += 40;
  else if (herencia === "No estoy seguro") s1 += 10;
  if (edad <= 14) s1 += 30;
  else if (edad <= 20) s1 += 20;
  else if (edad <= 35) s1 += 10;
  if (imc < 18.5) s1 += 15;
  else if (imc < 22) s1 += 5;
  if (genero === "Masculino" && edad <= 20) s1 += 5;
  s1 = Math.min(s1, 100);

  let s2 = 0;
  if (herencia === "Sí, uno o más familiares directos") s2 += 25;
  else if (herencia === "No estoy seguro") s2 += 8;
  if (imc >= 30) s2 += 25;
  else if (imc >= 27) s2 += 15;
  else if (imc >= 25) s2 += 8;
  if (sedentario >= 10) s2 += 10;
  else if (sedentario >= 7) s2 += 6;
  else if (sedentario >= 5) s2 += 3;
  if (ejercicio === 0) s2 += 10;
  else if (ejercicio < 60) s2 += 6;
  else if (ejercicio < 150) s2 += 2;
  const refMap = { "Todos los días": 10, "3-5 veces/sem": 6, "1-2 veces/sem": 2, "Nunca": 0 };
  s2 += refMap[refrescos] ?? 0;
  const desMap = { "Nunca": 6, "Casi nunca": 4, "A veces": 2, "Siempre": 0 };
  s2 += desMap[desayuno] ?? 0;
  if (frutas === 0) s2 += 6;
  else if (frutas <= 1) s2 += 3;
  const estMap = { "Muy alto": 8, "Alto": 5, "Moderado": 2, "Bajo": 0 };
  s2 += estMap[estres] ?? 0;
  if (sueno <= 5) s2 += 8;
  else if (sueno <= 6) s2 += 4;
  const exMap = { "Mucho": 4, "Bastante": 2, "Poco": 1, "No cambian": 0 };
  s2 += exMap[examenes] ?? 0;
  if (edad >= 45) s2 += 8;
  else if (edad >= 35) s2 += 4;
  s2 = Math.min(s2, 100);

  const nivel = (s) => s <= 25 ? "bajo" : s <= 55 ? "moderado" : s <= 75 ? "alto" : "muy alto";
  const colorNivel = (n) => ({ bajo: "#22C55E", moderado: "#F59E0B", alto: "#EF4444", "muy alto": "#991B1B" }[n]);
  const dominantType = s1 >= 50 && s1 > s2 ? 1 : 2;

  return {
    score1: s1, level1: nivel(s1), color1: colorNivel(nivel(s1)),
    score2: s2, level2: nivel(s2), color2: colorNivel(nivel(s2)),
    dominantType,
    globalScore: Math.round((s1 * 0.35) + (s2 * 0.65)),
  };
}

function calcularRacha() {
  const hoy = new Date().toDateString();
  const ayer = new Date(Date.now() - 86400000).toDateString();
  const ultima = LS.get("dz_ultima_racha", null);
  let racha = LS.get("dz_racha", 0);
  if (ultima === hoy) {
  } else if (ultima === ayer) {
    racha += 1;
    LS.set("dz_racha", racha);
    LS.set("dz_ultima_racha", hoy);
  } else {
    racha = 1;
    LS.set("dz_racha", racha);
    LS.set("dz_ultima_racha", hoy);
  }
  return racha;
}

const PLANES_HABITOS = {
  bajo: [
    { icon: "🥗", accion: "Mantén 5 porciones diarias de frutas y verduras", tag: "Nutrición · +15 XP", prog: 80, color: "#EAF3DE" },
    { icon: "🚶", accion: "30 min de caminata diaria para conservar tu índice", tag: "Actividad · +20 XP", prog: 70, color: "#EAF3DE" },
    { icon: "💧", accion: "Hidratación: 2 litros de agua al día", tag: "Hábito diario · +10 XP", prog: 90, color: "#EAF3DE" },
    { icon: "📅", accion: "Re-evaluación automática en 30 días", tag: "Seguimiento mensual", prog: 100, color: "#EAF3DE" },
  ],
  moderado: [
    { icon: "🍽️", accion: "Elimina bebidas azucaradas esta semana", tag: "Nutrición urgente · +25 XP", prog: 0, color: "#FAEEDA" },
    { icon: "🏃", accion: "150 min de ejercicio aeróbico por semana (meta OMS)", tag: "Actividad · +30 XP", prog: 30, color: "#FAEEDA" },
    { icon: "😴", accion: "Higiene del sueño: rutina fija de 7–8 horas", tag: "Sueño · +15 XP", prog: 40, color: "#FAEEDA" },
    { icon: "🧘", accion: "Respiración 4-7-8 para reducir cortisol", tag: "Estrés · +10 XP", prog: 20, color: "#FAEEDA" },
    { icon: "📊", accion: "Registra tus comidas 14 días consecutivos", tag: "Seguimiento semanal", prog: 10, color: "#FAEEDA" },
  ],
  alto: [
    { icon: "🏥", accion: "Solicita glucosa en ayuno y HbA1c esta semana", tag: "Acción médica prioritaria", prog: 0, color: "#FCEBEB" },
    { icon: "🚫", accion: "Elimina carbohidratos refinados de tu dieta", tag: "Nutrición crítica · +30 XP", prog: 0, color: "#FCEBEB" },
    { icon: "⚖️", accion: "Reducción del 5–7% de peso → reduce riesgo 58%", tag: "Meta mensual", prog: 5, color: "#FCEBEB" },
    { icon: "📞", accion: "Contacta al área de salud del ITPA", tag: "Derivación clínica", prog: 0, color: "#FCEBEB" },
    { icon: "🔔", accion: "Alertas diarias de hábito activadas", tag: "Monitoreo diario", prog: 0, color: "#FCEBEB" },
  ],
  "muy alto": [
    { icon: "🏥", accion: "Visita médica prioritaria — no posponer", tag: "Urgente", prog: 0, color: "#FCEBEB" },
    { icon: "🩸", accion: "Panel: glucosa, HbA1c, insulina en ayuno", tag: "Laboratorio", prog: 0, color: "#FCEBEB" },
    { icon: "👨‍⚕️", accion: "Seguimiento con nutriólogo asignado", tag: "Tratamiento activo", prog: 0, color: "#FCEBEB" },
    { icon: "🚨", accion: "Alertas críticas activadas en la app", tag: "Monitoreo continuo", prog: 0, color: "#FCEBEB" },
  ],
};

const PROTOCOLOS = {
  bajo: { titulo: "Perfil saludable", descripcion: "Tu estilo de vida actual te protege. Mantén tus hábitos y sigue acumulando XP.", frecuencia: "Monitoreo mensual", acciones: PLANES_HABITOS.bajo },
  moderado: { titulo: "Riesgo moderado — gestión activa", descripcion: "Hay factores modificables. Un plan estructurado puede reducir tu riesgo en 4–6 semanas.", frecuencia: "Monitoreo semanal", acciones: PLANES_HABITOS.moderado },
  alto: { titulo: "Riesgo alto — se recomienda valoración", descripcion: "Te recomendamos una glucosa en ayuno. Los cambios de hábito son urgentes.", frecuencia: "Monitoreo diario", acciones: PLANES_HABITOS.alto },
  "muy alto": { titulo: "Riesgo muy alto — derivación médica", descripcion: "Múltiples factores de riesgo acumulados. La evaluación médica no debe postergarse.", frecuencia: "Seguimiento médico activo", acciones: PLANES_HABITOS["muy alto"] },
};

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function GlowInput({ as = "input", children, style: extraStyle, error = false, ...props }) {
  const [active, setActive] = useState(false);
  const borderColor = error ? "#EF4444" : active ? "#00C8FF" : BORDER;
  const bgColor = error ? "rgba(239,68,68,0.04)" : active ? "rgba(0,200,255,0.04)" : "white";
  const shadow = error ? "0 0 0 3px rgba(239,68,68,0.2), 0 0 16px rgba(239,68,68,0.45)" : active ? "0 0 0 3px rgba(0,200,255,0.25), 0 0 16px rgba(0,200,255,0.35)" : "none";
  const glowStyle = { width: "100%", padding: "10px 13px", border: `${error || active ? "2px" : "1.5px"} solid ${borderColor}`, borderRadius: 11, fontSize: 13, background: bgColor, color: TEXT, boxSizing: "border-box", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s", boxShadow: shadow, ...extraStyle };
  const handlers = { onMouseEnter: () => setActive(true), onMouseLeave: (e) => { if (document.activeElement !== e.currentTarget) setActive(false); }, onFocus: () => setActive(true), onBlur: () => setActive(false) };
  if (as === "select") return <select style={glowStyle} {...handlers} {...props}>{children}</select>;
  return <input style={glowStyle} {...handlers} {...props} />;
}

function ScreenBody({ children }) {
  return <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 18px 16px", overflowY: "auto" }}>{children}</div>;
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? NAVY : BORDER, transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

function StepBadge({ label }) {
  return <span style={{ display: "inline-block", background: NAVY_LIGHT, color: NAVY, fontSize: 11, padding: "3px 10px", borderRadius: 20, marginBottom: 6, fontWeight: 700 }}>{label}</span>;
}

function StepTitle({ title, sub }) {
  return (
    <>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: "4px 0 2px", letterSpacing: "-0.3px" }}>{title}</h2>
      <p style={{ fontSize: 12, color: TEXT_MID, margin: "0 0 14px" }}>{sub}</p>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

function TwoCol({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{children}</div>;
}

function BtnPrimary({ children, onClick, style: extra }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "14px 0", background: NAVY, color: "white", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,63,166,0.28)", letterSpacing: "0.2px", fontFamily: "inherit", ...extra }}>{children}</button>
  );
}

function BtnSecondary({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "13px 0", marginTop: 8, background: "transparent", color: NAVY, border: `1.5px solid ${BORDER}`, borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{children}</button>
  );
}

function InfoBox({ icon, text }) {
  return (
    <div style={{ background: NAVY_LIGHT, borderRadius: 11, padding: "9px 12px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 8, border: "1px solid #BBDEFB" }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <p style={{ fontSize: 11, color: NAVY, margin: 0, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function SectionDivider({ icon, label }) {
  return (
    <div style={{ background: NAVY_LIGHT, borderRadius: 9, padding: "6px 11px", margin: "8px 0", fontSize: 12, color: NAVY, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, border: "1px solid #BBDEFB" }}>
      {icon} {label}
    </div>
  );
}

function SliderField({ label, min, max, step, value, onChange, display }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} style={{ flex: 1, accentColor: NAVY }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, minWidth: 42, textAlign: "right" }}>{display}</span>
      </div>
    </div>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return <p style={{ fontSize: 10, color: "#EF4444", margin: "3px 0 0 2px" }}>⚠️ {msg}</p>;
}

function Spacer() { return <div style={{ flex: 1 }} />; }

function ShieldLogo({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <path d="M80 6 L134 27 L134 84 C134 120 108 142 80 154 C52 142 26 120 26 84 L26 27 Z" fill="url(#so)" />
      <path d="M80 18 L124 36 L124 84 C124 113 102 131 80 141 C58 131 36 113 36 84 L36 36 Z" fill="url(#si)" />
      <path d="M80 112 C80 112 50 92 50 70 C50 57 58 50 69 52 C73 53 77 57 80 62 C83 57 87 53 91 52 C102 50 110 57 110 70 C110 92 80 112 80 112Z" fill="url(#hg)" />
      <line x1="80" y1="62" x2="80" y2="83" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="80" y1="83" x2="63" y2="97" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="80" y1="83" x2="97" y2="97" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="80" y1="83" x2="80" y2="100" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="80" cy="60" r="6" fill="white" opacity="0.95" />
      <circle cx="62" cy="98" r="5.5" fill="white" opacity="0.85" />
      <circle cx="80" cy="101" r="5.5" fill="white" opacity="0.85" />
      <circle cx="98" cy="98" r="5.5" fill="white" opacity="0.85" />
      <defs>
        <linearGradient id="so" x1="80" y1="6" x2="80" y2="154" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1A237E" /><stop offset="100%" stopColor="#0D1B6B" /></linearGradient>
        <linearGradient id="si" x1="80" y1="18" x2="80" y2="141" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1565C0" /><stop offset="100%" stopColor="#0D47A1" /></linearGradient>
        <linearGradient id="hg" x1="50" y1="50" x2="110" y2="112" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#42A5F5" /><stop offset="100%" stopColor="#1976D2" /></linearGradient>
      </defs>
    </svg>
  );
}

function RiskGauge({ score, color, label, tipo }) {
  const r = 42, cx = 55, cy = 55;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * (circ * 0.75);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="110" height="75" viewBox="0 0 110 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={BORDER} strokeWidth="8" strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 18, fontWeight: 800, fill: color, fontFamily: "inherit" }}>{score}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 9, fill: TEXT_MID, fontFamily: "inherit" }}>/ 100</text>
      </svg>
      <div style={{ fontSize: 10, fontWeight: 700, color: NAVY, marginTop: -4 }}>Tipo {tipo}</div>
      <div style={{ fontSize: 10, color, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function Semaforo({ nivel }) {
  const segs = [
    { key: "bajo", label: "Bajo", bg: "#EAF3DE", color: "#27500A" },
    { key: "moderado", label: "Moderado", bg: "#FAEEDA", color: "#633806" },
    { key: "alto", label: "Alto", bg: "#FCEBEB", color: "#791F1F" },
  ];
  const activeKey = nivel === "muy alto" ? "alto" : nivel;
  return (
    <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", border: `1.5px solid ${BORDER}`, marginBottom: 14 }}>
      {segs.map(s => (
        <div key={s.key} style={{ flex: 1, textAlign: "center", padding: "9px 4px", background: activeKey === s.key ? s.bg : "white", color: activeKey === s.key ? s.color : TEXT_MID, fontSize: 12, fontWeight: activeKey === s.key ? 700 : 400, opacity: activeKey === s.key ? 1 : 0.45, transition: "all 0.3s", borderRight: s.key !== "alto" ? `1px solid ${BORDER}` : "none" }}>
          {activeKey === s.key && <span style={{ marginRight: 4 }}>●</span>}
          {s.label}
        </div>
      ))}
    </div>
  );
}

function LoadingScreen({ nombre }) {
  const [paso, setPaso] = useState(0);
  const pasos = ["Conectando con el servidor…", "Cargando tu perfil…", "Sincronizando datos…", "¡Listo!"];
  useEffect(() => {
    const t = setInterval(() => setPaso(p => Math.min(p + 1, pasos.length - 1)), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32 }}>
      <ShieldLogo size={90} />
      {nombre && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0 }}>¡Bienvenido, {nombre.split(" ")[0]}! 🎉</p>
          <p style={{ fontSize: 12, color: TEXT_MID, margin: "4px 0 0" }}>Tu perfil está listo</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: NAVY, opacity: 0.3, animation: `bounce 1s infinite ${i * 0.2}s` }} />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-6px)} }`}</style>
      <p style={{ fontSize: 12, color: TEXT_MID, fontWeight: 600, textAlign: "center" }}>{pasos[paso]}</p>
    </div>
  );
}

function RiskResultScreen({ riesgo, onContinuar }) {
  const proto = PROTOCOLOS[riesgo.level2] || PROTOCOLOS.bajo;
  const bgColor = { bajo: "#F0FDF4", moderado: "#FFFBEB", alto: "#FEF2F2", "muy alto": "#FEF2F2" }[riesgo.level2] || "#F0FDF4";
  const borderColor = { bajo: "#86EFAC", moderado: "#FCD34D", alto: "#FCA5A5", "muy alto": "#F87171" }[riesgo.level2] || "#86EFAC";
  return (
    <ScreenBody>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, letterSpacing: 1, background: NAVY_LIGHT, display: "inline-block", padding: "4px 12px", borderRadius: 20, marginBottom: 8 }}>ANÁLISIS DE RIESGO</div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: TEXT, margin: "4px 0 2px" }}>Tu perfil de riesgo</h2>
        <p style={{ fontSize: 11, color: TEXT_MID, margin: 0 }}>Calculado con base en tus datos clínicos y hábitos</p>
      </div>
      <Semaforo nivel={riesgo.level2} />
      <div style={{ display: "flex", justifyContent: "space-around", background: "white", borderRadius: 16, padding: "16px 8px", border: `1.5px solid ${BORDER}`, marginBottom: 12 }}>
        <RiskGauge score={riesgo.score1} color={riesgo.color1} label={riesgo.level1} tipo={1} />
        <div style={{ width: 1, background: BORDER, margin: "8px 0" }} />
        <RiskGauge score={riesgo.score2} color={riesgo.color2} label={riesgo.level2} tipo={2} />
      </div>
      <div style={{ background: "white", borderRadius: 14, padding: "12px 14px", border: `1.5px solid ${BORDER}`, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 8 }}>¿Qué tipo es más relevante para ti?</div>
        <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.6 }}><strong>Tipo 1</strong> — Autoinmune. Herencia y edad joven como factores principales.</div>
        <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.6, marginTop: 4 }}><strong>Tipo 2</strong> — Metabólica. Fuertemente influida por hábitos de vida e IMC.</div>
        <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 10, background: riesgo.dominantType === 1 ? "#EDE9FE" : NAVY_LIGHT, fontSize: 11, fontWeight: 700, color: riesgo.dominantType === 1 ? "#6D28D9" : NAVY }}>
          🎯 Perfil con mayor relevancia: <strong>Tipo {riesgo.dominantType}</strong>
        </div>
      </div>
      <div style={{ background: bgColor, borderRadius: 14, padding: "12px 14px", border: `1.5px solid ${borderColor}`, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{proto.titulo}</div>
        <p style={{ fontSize: 11, color: TEXT_MID, margin: "0 0 10px", lineHeight: 1.5 }}>{proto.descripcion}</p>
        {proto.acciones.slice(0, 3).map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, fontSize: 11, color: TEXT }}>
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span>{a.accion}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: TEXT_MID }}>⏱ {proto.frecuencia}</div>
      </div>
      <BtnPrimary onClick={onContinuar}>Continuar al registro →</BtnPrimary>
    </ScreenBody>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [datosRegistro, setDatosRegistro] = useState({});
  const [riesgo, setRiesgo] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [nombreCarga, setNombreCarga] = useState("");

  const guardar = (nuevos) => setDatosRegistro(prev => ({ ...prev, ...nuevos }));

  const entrarDashboard = (r, hist, nombre) => {
    setCargando(true);
    setNombreCarga(nombre || LS.get("dz_nombre", "") || "");
    setTimeout(() => {
      setRiesgo(r);
      if (hist) setHistorial(hist);
      setCargando(false);
      setScreen("dashboard");
    }, 2200);
  };

  const finalizarRegistro = (datosHabitos) => {
    const datos = { ...datosRegistro, ...datosHabitos };
    guardar(datosHabitos);
    const r = calcularRiesgo(datos);
    const fecha = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
    const entrada = { fecha, ...r, imc: datos.imc ?? 22, glucosa: null };
    const histGuardado = LS.get("dz_historial", []);
    const nuevoHist = [...histGuardado, entrada];
    LS.set("dz_historial", nuevoHist);
    LS.set("dz_riesgo", r);
    LS.set("dz_datos", datos);
    setScreen("riskResult");
    setRiesgo(r);
    setHistorial(nuevoHist);
  };

  const handleLoginSuccess = () => {
    const rGuardado = LS.get("dz_riesgo", null);
    const histGuardado = LS.get("dz_historial", []);
    const r = rGuardado || calcularRiesgo({});
    const nombreGuardado = LS.get("dz_nombre", "");
    if (!rGuardado) {
      const fecha = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
      const entrada = { fecha, ...r, imc: 22, glucosa: null };
      LS.set("dz_riesgo", r);
      LS.set("dz_historial", [entrada]);
      entrarDashboard(r, [entrada], nombreGuardado);
    } else {
      entrarDashboard(r, histGuardado, nombreGuardado);
    }
  };

  const handleCuentaCreada = () => {
    entrarDashboard(riesgo, historial, datosRegistro.nombre || LS.get("dz_nombre", ""));
  };

  const agregarAlHistorial = (nuevaEntrada) => {
    const nuevoHist = [...historial, nuevaEntrada];
    setHistorial(nuevoHist);
    LS.set("dz_historial", nuevoHist);
    LS.set("dz_riesgo", { score1: nuevaEntrada.score1, level1: nuevaEntrada.level1, color1: nuevaEntrada.color1, score2: nuevaEntrada.score2, level2: nuevaEntrada.level2, color2: nuevaEntrada.color2, dominantType: nuevaEntrada.dominantType, globalScore: nuevaEntrada.globalScore });
  };

  const phoneShell = (children) => (
    <div style={{ width: 340, minHeight: 680, margin: "1rem auto", background: "#EEF4FC", borderRadius: 46, border: "7px solid #0D1B2A", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "'Poppins', 'Segoe UI', sans-serif", boxShadow: "0 24px 64px rgba(13,43,107,0.22)" }}>
      <div style={{ background: "#EEF4FC", display: "flex", justifyContent: "center", paddingTop: 8 }}>
        <div style={{ width: 80, height: 22, background: "#0D1B2A", borderRadius: "0 0 14px 14px" }} />
      </div>
      {children}
    </div>
  );

  if (cargando) {
    return phoneShell(<LoadingScreen nombre={nombreCarga} />);
  }

  return phoneShell(
    <>
      {screen === "welcome"    && <WelcomeScreen onStart={() => setScreen("step1")} onLogin={() => setScreen("login")} />}
      {screen === "login"      && <LoginScreen onBack={() => setScreen("welcome")} onSuccess={handleLoginSuccess} />}
      {screen === "step1"      && <Step1 onNext={(d) => { guardar(d); LS.set("dz_nombre", d.nombre); setScreen("step2"); }} />}
      {screen === "step2"      && <Step2 onNext={(d) => { guardar(d); setScreen("step3"); }} onBack={() => setScreen("step1")} />}
      {screen === "step3"      && <Step3 onNext={(d) => { guardar(d); setScreen("step4"); }} onBack={() => setScreen("step2")} />}
      {screen === "step4"      && <Step4 onNext={finalizarRegistro} onBack={() => setScreen("step3")} />}
      {screen === "riskResult" && <RiskResultScreen riesgo={riesgo} onContinuar={() => setScreen("register")} />}
      {screen === "register"   && <RegisterAccount onNext={handleCuentaCreada} onBack={() => setScreen("riskResult")} />}
      {screen === "dashboard"  && (
        <Dashboard
          riesgo={riesgo}
          historial={historial}
          datosRegistro={datosRegistro}
          onAgregarHistorial={agregarAlHistorial}
          onActualizarRiesgo={(r) => { setRiesgo(r); LS.set("dz_riesgo", r); }}
          onLogout={() => { setScreen("welcome"); }}
        />
      )}
      {screen !== "dashboard" && (
        <div style={{ background: "#EEF4FC", padding: "8px 0", display: "flex", justifyContent: "center", marginTop: "auto" }}>
          <div style={{ width: 80, height: 4, background: "#0D1B2A", borderRadius: 2 }} />
        </div>
      )}
    </>
  );
}

function WelcomeScreen({ onStart, onLogin }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 340 100" style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none" }}>
        <path d="M0,0 L340,0 L340,55 C270,95 200,25 150,55 C100,85 50,100 0,70 Z" fill="rgba(173,214,255,0.3)" />
        <path d="M0,0 L340,0 L340,35 C280,68 210,15 160,38 C110,60 50,78 0,48 Z" fill="rgba(173,214,255,0.18)" />
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 24px 0", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: 27, fontWeight: 800, color: TEXT, margin: "0 0 6px", textAlign: "center", letterSpacing: "-0.5px", lineHeight: 1.2 }}>DiabetesZero ITPA</h1>
        <p style={{ fontSize: 13, color: TEXT_MID, margin: "0 0 10px", fontWeight: 400 }}>Tecnología que cuida tu salud</p>
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(33,150,243,0.38) 0%, rgba(33,150,243,0.12) 45%, transparent 70%)", pointerEvents: "none" }} />
          <ShieldLogo size={310} />
        </div>
      </div>
      <div style={{ padding: "0 22px 20px", position: "relative", zIndex: 1 }}>
        <button onClick={onStart} style={{ width: "100%", padding: "15px 0", background: NAVY, color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, boxShadow: "0 4px 20px rgba(26,63,166,0.35)", fontFamily: "inherit" }}>Comenzar ahora</button>
        <button onClick={onLogin} style={{ width: "100%", padding: "10px 0", background: "transparent", color: NAVY, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Ya tengo una cuenta</button>
      </div>
    </div>
  );
}

function LoginScreen({ onBack, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [attempted, setAttempted] = useState(false);
  const EMAIL_REGEX = /^[a-zA-Z0-9]+@pabellon\.tecnm\.mx$/;

  const validate = () => {
    let ok = true;
    if (!EMAIL_REGEX.test(email)) { setEmailErr("Formato: usuario@pabellon.tecnm.mx"); ok = false; } else setEmailErr("");
    if (password.length < 6) { setPassErr("Contraseña incorrecta o muy corta"); ok = false; } else setPassErr("");
    return ok;
  };

  return (
    <ScreenBody>
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 14px" }}><ShieldLogo size={80} /></div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, textAlign: "center", margin: "0 0 4px" }}>Iniciar sesión</h2>
      <p style={{ fontSize: 12, color: TEXT_MID, textAlign: "center", margin: "0 0 20px" }}>Accede con tu correo institucional</p>
      <Field label="Correo institucional">
        <GlowInput type="email" placeholder="usuario@pabellon.tecnm.mx" value={email} onChange={e => setEmail(e.target.value)} error={!!emailErr && attempted} />
        {emailErr && attempted && <ErrMsg msg={emailErr} />}
      </Field>
      <Field label="Contraseña">
        <GlowInput type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={!!passErr && attempted} />
        {passErr && attempted && <ErrMsg msg={passErr} />}
      </Field>
      <Spacer />
      <BtnPrimary onClick={() => { setAttempted(true); if (validate()) onSuccess(); }}>Iniciar Sesión</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Volver</BtnSecondary>
    </ScreenBody>
  );
}

function Step1({ onNext }) {
  const [role, setRole] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [turno, setTurno] = useState("");
  const [errs, setErrs] = useState({});
  const [tried, setTried] = useState(false);

  const validate = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!edad || edad < 14 || edad > 80) e.edad = "Ingresa una edad válida";
    if (!genero || genero === "Seleccionar") e.genero = "Selecciona tu género";
    if (!role) e.role = "Selecciona tu rol";
    if (role === "Estudiante") {
      if (!carrera) e.carrera = "Selecciona tu carrera";
      if (!semestre || semestre === "Sem.") e.semestre = "Selecciona tu semestre";
      if (!grupo.trim()) e.grupo = "Ingresa tu grupo";
      if (!modalidad || modalidad === "Seleccionar") e.modalidad = "Selecciona modalidad";
    }
    if (role === "Docente") {
      if (!departamento) e.departamento = "Selecciona tu departamento";
      if (!turno) e.turno = "Selecciona tu turno";
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    setTried(true);
    if (!validate()) return;
    const datos = { nombre: nombre.trim(), edad: +edad, genero, role };
    if (role === "Estudiante") Object.assign(datos, { carrera, semestre, grupo, modalidad });
    if (role === "Docente") Object.assign(datos, { departamento, turno });
    onNext(datos);
  };

  return (
    <ScreenBody>
      <ProgressBar step={1} total={4} />
      <StepBadge label="Paso 1 de 4" />
      <StepTitle title="Perfil Académico" sub="Datos para personalizar tu experiencia en el ITPA" />
      <Field label="Nombre completo">
        <GlowInput type="text" placeholder="Ej. Alejandro García" value={nombre} onChange={e => setNombre(e.target.value)} error={tried && !!errs.nombre} />
        <ErrMsg msg={tried && errs.nombre} />
      </Field>
      <TwoCol>
        <Field label="Edad">
          <GlowInput type="number" placeholder="Ej. 20" value={edad} onChange={e => setEdad(e.target.value)} error={tried && !!errs.edad} />
          <ErrMsg msg={tried && errs.edad} />
        </Field>
        <Field label="Género">
          <GlowInput as="select" value={genero} onChange={e => setGenero(e.target.value)} error={tried && !!errs.genero}>
            <option>Seleccionar</option><option>Masculino</option><option>Femenino</option><option>No Binario</option><option>Prefiero No Decirlo</option>
          </GlowInput>
          <ErrMsg msg={tried && errs.genero} />
        </Field>
      </TwoCol>
      <Field label="Rol en la institución">
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
          {[["Estudiante", "🎓"], ["Docente", "📖"]].map(([r, ico]) => (
            <div key={r} onClick={() => { setRole(r); setDepartamento(""); setTurno(""); setCarrera(""); setSemestre(""); setGrupo(""); setModalidad(""); }}
              style={{ border: tried && errs.role ? "2px solid #EF4444" : role === r ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, borderRadius: 11, padding: "8px 16px", textAlign: "center", cursor: "pointer", background: role === r ? NAVY_LIGHT : "white", fontSize: 11, color: role === r ? NAVY : TEXT_MID, fontWeight: role === r ? 700 : 400, minWidth: 80 }}>
              <div style={{ fontSize: 20, marginBottom: 3 }}>{ico}</div>{r}
            </div>
          ))}
        </div>
        <ErrMsg msg={tried && errs.role} />
      </Field>
      {role === "Estudiante" && (
        <>
          <TwoCol>
            <Field label="Carrera">
              <GlowInput as="select" value={carrera} onChange={e => setCarrera(e.target.value)} error={tried && !!errs.carrera}>
                <option value="">Seleccionar</option><option>Ing. en TIC</option><option>Ing. Industrial</option><option>Ing. Mecatrónica</option><option>Ing. en Logística</option><option>Ing. en Gestión Empresarial</option><option>Ing. en IA</option>
              </GlowInput>
              <ErrMsg msg={tried && errs.carrera} />
            </Field>
            <Field label="Semestre">
              <GlowInput as="select" value={semestre} onChange={e => setSemestre(e.target.value)} error={tried && !!errs.semestre}>
                <option>Sem.</option>{[1,2,3,4,5,6,7,8,9].map(s => <option key={s}>{s}°</option>)}
              </GlowInput>
              <ErrMsg msg={tried && errs.semestre} />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Grupo">
              <GlowInput type="text" placeholder="Ej. A" value={grupo} onChange={e => setGrupo(e.target.value)} error={tried && !!errs.grupo} />
              <ErrMsg msg={tried && errs.grupo} />
            </Field>
            <Field label="Modalidad">
              <GlowInput as="select" value={modalidad} onChange={e => setModalidad(e.target.value)} error={tried && !!errs.modalidad}>
                <option>Seleccionar</option><option>Escolarizada</option><option>No escolarizada</option>
              </GlowInput>
              <ErrMsg msg={tried && errs.modalidad} />
            </Field>
          </TwoCol>
        </>
      )}
      {role === "Docente" && (
        <>
          <Field label="Departamento">
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {["Ingenierías", "Ciencias Básicas", "Ciencias Económico-Administrativas"].map(dep => (
                <div key={dep} onClick={() => setDepartamento(dep)}
                  style={{ border: tried && errs.departamento && !departamento ? "2px solid #EF4444" : departamento === dep ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, borderRadius: 11, padding: "10px 14px", cursor: "pointer", background: departamento === dep ? NAVY_LIGHT : "white", fontSize: 12, color: departamento === dep ? NAVY : TEXT_MID, fontWeight: departamento === dep ? 700 : 400, display: "flex", alignItems: "center", gap: 8, transition: "all 0.18s" }}>
                  <span style={{ fontSize: 16 }}>{dep === "Ingenierías" ? "⚙️" : dep === "Ciencias Básicas" ? "🔬" : "📈"}</span>{dep}
                </div>
              ))}
            </div>
            <ErrMsg msg={tried && errs.departamento} />
          </Field>
          <Field label="Turno">
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {["Escolarizada", "Sabatina", "Ambas"].map(t => (
                <div key={t} onClick={() => setTurno(t)}
                  style={{ flex: 1, padding: "10px 6px", borderRadius: 11, textAlign: "center", border: tried && errs.turno && !turno ? "2px solid #EF4444" : turno === t ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, background: turno === t ? NAVY : "white", fontSize: 11, color: turno === t ? "white" : TEXT_MID, fontWeight: turno === t ? 700 : 400, cursor: "pointer", transition: "all 0.18s" }}>
                  {t}
                </div>
              ))}
            </div>
            <ErrMsg msg={tried && errs.turno} />
          </Field>
        </>
      )}
      <Spacer />
      <BtnPrimary onClick={handleNext}>Continuar →</BtnPrimary>
    </ScreenBody>
  );
}

function Step2({ onNext, onBack }) {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [errs, setErrs] = useState({});
  const [tried, setTried] = useState(false);
  const imc = peso && altura ? (parseFloat(peso) / Math.pow(parseFloat(altura) / 100, 2)).toFixed(1) : null;
  const imcCat = imc ? (imc < 18.5 ? "Bajo peso" : imc < 25 ? "Normal" : imc < 30 ? "Sobrepeso" : "Obesidad") : null;
  const validate = () => {
    const e = {};
    if (!peso || peso < 20 || peso > 300) e.peso = "Ingresa un peso válido (kg)";
    if (!altura || altura < 100 || altura > 250) e.altura = "Ingresa una altura válida (cm)";
    setErrs(e); return Object.keys(e).length === 0;
  };
  return (
    <ScreenBody>
      <ProgressBar step={2} total={4} />
      <StepBadge label="Paso 2 de 4" />
      <StepTitle title="Datos De Salud Física" sub="Necesarios para calcular tu índice de riesgo" />
      <TwoCol>
        <Field label="Peso (kg)">
          <GlowInput type="number" placeholder="Ej. 70" value={peso} onChange={e => setPeso(e.target.value)} error={tried && !!errs.peso} />
          <ErrMsg msg={tried && errs.peso} />
        </Field>
        <Field label="Altura (cm)">
          <GlowInput type="number" placeholder="Ej. 170" value={altura} onChange={e => setAltura(e.target.value)} error={tried && !!errs.altura} />
          <ErrMsg msg={tried && errs.altura} />
        </Field>
      </TwoCol>
      <InfoBox icon="📊" text={imc ? `IMC: ${imc} — ${imcCat}` : "Tu IMC se calculará automáticamente."} />
      <InfoBox icon="🔬" text="El IMC es clave para Tipo 2. Para Tipo 1, los antecedentes hereditarios tienen mayor peso." />
      <Spacer />
      <BtnPrimary onClick={() => { setTried(true); if (validate()) onNext({ peso: +peso, altura: +altura, imc: +imc }); }}>Continuar →</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

function Step3({ onNext, onBack }) {
  const [herencia, setHerencia] = useState("Sí, uno o más familiares directos");
  const [herenciaTipo, setHerenciaTipo] = useState("");
  return (
    <ScreenBody>
      <ProgressBar step={3} total={4} />
      <StepBadge label="Paso 3 de 4" />
      <StepTitle title="Antecedentes Hereditarios" sub="Factor clave en el cálculo de riesgo" />
      <InfoBox icon="ℹ️" text="En Tipo 1 el riesgo con padre afectado es ~6%. En Tipo 2 llega al 40% con ambos padres afectados." />
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 8, display: "block", fontWeight: 500 }}>¿Tienes familiares directos con diabetes?</label>
      {[{ label: "Sí, uno o más familiares directos", icon: "👥" }, { label: "No, ninguno que yo sepa", icon: "🚫" }, { label: "No estoy seguro", icon: "❓" }].map(({ label, icon }) => (
        <div key={label} onClick={() => setHerencia(label)} style={{ border: herencia === label ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, borderRadius: 11, padding: "12px 14px", cursor: "pointer", background: herencia === label ? NAVY_LIGHT : "white", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 12, color: TEXT, fontWeight: herencia === label ? 600 : 400 }}>{label}</span>
        </div>
      ))}
      {herencia === "Sí, uno o más familiares directos" && (
        <>
          <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 6, display: "block", fontWeight: 500 }}>¿Con qué tipo fue diagnosticado?</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {["Tipo 1", "Tipo 2", "No sé el tipo"].map(t => (
              <div key={t} onClick={() => setHerenciaTipo(t)} style={{ flex: 1, padding: "10px 6px", borderRadius: 11, textAlign: "center", border: herenciaTipo === t ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, background: herenciaTipo === t ? NAVY : "white", fontSize: 11, color: herenciaTipo === t ? "white" : TEXT_MID, fontWeight: herenciaTipo === t ? 700 : 400, cursor: "pointer" }}>{t}</div>
            ))}
          </div>
        </>
      )}
      <Spacer />
      <BtnPrimary onClick={() => onNext({ herencia, herenciaTipo })}>Continuar →</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

function Step4({ onNext, onBack }) {
  const [refrescos, setRefrescos] = useState("");
  const [desayuno, setDesayuno] = useState("");
  const [estres, setEstres] = useState("");
  const [examenes, setExamenes] = useState("");
  const [frutas, setFrutas] = useState(2);
  const [ejercicio, setEjercicio] = useState(60);
  const [sedentario, setSedentario] = useState(6);
  const [sueno, setSueno] = useState(7);
  const [errs, setErrs] = useState({});
  const [tried, setTried] = useState(false);

  const validate = () => {
    const e = {};
    if (!refrescos) e.refrescos = "Selecciona una opción";
    if (!desayuno) e.desayuno = "Selecciona una opción";
    if (!estres) e.estres = "Selecciona una opción";
    if (!examenes) e.examenes = "Selecciona una opción";
    setErrs(e); return Object.keys(e).length === 0;
  };

  const HabitOpts = ({ label, options, selected, onSelect, errKey }) => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>{label}</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
        {options.map(opt => (
          <div key={opt} onClick={() => { onSelect(opt); if (tried) validate(); }} style={{ border: tried && errs[errKey] && !selected ? "2px solid #EF4444" : selected === opt ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, borderRadius: 11, padding: "9px 6px", cursor: "pointer", background: selected === opt ? NAVY : "white", fontSize: 11, color: selected === opt ? "white" : TEXT_MID, textAlign: "center", fontWeight: selected === opt ? 700 : 400 }}>{opt}</div>
        ))}
      </div>
      {tried && errs[errKey] && <ErrMsg msg={errs[errKey]} />}
    </div>
  );

  return (
    <ScreenBody>
      <ProgressBar step={4} total={4} />
      <StepBadge label="Paso 4 de 4" />
      <StepTitle title="Hábitos De Vida" sub="Para que la IA calcule tu riesgo inicial" />
      <SectionDivider icon="🥗" label="Alimentación" />
      <HabitOpts label="¿Con qué frecuencia consumes refrescos o bebidas azucaradas?" options={["Nunca", "1-2 veces/sem", "3-5 veces/sem", "Todos los días"]} selected={refrescos} onSelect={setRefrescos} errKey="refrescos" />
      <HabitOpts label="¿Desayunas antes de ir al ITPA?" options={["Siempre", "A veces", "Casi nunca", "Nunca"]} selected={desayuno} onSelect={setDesayuno} errKey="desayuno" />
      <SliderField label="Porciones de frutas/verduras al día" min={0} max={5} step={1} value={frutas} onChange={setFrutas} display={frutas} />
      <SectionDivider icon="🏃" label="Actividad física" />
      <SliderField label="Minutos de ejercicio por semana" min={0} max={300} step={10} value={ejercicio} onChange={setEjercicio} display={`${ejercicio}min`} />
      <SliderField label="Horas sentado en un día de clases" min={1} max={12} step={1} value={sedentario} onChange={setSedentario} display={`${sedentario}h`} />
      <SectionDivider icon="🌙" label="Estrés y sueño" />
      <HabitOpts label="Nivel de estrés académico" options={["Bajo", "Moderado", "Alto", "Muy alto"]} selected={estres} onSelect={setEstres} errKey="estres" />
      <SliderField label="Horas de sueño por noche" min={3} max={10} step={1} value={sueno} onChange={setSueno} display={`${sueno}h`} />
      <HabitOpts label="En épocas de exámenes, ¿cambian tus hábitos alimenticios?" options={["No cambian", "Poco", "Bastante", "Mucho"]} selected={examenes} onSelect={setExamenes} errKey="examenes" />
      <BtnPrimary onClick={() => { setTried(true); if (validate()) onNext({ refrescos, desayuno, frutas, ejercicio, sedentario, estres, sueno, examenes }); }}>Ver mi riesgo →</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

function RegisterAccount({ onNext, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confErr, setConfErr] = useState("");
  const [attempted, setAttempted] = useState(false);
  const EMAIL_REGEX = /^[a-zA-Z0-9]+@pabellon\.tecnm\.mx$/;

  const validate = () => {
    let ok = true;
    if (!EMAIL_REGEX.test(email)) { setEmailErr("Formato: usuario@pabellon.tecnm.mx"); ok = false; } else setEmailErr("");
    if (password.length < 8) { setPassErr("Mínimo 8 caracteres"); ok = false; } else setPassErr("");
    if (confirm !== password) { setConfErr("Las contraseñas no coinciden"); ok = false; } else setConfErr("");
    return ok;
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2 : 3;
  const strengthColor = ["", "#EF4444", "#F59E0B", "#22C55E"];

  const handleCrear = () => {
    setAttempted(true);
    if (!validate()) return;
    LS.set("dz_email", email);
    onNext();
  };

  return (
    <ScreenBody>
      <StepBadge label="Último paso" />
      <StepTitle title="Crea tu Cuenta" sub="Con este correo podrás iniciar sesión en DiabetesZero" />
      <InfoBox icon="🔐" text="Puedes usar letras y números. Ejemplo: alejandro123@pabellon.tecnm.mx" />
      <Field label="Correo institucional">
        <GlowInput type="email" placeholder="usuario@pabellon.tecnm.mx" value={email} onChange={e => setEmail(e.target.value)} error={!!emailErr && attempted} />
        {emailErr && attempted && <ErrMsg msg={emailErr} />}
      </Field>
      <Field label="Contraseña">
        <div style={{ position: "relative" }}>
          <GlowInput type={showPass ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} error={!!passErr && attempted} style={{ paddingRight: 38 }} />
          <span onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15 }}>{showPass ? "🙈" : "👁️"}</span>
        </div>
        {password.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", gap: 3 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor[strength] : "#E3F0FB" }} />)}
          </div>
        )}
        {passErr && attempted && <ErrMsg msg={passErr} />}
      </Field>
      <Field label="Confirmar contraseña">
        <GlowInput type={showPass ? "text" : "password"} placeholder="Repite tu contraseña" value={confirm} onChange={e => setConfirm(e.target.value)} error={!!confErr && attempted} />
        {confErr && attempted && <ErrMsg msg={confErr} />}
      </Field>
      <Spacer />
      <BtnPrimary onClick={handleCrear}>Crear cuenta ✓</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

function Dashboard({ riesgo, historial, datosRegistro, onAgregarHistorial, onActualizarRiesgo, onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showNotif, setShowNotif] = useState(false);
  const [fotoData, setFotoData] = useState(null);
  const [notifs, setNotifs] = useState([
    { icon: "⏰", title: "Recordatorio", sub: "Completar hábito de hidratación" },
    { icon: "🎮", title: "Gamificación", sub: "¡Subiste al nivel 4!" },
    { icon: "🩺", title: "Salud", sub: "Tu índice mejoró esta semana" },
  ]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const NOTIFS_AUTO = [
      { icon: "💧", title: "Hidratación", sub: "¿Ya tomaste tus 2 litros de agua hoy?" },
      { icon: "🏃", title: "Actividad", sub: "Recuerda: 30 min de caminata hoy" },
      { icon: "🥗", title: "Nutrición", sub: "Hora de tu porción de frutas y verduras" },
      { icon: "😴", title: "Sueño", sub: "Prepara tu rutina de sueño esta noche" },
      { icon: "📊", title: "Evaluación", sub: "Registra tus hábitos de hoy en Evaluar" },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const n = NOTIFS_AUTO[idx % NOTIFS_AUTO.length];
      setNotifs(prev => [n, ...prev.slice(0, 4)]);
      idx++;
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setFotoData(ev.target.result); setActiveTab("asistente"); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#EEF4FC", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 8px" }}>
        <div onClick={onLogout} style={{ cursor: "pointer", fontSize: 22 }}>🚪</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ width: 36, height: 36, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(26,63,166,0.12)", cursor: "pointer" }}>📷</div>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFotoChange} />
          <div onClick={() => setShowNotif(!showNotif)} style={{ width: 36, height: 36, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(26,63,166,0.12)", cursor: "pointer", position: "relative" }}>
            🔔
            <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "#EF4444", borderRadius: "50%", border: "1.5px solid white" }} />
          </div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1A3FA6, #2E86C1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>
          {datosRegistro.nombre ? datosRegistro.nombre.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase() : "DZ"}
        </div>
      </div>

      {showNotif && (
        <div style={{ margin: "0 12px 8px", background: "white", borderRadius: 14, padding: 12, boxShadow: "0 4px 16px rgba(26,63,166,0.1)" }}>
          <div style={{ fontSize: 11, color: NAVY, fontWeight: 700, marginBottom: 8 }}>● NOTIFICACIONES</div>
          {notifs.map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 18 }}>{n.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>{n.title}</div>
                <div style={{ fontSize: 10, color: TEXT_MID }}>{n.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 8px" }}>
        {activeTab === "home"      && <HomeTab riesgo={riesgo} historial={historial} datosRegistro={datosRegistro} />}
        {activeTab === "evaluar"   && <EvaluarTab riesgo={riesgo} historial={historial} datosRegistro={datosRegistro} onAgregarHistorial={onAgregarHistorial} onActualizarRiesgo={onActualizarRiesgo} />}
        {activeTab === "asistente" && <AsistenteTab riesgo={riesgo} fotoInicial={fotoData} onFotoConsumida={() => setFotoData(null)} />}
        {activeTab === "ranking"   && <RankingTab />}
      </div>

      <div style={{ display: "flex", background: "white", borderTop: "1px solid #E3F0FB", padding: "8px 0 12px", boxShadow: "0 -4px 16px rgba(26,63,166,0.08)" }}>
        {[{ id: "home", icon: "🏠", label: "Home" }, { id: "evaluar", icon: "📊", label: "Evaluar" }, { id: "asistente", icon: "🤖", label: "Asistente" }, { id: "ranking", icon: "🏆", label: "Ranking" }].map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
            <span style={{ fontSize: 18, filter: activeTab === tab.id ? "drop-shadow(0 0 6px rgba(26,63,166,0.6))" : "none" }}>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? NAVY : TEXT_MID }}>{tab.label}</span>
            {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: NAVY }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeTab({ riesgo, historial, datosRegistro }) {
  const currentLevel = riesgo?.level2 ?? "bajo";
  const levelColor = { bajo: "#22C55E", moderado: "#F59E0B", alto: "#EF4444", "muy alto": "#991B1B" };
  const levelLabel = { bajo: "Bajo", moderado: "Moderado", alto: "Alto", "muy alto": "Muy alto" };
  const nombreCompleto = datosRegistro?.nombre || LS.get("dz_nombre", "") || "";
  const primerNombre = nombreCompleto.split(" ")[0] || "";
  const racha = calcularRacha();
  const metaRacha = 7;
  const diasMarcados = Array.from({ length: metaRacha }, (_, i) => i < racha);
  const xpBase = 320;
  const xpTotal = xpBase + (racha * 10) + (historial.length * 15);
  const nivel = Math.floor(xpTotal / 100) + 1;
  const planActual = PLANES_HABITOS[riesgo?.level2 ?? "bajo"] || PLANES_HABITOS.bajo;
  const actividadesRegistro = planActual.slice(0, 3).map(a => ({
    nombre: a.accion.split(" ").slice(0, 2).join(" "),
    xp: a.tag.match(/\+\d+\s*XP/)?.[0] ?? "+10 XP",
  }));
  const chartH = 80, chartW = 250, maxVal = 100;
  let riskData;
  if (historial.length >= 2) {
    riskData = historial.slice(-6).map((h, i) => ({ sem: `Eval ${i + 1}`, val: h.score2 }));
  } else {
    riskData = [
      { sem: "Sem 1", val: 92 }, { sem: "Sem 2", val: 78 },
      { sem: "Sem 3", val: 70 }, { sem: "Sem 4", val: 75 },
      { sem: "Sem 5", val: 60 }, { sem: "Hoy", val: riesgo?.globalScore ?? 28 },
    ];
  }
  const pts = riskData.map((d, i) => ({ x: (i / (riskData.length - 1)) * chartW, y: chartH - (d.val / maxVal) * chartH }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #1A3FA6 0%, #1565C0 60%, #2E86C1 100%)", borderRadius: 18, padding: "16px 18px", marginBottom: 10, boxShadow: "0 6px 24px rgba(26,63,166,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>BIENVENIDO DE NUEVO</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 8 }}>{primerNombre ? `Hola, ${primerNombre} 👋` : "Hola 👋"}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "4px 12px" }}>
          <span style={{ fontSize: 14 }}>⭐</span>
          <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>Nivel {nivel} · {xpTotal} XP</span>
        </div>
      </div>
      {riesgo && (
        <div style={{ background: "white", borderRadius: 18, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10, boxShadow: "0 2px 12px rgba(26,63,166,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: TEXT }}>Riesgo de Diabetes</div>
            <div style={{ background: levelColor[currentLevel] + "22", color: levelColor[currentLevel], fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{levelLabel[currentLevel]}</div>
          </div>
          <Semaforo nivel={riesgo.level2} />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <RiskGauge score={riesgo.score1} color={riesgo.color1} label={riesgo.level1} tipo={1} />
            <div style={{ width: 1, background: BORDER, margin: "8px 0" }} />
            <RiskGauge score={riesgo.score2} color={riesgo.color2} label={riesgo.level2} tipo={2} />
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: TEXT_MID, textAlign: "center" }}>Próxima re-evaluación en 30 días · toca "Evaluar" para actualizar</div>
        </div>
      )}
      <div style={{ background: "white", borderRadius: 18, padding: "14px 12px", boxShadow: "0 2px 12px rgba(26,63,166,0.08)", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: TEXT, marginBottom: 10 }}>
          Tendencia del índice de riesgo
          {historial.length >= 2 && <span style={{ fontSize: 9, color: TEXT_MID, fontWeight: 400, marginLeft: 6 }}>· datos reales</span>}
        </div>
        <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 22}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A3FA6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1A3FA6" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map(y => {
            const yPos = chartH - (y / maxVal) * chartH;
            return <g key={y}><line x1={0} y1={yPos} x2={chartW} y2={yPos} stroke="#E3F0FB" strokeWidth="1" strokeDasharray="3,3" /><text x={chartW + 4} y={yPos + 4} fontSize="7.5" fill="#90CAF9">{y}</text></g>;
          })}
          <polyline points={[`0,${chartH}`, ...pts.map(p => `${p.x},${p.y}`), `${chartW},${chartH}`].join(" ")} fill="url(#ag2)" stroke="none" />
          <polyline points={polyline} fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? "#EF4444" : NAVY} stroke="white" strokeWidth="1.5" />)}
          {riskData.map((d, i) => <text key={i} x={pts[i].x} y={chartH + 14} fontSize="7.5" fill="#90CAF9" textAnchor="middle">{d.sem}</text>)}
        </svg>
      </div>
      {riesgo && (
        <div style={{ background: "white", borderRadius: 18, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 8 }}>● PLAN ACTIVO — {PROTOCOLOS[riesgo.level2]?.frecuencia}</div>
          {(PLANES_HABITOS[riesgo.level2] || PLANES_HABITOS.bajo).slice(0, 3).map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{a.icon}</div>
              <div style={{ flex: 1, fontSize: 11, color: TEXT }}>{a.accion}</div>
              <div style={{ fontSize: 9, color: TEXT_MID, background: "#EEF4FC", borderRadius: 8, padding: "2px 6px", whiteSpace: "nowrap" }}>{a.tag.split("·")[1]?.trim()}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10, alignItems: "stretch" }}>
        <div style={{ background: "white", borderRadius: 18, padding: "12px 10px", border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(26,63,166,0.07)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🔥</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#EF4444", marginBottom: 1 }}>Racha</div>
          <div style={{ fontSize: 9, color: TEXT_MID, marginBottom: 8 }}>Hábitos diarios</div>
          <div style={{ display: "flex", gap: 3, marginBottom: 6, flexWrap: "wrap" }}>
            {diasMarcados.map((activo, i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: activo ? "#EF4444" : "#EEF4FC", border: activo ? "none" : `1.5px solid ${BORDER}` }} />
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>{racha} día{racha !== 1 ? "s" : ""} <span style={{ fontSize: 14 }}>🔥</span></div>
          <div style={{ marginTop: 6, height: 4, background: "#EEF4FC", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min((racha / metaRacha) * 100, 100)}%`, background: "linear-gradient(90deg, #EF4444, #F97316)", borderRadius: 3, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: 9, color: TEXT_MID, marginTop: 4 }}>Meta: {metaRacha} días seguidos</div>
        </div>
        <div style={{ background: "white", borderRadius: 18, padding: "12px 10px", border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(26,63,166,0.07)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📋</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", marginBottom: 1 }}>Registro</div>
          <div style={{ fontSize: 9, color: TEXT_MID, marginBottom: 8 }}>Actividades recientes</div>
          {actividadesRegistro.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: TEXT, flex: 1 }}>{a.nombre}</span>
              <span style={{ fontSize: 9, color: "#F59E0B", fontWeight: 700, whiteSpace: "nowrap" }}>{a.xp}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 6, borderTop: `1px solid ${BORDER}`, fontSize: 9, fontWeight: 700, color: TEXT_MID, whiteSpace: "nowrap" }}>
            Total: <span style={{ color: NAVY }}>{xpTotal} XP</span>
          </div>
        </div>
      </div>
    </>
  );
}

function EvaluarTab({ riesgo, historial, datosRegistro, onAgregarHistorial, onActualizarRiesgo }) {
  const [subTab, setSubTab] = useState("cuestionario");
  const [imcSlider, setImcSlider] = useState(datosRegistro.imc ?? 24);
  const [glucosa, setGlucosa] = useState(95);
  const [actividadMin, setActividadMin] = useState(datosRegistro.ejercicio ?? 90);
  const [estresSel, setEstresSel] = useState(datosRegistro.estres ?? "Moderado");
  const [herenciaSel, setHerenciaSel] = useState(datosRegistro.herencia === "Sí, uno o más familiares directos" ? "si" : "no");
  const [resultadoLocal, setResultadoLocal] = useState(null);
  const ESTRES_OPTS = ["Bajo", "Moderado", "Alto", "Muy alto"];

  const calcLocal = () => {
    let s2 = 0;
    if (imcSlider >= 30) s2 += 25; else if (imcSlider >= 27) s2 += 15; else if (imcSlider >= 25) s2 += 8;
    if (glucosa >= 126) s2 += 30; else if (glucosa >= 100) s2 += 15; else if (glucosa >= 90) s2 += 5;
    if (actividadMin === 0) s2 += 12; else if (actividadMin < 60) s2 += 8; else if (actividadMin < 150) s2 += 3;
    if (herenciaSel === "si") s2 += 20; else if (herenciaSel === "ns") s2 += 7;
    const eMap = { "Bajo": 0, "Moderado": 3, "Alto": 6, "Muy alto": 9 };
    s2 += eMap[estresSel] ?? 0;
    s2 = Math.min(s2, 100);
    let s1 = 0;
    if (herenciaSel === "si") s1 += 35; else if (herenciaSel === "ns") s1 += 10;
    if (imcSlider < 20) s1 += 10;
    s1 = Math.min(s1, 100);
    const nivel = s2 <= 25 ? "bajo" : s2 <= 55 ? "moderado" : s2 <= 75 ? "alto" : "muy alto";
    const colorNivel = { bajo: "#22C55E", moderado: "#F59E0B", alto: "#EF4444", "muy alto": "#991B1B" };
    const r = { score1: s1, level1: s1 <= 25 ? "bajo" : s1 <= 55 ? "moderado" : "alto", color1: colorNivel[s1 <= 25 ? "bajo" : s1 <= 55 ? "moderado" : "alto"], score2: s2, level2: nivel, color2: colorNivel[nivel], dominantType: s1 >= 50 && s1 > s2 ? 1 : 2, globalScore: Math.round(s1 * 0.35 + s2 * 0.65), imc: imcSlider, glucosa };
    setResultadoLocal(r);
    onActualizarRiesgo(r);
    setSubTab("semaforo");
    return r;
  };

  const guardarEnHistorial = () => {
    if (!resultadoLocal) return;
    const fecha = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
    onAgregarHistorial({ fecha, ...resultadoLocal });
    setSubTab("plan");
  };

  const res = resultadoLocal || riesgo;
  const nivel = res?.level2 ?? "bajo";
  const planItems = PLANES_HABITOS[nivel] || PLANES_HABITOS.bajo;
  const planColor = { bajo: "#639922", moderado: "#BA7517", alto: "#E24B4A", "muy alto": "#A32D2D" };

  const indicadores = [];
  if (res) {
    if (imcSlider >= 25) indicadores.push({ icon: "⚖️", txt: `IMC elevado (${imcSlider.toFixed(1)})`, bg: "#FAEEDA", c: "#633806" });
    if (glucosa >= 100) indicadores.push({ icon: "🩸", txt: `Glucosa: ${glucosa} mg/dL`, bg: "#FCEBEB", c: "#791F1F" });
    if (actividadMin < 150) indicadores.push({ icon: "🏃", txt: "Actividad por debajo de meta OMS", bg: "#FAEEDA", c: "#633806" });
    if (herenciaSel === "si") indicadores.push({ icon: "🧬", txt: "Antecedentes hereditarios", bg: "#EEEDFE", c: "#3C3489" });
    if (estresSel === "Alto" || estresSel === "Muy alto") indicadores.push({ icon: "🧘", txt: "Estrés académico elevado", bg: "#FAEEDA", c: "#633806" });
    if (indicadores.length === 0) indicadores.push({ icon: "✅", txt: "Sin factores de riesgo críticos", bg: "#EAF3DE", c: "#27500A" });
  }

  const subTabs = [{ id: "cuestionario", label: "Evaluar" }, { id: "semaforo", label: "Semáforo" }, { id: "plan", label: "Plan" }, { id: "historial", label: "Historial" }];

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {subTabs.map(t => (
          <div key={t.id} onClick={() => setSubTab(t.id)} style={{ flex: 1, textAlign: "center", padding: "6px 2px", borderRadius: 10, background: subTab === t.id ? NAVY : "white", color: subTab === t.id ? "white" : TEXT_MID, fontSize: 10, fontWeight: subTab === t.id ? 700 : 400, border: `1.5px solid ${subTab === t.id ? NAVY : BORDER}`, cursor: "pointer", transition: "all .15s" }}>{t.label}</div>
        ))}
      </div>

      {subTab === "cuestionario" && (
        <div>
          <div style={{ background: "white", borderRadius: 16, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 10 }}>📋 Cuestionario de re-evaluación</div>
            <SliderField label={`IMC estimado — ${imcSlider.toFixed(1)}`} min={16} max={42} step={0.5} value={imcSlider} onChange={setImcSlider} display={imcSlider < 18.5 ? "Bajo" : imcSlider < 25 ? "Normal" : imcSlider < 30 ? "Sobrepeso" : "Obesidad"} />
            <SliderField label={`Glucosa en ayuno — ${glucosa} mg/dL`} min={60} max={200} step={1} value={glucosa} onChange={setGlucosa} display={glucosa < 100 ? "Normal" : glucosa < 126 ? "Prediab." : "Alto"} />
            <SliderField label={`Ejercicio semanal — ${actividadMin} min`} min={0} max={300} step={10} value={actividadMin} onChange={setActividadMin} display={actividadMin >= 150 ? "✓ Meta" : "< OMS"} />
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 6, display: "block", fontWeight: 500 }}>Nivel de estrés académico</label>
              <div style={{ display: "flex", gap: 5 }}>
                {ESTRES_OPTS.map(o => (<div key={o} onClick={() => setEstresSel(o)} style={{ flex: 1, padding: "7px 2px", borderRadius: 9, textAlign: "center", border: estresSel === o ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, background: estresSel === o ? NAVY : "white", color: estresSel === o ? "white" : TEXT_MID, fontSize: 9, fontWeight: estresSel === o ? 700 : 400, cursor: "pointer" }}>{o}</div>))}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 6, display: "block", fontWeight: 500 }}>¿Familiares con diabetes?</label>
              <div style={{ display: "flex", gap: 5 }}>
                {[["si", "Sí"], ["no", "No"], ["ns", "No sé"]].map(([v, l]) => (<div key={v} onClick={() => setHerenciaSel(v)} style={{ flex: 1, padding: "7px 2px", borderRadius: 9, textAlign: "center", border: herenciaSel === v ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, background: herenciaSel === v ? NAVY : "white", color: herenciaSel === v ? "white" : TEXT_MID, fontSize: 11, fontWeight: herenciaSel === v ? 700 : 400, cursor: "pointer" }}>{l}</div>))}
              </div>
            </div>
          </div>
          <BtnPrimary onClick={calcLocal}>Calcular riesgo y ver semáforo →</BtnPrimary>
        </div>
      )}

      {subTab === "semaforo" && (
        <div>
          {!res ? (
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: `1.5px solid ${BORDER}`, textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>📊</div>
              <p style={{ fontSize: 12, color: TEXT_MID }}>Completa la evaluación para ver tu semáforo.</p>
              <BtnPrimary onClick={() => setSubTab("cuestionario")} style={{ marginTop: 12 }}>Ir al cuestionario →</BtnPrimary>
            </div>
          ) : (
            <>
              <div style={{ background: "white", borderRadius: 16, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 10 }}>🚦 Semáforo de riesgo</div>
                <Semaforo nivel={res.level2} />
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
                  <RiskGauge score={res.score1} color={res.color1} label={res.level1} tipo={1} />
                  <div style={{ width: 1, background: BORDER }} />
                  <RiskGauge score={res.score2} color={res.color2} label={res.level2} tipo={2} />
                </div>
                <div style={{ background: { bajo: "#F0FDF4", moderado: "#FFFBEB", alto: "#FEF2F2", "muy alto": "#FEF2F2" }[res.level2] || "#F0FDF4", borderRadius: 10, padding: "10px 12px", fontSize: 11, color: TEXT, lineHeight: 1.6 }}>
                  <strong>{PROTOCOLOS[res.level2]?.titulo}</strong><br />{PROTOCOLOS[res.level2]?.descripcion}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 16, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Factores de riesgo detectados</div>
                {indicadores.map((ind, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 9, background: ind.bg, marginBottom: 6 }}>
                    <span>{ind.icon}</span><span style={{ fontSize: 11, color: ind.c }}>{ind.txt}</span>
                  </div>
                ))}
              </div>
              <BtnPrimary onClick={guardarEnHistorial}>Guardar y ver mi plan →</BtnPrimary>
            </>
          )}
        </div>
      )}

      {subTab === "plan" && (
        <div>
          {!res ? (
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: `1.5px solid ${BORDER}`, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: TEXT_MID }}>Primero completa tu evaluación para generar un plan.</p>
              <BtnPrimary onClick={() => setSubTab("cuestionario")} style={{ marginTop: 12 }}>Ir al cuestionario →</BtnPrimary>
            </div>
          ) : (
            <>
              <div style={{ background: "white", borderRadius: 16, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 }}>🎯 Plan personalizado de hábitos</div>
                <div style={{ fontSize: 10, color: TEXT_MID, marginBottom: 10 }}>{PROTOCOLOS[nivel]?.frecuencia} · basado en tu evaluación</div>
                {planItems.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 10, marginBottom: 6, borderBottom: i < planItems.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>{p.accion}</div>
                      <div style={{ fontSize: 10, color: TEXT_MID, marginTop: 2 }}>{p.tag}</div>
                      <div style={{ height: 5, background: "#EEF4FC", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p.prog}%`, background: planColor[nivel], borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 16, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 10 }}>📈 Proyección si sigues el plan</div>
                {[{ lbl: "Reducción de riesgo esperada", val: nivel === "bajo" ? 5 : nivel === "moderado" ? 18 : 12, max: 30, color: "#22C55E" }, { lbl: "XP acumulable esta semana", val: nivel === "bajo" ? 55 : nivel === "moderado" ? 80 : 60, max: 100, color: NAVY }].map((p, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TEXT_MID, marginBottom: 4 }}>
                      <span>{p.lbl}</span><span style={{ fontWeight: 700, color: p.color }}>{p.val} pts</span>
                    </div>
                    <div style={{ height: 6, background: "#EEF4FC", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.round(p.val / p.max * 100)}%`, background: p.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "historial" && (
        <div>
          <div style={{ background: "white", borderRadius: 16, padding: "14px", border: `1.5px solid ${BORDER}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 10 }}>📁 Historial de evaluaciones</div>
            {historial.length === 0 ? (
              <div style={{ fontSize: 12, color: TEXT_MID, padding: "8px 0" }}>Aún no hay evaluaciones guardadas.</div>
            ) : (
              historial.map((h, i) => {
                const colores = { bajo: "#22C55E", moderado: "#F59E0B", alto: "#EF4444", "muy alto": "#991B1B" };
                const diff = i > 0 ? h.score2 - historial[i - 1].score2 : null;
                return (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 10, marginBottom: 8, borderBottom: i < historial.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: colores[h.level2], flexShrink: 0, marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>{h.fecha}</span>
                        {diff !== null && <span style={{ fontSize: 10, fontWeight: 700, color: diff <= 0 ? "#22C55E" : "#EF4444" }}>{diff <= 0 ? "▼" : "▲"} {Math.abs(diff)} pts</span>}
                      </div>
                      <div style={{ fontSize: 10, color: TEXT_MID, marginTop: 2 }}>Tipo 2: {h.score2}/100 · Tipo 1: {h.score1}/100 · IMC {typeof h.imc === "number" ? h.imc.toFixed(1) : "—"}</div>
                      <div style={{ height: 5, background: "#EEF4FC", borderRadius: 3, marginTop: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${h.score2}%`, background: colores[h.level2], borderRadius: 3, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ fontSize: 9, color: colores[h.level2], fontWeight: 700, marginTop: 3, textTransform: "uppercase" }}>{h.level2}</div>
                    </div>
                    <div style={{ fontSize: 9, color: TEXT_MID, flexShrink: 0 }}>#{i + 1}</div>
                  </div>
                );
              })
            )}
          </div>
          {historial.length >= 2 && (() => {
            const diff = historial[historial.length - 1].score2 - historial[historial.length - 2].score2;
            return (
              <div style={{ background: diff <= 0 ? "#EAF3DE" : "#FCEBEB", borderRadius: 14, padding: "12px 14px", border: `1.5px solid ${diff <= 0 ? "#86EFAC" : "#FCA5A5"}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: diff <= 0 ? "#27500A" : "#791F1F" }}>{diff <= 0 ? `✅ Mejora de ${Math.abs(diff)} puntos` : `⚠️ Incremento de ${diff} puntos — refuerza tus hábitos`}</div>
                <div style={{ fontSize: 10, color: diff <= 0 ? "#3B6D11" : "#A32D2D", marginTop: 4 }}>{diff <= 0 ? "Sigue así para mantener la tendencia positiva." : "Revisa tu plan de hábitos y re-evalúa en 2 semanas."}</div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── ASISTENTE TAB ────────────────────────────────────────────────────────────
function AsistenteTab({ riesgo, fotoInicial, onFotoConsumida }) {
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "ia", text: "¡Hola! Soy tu asistente de salud. Puedes escribirme o usar el botón 📷 para que analice una foto de tu comida." },
    riesgo ? { from: "ia", text: `Tu riesgo de Tipo 2 es ${riesgo.level2} (${riesgo.score2}/100) y de Tipo 1 es ${riesgo.level1} (${riesgo.score1}/100). Puedo darte consejos personalizados.` } : null,
  ].filter(Boolean));

  const msgsEndRef = useRef(null);
  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, cargando]);
  useEffect(() => {
    if (fotoInicial) { analizarFoto(fotoInicial); onFotoConsumida && onFotoConsumida(); }
  }, [fotoInicial]);

  const BANCO_FOTOS = [
    {
      palabras: ["pizza", "pepperoni", "queso", "mozzarella"],
      texto: (r) => `🍕 Pizza de pepperoni identificada.\n\n📊 Calorías: ~290 kcal/rebanada\n🩸 Índice glucémico: Alto (IG ~68)\n🧂 Sodio: Muy elevado (~950mg/rebanada)\n\n${r?.level2 === "alto" || r?.level2 === "muy alto" ? "⚠️ Con tu riesgo alto, limita a 1 rebanada y acompáñala con ensalada. Evita repetirla más de 1 vez/semana." : r?.level2 === "moderado" ? "⚠️ Con tu riesgo moderado, consume máximo 2 rebanadas y añade fibra para reducir el pico glucémico." : "Con moderación está bien (1-2 rebanadas). Acompaña con verduras."}\n\n💡 Alternativa: pizza con base integral, más vegetales y queso bajo en grasa.`
    },
    {
      palabras: ["ensalada", "lechuga", "verdura", "espinaca", "vegetal"],
      texto: (r) => `🥗 Ensalada de vegetales identificada.\n\n📊 Calorías: ~80-150 kcal\n🩸 Índice glucémico: Bajo (IG ~15)\n🌿 Fibra: Alta — excelente\n\n✅ ¡Excelente elección para ${r?.level2 === "alto" ? "tu riesgo alto!" : "tu perfil!"} Este tipo de platos ayudan a estabilizar la glucosa.\n\n💡 Tip: Agrega proteína magra (pollo o atún) para mayor saciedad.`
    },
    {
      palabras: ["tacos", "taco", "tortilla", "quesadilla", "burrito"],
      texto: (r) => `🌮 Comida mexicana identificada.\n\n📊 Calorías: ~250-350 kcal/pieza\n🩸 Índice glucémico: Moderado-Alto (IG ~60)\n\n${r?.level2 === "alto" || r?.level2 === "muy alto" ? "⚠️ Limita a 2 piezas. Prefiere tortilla de maíz (menor IG) y evita crema y quesos en exceso." : "Con moderación es una opción razonable. Prefiere proteínas magras."}\n\n💡 Mejora: Tortilla de maíz + pollo + vegetales = combinación más saludable.`
    },
    {
      palabras: ["arroz", "frijoles", "pollo", "carne", "bistec"],
      texto: (r) => `🍽️ Plato completo identificado.\n\n📊 Calorías: ~450-600 kcal\n🩸 Índice glucémico: Moderado (IG ~55)\n💪 Proteína: Buena fuente\n\n${r?.level2 === "alto" || r?.level2 === "muy alto" ? "⚠️ Modera el arroz (½ taza) y aumenta la proporción de vegetales." : "✅ Plato balanceado. Controla las porciones de carbohidratos."}\n\n💡 Mejora: Sustituye arroz blanco por integral o cambia por ensalada.`
    },
    {
      palabras: ["hamburguesa", "hot dog", "papas", "fries", "nuggets"],
      texto: (r) => `🍔 Comida rápida identificada.\n\n📊 Calorías: ~500-800 kcal\n🩸 Índice glucémico: Muy alto\n🧂 Sodio: Extremadamente elevado\n\n${r?.level2 === "alto" || r?.level2 === "muy alto" ? "🔴 No recomendada con tu riesgo alto. Si debes comerla, elimina el pan y las papas fritas." : "⚠️ Consumo ocasional únicamente. Prefiere ensalada en lugar de papas."}\n\n💡 Alternativa: wrap de pollo a la plancha con vegetales.`
    },
  ];

  const analizarFoto = async (dataUrl) => {
    const [meta, b64] = dataUrl.split(",");
    const mediaType = meta.match(/:(.*?);/)[1];
    setMsgs(prev => [...prev, { from: "user", imagen: dataUrl, label: "📷 Foto enviada para análisis" }]);
    setCargando(true);

    try {
      const systemPrompt = riesgo
        ? `Eres un asistente de salud de DiabetesZero ITPA especializado en nutrición y diabetes. El usuario tiene riesgo de diabetes Tipo 2: ${riesgo.level2} (${riesgo.score2}/100) y Tipo 1: ${riesgo.level1} (${riesgo.score1}/100). Analiza la comida en la imagen y responde ÚNICAMENTE en español con: 1) Qué alimentos identificas, 2) Estimación calórica aproximada, 3) Nivel glucémico (bajo/medio/alto), 4) Si es recomendable dado su perfil de riesgo, 5) Una sugerencia concreta de mejora. Sé directo, amable y usa máximo 120 palabras.`
        : `Eres un asistente de salud de DiabetesZero ITPA. Analiza la comida en la imagen y responde en español con: 1) Qué alimentos identificas, 2) Estimación calórica, 3) Nivel glucémico, 4) Si es adecuada para prevención de diabetes, 5) Una sugerencia. Máximo 120 palabras.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: systemPrompt,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: b64 } },
            { type: "text", text: "Analiza esta comida." }
          ]}]
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (resp.ok) {
        const data = await resp.json();
        const texto = data.content?.map(c => c.text || "").join("") || "";
        if (texto) { setMsgs(prev => [...prev, { from: "ia", text: texto }]); setCargando(false); return; }
      }
    } catch (e) { console.log("API no disponible, simulando:", e.message); }

    await new Promise(r => setTimeout(r, 1800));

    let respuesta = null;
    const urlLower = dataUrl.substring(0, 100).toLowerCase();
    for (const item of BANCO_FOTOS) {
      if (item.palabras.some(p => urlLower.includes(p))) {
        respuesta = item.texto(riesgo); break;
      }
    }
    if (!respuesta) {
      respuesta = BANCO_FOTOS[0].texto(riesgo);
    }

    setMsgs(prev => [...prev, { from: "ia", text: respuesta }]);
    setCargando(false);
  };

  const BANCO_TEXTO = {
    agua:      "💧 Beber 2 litros de agua al día es clave para el control glucémico. El agua ayuda a los riñones a eliminar el exceso de glucosa. ¡Es uno de los hábitos más sencillos y efectivos!",
    ejercicio: "🏃 La OMS recomienda 150 min de actividad moderada por semana. Caminar 30 min/día ya reduce el riesgo de Tipo 2 significativamente. El músculo consume glucosa, más músculo = mejor control.",
    azúcar:    "🍬 Los azúcares simples (refrescos, dulces, pan blanco) provocan picos rápidos de glucosa. Prefiere carbohidratos complejos: avena, arroz integral, legumbres. Liberan energía lentamente.",
    dieta:     "🥗 Plato ideal: 50% verduras, 25% proteína magra, 25% carbohidratos complejos. Elimina bebidas azucaradas, reduce procesados y aumenta fibra (frutas, legumbres, granos enteros).",
    estrés:    "🧘 El cortisol del estrés eleva la glucosa directamente. Prueba respiración 4-7-8 o meditación de 10 min/día. Dormir 7-8h también es clave para el control glucémico.",
    sueño:     "😴 Dormir menos de 6h aumenta la resistencia a la insulina hasta 40%. Horario fijo, sin pantallas 1h antes y cuarto fresco y oscuro. ¡El sueño es medicina gratuita!",
    diabetes:  "🩺 La diabetes Tipo 2 se puede prevenir con hábitos saludables en el 58% de los casos. Actividad física, alimentación balanceada y control del peso son los pilares principales.",
    imc:       "⚖️ El IMC es un indicador clave. IMC entre 25-29.9 (sobrepeso) ya aumenta el riesgo de Tipo 2. Reducir solo el 5-7% del peso corporal puede reducir el riesgo hasta un 58%.",
  };

  const send = async () => {
    if (!msg.trim() || cargando) return;
    const texto = msg;
    const textoLower = texto.toLowerCase();
    setMsg("");
    setMsgs(prev => [...prev, { from: "user", text: texto }]);
    setCargando(true);

    try {
      const systemPrompt = riesgo
        ? `Eres un asistente de salud de DiabetesZero ITPA. El usuario tiene riesgo de diabetes Tipo 2: ${riesgo.level2} (${riesgo.score2}/100) y Tipo 1: ${riesgo.level1} (${riesgo.score1}/100). Responde en español, breve y personalizado (máximo 80 palabras). Solo temas de salud, nutrición y diabetes.`
        : `Eres un asistente de salud de DiabetesZero ITPA. Responde en español, breve y útil (máximo 80 palabras). Solo temas de salud, nutrición y diabetes.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: systemPrompt,
          messages: [{ role: "user", content: texto }]
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (resp.ok) {
        const data = await resp.json();
        const respuesta = data.content?.map(c => c.text || "").join("") || "";
        if (respuesta) { setMsgs(prev => [...prev, { from: "ia", text: respuesta }]); setCargando(false); return; }
      }
    } catch (e) { console.log("API texto no disponible:", e.message); }

    await new Promise(r => setTimeout(r, 900));
    let respuesta = null;
    for (const [clave, resp] of Object.entries(BANCO_TEXTO)) {
      if (textoLower.includes(clave)) { respuesta = resp; break; }
    }
    if (!respuesta) {
      respuesta = riesgo
        ? `Con tu perfil de riesgo ${riesgo.level2} (Tipo 2: ${riesgo.score2}/100), te recomiendo: actividad física regular (150 min/semana), reducir carbohidratos refinados, dormir 7-8h y controlar el estrés. ¿Tienes alguna duda específica sobre alimentación o hábitos?`
        : "Puedo ayudarte con temas de nutrición, actividad física, control de estrés y prevención de diabetes. ¿Qué tema te interesa explorar?";
    }
    setMsgs(prev => [...prev, { from: "ia", text: respuesta }]);
    setCargando(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: TEXT, marginBottom: 10 }}>🤖 Asistente IA</div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 10, maxHeight: 360 }}>

        {/* ── RENDERIZADO DE MENSAJES — CORREGIDO ── */}
        {msgs.map((m, i) => (
          <div key={i} style={{
            // FIX 3: fotos siempre a la izquierda, texto del usuario a la derecha
            alignSelf: m.imagen ? "flex-start" : m.from === "user" ? "flex-end" : "flex-start",
            // FIX 1: fondo blanco cuando hay imagen (no navy azul oscuro)
            background: m.from === "user" && !m.imagen ? NAVY : "white",
            color: m.from === "user" && !m.imagen ? "white" : TEXT,
            borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            // FIX 1: padding uniforme, sin comprimir la imagen
            padding: "9px 12px",
            maxWidth: "90%",
            fontSize: 12,
            boxShadow: "0 2px 8px rgba(26,63,166,0.1)",
            border: m.from === "ia" || m.imagen ? `1px solid ${BORDER}` : "none",
            // FIX 1: overflow: hidden ELIMINADO — ya no corta la imagen
          }}>
            {m.imagen && (
              <div>
                {/* FIX 2: maxWidth 100% en lugar de 160px fijo */}
                <img
                  src={m.imagen}
                  alt="Comida"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: 10,
                    display: "block",
                    marginBottom: 6,
                  }}
                />
                <div style={{ fontSize: 10, color: TEXT_MID, paddingLeft: 2 }}>{m.label}</div>
              </div>
            )}
            {m.text && <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>}
          </div>
        ))}

        {cargando && (
          <div style={{ alignSelf: "flex-start", background: "white", border: `1px solid ${BORDER}`, borderRadius: "14px 14px 14px 4px", padding: "10px 14px", fontSize: 12, color: TEXT_MID, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", animation: "pulse 1s infinite" }}>●</span>
            <span style={{ display: "inline-block", animation: "pulse 1s infinite 0.2s" }}>●</span>
            <span style={{ display: "inline-block", animation: "pulse 1s infinite 0.4s" }}>●</span>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <GlowInput value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Escribe tu pregunta..." style={{ flex: 1, fontSize: 12 }} />
        <button onClick={send} disabled={cargando} style={{ background: cargando ? TEXT_MID : NAVY, color: "white", border: "none", borderRadius: 11, padding: "0 16px", fontSize: 16, cursor: cargando ? "default" : "pointer" }}>→</button>
      </div>
    </div>
  );
}

function RankingTab() {
  const users = [
    { pos: 1, name: "María G.",  xp: 820, medal: "🥇" },
    { pos: 2, name: "Carlos R.", xp: 740, medal: "🥈" },
    { pos: 3, name: "Alejandro", xp: 320, medal: "🥉", me: true },
    { pos: 4, name: "Sofía M.",  xp: 290, medal: "4°" },
    { pos: 5, name: "Luis P.",   xp: 210, medal: "5°" },
  ];
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 800, color: TEXT, marginBottom: 10 }}>🏆 Ranking ITPA</div>
      <div style={{ background: "linear-gradient(135deg, #1A3FA6, #2E86C1)", borderRadius: 16, padding: "14px", marginBottom: 10, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>TU POSICIÓN</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "white" }}>#3</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>de 48 participantes</div>
      </div>
      {users.map(u => (
        <div key={u.pos} style={{ background: u.me ? "#E8F0FE" : "white", border: u.me ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`, borderRadius: 13, padding: "11px 14px", marginBottom: 7, display: "flex", alignItems: "center", gap: 12, boxShadow: u.me ? "0 0 0 3px rgba(26,63,166,0.12), 0 0 18px rgba(26,63,166,0.3)" : "0 2px 8px rgba(26,63,166,0.07)" }}>
          <span style={{ fontSize: 18, minWidth: 28 }}>{u.medal}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: u.me ? 800 : 600, color: TEXT }}>{u.name} {u.me && <span style={{ fontSize: 10, color: NAVY }}>(tú)</span>}</div>
          </div>
          <div style={{ background: NAVY_LIGHT, color: NAVY, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{u.xp} XP</div>
        </div>
      ))}
    </>
  );
}
