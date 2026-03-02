import { useNavigate } from "react-router-dom";

const LINKS = [
  {
    titulo: "Explorar",
    items: [
      { label: "Casas disponibles", path: "/casas" },
      { label: "Mis reservas", path: "/mis_reservas" },
      { label: "Mi perfil", path: "/perfil" },
    ],
  },
  {
    titulo: "Anfitriones",
    items: [
      { label: "Mi panel", path: "/mi-panel" },
      { label: "Mis reservas", path: "/reservas-anfitrion" },
    ],
  },
  {
    titulo: "Soporte",
    items: [
      { label: "Centro de ayuda", path: "#" },
      { label: "Términos y condiciones", path: "#" },
      { label: "Política de privacidad", path: "#" },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .footer-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #7ab8cc;
          text-align: left;
          transition: color 0.18s;
          line-height: 1;
        }
        .footer-link:hover { color: #ffffff; }

        .footer-social {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s;
          color: #7ab8cc;
        }
        .footer-social:hover {
          background: rgba(0,180,230,0.2);
          border-color: rgba(0,180,230,0.4);
          color: #fff;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1; }
        }
      `}</style>

      <footer
        style={{
          background: "linear-gradient(160deg, #001f33 0%, #002d44 60%, #00394f 100%)",
          borderTop: "1px solid rgba(0,180,230,0.12)",
          fontFamily: "'DM Sans', sans-serif",
          paddingTop: 52,
          paddingBottom: 28,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Grid principal */}
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
              gap: "40px 32px",
              marginBottom: 48,
            }}
          >
            {/* Columna Brand */}
            <div className="footer-brand" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #00c6f0, #0078a8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(0,180,230,0.35)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="white" fillOpacity="0.9"/>
                    <rect x="8" y="13" width="3" height="4" rx="1" fill="white" fillOpacity="0.5"/>
                    <rect x="13" y="13" width="3" height="4" rx="1" fill="white" fillOpacity="0.5"/>
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Vibes
                </span>
              </div>

              {/* Tagline */}
              <p
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  color: "#7ab8cc",
                  lineHeight: 1.65,
                  maxWidth: 240,
                }}
              >
                Encuentra espacios únicos para vivir experiencias inolvidables. Casas que se sienten como hogar.
              </p>

              {/* Redes sociales */}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {/* Instagram */}
                <button className="footer-social" title="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                </button>
                {/* Facebook */}
                <button className="footer-social" title="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </button>
                {/* Twitter/X */}
                <button className="footer-social" title="Twitter">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Columnas de links */}
            {LINKS.map((grupo) => (
              <div key={grupo.titulo} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#fff",
                  }}
                >
                  {grupo.titulo}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {grupo.items.map((item) => (
                    <button
                      key={item.label}
                      className="footer-link"
                      onClick={() => item.path !== "#" && navigate(item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Divisor */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,180,230,0.2) 30%, rgba(0,180,230,0.2) 70%, transparent)",
              marginBottom: 24,
            }}
          />

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12.5, color: "#4a7a8a" }}>
              © {year} Vibes. Todos los derechos reservados.
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#4a7a8a",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              Hecho con
              <span style={{ color: "#00b4e6", fontSize: 14 }}>♥</span>
              en Ecuador
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}