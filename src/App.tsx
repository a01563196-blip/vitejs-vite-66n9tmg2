import { useState, useEffect } from "react";
import {
  Home, Users, MapPin, Camera, User, Plus, Heart,
  MessageCircle, Share2, ChevronLeft, Check, Search,
  Leaf, Zap, Wheat, Droplet, ChevronRight, Calendar, Star
} from "lucide-react";

// ---------- HELPERS ----------

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query + ", Chihuahua, Chihuahua, México"
  )}`;
}

function openMaps(query) {
  window.open(mapsUrl(query), "_blank", "noopener,noreferrer");
}

// ---------- MOCK DATA ----------
const FRIENDS = [
  { name: "Vale", color: "#008471", bio: "Le encanta improvisar con lo que hay en el refri.", recipes: 9 },
  { name: "Diego", color: "#898E46", bio: "Siempre trae algo nuevo del tianguis los sábados.", recipes: 6 },
  { name: "Ana", color: "#C45F3F", bio: "Organiza las cenas de mesa de los jueves.", recipes: 4 },
  { name: "Luis", color: "#80B0E8", bio: "Fan del sotol y las recetas con nuez pecana.", recipes: 3 },
  { name: "Mar", color: "#F29CC3", bio: "Está aprendiendo a cocinar con chile pasado.", recipes: 7 },
];

const FEED = [
  {
    user: "Vale Reyes",
    time: "hace 2 h",
    color: "#008471",
    dish: "Tacos de coliflor asada",
    tag: "Cena de hoy",
    likes: 24,
    comments: 6,
    img: "https://loremflickr.com/500/400/tacos,cauliflower",
    bg: "linear-gradient(135deg,#00594B,#008471)",
  },
  {
    user: "Diego Ortiz",
    time: "hace 4 h",
    color: "#898E46",
    dish: "Bowl de quinoa y nopal",
    tag: "Receta nueva",
    likes: 41,
    comments: 12,
    img: "https://loremflickr.com/500/400/quinoabowl,salad",
    bg: "linear-gradient(135deg,#AEB56B,#5F6530)",
  },
  {
    user: "Ana Cortés",
    time: "ayer",
    color: "#C45F3F",
    dish: "¿Cenamos el jueves?",
    tag: "Plan de mesa",
    likes: 8,
    comments: 15,
    img: "https://loremflickr.com/500/400/dinnertable,friends",
    bg: "linear-gradient(135deg,#F4D242,#008471)",
  },
];

// Real Chihuahua, Chih. venues — tap any of these to open Google Maps
const SPOTS = [
  {
    name: "Chihuahua Local",
    type: "Tienda de productores",
    tag: "Miel, quesos y nuez pecana de la región",
    dist: "Zona Centro",
    query: "Chihuahua Local, Calle Guadalupe Victoria 100, Zona Centro",
  },
  {
    name: "Tianguis de Productores Locales",
    type: "Tianguis municipal",
    tag: "Frutas, verduras y alimentos preparados directo del productor",
    dist: "Sede rotativa",
    query: "Tianguis de Productores Locales, Municipio de Chihuahua",
  },
  {
    name: "Plaza del Ángel",
    type: "Plaza / mercado de temporada",
    tag: "Sede de ferias agroalimentarias de fin de semana",
    dist: "Zona Centro",
    query: "Plaza del Ángel Chihuahua",
  },
  {
    name: "La Rodadora",
    type: "Espacio interactivo familiar",
    tag: "Talleres y actividades para todas las edades",
    dist: "Parque Fundadores",
    query: "La Rodadora Espacio Interactivo Chihuahua",
  },
  {
    name: "Calle Libertad, Centro Histórico",
    type: "Zona comercial",
    tag: "Antojitos y productos locales en pleno centro",
    dist: "Centro",
    query: "Calle Libertad Centro Histórico Chihuahua",
  },
];

const NUTRIENTS = [
  { label: "Proteína", value: 22, unit: "g", color: "#008471", icon: Zap },
  { label: "Carbohidratos", value: 48, unit: "g", color: "#C45F3F", icon: Wheat },
  { label: "Grasas", value: 14, unit: "g", color: "#898E46", icon: Droplet },
  { label: "Fibra", value: 9, unit: "g", color: "#79694F", icon: Leaf },
];

const MY_RECIPES = [
  { name: "Ensalada de nopal", img: "https://loremflickr.com/300/240/nopalsalad,greens", bg: "linear-gradient(135deg,#AEB56B,#5F6530)" },
  { name: "Sopa de lentejas", img: "https://loremflickr.com/300/240/lentilsoup,bowl", bg: "linear-gradient(135deg,#C45F3F,#79694F)" },
  { name: "Agua de jamaica", img: "https://loremflickr.com/300/240/hibiscustea,drink", bg: "linear-gradient(135deg,#00594B,#008471)" },
  { name: "Pico de gallo", img: "https://loremflickr.com/300/240/salsa,tomato", bg: "linear-gradient(135deg,#008471,#898E46)" },
];

// ---------- SHARED UI BITS ----------

function PlateFrame({ color, size = 40, children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FAF6ED",
        fontWeight: 700,
        fontFamily: "Manrope, sans-serif",
        flexShrink: 0,
        boxShadow: "0 2px 6px rgba(43,38,32,0.18)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

function ScreenHeader({ title, subtitle }) {
  return (
    <div style={{ padding: "22px 20px 14px" }}>
      <h1
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 600,
          fontSize: 26,
          color: "#241E1B",
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: "#79694F", fontSize: 13.5, marginTop: 4, fontFamily: "Manrope, sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------- FRIEND PROFILE MODAL ----------

function FriendModal({ friend, onClose }) {
  if (!friend) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(36,30,27,0.55)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: "#FAF6ED",
          borderRadius: "24px 24px 0 0",
          padding: "22px 22px 30px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 4, background: "#D6CDB8", margin: "0 auto 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <PlateFrame color={friend.color} size={58}>{friend.name[0]}</PlateFrame>
          <div>
            <p style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 600, color: "#241E1B" }}>
              {friend.name}
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: "#79694F" }}>
              {friend.recipes ?? 0} recetas compartidas
            </p>
          </div>
        </div>
        {friend.bio && (
          <p style={{ margin: "16px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#5A5347", lineHeight: 1.5 }}>
            {friend.bio}
          </p>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 14,
              border: "1px solid #EDE6D6",
              background: "#FFFFFF",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "#241E1B",
              cursor: "pointer",
            }}
          >
            Ver recetas
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 14,
              border: "none",
              background: "#008471",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "#FAF6ED",
              cursor: "pointer",
            }}
          >
            Planear cena
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- TOAST ----------

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 94,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#241E1B",
        color: "#FAF6ED",
        padding: "9px 16px",
        borderRadius: 20,
        fontFamily: "Manrope, sans-serif",
        fontSize: 12.5,
        fontWeight: 600,
        zIndex: 60,
        whiteSpace: "nowrap",
        boxShadow: "0 6px 16px rgba(43,38,32,0.3)",
      }}
    >
      {message}
    </div>
  );
}

// ---------- HOME ----------

function HomeScreen({ onFriendClick, onInvite }) {
  const featuredSpot = SPOTS[3]; // La Rodadora
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Hola, Alma" subtitle="Jueves 27 de agosto" />

      {/* Weekly challenge card */}
      <div style={{ margin: "0 20px 18px" }}>
        <div
          style={{
            background: "linear-gradient(135deg,#008471,#00594B)",
            borderRadius: 22,
            padding: "20px 20px 22px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -30,
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <p style={{ color: "#E3F3EE", fontSize: 12, fontFamily: "Manrope, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
            Reto de la semana
          </p>
          <h2 style={{ color: "#FAF6ED", fontFamily: "Manrope, sans-serif", fontSize: 21, margin: "6px 0 14px", fontWeight: 600, maxWidth: 210 }}>
            5 porciones de color al día
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.25)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "#F4D242", borderRadius: 8 }} />
            </div>
            <span style={{ color: "#FAF6ED", fontSize: 12.5, fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>3/5 hoy</span>
          </div>
        </div>
      </div>

      {/* Friends strip */}
      <div style={{ margin: "0 0 20px" }}>
        <p style={{ padding: "0 20px", color: "#241E1B", fontSize: 14.5, fontFamily: "Manrope, sans-serif", fontWeight: 600, marginBottom: 10 }}>
          Tu mesa esta semana
        </p>
        <div style={{ display: "flex", gap: 14, padding: "0 20px", overflowX: "auto" }}>
          {FRIENDS.map((f) => (
            <div key={f.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <PlateFrame color={f.color} size={52} onClick={() => onFriendClick(f)}>
                {f.name[0]}
              </PlateFrame>
              <span style={{ fontSize: 11.5, color: "#5A5347", fontFamily: "Manrope, sans-serif" }}>{f.name}</span>
            </div>
          ))}
          <div
            onClick={onInvite}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px dashed #D6CDB8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={18} color="#79694F" />
            </div>
            <span style={{ fontSize: 11.5, color: "#79694F", fontFamily: "Manrope, sans-serif" }}>Invitar</span>
          </div>
        </div>
      </div>

      {/* Tip card */}
      <div style={{ margin: "0 20px 18px" }}>
        <div style={{ background: "#F1ECDD", borderRadius: 18, padding: 16, display: "flex", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#898E46", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Leaf size={18} color="#FAF6ED" />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13.5, color: "#241E1B" }}>
              Tip de nutrición
            </p>
            <p style={{ margin: "3px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: "#5A5347", lineHeight: 1.5 }}>
              Cambia una porción de arroz por nopal o ejotes esta semana — más fibra, mismo sabor.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming — links out to real venue on Google Maps */}
      <div style={{ margin: "0 20px" }}>
        <p style={{ color: "#241E1B", fontSize: 14.5, fontFamily: "Manrope, sans-serif", fontWeight: 600, marginBottom: 10 }}>
          Cerca de ti
        </p>
        <div
          onClick={() => openMaps(featuredSpot.query)}
          style={{ background: "#FFFFFF", border: "1px solid #EDE6D6", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#00847122", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Calendar size={20} color="#8C3D28" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13.5, color: "#241E1B" }}>
              Taller de temporada
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#79694F" }}>
              Sábado · {featuredSpot.name}
            </p>
          </div>
          <ChevronRight size={18} color="#D6CDB8" />
        </div>
      </div>
    </div>
  );
}

// ---------- SOCIAL ----------

function SocialScreen({ onFriendClick, onShare }) {
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Social" subtitle="Lo que tu mesa está cocinando" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {FEED.map((post, i) => (
          <div key={i} style={{ background: "#FFFFFF", border: "1px solid #EDE6D6", borderRadius: 20, overflow: "hidden" }}>
            <div
              onClick={() => onFriendClick({ name: post.user, color: post.color, bio: `Compartió "${post.dish}" ${post.time}.` })}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer" }}
            >
              <PlateFrame color={post.color} size={34}>
                {post.user[0]}
              </PlateFrame>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13, color: "#241E1B" }}>{post.user}</p>
                <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 11, color: "#79694F" }}>{post.time}</p>
              </div>
              <span style={{ fontSize: 10.5, fontFamily: "Manrope, sans-serif", fontWeight: 600, color: "#00594B", background: "#FBDDD2", padding: "4px 9px", borderRadius: 20 }}>
                {post.tag}
              </span>
            </div>
            <div style={{ height: 160, background: post.bg, position: "relative", overflow: "hidden" }}>
              <img
                src={post.img}
                alt={post.dish}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ padding: "10px 14px 14px" }}>
              <p style={{ margin: "0 0 10px", fontFamily: "Space Grotesk, sans-serif", fontSize: 16, fontWeight: 600, color: "#241E1B" }}>{post.dish}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#5A5347", fontFamily: "Manrope, sans-serif" }}>
                  <Heart size={16} color="#008471" /> {post.likes}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#5A5347", fontFamily: "Manrope, sans-serif" }}>
                  <MessageCircle size={16} color="#898E46" /> {post.comments}
                </span>
                <span onClick={onShare} style={{ marginLeft: "auto", cursor: "pointer" }}>
                  <Share2 size={16} color="#79694F" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- MAP ----------

function MapScreen() {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const filters = ["Todos", "Mercados", "Talleres"];

  const matchesFilter = (s) => {
    if (filter === "Todos") return true;
    if (filter === "Mercados") return /mercado|tianguis|tienda|plaza|comercial/i.test(s.type);
    if (filter === "Talleres") return /taller|interactivo/i.test(s.type);
    return true;
  };

  const visibleSpots = SPOTS.filter(
    (s) => matchesFilter(s) && (s.name + s.type + s.tag).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Mapa local" subtitle="Talleres y buena comida cerca de ti" />

      <div style={{ margin: "0 20px 14px", position: "relative" }}>
        <Search size={16} color="#79694F" style={{ position: "absolute", left: 14, top: 13 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar mercado, taller o ingrediente"
          style={{
            width: "100%",
            padding: "11px 14px 11px 36px",
            borderRadius: 14,
            border: "1px solid #EDE6D6",
            background: "#FFFFFF",
            fontFamily: "Manrope, sans-serif",
            fontSize: 12.5,
            color: "#5A5347",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Stylized map — pins open the real place in Google Maps */}
      <div style={{ margin: "0 20px 16px", borderRadius: 20, overflow: "hidden", height: 170, position: "relative", background: "#EFE7D2" }}>
        <svg width="100%" height="100%" viewBox="0 0 340 170" preserveAspectRatio="none">
          <rect width="340" height="170" fill="#F0EAD8" />
          <path d="M0 40 L340 55" stroke="#DCD2BC" strokeWidth="10" />
          <path d="M0 120 L340 100" stroke="#DCD2BC" strokeWidth="14" />
          <path d="M60 0 L90 170" stroke="#DCD2BC" strokeWidth="8" />
          <path d="M250 0 L220 170" stroke="#DCD2BC" strokeWidth="8" />
          <circle cx="100" cy="60" r="46" fill="#C3C88B" opacity="0.6" />
          <circle cx="250" cy="120" r="30" fill="#C3C88B" opacity="0.6" />
        </svg>
        {[
          { x: "18%", y: "34%", c: "#008471" },
          { x: "52%", y: "58%", c: "#898E46" },
          { x: "70%", y: "26%", c: "#C45F3F" },
          { x: "38%", y: "72%", c: "#008471" },
          { x: "82%", y: "62%", c: "#898E46" },
        ].map((p, i) => {
          const spot = SPOTS[i];
          if (!spot) return null;
          return (
            <div
              key={i}
              onClick={() => openMaps(spot.query)}
              title={spot.name}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: 22,
                height: 22,
                borderRadius: "50% 50% 50% 0",
                background: p.c,
                transform: "rotate(-45deg)",
                boxShadow: "0 2px 5px rgba(43,38,32,0.25)",
                border: "2px solid #FAF6ED",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 20px", marginBottom: 14 }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px",
              borderRadius: 20,
              border: "1px solid " + (filter === f ? "#008471" : "#EDE6D6"),
              background: filter === f ? "#008471" : "#FFFFFF",
              color: filter === f ? "#FAF6ED" : "#5A5347",
              fontFamily: "Manrope, sans-serif",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {visibleSpots.length === 0 && (
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: "#79694F", textAlign: "center", padding: "10px 0" }}>
            Nada por aquí — prueba otra búsqueda.
          </p>
        )}
        {visibleSpots.map((s) => (
          <div
            key={s.name}
            onClick={() => openMaps(s.query)}
            style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFFFFF", border: "1px solid #EDE6D6", borderRadius: 16, padding: 12, cursor: "pointer" }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#898E4622", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={19} color="#5F6530" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13, color: "#241E1B" }}>{s.name}</p>
              <p style={{ margin: "2px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 11.5, color: "#79694F" }}>{s.tag}</p>
            </div>
            <span style={{ fontSize: 11, fontFamily: "Manrope, sans-serif", color: "#79694F", flexShrink: 0 }}>{s.dist}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- SCAN ----------

function ScanScreen() {
  const [step, setStep] = useState("camera"); // camera -> scanning -> result -> upload -> done
  const [shareProfile, setShareProfile] = useState(true);
  const [shareFriends, setShareFriends] = useState(true);
  const [recipeName, setRecipeName] = useState("");

  useEffect(() => {
    if (step === "scanning") {
      const t = setTimeout(() => setStep("result"), 1400);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (step === "camera") {
    return (
      <div style={{ height: "100%", background: "#241E1B", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 20px 10px" }}>
          <h1 style={{ fontFamily: "Manrope, sans-serif", color: "#FAF6ED", fontSize: 22, margin: 0, fontWeight: 600 }}>Escanear plato</h1>
          <p style={{ color: "#D6CDB8", fontSize: 12.5, marginTop: 4, fontFamily: "Manrope, sans-serif" }}>
            Enfoca tu comida para ver sus nutrientes
          </p>
        </div>
        <div style={{ flex: 1, margin: "10px 20px 0", borderRadius: 24, border: "2px dashed rgba(251,246,236,0.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "radial-gradient(circle at center, rgba(201,138,29,0.18), transparent 70%)" }}>
          <div style={{ width: 190, height: 190, border: "2px solid #C45F3F", borderRadius: 20, overflow: "hidden", position: "relative" }}>
            <img
              src="https://loremflickr.com/380/380/ricebowl,chicken"
              alt="Plato a escanear"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
        <div style={{ padding: "24px 0 30px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setStep("scanning")}
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "#FAF6ED",
              border: "5px solid #C45F3F",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    );
  }

  if (step === "scanning") {
    return (
      <div style={{ height: "100%", background: "#241E1B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: "4px solid #C45F3F", borderTopColor: "transparent", animation: "spin 0.9s linear infinite" }} />
        <p style={{ color: "#E3F3EE", fontFamily: "Manrope, sans-serif", fontSize: 13.5 }}>Analizando tu platillo…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div style={{ paddingBottom: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 20px 6px" }}>
          <button onClick={() => setStep("camera")} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <ChevronLeft size={20} color="#241E1B" />
          </button>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, margin: 0, fontWeight: 600, color: "#241E1B" }}>Resultado</h1>
        </div>

        <div style={{ margin: "10px 20px", height: 150, borderRadius: 20, background: "linear-gradient(135deg,#C45F3F,#008471)", overflow: "hidden", position: "relative" }}>
          <img
            src="https://loremflickr.com/500/300/ricebowl,chicken"
            alt="Bowl de pollo y verduras"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div style={{ margin: "0 20px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 600, color: "#241E1B", margin: 0 }}>Bowl de pollo y verduras</p>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: "#79694F", margin: "4px 0 0" }}>≈ 410 kcal por porción</p>
        </div>

        <div style={{ margin: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {NUTRIENTS.map((n) => (
            <div key={n.label} style={{ background: "#FFFFFF", border: "1px solid #EDE6D6", borderRadius: 16, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <n.icon size={15} color={n.color} />
                <span style={{ fontSize: 11.5, fontFamily: "Manrope, sans-serif", color: "#5A5347", fontWeight: 600 }}>{n.label}</span>
              </div>
              <p style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 600, color: "#241E1B" }}>
                {n.value}<span style={{ fontSize: 12 }}>{n.unit}</span>
              </p>
              <div style={{ marginTop: 6, height: 5, borderRadius: 4, background: "#F1ECDD" }}>
                <div style={{ width: `${Math.min(n.value * 2, 100)}%`, height: "100%", background: n.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ margin: "0 20px" }}>
          <button
            onClick={() => setStep("upload")}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 16,
              border: "none",
              background: "#008471",
              color: "#FAF6ED",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Subir esta receta
          </button>
        </div>
      </div>
    );
  }

  if (step === "upload") {
    return (
      <div style={{ paddingBottom: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 20px 6px" }}>
          <button onClick={() => setStep("result")} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <ChevronLeft size={20} color="#241E1B" />
          </button>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, margin: 0, fontWeight: 600, color: "#241E1B" }}>Subir receta</h1>
        </div>

        <div style={{ margin: "14px 20px" }}>
          <label style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 600, color: "#5A5347" }}>Nombre de la receta</label>
          <input
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="p. ej. Bowl de pollo y verduras"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "11px 14px",
              borderRadius: 14,
              border: "1px solid #EDE6D6",
              fontFamily: "Manrope, sans-serif",
              fontSize: 13,
              color: "#241E1B",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ margin: "0 20px 14px" }}>
          <label style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 600, color: "#5A5347" }}>Ingredientes</label>
          <textarea
            readOnly
            placeholder="Pollo, calabacita, pimiento, arroz integral…"
            rows={3}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "11px 14px",
              borderRadius: 14,
              border: "1px solid #EDE6D6",
              fontFamily: "Manrope, sans-serif",
              fontSize: 13,
              color: "#241E1B",
              boxSizing: "border-box",
              resize: "none",
            }}
          />
        </div>

        <div style={{ margin: "0 20px 18px", background: "#F1ECDD", borderRadius: 16, padding: 14 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 12.5, color: "#241E1B" }}>
            Compartir con
          </p>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#241E1B" }}>Tu perfil</span>
            <Toggle checked={shareProfile} onChange={() => setShareProfile((v) => !v)} />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#241E1B" }}>Tus amigos</span>
            <Toggle checked={shareFriends} onChange={() => setShareFriends((v) => !v)} />
          </label>
        </div>

        <div style={{ margin: "0 20px" }}>
          <button
            onClick={() => setStep("done")}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 16,
              border: "none",
              background: "#008471",
              color: "#FAF6ED",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Publicar receta
          </button>
        </div>
      </div>
    );
  }

  // done
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 30px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#898E46", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={30} color="#FAF6ED" />
      </div>
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 600, color: "#241E1B", margin: 0 }}>¡Receta compartida!</p>
      <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#79694F", margin: 0 }}>
        Ya está en tu perfil y en el feed de tus amigos.
      </p>
      <button
        onClick={() => setStep("camera")}
        style={{ marginTop: 8, padding: "10px 20px", borderRadius: 14, border: "1px solid #EDE6D6", background: "#FFFFFF", fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13, color: "#241E1B", cursor: "pointer" }}
      >
        Escanear otro plato
      </button>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40,
        height: 24,
        borderRadius: 20,
        border: "none",
        background: checked ? "#898E46" : "#D9CFB8",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#FAF6ED",
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

// ---------- PROFILE ----------

function ProfileScreen() {
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: "22px 20px 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <PlateFrame color="#008471" size={60}>A</PlateFrame>
        <div>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 19, fontWeight: 600, color: "#241E1B" }}>Alma</p>
          <p style={{ margin: "2px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: "#79694F" }}>Chihuahua · se unió en 2026</p>
        </div>
      </div>

      <div style={{ display: "flex", margin: "0 20px 20px", background: "#FFFFFF", border: "1px solid #EDE6D6", borderRadius: 18, overflow: "hidden" }}>
        {[
          { n: "12", l: "Recetas" },
          { n: "5", l: "Talleres" },
          { n: "18", l: "Amigos" },
        ].map((s, i) => (
          <div key={s.l} style={{ flex: 1, textAlign: "center", padding: "14px 0", borderLeft: i > 0 ? "1px solid #EDE6D6" : "none" }}>
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 20, fontWeight: 600, color: "#008471" }}>{s.n}</p>
            <p style={{ margin: "2px 0 0", fontFamily: "Manrope, sans-serif", fontSize: 11, color: "#79694F" }}>{s.l}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: "#241E1B", margin: 0 }}>Mis recetas</p>
        <Star size={15} color="#C45F3F" />
      </div>
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {MY_RECIPES.map((r) => (
          <div key={r.name} style={{ borderRadius: 16, overflow: "hidden", background: "#FFFFFF", border: "1px solid #EDE6D6" }}>
            <div style={{ height: 80, background: r.bg, position: "relative", overflow: "hidden" }}>
              <img
                src={r.img}
                alt={r.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <p style={{ margin: 0, padding: "8px 10px 10px", fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 600, color: "#241E1B" }}>
              {r.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- APP SHELL ----------

const TABS = [
  { key: "home", label: "Inicio", icon: Home },
  { key: "social", label: "Social", icon: Users },
  { key: "scan", label: "", icon: Camera },
  { key: "map", label: "Mapa", icon: MapPin },
  { key: "profile", label: "Perfil", icon: User },
];

export default function MesaLocalPrototype() {
  const [tab, setTab] = useState("home");
  const [activeFriend, setActiveFriend] = useState(null);
  const [toast, setToast] = useState("");
  const isDark = tab === "scan";

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "28px 12px", background: "#EDE6D6", minHeight: "100%", fontFamily: "Manrope, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>

      <div
        style={{
          width: 380,
          maxWidth: "100%",
          height: 720,
          background: isDark ? "#241E1B" : "#FAF6ED",
          borderRadius: 40,
          border: "10px solid #241E1B",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 50px rgba(43,38,32,0.28)",
        }}
      >
        {/* notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 22, background: "#241E1B", borderRadius: "0 0 16px 16px", zIndex: 20 }} />

        {/* scroll content */}
        <div style={{ height: "100%", overflowY: "auto" }}>
          {tab === "home" && (
            <HomeScreen
              onFriendClick={setActiveFriend}
              onInvite={() => showToast("Invitación enviada 🎉")}
            />
          )}
          {tab === "social" && (
            <SocialScreen
              onFriendClick={setActiveFriend}
              onShare={() => showToast("Enlace copiado ✅")}
            />
          )}
          {tab === "map" && <MapScreen />}
          {tab === "scan" && <ScanScreen />}
          {tab === "profile" && <ProfileScreen />}
        </div>

        {/* bottom nav */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 78,
            background: isDark ? "rgba(43,38,32,0.9)" : "rgba(251,246,236,0.94)",
            backdropFilter: "blur(6px)",
            borderTop: "1px solid " + (isDark ? "rgba(255,255,255,0.08)" : "#EDE6D6"),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 6px",
          }}
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            if (t.key === "scan") {
              return (
                <button
                  key={t.key}
                  onClick={() => setTab("scan")}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#008471",
                    border: "4px solid " + (isDark ? "#241E1B" : "#FAF6ED"),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -26,
                    cursor: "pointer",
                    boxShadow: "0 6px 14px rgba(201,138,29,0.4)",
                  }}
                >
                  <Camera size={22} color="#FAF6ED" />
                </button>
              );
            }
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  cursor: "pointer",
                  padding: 6,
                }}
              >
                <t.icon size={20} color={active ? "#008471" : isDark ? "#79694F" : "#BDB29A"} />
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 600,
                    color: active ? "#008471" : isDark ? "#79694F" : "#BDB29A",
                  }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        <FriendModal friend={activeFriend} onClose={() => setActiveFriend(null)} />
        <Toast message={toast} />
      </div>
    </div>
  );
}
