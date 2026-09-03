import React, { useState, useEffect, useRef } from "react";
import {
  Home, Users, MapPin, Camera, User, Plus, Heart,
  ChevronLeft, Check, Utensils, Calendar
} from "lucide-react";

// Imagen del plato artesanal extraída de tu foto
const ARTISAN_PLATE_IMG = "./artisan_plate_transparent.png";
const COMMUNAL_TABLE_IMG = "./communal_feast_table.png";

// ==========================================
// 1. DATOS NUTRICIONALES SMAE & AMIGOS
// ==========================================

const INITIAL_HEALTH_PROFILE = {
  name: "Alma Ramírez",
  targetCalories: 1850, // Fórmula Mifflin-St Jeor
  consumedToday: 1120,
  healthGoal: "Control de glucosa & energía estable"
};

const VERIFIED_DISH = {
  name: "Bowl de Nopal Asado, Quinoa y Queso Menonita",
  calories: 390, // SMAE 5ª Ed: (19.5g prot × 4) + (35.2g carb × 4) + (19.8g líp × 9) = 390 kcal
  nutrientsDetailed: [
    { label: "Proteína", amount: "19.5g", caloriesPart: 78, level: "Saciedad 4h", color: "#008471", meaning: "Aporte combinado de quinoa y queso menonita; brinda el 39% de tu meta diaria para reparación muscular." },
    { label: "Fibra del Nopal", amount: "9.0g", caloriesPart: 18, level: "36% Diario", color: "#D97724", meaning: "Mucílagos del nopal que atrapan azúcares, previenen picos de glucosa y nutren la microbiota." },
    { label: "Carbohidratos Complejos", amount: "35.2g", caloriesPart: 141, level: "Absorción Lenta", color: "#C45F3F", meaning: "Energía sostenida de grano entero sin azúcares añadidos; evita el bajón de somnolencia." }
  ],
  sourceRef: "SMAE 5.ª Edición (Fomento de Nutrición y Salud A.C.)",
  img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
};

const INITIAL_PORTIONS = [
  {
    id: "green",
    category: "Verduras & Nopal",
    portionGuide: "1 taza o 1 nopal entero (150g = ~24 kcal)",
    colorActive: "rgba(0, 132, 113, 0.68)",
    strokeColor: "#008471",
    checked: true,
    pathD: "M 140 140 L 140 28 A 112 112 0 0 1 246.5 105.4 Z"
  },
  {
    id: "red",
    category: "Jitomate & Chiles",
    portionGuide: "1 jitomate o 3 chiles pasados (120g = ~30 kcal)",
    colorActive: "rgba(196, 95, 63, 0.68)",
    strokeColor: "#C45F3F",
    checked: true,
    pathD: "M 140 140 L 246.5 105.4 A 112 112 0 0 1 205.8 230.8 Z"
  },
  {
    id: "orange",
    category: "Zanahoria & Calabaza",
    portionGuide: "1 pieza mediana (100g = ~35 kcal)",
    colorActive: "rgba(217, 119, 36, 0.68)",
    strokeColor: "#D97724",
    checked: false,
    pathD: "M 140 140 L 205.8 230.8 A 112 112 0 0 1 74.2 230.8 Z"
  },
  {
    id: "yellow",
    category: "Granos & Maíz Criollo",
    portionGuide: "1/2 elote o 1/2 taza leguminosas (~110 kcal)",
    colorActive: "rgba(209, 152, 31, 0.68)",
    strokeColor: "#D1981F",
    checked: true,
    pathD: "M 140 140 L 74.2 230.8 A 112 112 0 0 1 33.5 105.4 Z"
  },
  {
    id: "purple",
    category: "Cebolla Morada & Betabel",
    portionGuide: "1/2 taza picada (60g = ~22 kcal)",
    colorActive: "rgba(124, 74, 130, 0.68)",
    strokeColor: "#7C4A82",
    checked: false,
    pathD: "M 140 140 L 33.5 105.4 A 112 112 0 0 1 140 28 Z"
  }
];

const INITIAL_FRIENDS = [
  { id: "vale", name: "Vale Reyes", color: "#008471", favoriteDish: "Tacos de coliflor con piña asada", specialty: "Trae las tortillas de maíz criollo" },
  { id: "diego", name: "Diego Ortiz", color: "#898E46", favoriteDish: "Bowl de nopal tierno con quinoa", specialty: "Trae el queso menonita de Cuauhtémoc" },
  { id: "ana", name: "Ana Cortés", color: "#C45F3F", favoriteDish: "Cazuela de lentejas con chile chilaca", specialty: "Prepara el comal y pone la mesa" }
];

