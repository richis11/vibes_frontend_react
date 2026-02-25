import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 Agregar useLocation
import { toast } from "react-toastify";
import authService from "../api/authService";
import { useAuth } from "../context/AuthContext";

// ─── Validation ───────────────────────────────────────────────────────────
const validators = {
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Email inválido",
  password: (v) =>
    v.length < 8
      ? "Mínimo 8 caracteres"
      : !/[A-Z]/.test(v)
      ? "Al menos una mayúscula"
      : !/[0-9]/.test(v)
      ? "Al menos un número"
      : null,
  required: (label) => (v) =>
    v.trim().length < 2 ? `${label} demasiado corto` : null,
  confirmPassword: (v, pass) =>
    v !== pass ? "Las contraseñas no coinciden" : null,
  fecha: (v) => (!v ? "La fecha es requerida" : null),
};

function useField(initialValue = "", validate) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);
  const onChange = (e) => {
    setValue(e.target.value);
    if (touched && validate) setError(validate(e.target.value));
  };
  const onBlur = () => {
    setTouched(true);
    if (validate) setError(validate(value));
  };
  return { value, error, touched, onChange, onBlur };
}

// ─── Icons ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XCircle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function PasswordStrength({ password }) {
  const rules = [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "Mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ];
  const score = rules.filter((r) => r.ok).length;
  const barColors = ["#ef4444", "#f97316", "#00b4e6"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, transition: "background 0.3s",
            background: i < score ? barColors[score - 1] : "rgba(0,120,170,0.12)" }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
        {rules.map((r) => (
          <span key={r.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11,
            color: r.ok ? "#009ec4" : "rgba(0,80,120,0.38)", transition: "color 0.2s" }}>
            {r.ok ? <CheckIcon /> : <XCircle />} {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Input({ label, type = "text", field, placeholder, extra }) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  const hasError = field.touched && field.error;
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase", color: "#007aaa", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPassword ? (showPass ? "text" : "password") : type}
          value={field.value}
          onChange={field.onChange}
          onBlur={() => { setFocused(false); field.onBlur(); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          style={{
            width: "100%", boxSizing: "border-box", fontFamily: "inherit", fontSize: 14,
            padding: isPassword ? "11px 44px 11px 14px" : "11px 14px",
            borderRadius: 10, outline: "none", color: "#003a56",
            background: hasError ? "rgba(239,68,68,0.04)" : focused ? "rgba(0,180,230,0.05)" : "rgba(255,255,255,0.85)",
            border: `1.5px solid ${hasError ? "rgba(239,68,68,0.45)" : focused ? "#00b4e6" : "rgba(0,160,210,0.22)"}`,
            boxShadow: focused ? "0 0 0 3px rgba(0,180,230,0.14)" : "0 1px 3px rgba(0,140,190,0.07)",
            transition: "all 0.2s",
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass((s) => !s)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#0099cc", padding: 0, display: "flex" }}>
            <EyeIcon open={showPass} />
          </button>
        )}
      </div>
      {hasError && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444" }}>{field.error}</p>}
      {extra}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading} className="submit-btn"
      style={{ width: "100%", padding: "13px", border: "none", borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        background: loading ? "rgba(0,180,230,0.38)" : "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
        color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : "0 4px 20px rgba(0,180,230,0.38)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
      {loading ? (
        <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Procesando...</>
      ) : label}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Login_page() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Obtener location
  const { login } = useAuth();

  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [animating, setAnimating] = useState(false);

  const switchView = (v) => {
    setAnimating(true);
    setTimeout(() => { setView(v); setAnimating(false); }, 220);
  };

  // Login fields
  const loginEmail = useField("", validators.email);
  const loginPass = useField("");

  // Register fields
  const regNombres = useField("", validators.required("Nombres"));
  const regApellidos = useField("", validators.required("Apellidos"));
  const regFecha = useField("", validators.fecha);
  const regEmail = useField("", validators.email);
  const regPass = useField("", validators.password);
  const regConfirm = useField("", (v) => validators.confirmPassword(v, regPass.value));

  const handleLogin = async (e) => {
    e.preventDefault();
    loginEmail.onBlur(); loginPass.onBlur();
    if (validators.email(loginEmail.value) || !loginPass.value) {
      toast.error("Completa todos los campos correctamente"); return;
    }
    setLoading(true);
    try {
      const res = await authService.login({ email: loginEmail.value, password: loginPass.value });
      login(res.access_token, res.user, remember);
      toast.success(`¡Bienvenido, ${res.user.nombres ?? res.user.email}!`);
       // 👇 Redirigir a donde venía o a inicio
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    regNombres.onBlur(); regApellidos.onBlur(); regFecha.onBlur();
    regEmail.onBlur(); regPass.onBlur(); regConfirm.onBlur();
    const errs = [
      validators.required("Nombres")(regNombres.value),
      validators.required("Apellidos")(regApellidos.value),
      validators.fecha(regFecha.value),
      validators.email(regEmail.value),
      validators.password(regPass.value),
      validators.confirmPassword(regConfirm.value, regPass.value),
    ].filter(Boolean);
    if (errs.length) { toast.error(errs[0]); return; }
    setLoading(true);
    try {
      await authService.register({
        nombres: regNombres.value, apellidos: regApellidos.value,
        fecha_nacimiento: regFecha.value, email: regEmail.value, password: regPass.value,
      });
      toast.success("¡Cuenta creada! Ahora inicia sesión.");
      setTimeout(() => switchView("login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const titles = { login: "¡Hola de nuevo!", register: "Crear cuenta" };
  const subtitles = { login: "Ingresa tus credenciales para continuar", register: "Únete a la comunidad VIBES" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes blob   { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:.8;transform:scale(1.07)} }
        .auth-card { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .submit-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,175,225,0.48)!important; }
        .submit-btn:active:not(:disabled){ transform:translateY(0); }
        .link-btn { background:none; border:none; cursor:pointer; color:#0099cc; font-size:13px; font-family:inherit; padding:0; }
        .link-btn:hover { color:#006fa0; text-decoration:underline; }
        input::placeholder { color:rgba(0,80,120,0.28); }
        .vibes-icon { animation: float 3.5s ease-in-out infinite; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 20, position: "relative", overflow: "hidden",
        background: "linear-gradient(150deg, #dff5ff 0%, #b2ecff 45%, #cef4ff 75%, #eafcff 100%)" }}>

        {[
          { s: 420, top: "-10%", left: "-7%",  c: "rgba(0,195,240,0.22)" },
          { s: 500, bottom: "-14%", right: "-5%", c: "rgba(0,140,205,0.15)" },
          { s: 260, top: "38%", left: "58%",   c: "rgba(0,215,255,0.13)" },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", width: b.s, height: b.s, borderRadius: "50%",
            background: b.c, filter: "blur(72px)", top: b.top, bottom: b.bottom, left: b.left, right: b.right,
            animation: `blob ${4 + i}s ease-in-out infinite`, pointerEvents: "none" }} />
        ))}

        <div className="auth-card" style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1,
          background: "rgba(255,255,255,0.78)", border: "1.5px solid rgba(0,180,230,0.22)",
          borderRadius: 22, padding: "36px 36px 30px", backdropFilter: "blur(24px)",
          boxShadow: "0 20px 64px rgba(0,150,210,0.2), inset 0 1px 0 rgba(255,255,255,0.95)" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="vibes-icon" style={{ width: 68, height: 68, borderRadius: "50%",
              margin: "0 auto 12px", background: "linear-gradient(135deg, #00d4f5 0%, #007ec8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 24px rgba(0,180,230,0.5), 0 0 0 5px rgba(0,200,240,0.14)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M3 6l9 13L21 6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800,
              letterSpacing: "0.22em", color: "#0099cc", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              VIBES
            </span>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800,
              color: "#002d44", letterSpacing: "-0.02em", marginBottom: 4 }}>
              {titles[view]}
            </h1>
            <p style={{ fontSize: 13, color: "#5aabb8" }}>{subtitles[view]}</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(0,160,210,0.08)", borderRadius: 10, padding: 4, marginBottom: 22 }}>
            {["login", "register"].map((v) => (
              <button key={v} onClick={() => switchView(v)}
                style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s",
                  background: view === v ? "#fff" : "transparent",
                  color: view === v ? "#0090c8" : "rgba(0,100,148,0.42)",
                  boxShadow: view === v ? "0 2px 10px rgba(0,150,200,0.18)" : "none" }}>
                {v === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          {/* LOGIN */}
          {view === "login" && !animating && (
            <form onSubmit={handleLogin} noValidate>
              <Input label="Correo electrónico" type="email" field={loginEmail} placeholder="tu@email.com" />
              <Input label="Contraseña" type="password" field={loginPass} placeholder="••••••••"
                extra={
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "#5aabb8" }}>
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                        style={{ accentColor: "#00b4e6", width: 13, height: 13 }} />
                      Recordar sesión
                    </label>
                  </div>
                }
              />
              <SubmitButton loading={loading} label="Iniciar sesión" />
            </form>
          )}

          {/* REGISTER */}
          {view === "register" && !animating && (
            <form onSubmit={handleRegister} noValidate>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Input label="Nombres" type="text" field={regNombres} placeholder="Juan" />
                </div>
                <div style={{ flex: 1 }}>
                  <Input label="Apellidos" type="text" field={regApellidos} placeholder="García" />
                </div>
              </div>
              <Input label="Fecha de nacimiento" type="date" field={regFecha} placeholder="" />
              <Input label="Correo electrónico" type="email" field={regEmail} placeholder="tu@email.com" />
              <Input label="Contraseña" type="password" field={regPass} placeholder="••••••••"
                extra={<PasswordStrength password={regPass.value} />} />
              <Input label="Confirmar contraseña" type="password" field={regConfirm} placeholder="••••••••" />
              <SubmitButton loading={loading} label="Crear cuenta" />
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 11, color: "rgba(0,100,148,0.3)" }}>
            © 2025 VIBES · Todos los derechos reservados
          </p>
        </div>
      </div>
    </>
  );
}