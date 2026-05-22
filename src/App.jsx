import { useState } from "react";

export default function App() {
  const [screen, setScreen] = useState("welcome");

  return (
    <div style={{
      width: 340, minHeight: 680, margin: "1rem auto",
      background: "#EEF4FC", borderRadius: 46,
      border: "7px solid #0D1B2A", overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      boxShadow: "0 24px 64px rgba(13,43,107,0.22)",
      position: "relative",
    }}>
      <div style={{ background: "#EEF4FC", display: "flex", justifyContent: "center", paddingTop: 8 }}>
        <div style={{ width: 80, height: 22, background: "#0D1B2A", borderRadius: "0 0 14px 14px" }} />
      </div>

      {screen === "welcome"   && <WelcomeScreen onStart={() => setScreen("step1")} onLogin={() => setScreen("login")} />}
      {screen === "login"     && <LoginScreen   onBack={() => setScreen("welcome")} onSuccess={() => setScreen("dashboard")} />}
      {screen === "step1"     && <Step1 onNext={() => setScreen("step2")} />}
      {screen === "step2"     && <Step2 onNext={() => setScreen("step3")} onBack={() => setScreen("step1")} />}
      {screen === "step3"     && <Step3 onNext={() => setScreen("step4")} onBack={() => setScreen("step2")} />}
      {screen === "step4"     && <Step4 onNext={() => setScreen("register")} onBack={() => setScreen("step3")} />}
      {screen === "register"  && <RegisterAccount onNext={() => setScreen("success")} onBack={() => setScreen("step4")} />}
      {screen === "success"   && <SuccessScreen onDone={() => setScreen("dashboard")} />}
      {screen === "dashboard" && <Dashboard onLogout={() => setScreen("welcome")} />}

      {screen !== "dashboard" && (
        <div style={{ background: "#EEF4FC", padding: "8px 0", display: "flex", justifyContent: "center", marginTop: "auto" }}>
          <div style={{ width: 80, height: 4, background: "#0D1B2A", borderRadius: 2 }} />
        </div>
      )}
    </div>
  );
}

// ─── GLOW INPUT ────────────────────────────────────
function GlowInput({ as = "input", children, style: extraStyle, error = false, ...props }) {
  const [active, setActive] = useState(false);

  const borderColor = error ? "#EF4444" : active ? "#00C8FF" : "#C5D8EF";
  const bgColor     = error ? "rgba(239,68,68,0.04)" : active ? "rgba(0,200,255,0.04)" : "white";
  const shadow      = error
    ? "0 0 0 3px rgba(239,68,68,0.2), 0 0 16px rgba(239,68,68,0.45)"
    : active
      ? "0 0 0 3px rgba(0,200,255,0.25), 0 0 16px rgba(0,200,255,0.35)"
      : "none";

  const glowStyle = {
    width: "100%",
    padding: "10px 13px",
    border: `${error || active ? "2px" : "1.5px"} solid ${borderColor}`,
    borderRadius: 11,
    fontSize: 13,
    background: bgColor,
    color: "#0D1B2A",
    boxSizing: "border-box",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    boxShadow: shadow,
    ...extraStyle,
  };

  const handlers = {
    onMouseEnter: () => setActive(true),
    onMouseLeave: (e) => { if (document.activeElement !== e.currentTarget) setActive(false); },
    onFocus: () => setActive(true),
    onBlur: () => setActive(false),
  };

  if (as === "select") {
    return (
      <select style={glowStyle} {...handlers} {...props}>
        {children}
      </select>
    );
  }
  return <input style={glowStyle} {...handlers} {...props} />;
}

// ─── WELCOME ────────────────────────────────────────
function WelcomeScreen({ onStart, onLogin }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 340 100" style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none" }}>
        <path d="M0,0 L340,0 L340,55 C270,95 200,25 150,55 C100,85 50,100 0,70 Z" fill="rgba(173,214,255,0.3)" />
        <path d="M0,0 L340,0 L340,35 C280,68 210,15 160,38 C110,60 50,78 0,48 Z"  fill="rgba(173,214,255,0.18)" />
      </svg>
      <svg style={{ position: "absolute", right: 4, top: 50, pointerEvents: "none", opacity: 0.32 }}
        width="55" height="200" viewBox="0 0 55 200">
        <line x1="50" y1="10" x2="28" y2="10" stroke="#90CAF9" strokeWidth="1.5"/>
        <line x1="28" y1="10" x2="28" y2="45" stroke="#90CAF9" strokeWidth="1.5"/>
        <circle cx="28" cy="45" r="3.5" fill="#90CAF9"/>
        <line x1="52" y1="80" x2="32" y2="80" stroke="#90CAF9" strokeWidth="1.5"/>
        <line x1="32" y1="80" x2="32" y2="115" stroke="#90CAF9" strokeWidth="1.5"/>
        <circle cx="32" cy="115" r="3.5" fill="#90CAF9"/>
        <line x1="48" y1="155" x2="18" y2="155" stroke="#90CAF9" strokeWidth="1.5"/>
        <circle cx="18" cy="155" r="3.5" fill="#90CAF9"/>
      </svg>
      <svg style={{ position: "absolute", left: 4, bottom: 90, pointerEvents: "none", opacity: 0.32 }}
        width="48" height="150" viewBox="0 0 48 150">
        <line x1="4"  y1="30" x2="24" y2="30" stroke="#90CAF9" strokeWidth="1.5"/>
        <line x1="24" y1="30" x2="24" y2="65" stroke="#90CAF9" strokeWidth="1.5"/>
        <circle cx="24" cy="65" r="3.5" fill="#90CAF9"/>
        <line x1="4"  y1="105" x2="22" y2="105" stroke="#90CAF9" strokeWidth="1.5"/>
        <circle cx="4" cy="105" r="3.5" fill="#90CAF9"/>
      </svg>
      <svg style={{ position: "absolute", bottom: 30, right: 16, opacity: 0.28 }}
        width="26" height="26" viewBox="0 0 26 26">
        <path d="M13 22 C13 22 3 15 3 9 C3 5.5 5.8 3 9 4.2 C10.5 4.8 12 6.5 13 8.5 C14 6.5 15.5 4.8 17 4.2 C20.2 3 23 5.5 23 9 C23 15 13 22 13 22Z"
          fill="#90CAF9"/>
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "16px 24px 0", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: 27, fontWeight: 800, color: "#0D1B2A",
          margin: "0 0 6px", textAlign: "center", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
          DiabetesZero ITPA
        </h1>
        <p style={{ fontSize: 13, color: "#5A7A9A", margin: "0 0 14px", fontWeight: 400 }}>
          Tecnología que cuida tu salud
        </p>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 340, height: 340, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(33,150,243,0.38) 0%, rgba(33,150,243,0.12) 45%, transparent 70%)",
            pointerEvents: "none",
          }}/>
          <ShieldLogo size={290} />
        </div>
      </div>

      <div style={{ padding: "0 22px 20px", position: "relative", zIndex: 1 }}>
        <button onClick={onStart} style={{
          width: "100%", padding: "15px 0",
          background: "#1A3FA6", color: "white",
          border: "none", borderRadius: 14,
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          marginBottom: 12, boxShadow: "0 4px 20px rgba(26,63,166,0.35)",
          fontFamily: "inherit", letterSpacing: "0.2px",
        }}>
          Comenzar ahora
        </button>
        <button onClick={onLogin} style={{
          width: "100%", padding: "10px 0",
          background: "transparent", color: "#1A3FA6",
          border: "none", fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Ya tengo una cuenta
        </button>
      </div>
    </div>
  );
}

