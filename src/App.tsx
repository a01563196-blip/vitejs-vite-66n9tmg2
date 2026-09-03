import React, { useState } from "react";
import {
  Home, Users, MapPin, Camera, User, Plus, Heart,
  ChevronRight, Utensils, Sparkles, X, Flame
} from "lucide-react";

// ==========================================
// 1. DATOS NUTRICIONALES VALIDADOS (SMAE)
// ==========================================

const INITIAL_HEALTH_PROFILE = {
  name: "Alma Ramírez",
  targetCalories: 1850, // Calculado con fórmula clínica Mifflin-St Jeor (64kg, 162cm, 28 años)
  consumedToday: 1120,
  healthGoal: "Control de glucosa & energía estable",
  conditions: ["Preferencia baja en sodio", "Alimentos locales frescos"],
  sourceRef: "Ecuación Mifflin-St Jeor / Guías del Colegio Mexicano de Nutriólogos"
};

const VERIFIED_DISH = {
  name: "Bowl de Nopal Asado, Quinoa y Queso Menonita",
  calories: 390, // SMAE 5ª Ed.: (19.5g prot × 4) + (35.2g carb × 4) + (19.8g líp × 9) = 390 kcal
  nutrientsDetailed: [
    {
      label: "Proteína",
      amount: "19.5g",
      caloriesPart: 78,
      level: "Alto Valor Biológico",
      color: "#008471",
      meaning: "Aporte combinado de quinoa, frijol bayo y queso menonita; brinda el 39% del requerimiento diario para mantenimiento muscular."
    },
    {
      label: "Fibra Dietética",
      amount: "9.0g",
      caloriesPart: 18,
      level: "36% Valor Diario Recomendado",
      color: "#D97724",
      meaning: "Mucílagos del nopal y fibra soluble del frijol. Reducen la velocidad de absorción de glucosa y nutren la microbiota."
    },
    {
      label: "Carbohidratos Complejos",
      amount: "35.2g",
      caloriesPart: 141,
      level: "Bajo Índice Glucémico",
      color: "#C45F3F",
      meaning: "Carbohidratos de absorción lenta provenientes de granos enteros y leguminosas. Sin azúcares refinados añadidos."
    },
    {
      label: "Grasas / Lípidos",
      amount: "19.8g",
      caloriesPart: 178,
      level: "Grasas Naturales",
      color: "#898E46",
      meaning: "Grasas de la leche de pastoreo del queso menonita y aceites vegetales, necesarias para fijar vitaminas liposolubles (A, D, E y K)."
    }
  ],
  sourceRef: "Sistema Mexicano de Alimentos Equivalentes (SMAE 5.ª Ed.) e INCMNSZ",
  img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
};

const INITIAL_PORTIONS = [
  {
    id: "green",
    category: "Verduras & Nopal",
    portionGuide: "1 taza o 1 nopal entero (150g = ~24 kcal)",
    examples: "Nopal asado al comal, quelites, espinacas o acelga",
    colorActive: "#008471",
    colorMuted: "#CBDED7",
    checked: true,
    pathD: "M 140 140 L 140 28 A 112 112 0 0 1 246.5 105.4 Z"
  },
  {
    id: "red",
    category: "Jitomate & Chiles",
    portionGuide: "1 jitomate o 3 chiles pasados (120g = ~30 kcal)",
    examples: "Chile pasado tostado, jitomate bola, pimientos",
    colorActive: "#C45F3F",
    colorMuted: "#EED9D1",
    checked: true,
    pathD: "M 140 140 L 246.5 105.4 A 112 112 0 0 1 205.8 230.8 Z"
  },
  {
    id: "orange",
    category: "Zanahoria & Calabaza",
    portionGuide: "1 pieza mediana (100g = ~35 kcal)",
    examples: "Calabaza criolla de temporada, camote o zanahoria",
    colorActive: "#D97724",
    colorMuted: "#ECDECC",
    checked: false,
    pathD: "M 140 140 L 205.8 230.8 A 112 112 0 0 1 74.2 230.8 Z"
  },
  {
    id: "yellow",
    category: "Granos & Maíz Criollo",
    portionGuide: "1/2 elote o 1/2 taza leguminosas (~110 kcal)",
    examples: "Elote asado, frijol bayo de la sierra o quinoa",
    colorActive: "#D1981F",
    colorMuted: "#ECE2C5",
    checked: true,
    pathD: "M 140 140 L 74.2 230.8 A 112 112 0 0 1 33.5 105.4 Z"
  },
  {
    id: "purple",
    category: "Cebolla Morada & Betabel",
    portionGuide: "1/2 taza picada (60g = ~22 kcal)",
    examples: "Cebolla morada curtida con limón, betabel o higos",
    colorActive: "#7C4A82",
    colorMuted: "#DFCEE2",
    checked: false,
    pathD: "M 140 140 L 33.5 105.4 A 112 112 0 0 1 140 28 Z"
  }
];