const INITIAL_SPOTS = [
  { id: 1, name: "Clínica de Nutrición San Felipe", category: "Nutriólogo", type: "Bioimpedancia InBody", doctor: "LN. Mariana Terrazas", dist: "A 1.2 km", x: "28%", y: "42%", query: "Nutriologa San Felipe Chihuahua" },
  { id: 2, name: "Centro Nutricional Las Quintas", category: "Nutriólogo", type: "Nutrición Clínica & Glucosa", doctor: "Mtro. Rodrigo Corral", dist: "A 2.5 km", x: "54%", y: "58%", query: "Nutricionista Las Quintas Chihuahua" },
  { id: 3, name: "Chihuahua Local (Mercado)", category: "Mercados", type: "Tienda de productores", doctor: null, dist: "A 800m", x: "42%", y: "78%", query: "Chihuahua Local, Calle Guadalupe Victoria 100" }
];

const INITIAL_FEED = [
  { id: 1, user: "Vale Reyes", time: "hace 2 h", dish: "Tacos de coliflor asada al pastor con piña (3 pzas)", tag: "350 kcal · SMAE", likes: 24, img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80" },
  { id: 2, user: "Diego Ortiz", time: "hace 4 h", dish: "Bowl de nopal asado con quinoa y queso menonita", tag: "390 kcal · SMAE", likes: 42, img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80" },
  { id: 3, user: "Ana Cortés", time: "ayer", dish: "Cazuela de lentejas y chile chilaca tatemado", tag: "265 kcal · SMAE", likes: 31, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80" }
];

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================

export default function MesaLocalPrototype() {
  const [tab, setTab] = useState("home");
  const [plateStyle, setPlateStyle] = useState("artisan_plate"); // 'artisan_plate' o 'communal_table'
  const [portions, setPortions] = useState(INITIAL_PORTIONS);
  const [userHealth, setUserHealth] = useState(INITIAL_HEALTH_PROFILE);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [toast, setToast] = useState("");
  const [bookingFriend, setBookingFriend] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(1);

  // Cámara State
  const [scanStep, setScanStep] = useState("camera");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (tab === "scan" && scanStep === "camera") {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((stream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(() => {});
    }
  }, [tab, scanStep]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function handleTogglePortion(id) {
    setPortions(portions.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  }

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && video.videoWidth && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedPhoto(canvas.toDataURL("image/jpeg", 0.85));
    } else {
      setCapturedPhoto(VERIFIED_DISH.img);
    }
    setScanStep("scanning");
    setTimeout(() => setScanStep("result"), 1100);
  }

  const filledCount = portions.filter(p => p.checked).length;
  const currentPlateImg = plateStyle === "artisan_plate" ? ARTISAN_PLATE_IMG : COMMUNAL_TABLE_IMG;

  return (
    <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", minHeight: "100vh", backgroundColor: "#F7F3EB", color: "#241E1B", fontFamily: "Manrope, sans-serif", position: "relative", boxShadow: "0 25px 70px rgba(0,0,0,0.4)" }}>
      
      {/* 1. VISTA: INICIO */}
      {tab === "home" && (
        <div style={{ paddingBottom: 100 }}>
          <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 23, fontWeight: 800, margin: 0 }}>Tu Mesa & Salud</h1>
              <p style={{ fontSize: 12, color: "#79694F", margin: "2px 0 0" }}>Meta: <strong>{userHealth.healthGoal}</strong></p>
            </div>
            <button onClick={() => showToast("Subir receta")} style={{ background: "#008471", color: "#FAF7F0", border: "none", borderRadius: 18, padding: "6px 12px", fontSize: 11.5, fontWeight: 800, cursor: "pointer" }}>
              + Subir Receta
            </button>
          </div>

          {/* Presupuesto */}
          <div style={{ margin: "0 20px 14px", background: "#FFFFFF", border: "1px solid #E3D9C6", borderRadius: 22, padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 800 }}>Presupuesto Diario</span>
              <span style={{ fontWeight: 800, color: "#008471" }}>{userHealth.consumedToday} / {userHealth.targetCalories} kcal</span>
            </div>
            <div style={{ height: 8, background: "#EDE6D6", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${(userHealth.consumedToday / userHealth.targetCalories) * 100}%`, height: "100%", background: "#008471" }} />
            </div>
          </div>

          {/* EL PLATO CON LA FOTOGRAFÍA REAL DE CERÁMICA */}
          <div style={{ margin: "0 20px 20px", background: "#FAF7F0", border: "1px solid #E3D9C6", borderRadius: 30, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6, background: "#EDE5D6", padding: 3, borderRadius: 12 }}>
                <button
                  onClick={() => setPlateStyle("artisan_plate")}
                  style={{ border: "none", background: plateStyle === "artisan_plate" ? "#008471" : "transparent", color: plateStyle === "artisan_plate" ? "#FAF7F0" : "#79694F", fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 8, cursor: "pointer" }}
                >
                  Plato de Barro
                </button>
                <button
                  onClick={() => setPlateStyle("communal_table")}
                  style={{ border: "none", background: plateStyle === "communal_table" ? "#008471" : "transparent", color: plateStyle === "communal_table" ? "#FAF7F0" : "#79694F", fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 8, cursor: "pointer" }}
                >
                  Mesa Comunal
                </button>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#79694F" }}>{filledCount} de 5 porciones</span>
            </div>

            {/* Centro: Fotografía Real + Capa de Esmalte Translúcido */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "8px 0" }}>
              <div style={{ width: 270, height: 270, borderRadius: "50%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 36px rgba(45,35,25,0.18)" }}>
                
                {/* Imagen Real del Plato Subido por el Usuario */}
                <img
                  src={currentPlateImg}
                  alt="Plato de Barro Artesanal"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", pointerEvents: "none" }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />

                {/* Esmalte Translúcido SVG */}
                <svg width="270" height="270" viewBox="0 0 280 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10, mixBlendMode: "multiply" }}>
                  {portions.map((p) => (
                    <path
                      key={p.id}
                      d={p.pathD}
                      fill={p.checked ? p.colorActive : "rgba(0,0,0,0.02)"}
                      stroke={p.checked ? p.strokeColor : "rgba(255,255,255,0.5)"}
                      strokeWidth={p.checked ? "2.5" : "1.5"}
                      style={{ cursor: "pointer", transition: "all 0.25s ease" }}
                      onClick={() => handleTogglePortion(p.id)}
                    />
                  ))}
                </svg>

                {/* Sello Central */}
                <div style={{ position: "absolute", zIndex: 20, pointerEvents: "none", background: "rgba(250,247,240,0.92)", padding: "4px 10px", borderRadius: 14, border: "1px solid #DFD5C2", textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#241E1B", display: "block" }}>{filledCount}/5</span>
                  <span style={{ fontSize: 8.5, fontWeight: 800, color: "#008471", textTransform: "uppercase" }}>Porciones</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#79694F", marginTop: 8, fontWeight: 600 }}>Toca una sección para aplicar el esmalte de tu porción</p>
            </div>

            {/* Lista de porciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8, paddingTop: 10, borderTop: "1px solid #E8DFC9" }}>
              {portions.map((p) => (
                <div key={p.id} onClick={() => handleTogglePortion(p.id)} style={{ padding: "8px 12px", borderRadius: 14, background: p.checked ? "#FFFFFF" : "rgba(244,239,230,0.6)", border: "1px solid " + (p.checked ? "#008471" : "#E8DFC9"), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.strokeColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                      {p.checked ? "✓" : "+"}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{p.category}</span>
                  </div>
                  <span style={{ fontSize: 10.5, color: "#79694F" }}>{p.portionGuide}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cenas con amigos */}
          <div style={{ padding: "0 20px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 8px" }}>Cenas con Amigos</h3>
            <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
              {INITIAL_FRIENDS.map(f => (
                <div key={f.id} onClick={() => setBookingFriend(f)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: f.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>
                    {f.name[0]}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5A5347" }}>{f.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. VISTA: CÁMARA */}
      {tab === "scan" && (
        <div style={{ minHeight: "85vh", background: "#1C1715", color: "#FAF6ED", padding: 20 }}>
          {scanStep === "camera" ? (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>Cámara Activa</h2>
              <div style={{ height: 360, borderRadius: 24, overflow: "hidden", background: "#000", position: "relative" }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 20, border: "2px dashed #F4D242", borderRadius: 16 }} />
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                <button onClick={handleCapture} style={{ width: 64, height: 64, borderRadius: "50%", background: "#FAF7F0", border: "5px solid #C45F3F", cursor: "pointer" }} />
              </div>
            </div>
          ) : scanStep === "scanning" ? (
            <div style={{ textAlign: "center", paddingTop: 100 }}>
              <h3>Analizando componentes con base de datos SMAE…</h3>
            </div>
          ) : (
            <div style={{ background: "#FFF", color: "#241E1B", borderRadius: 24, padding: 16 }}>
              <button onClick={() => setScanStep("camera")} style={{ background: "none", border: "none", color: "#008471", fontWeight: 800, cursor: "pointer", marginBottom: 10 }}>
                ← Tomar otra foto
              </button>
              <img src={capturedPhoto || VERIFIED_DISH.img} alt="Platillo" style={{ width: "100%", height: 160, borderRadius: 16, objectFit: "cover" }} />
              <h3 style={{ margin: "10px 0 4px", fontSize: 15, fontWeight: 800 }}>{VERIFIED_DISH.name}</h3>
              <p style={{ color: "#008471", fontWeight: 800, fontSize: 14 }}>{VERIFIED_DISH.calories} kcal</p>
              <button onClick={() => { setUserHealth({ ...userHealth, consumedToday: userHealth.consumedToday + 390 }); setTab("home"); showToast("+390 kcal sumadas"); }} style={{ width: "100%", background: "#008471", color: "#fff", border: "none", borderRadius: 14, padding: "10px 0", fontWeight: 800, cursor: "pointer", marginTop: 10 }}>
                Sumar al Plato (+390 kcal)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. VISTA: MAPA */}
      {tab === "map" && (
        <div style={{ padding: "16px 20px 100px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>Especialistas & Mapa</h2>
          <div style={{ height: 180, background: "#EDE4D0", borderRadius: 20, position: "relative", overflow: "hidden", marginBottom: 14 }}>
            {INITIAL_SPOTS.map(s => (
              <div key={s.id} onClick={() => setSelectedSpotId(s.id)} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%, -50%)", cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: s.category === "Nutriólogo" ? "#008471" : "#C45F3F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={16} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INITIAL_SPOTS.map(s => (
              <div key={s.id} style={{ background: "#fff", border: "1px solid " + (s.id === selectedSpotId ? "#008471" : "#E3D9C6"), borderRadius: 16, padding: 12 }}>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{s.name}</h4>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#79694F" }}>{s.doctor || s.type} · {s.dist}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VISTA: SOCIAL */}
      {tab === "social" && (
        <div style={{ padding: "16px 20px 100px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px" }}>Mesa Social</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {feed.map(p => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #E3D9C6" }}>
                <img src={p.img} alt={p.dish} style={{ width: "100%", height: 150, objectFit: "cover" }} />
                <div style={{ padding: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{p.dish}</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#008471", fontWeight: 700 }}>{p.tag} · por {p.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VISTA: SALUD */}
      {tab === "profile" && (
        <div style={{ padding: "16px 20px 100px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px" }}>Perfil de Salud</h2>
          <div style={{ background: "#fff", borderRadius: 20, padding: 16, border: "1px solid #E3D9C6" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>{userHealth.name}</h3>
            <p style={{ color: "#008471", fontWeight: 700, fontSize: 12 }}>{userHealth.healthGoal}</p>
            <div style={{ marginTop: 10, background: "#FAF7F0", padding: 10, borderRadius: 12, fontSize: 12 }}>
              Meta Calórica: <strong>{userHealth.targetCalories} kcal/día</strong>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, height: 76, background: "rgba(250,247,240,0.96)", backdropFilter: "blur(10px)", borderTop: "1px solid #E3D9C6", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 40 }}>
        {[
          { key: "home", label: "Plato", icon: Home },
          { key: "social", label: "Social", icon: Users },
          { key: "scan", label: "", icon: Camera },
          { key: "map", label: "Mapa", icon: MapPin },
          { key: "profile", label: "Salud", icon: User }
        ].map((t) => {
          const active = tab === t.key;
          if (t.key === "scan") {
            return (
              <button key={t.key} onClick={() => setTab("scan")} style={{ width: 56, height: 56, borderRadius: "50%", background: "#008471", border: "4px solid #FAF7F0", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -26, cursor: "pointer", boxShadow: "0 6px 16px rgba(0,132,113,0.35)" }}>
                <Camera size={22} color="#FAF7F0" />
              </button>
            );
          }
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
              <t.icon size={20} color={active ? "#008471" : "#8C7D6D"} />
              <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#008471" : "#8C7D6D" }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modal de Cenas con Amigos */}
      {bookingFriend && (
        <div onClick={() => setBookingFriend(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#FAF7F0", borderRadius: "24px 24px 0 0", padding: 20 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800 }}>Planear Cena con {bookingFriend.name}</h3>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "#79694F" }}>{bookingFriend.specialty}</p>
            <button onClick={() => { setBookingFriend(null); showToast(`🎟️ ¡Cena agendada con ${bookingFriend.name}!`); }} style={{ width: "100%", background: "#008471", color: "#fff", border: "none", borderRadius: 14, padding: "12px 0", fontWeight: 800, cursor: "pointer" }}>
              Confirmar y Enviar Invitación 🎟️
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#241E1B", color: "#FAF7F0", padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 800, zIndex: 70 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