function ShieldLogo({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 12 L126 30 L126 80 C126 112 104 134 80 146 C56 134 34 112 34 80 L34 30 Z" fill="url(#so)"/>
      <path d="M80 24 L116 39 L116 80 C116 106 98 124 80 134 C62 124 44 106 44 80 L44 39 Z" fill="url(#si)"/>
      <path d="M80 106 C80 106 55 89 55 70 C55 60 62 54 71 56 C74.5 57 78 60.5 80 64 C82 60.5 85.5 57 89 56 C98 54 105 60 105 70 C105 89 80 106 80 106Z" fill="url(#hg)"/>
      <line x1="80" y1="64"  x2="80" y2="82"  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="82"  x2="66" y2="93"  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="82"  x2="94" y2="93"  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="82"  x2="80" y2="95"  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="80" cy="62"  r="4.5" fill="white" opacity="0.95"/>
      <circle cx="65" cy="94"  r="4"   fill="white" opacity="0.85"/>
      <circle cx="80" cy="96"  r="4"   fill="white" opacity="0.85"/>
      <circle cx="95" cy="94"  r="4"   fill="white" opacity="0.85"/>
      <defs>
        <linearGradient id="so" x1="80" y1="12"  x2="80" y2="146" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1A237E"/><stop offset="100%" stopColor="#0D1B6B"/>
        </linearGradient>
        <linearGradient id="si" x1="80" y1="24"  x2="80" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1565C0"/><stop offset="100%" stopColor="#0D47A1"/>
        </linearGradient>
        <linearGradient id="hg" x1="55" y1="54"  x2="105" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#42A5F5"/><stop offset="100%" stopColor="#1976D2"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAVY       = "#1A3FA6";
const NAVY_LIGHT = "#E8F0FE";
const TEXT       = "#0D1B2A";
const TEXT_MID   = "#5A7A9A";
const BORDER     = "#C5D8EF";

function ScreenBody({ children }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column",
      padding: "14px 18px 16px", overflowY: "auto" }}>
      {children}
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2,
          background: i < step ? NAVY : BORDER, transition: "background 0.3s" }}/>
      ))}
    </div>
  );
}

function StepBadge({ label }) {
  return (
    <span style={{ display: "inline-block", background: NAVY_LIGHT, color: NAVY,
      fontSize: 11, padding: "3px 10px", borderRadius: 20, marginBottom: 6, fontWeight: 700 }}>
      {label}
    </span>
  );
}

function StepTitle({ title, sub }) {
  return (
    <>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: "4px 0 2px", letterSpacing: "-0.3px" }}>
        {title}
      </h2>
      <p style={{ fontSize: 12, color: TEXT_MID, margin: "0 0 14px" }}>{sub}</p>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TwoCol({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{children}</div>;
}

function BtnPrimary({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "14px 0", background: NAVY, color: "white",
      border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700,
      cursor: "pointer", boxShadow: "0 4px 16px rgba(26,63,166,0.28)",
      letterSpacing: "0.2px", fontFamily: "inherit", transition: "box-shadow 0.2s",
    }}
    onMouseDown={e => e.currentTarget.style.boxShadow = "0 0 0 4px rgba(26,63,166,0.2), 0 0 20px rgba(26,63,166,0.5)"}
    onMouseUp={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,63,166,0.28)"}
    >{children}</button>
  );
}

function BtnSecondary({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "13px 0", marginTop: 8,
      background: "transparent", color: NAVY,
      border: `1.5px solid ${BORDER}`, borderRadius: 14,
      fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      transition: "box-shadow 0.2s",
    }}
    onMouseDown={e => e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,63,166,0.15), 0 0 14px rgba(26,63,166,0.3)"}
    onMouseUp={e => e.currentTarget.style.boxShadow = "none"}
    >{children}</button>
  );
}