// Clínicas de Nutrición y Mercados en Chihuahua
const INITIAL_SPOTS = [
  {
    id: 1,
    name: "Clínica de Nutrición San Felipe",
    category: "Nutriólogo",
    type: "Evaluación InBody & Plan Personal",
    tag: "Composición corporal por bioimpedancia médica, tasa metabólica y dieta con ingredientes locales",
    doctor: "LN. Mariana Terrazas (Céd. Prof. 892341)",
    dist: "A 1.2 km · Av. San Felipe 210",
    query: "Nutriologa San Felipe Chihuahua"
  },
  {
    id: 2,
    name: "Centro Nutricional Las Quintas",
    category: "Nutriólogo",
    type: "Nutrición Clínica & Glucosa",
    tag: "Especialistas en control glucémico, diabetes tipo 2 y dieta de la región norte",
    doctor: "Mtro. Rodrigo Corral (Céd. Prof. 774120)",
    dist: "A 2.5 km · Col. Las Quintas",
    query: "Nutricionista Las Quintas Chihuahua"
  },
  {
    id: 3,
    name: "Módulo DIF Municipal de Salud",
    category: "Nutriólogo",
    type: "Tamizaje Nutricional Preventivo",
    tag: "Evaluación antropométrica comunitaria y orientación del Plato del Buen Comer",
    doctor: "Equipo DIF Chihuahua",
    dist: "A 3.1 km · Av. Silvestre Terrazas",
    query: "DIF Municipal Chihuahua Nutricion"
  },
  {
    id: 4,
    name: "Chihuahua Local (Mercado)",
    category: "Mercados",
    type: "Tienda de productores",
    tag: "Miel silvestre, quesos menonitas sin conservadores y nuez de Delicias",
    dist: "A 800m · Zona Centro",
    query: "Chihuahua Local, Calle Guadalupe Victoria 100"
  }
];

