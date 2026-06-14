import { useState, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ALLERGENS_LIST = [
  { id: "gluten", label: "Gluten", icon: "🌾" },
  { id: "crustaces", label: "Crustacés", icon: "🦐" },
  { id: "oeufs", label: "Œufs", icon: "🥚" },
  { id: "poisson", label: "Poisson", icon: "🐟" },
  { id: "arachides", label: "Arachides", icon: "🥜" },
  { id: "soja", label: "Soja", icon: "🌱" },
  { id: "lait", label: "Lait", icon: "🥛" },
  { id: "sesame", label: "Sésame", icon: "⚪" },
];

const DEFAULT_BRANDING = {
  name: "Sakura Kitchen",
  tagline: "Cuisine japonaise maison",
  emoji: "🌸",
  logo: null,
  coverPhoto: null,
  primaryColor: "#e8637a",
  secondaryColor: "#1a1a2e",
  accentColor: "#c9963a",
};

const INITIAL_MENU = [
  { id: 1, category: "Plats", name: "Ramen Tonkotsu", price: 13.5, desc: "Bouillon de porc crémeux, chashu, œuf mollet, nori", emoji: "🍜", available: true, allergens: ["gluten", "oeufs", "soja"], orderCount: 42, supplements: [{ id: "s1", name: "Chashu extra", price: 2.5 }, { id: "s2", name: "Œuf mollet", price: 1.5 }, { id: "s3", name: "Bambou", price: 1.0 }] },
  { id: 2, category: "Plats", name: "Chirashi Saumon", price: 15.0, desc: "Riz vinaigré, saumon frais, avocat, tobiko", emoji: "🍱", available: true, allergens: ["poisson", "sesame"], orderCount: 38, supplements: [{ id: "s4", name: "Thon extra", price: 3.0 }, { id: "s5", name: "Avocat", price: 1.5 }] },
  { id: 3, category: "Plats", name: "Gyoza (6 pcs)", price: 8.5, desc: "Raviolis grillés porc & ciboulette, sauce ponzu", emoji: "🥟", available: true, allergens: ["gluten", "soja"], orderCount: 27, supplements: [{ id: "s6", name: "Sauce spicy", price: 0.5 }] },
  { id: 4, category: "Plats", name: "Katsu Curry", price: 14.0, desc: "Porc pané, riz japonais, sauce curry maison", emoji: "🍛", available: false, allergens: ["gluten"], orderCount: 19, supplements: [{ id: "s7", name: "Riz extra", price: 2.0 }, { id: "s8", name: "Légumes sautés", price: 2.5 }] },
  { id: 5, category: "Desserts", name: "Mochi Glacé (3 pcs)", price: 6.5, desc: "Matcha, framboise, yuzu", emoji: "🍡", available: true, allergens: ["lait"], orderCount: 31, supplements: [] },
  { id: 6, category: "Desserts", name: "Cheesecake Japonais", price: 7.0, desc: "Texture nuage, coulis de fruits rouges", emoji: "🍰", available: true, allergens: ["gluten", "oeufs", "lait"], orderCount: 15, supplements: [{ id: "s9", name: "Coulis extra", price: 0.5 }] },
  { id: 7, category: "Desserts", name: "Taiyaki Nutella", price: 5.5, desc: "Gaufre poisson, cœur nutella fondant", emoji: "🐟", available: true, allergens: ["gluten", "arachides", "lait"], orderCount: 22, supplements: [] },
];

const INITIAL_USERS = [
  { id: "u1", name: "Marie Tanaka", phone: "0612345678", allergens: ["gluten"], orderHistory: [{ id: "ORD-1001", date: "2024-03-10", total: 21.0, items: ["Chirashi Saumon", "Mochi Glacé"] }], favorites: [1, 5] },
  { id: "u2", name: "Lucas Martin", phone: "0698765432", allergens: [], orderHistory: [], favorites: [3] },
];

const INITIAL_ORDERS = [
  { id: "ORD-1001", userId: "u1", userName: "Marie Tanaka", phone: "0612345678", date: "2024-03-10", total: 21.0, status: "Livré", items: ["Chirashi Saumon", "Mochi Glacé"], pickup: "Sakura Centre-Ville" },
];

const PICKUP_POINTS = [
  { id: "p1", name: "Centre-Ville", address: "12 rue du Marché, 75001 Paris", time: "11h–21h" },
  { id: "p2", name: "Belleville", address: "34 av. de la République, 75011 Paris", time: "12h–22h" },
  { id: "p3", name: "La Défense", address: "8 esplanade des Corolles, 92400 Courbevoie", time: "11h30–20h" },
];

const INITIAL_REVIEWS = [
  { id: 1, name: "Marie T.", stars: 5, text: "Le ramen tonkotsu est divin !", date: "il y a 2 jours", approved: true },
  { id: 2, name: "Lucas M.", stars: 4, text: "Très bon chirashi, retrait rapide.", date: "il y a 5 jours", approved: true },
];

const PENDING_REVIEWS_INIT = [
  { id: 99, name: "Sophie K.", stars: 3, text: "Bien mais un peu long.", date: "aujourd'hui" },
];

const PALETTE_PRESETS = [
  { name: "Sakura", primary: "#e8637a", secondary: "#1a1a2e", accent: "#c9963a" },
  { name: "Océan", primary: "#1565c0", secondary: "#0d2137", accent: "#00acc1" },
  { name: "Forêt", primary: "#2e7d32", secondary: "#1b2820", accent: "#f9a825" },
  { name: "Soleil", primary: "#f57c00", secondary: "#1a1a2e", accent: "#7b1fa2" },
  { name: "Nuit", primary: "#7c4dff", secondary: "#0a0a1a", accent: "#00e5ff" },
  { name: "Rose", primary: "#c2185b", secondary: "#1a0a14", accent: "#ffb300" },
];

const DEFAULT_EVENT = {
  active: true,
  title: "Soirée Yasuke — Nuit Japonaise",
  subtitle: "Un dîner immersif unique avec performance live",
  date: "Samedi 28 juin 2025",
  time: "19h30 – 23h00",
  location: "Paris 11ème — adresse communiquée après réservation",
  price: 45,
  description: "Plongez dans une soirée japonaise exceptionnelle organisée par Yasuke. Au programme : menu dégustation Sakura Kitchen (6 plats), musique live, cocktails japonais et surprises. Places limitées à 40 personnes.",
  spots: 40,
  spotsLeft: 12,
  image: null,
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

function makeS(b) {
  return {
    ink: b.secondaryColor, cream: "#fdf6ee",
    primary: b.primaryColor, primaryLight: b.primaryColor + "22",
    primaryDark: b.primaryColor + "dd",
    gold: b.accentColor, goldLight: b.accentColor + "22",
    muted: "#8a8a9a", border: "#ede8e0", white: "#ffffff",
    green: "#3a8a5c", greenLight: "#e8f5ee",
    red: "#e53935", redLight: "#fdecea",
  };
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────

function Badge({ children, color, textColor = "#fff" }) {
  return <span style={{ background: color, color: textColor, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{children}</span>;
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #ede8e0", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }} />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#3a8a5c" : "#ede8e0", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function AllergenTag({ id }) {
  const a = ALLERGENS_LIST.find(x => x.id === id);
  if (!a) return null;
  return <span style={{ background: "#fdf3e3", border: "1px solid #c9963a", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600, color: "#c9963a", display: "inline-flex", alignItems: "center", gap: 3 }}>{a.icon} {a.label}</span>;
}

function PhotoUpload({ label, value, onChange, shape = "rect" }) {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  const radius = shape === "circle" ? "50%" : 14;
  const w = shape === "circle" ? 80 : "100%";
  const h = shape === "circle" ? 80 : 100;

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>}
      <div onClick={() => ref.current.click()} style={{
        width: w, height: h, borderRadius: radius, border: "2px dashed #ede8e0",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", overflow: "hidden", background: "#fdf6ee", flexShrink: 0
      }}>
        {value
          ? <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ textAlign: "center", color: "#8a8a9a" }}>
              <div style={{ fontSize: 24 }}>📷</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Ajouter</div>
            </div>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

// ─── EVENT BANNER ─────────────────────────────────────────────────────────────

function EventBanner({ event, S, onClick }) {
  if (!event?.active) return null;
  const pct = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);
  return (
    <div onClick={onClick} style={{
      background: "linear-gradient(135deg, #1a0533 0%, #4a1060 50%, #1a0533 100%)",
      padding: "12px 16px", cursor: "pointer", position: "relative", overflow: "hidden"
    }}>
      {/* Shimmer effect */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>🎌</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#f0a0ff", textTransform: "uppercase", letterSpacing: "1px" }}>Événement Yasuke</span>
            <span style={{ background: "#f0a0ff22", border: "1px solid #f0a0ff55", borderRadius: 20, padding: "1px 7px", fontSize: 10, color: "#f0a0ff", fontWeight: 700 }}>
              {event.spotsLeft} places restantes
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>📅 {event.date} · {event.price} €/pers</div>
          <div style={{ marginTop: 5, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #f0a0ff, #a855f7)", width: `${pct}%`, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ flexShrink: 0, background: "linear-gradient(135deg, #a855f7, #6d28d9)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>Réserver</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>→</div>
        </div>
      </div>
    </div>
  );
}

// ─── EVENT PAGE ───────────────────────────────────────────────────────────────

function EventPage({ event, S, user, onClose, onReserve }) {
  const [method, setMethod] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [guests, setGuests] = useState(1);
  const pct = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);

  const METHODS = [
    { id: "card", icon: "💳", label: "Carte bancaire" },
    { id: "apple", icon: "🍎", label: "Apple Pay" },
    { id: "revolut", icon: "🔵", label: "Revolut" },
    { id: "onsite", icon: "🏪", label: "Sur place à l'événement" },
  ];

  const handleConfirm = () => {
    if (!method) return;
    onReserve({ guests, method, total: event.price * guests });
    setConfirmed(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", background: "#0d001a" }}>
      {/* Header */}
      <div style={{ position: "relative", minHeight: 180, background: "linear-gradient(135deg, #1a0533 0%, #6d28d9 100%)", overflow: "hidden", flexShrink: 0 }}>
        {event.image && <img src={event.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0d001a)" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#f0a0ff", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>🎌 Événement Yasuke</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{event.title}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎌</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Préréservation confirmée !</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>Vous recevrez un SMS de confirmation avec tous les détails.</div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Événement</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "right", maxWidth: "60%" }}>{event.title}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Date</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{event.date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Personnes</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{guests}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Total</span>
                <span style={{ color: "#a855f7", fontWeight: 800, fontSize: 18 }}>{(event.price * guests).toFixed(2)} €</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "14px 0", background: "#6d28d9", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Retour à l'app</button>
          </div>
        ) : (
          <>
            {/* Info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { icon: "📅", label: "Date", val: event.date },
                { icon: "⏰", label: "Horaires", val: event.time },
                { icon: "📍", label: "Lieu", val: event.location },
                { icon: "🎟️", label: "Prix", val: `${event.price} € / pers` },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, lineHeight: 1.3 }}>{item.val}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{event.description}</div>
            </div>

            {/* Places restantes */}
            <div style={{ background: "rgba(168,85,247,0.1)", borderRadius: 14, padding: "12px 16px", marginBottom: 20, border: "1px solid rgba(168,85,247,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f0a0ff" }}>Places disponibles</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#f0a0ff" }}>{event.spotsLeft} / {event.spots}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)" }}>
                <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #a855f7, #f0a0ff)", width: `${pct}%` }} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{pct}% des places réservées</div>
            </div>

            {/* Guests selector */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>Nombre de personnes</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 20, cursor: "pointer" }}>−</button>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", minWidth: 40, textAlign: "center" }}>{guests}</span>
                <button onClick={() => setGuests(g => Math.min(event.spotsLeft, g + 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "#6d28d9", color: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
                <div style={{ marginLeft: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#a855f7" }}>{(event.price * guests).toFixed(2)} €</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{event.price} € × {guests}</div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>Mode de paiement</div>
              {METHODS.map(m => (
                <div key={m.id} onClick={() => setMethod(m.id)} style={{
                  background: method === m.id ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)",
                  borderRadius: 12, padding: "12px 16px", marginBottom: 8, cursor: "pointer",
                  border: `2px solid ${method === m.id ? "#a855f7" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ color: "#fff", fontWeight: method === m.id ? 700 : 400, fontSize: 14 }}>{m.icon} {m.label}</span>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: method === m.id ? "#a855f7" : "transparent", border: `2px solid ${method === m.id ? "#a855f7" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {method === m.id && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleConfirm} style={{
              width: "100%", padding: "16px 0",
              background: method ? "linear-gradient(135deg, #6d28d9, #a855f7)" : "rgba(255,255,255,0.1)",
              color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800,
              cursor: method ? "pointer" : "default"
            }}>
              {method ? `Préréserver — ${(event.price * guests).toFixed(2)} €` : "Choisissez un mode de paiement"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────

function AuthPage({ branding, onLogin, onRegister }) {
  const S = makeS(branding);
  const [mode, setMode] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [allergens, setAllergens] = useState([]);
  const [error, setError] = useState("");

  const toggleAllergen = (id) => setAllergens(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSubmit = () => {
    setError("");
    if (mode === "login") {
      if (!phone.trim()) { setError("Entrez votre numéro de téléphone"); return; }
      const result = onLogin(phone.trim());
      if (!result) setError("Numéro non reconnu. Créez un compte !");
    } else {
      if (!firstName || !lastName || !phone) { setError("Tous les champs sont requis"); return; }
      if (phone.length < 10) { setError("Numéro de téléphone invalide"); return; }
      onRegister({ firstName, lastName, phone, allergens });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ee", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${S.ink} 0%, ${S.primary}99 100%)`, padding: "52px 24px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {branding.coverPhoto && <img src={branding.coverPhoto} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />}
        <div style={{ position: "relative", zIndex: 1 }}>
          {branding.logo
            ? <img src={branding.logo} alt="logo" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)", marginBottom: 12 }} />
            : <div style={{ fontSize: 56, marginBottom: 8 }}>{branding.emoji}</div>
          }
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{branding.name}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{branding.tagline}</div>
        </div>
      </div>

      <div style={{ padding: "28px 20px" }}>
        <div style={{ display: "flex", background: "#fff", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid #ede8e0" }}>
          {[["login","Déjà client"],["register","Nouveau client"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: mode === m ? S.primary : "transparent", color: mode === m ? "#fff" : "#8a8a9a", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{label}</button>
          ))}
        </div>

        {mode === "login" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Connexion rapide</div>
              <div style={{ fontSize: 13, color: "#8a8a9a", marginTop: 4 }}>Entrez votre numéro pour vous connecter</div>
            </div>
            <Input label="Numéro de téléphone" value={phone} onChange={setPhone} placeholder="06 12 34 56 78" type="tel" />
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><Input label="Prénom" value={firstName} onChange={setFirstName} placeholder="Marie" /></div>
              <div style={{ flex: 1 }}><Input label="Nom" value={lastName} onChange={setLastName} placeholder="Dupont" /></div>
            </div>
            <Input label="Numéro de téléphone" value={phone} onChange={setPhone} placeholder="06 12 34 56 78" type="tel" />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Mes allergies (optionnel)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ALLERGENS_LIST.map(a => (
                  <div key={a.id} onClick={() => toggleAllergen(a.id)} style={{ padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600, background: allergens.includes(a.id) ? "#fdf3e3" : "#fff", border: `1.5px solid ${allergens.includes(a.id) ? "#c9963a" : "#ede8e0"}`, color: allergens.includes(a.id) ? "#c9963a" : "#8a8a9a" }}>
                    {a.icon} {a.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {error && <div style={{ background: "#fdecea", border: "1px solid #e53935", borderRadius: 10, padding: "10px 14px", color: "#e53935", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>⚠️ {error}</div>}

        <button onClick={handleSubmit} style={{ width: "100%", padding: "15px 0", background: S.primary, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
          {mode === "login" ? "Me connecter →" : "Créer mon compte →"}
        </button>

        {mode === "login" && <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#8a8a9a" }}>Démo : tapez 0612345678</div>}
      </div>
    </div>
  );
}

// ─── SUPPLEMENT MODAL ─────────────────────────────────────────────────────────

function SupplementModal({ item, userAllergens, S, onClose, onAdd }) {
  const [selected, setSelected] = useState({});
  const extras = item.supplements.filter(s => selected[s.id]);
  const total = item.price + extras.reduce((a, s) => a + s.price, 0);
  const conflict = (item.allergens || []).filter(a => userAllergens.includes(a));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,46,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430, padding: "24px 20px 32px", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{item.emoji} {item.name}</div>
            <div style={{ fontSize: 13, color: "#8a8a9a" }}>{item.desc}</div>
          </div>
          <button onClick={onClose} style={{ background: "#ede8e0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, flexShrink: 0, marginLeft: 10 }}>×</button>
        </div>
        {conflict.length > 0 && (
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#856404" }}>⚠️ Contient : {conflict.map(a => ALLERGENS_LIST.find(x => x.id === a)?.label).join(", ")}</div>
          </div>
        )}
        {item.allergens?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
            {item.allergens.map(a => <AllergenTag key={a} id={a} />)}
          </div>
        )}
        {item.supplements.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Suppléments</div>
            {item.supplements.map(sup => (
              <div key={sup.id} onClick={() => setSelected(p => ({ ...p, [sup.id]: !p[sup.id] }))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer", background: selected[sup.id] ? S.primaryLight : "#fdf6ee", border: `2px solid ${selected[sup.id] ? S.primary : "#ede8e0"}` }}>
                <span style={{ fontSize: 14, fontWeight: selected[sup.id] ? 600 : 400 }}>{sup.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: S.gold, fontWeight: 700 }}>+{sup.price.toFixed(2)} €</span>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: selected[sup.id] ? S.primary : "#fff", border: `2px solid ${selected[sup.id] ? S.primary : "#ede8e0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {selected[sup.id] && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <button onClick={() => onAdd(item, extras)} style={{ width: "100%", marginTop: 16, padding: "14px 0", background: S.primary, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "center", gap: 8 }}>
          <span>Ajouter au panier</span>
          <span style={{ background: S.primaryDark, borderRadius: 20, padding: "2px 10px", fontSize: 14 }}>{total.toFixed(2)} €</span>
        </button>
      </div>
    </div>
  );
}

// ─── MENU PAGE ────────────────────────────────────────────────────────────────

function MenuPage({ menu, user, branding, S, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("Plats");
  const [modalItem, setModalItem] = useState(null);
  const [showFavs, setShowFavs] = useState(false);
  const categories = [...new Set(menu.filter(i => i.available).map(i => i.category))];
  const userAllergens = user?.allergens || [];
  let filtered = menu.filter(i => i.available && i.category === activeCategory);
  if (showFavs && user) filtered = filtered.filter(i => user.favorites?.includes(i.id));

  return (
    <div>
      <div style={{ position: "relative", background: `linear-gradient(135deg, ${S.ink} 0%, ${S.primary}99 100%)`, padding: "22px 20px 18px", color: "#fff", overflow: "hidden" }}>
        {branding.coverPhoto && <img src={branding.coverPhoto} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
          {branding.logo
            ? <img src={branding.logo} alt="logo" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)", flexShrink: 0 }} />
            : <div style={{ fontSize: 36, flexShrink: 0 }}>{branding.emoji}</div>
          }
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{branding.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{branding.tagline}</div>
            {user && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Bonjour {user.firstName} 👋</div>}
          </div>
        </div>
        {userAllergens.length > 0 && (
          <div style={{ position: "relative", zIndex: 1, marginTop: 10, background: "rgba(255,193,7,0.18)", borderRadius: 10, padding: "7px 12px", fontSize: 12, color: "#ffc107" }}>
            ⚠️ Vos allergènes sont signalés sur les plats
          </div>
        )}
      </div>

      <div style={{ background: "#fff", padding: "12px 16px", display: "flex", gap: 8, borderBottom: "1px solid #ede8e0", overflowX: "auto" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "7px 18px", borderRadius: 20, fontWeight: 600, fontSize: 13, border: `2px solid ${activeCategory === cat ? S.primary : "#ede8e0"}`, background: activeCategory === cat ? S.primary : "#fff", color: activeCategory === cat ? "#fff" : "#8a8a9a", cursor: "pointer", whiteSpace: "nowrap" }}>{cat}</button>
        ))}
        {user && <button onClick={() => setShowFavs(p => !p)} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: showFavs ? "#fdf3e3" : "#fff", border: `2px solid ${showFavs ? S.gold : "#ede8e0"}`, color: showFavs ? S.gold : "#8a8a9a", cursor: "pointer", whiteSpace: "nowrap" }}>❤️ Favoris</button>}
      </div>

      <div style={{ padding: "16px", background: "#fdf6ee", minHeight: 300 }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "#8a8a9a" }}><div style={{ fontSize: 40 }}>🍽️</div><div style={{ marginTop: 8 }}>Aucun plat disponible</div></div>}
        {filtered.map(item => {
          const hasAllergen = userAllergens.some(a => item.allergens?.includes(a));
          return (
            <div key={item.id} onClick={() => setModalItem(item)} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, padding: "14px 16px", cursor: "pointer", boxShadow: "0 2px 12px rgba(26,26,46,0.06)", border: `1.5px solid ${hasAllergen ? "#ffc107" : "#ede8e0"}`, position: "relative", overflow: "hidden" }}>
              {hasAllergen && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#ffc107" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: 14, background: `linear-gradient(135deg, ${S.primaryLight}, ${S.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</span>
                    {item.orderCount >= 30 && <Badge color={S.primary}>🔥 Populaire</Badge>}
                    {user?.favorites?.includes(item.id) && <span style={{ fontSize: 13 }}>❤️</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#8a8a9a", lineHeight: 1.4, marginBottom: 4 }}>{item.desc}</div>
                  {item.allergens?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{item.allergens.map(a => <AllergenTag key={a} id={a} />)}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{item.price.toFixed(2)} €</div>
                  <div style={{ marginTop: 6, width: 28, height: 28, borderRadius: "50%", background: S.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700, marginLeft: "auto" }}>+</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {modalItem && <SupplementModal item={modalItem} userAllergens={userAllergens} S={S} onClose={() => setModalItem(null)} onAdd={(item, extras) => { onAddToCart(item, extras); setModalItem(null); }} />}
    </div>
  );
}

// ─── CART ─────────────────────────────────────────────────────────────────────

function CartPage({ cart, S, onUpdateQty, onCheckout }) {
  const [pickup, setPickup] = useState(null);
  const total = cart.reduce((a, i) => a + i.lineTotal, 0);
  return (
    <div style={{ padding: "20px", background: "#fdf6ee", minHeight: "100%" }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>🛒 Mon Panier</div>
      {cart.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#8a8a9a" }}><div style={{ fontSize: 48 }}>🍱</div><div style={{ marginTop: 12 }}>Panier vide</div></div>
        : <>
          {cart.map((item, idx) => (
            <div key={idx} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid #ede8e0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{item.emoji} {item.name}</div>
                  {item.extras.length > 0 && <div style={{ fontSize: 11, color: S.primary, marginTop: 2 }}>+ {item.extras.map(e => e.name).join(", ")}</div>}
                  <div style={{ fontSize: 13, color: S.gold, fontWeight: 700, marginTop: 2 }}>{item.lineTotal.toFixed(2)} €</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => onUpdateQty(idx, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #ede8e0", background: "#fdf6ee", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onUpdateQty(idx, 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: S.primary, cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#fff" }}>+</button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📍 Point de retrait</div>
            {PICKUP_POINTS.map(p => (
              <div key={p.id} onClick={() => setPickup(p.id)} style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", marginBottom: 8, cursor: "pointer", border: `2px solid ${pickup === p.id ? S.primary : "#ede8e0"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#8a8a9a" }}>{p.address}</div>
                    <div style={{ fontSize: 11, color: "#3a8a5c", marginTop: 2 }}>⏰ {p.time}</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: pickup === p.id ? S.primary : "#fff", border: `2px solid ${pickup === p.id ? S.primary : "#ede8e0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {pickup === p.id && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", marginTop: 16, border: "1px solid #ede8e0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "#8a8a9a", fontSize: 14 }}>Sous-total</span><span style={{ fontWeight: 600 }}>{total.toFixed(2)} €</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: "#8a8a9a", fontSize: 14 }}>Retrait</span><span style={{ color: "#3a8a5c", fontWeight: 700 }}>Gratuit</span></div>
            <div style={{ borderTop: "1px solid #ede8e0", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 800, fontSize: 17 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 17, color: S.primary }}>{total.toFixed(2)} €</span>
            </div>
          </div>
          <button onClick={() => pickup && onCheckout(pickup)} style={{ width: "100%", marginTop: 16, padding: "16px 0", background: pickup ? S.primary : "#8a8a9a", color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: pickup ? "pointer" : "default" }}>
            {pickup ? "Passer au paiement →" : "Choisissez un point de retrait"}
          </button>
        </>
      }
    </div>
  );
}

// ─── PAYMENT ──────────────────────────────────────────────────────────────────

function PaymentPage({ total, pickupId, S, onConfirm }) {
  const [method, setMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const pickup = PICKUP_POINTS.find(p => p.id === pickupId);

  const METHODS = [
    {
      id: "card",
      icon: "💳",
      label: "Carte bancaire",
      desc: "Visa, Mastercard, CB",
      badge: null,
      color: "#1565c0",
    },
    {
      id: "apple",
      icon: "🍎",
      label: "Apple Pay",
      desc: "Paiement rapide via Face ID / Touch ID",
      badge: null,
      color: "#1a1a2e",
    },
    {
      id: "revolut",
      icon: "🔵",
      label: "Revolut",
      desc: "Paiement instantané par lien",
      badge: "Instantané",
      color: "#191c20",
    },
    {
      id: "onsite",
      icon: "🏪",
      label: "Sur place",
      desc: "Paiement au retrait (CB ou espèces)",
      badge: null,
      color: "#3a8a5c",
    },
  ];

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d; };

  const canConfirm = method && (method !== "card" || (cardNumber.replace(/\s/g,"").length === 16 && cardName && cardExpiry.length === 5 && cardCvc.length === 3));

  return (
    <div style={{ padding: "20px", background: "#fdf6ee", minHeight: "100%" }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Paiement</div>
      <div style={{ fontSize: 13, color: "#8a8a9a", marginBottom: 20 }}>🔒 Sécurisé et chiffré</div>

      {/* Pickup recap */}
      <div style={{ background: "#fdf3e3", borderRadius: 14, padding: "12px 16px", marginBottom: 20, border: "1px solid #c9963a" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#c9963a", textTransform: "uppercase" }}>📍 Point de retrait</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{pickup?.name}</div>
        <div style={{ fontSize: 12, color: "#8a8a9a" }}>{pickup?.address}</div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "#8a8a9a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Mode de paiement</div>

      {METHODS.map(m => (
        <div key={m.id}>
          <div onClick={() => setMethod(m.id)} style={{
            background: "#fff", borderRadius: method === m.id ? "14px 14px 0 0" : 14,
            padding: "14px 16px", marginBottom: method === m.id ? 0 : 10,
            cursor: "pointer", border: `2px solid ${method === m.id ? S.primary : "#ede8e0"}`,
            borderBottom: method === m.id ? `2px solid ${S.primary}` : undefined,
            transition: "all 0.15s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: method === m.id ? S.primaryLight : "#fdf6ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: method === m.id ? 700 : 500, fontSize: 15 }}>{m.label}</span>
                    {m.badge && <span style={{ background: "#e8f5ee", color: "#3a8a5c", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{m.badge}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#8a8a9a", marginTop: 1 }}>{m.desc}</div>
                </div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: method === m.id ? S.primary : "#fff", border: `2px solid ${method === m.id ? S.primary : "#ede8e0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {method === m.id && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
              </div>
            </div>
          </div>

          {/* CB form */}
          {method === "card" && m.id === "card" && (
            <div style={{ background: "#fff", border: `2px solid ${S.primary}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px", marginBottom: 10 }}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Numéro de carte</label>
                <input value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="1234 5678 9012 3456"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ede8e0", fontSize: 15, outline: "none", boxSizing: "border-box", letterSpacing: 2, fontFamily: "monospace" }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Nom sur la carte</label>
                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="MARIE DUPONT"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ede8e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Expiration</label>
                  <input value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/AA"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ede8e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 4, textTransform: "uppercase" }}>CVC</label>
                  <input value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="•••"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #ede8e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                </div>
              </div>
            </div>
          )}

          {/* Revolut info */}
          {method === "revolut" && m.id === "revolut" && (
            <div style={{ background: "#f0f4ff", border: "2px solid #1565c0", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: "#1565c0", fontWeight: 600, marginBottom: 4 }}>🔵 Comment ça marche ?</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                Après confirmation, vous recevrez un <strong>lien de paiement Revolut</strong> par SMS sur votre numéro. Payez en 1 clic depuis l'app Revolut ou votre navigateur.
              </div>
            </div>
          )}

          {/* Sur place info */}
          {method === "onsite" && m.id === "onsite" && (
            <div style={{ background: "#e8f5ee", border: "2px solid #3a8a5c", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: "#3a8a5c", fontWeight: 600, marginBottom: 4 }}>🏪 Paiement au retrait</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                Réglez directement au point de retrait : <strong>CB sans contact</strong> ou <strong>espèces</strong> acceptés. Votre commande sera préparée dès la réception.
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Total */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #ede8e0" }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Total à payer</span>
        <span style={{ fontWeight: 800, fontSize: 20, color: S.primary }}>{total.toFixed(2)} €</span>
      </div>

      <button onClick={() => canConfirm && onConfirm(method)} style={{
        width: "100%", marginTop: 14, padding: "16px 0",
        background: canConfirm ? S.primary : "#c0c0c8",
        color: "#fff", border: "none", borderRadius: 14,
        fontSize: 17, fontWeight: 800, cursor: canConfirm ? "pointer" : "default",
        transition: "background 0.2s"
      }}>
        {method === "onsite" ? "Confirmer — payer sur place" : method === "revolut" ? "Confirmer — recevoir le lien Revolut" : method === "apple" ? "Confirmer avec Apple Pay" : "Confirmer et payer"}
      </button>

      {!method && <div style={{ textAlign: "center", fontSize: 12, color: "#c0c0c8", marginTop: 10 }}>Choisissez un mode de paiement</div>}
    </div>
  );
}

// ─── CONFIRM ──────────────────────────────────────────────────────────────────

function ConfirmPage({ orderNum, pickupId, paymentMethod, S, onNewOrder }) {
  const pickup = PICKUP_POINTS.find(p => p.id === pickupId);
  const payLabels = { card: "💳 Carte bancaire", apple: "🍎 Apple Pay", revolut: "🔵 Revolut", onsite: "🏪 Sur place" };
  const isOnsite = paymentMethod === "onsite";
  const isRevolut = paymentMethod === "revolut";
  return (
    <div style={{ padding: "40px 24px", textAlign: "center", background: "#fdf6ee", minHeight: "100%" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🌸</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Commande confirmée !</div>
      <div style={{ fontSize: 14, color: "#8a8a9a", marginBottom: 24 }}>
        {isRevolut ? "Vous allez recevoir un lien de paiement par SMS" : "Vous recevrez un SMS de confirmation"}
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, border: "1px solid #ede8e0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#8a8a9a", textTransform: "uppercase", marginBottom: 6 }}>Numéro de commande</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: S.primary, letterSpacing: 4 }}>#{orderNum}</div>
        <div style={{ borderTop: "1px solid #ede8e0", marginTop: 16, paddingTop: 16, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#8a8a9a" }}>Retrait</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{pickup?.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#8a8a9a" }}>Horaires</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3a8a5c" }}>{pickup?.time}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#8a8a9a" }}>Paiement</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{payLabels[paymentMethod]}</span>
          </div>
        </div>
      </div>

      {isRevolut && (
        <div style={{ background: "#e8f0fe", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid #1565c0", textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1565c0", marginBottom: 4 }}>🔵 Lien Revolut en route</div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>Un SMS avec votre lien de paiement Revolut vous sera envoyé dans les prochaines minutes.</div>
        </div>
      )}

      {isOnsite && (
        <div style={{ background: "#e8f5ee", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid #3a8a5c", textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#3a8a5c", marginBottom: 4 }}>🏪 Paiement sur place</div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>Réglez au point de retrait par CB sans contact ou espèces. Votre commande sera prête à l'heure indiquée.</div>
        </div>
      )}

      <div style={{ background: "#e8f5ee", borderRadius: 14, padding: "14px 16px", marginBottom: 24, border: "1px solid #3a8a5c", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>⏱️</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#3a8a5c" }}>Temps de préparation estimé</div>
          <div style={{ fontSize: 13, color: "#8a8a9a" }}>20 – 30 minutes</div>
        </div>
      </div>
      <button onClick={onNewOrder} style={{ width: "100%", padding: "16px 0", background: S.ink, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Nouvelle commande</button>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────

function ProfilePage({ user, menu, S, onUpdateUser, onLogout }) {
  const [tab, setTab] = useState("info");
  const [allergens, setAllergens] = useState(user.allergens || []);
  const [favorites, setFavorites] = useState(user.favorites || []);
  const [saved, setSaved] = useState(false);
  const save = () => { onUpdateUser({ ...user, allergens, favorites }); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ background: "#fdf6ee", minHeight: "100%" }}>
      <div style={{ background: `linear-gradient(135deg, ${S.ink} 0%, ${S.primary}99 100%)`, padding: "24px 20px 16px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: S.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{user.firstName?.charAt(0)}</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{user.firstName} {user.lastName}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{user.phone}</div>
          </div>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Déconnexion</button>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[{ v: user.orderHistory?.length || 0, l: "Commandes" }, { v: favorites.length, l: "Favoris" }, { v: allergens.length, l: "Allergènes" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #ede8e0" }}>
        {[["info","ℹ️ Infos"],["allergens","⚠️ Allergies"],["favorites","❤️ Favoris"],["orders","📦 Commandes"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 4px", border: "none", background: "none", cursor: "pointer", fontSize: 11, fontWeight: tab === id ? 700 : 400, color: tab === id ? S.primary : "#8a8a9a", borderBottom: `2px solid ${tab === id ? S.primary : "transparent"}` }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>
        {tab === "info" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px", border: "1px solid #ede8e0" }}>
            {[["Prénom", user.firstName], ["Nom", user.lastName], ["Téléphone", user.phone]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #ede8e0" }}>
                <span style={{ color: "#8a8a9a", fontSize: 14 }}>{label}</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "allergens" && (
          <>
            <div style={{ fontSize: 13, color: "#8a8a9a", marginBottom: 16 }}>Activez vos allergènes pour être alerté sur les plats concernés.</div>
            {ALLERGENS_LIST.map(a => (
              <div key={a.id} onClick={() => setAllergens(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 12, padding: "12px 16px", marginBottom: 8, cursor: "pointer", border: `2px solid ${allergens.includes(a.id) ? "#ffc107" : "#ede8e0"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <span style={{ fontWeight: allergens.includes(a.id) ? 700 : 400, fontSize: 14 }}>{a.label}</span>
                </div>
                <Toggle value={allergens.includes(a.id)} onChange={() => setAllergens(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])} />
              </div>
            ))}
            <button onClick={save} style={{ width: "100%", marginTop: 16, padding: "14px 0", background: saved ? "#3a8a5c" : S.primary, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{saved ? "✓ Sauvegardé !" : "Sauvegarder"}</button>
          </>
        )}

        {tab === "favorites" && (
          <>
            {menu.map(item => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", marginBottom: 10, border: "1px solid #ede8e0", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 26 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#8a8a9a" }}>{item.price.toFixed(2)} €</div>
                </div>
                <button onClick={() => setFavorites(p => p.includes(item.id) ? p.filter(x => x !== item.id) : [...p, item.id])} style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${favorites.includes(item.id) ? S.primary : "#ede8e0"}`, background: favorites.includes(item.id) ? S.primaryLight : "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {favorites.includes(item.id) ? "❤️" : "🤍"}
                </button>
              </div>
            ))}
            <button onClick={save} style={{ width: "100%", marginTop: 12, padding: "14px 0", background: saved ? "#3a8a5c" : S.primary, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{saved ? "✓ Sauvegardé !" : "Sauvegarder"}</button>
          </>
        )}

        {tab === "orders" && (
          (user.orderHistory || []).length === 0
            ? <div style={{ textAlign: "center", padding: "40px 0", color: "#8a8a9a" }}>Aucune commande</div>
            : (user.orderHistory || []).map((o, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid #ede8e0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: S.primary }}>{o.id}</span>
                  <span style={{ fontSize: 12, color: "#8a8a9a" }}>{o.date}</span>
                </div>
                <div style={{ fontSize: 13, color: "#8a8a9a", marginBottom: 6 }}>{o.items.join(", ")}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Badge color="#e8f5ee" textColor="#3a8a5c">✓ Livré</Badge>
                  <span style={{ fontWeight: 800 }}>{o.total.toFixed(2)} €</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

function ReviewPage({ reviews, pendingReviews, isAdmin, S, onApprove, onReject }) {
  const [newReview, setNewReview] = useState({ name: "", stars: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const submit = () => { if (newReview.name && newReview.text) setSubmitted(true); };

  return (
    <div style={{ padding: "20px", background: "#fdf6ee", minHeight: "100%" }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>⭐ Avis clients</div>
      {isAdmin && pendingReviews.length > 0 && (
        <div style={{ background: "#fdf3e3", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid #c9963a" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c9963a", marginBottom: 10 }}>🔔 {pendingReviews.length} avis en attente</div>
          {pendingReviews.map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name} — {"⭐".repeat(r.stars)}</div>
              <div style={{ fontSize: 13, color: "#8a8a9a", marginBottom: 8 }}>{r.text}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onApprove(r)} style={{ flex: 1, padding: "8px 0", background: "#3a8a5c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>✓ Approuver</button>
                <button onClick={() => onReject(r.id)} style={{ flex: 1, padding: "8px 0", background: "#e53935", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>✕ Refuser</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {reviews.map((r, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid #ede8e0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{r.name}</span><span style={{ fontSize: 12, color: "#8a8a9a" }}>{r.date}</span></div>
          <div style={{ color: "#c9963a", marginBottom: 6 }}>{"⭐".repeat(r.stars)}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{r.text}</div>
        </div>
      ))}
      {!submitted ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", marginTop: 8, border: "1px solid #ede8e0" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Laisser un avis</div>
          <Input label="Votre prénom" value={newReview.name} onChange={v => setNewReview(p => ({ ...p, name: v }))} placeholder="Marie" />
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", marginBottom: 6, textTransform: "uppercase" }}>Note</div>
            <div style={{ display: "flex", gap: 6 }}>{[1,2,3,4,5].map(n => <button key={n} onClick={() => setNewReview(p => ({ ...p, stars: n }))} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", opacity: n <= newReview.stars ? 1 : 0.3 }}>⭐</button>)}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#8a8a9a", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Commentaire</label>
            <textarea value={newReview.text} onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))} placeholder="Votre avis..." rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ede8e0", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={submit} style={{ width: "100%", padding: "12px 0", background: S.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Envoyer</button>
        </div>
      ) : (
        <div style={{ background: "#e8f5ee", borderRadius: 14, padding: "16px", textAlign: "center", border: "1px solid #3a8a5c" }}>
          <div style={{ fontSize: 24 }}>🙏</div>
          <div style={{ fontWeight: 700, color: "#3a8a5c", marginTop: 6 }}>Merci ! Votre avis sera publié après validation.</div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

function AdminDashboard({ branding, setBranding, event, setEvent, menu, setMenu, users, orders, reviews, pendingReviews, onApprove, onReject, onClose }) {
  const [section, setSection] = useState("overview");
  const [editItem, setEditItem] = useState(null);
  const [localBranding, setLocalBranding] = useState({ ...branding });
  const [localEvent, setLocalEvent] = useState({ ...event });
  const [brandingSaved, setBrandingSaved] = useState(false);
  const [eventSaved, setEventSaved] = useState(false);

  const saveBranding = () => { setBranding(localBranding); setBrandingSaved(true); setTimeout(() => setBrandingSaved(false), 2000); };
  const saveEvent = () => { setEvent(localEvent); setEventSaved(true); setTimeout(() => setEventSaved(false), 2000); };
  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);
  const topDish = [...menu].sort((a, b) => b.orderCount - a.orderCount)[0];

  // Today stats
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.date === today);
  const itemCountsToday = {};
  todayOrders.forEach(o => { (o.itemsWithQty || o.items || []).forEach(item => { const name = typeof item === "string" ? item : item.name; const qty = typeof item === "string" ? 1 : (item.qty || 1); itemCountsToday[name] = (itemCountsToday[name] || 0) + qty; }); });
  const todayRevenue = todayOrders.reduce((a, o) => a + o.total, 0);

  const sections = [
    { id: "overview", icon: "📊", label: "Stats" },
    { id: "today", icon: "📋", label: "Aujourd'hui" },
    { id: "branding", icon: "🎨", label: "Apparence" },
    { id: "event", icon: "🎌", label: "Événement" },
    { id: "menu", icon: "🍜", label: "Menu" },
    { id: "orders", icon: "📦", label: "Commandes" },
    { id: "clients", icon: "👥", label: "Clients" },
    { id: "reviews", icon: "⭐", label: "Avis" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0f0f1a", zIndex: 2000, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ background: "#08080f", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>🛠️ Tableau de bord</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{branding.name}</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13 }}>✕ Fermer</button>
      </div>

      <div style={{ background: "#08080f", padding: "0 12px", display: "flex", gap: 2, overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{ padding: "10px 10px", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: section === s.id ? 700 : 400, whiteSpace: "nowrap", color: section === s.id ? branding.primaryColor : "rgba(255,255,255,0.4)", borderBottom: `2px solid ${section === s.id ? branding.primaryColor : "transparent"}` }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

        {/* STATS */}
        {section === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[["💰", `${totalRevenue.toFixed(0)} €`, "Chiffre d'affaires", "#3a8a5c"], ["📦", orders.length, "Commandes", "#1565c0"], ["👥", users.length, "Clients", branding.primaryColor], ["⭐", pendingReviews.length, "Avis en attente", "#c9963a"]].map(([icon, value, label, color], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>🔥 Classement des plats</div>
              {[...menu].sort((a, b) => b.orderCount - a.orderCount).map((item, i) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: i === 0 ? "#c9963a" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "rgba(255,255,255,0.3)", flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 14 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{item.name}</div>
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", marginTop: 4 }}>
                      <div style={{ height: "100%", borderRadius: 2, background: branding.primaryColor, width: `${(item.orderCount / topDish.orderCount) * 100}%` }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.orderCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TODAY */}
        {section === "today" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>📋 Récapitulatif du jour</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>{today}</div>

            {/* KPIs today */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "📦", val: todayOrders.length, label: "Commandes" },
                { icon: "💰", val: `${todayRevenue.toFixed(0)} €`, label: "CA du jour" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: branding.primaryColor }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Items commandés aujourd'hui */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>🍱 Produits commandés aujourd'hui</div>
              {Object.keys(itemCountsToday).length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Aucune commande aujourd'hui</div>
              ) : (
                Object.entries(itemCountsToday).sort((a, b) => b[1] - a[1]).map(([name, qty]) => {
                  const menuItem = menu.find(m => m.name === name);
                  const maxQty = Math.max(...Object.values(itemCountsToday));
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{menuItem?.emoji || "🍽️"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{name}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: branding.primaryColor }}>{qty}×</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
                          <div style={{ height: "100%", borderRadius: 3, background: branding.primaryColor, width: `${(qty / maxQty) * 100}%`, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Commandes du jour détaillées */}
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Détail des commandes</div>
            {todayOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Aucune commande pour aujourd'hui</div>
            ) : (
              todayOrders.map(o => (
                <div key={o.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: branding.primaryColor, fontSize: 13 }}>{o.id}</span>
                    <span style={{ fontWeight: 800, color: "#fff" }}>{o.total.toFixed(2)} €</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{o.userName} · {o.phone}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{o.items?.join(", ")}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>📍 {o.pickup}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EVENT */}
        {section === "event" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>🎌 Gérer l'événement Yasuke</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Le bandeau s'affiche automatiquement sur l'app client</div>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Afficher le bandeau</div>
                <Toggle value={localEvent.active} onChange={v => setLocalEvent(p => ({ ...p, active: v }))} />
              </div>
              {[
                ["Titre de l'événement", "title"],
                ["Sous-titre", "subtitle"],
                ["Date", "date"],
                ["Horaires", "time"],
                ["Lieu", "location"],
                ["Description", "description"],
              ].map(([label, field]) => (
                <div key={field} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>{label}</label>
                  {field === "description" ? (
                    <textarea value={localEvent[field]} onChange={e => setLocalEvent(p => ({ ...p, [field]: e.target.value }))} rows={3}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "none" }} />
                  ) : (
                    <input value={localEvent[field]} onChange={e => setLocalEvent(p => ({ ...p, [field]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Prix (€)</label>
                  <input type="number" value={localEvent.price} onChange={e => setLocalEvent(p => ({ ...p, price: parseFloat(e.target.value) }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Places totales</label>
                  <input type="number" value={localEvent.spots} onChange={e => setLocalEvent(p => ({ ...p, spots: parseInt(e.target.value) }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Restantes</label>
                  <input type="number" value={localEvent.spotsLeft} onChange={e => setLocalEvent(p => ({ ...p, spotsLeft: parseInt(e.target.value) }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>

            <button onClick={saveEvent} style={{ width: "100%", padding: "14px 0", background: eventSaved ? "#3a8a5c" : "linear-gradient(135deg, #6d28d9, #a855f7)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              {eventSaved ? "✓ Événement mis à jour !" : "Sauvegarder l'événement"}
            </button>
          </div>
        )}

        {/* BRANDING */}
        {section === "branding" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Personnaliser l'apparence</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Nom, logo, photo de couverture et couleurs</div>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>📝 Informations</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Nom du restaurant</label>
                <input value={localBranding.name} onChange={e => setLocalBranding(p => ({ ...p, name: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Slogan</label>
                <input value={localBranding.tagline} onChange={e => setLocalBranding(p => ({ ...p, tagline: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Emoji (si pas de logo)</label>
                <input value={localBranding.emoji} onChange={e => setLocalBranding(p => ({ ...p, emoji: e.target.value }))}
                  style={{ width: 60, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 22, outline: "none", textAlign: "center" }} />
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>📸 Photos</div>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase" }}>Logo</div>
                  <PhotoUpload value={localBranding.logo} onChange={v => setLocalBranding(p => ({ ...p, logo: v }))} shape="circle" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase" }}>Photo de couverture</div>
                  <PhotoUpload value={localBranding.coverPhoto} onChange={v => setLocalBranding(p => ({ ...p, coverPhoto: v }))} shape="rect" />
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", marginBottom: 20, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>🎨 Palette de couleurs</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {PALETTE_PRESETS.map(p => (
                  <div key={p.name} onClick={() => setLocalBranding(prev => ({ ...prev, primaryColor: p.primary, secondaryColor: p.secondary, accentColor: p.accent }))} style={{ cursor: "pointer", textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: p.primary, border: localBranding.primaryColor === p.primary ? "3px solid #fff" : "3px solid transparent", boxSizing: "border-box" }} />
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{p.name}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[["Principale", "primaryColor"], ["Fond foncé", "secondaryColor"], ["Accent", "accentColor"]].map(([label, key]) => (
                  <div key={key} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</div>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: "100%", height: 36, borderRadius: 8, background: localBranding[key], cursor: "pointer" }} onClick={() => document.getElementById(`color-${key}`).click()} />
                      <input id={`color-${key}`} type="color" value={localBranding[key]} onChange={e => setLocalBranding(p => ({ ...p, [key]: e.target.value }))} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{localBranding[key]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px", marginBottom: 20, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>👁️ Aperçu</div>
              <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", background: `linear-gradient(135deg, ${localBranding.secondaryColor} 0%, ${localBranding.primaryColor}99 100%)`, padding: "16px" }}>
                {localBranding.coverPhoto && <img src={localBranding.coverPhoto} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />}
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                  {localBranding.logo ? <img src={localBranding.logo} alt="logo" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} /> : <div style={{ fontSize: 32 }}>{localBranding.emoji}</div>}
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{localBranding.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{localBranding.tagline}</div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={saveBranding} style={{ width: "100%", padding: "14px 0", background: brandingSaved ? "#3a8a5c" : localBranding.primaryColor, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              {brandingSaved ? "✓ Sauvegardé !" : "Appliquer les changements"}
            </button>
          </div>
        )}

        {/* MENU */}
        {section === "menu" && (() => {
          const EMPTY_DISH = { name: "", emoji: "🍽️", category: "Plats", price: "", desc: "", allergens: [], available: true, supplements: [] };
          const EMPTY_SUP  = { name: "", price: "" };
          const [showAdd, setShowAdd]       = useState(false);
          const [newDish, setNewDish]       = useState(EMPTY_DISH);
          const [newSups, setNewSups]       = useState([]);
          const [newSupInput, setNewSupInput] = useState(EMPTY_SUP);
          const [deleteConfirm, setDeleteConfirm] = useState(null);
          const [addSaved, setAddSaved]     = useState(false);

          const adminFieldStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" };
          const adminLabel = (txt) => <label style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{txt}</label>;

          const addDish = () => {
            if (!newDish.name || !newDish.price) return;
            const dish = { ...newDish, id: Date.now(), price: parseFloat(newDish.price), orderCount: 0, supplements: newSups.map((s, i) => ({ ...s, id: `ns${Date.now()}${i}`, price: parseFloat(s.price) })) };
            setMenu(m => [...m, dish]);
            setNewDish(EMPTY_DISH); setNewSups([]); setNewSupInput(EMPTY_SUP);
            setShowAdd(false); setAddSaved(true); setTimeout(() => setAddSaved(false), 2500);
          };

          const deleteDish = (id) => { setMenu(m => m.filter(x => x.id !== id)); setDeleteConfirm(null); };

          const addSup = () => {
            if (!newSupInput.name || !newSupInput.price) return;
            setNewSups(p => [...p, { ...newSupInput }]);
            setNewSupInput(EMPTY_SUP);
          };

          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Gestion du menu</div>
                <button onClick={() => setShowAdd(p => !p)} style={{ background: showAdd ? "rgba(255,255,255,0.1)" : branding.primaryColor, border: "none", color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {showAdd ? "✕ Annuler" : "+ Nouveau plat"}
                </button>
              </div>

              {addSaved && (
                <div style={{ background: "rgba(58,138,92,0.2)", border: "1px solid rgba(58,138,92,0.4)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, color: "#6fcf97", fontSize: 13, fontWeight: 700 }}>
                  ✓ Plat ajouté au menu !
                </div>
              )}

              {/* ── FORMULAIRE NOUVEAU PLAT ── */}
              {showAdd && (
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "18px 16px", marginBottom: 18, border: `1px solid ${branding.primaryColor}55` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: branding.primaryColor, marginBottom: 14 }}>✨ Ajouter un nouveau plat</div>

                  {/* Emoji picker */}
                  <div style={{ marginBottom: 12 }}>
                    {adminLabel("Emoji du plat")}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["🍜","🍱","🥟","🍛","🍣","🍤","🥗","🍙","🍘","🥮","🍡","🍰","🧁","🍮","🐟","🫙","🥩","🍖"].map(e => (
                        <div key={e} onClick={() => setNewDish(p => ({ ...p, emoji: e }))} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", background: newDish.emoji === e ? branding.primaryColor : "rgba(255,255,255,0.08)", border: `2px solid ${newDish.emoji === e ? branding.primaryColor : "transparent"}` }}>{e}</div>
                      ))}
                    </div>
                  </div>

                  {/* Nom */}
                  <div style={{ marginBottom: 10 }}>
                    {adminLabel("Nom du plat *")}
                    <input value={newDish.name} onChange={e => setNewDish(p => ({ ...p, name: e.target.value }))} placeholder="Ex : Ramen Miso" style={adminFieldStyle} />
                  </div>

                  {/* Catégorie */}
                  <div style={{ marginBottom: 10 }}>
                    {adminLabel("Catégorie *")}
                    <div style={{ display: "flex", gap: 8 }}>
                      {["Plats", "Desserts", "Boissons", "Entrées"].map(cat => (
                        <div key={cat} onClick={() => setNewDish(p => ({ ...p, category: cat }))} style={{ padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, background: newDish.category === cat ? branding.primaryColor : "rgba(255,255,255,0.08)", color: "#fff", border: `1px solid ${newDish.category === cat ? branding.primaryColor : "rgba(255,255,255,0.12)"}` }}>{cat}</div>
                      ))}
                    </div>
                  </div>

                  {/* Prix & Description */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      {adminLabel("Prix (€) *")}
                      <input type="number" step="0.5" value={newDish.price} onChange={e => setNewDish(p => ({ ...p, price: e.target.value }))} placeholder="12.50" style={adminFieldStyle} />
                    </div>
                    <div style={{ flex: 2 }}>
                      {adminLabel("Description")}
                      <input value={newDish.desc} onChange={e => setNewDish(p => ({ ...p, desc: e.target.value }))} placeholder="Courte description..." style={adminFieldStyle} />
                    </div>
                  </div>

                  {/* Allergènes */}
                  <div style={{ marginBottom: 14 }}>
                    {adminLabel("Allergènes")}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {ALLERGENS_LIST.map(a => {
                        const on = newDish.allergens.includes(a.id);
                        return <div key={a.id} onClick={() => setNewDish(p => ({ ...p, allergens: on ? p.allergens.filter(x => x !== a.id) : [...p.allergens, a.id] }))} style={{ padding: "4px 10px", borderRadius: 20, cursor: "pointer", fontSize: 12, background: on ? "#c9963a" : "rgba(255,255,255,0.08)", color: on ? "#fff" : "rgba(255,255,255,0.4)", border: `1px solid ${on ? "#c9963a" : "rgba(255,255,255,0.12)"}` }}>{a.icon} {a.label}</div>;
                      })}
                    </div>
                  </div>

                  {/* Suppléments */}
                  <div style={{ marginBottom: 14 }}>
                    {adminLabel("Suppléments (optionnel)")}
                    {newSups.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#fff" }}>{s.name}</div>
                        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#c9963a", fontWeight: 700 }}>+{parseFloat(s.price).toFixed(2)} €</div>
                        <button onClick={() => setNewSups(p => p.filter((_, j) => j !== i))} style={{ background: "rgba(229,57,53,0.2)", border: "none", color: "#e53935", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input value={newSupInput.name} onChange={e => setNewSupInput(p => ({ ...p, name: e.target.value }))} placeholder="Nom" style={{ ...adminFieldStyle, flex: 2 }} />
                      <input type="number" step="0.5" value={newSupInput.price} onChange={e => setNewSupInput(p => ({ ...p, price: e.target.value }))} placeholder="€" style={{ ...adminFieldStyle, flex: 1 }} />
                      <button onClick={addSup} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>+</button>
                    </div>
                  </div>

                  {/* Disponibilité */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Disponible dès maintenant</span>
                    <Toggle value={newDish.available} onChange={v => setNewDish(p => ({ ...p, available: v }))} />
                  </div>

                  <button onClick={addDish} style={{ width: "100%", padding: "14px 0", background: (!newDish.name || !newDish.price) ? "rgba(255,255,255,0.1)" : branding.primaryColor, color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: (!newDish.name || !newDish.price) ? "default" : "pointer" }}>
                    ✓ Ajouter ce plat au menu
                  </button>
                </div>
              )}

              {/* ── LISTE EXISTANTE ── */}
              {["Plats","Desserts","Boissons","Entrées"].filter(cat => menu.some(i => i.category === cat)).map(cat => (
                <div key={cat}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, marginTop: 10 }}>{cat}</div>
                  {menu.filter(i => i.category === cat).map(item => (
                    <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "13px 14px", marginBottom: 8, border: `1px solid ${item.available ? "rgba(58,138,92,0.3)" : "rgba(229,57,53,0.2)"}` }}>
                      {editItem === item.id ? (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                            <span style={{ color: "#fff", fontWeight: 700 }}>{item.emoji} {item.name}</span>
                            <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
                          </div>
                          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                            <div style={{ flex: 1 }}>
                              {adminLabel("Prix (€)")}
                              <input type="number" step="0.5" value={item.price} onChange={e => setMenu(m => m.map(x => x.id === item.id ? { ...x, price: parseFloat(e.target.value) } : x))} style={adminFieldStyle} />
                            </div>
                            <div style={{ flex: 2 }}>
                              {adminLabel("Emoji")}
                              <input value={item.emoji} onChange={e => setMenu(m => m.map(x => x.id === item.id ? { ...x, emoji: e.target.value } : x))} style={{ ...adminFieldStyle, fontSize: 20 }} />
                            </div>
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            {adminLabel("Description")}
                            <input value={item.desc} onChange={e => setMenu(m => m.map(x => x.id === item.id ? { ...x, desc: e.target.value } : x))} style={adminFieldStyle} />
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            {adminLabel("Catégorie")}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {["Plats","Desserts","Boissons","Entrées"].map(cat => (
                                <div key={cat} onClick={() => setMenu(m => m.map(x => x.id === item.id ? { ...x, category: cat } : x))} style={{ padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, background: item.category === cat ? branding.primaryColor : "rgba(255,255,255,0.08)", color: "#fff" }}>{cat}</div>
                              ))}
                            </div>
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            {adminLabel("Allergènes")}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {ALLERGENS_LIST.map(a => {
                                const on = item.allergens?.includes(a.id);
                                return <div key={a.id} onClick={() => setMenu(m => m.map(x => x.id === item.id ? { ...x, allergens: on ? x.allergens.filter(al => al !== a.id) : [...(x.allergens||[]), a.id] } : x))} style={{ padding: "3px 9px", borderRadius: 20, cursor: "pointer", fontSize: 11, background: on ? "#c9963a" : "rgba(255,255,255,0.07)", color: on ? "#fff" : "rgba(255,255,255,0.35)", border: `1px solid ${on ? "#c9963a" : "rgba(255,255,255,0.1)"}` }}>{a.icon} {a.label}</div>;
                              })}
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Disponible</span>
                            <Toggle value={item.available} onChange={v => setMenu(m => m.map(x => x.id === item.id ? { ...x, available: v } : x))} />
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 18 }}>{item.emoji}</span>
                              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                              <Badge color={item.available ? "#3a8a5c" : "#e53935"}>{item.available ? "Dispo" : "Indispo"}</Badge>
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{item.price.toFixed(2)} € · {item.supplements?.length || 0} supplément(s) · {item.orderCount} cmd</div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <button onClick={() => setEditItem(item.id)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 13 }}>✏️</button>
                            {deleteConfirm === item.id ? (
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => deleteDish(item.id)} style={{ background: "#e53935", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
                                <button onClick={() => setDeleteConfirm(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>Non</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(item.id)} style={{ background: "rgba(229,57,53,0.15)", border: "none", color: "#e53935", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                            )}
                            <Toggle value={item.available} onChange={v => setMenu(m => m.map(x => x.id === item.id ? { ...x, available: v } : x))} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

        {/* ORDERS */}
        {section === "orders" && (
          <div>
            {orders.map(o => (
              <div key={o.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: branding.primaryColor }}>{o.id}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{o.date}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{o.userName} · {o.phone}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>{o.items.join(", ")}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Badge color="#e8f5ee" textColor="#3a8a5c">✓ {o.status}</Badge>
                  <span style={{ fontWeight: 800, color: "#fff" }}>{o.total.toFixed(2)} €</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLIENTS */}
        {section === "clients" && (
          <div>
            {users.map(u => (
              <div key={u.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: branding.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff" }}>{u.firstName?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff" }}>{u.firstName} {u.lastName}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>📱 {u.phone}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: u.allergens?.length > 0 ? 10 : 0 }}>
                  {[{ v: u.orderHistory?.length || 0, l: "Commandes" }, { v: (u.orderHistory || []).reduce((a, o) => a + o.total, 0).toFixed(0) + " €", l: "Dépensé" }, { v: u.favorites?.length || 0, l: "Favoris" }].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 10px", textAlign: "center", flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {u.allergens?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {u.allergens.map(a => { const info = ALLERGENS_LIST.find(x => x.id === a); return <span key={a} style={{ background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: 20, padding: "2px 8px", fontSize: 11, color: "#ffc107" }}>{info?.icon} {info?.label}</span>; })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS */}
        {section === "reviews" && (
          <div>
            {pendingReviews.length > 0 && (
              <>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 8 }}>En attente</div>
                {pendingReviews.map(r => (
                  <div key={r.id} style={{ background: "rgba(255,193,7,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid rgba(255,193,7,0.2)" }}>
                    <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>{r.name} — {"⭐".repeat(r.stars)}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>{r.text}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => onApprove(r)} style={{ flex: 1, padding: "8px 0", background: "#3a8a5c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>✓ Approuver</button>
                      <button onClick={() => onReject(r.id)} style={{ flex: 1, padding: "8px 0", background: "#e53935", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>✕ Refuser</button>
                    </div>
                  </div>
                ))}
              </>
            )}
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 8 }}>Approuvés</div>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", marginBottom: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#fff" }}>{r.name}</span><span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{r.date}</span></div>
                <div style={{ color: "#c9963a", margin: "4px 0" }}>{"⭐".repeat(r.stars)}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{r.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INSTAGRAM GUIDE ─────────────────────────────────────────────────────────

function InstagramGuide({ branding, S, onClose }) {
  const steps = [
    { icon: "1️⃣", title: "Publiez votre app sur le web", desc: "Copiez ce prototype sur Vercel (gratuit) ou utilisez un service comme Glide. Vous obtiendrez un lien du type : sakurakitchen.vercel.app" },
    { icon: "2️⃣", title: "Ajoutez le lien dans votre bio", desc: `Sur Instagram → Modifier le profil → Site web → Coller votre lien. Exemple : "Commandez ici 👇 sakurakitchen.app"` },
    { icon: "3️⃣", title: "Créez un Story avec lien", desc: "Dans une Story → icône lien (🔗) → coller votre URL → ajouter le sticker \"Voir plus\" avec le texte \"Commander 🍜\"" },
    { icon: "4️⃣", title: "Post de lancement", desc: `Faites un post avec vos plats en photo. Caption : "🌸 Notre app de commande est en ligne ! Commandez directement depuis notre bio. Retirait disponible en 3 points de Paris. Lien en bio ↑"` },
    { icon: "5️⃣", title: "Épinglez en Story à la une", desc: "Créez un highlight Stories \"Commander 🛒\" avec vos stories de lancement. Ça reste visible en permanence sur votre profil." },
    { icon: "💡", title: "Astuce bonus", desc: "Utilisez un outil comme Linktree (gratuit) pour mettre plusieurs liens dans votre bio : app de commande + Google Maps + WhatsApp." },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,46,0.7)", zIndex: 3000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fdf6ee", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: `linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)`, padding: "20px 20px 16px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>📸 Partager sur Instagram</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Guide étape par étape</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "16px 20px 32px" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 24, flexShrink: 0, width: 32, textAlign: "center" }}>{step.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: "#8a8a9a", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #ede8e0", marginTop: 8 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>📋 Exemple de caption prête à copier</div>
            <div style={{ background: "#fdf6ee", borderRadius: 10, padding: "12px", fontSize: 13, lineHeight: 1.7, color: "#1a1a2e", fontStyle: "italic" }}>
              🌸 {branding.name} — {branding.tagline}<br />
              🍜 Commandez directement depuis notre app !<br />
              📍 Retrait disponible en 3 points<br />
              ⏱️ Prêt en 20-30 min<br />
              👇 Lien en bio pour commander
            </div>
            <div style={{ fontSize: 12, color: "#8a8a9a", marginTop: 8 }}>Appuyez longtemps pour copier ce texte</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [event, setEvent] = useState(DEFAULT_EVENT);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [pendingReviews, setPendingReviews] = useState(PENDING_REVIEWS_INIT);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState("menu");
  const [screen, setScreen] = useState("main");
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [orderNum] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const S = makeS(branding);
  const isAdmin = currentUser?.phone === "0612345678";

  const handleLogin = (phone) => {
    const clean = phone.replace(/\s/g, "");
    const user = users.find(u => u.phone.replace(/\s/g, "") === clean);
    if (user) { setCurrentUser(user); return true; }
    return false;
  };

  const handleRegister = (data) => {
    const newUser = { id: `u${Date.now()}`, firstName: data.firstName, lastName: data.lastName, name: `${data.firstName} ${data.lastName}`, phone: data.phone, allergens: data.allergens, orderHistory: [], favorites: [] };
    setUsers(p => [...p, newUser]);
    setCurrentUser(newUser);
  };

  const handleLogout = () => { setCurrentUser(null); setCart([]); setTab("menu"); };

  const updateUser = (updated) => { setCurrentUser(updated); setUsers(p => p.map(u => u.id === updated.id ? updated : u)); };

  const addToCart = (item, extras) => {
    const lineTotal = item.price + extras.reduce((a, e) => a + e.price, 0);
    setCart(c => [...c, { ...item, extras, qty: 1, lineTotal }]);
  };

  const updateQty = (idx, delta) => {
    setCart(c => {
      const next = [...c];
      next[idx].qty += delta;
      next[idx].lineTotal = (next[idx].price + next[idx].extras.reduce((a, e) => a + e.price, 0)) * next[idx].qty;
      if (next[idx].qty <= 0) next.splice(idx, 1);
      return [...next];
    });
  };

  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleConfirm = (method) => {
    setPaymentMethod(method);
    const newOrder = { id: `ORD-${orderNum}`, userId: currentUser?.id, userName: `${currentUser?.firstName} ${currentUser?.lastName}`, phone: currentUser?.phone, date: new Date().toISOString().slice(0, 10), total: cart.reduce((a, i) => a + i.lineTotal, 0), status: method === "onsite" ? "En attente — paiement sur place" : "En préparation", items: cart.map(i => i.name), pickup: PICKUP_POINTS.find(p => p.id === selectedPickup)?.name, paymentMethod: method };
    setOrders(p => [newOrder, ...p]);
    if (currentUser) updateUser({ ...currentUser, orderHistory: [{ id: newOrder.id, date: newOrder.date, total: newOrder.total, items: newOrder.items }, ...(currentUser.orderHistory || [])] });
    setCart([]);
    setScreen("confirm");
  };

  const approveReview = (r) => { setReviews(p => [...p, { ...r, approved: true }]); setPendingReviews(p => p.filter(x => x.id !== r.id)); };
  const rejectReview = (id) => setPendingReviews(p => p.filter(x => x.id !== id));

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + i.lineTotal, 0);

  if (!currentUser) return <AuthPage branding={branding} onLogin={handleLogin} onRegister={handleRegister} />;
  if (showAdmin) return <AdminDashboard branding={branding} setBranding={setBranding} event={event} setEvent={setEvent} menu={menu} setMenu={setMenu} users={users} orders={orders} reviews={reviews} pendingReviews={pendingReviews} onApprove={approveReview} onReject={rejectReview} onClose={() => setShowAdmin(false)} />;

  if (screen === "payment") return (
    <div style={{ maxWidth: 430, margin: "0 auto", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" }}>
      <div style={{ background: S.ink, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("main")} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <span style={{ color: "#fff", fontWeight: 700 }}>Paiement</span>
      </div>
      <PaymentPage total={cartTotal} pickupId={selectedPickup} S={S} onConfirm={handleConfirm} />
    </div>
  );

  if (screen === "confirm") return (
    <div style={{ maxWidth: 430, margin: "0 auto", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" }}>
      <ConfirmPage orderNum={orderNum} pickupId={selectedPickup} paymentMethod={paymentMethod} S={S} onNewOrder={() => { setScreen("main"); setTab("menu"); }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#fdf6ee", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {isAdmin && (
        <div style={{ background: S.ink, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>🛠️ Admin</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowInstagram(true)} style={{ background: "linear-gradient(90deg,#833ab4,#fd1d1d)", border: "none", color: "#fff", padding: "5px 12px", borderRadius: 16, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>📸 Instagram</button>
            <button onClick={() => setShowAdmin(true)} style={{ background: S.primary, border: "none", color: "#fff", padding: "5px 12px", borderRadius: 16, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Dashboard →</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {tab === "menu" && (
          <>
            <EventBanner event={event} S={S} onClick={() => setShowEvent(true)} />
            <MenuPage menu={menu} user={currentUser} branding={branding} S={S} onAddToCart={addToCart} />
          </>
        )}
        {tab === "cart" && <CartPage cart={cart} S={S} onUpdateQty={updateQty} onCheckout={(p) => { setSelectedPickup(p); setScreen("payment"); }} />}
        {tab === "reviews" && <ReviewPage reviews={reviews} pendingReviews={pendingReviews} isAdmin={isAdmin} S={S} onApprove={approveReview} onReject={rejectReview} />}
        {tab === "profile" && <ProfilePage user={currentUser} menu={menu} S={S} onUpdateUser={updateUser} onLogout={handleLogout} />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #ede8e0", display: "flex", boxShadow: "0 -4px 20px rgba(26,26,46,0.08)" }}>
        {[{ id: "menu", icon: "🍜", label: "Menu" }, { id: "cart", icon: "🛒", label: "Panier", badge: cartCount }, { id: "reviews", icon: "⭐", label: "Avis" }, { id: "profile", icon: "👤", label: "Profil" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 0 12px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              {t.badge > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: S.primary, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 800, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>{t.badge}</span>}
            </div>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? S.primary : "#8a8a9a" }}>{t.label}</span>
            {tab === t.id && <div style={{ position: "absolute", bottom: 0, width: 24, height: 3, background: S.primary, borderRadius: 3 }} />}
          </button>
        ))}
      </div>

      {showInstagram && <InstagramGuide branding={branding} S={S} onClose={() => setShowInstagram(false)} />}
      {showEvent && <EventPage event={event} S={S} user={currentUser} onClose={() => setShowEvent(false)} onReserve={({ guests, method, total }) => { setEvent(e => ({ ...e, spotsLeft: Math.max(0, e.spotsLeft - guests) })); }} />}
    </div>
  );
}
