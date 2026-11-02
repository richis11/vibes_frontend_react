import { useState } from "react";
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

  // 👇 Nueva función para resetear completamente el campo
  const reset = () => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  };

  return { value, error, touched, onChange, onBlur, reset };
}

// ─── Icons ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XCircle = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 999,
              transition: "background 0.3s",
              background: i < score ? barColors[score - 1] : "rgba(0,0,0,0.06)",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {rules.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: r.ok ? "#10b981" : "#94a3b8",
            }}
          >
            {r.ok ? <CheckIcon /> : <XCircle />}
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  field,
  placeholder,
  icon,
  toggleVisibility,
  showPassword,
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "#002d44",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={field.value}
          onChange={field.onChange}
          onBlur={(e) => {
            field.onBlur();
            e.target.style.borderColor = field.error
              ? "#ef4444"
              : "rgba(0,180,230,0.2)";
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00b4e6")}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 40px 12px 14px",
            border:
              field.touched && field.error
                ? "1.5px solid #ef4444"
                : "1.5px solid rgba(0,180,230,0.2)",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            transition: "border 0.2s",
            background: "#fafcfd",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        {icon && (
          <button
            type="button"
            onClick={toggleVisibility}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5aabb8",
              padding: 4,
            }}
          >
            {icon}
          </button>
        )}
      </div>
      {field.touched && field.error && (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ef4444" }}>
          {field.error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: 12,
        transition: "all 0.2s",
        background: loading
          ? "rgba(0,180,230,0.5)"
          : "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : "0 4px 20px rgba(0,180,230,0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 4,
      }}
    >
      {loading ? (
        <>
          <div
            style={{
              width: 16,
              height: 16,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Procesando...
        </>
      ) : (
        label
      )}
    </button>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────
export default function Modal_login({ show, onClose, onSuccess }) {
  const { login } = useAuth();

  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [animating, setAnimating] = useState(false);

  // 👇 Estados para mensajes de error
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const switchView = (v) => {
    setAnimating(true);
    // Limpiar errores al cambiar de vista
    setLoginError("");
    setRegisterError("");
    setTimeout(() => {
      setView(v);
      setAnimating(false);
    }, 220);
  };

  // Login fields
  const loginEmail = useField("", validators.email);
  const loginPass = useField("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register fields
  const regNombres = useField("", validators.required("Nombres"));
  const regApellidos = useField("", validators.required("Apellidos"));
  const regFecha = useField("", validators.fecha);
  const regEmail = useField("", validators.email);
  const regPass = useField("", validators.password);
  const regConfirm = useField("", (v) =>
    validators.confirmPassword(v, regPass.value),
  );
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // 👇 Función para limpiar todos los campos
  const clearAllFields = () => {
    // Resetear campos de login (limpia value, error y touched)
    loginEmail.reset();
    loginPass.reset();

    // Resetear campos de registro
    regNombres.reset();
    regApellidos.reset();
    regFecha.reset();
    regEmail.reset();
    regPass.reset();
    regConfirm.reset();

    // Limpiar estados de error
    setLoginError("");
    setRegisterError("");
    setRemember(false);

    // Resetear estados de visibilidad de contraseñas
    setShowLoginPass(false);
    setShowRegPass(false);
    setShowRegConfirm(false);
  };

  // 👇 Limpiar campos cuando se cierra el modal
  const handleClose = () => {
    clearAllFields();
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); // Limpiar error anterior

    loginEmail.onBlur();
    loginPass.onBlur();

    if (validators.email(loginEmail.value) || !loginPass.value) {
      setLoginError("Por favor completa todos los campos correctamente");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({
        email: loginEmail.value,
        password: loginPass.value,
      });

      login(res.access_token, res.user, remember);
      toast.success(`¡Bienvenido, ${res.user.nombres ?? "Usuario"}!`);

      // Limpiar campos después de login exitoso
      clearAllFields();

      onSuccess?.(); // Callback al padre
      onClose(); // Cerrar modal
    } catch (err) {
      // 👇 Mostrar error en el modal en lugar de toast
      const errorMessage =
        err.response?.data?.message || "Credenciales incorrectas";
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError(""); // Limpiar error anterior

    [regNombres, regApellidos, regFecha, regEmail, regPass, regConfirm].forEach(
      (f) => f.onBlur(),
    );

    const hasErrors = [
      validators.required("Nombres")(regNombres.value),
      validators.required("Apellidos")(regApellidos.value),
      validators.fecha(regFecha.value),
      validators.email(regEmail.value),
      validators.password(regPass.value),
      validators.confirmPassword(regConfirm.value, regPass.value),
    ].some(Boolean);

    if (hasErrors) {
      setRegisterError("Por favor completa todos los campos correctamente");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        email: regEmail.value,
        password: regPass.value,
        nombres: regNombres.value,
        apellidos: regApellidos.value,
        fecha_nacimiento: regFecha.value,
      });

      toast.success("¡Registro exitoso! Ahora inicia sesión");

      // Limpiar campos de registro usando reset
      regNombres.reset();
      regApellidos.reset();
      regFecha.reset();
      regEmail.reset();
      regPass.reset();
      regConfirm.reset();
      setRegisterError("");
      setShowRegPass(false);
      setShowRegConfirm(false);

      switchView("login");
    } catch (err) {
      // 👇 Mostrar error en el modal
      const errorMessage =
        err.response?.data?.message ||
        "Error al crear la cuenta. Intenta nuevamente";
      setRegisterError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes contentFade { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1040,
          background: "rgba(0,20,40,0.55)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          pointerEvents: "none",
        }}
      >
        <div className="modal-scroll"
          style={{
            width: "100%",
            maxWidth: 440,
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            pointerEvents: "all",
            boxShadow: "0 24px 80px rgba(0,140,200,0.25)",
            animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1)",
            fontFamily: "'DM Sans', sans-serif",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Header con botón cerrar */}
          <div
            style={{
              padding: "22px 24px 18px",
              borderBottom: "1px solid rgba(0,180,230,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#002d44",
                margin: 0,
              }}
            >
              {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#5aabb8",
                fontSize: 24,
                lineHeight: 1,
                padding: 4,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#0090c8")}
              onMouseLeave={(e) => (e.target.style.color = "#5aabb8")}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "28px 24px 32px",
              //animationName: animating ? "none" : "contentFade",
              //animationDuration: "0.3s",
              //animationTimingFunction: "ease",
              //animationFillMode: "both",
              //animationDelay: "0.1s", // ✅ Ahora todas son propiedades específicas
            }}
          >
            {view === "login" ? (
              <form onSubmit={handleLogin}>
                <InputField
                  label="Email"
                  type="email"
                  field={loginEmail}
                  placeholder="tu@email.com"
                />
                <InputField
                  label="Contraseña"
                  type="password"
                  field={loginPass}
                  placeholder="••••••••"
                  icon={<EyeIcon open={showLoginPass} />}
                  toggleVisibility={() => setShowLoginPass(!showLoginPass)}
                  showPassword={showLoginPass}
                />

                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: -6,
                    marginBottom: 20,
                  }}
                >
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{
                      width: 16,
                      height: 16,
                      cursor: "pointer",
                      accentColor: "#00b4e6",
                    }}
                  />
                  <label
                    htmlFor="remember"
                    style={{
                      fontSize: 13,
                      color: "#5aabb8",
                      cursor: "pointer",
                    }}
                  >
                    Mantener sesión iniciada
                  </label>
                </div> */}

                {/* 👇 Mensaje de error de login */}
                {loginError && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1.5px solid rgba(239, 68, 68, 0.2)",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#ef4444",
                        fontWeight: 500,
                      }}
                    >
                      {loginError}
                    </span>
                  </div>
                )}

                <SubmitButton loading={loading} label="Iniciar sesión" />

                <p
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 13,
                    color: "#5aabb8",
                  }}
                >
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("register")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#00b4e6",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Regístrate aquí
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <InputField
                    label="Nombres"
                    field={regNombres}
                    placeholder="Juan"
                  />
                  <InputField
                    label="Apellidos"
                    field={regApellidos}
                    placeholder="Pérez"
                  />
                </div>
                <InputField
                  label="Fecha de nacimiento"
                  type="date"
                  field={regFecha}
                />
                <InputField
                  label="Email"
                  type="email"
                  field={regEmail}
                  placeholder="tu@email.com"
                />
                <InputField
                  label="Contraseña"
                  type="password"
                  field={regPass}
                  placeholder="••••••••"
                  icon={<EyeIcon open={showRegPass} />}
                  toggleVisibility={() => setShowRegPass(!showRegPass)}
                  showPassword={showRegPass}
                />
                <PasswordStrength password={regPass.value} />
                <div style={{ marginTop: 18 }}>
                  <InputField
                    label="Confirmar contraseña"
                    type="password"
                    field={regConfirm}
                    placeholder="••••••••"
                    icon={<EyeIcon open={showRegConfirm} />}
                    toggleVisibility={() => setShowRegConfirm(!showRegConfirm)}
                    showPassword={showRegConfirm}
                  />
                </div>

                {/* 👇 Mensaje de error de registro */}
                {registerError && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1.5px solid rgba(239, 68, 68, 0.2)",
                      marginTop: 16,
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#ef4444",
                        fontWeight: 500,
                      }}
                    >
                      {registerError}
                    </span>
                  </div>
                )}

                <SubmitButton loading={loading} label="Crear cuenta" />

                <p
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 13,
                    color: "#5aabb8",
                  }}
                >
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#00b4e6",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Inicia sesión
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