function InfoBox({ icon, text }) {
  return (
    <div style={{ background: NAVY_LIGHT, borderRadius: 11, padding: "9px 12px", marginBottom: 12,
      display: "flex", alignItems: "flex-start", gap: 8, border: "1px solid #BBDEFB" }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <p style={{ fontSize: 11, color: NAVY, margin: 0, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function SectionDivider({ icon, label }) {
  return (
    <div style={{ background: NAVY_LIGHT, borderRadius: 9, padding: "6px 11px", margin: "8px 0",
      fontSize: 12, color: NAVY, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
      border: "1px solid #BBDEFB" }}>
      {icon} {label}
    </div>
  );
}

function HabitOpts({ label, options, selected, onSelect }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
        {options.map(opt => (
          <div key={opt} onClick={() => onSelect(opt)} style={{
            border: selected === opt ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`,
            borderRadius: 11, padding: "9px 6px", cursor: "pointer",
            background: selected === opt ? NAVY : "white",
            fontSize: 11, color: selected === opt ? "white" : TEXT_MID,
            textAlign: "center", fontWeight: selected === opt ? 700 : 400,
            transition: "all 0.2s",
            boxShadow: selected === opt
              ? `0 0 0 3px rgba(26,63,166,0.15), 0 0 14px rgba(26,63,166,0.4)`
              : "none",
          }}>{opt}</div>
        ))}
      </div>
    </div>
  );
}

function SliderField({ label, min, max, step, value, onChange, display }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ flex: 1, accentColor: NAVY }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, minWidth: 42, textAlign: "right" }}>
          {display}
        </span>
      </div>
    </div>
  );
}

function Spacer() { return <div style={{ flex: 1 }} />; }

// ─── LOGIN ──────────────────────────────────────────
function LoginScreen({ onBack, onSuccess }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr]   = useState("");
  const [attempted, setAttempted] = useState(false);

  const EMAIL_REGEX = /^\d+@pabellon\.tecnm\.mx$/;
  const VALID_PASS = "itpa2024";

  const validate = () => {
    let ok = true;
    if (!EMAIL_REGEX.test(email)) {
      setEmailErr("Formato: numero_de_control@pabellon.tecnm.mx");
      ok = false;
    } else {
      setEmailErr("");
    }
    if (password.length < 6) {
      setPassErr("Contraseña incorrecta o muy corta");
      ok = false;
    } else if (password !== VALID_PASS) {
      setPassErr("Contraseña incorrecta");
      ok = false;
    } else {
      setPassErr("");
    }
    return ok;
  };

  const handleLogin = () => {
    setAttempted(true);
    if (validate()) onSuccess();
  };

  return (
    <ScreenBody>
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 14px" }}>
        <ShieldLogo size={80} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, textAlign: "center", margin: "0 0 4px" }}>
        Iniciar sesión
      </h2>
      <p style={{ fontSize: 12, color: TEXT_MID, textAlign: "center", margin: "0 0 20px" }}>
        Accede con tu correo institucional
      </p>

      <Field label="Correo institucional">
        <GlowInput
          type="email"
          placeholder="341050188@pabellon.tecnm.mx"
          value={email}
          onChange={e => { setEmail(e.target.value); if (attempted) validate(); }}
          error={!!emailErr && attempted}
        />
        <p style={{ fontSize: 10, color: TEXT_MID, margin: "4px 0 0 2px" }}>
          Formato: <span style={{ color: NAVY, fontWeight: 600 }}>numero_de_control@pabellon.tecnm.mx</span>
        </p>
        {emailErr && attempted && (
          <p style={{ fontSize: 10, color: "#EF4444", margin: "3px 0 0 2px", display: "flex", alignItems: "center", gap: 4 }}>
            ⚠️ {emailErr}
          </p>
        )}
      </Field>

      <Field label="Contraseña">
        <GlowInput
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => { setPassword(e.target.value); if (attempted) validate(); }}
          error={!!passErr && attempted}
        />
        {passErr && attempted && (
          <p style={{ fontSize: 10, color: "#EF4444", margin: "4px 0 0 2px", display: "flex", alignItems: "center", gap: 4 }}>
            ⚠️ {passErr}
          </p>
        )}
      </Field>

      <p style={{ fontSize: 11, color: NAVY, textAlign: "right", margin: "0 0 16px", cursor: "pointer" }}>
        ¿Olvidaste tu contraseña?
      </p>
      <Spacer />
      <BtnPrimary onClick={handleLogin}>Iniciar Sesión</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Volver</BtnSecondary>
    </ScreenBody>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return <p style={{ fontSize: 10, color: "#EF4444", margin: "3px 0 0 2px" }}>⚠️ {msg}</p>;
}

// ─── STEP 1 ─────────────────────────────────────────
function Step1({ onNext }) {
  const [role,      setRole]      = useState("");
  const [nombre,    setNombre]    = useState("");
  const [edad,      setEdad]      = useState("");
  const [genero,    setGenero]    = useState("");
  const [carrera,   setCarrera]   = useState("");
  const [semestre,  setSemestre]  = useState("");
  const [grupo,     setGrupo]     = useState("");
  const [modalidad, setModalidad] = useState("");
  const [depto,     setDepto]     = useState("");
  const [turno,     setTurno]     = useState("");
  const [errs,      setErrs]      = useState({});
  const [tried,     setTried]     = useState(false);

  const validate = () => {
    const e = {};
    if (!nombre.trim())            e.nombre    = "El nombre es obligatorio";
    if (!edad || edad < 14 || edad > 80) e.edad = "Ingresa una edad válida";
    if (!genero || genero === "Seleccionar") e.genero = "Selecciona tu género";
    if (!role)                     e.role      = "Selecciona tu rol";
    if (role === "Estudiante") {
      if (!carrera)                e.carrera   = "Selecciona tu carrera";
      if (!semestre || semestre === "Sem.") e.semestre = "Selecciona tu semestre";
      if (!grupo.trim())           e.grupo     = "Ingresa tu grupo";
      if (!modalidad || modalidad === "Seleccionar") e.modalidad = "Selecciona modalidad";
    }
    if (role === "Docente") {
      if (!depto)                  e.depto     = "Selecciona tu departamento";
      if (!turno)                  e.turno     = "Selecciona tu turno";
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { setTried(true); if (validate()) onNext(); };
  const revalidate = () => { if (tried) validate(); };

  return (
    <ScreenBody>
      <ProgressBar step={1} total={4} />
      <StepBadge label="Paso 1 de 4" />
      <StepTitle title="Perfil Académico" sub="Datos para personalizar tu experiencia en el ITPA" />

      <Field label="Nombre completo">
        <GlowInput type="text" placeholder="Ej. Alejandro García"
          value={nombre} onChange={e => { setNombre(e.target.value); revalidate(); }}
          error={tried && !!errs.nombre} />
        <ErrMsg msg={tried && errs.nombre} />
      </Field>

      <TwoCol>
        <Field label="Edad">
          <GlowInput type="number" placeholder="Ej. 20"
            value={edad} onChange={e => { setEdad(e.target.value); revalidate(); }}
            error={tried && !!errs.edad} />
          <ErrMsg msg={tried && errs.edad} />
        </Field>
        <Field label="Género">
          <GlowInput as="select" value={genero}
            onChange={e => { setGenero(e.target.value); revalidate(); }}
            error={tried && !!errs.genero}>
            <option>Seleccionar</option>
            <option>Masculino</option>
            <option>Femenino</option>
          </GlowInput>
          <ErrMsg msg={tried && errs.genero} />
        </Field>
      </TwoCol>

      <Field label="Rol en la institución">
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
          {[["Estudiante","🎓"],["Docente","📖"]].map(([r, ico]) => (
            <div key={r} onClick={() => { setRole(r); revalidate(); }} style={{
              border: errs.role && tried
                ? `2px solid #EF4444`
                : role === r ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`,
              borderRadius: 11, padding: "8px 16px", textAlign: "center", cursor: "pointer",
              background: role === r ? NAVY_LIGHT : "white",
              fontSize: 11, color: role === r ? NAVY : TEXT_MID,
              fontWeight: role === r ? 700 : 400, transition: "all 0.2s", minWidth: 80,
              boxShadow: role === r
                ? `0 0 0 3px rgba(26,63,166,0.15), 0 0 16px rgba(26,63,166,0.35)`
                : "none",
            }}>
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
              <GlowInput as="select" value={carrera}
                onChange={e => { setCarrera(e.target.value); revalidate(); }}
                error={tried && !!errs.carrera}>
                <option value="">Seleccionar</option>
                <option>Ing. en TIC</option>
                <option>Ing. Industrial</option>
                <option>Ing. Mecatrónica</option>
                <option>Ing. en Logística</option>
                <option>Ing. en Gestión Empresarial</option>
                <option>Ing. en IA</option>
              </GlowInput>
              <ErrMsg msg={tried && errs.carrera} />
            </Field>
            <Field label="Semestre">
              <GlowInput as="select" value={semestre}
                onChange={e => { setSemestre(e.target.value); revalidate(); }}
                error={tried && !!errs.semestre}>
                <option>Sem.</option>
                {[1,2,3,4,5,6,7,8,9].map(s => <option key={s}>{s}°</option>)}
              </GlowInput>
              <ErrMsg msg={tried && errs.semestre} />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Grupo">
              <GlowInput type="text" placeholder="Ej. A"
                value={grupo} onChange={e => { setGrupo(e.target.value); revalidate(); }}
                error={tried && !!errs.grupo} />
              <ErrMsg msg={tried && errs.grupo} />
            </Field>
            <Field label="Modalidad">
              <GlowInput as="select" value={modalidad}
                onChange={e => { setModalidad(e.target.value); revalidate(); }}
                error={tried && !!errs.modalidad}>
                <option>Seleccionar</option>
                <option>Escolarizada</option>
                <option>No escolarizada</option>
              </GlowInput>
              <ErrMsg msg={tried && errs.modalidad} />
            </Field>
          </TwoCol>
        </>
      )}

      {role === "Docente" && (
        <TwoCol>
          <Field label="Departamento">
            <GlowInput as="select" value={depto}
              onChange={e => { setDepto(e.target.value); revalidate(); }}
              error={tried && !!errs.depto}>
              <option value="">Seleccionar</option>
              <option>Ingenierías</option>
              <option>Ciencias Básicas</option>
              <option>Ciencias Económico-Administrativas</option>
              <option>Ingeniería Industrial</option>
            </GlowInput>
            <ErrMsg msg={tried && errs.depto} />
          </Field>
          <Field label="Turno">
            <GlowInput as="select" value={turno}
              onChange={e => { setTurno(e.target.value); revalidate(); }}
              error={tried && !!errs.turno}>
              <option value="">Seleccionar</option>
              <option>Escolarizada</option>
              <option>Sabatina</option>
              <option>Ambos</option>
            </GlowInput>
            <ErrMsg msg={tried && errs.turno} />
          </Field>
        </TwoCol>
      )}

      <Spacer />
      <BtnPrimary onClick={handleNext}>Continuar →</BtnPrimary>
    </ScreenBody>
  );
}

// ─── STEP 2 ─────────────────────────────────────────
function Step2({ onNext, onBack }) {
  const [peso,   setPeso]   = useState("");
  const [altura, setAltura] = useState("");
  const [errs,   setErrs]   = useState({});
  const [tried,  setTried]  = useState(false);

  const imc    = peso && altura ? (parseFloat(peso) / Math.pow(parseFloat(altura)/100, 2)).toFixed(1) : null;
  const imcCat = imc ? (imc < 18.5 ? "Bajo peso" : imc < 25 ? "Normal" : imc < 30 ? "Sobrepeso" : "Obesidad") : null;

  const validate = () => {
    const e = {};
    if (!peso || peso < 20 || peso > 300)    e.peso   = "Ingresa un peso válido (kg)";
    if (!altura || altura < 100 || altura > 250) e.altura = "Ingresa una altura válida (cm)";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { setTried(true); if (validate()) onNext(); };
  const revalidate = () => { if (tried) validate(); };

  return (
    <ScreenBody>
      <ProgressBar step={2} total={4} />
      <StepBadge label="Paso 2 de 4" />
      <StepTitle title="Datos De Salud Física" sub="Necesarios para calcular tu índice de riesgo" />
      <TwoCol>
        <Field label="Peso (kg)">
          <GlowInput type="number" placeholder="Ej. 70"
            value={peso} onChange={e => { setPeso(e.target.value); revalidate(); }}
            error={tried && !!errs.peso} />
          <ErrMsg msg={tried && errs.peso} />
        </Field>
        <Field label="Altura (cm)">
          <GlowInput type="number" placeholder="Ej. 170"
            value={altura} onChange={e => { setAltura(e.target.value); revalidate(); }}
            error={tried && !!errs.altura} />
          <ErrMsg msg={tried && errs.altura} />
        </Field>
      </TwoCol>
      <InfoBox icon="📊" text={imc ? `IMC: ${imc} — ${imcCat}` : "Tu IMC se calculará automáticamente."} />
      <Spacer />
      <BtnPrimary onClick={handleNext}>Continuar →</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

// ─── STEP 3 ─────────────────────────────────────────
function Step3({ onNext, onBack }) {
  const [selected, setSelected] = useState("Sí, uno o más familiares directos");
  return (
    <ScreenBody>
      <ProgressBar step={3} total={4} />
      <StepBadge label="Paso 3 de 4" />
      <StepTitle title="Antecedentes Hereditarios" sub="Factor clave en el cálculo de riesgo" />
      <InfoBox icon="ℹ️" text="Los antecedentes familiares son uno de los factores de mayor peso para desarrollar diabetes tipo 2." />
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 8, display: "block", fontWeight: 500 }}>
        ¿Tienes familiares directos con diabetes?
      </label>
      {[
        { label: "Sí, uno o más familiares directos", icon: "👥" },
        { label: "No, ninguno que yo sepa",           icon: "🚫" },
        { label: "No estoy seguro",                   icon: "❓" },
      ].map(({ label, icon }) => (
        <div key={label} onClick={() => setSelected(label)} style={{
          border: selected === label ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`,
          borderRadius: 11, padding: "12px 14px", cursor: "pointer",
          background: selected === label ? NAVY_LIGHT : "white",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
          transition: "all 0.2s",
          boxShadow: selected === label
            ? `0 0 0 3px rgba(26,63,166,0.12), 0 0 18px rgba(26,63,166,0.3)`
            : "none",
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 12, color: TEXT, fontWeight: selected === label ? 600 : 400 }}>
            {label}
          </span>
        </div>
      ))}
      <Spacer />
      <BtnPrimary onClick={onNext}>Continuar →</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

// ─── STEP 4 ─────────────────────────────────────────
function Step4({ onNext, onBack }) {
  const [refrescos,  setRefrescos]  = useState("");
  const [desayuno,   setDesayuno]   = useState("");
  const [estres,     setEstres]     = useState("");
  const [examenes,   setExamenes]   = useState("");
  const [frutas,     setFrutas]     = useState(2);
  const [ejercicio,  setEjercicio]  = useState(60);
  const [sedentario, setSedentario] = useState(6);
  const [sueno,      setSueno]      = useState(7);
  const [errs,       setErrs]       = useState({});
  const [tried,      setTried]      = useState(false);

  const validate = () => {
    const e = {};
    if (!refrescos) e.refrescos = "Selecciona una opción";
    if (!desayuno)  e.desayuno  = "Selecciona una opción";
    if (!estres)    e.estres    = "Selecciona una opción";
    if (!examenes)  e.examenes  = "Selecciona una opción";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { setTried(true); if (validate()) onNext(); };

  const HabitOptsV = ({ label, options, selected, onSelect, errKey }) => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: TEXT_MID, marginBottom: 4, display: "block", fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
        {options.map(opt => (
          <div key={opt} onClick={() => { onSelect(opt); if (tried) validate(); }} style={{
            border: tried && errs[errKey] && !selected
              ? `2px solid #EF4444`
              : selected === opt ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`,
            borderRadius: 11, padding: "9px 6px", cursor: "pointer",
            background: selected === opt ? NAVY : "white",
            fontSize: 11, color: selected === opt ? "white" : TEXT_MID,
            textAlign: "center", fontWeight: selected === opt ? 700 : 400,
            transition: "all 0.2s",
            boxShadow: selected === opt
              ? `0 0 0 3px rgba(26,63,166,0.15), 0 0 14px rgba(26,63,166,0.4)`
              : tried && errs[errKey]
                ? `0 0 0 3px rgba(239,68,68,0.2), 0 0 10px rgba(239,68,68,0.35)`
                : "none",
          }}>{opt}</div>
        ))}
      </div>
      {tried && errs[errKey] && (
        <p style={{ fontSize: 10, color: "#EF4444", margin: "4px 0 0 2px" }}>⚠️ {errs[errKey]}</p>
      )}
    </div>
  );

  return (
    <ScreenBody>
      <ProgressBar step={4} total={4} />
      <StepBadge label="Paso 4 de 4" />
      <StepTitle title="Hábitos De Vida" sub="Para que la IA calcule tu riesgo inicial" />

      <SectionDivider icon="🥗" label="Alimentación" />
      <HabitOptsV label="¿Con qué frecuencia consumes refrescos o bebidas azucaradas?"
        options={["Nunca","1-2 veces/sem","3-5 veces/sem","Todos los días"]}
        selected={refrescos} onSelect={setRefrescos} errKey="refrescos" />
      <HabitOptsV label="¿Desayunas antes de ir al ITPA?"
        options={["Siempre","A veces","Casi nunca","Nunca"]}
        selected={desayuno} onSelect={setDesayuno} errKey="desayuno" />
      <SliderField label="Porciones de frutas/verduras al día"
        min={0} max={5} step={1} value={frutas} onChange={setFrutas} display={frutas} />

      <SectionDivider icon="🏃" label="Actividad física" />
      <SliderField label="Minutos de ejercicio por semana"
        min={0} max={300} step={10} value={ejercicio} onChange={setEjercicio} display={`${ejercicio}min`} />
      <SliderField label="Horas sentado en un día de clases"
        min={1} max={12} step={1} value={sedentario} onChange={setSedentario} display={`${sedentario}h`} />

      <SectionDivider icon="🌙" label="Estrés y sueño" />
      <HabitOptsV label="Nivel de estrés académico"
        options={["Bajo","Moderado","Alto","Muy alto"]}
        selected={estres} onSelect={setEstres} errKey="estres" />
      <SliderField label="Horas de sueño por noche"
        min={3} max={10} step={1} value={sueno} onChange={setSueno} display={`${sueno}h`} />
      <HabitOptsV label="En épocas de exámenes, ¿cambian tus hábitos alimenticios?"
        options={["No cambian","Poco","Bastante","Mucho"]}
        selected={examenes} onSelect={setExamenes} errKey="examenes" />

      <BtnPrimary onClick={handleNext}>Completar registro ✓</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

// ─── REGISTER ACCOUNT ───────────────────────────────
function RegisterAccount({ onNext, onBack }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [emailErr, setEmailErr]  = useState("");
  const [passErr, setPassErr]    = useState("");
  const [confErr, setConfErr]    = useState("");
  const [attempted, setAttempted] = useState(false);

  const EMAIL_REGEX = /^\d+@pabellon\.tecnm\.mx$/;

  const validate = () => {
    let ok = true;
    if (!EMAIL_REGEX.test(email)) {
      setEmailErr("Formato: numero_de_control@pabellon.tecnm.mx"); ok = false;
    } else { setEmailErr(""); }

    if (password.length < 8) {
      setPassErr("La contraseña debe tener al menos 8 caracteres"); ok = false;
    } else { setPassErr(""); }

    if (confirm !== password) {
      setConfErr("Las contraseñas no coinciden"); ok = false;
    } else { setConfErr(""); }

    return ok;
  };

  const handleNext = () => {
    setAttempted(true);
    if (validate()) onNext();
  };

  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2
    : 3;
  const strengthLabel = ["", "Débil", "Media", "Fuerte"];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#22C55E"];

  return (
    <ScreenBody>
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {[1,1,1,1,0.3].map((op, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2,
            background: NAVY, opacity: op, transition: "opacity 0.3s" }}/>
        ))}
      </div>

      <StepBadge label="Último paso" />
      <StepTitle
        title="Crea Cuenta"
        sub="Con este correo podrás iniciar sesión en DiabetesZero"
      />

      <InfoBox icon="🔐" text="Usa tu número de control como parte del correo. Ejemplo: 341050188@pabellon.tecnm.mx" />

      <Field label="Correo institucional">
        <GlowInput
          type="email"
          placeholder="341050188@pabellon.tecnm.mx"
          value={email}
          onChange={e => { setEmail(e.target.value); if (attempted) validate(); }}
          error={!!emailErr && attempted}
        />
        <p style={{ fontSize: 10, color: TEXT_MID, margin: "4px 0 0 2px" }}>
          Formato: <span style={{ color: NAVY, fontWeight: 600 }}>numero_de_control@pabellon.tecnm.mx</span>
        </p>
        {emailErr && attempted && (
          <p style={{ fontSize: 10, color: "#EF4444", margin: "3px 0 0 2px" }}>⚠️ {emailErr}</p>
        )}
      </Field>

      <Field label="Contraseña">
        <div style={{ position: "relative" }}>
          <GlowInput
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={e => { setPassword(e.target.value); if (attempted) validate(); }}
            error={!!passErr && attempted}
            style={{ paddingRight: 38 }}
          />
          <span onClick={() => setShowPass(!showPass)} style={{
            position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
            cursor: "pointer", fontSize: 15, userSelect: "none",
          }}>{showPass ? "🙈" : "👁️"}</span>
        </div>
        {password.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, display: "flex", gap: 3 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i <= strength ? strengthColor[strength] : "#E3F0FB",
                  transition: "background 0.3s",
                }}/>
              ))}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: strengthColor[strength] }}>
              {strengthLabel[strength]}
            </span>
          </div>
        )}
        {passErr && attempted && (
          <p style={{ fontSize: 10, color: "#EF4444", margin: "4px 0 0 2px" }}>⚠️ {passErr}</p>
        )}
      </Field>

      <Field label="Confirmar contraseña">
        <div style={{ position: "relative" }}>
          <GlowInput
            type={showPass ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={confirm}
            onChange={e => { setConfirm(e.target.value); if (attempted) validate(); }}
            error={!!confErr && attempted}
            style={{ paddingRight: 38 }}
          />
          {confirm.length > 0 && (
            <span style={{
              position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
              fontSize: 14,
            }}>{confirm === password ? "✅" : "❌"}</span>
          )}
        </div>
        {confErr && attempted && (
          <p style={{ fontSize: 10, color: "#EF4444", margin: "4px 0 0 2px" }}>⚠️ {confErr}</p>
        )}
      </Field>

      <Spacer />
      <BtnPrimary onClick={handleNext}>Crear cuenta ✓</BtnPrimary>
      <BtnSecondary onClick={onBack}>← Atrás</BtnSecondary>
    </ScreenBody>
  );
}

// ─── SUCCESS ────────────────────────────────────────
function SuccessScreen({ onDone }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, background: NAVY, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1rem", fontSize: 32, color: "white",
        boxShadow: "0 8px 24px rgba(26,63,166,0.3)" }}>✓</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 8 }}>
        ¡Registro completado!
      </h2>
      <p style={{ fontSize: 13, color: TEXT_MID, marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Tu perfil está listo. Ahora puedes ver tu índice de riesgo inicial y empezar a ganar XP.
      </p>
      <BtnPrimary onClick={onDone}>Ir al Dashboard →</BtnPrimary>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────
function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showCamera, setShowCamera] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#EEF4FC", overflow: "hidden" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px 8px", background: "#EEF4FC",
      }}>
        <div onClick={onLogout} style={{ cursor: "pointer", fontSize: 22, lineHeight: 1 }}>
          🚪
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div onClick={() => setShowCamera(!showCamera)} style={{
            width: 36, height: 36, borderRadius: "50%", background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: showCamera ? "0 0 0 2px #1A3FA6, 0 0 14px rgba(26,63,166,0.45)" : "0 2px 8px rgba(26,63,166,0.12)",
            cursor: "pointer", transition: "box-shadow 0.2s",
          }}>📷</div>
          <div onClick={() => setShowNotif(!showNotif)} style={{
            width: 36, height: 36, borderRadius: "50%", background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: showNotif ? "0 0 0 2px #1A3FA6, 0 0 14px rgba(26,63,166,0.45)" : "0 2px 8px rgba(26,63,166,0.12)",
            cursor: "pointer", position: "relative", transition: "box-shadow 0.2s",
          }}>
            🔔
            <div style={{
              position: "absolute", top: 6, right: 6,
              width: 8, height: 8, background: "#EF4444", borderRadius: "50%",
              border: "1.5px solid white",
            }}/>
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #1A3FA6, #2E86C1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 13, fontWeight: 700,
          boxShadow: "0 2px 8px rgba(26,63,166,0.25)",
        }}>DZ</div>
      </div>

      {showCamera && (
        <div style={{
          margin: "0 12px 8px", background: "#0D1B2A", borderRadius: 14,
          padding: 12, color: "white",
        }}>
          <div style={{ fontSize: 11, color: "#90CAF9", marginBottom: 8, fontWeight: 600 }}>● CÁMARA IA</div>
          <div style={{
            background: "#1A1A2E", borderRadius: 10, height: 90,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 8, border: "1px solid #1A3FA6",
          }}>
            <span style={{ fontSize: 28 }}>📸</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 10, background: "#1A3FA6", padding: "3px 8px", borderRadius: 20, color: "white" }}>
              DETECTADO · Tipo Atómico
            </span>
            <span style={{ fontSize: 10, background: "#0D47A1", padding: "3px 8px", borderRadius: 20, color: "#90CAF9" }}>
              XP · Guardar puntos
            </span>
          </div>
        </div>
      )}

      {showNotif && (
        <div style={{ margin: "0 12px 8px", background: "white", borderRadius: 14, padding: 12, boxShadow: "0 4px 16px rgba(26,63,166,0.1)" }}>
          <div style={{ fontSize: 11, color: "#1A3FA6", fontWeight: 700, marginBottom: 8 }}>● NOTIFICACIONES</div>
          {[
            { icon: "⏰", title: "Recordatorio", sub: "Completar hábito de hidratación" },
            { icon: "🎮", title: "Alerta Gamificación", sub: "¡Subiste al nivel 4!" },
            { icon: "🩺", title: "Alerta de Salud", sub: "Tu índice mejoró esta semana" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 18 }}>{n.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0D1B2A" }}>{n.title}</div>
                <div style={{ fontSize: 10, color: "#5A7A9A" }}>{n.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 8px" }}>
        {activeTab === "home"      && <HomeTab />}
        {activeTab === "asistente" && <AsistenteTab />}
        {activeTab === "ranking"   && <RankingTab />}
      </div>

      <div style={{
        display: "flex", background: "white",
        borderTop: "1px solid #E3F0FB",
        padding: "8px 0 12px",
        boxShadow: "0 -4px 16px rgba(26,63,166,0.08)",
      }}>
        {[
          { id: "home",      icon: "🏠", label: "Home" },
          { id: "asistente", icon: "🤖", label: "Asistente" },
          { id: "ranking",   icon: "🏆", label: "Ranking" },
        ].map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2, cursor: "pointer",
            transition: "all 0.2s",
          }}>
            <span style={{
              fontSize: 20,
              filter: activeTab === tab.id ? "drop-shadow(0 0 6px rgba(26,63,166,0.6))" : "none",
              transition: "filter 0.2s",
            }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400,
              color: activeTab === tab.id ? "#1A3FA6" : "#5A7A9A",
            }}>{tab.label}</span>
            {activeTab === tab.id && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#1A3FA6",
                boxShadow: "0 0 6px rgba(26,63,166,0.6)" }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOME TAB ───────────────────────────────────────
function HomeTab() {
  const riskData = [
    { sem: "Sem 1", val: 92 },
    { sem: "Sem 2", val: 78 },
    { sem: "Sem 3", val: 70 },
    { sem: "Sem 4", val: 75 },
    { sem: "Sem 5", val: 60 },
    { sem: "Hoy",   val: 28 },
  ];
  const maxVal = 100;
  const chartH = 80;
  const chartW = 250;
  const pts = riskData.map((d, i) => ({
    x: (i / (riskData.length - 1)) * chartW,
    y: chartH - (d.val / maxVal) * chartH,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, #1A3FA6 0%, #1565C0 60%, #2E86C1 100%)",
        borderRadius: 18, padding: "16px 18px", marginBottom: 10,
        boxShadow: "0 6px 24px rgba(26,63,166,0.3)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100,
          borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>
          BIENVENIDO DE NUEVO
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 8 }}>
          Hola, Alejandro 👋
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.18)", borderRadius: 20,
          padding: "4px 12px",
        }}>
          <span style={{ fontSize: 14 }}>⭐</span>
          <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>Nivel 4 · 320 XP</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{
          background: "#FFF1F1", borderRadius: 16, padding: "14px 12px",
          boxShadow: "0 2px 12px rgba(26,63,166,0.08)",
          border: "1.5px solid #FFE0E0",
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>📷</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#EF4444", marginBottom: 2 }}>Racha</div>
          <div style={{ fontSize: 10, color: "#5A7A9A" }}>Hábitos diarios</div>
          <div style={{ marginTop: 8, display: "flex", gap: 3 }}>
            {[1,1,1,1,1,0,0].map((d,i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: 2,
                background: d ? "#1A3FA6" : "#E3F0FB",
              }}/>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "#1A3FA6", fontWeight: 700, marginTop: 4 }}>5 días 🔥</div>
        </div>

        <div style={{
          background: "#FFF8EC", borderRadius: 16, padding: "14px 12px",
          boxShadow: "0 2px 12px rgba(26,63,166,0.08)",
          border: "1.5px solid #FFE5B4",
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>📋</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B", marginBottom: 2 }}>Registro</div>
          <div style={{ fontSize: 10, color: "#5A7A9A" }}>Ver historial</div>
          <div style={{ marginTop: 8 }}>
            {["Ensalada +15XP", "Caminata +20XP", "Agua +10XP"].map((r,i) => (
              <div key={i} style={{ fontSize: 9, color: "#5A7A9A", marginBottom: 2 }}>· {r}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: 18, padding: "14px 12px",
        boxShadow: "0 2px 12px rgba(26,63,166,0.08)",
        border: "1.5px solid #E3F0FB", marginBottom: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B2A" }}>
            Índice de Riesgo de Diabetes
          </div>
          <div style={{
            background: "#FEF3C7", color: "#D97706",
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
          }}>Moderado</div>
        </div>

        <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 22}`} style={{ overflow: "visible" }}>
          {[25, 50, 75, 100].map(y => {
            const yPos = chartH - (y / maxVal) * chartH;
            return (
              <g key={y}>
                <line x1={0} y1={yPos} x2={chartW} y2={yPos}
                  stroke="#E3F0FB" strokeWidth="1" strokeDasharray="3,3"/>
                <text x={chartW + 4} y={yPos + 4} fontSize="7.5" fill="#90CAF9">{y}</text>
              </g>
            );
          })}
          <line x1={0} y1={chartH - (75/maxVal)*chartH} x2={chartW} y2={chartH - (75/maxVal)*chartH}
            stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5"/>
          <text x={4} y={chartH - (75/maxVal)*chartH - 3} fontSize="7" fill="#EF4444" opacity="0.7">Moderado</text>
          <line x1={0} y1={chartH - (40/maxVal)*chartH} x2={chartW} y2={chartH - (40/maxVal)*chartH}
            stroke="#22C55E" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5"/>
          <text x={4} y={chartH - (40/maxVal)*chartH - 3} fontSize="7" fill="#22C55E" opacity="0.7">Bajo</text>
          <polyline
            points={[`0,${chartH}`, ...pts.map(p=>`${p.x},${p.y}`), `${chartW},${chartH}`].join(" ")}
            fill="url(#areaGrad)" stroke="none"/>
          <polyline points={polyline} fill="none" stroke="#1A3FA6" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"/>
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === pts.length-1 ? 5 : 3}
              fill={i === pts.length-1 ? "#EF4444" : "#1A3FA6"}
              stroke="white" strokeWidth="1.5"/>
          ))}
          {riskData.map((d, i) => (
            <text key={i} x={pts[i].x} y={chartH + 14} fontSize="7.5"
              fill="#90CAF9" textAnchor="middle">{d.sem}</text>
          ))}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A3FA6" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#1A3FA6" stopOpacity="0.01"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div style={{
        background: "white", borderRadius: 18, padding: "14px",
        boxShadow: "0 2px 12px rgba(26,63,166,0.08)",
        border: "1.5px solid #E3F0FB",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", marginBottom: 10, letterSpacing: 0.5 }}>
          ● REGISTRO RECIENTE
        </div>
        {[
          { icon: "🥗", name: "Ensalada de nopal", time: "Hoy · 13:20", xp: "+15 XP" },
          { icon: "🚶", name: "Caminata 20 min",   time: "Hoy · 07:45", xp: "+20 XP" },
          { icon: "💧", name: "Hidratación",        time: "Ayer · 21:00", xp: "+10 XP" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: "#EEF4FC",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0D1B2A" }}>{item.name}</div>
              <div style={{ fontSize: 10, color: "#5A7A9A" }}>{item.time}</div>
            </div>
            <div style={{
              background: "#E8F0FE", color: "#1A3FA6",
              fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 12,
            }}>{item.xp}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── ASISTENTE TAB ──────────────────────────────────
function AsistenteTab() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "ia", text: "¡Hola! Soy tu asistente de salud. ¿Cómo te sientes hoy?" },
    { from: "ia", text: "Puedo analizar tu comida, darte consejos o responder dudas sobre diabetes." },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs(prev => [...prev,
      { from: "user", text: msg },
      { from: "ia", text: "Entendido. Analizando tu consulta... 🤖 Recuerda mantener tus hábitos saludables y registrar tus comidas diariamente." }
    ]);
    setMsg("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B2A", marginBottom: 10 }}>🤖 Asistente IA</div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "user" ? "flex-end" : "flex-start",
            background: m.from === "user" ? "#1A3FA6" : "white",
            color: m.from === "user" ? "white" : "#0D1B2A",
            borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            padding: "9px 12px", maxWidth: "82%", fontSize: 12,
            boxShadow: "0 2px 8px rgba(26,63,166,0.1)",
            border: m.from === "ia" ? "1px solid #E3F0FB" : "none",
          }}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <GlowInput
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Escribe tu pregunta..."
          style={{ flex: 1, fontSize: 12 }}
        />
        <button onClick={send} style={{
          background: "#1A3FA6", color: "white", border: "none",
          borderRadius: 11, padding: "0 16px", fontSize: 16, cursor: "pointer",
        }}>→</button>
      </div>
    </div>
  );
}

// ─── RANKING TAB ────────────────────────────────────
function RankingTab() {
  const users = [
    { pos: 1, name: "María G.",   xp: 820, medal: "🥇" },
    { pos: 2, name: "Carlos R.",  xp: 740, medal: "🥈" },
    { pos: 3, name: "Alejandro",  xp: 320, medal: "🥉", me: true },
    { pos: 4, name: "Sofía M.",   xp: 290, medal: "4°" },
    { pos: 5, name: "Luis P.",    xp: 210, medal: "5°" },
  ];
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B2A", marginBottom: 10 }}>🏆 Ranking ITPA</div>
      <div style={{
        background: "linear-gradient(135deg, #1A3FA6, #2E86C1)",
        borderRadius: 16, padding: "14px", marginBottom: 10, textAlign: "center",
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>TU POSICIÓN</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "white" }}>#3</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>de 48 participantes</div>
      </div>
      {users.map(u => (
        <div key={u.pos} style={{
          background: u.me ? "#E8F0FE" : "white",
          border: u.me ? "2px solid #1A3FA6" : "1.5px solid #E3F0FB",
          borderRadius: 13, padding: "11px 14px", marginBottom: 7,
          display: "flex", alignItems: "center", gap: 12,
          boxShadow: u.me ? "0 0 0 3px rgba(26,63,166,0.12), 0 0 18px rgba(26,63,166,0.3)" : "0 2px 8px rgba(26,63,166,0.07)",
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 18, minWidth: 28 }}>{u.medal}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: u.me ? 800 : 600, color: "#0D1B2A" }}>
              {u.name} {u.me && <span style={{ fontSize: 10, color: "#1A3FA6" }}>(tú)</span>}
            </div>
          </div>
          <div style={{
            background: "#E8F0FE", color: "#1A3FA6",
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
          }}>{u.xp} XP</div>
        </div>
      ))}
    </>
  );
}