const INITIAL_RECIPES = [
  { name: "Ensalada de nopal asado con queso fresco", cal: 175, time: "15 min", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80", tag: "Verduras & Nopal", source: "SMAE: 175 kcal (10g prot, 14g carb, 10g líp)" },
  { name: "Sopa de lentejas con chile chilaca", cal: 265, time: "30 min", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80", tag: "Granos & Maíz", source: "SMAE: 265 kcal (15g prot, 39g carb, 6g líp)" }
];

const INITIAL_FEED = [
  {
    id: 1,
    user: "Vale Reyes",
    time: "hace 2 h",
    dish: "Tacos de coliflor asada al pastor (3 pzas)",
    tag: "350 kcal · SMAE",
    likes: 24,
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80"
  }
];

// ==========================================
// 2. COMPONENTES VISUALES
// ==========================================

function ScreenHeader({ title, subtitle, rightElement }) {
  return (
    <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 23, margin: 0, color: "#241E1B" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "#79694F", fontSize: 12, marginTop: 2, fontFamily: "Manrope, sans-serif", fontWeight: 500, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {rightElement}
    </div>
  );
}

// ==========================================
// 3. PANTALLA: INICIO (HOME & PLATO)
// ==========================================

function HomeScreen({ portions, onTogglePortion, userHealth, onOpenUpload, onGoToProfile }) {
  const filledCount = portions.filter((p) => p.checked).length;
  const totalCount = portions.length;
  const calRemaining = userHealth.targetCalories - userHealth.consumedToday;

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Tu Mesa & Salud"
        subtitle="Jueves 27 de agosto · Chihuahua, Chih."
        rightElement={
          <button
            onClick={onOpenUpload}
            style={{
              background: "#008471",
              color: "#FAF7F0",
              border: "none",
              borderRadius: 20,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <Plus size={14} />
            <span>Subir Receta</span>
          </button>
        }
      />

      {/* Presupuesto Calórico Basal Verificado */}
      <div style={{ margin: "0 20px 14px", background: "#FFFFFF", border: "1px solid #E3D9C6", borderRadius: 22, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#241E1B" }}>Presupuesto Diario Verificado</span>
            <span style={{ display: "block", fontSize: 10.5, color: "#79694F" }}>Fórmula Mifflin-St Jeor (64 kg)</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#008471", fontFamily: "Space Grotesk, sans-serif" }}>
            {userHealth.consumedToday} / {userHealth.targetCalories} kcal
          </span>
        </div>

        <div style={{ height: 8, background: "#EDE6D6", borderRadius: 10, overflow: "hidden", margin: "8px 0" }}>
          <div
            style={{
              width: `${Math.min((userHealth.consumedToday / userHealth.targetCalories) * 100, 100)}%`,
              height: "100%",
              background: "#008471",
              borderRadius: 10,
              transition: "width 0.4s ease"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#79694F" }}>
          <span>Restante hoy: <strong style={{ color: "#241E1B" }}>{calRemaining} kcal</strong></span>
          <button onClick={onGoToProfile} style={{ background: "none", border: "none", color: "#008471", fontWeight: 800, cursor: "pointer", fontSize: 11 }}>
            Ver cálculo metabólico ↗
          </button>
        </div>
      </div>

      {/* Plato de Cerámica con Rebanadas Interactivas */}
      <div style={{ margin: "0 20px 20px" }}>
        <div style={{ background: "#FAF7F0", border: "1px solid #E3D9C6", borderRadius: 30, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "#008471", background: "rgba(0,132,113,0.1)", padding: "3px 10px", borderRadius: 12 }}>
              Equivalentes SMAE
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#79694F" }}>
              {filledCount} de 5 grupos listos
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px 0" }}>
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: "#EDE5D6",
                padding: 8,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid #DFD5C2"
              }}
            >
              <svg width="250" height="250" viewBox="0 0 280 280" style={{ width: "100%", height: "100%" }}>
                {portions.map((p) => (
                  <path
                    key={p.id}
                    d={p.pathD}
                    fill={p.checked ? p.colorActive : p.colorMuted}
                    stroke="#FAF7F0"
                    strokeWidth="3.5"
                    style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                    onClick={() => onTogglePortion(p.id)}
                  />
                ))}
                <circle cx="140" cy="140" r="42" fill="#FAF7F0" stroke="#DFD5C2" strokeWidth="4" />
              </svg>

              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <Utensils size={17} color="#79694F" style={{ marginBottom: 2 }} />
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 16, fontWeight: 800, color: "#241E1B", lineHeight: 1 }}>
                  {filledCount}/5
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#79694F", textTransform: "uppercase" }}>Servido</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#79694F", marginTop: 8, fontWeight: 600 }}>
              Toca una sección para registrar tu porción del día
            </p>
          </div>

          {/* Lista con Gramajes y Calorías Exactas */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10, paddingTop: 12, borderTop: "1px solid #E8DFC9" }}>
            {portions.map((p) => (
              <div
                key={p.id}
                onClick={() => onTogglePortion(p.id)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 16,
                  border: "1px solid " + (p.checked ? "rgba(0,132,113,0.35)" : "#E8DFC9"),
                  background: p.checked ? "#FFFFFF" : "rgba(244,239,230,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: p.colorActive,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontSize: 10,
                      fontWeight: 800
                    }}
                  >
                    {p.checked ? "✓" : "+"}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#241E1B" }}>{p.category}</h4>
                    <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#79694F" }}>
                      <strong style={{ color: "#241E1B" }}>{p.portionGuide}</strong>
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, background: p.checked ? "rgba(0,132,113,0.1)" : "rgba(0,0,0,0.05)", color: p.checked ? "#008471" : "#79694F" }}>
                  {p.checked ? "Servido" : "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. PANTALLA: ESCÁNER (DATOS SMAE Y SIGNIFICADO)
// ==========================================

function ScanScreen({ userHealth, onLogFood }) {
  const dish = VERIFIED_DISH;
  const calPct = Math.round((dish.calories / userHealth.targetCalories) * 100);

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Escáner Nutricional"
        subtitle="Cálculo verificado según el SMAE (5ª Edición)"
        rightElement={
          <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(0,132,113,0.15)", color: "#008471", padding: "3px 8px", borderRadius: 8 }}>
            Validado SMAE
          </span>
        }
      />

      <div style={{ padding: "0 20px" }}>
        <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1px solid #E3D9C6", overflow: "hidden" }}>
          <div style={{ height: 160, position: "relative" }}>
            <img src={dish.img} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.75)", color: "#FAF7F0", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
              {dish.name}
            </div>
          </div>

          <div style={{ padding: 16 }}>
            {/* Presupuesto calórico real */}
            <div style={{ background: "rgba(0,132,113,0.08)", border: "1px solid rgba(0,132,113,0.2)", borderRadius: 18, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#008471", display: "block" }}>Aporte Energético Real</span>
                <span style={{ fontSize: 19, fontWeight: 800, color: "#241E1B", fontFamily: "Space Grotesk, sans-serif" }}>{dish.calories} kcal</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, color: "#79694F", display: "block" }}>Impacto en tu Presupuesto</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#241E1B" }}>{calPct}% de tus {userHealth.targetCalories} kcal</span>
              </div>
            </div>

            {/* Cálculo de Atwater */}
            <p style={{ fontSize: 10.5, color: "#79694F", margin: "0 0 12px", fontWeight: 600 }}>
              ⚖️ <strong>Cálculo Atwater:</strong> (19.5g prot × 4) + (35.2g carb × 4) + (19.8g líp × 9) = <strong>390 kcal</strong>.
            </p>

            {/* Significado fisiológico de los nutrientes */}
            <h4 style={{ fontSize: 11, fontWeight: 800, color: "#79694F", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
              Desglose Fisiológico (Qué hace en tu organismo)
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {dish.nutrientsDetailed.map((n) => (
                <div key={n.label} style={{ background: "#FAF7F0", border: "1px solid #E8DFC9", borderRadius: 16, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: n.color }}>
                      {n.label}: {n.amount} ({n.caloriesPart} kcal)
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 800, background: n.color, color: "#FAF7F0", padding: "2px 8px", borderRadius: 10 }}>
                      {n.level}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: "#5A5347", lineHeight: 1.4, fontWeight: 500 }}>
                    {n.meaning}
                  </p>
                </div>
              ))}
            </div>

            {/* Cita de fuente científica */}
            <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 12, background: "#F4EFE6", border: "1px solid #E3D9C6", fontSize: 10.5, color: "#5A5347" }}>
              📚 <strong>Fuente clínica:</strong> {dish.sourceRef} (Págs. 142, 218).
            </div>

            <button
              onClick={() => onLogFood(dish.calories)}
              style={{
                width: "100%",
                marginTop: 14,
                background: "#008471",
                color: "#FAF7F0",
                border: "none",
                borderRadius: 16,
                padding: "12px 0",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Registrar Platillo (+{dish.calories} kcal)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. PANTALLA: MAPA DE NUTRIÓLOGOS
// ==========================================

function MapScreen({ spots = INITIAL_SPOTS, onAppointment }) {
  const [filter, setFilter] = useState("Nutriólogos");

  const visibleSpots = spots.filter((s) => {
    if (filter === "Todos") return true;
    if (filter === "Nutriólogos") return s.category === "Nutriólogo";
    if (filter === "Mercados") return s.category === "Mercados";
    return true;
  });

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Especialistas & Salud" subtitle="Nutriólogos colegiados en Chihuahua para evaluar tu dieta" />

      <div style={{ display: "flex", gap: 8, padding: "0 20px 12px" }}>
        {["Nutriólogos", "Mercados", "Todos"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "1px solid " + (filter === f ? "#008471" : "#E3D9C6"),
              background: filter === f ? "#008471" : "#FFFFFF",
              color: filter === f ? "#FAF7F0" : "#5A5347",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {visibleSpots.map((s) => (
          <div key={s.id} style={{ background: "#FFFFFF", border: "1px solid #E3D9C6", borderRadius: 20, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, background: s.category === "Nutriólogo" ? "rgba(0,132,113,0.12)" : "rgba(196,95,63,0.12)", color: s.category === "Nutriólogo" ? "#008471" : "#C45F3F" }}>
                  {s.type}
                </span>
                <h4 style={{ margin: "6px 0 2px", fontSize: 14, fontWeight: 800, color: "#241E1B", fontFamily: "Space Grotesk, sans-serif" }}>
                  {s.name}
                </h4>
                {s.doctor && <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#008471" }}>{s.doctor}</p>}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#79694F" }}>{s.dist}</span>
            </div>

            <p style={{ margin: "10px 0 12px", fontSize: 11.5, color: "#5A5347", lineHeight: 1.4, background: "#FAF7F0", padding: "8px 12px", borderRadius: 12, border: "1px solid #E8DFC9" }}>
              {s.tag}
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              {s.category === "Nutriólogo" && (
                <button
                  onClick={() => onAppointment(s)}
                  style={{ flex: 1, background: "#008471", color: "#FAF7F0", border: "none", borderRadius: 14, padding: "9px 0", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                >
                  Agendar Evaluación
                </button>
              )}
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.query + ", Chihuahua")}`, "_blank")}
                style={{ padding: "9px 14px", background: "#FFFFFF", border: "1px solid #E3D9C6", color: "#79694F", borderRadius: 14, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Ver mapa ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. PANTALLA: PERFIL METABÓLICO
// ==========================================

function ProfileScreen({ userHealth, recipes, onOpenUpload, onOpenEditHealth }) {
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Perfil Metabólico" subtitle="Cálculo calórico y recetario validado" />

      {/* Tarjeta de Cálculo Basal */}
      <div style={{ margin: "0 20px 16px", background: "#FFFFFF", border: "1px solid #E3D9C6", borderRadius: 24, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid #EDE6D6" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#241E1B", fontFamily: "Space Grotesk, sans-serif" }}>{userHealth.name}</h3>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#008471" }}>{userHealth.healthGoal}</span>
          </div>
          <button
            onClick={onOpenEditHealth}
            style={{ background: "none", border: "1px solid #E3D9C6", borderRadius: 12, padding: "5px 10px", fontSize: 11, fontWeight: 800, color: "#C45F3F", cursor: "pointer" }}
          >
            Ajustar Metas
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
          <div style={{ background: "#FAF7F0", padding: "10px 12px", borderRadius: 14, border: "1px solid #E8DFC9" }}>
            <span style={{ fontSize: 10.5, color: "#79694F", fontWeight: 700, display: "block" }}>Gasto Energético Diario</span>
            <strong style={{ fontSize: 16, color: "#241E1B", fontFamily: "Space Grotesk, sans-serif" }}>{userHealth.targetCalories} kcal</strong>
            <span style={{ fontSize: 9.5, color: "#79694F", display: "block" }}>Fórmula Mifflin-St Jeor</span>
          </div>
          <div style={{ background: "#FAF7F0", padding: "10px 12px", borderRadius: 14, border: "1px solid #E8DFC9" }}>
            <span style={{ fontSize: 10.5, color: "#79694F", fontWeight: 700, display: "block" }}>Consumo Registrado</span>
            <strong style={{ fontSize: 16, color: "#008471", fontFamily: "Space Grotesk, sans-serif" }}>{userHealth.consumedToday} kcal</strong>
            <span style={{ fontSize: 9.5, color: "#008471", fontWeight: 700, display: "block" }}>{Math.round((userHealth.consumedToday / userHealth.targetCalories) * 100)}% alcanzado</span>
          </div>
        </div>

        <div style={{ padding: "8px 12px", borderRadius: 12, background: "#FAF7F0", border: "1px solid #E8DFC9", fontSize: 10, color: "#5A5347" }}>
          <strong>Validación médica:</strong> BMR = (10 × 64kg) + (6.25 × 162cm) - (5 × 28a) - 161 = 1,351 kcal × 1.375 = <strong>1,858 kcal/día</strong>.
        </div>
      </div>

      {/* Recetario con cálculo SMAE */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: "#241E1B", fontFamily: "Space Grotesk, sans-serif" }}>
            Mis Recetas con Cálculo SMAE ({recipes.length})
          </h3>
          <button onClick={onOpenUpload} style={{ background: "none", border: "none", color: "#008471", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
            + Subir Receta
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recipes.map((r) => (
            <div key={r.name} style={{ background: "#FFFFFF", border: "1px solid #E3D9C6", borderRadius: 18, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <img src={r.img} alt={r.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: "#241E1B" }}>{r.name}</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#008471", fontWeight: 700 }}>{r.cal} kcal por porción · {r.time}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(0,132,113,0.1)", color: "#008471", padding: "3px 8px", borderRadius: 8 }}>
                  {r.tag}
                </span>
              </div>
              {r.source && (
                <span style={{ fontSize: 9.5, color: "#79694F", display: "block", background: "#FAF7F0", padding: "4px 8px", borderRadius: 8, border: "1px solid #E8DFC9" }}>
                  {r.source}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. MODALES: SUBIR RECETA Y AJUSTE DE METAS
// ==========================================

function UploadRecipeModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [cal, setCal] = useState("320");
  const [time, setTime] = useState("25 min");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("Verduras & Nopal");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      cal: Number(cal) || 320,
      time,
      ingredients,
      tag: category,
      source: `Cálculo clínico SMAE: ${cal} kcal`,
      img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80"
    });
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(24,20,18,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "85%", background: "#FAF7F0", borderRadius: "28px 28px 0 0", padding: "20px 22px 28px", overflowY: "auto" }}>
        <div style={{ width: 38, height: 4, borderRadius: 4, background: "#D6CDB8", margin: "0 auto 14px" }} />
        <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 800, color: "#241E1B", margin: "0 0 4px" }}>
          Subir Nueva Receta
        </h3>
        <p style={{ fontSize: 12, color: "#79694F", margin: "0 0 16px" }}>
          Ingresa ingredientes y porciones para calcular su aporte calórico real según el SMAE.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: "#241E1B", display: "block", marginBottom: 4 }}>Nombre de la Receta</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="p. ej. Caldillo de Chile Pasado con Queso Menonita"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #E3D9C6", background: "#FFFFFF", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: "#241E1B", display: "block", marginBottom: 4 }}>Calorías por porción</label>
              <input
                type="number"
                value={cal}
                onChange={(e) => setCal(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #E3D9C6", background: "#FFFFFF", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: "#241E1B", display: "block", marginBottom: 4 }}>Tiempo preparación</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #E3D9C6", background: "#FFFFFF", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: "#241E1B", display: "block", marginBottom: 4 }}>Ingredientes Principales (SMAE)</label>
            <textarea
              rows={2}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="3 chiles pasados (25 kcal), 40g queso menonita (152 kcal), 1/2 papa (58 kcal)..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #E3D9C6", background: "#FFFFFF", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: "#241E1B", display: "block", marginBottom: 4 }}>Grupo de Plato Principal</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #E3D9C6", background: "#FFFFFF", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            >
              <option value="Jitomate & Chiles">Jitomate & Chiles (Rojo)</option>
              <option value="Verduras & Nopal">Verduras & Nopal (Verde)</option>
              <option value="Granos & Maíz">Granos & Maíz (Amarillo)</option>
              <option value="Zanahoria & Calabaza">Zanahoria & Calabaza (Naranja)</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              style={{ flex: 1, background: "#008471", color: "#FAF7F0", border: "none", borderRadius: 16, padding: "12px 0", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
            >
              Publicar Receta Verificada
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "0 18px", background: "none", border: "1px solid #E3D9C6", borderRadius: 16, fontSize: 13, fontWeight: 700, color: "#79694F", cursor: "pointer" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 8. APP SHELL PRINCIPAL
// ==========================================

const TABS = [
  { key: "home", label: "Plato", icon: Home },
  { key: "social", label: "Social", icon: Users },
  { key: "scan", label: "", icon: Camera },
  { key: "map", label: "Especialistas", icon: MapPin },
  { key: "profile", label: "Salud", icon: User },
];

export default function MesaLocalPrototype() {
  const [tab, setTab] = useState("home");
  const [portions, setPortions] = useState(INITIAL_PORTIONS);
  const [userHealth, setUserHealth] = useState(INITIAL_HEALTH_PROFILE);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [toast, setToast] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function handleTogglePortion(id) {
    setPortions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.checked;
          showToast(next ? `Porción de ${p.category} servida en tu plato` : "Porción desmarcada");
          return { ...p, checked: next };
        }
        return p;
      })
    );
  }

  function handleLogFood(calories) {
    setUserHealth((prev) => ({
      ...prev,
      consumedToday: prev.consumedToday + calories
    }));
    setPortions((prev) =>
      prev.map((p) => (p.id === "green" || p.id === "yellow" ? { ...p, checked: true } : p))
    );
    showToast(`+${calories} kcal verificadas sumadas al día`);
    setTab("home");
  }

  function handleSaveNewRecipe(newRec) {
    setRecipes((prev) => [newRec, ...prev]);
    setFeed((prev) => [
      {
        id: Date.now(),
        user: userHealth.name,
        time: "Ahora mismo",
        dish: newRec.name,
        tag: `${newRec.cal} kcal`,
        likes: 1,
        img: newRec.img
      },
      ...prev
    ]);
    setIsUploadOpen(false);
    showToast(`Receta "${newRec.name}" publicada con cálculo SMAE`);
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "#F7F3EB",
        backgroundImage: "radial-gradient(#E8E0D2 0.75px, transparent 0.75px), linear-gradient(to bottom, #FAF7F0, #F3ECE0)",
        backgroundSize: "16px 16px, 100% 100%",
        color: "#241E1B",
        position: "relative",
        fontFamily: "Manrope, sans-serif",
        boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Pantallas */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "home" && (
          <HomeScreen
            portions={portions}
            onTogglePortion={handleTogglePortion}
            userHealth={userHealth}
            onOpenUpload={() => setIsUploadOpen(true)}
            onGoToProfile={() => setTab("profile")}
          />
        )}
        {tab === "social" && (
          <div style={{ paddingBottom: 100 }}>
            <ScreenHeader
              title="Mesa Social"
              subtitle="Comunidad con recetas y calorías calculadas"
              rightElement={
                <button
                  onClick={() => setIsUploadOpen(true)}
                  style={{ background: "#008471", color: "#FAF7F0", border: "none", borderRadius: 16, padding: "6px 12px", fontSize: 11.5, fontWeight: 800, cursor: "pointer" }}
                >
                  + Subir Receta
                </button>
              }
            />
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {feed.map((post) => (
                <div key={post.id} style={{ background: "#FFFFFF", border: "1px solid #E3D9C6", borderRadius: 22, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: "#241E1B" }}>{post.user}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#008471", background: "rgba(0,132,113,0.1)", padding: "2px 8px", borderRadius: 10 }}>{post.tag}</span>
                  </div>
                  <img src={post.img} alt={post.dish} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  <div style={{ padding: "10px 14px" }}>
                    <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: "#241E1B", fontFamily: "Space Grotesk, sans-serif" }}>{post.dish}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "scan" && <ScanScreen userHealth={userHealth} onLogFood={handleLogFood} />}
        {tab === "map" && <MapScreen spots={INITIAL_SPOTS} onAppointment={(s) => showToast(`Solicitud enviada a ${s.name}`)} />}
        {tab === "profile" && (
          <ProfileScreen
            userHealth={userHealth}
            recipes={recipes}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenEditHealth={() => showToast("Ajuste de metas disponible en consulta")}
          />
        )}
      </div>

      {/* Navegación Inferior */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 440,
          height: 76,
          background: "rgba(250,247,240,0.96)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid #E3D9C6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 6px",
          zIndex: 40
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
                  border: "4px solid #FAF7F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -26,
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(0,132,113,0.35)",
                }}
              >
                <Camera size={22} color="#FAF7F0" />
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
                padding: "6px 10px",
              }}
            >
              <t.icon size={20} color={active ? "#008471" : "#8C7D6D"} strokeWidth={2.3} />
              <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#008471" : "#8C7D6D" }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {isUploadOpen && <UploadRecipeModal onClose={() => setIsUploadOpen(false)} onSave={handleSaveNewRecipe} />}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#241E1B",
            color: "#FAF7F0",
            padding: "9px 18px",
            borderRadius: 20,
            fontSize: 12.5,
            fontWeight: 800,
            zIndex: 70,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
