import React, { useState, useEffect, useRef } from "react";
import {
  Home, Users, MapPin, Camera, User, Plus, Heart,
  ChevronLeft, Check, Utensils, Calendar, Sparkles, X,
  MapPin as PinIcon
} from "lucide-react";
// Imagen del plato de cerámica artesanal extraída de tu fotografía
const ARTISAN_PLATE_IMG = "./artisan_plate_transparent.png";
const COMMUNAL_TABLE_IMG = "./communal_feast_table.png";
// Foto completa (el plato sobre el paisaje verde), usada como fondo de la tarjeta del plato
const PLATE_SCENE_IMG = "./plate_scenery_bg.jpg";
// Posición/tamaño reales del plato dentro de PLATE_SCENE_IMG, medidos sobre la foto (1170x1461px)
// -> se usan para alinear el overlay interactivo de porciones exactamente encima del plato real
const PLATE_IN_SCENE = { leftPct: 20.4, topPct: 25.1, sizePct: 60 };
// ==========================================
// 1. DATOS NUTRICIONALES SMAE & AMIGOS
// ==========================================
const INITIAL_HEALTH_PROFILE = {
  name: "Alma Ramírez",
  targetCalories: 1850, // Calculado con fórmula clínica Mifflin-St Jeor (64 kg, 162 cm, 28 años)
  consumedToday: 1120,
  healthGoal: "Control de glucosa & energía estable",
  conditions: ["Preferencia baja en sodio", "Ingredientes locales frescos"],
  formulaSource: "Ecuación Mifflin-St Jeor / Guías del Colegio Mexicano de Nutriólogos",
  weight: "64 kg",
  activity: "Moderada (4x semana)"
};
const VERIFIED_DISH = {
  name: "Bowl de Nopal Asado, Quinoa y Queso Menonita",
  calories: 390, // SMAE 5ª Ed: (19.5g prot × 4) + (35.2g carb × 4) + (19.8g líp × 9) = 390 kcal
  nutrientsDetailed: [
    {
      label: "Proteína",
      amount: "19.5g",
      caloriesPart: 78,
      level: "Alto Valor Biológico",
      color: "#008471",
      meaning: "Aporte combinado de quinoa, frijol bayo y queso menonita; brinda el 39% de tu requerimiento diario para reparación celular sin exceso de purinas."
    },
    {
      label: "Fibra Dietética",
      amount: "9.0g",
      caloriesPart: 18,
      level: "36% Valor Diario",
      color: "#D97724",
      meaning: "Mucílagos del nopal y fibra soluble del frijol bayo. Ayudan a que los carbohidratos se absorban gradualmente, estabilizando la glucosa en sangre."
    },
    {
      label: "Carbohidratos Complejos",
      amount: "35.2g",
      caloriesPart: 141,
      level: "Bajo Índice Glucémico",
      color: "#C45F3F",
      meaning: "Carbohidratos de grano entero de la quinoa y leguminosas. Sin azúcares añadidos, entregando energía limpia durante toda la tarde."
    },
    {
      label: "Lípidos / Grasas",
      amount: "19.8g",
      caloriesPart: 178,
      level: "Grasas Naturales",
      color: "#898E46",
      meaning: "Grasas lácteas de pastoreo del queso menonita y lípidos vegetales, indispensables para fijar vitaminas liposolubles (A, D, E y K)."
    }
  ],
  sourceRef: "SMAE 5.ª Edición (Fomento de Nutrición y Salud A.C.) e INCMNSZ",
  img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
};
const INITIAL_PORTIONS = [
  {
    id: "green",
    category: "Verduras & Nopal",
    portionGuide: "1 taza o 1 nopal entero (150g = ~24 kcal)",
    examples: "Nopal asado al comal, quelites, espinacas o acelga",
    colorActive: "rgba(0, 132, 113, 0.68)",
    strokeColor: "#008471",
    checked: true,
    pathD: "M 140 140 L 140 28 A 112 112 0 0 1 246.5 105.4 Z"
  },
  {
    id: "red",
    category: "Jitomate & Chiles",
    portionGuide: "1 jitomate o 3 chiles pasados (120g = ~30 kcal)",
    examples: "Chile pasado tostado, jitomate bola, pimientos",
    colorActive: "rgba(196, 95, 63, 0.68)",
    strokeColor: "#C45F3F",
    checked: true,
    pathD: "M 140 140 L 246.5 105.4 A 112 112 0 0 1 205.8 230.8 Z"
  },
  {
    id: "orange",
    category: "Zanahoria & Calabaza",
    portionGuide: "1 pieza mediana (100g = ~35 kcal)",
    examples: "Calabaza criolla de temporada, camote o zanahoria",
    colorActive: "rgba(217, 119, 36, 0.68)",
    strokeColor: "#D97724",
    checked: false,
    pathD: "M 140 140 L 205.8 230.8 A 112 112 0 0 1 74.2 230.8 Z"
  },
  {
    id: "yellow",
    category: "Granos & Maíz Criollo",
    portionGuide: "1/2 elote o 1/2 taza leguminosas (~110 kcal)",
    examples: "Elote asado, frijol bayo de la sierra o quinoa",
    colorActive: "rgba(209, 152, 31, 0.68)",
    strokeColor: "#D1981F",
    checked: true,
    pathD: "M 140 140 L 74.2 230.8 A 112 112 0 0 1 33.5 105.4 Z"
  },
  {
    id: "purple",
    category: "Cebolla Morada & Betabel",
    portionGuide: "1/2 taza picada (60g = ~22 kcal)",
    examples: "Cebolla morada curtida con limón, betabel o higos",
    colorActive: "rgba(124, 74, 130, 0.68)",
    strokeColor: "#7C4A82",
    checked: false,
    pathD: "M 140 140 L 33.5 105.4 A 112 112 0 0 1 140 28 Z"
  }
];
const INITIAL_FRIENDS = [
  {
    id: "vale",
    name: "Vale Reyes",
    color: "#008471",
    bio: "Le encanta improvisar cenas vegetarianas de comal y salsas tatemadas.",
    recipesCount: 9,
    favoriteDish: "Tacos de coliflor con piña asada",
    specialty: "Trae las tortillas de maíz criollo y agua fresca de jamaica"
  },
  {
    id: "diego",
    name: "Diego Ortiz",
    color: "#898E46",
    bio: "Siempre trae algo nuevo del tianguis los sábados. Fan de la quinoa y el queso menonita.",
    recipesCount: 6,
    favoriteDish: "Bowl de nopal tierno con quinoa",
    specialty: "Trae el queso menonita artesanal de Cuauhtémoc"
  },
  {
    id: "ana",
    name: "Ana Cortés",
    color: "#C45F3F",
    bio: "Anfitriona de las cenas de mesa colaborativas de los jueves en San Felipe.",
    recipesCount: 4,
    favoriteDish: "Cazuela de lentejas con chile chilaca",
    specialty: "Prepara el comal y pone la mesa"
  },
  {
    id: "luis",
    name: "Luis Morales",
    color: "#5B86B8",
    bio: "Fanático de la nuez pecana de Delicias, ensaladas frescas y sotol silvestre.",
    recipesCount: 5,
    favoriteDish: "Ensalada de manzana de Cuauhtémoc",
    specialty: "Trae las nueces pecanas y miel de abeja de la región"
  },
  {
    id: "mar",
    name: "Mar Valenzuela",
    color: "#C4628E",
    bio: "Cocinera tradicional experta en chile chilaca y tostadas horneadas.",
    recipesCount: 7,
    favoriteDish: "Tostadas de tinga de zanahoria y flor de jamaica",
    specialty: "Trae los frijoles bayos de olla y aguacates"
  }
];
const INITIAL_FEED = [
  {
    id: 1,
    user: "Vale Reyes",
    time: "hace 2 h",
    dish: "Tacos de coliflor asada al pastor con piña al comal (3 pzas)",
    tag: "350 kcal · SMAE",
    likes: 24,
    isLiked: false,
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80",
    comments: [{ user: "Diego", text: "¡Esa marinación se ve brutal! ¿Cuándo cocinamos juntos?" }]
  },
  {
    id: 2,
    user: "Diego Ortiz",
    time: "hace 4 h",
    dish: "Bowl de nopal asado al comal con quinoa y queso menonita",
    tag: "390 kcal · SMAE",
    likes: 42,
    isLiked: true,
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    comments: [{ user: "Vale", text: "El queso menonita le da un 10/10 asegurado 🙌" }]
  },
  {
    id: 3,
    user: "Ana Cortés",
    time: "ayer",
    dish: "Cazuela caldosa de lentejas y chile chilaca tatemado",
    tag: "265 kcal · SMAE",
    likes: 31,
    isLiked: false,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80",
    comments: [{ user: "Mar", text: "Sabor puro de rancho, riquísimo para la tarde." }]
  },
  {
    id: 4,
    user: "Luis Morales",
    time: "ayer",
    dish: "Ensalada de manzana criolla de Cuauhtémoc con nuez pecana",
    tag: "220 kcal · SMAE",
    likes: 19,
    isLiked: false,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    comments: [{ user: "Alma", text: "Grasas saludables y fibra perfecta 👏" }]
  },
  {
    id: 5,
    user: "Mar Valenzuela",
    time: "hace 2 días",
    dish: "Tostadas horneadas de tinga de zanahoria y flor de jamaica",
    tag: "280 kcal · SMAE",
    likes: 38,
    isLiked: false,
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    comments: [{ user: "Ana", text: "¡Vente el jueves a preparar de estas a la casa!" }]
  }
];
const INITIAL_SPOTS = [
  {
    id: 1,
    name: "Clínica de Nutrición San Felipe",
    category: "Nutriólogo",
    type: "Bioimpedancia InBody & Dieta Local",
    tag: "Evaluación corporal completa, índice metabólico y menú con insumos de Chihuahua",
    doctor: "LN. Mariana Terrazas (Céd. Prof. 892341)",
    dist: "A 1.2 km · Av. San Felipe 210",
    x: "28%", y: "42%",
    query: "Nutriologa San Felipe Chihuahua"
  },
  {
    id: 2,
    name: "Centro Nutricional Las Quintas",
    category: "Nutriólogo",
    type: "Nutrición Clínica & Glucosa",
    tag: "Control de resistencia a insulina, diabetes tipo 2 y nutrición deportiva",
    doctor: "Mtro. Rodrigo Corral (Céd. Prof. 774120)",
    dist: "A 2.5 km · Col. Las Quintas",
    x: "54%", y: "58%",
    query: "Nutricionista Las Quintas Chihuahua"
  },
  {
    id: 3,
    name: "Módulo DIF Municipal de Salud",
    category: "Nutriólogo",
    type: "Tamizaje Nutricional Gratuito",
    tag: "Evaluación antropométrica y orientación familiar del Plato del Buen Comer",
    doctor: "Equipo DIF Chihuahua",
    dist: "A 3.1 km · Av. Silvestre Terrazas",
    x: "72%", y: "30%",
    query: "DIF Municipal Chihuahua Nutricion"
  },
  {
    id: 4,
    name: "Chihuahua Local (Mercado)",
    category: "Mercados",
    type: "Tienda de productores",
    tag: "Miel pura de abeja, quesos menonitas sin conservadores y nuez de Delicias",
    doctor: null,
    dist: "A 800m · Zona Centro",
    x: "42%", y: "78%",
    query: "Chihuahua Local, Calle Guadalupe Victoria 100"
  },
  {
    id: 5,
    name: "Tianguis de Productores Locales",
    category: "Mercados",
    type: "Tianguis municipal",
    tag: "Hortalizas frescas, chiles pasados y fruta recién cortada de la huerta",
    doctor: null,
    dist: "A 1.4 km · Sede rotativa",
    x: "82%", y: "65%",
    query: "Tianguis de Productores Locales, Chihuahua"
  }
];
const INITIAL_RECIPES = [
  { name: "Ensalada de nopal asado con queso fresco", cal: 175, time: "15 min", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80", tag: "Verduras & Nopal", source: "SMAE: 175 kcal (10g prot, 14g carb, 10g gras)" },
  { name: "Sopa de lentejas con chile chilaca", cal: 265, time: "30 min", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80", tag: "Granos & Maíz", source: "SMAE: 265 kcal (15g prot, 39g carb, 6g gras)" }
];
// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
export default function MesaLocalPrototype() {
  const [tab, setTab] = useState("home");
  const [plateStyle, setPlateStyle] = useState("artisan_plate");
  const [portions, setPortions] = useState(INITIAL_PORTIONS);
  const [userHealth, setUserHealth] = useState(INITIAL_HEALTH_PROFILE);
  const [friends] = useState(INITIAL_FRIENDS);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [spots] = useState(INITIAL_SPOTS);
  const [selectedSpotId, setSelectedSpotId] = useState(1);
  const [mapFilter, setMapFilter] = useState("Nutriólogos");
  // Modales
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditHealthOpen, setIsEditHealthOpen] = useState(false);
  const [bookingFriend, setBookingFriend] = useState(null);
  const [toast, setToast] = useState("");
  // Cámara State
  const [scanStep, setScanStep] = useState("camera"); // camera -> scanning -> result
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    if (tab !== "scan" || scanStep !== "camera") {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      return;
    }
    let cancelled = false;
    setCameraError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then(stream => {
          if (cancelled) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
          if (!cancelled) setCameraError("Cámara no disponible en este dispositivo. Puedes usar la muestra en 1 clic.");
        });
    } else {
      setCameraError("Tu navegador no soporta acceso directo a cámara.");
    }
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [tab, scanStep]);
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }
  function handleTogglePortion(id) {
    setPortions(portions.map(p => {
      if (p.id === id) {
        const next = !p.checked;
        showToast(next ? `Porción de ${p.category} servida en tu plato` : "Porción desmarcada");
        return { ...p, checked: next };
      }
      return p;
    }));
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
    setTimeout(() => setScanStep("result"), 1200);
  }
  function handleCaptureMock() {
    setCapturedPhoto(VERIFIED_DISH.img);
    setScanStep("scanning");
    setTimeout(() => setScanStep("result"), 1000);
  }
  function handleLogFood(calories) {
    setUserHealth({
      ...userHealth,
      consumedToday: userHealth.consumedToday + calories
    });
    setPortions(portions.map(p => (p.id === "green" || p.id === "yellow" ? { ...p, checked: true } : p)));
    showToast(`+${calories} kcal sumadas a tu día 🥗`);
    setScanStep("camera");
    setTab("home");
  }
  function handleToggleLike(id) {
    setFeed(feed.map(post => {
      if (post.id === id) {
        const isLiked = !post.isLiked;
        showToast(isLiked ? "¡Te gustó esta receta! ❤️" : "Ya no te gusta");
        return { ...post, isLiked, likes: post.likes + (isLiked ? 1 : -1) };
      }
      return post;
    }));
  }
  function handleSaveRecipe(newRec) {
    setRecipes([newRec, ...recipes]);
    setFeed([{
      id: Date.now(),
      user: userHealth.name,
      time: "Ahora mismo",
      dish: newRec.name,
      tag: `${newRec.cal} kcal · SMAE`,
      likes: 1,
      isLiked: false,
      img: newRec.img,
      comments: []
    }, ...feed]);
    setIsUploadOpen(false);
    showToast(`Receta "${newRec.name}" publicada con éxito`);
  }
  const filledCount = portions.filter(p => p.checked).length;
  const calRemaining = userHealth.targetCalories - userHealth.consumedToday;
  const currentPlateImg = plateStyle === "artisan_plate" ? ARTISAN_PLATE_IMG : COMMUNAL_TABLE_IMG;
  const filteredSpots = spots.filter(s => {
    if (mapFilter === "Todos") return true;
    if (mapFilter === "Nutriólogos") return s.category === "Nutriólogo";
    if (mapFilter === "Mercados") return s.category === "Mercados";
    return true;
  });
  const activeSpot = spots.find(s => s.id === selectedSpotId) || spots[0];
  return (
    <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", minHeight: "100vh", backgroundColor: "#0E5C46", color: "#241E1B", fontFamily: "Manrope, sans-serif", position: "relative", boxShadow: "0 25px 70px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,500;1,9..144,600&family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      {/* Cenefa decorativa */}
      <div style={{ height: 8, width: "100%", background: "#0E5C46", display: "flex", justifyContent: "space-around", overflow: "hidden", opacity: 0.7 }}>
        <span style={{ fontSize: 8, color: "#F0C48F", letterSpacing: 4 }}>▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼</span>
      </div>
      {/* Header General */}
      <header style={{ padding: "20px 20px 46px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#0E5C46" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 13, background: "#F7F1E6", color: "#0E5C46", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, fontFamily: "Fraunces, serif", transform: "rotate(-6deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }}>
            ML
          </div>
          <div>
            <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: 9, display: "block", color: "#F0C48F", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 3 }}>Nutrición · Comunidad</span>
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 800, fontSize: 26, display: "block", lineHeight: 0.95, color: "#FBEEE0", letterSpacing: "-0.01em" }}>Mesa <em style={{ fontStyle: "italic", fontWeight: 500, color: "#F0C48F" }}>Local</em></span>
            <span style={{ fontSize: 10.5, color: "rgba(251,238,224,0.65)", fontWeight: 600, letterSpacing: "0.03em" }}>Chihuahua, Chih.</span>
          </div>
        </div>
        <button onClick={() => setTab("profile")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 12, background: "#F7F1E6", border: "none", fontSize: 11, fontWeight: 800, color: "#0E5C46", cursor: "pointer", transform: "rotate(2deg)", boxShadow: "0 6px 14px rgba(0,0,0,0.18)", fontFamily: "Space Mono, monospace" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0E5C46" }} />
          <span>{userHealth.consumedToday} / {userHealth.targetCalories} kcal</span>
        </button>
      </header>
      {/* VISTAS PRINCIPALES */}
      <div style={{ flex: 1, overflowY: "auto", background: "#F7F1E6", borderRadius: "26px 26px 0 0", marginTop: -16, position: "relative", boxShadow: "0 -6px 18px rgba(20, 36, 32,0.12)" }}>
        {/* 1. PANTALLA: INICIO (HOME) */}
        {tab === "home" && (
          <div style={{ paddingBottom: 110, paddingTop: 14 }}>
            <div style={{ padding: "16px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, fontWeight: 700, color: "#8A9E8C", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Hoy en tu mesa</span>
                <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 32, fontWeight: 800, margin: 0, color: "#142420", letterSpacing: "-0.02em", lineHeight: 1 }}>Tu Mesa & Salud</h1>
                <p style={{ margin: "8px 0 0", fontSize: 12, color: "#8A7259", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Meta: <strong style={{ color: "#142420", fontStyle: "normal" }}>{userHealth.healthGoal}</strong></p>
              </div>
              <button onClick={() => setIsUploadOpen(true)} style={{ background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: "20px 20px 4px 20px", padding: "9px 15px", fontSize: 11.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 6px 14px rgba(14, 92, 70,0.3)", flexShrink: 0, marginLeft: 10 }}>
                <Plus size={14} /> Subir Receta
              </button>
            </div>
            {/* Presupuesto calórico */}
            <div style={{ margin: "0 20px 20px", background: "#FFFFFF", border: "1px solid #EEE1CC", borderRadius: 24, padding: "20px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11.5, marginBottom: 10 }}>
                <span style={{ fontWeight: 800, color: "#142420", textTransform: "uppercase", fontSize: 10.5, letterSpacing: "0.06em" }}>Presupuesto Calórico Diario</span>
                <span style={{ fontWeight: 700, color: "#008471", fontFamily: "Space Mono, monospace", fontSize: 13 }}>{userHealth.consumedToday} / {userHealth.targetCalories} kcal</span>
              </div>
              <div style={{ height: 10, background: "#F0E6D2", borderRadius: 10, overflow: "hidden", margin: "8px 0" }}>
                <div style={{ width: `${Math.min((userHealth.consumedToday / userHealth.targetCalories) * 100, 100)}%`, height: "100%", background: "#008471", borderRadius: 10 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A7259", marginTop: 4 }}>
                <span>Restante hoy: <strong style={{ color: "#142420" }}>{calRemaining} kcal</strong></span>
                <button onClick={() => setTab("profile")} style={{ background: "none", border: "none", color: "#0E5C46", fontWeight: 800, cursor: "pointer", fontSize: 11 }}>Ajustar meta ↗</button>
              </div>
            </div>
            {/* EL PLATO CENTRAL CON LA IMAGEN REAL DE CERÁMICA */}
            <div style={{ margin: "0 20px 26px", background: "#142420", border: "none", borderRadius: "36px 36px 36px 10px", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 6, background: "rgba(251,238,224,0.12)", padding: 3, borderRadius: 12 }}>
                  <button onClick={() => setPlateStyle("artisan_plate")} style={{ border: "none", background: plateStyle === "artisan_plate" ? "#0E5C46" : "transparent", color: plateStyle === "artisan_plate" ? "#FBEEE0" : "rgba(251,238,224,0.6)", fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 8, cursor: "pointer" }}>
                    Plato de Barro
                  </button>
                  <button onClick={() => setPlateStyle("communal_table")} style={{ border: "none", background: plateStyle === "communal_table" ? "#0E5C46" : "transparent", color: plateStyle === "communal_table" ? "#FBEEE0" : "rgba(251,238,224,0.6)", fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 8, cursor: "pointer" }}>
                    Mesa Comunal
                  </button>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#F0C48F" }}>{filledCount} de 5 porciones</span>
              </div>
              {/* Centro: Foto completa del plato en el paisaje verde, con el overlay de porciones alineado sobre el plato real */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px 0" }}>
                <div style={{ width: "100%", position: "relative", aspectRatio: "1170 / 1461", borderRadius: 22, overflow: "hidden", boxShadow: "0 16px 36px rgba(45,35,25,0.22)" }}>

                  {/* Fotografía completa: plato + fondo verde */}
                  <img
                    src={PLATE_SCENE_IMG}
                    alt="Plato de barro sobre el paisaje"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  {/* Overlay de porciones, alineado exactamente sobre el plato dentro de la foto */}
                  <div style={{ position: "absolute", left: `${PLATE_IN_SCENE.leftPct}%`, top: `${PLATE_IN_SCENE.topPct}%`, width: `${PLATE_IN_SCENE.sizePct}%`, aspectRatio: "1 / 1" }}>
                    <svg width="100%" height="100%" viewBox="0 0 280 280" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply" }}>
                      {portions.map(p => (
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
                    {/* Sello de Autor en el centro */}
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 20, pointerEvents: "none", background: "rgba(20, 36, 32,0.85)", padding: "4px 10px", borderRadius: 14, border: "1px solid rgba(251,238,224,0.3)", textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#FBEEE0", display: "block" }}>{filledCount}/5</span>
                      <span style={{ fontSize: 8.5, fontWeight: 800, color: "#F0C48F", textTransform: "uppercase" }}>Porciones</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "rgba(251,238,224,0.65)", marginTop: 8, fontWeight: 600 }}>Toca una sección para aplicar el esmalte de tu porción</p>
              </div>
              {/* Desglose de medidas y gramajes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8, paddingTop: 10, borderTop: "1px solid rgba(251,238,224,0.15)" }}>
                {portions.map(p => (
                  <div key={p.id} onClick={() => handleTogglePortion(p.id)} style={{ padding: "10px 12px", borderRadius: 16, border: "1px solid " + (p.checked ? p.strokeColor : "rgba(251,238,224,0.18)"), background: p.checked ? "rgba(251,238,224,0.08)" : "rgba(251,238,224,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: p.strokeColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                        {p.checked ? "✓" : "+"}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#FBEEE0" }}>{p.category}</h4>
                        <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "rgba(251,238,224,0.55)" }}><strong style={{ color: "rgba(251,238,224,0.85)" }}>{p.portionGuide}</strong> · {p.examples}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, background: p.checked ? p.strokeColor : "rgba(251,238,224,0.08)", color: p.checked ? "#FBEEE0" : "rgba(251,238,224,0.5)" }}>
                      {p.checked ? "Listo" : "Falta"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Franja: Cenas con Amigos */}
            <div style={{ margin: "0 0 30px" }}>
              <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, fontFamily: "Fraunces, serif", color: "#142420" }}>Cenas con Amigos</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#8A7259" }}>Toca a un amigo para planear comida juntos</p>
                </div>
                <button onClick={() => setBookingFriend(friends[0])} style={{ background: "none", border: "none", color: "#0E5C46", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "Fraunces, serif", fontStyle: "italic" }}>
                  Planear Cena 🍽️
                </button>
              </div>
              <div style={{ display: "flex", gap: 14, padding: "0 20px", overflowX: "auto" }}>
                {friends.map((f, i) => (
                  <div key={f.id} onClick={() => setBookingFriend(f)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer", transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 26, background: f.color, padding: 0, boxShadow: `0 8px 16px ${f.color}55` }}>
                      <div style={{ width: "100%", height: "100%", borderRadius: 26, backgroundColor: f.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#FBEEE0", fontWeight: 800, fontSize: 18, fontFamily: "Fraunces, serif" }}>
                        {f.name[0]}
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, color: "#5A4B3D", fontWeight: 700 }}>{f.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* 2. PANTALLA: CÁMARA ACTIVA Y ESCÁNER COMPLETO */}
        {tab === "scan" && (
          <div style={{ paddingBottom: 100, background: scanStep === "result" ? "transparent" : "#142420" }}>
            {scanStep === "camera" && (
              <div style={{ minHeight: "82vh", background: "#142420", color: "#FBEEE0", display: "flex", flexDirection: "column", padding: "24px 20px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, fontWeight: 700, color: "#F0C48F", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Paso 1 de 3</span>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, fontFamily: "Fraunces, serif", letterSpacing: "-0.01em" }}>Escanear Plato</h1>
                    <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "rgba(251,238,224,0.55)", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Enfoca tu comida para reconocer nutrientes y calorías</p>
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 800, background: "#0E5C46", color: "#FBEEE0", padding: "4px 9px", borderRadius: "10px 10px 10px 2px", flexShrink: 0, marginLeft: 8 }}>Cámara Activa</span>
                </div>
                <div style={{ flex: 1, borderRadius: 24, overflow: "hidden", background: "#000", position: "relative", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!cameraError ? (
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ padding: 20, textAlign: "center" }}>
                      <Camera size={36} color="#F0C48F" style={{ margin: "0 auto 10px" }} />
                      <p style={{ fontSize: 12, color: "rgba(251,238,224,0.6)", margin: "0 0 14px" }}>{cameraError}</p>
                      <button onClick={handleCaptureMock} style={{ background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 14, padding: "8px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                        Probar con Muestra de Nopal y Quinoa
                      </button>
                    </div>
                  )}
                  <div style={{ position: "absolute", inset: 20, border: "2px dashed rgba(240,196,143,0.7)", borderRadius: 18, pointerEvents: "none" }} />
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, paddingTop: 18 }}>
                  <button onClick={handleCaptureMock} style={{ background: "none", border: "none", color: "rgba(251,238,224,0.6)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Muestra</button>
                  <button onClick={handleCapture} style={{ width: 66, height: 66, borderRadius: "50%", background: "#FBEEE0", border: "5px solid #0E5C46", cursor: "pointer" }} />
                  <button onClick={handleCaptureMock} style={{ background: "none", border: "none", color: "rgba(251,238,224,0.6)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Galería</button>
                </div>
              </div>
            )}
            {scanStep === "scanning" && (
              <div style={{ minHeight: "80vh", background: "#142420", color: "#FBEEE0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "4px solid #0E5C46", borderTopColor: "transparent", animation: "spin 0.9s linear infinite", marginBottom: 14 }} />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, fontFamily: "Fraunces, serif" }}>Analizando componentes…</h3>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(251,238,224,0.6)" }}>Verificando ingredientes con la base de datos SMAE</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {scanStep === "result" && (
              <div style={{ padding: "0 20px" }}>
                <div style={{ padding: "14px 0 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => setScanStep("camera")} style={{ background: "none", border: "none", color: "#0E5C46", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <ChevronLeft size={16} /> Tomar otra foto
                  </button>
                  <span style={{ fontSize: 10, fontWeight: 800, background: "#0E5C46", color: "#FBEEE0", padding: "3px 8px", borderRadius: 8 }}>Validado SMAE</span>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1px solid #EEE1CC", overflow: "hidden" }}>
                  <div style={{ height: 165, position: "relative" }}>
                    <img src={capturedPhoto || VERIFIED_DISH.img} alt={VERIFIED_DISH.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(20, 36, 32,0.8)", color: "#FBEEE0", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, fontFamily: "Fraunces, serif" }}>
                      {VERIFIED_DISH.name}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ background: "#142420", borderRadius: "18px 18px 18px 4px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#F0C48F", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" }}>Aporte Energético Real</span>
                        <span style={{ fontSize: 24, fontWeight: 700, color: "#FBEEE0", fontFamily: "Space Mono, monospace", display: "block", marginTop: 2 }}>{VERIFIED_DISH.calories} kcal</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 11, color: "rgba(251,238,224,0.6)", display: "block" }}>Impacto en tu Presupuesto</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#FBEEE0" }}>21% de tus {userHealth.targetCalories} kcal</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 10.5, color: "#8A7259", margin: "0 0 12px", fontWeight: 600 }}>
                      ⚖️ <strong>Cálculo Atwater verificado:</strong> (19.5g prot × 4) + (35.2g carb × 4) + (19.8g líp × 9) = <strong>390 kcal</strong>.
                    </p>
                    <h4 style={{ fontSize: 11, fontWeight: 800, color: "#8A7259", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
                      ¿Qué significa esto para tu cuerpo?
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {VERIFIED_DISH.nutrientsDetailed.map(n => (
                        <div key={n.label} style={{ background: "#FAF7F0", border: "1px solid #EEE1CC", borderRadius: 16, padding: "10px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: n.color }}>{n.label}: {n.amount}</span>
                            <span style={{ fontSize: 10, fontWeight: 800, background: n.color, color: "#FAF7F0", padding: "2px 8px", borderRadius: 10 }}>{n.level}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 11, color: "#5A5347", lineHeight: 1.4, fontWeight: 500 }}>{n.meaning}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 12, background: "#F4EFE6", border: "1px solid #EEE1CC", fontSize: 10.5, color: "#5A5347" }}>
                      📚 <strong>Fuente clínica:</strong> {VERIFIED_DISH.sourceRef} (Págs. 142, 218).
                    </div>
                    <button onClick={() => handleLogFood(VERIFIED_DISH.calories)} style={{ width: "100%", marginTop: 14, background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 16, padding: "12px 0", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                      Registrar este platillo (+{VERIFIED_DISH.calories} kcal)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* 3. PANTALLA: MAPA & WIDGET VISUAL */}
        {tab === "map" && (
          <div style={{ paddingBottom: 100 }}>
            <div style={{ padding: "22px 20px 16px" }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, fontWeight: 700, color: "#0E5C46", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Cerca de ti</span>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, fontFamily: "Fraunces, serif", color: "#142420", letterSpacing: "-0.02em" }}>Especialistas & Mapa</h1>
              <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#8A7259", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Nutriólogos certificados y mercados de Chihuahua</p>
            </div>
            {/* Filtros */}
            <div style={{ display: "flex", gap: 8, padding: "0 20px 10px" }}>
              {["Nutriólogos", "Mercados", "Todos"].map(f => (
                <button key={f} onClick={() => setMapFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: mapFilter === f ? "#0E5C46" : "#FFFFFF", color: mapFilter === f ? "#FBEEE0" : "#5A5347", fontSize: 11.5, fontWeight: 800, cursor: "pointer", boxShadow: mapFilter === f ? "0 4px 10px rgba(14, 92, 70,0.3)" : "0 1px 3px rgba(20, 36, 32,0.08)" }}>
                  {f}
                </button>
              ))}
            </div>
            {/* WIDGET DE MAPA VECTORIAL INTERACTIVO */}
            <div style={{ margin: "0 20px 14px", borderRadius: 24, overflow: "hidden", height: 190, position: "relative", background: "#142420" }}>
              <svg width="100%" height="100%" viewBox="0 0 340 190" preserveAspectRatio="none" style={{ opacity: 0.8 }}>
                <rect width="340" height="190" fill="#142420" />
                <path d="M-10 40 Q 120 70 350 45" stroke="#245244" strokeWidth="12" fill="none" />
                <path d="M-10 140 Q 180 110 350 135" stroke="#245244" strokeWidth="16" fill="none" />
                <path d="M80 -10 Q 110 90 95 200" stroke="#245244" strokeWidth="10" fill="none" />
                <path d="M260 -10 Q 240 100 255 200" stroke="#245244" strokeWidth="10" fill="none" />
                <circle cx="95" cy="55" r="45" fill="#7C4A82" opacity="0.35" />
                <circle cx="270" cy="130" r="38" fill="#D1981F" opacity="0.3" />
              </svg>
              {/* Pines interactivos */}
              {spots.map(s => {
                const isSelected = s.id === selectedSpotId;
                return (
                  <div key={s.id} onClick={() => setSelectedSpotId(s.id)} style={{ position: "absolute", left: s.x, top: s.y, transform: isSelected ? "scale(1.25) translate(-50%, -50%)" : "translate(-50%, -50%)", cursor: "pointer", zIndex: isSelected ? 20 : 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 12, background: isSelected ? "#0E5C46" : (s.category === "Nutriólogo" ? "#008471" : "#D97724"), display: "flex", alignItems: "center", justifyContent: "center", color: "#FBEEE0", border: "2px solid #FBEEE0", boxShadow: "0 4px 12px rgba(0,0,0,0.35)" }}>
                      <PinIcon size={16} />
                    </div>
                  </div>
                );
              })}
              {/* Tarjeta flotante */}
              <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, background: "rgba(251,238,224,0.96)", backdropFilter: "blur(6px)", borderRadius: 16, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 30 }}>
                <div style={{ minWidth: 0, paddingRight: 8 }}>
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: 12.5, color: "#142420", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activeSpot.name}</h4>
                  <p style={{ margin: 0, fontSize: 10.5, color: "#8A7259", fontWeight: 600 }}>{activeSpot.doctor || activeSpot.type} · {activeSpot.dist}</p>
                </div>
                <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeSpot.query + ", Chihuahua")}`, "_blank")} style={{ background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 10, padding: "6px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
                  Ir ↗
                </button>
              </div>
            </div>
            {/* Lista detallada */}
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredSpots.map(s => (
                <div key={s.id} onClick={() => setSelectedSpotId(s.id)} style={{ background: "#FFFFFF", border: "1px solid " + (s.id === selectedSpotId ? "#0E5C46" : "#EEE1CC"), borderRadius: 20, padding: 14, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, background: s.category === "Nutriólogo" ? "#008471" : "#D97724", color: "#FBEEE0" }}>
                        {s.type}
                      </span>
                      <h4 style={{ margin: "6px 0 2px", fontSize: 14, fontWeight: 800, color: "#142420", fontFamily: "Fraunces, serif" }}>{s.name}</h4>
                      {s.doctor && <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: "#008471" }}>{s.doctor}</p>}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#8A7259" }}>{s.dist}</span>
                  </div>
                  <p style={{ margin: "8px 0 10px", fontSize: 11.5, color: "#5A5347", lineHeight: 1.4, background: "#FAF7F0", padding: "8px 12px", borderRadius: 12, border: "1px solid #EEE1CC" }}>{s.tag}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {s.category === "Nutriólogo" && (
                      <button onClick={(e) => { e.stopPropagation(); showToast(`Solicitud enviada a ${s.name}... Se comunicarán contigo`); }} style={{ flex: 1, background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 12, padding: "8px 0", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                        Agendar Evaluación de Dieta
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.query + ", Chihuahua")}`, "_blank"); }} style={{ padding: "8px 12px", background: "#FFFFFF", border: "1px solid #EEE1CC", color: "#8A7259", borderRadius: 12, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                      Ver mapa ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 4. PANTALLA: MESA SOCIAL */}
        {tab === "social" && (
          <div style={{ paddingBottom: 100 }}>
            <div style={{ padding: "22px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, fontWeight: 700, color: "#0E5C46", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>El feed de hoy</span>
                <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, fontFamily: "Fraunces, serif", color: "#142420", letterSpacing: "-0.02em" }}>Mesa Social</h1>
                <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#8A7259", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Lo que tus amigos de Chihuahua están cocinando hoy</p>
              </div>
              <button onClick={() => setIsUploadOpen(true)} style={{ background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: "16px 16px 4px 16px", padding: "7px 13px", fontSize: 11.5, fontWeight: 800, cursor: "pointer", flexShrink: 0, marginLeft: 8 }}>
                + Nueva Receta
              </button>
            </div>
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {feed.map((post, i) => {
                const accent = ["#008471", "#C45F3F", "#D97724", "#D1981F", "#7C4A82"][i % 5];
                return (
                <article key={post.id} style={{ background: "#FFFFFF", border: "1px solid #EEE1CC", borderRadius: 24, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div onClick={() => setBookingFriend(friends.find(f => f.name.includes(post.user)) || friends[0])} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: accent, color: "#FBEEE0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, fontFamily: "Fraunces, serif" }}>
                        {post.user[0]}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: "#142420" }}>{post.user}</h4>
                        <span style={{ fontSize: 10, color: "#8A7259" }}>{post.time}</span>
                      </div>
                    </div>
                    <button onClick={() => setBookingFriend(friends.find(f => f.name.includes(post.user)) || friends[0])} style={{ background: "#0E5C46", border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 10.5, fontWeight: 800, color: "#FBEEE0", cursor: "pointer" }}>
                      Planear Cena 🍽️
                    </button>
                  </div>
                  <img src={post.img} alt={post.dish} style={{ width: "100%", height: 175, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#142420", fontFamily: "Fraunces, serif" }}>{post.dish}</h4>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#FBEEE0", background: accent, padding: "3px 9px", borderRadius: 8 }}>{post.tag}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EEE1CC", paddingTop: 8 }}>
                      <button onClick={() => handleToggleLike(post.id)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: post.isLiked ? "#C45F3F" : "#8A7259", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>
                        <Heart size={16} color={post.isLiked ? "#C45F3F" : "#8A7259"} fill={post.isLiked ? "#C45F3F" : "none"} />
                        <span>{post.likes}</span>
                      </button>
                      <span style={{ fontSize: 11, color: "#8A7259" }}>{post.comments ? post.comments.length : 0} comentarios</span>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </div>
        )}
        {/* 5. PANTALLA: PERFIL METABÓLICO */}
        {tab === "profile" && (
          <div style={{ paddingBottom: 100 }}>
            <div style={{ padding: "22px 20px 16px" }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, fontWeight: 700, color: "#0E5C46", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Tu balance</span>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, fontFamily: "Fraunces, serif", color: "#142420", letterSpacing: "-0.02em" }}>Perfil Metabólico</h1>
              <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#8A7259", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Cálculo calórico basal y recetas creadas por ti</p>
            </div>
            <div style={{ margin: "0 20px 16px", background: "#142420", border: "none", borderRadius: 24, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid rgba(251,238,224,0.15)" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#FBEEE0", fontFamily: "Fraunces, serif" }}>{userHealth.name}</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F0C48F" }}>{userHealth.healthGoal}</span>
                </div>
                <button onClick={() => setIsEditHealthOpen(true)} style={{ background: "#0E5C46", border: "none", borderRadius: 14, padding: "6px 12px", fontSize: 11, fontWeight: 800, color: "#FBEEE0", cursor: "pointer" }}>
                  Ajustar Metas
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
                <div style={{ background: "rgba(251,238,224,0.08)", padding: "12px 12px", borderRadius: "14px 14px 14px 3px" }}>
                  <span style={{ fontSize: 9.5, color: "rgba(251,238,224,0.55)", fontWeight: 700, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gasto Energético Diario</span>
                  <strong style={{ fontSize: 22, color: "#FBEEE0", fontFamily: "Space Mono, monospace", display: "block", marginTop: 3 }}>{userHealth.targetCalories} <span style={{ fontSize: 11 }}>kcal</span></strong>
                  <span style={{ fontSize: 9.5, color: "rgba(251,238,224,0.5)", display: "block", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Mifflin-St Jeor</span>
                </div>
                <div style={{ background: "rgba(251,238,224,0.08)", padding: "12px 12px", borderRadius: "14px 14px 3px 14px" }}>
                  <span style={{ fontSize: 9.5, color: "rgba(251,238,224,0.55)", fontWeight: 700, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Consumo Registrado</span>
                  <strong style={{ fontSize: 22, color: "#7FC9AE", fontFamily: "Space Mono, monospace", display: "block", marginTop: 3 }}>{userHealth.consumedToday} <span style={{ fontSize: 11 }}>kcal</span></strong>
                  <span style={{ fontSize: 9.5, color: "#7FC9AE", fontWeight: 700, display: "block" }}>{Math.round((userHealth.consumedToday / userHealth.targetCalories) * 100)}% alcanzado</span>
                </div>
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 12, background: "rgba(251,238,224,0.08)", fontSize: 10, color: "rgba(251,238,224,0.7)", marginBottom: 12 }}>
                <strong style={{ color: "#F0C48F" }}>Validación clínica:</strong> BMR = (10 × 64kg) + (6.25 × 162cm) - (5 × 28a) - 161 = 1,351 kcal × 1.375 = <strong style={{ color: "#FBEEE0" }}>1,858 kcal/día</strong>.
              </div>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "rgba(251,238,224,0.55)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Preferencias Nutricionales</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {userHealth.conditions.map(c => (
                    <span key={c} style={{ fontSize: 11, fontWeight: 600, background: "rgba(251,238,224,0.1)", padding: "4px 10px", borderRadius: 10, color: "#FBEEE0" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Recetas de Alma */}
            <div style={{ padding: "0 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 800, color: "#142420", fontFamily: "Fraunces, serif" }}>
                  Mis Recetas con Cálculo SMAE ({recipes.length})
                </h3>
                <button onClick={() => setIsUploadOpen(true)} style={{ background: "none", border: "none", color: "#0E5C46", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                  + Subir Receta
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recipes.map((r, i) => {
                  const accent = ["#D97724", "#D1981F"][i % 2];
                  return (
                  <div key={r.name} style={{ background: "#FFFFFF", border: "1px solid #EEE1CC", borderRadius: 18, padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                      <img src={r.img} alt={r.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: "#142420" }}>{r.name}</h4>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#008471", fontWeight: 700 }}>{r.cal} kcal por porción · {r.time}</p>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 800, background: accent, color: "#FBEEE0", padding: "3px 9px", borderRadius: 8 }}>{r.tag}</span>
                    </div>
                    {r.source && (
                      <span style={{ fontSize: 9.5, color: "#8A7259", display: "block", background: "#FAF7F0", padding: "4px 8px", borderRadius: 8, border: "1px solid #EEE1CC" }}>
                        {r.source}
                      </span>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, height: 76, background: "rgba(20, 36, 32,0.97)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6px", zIndex: 40 }}>
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
              <button key={t.key} onClick={() => setTab("scan")} style={{ width: 56, height: 56, borderRadius: "50%", background: "#0E5C46", border: "4px solid #142420", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -26, cursor: "pointer", boxShadow: "0 6px 16px rgba(14, 92, 70,0.5)" }}>
                <Camera size={22} color="#FBEEE0" />
              </button>
            );
          }
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "6px 10px" }}>
              <t.icon size={20} color={active ? "#F0C48F" : "rgba(251,238,224,0.4)"} strokeWidth={2.3} />
              <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#F0C48F" : "rgba(251,238,224,0.4)" }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
      {/* MODAL: PLANEAR CENA CON AMIGO */}
      {bookingFriend && (
        <div onClick={() => setBookingFriend(null)} style={{ position: "fixed", inset: 0, background: "rgba(20, 36, 32,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "88%", background: "#F7F1E6", borderRadius: "28px 28px 0 0", padding: "20px 22px 28px", overflowY: "auto" }}>
            <div style={{ width: 38, height: 4, borderRadius: 4, background: "#DDCBAF", margin: "0 auto 14px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #EEE1CC" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: bookingFriend.color || "#008471", color: "#FBEEE0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, fontFamily: "Fraunces, serif" }}>
                {bookingFriend.name[0]}
              </div>
              <div>
                <h3 style={{ margin: 0, fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 800, color: "#142420" }}>
                  Planear Cena con {bookingFriend.name}
                </h3>
                <p style={{ margin: 0, fontSize: 11.5, color: "#8A7259" }}>{bookingFriend.recipesCount || 6} recetas en la comunidad</p>
              </div>
            </div>
            <div style={{ background: "#FFFFFF", padding: 12, borderRadius: 16, border: "1px solid #EEE1CC", marginBottom: 14, fontSize: 12 }}>
              <strong style={{ color: "#008471", display: "block" }}>Platillo estrella de {bookingFriend.name}:</strong>
              <p style={{ margin: "2px 0 6px", color: "#142420", fontWeight: 600 }}>"{bookingFriend.favoriteDish}"</p>
              <span style={{ fontSize: 11, color: "#8A7259" }}>🤝 {bookingFriend.specialty}</span>
            </div>
            <button onClick={() => { setBookingFriend(null); showToast(`🎟️ ¡Cena agendada con ${bookingFriend.name}!`); }} style={{ width: "100%", background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 16, padding: "12px 0", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              Confirmar y Enviar Invitación 🎟️
            </button>
          </div>
        </div>
      )}
      {/* MODAL: SUBIR RECETA */}
      {isUploadOpen && (
        <div onClick={() => setIsUploadOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(20, 36, 32,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "85%", background: "#F7F1E6", borderRadius: "28px 28px 0 0", padding: "20px 22px 28px", overflowY: "auto" }}>
            <div style={{ width: 38, height: 4, borderRadius: 4, background: "#DDCBAF", margin: "0 auto 14px" }} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 800, color: "#142420", margin: "0 0 4px" }}>Subir Nueva Receta</h3>
            <p style={{ fontSize: 12, color: "#8A7259", margin: "0 0 16px" }}>Ingresa ingredientes para calcular su aporte calórico real según el SMAE.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value.trim();
              const cal = Number(e.target.cal.value) || 320;
              const time = e.target.time.value.trim() || "25 min";
              const tag = e.target.tag.value;
              if (!name) return;
              handleSaveRecipe({ name, cal, time, tag, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80", source: `Cálculo clínico SMAE: ${cal} kcal` });
            }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input name="name" placeholder="Nombre de la receta" required style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #EEE1CC", background: "#FFFFFF", fontSize: 13 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input name="cal" type="number" placeholder="Calorías (ej. 320)" style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #EEE1CC", background: "#FFFFFF", fontSize: 13 }} />
                <input name="time" placeholder="Tiempo (ej. 25 min)" style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #EEE1CC", background: "#FFFFFF", fontSize: 13 }} />
              </div>
              <select name="tag" style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #EEE1CC", background: "#FFFFFF", fontSize: 13 }}>
                <option value="Verduras & Nopal">Verduras & Nopal (Verde)</option>
                <option value="Jitomate & Chiles">Jitomate & Chiles (Rojo)</option>
                <option value="Granos & Maíz">Granos & Maíz (Amarillo)</option>
              </select>
              <button type="submit" style={{ width: "100%", background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 16, padding: "12px 0", fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 6 }}>
                Publicar Receta Verificada
              </button>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: AJUSTAR METAS DE SALUD */}
      {isEditHealthOpen && (
        <div onClick={() => setIsEditHealthOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(20, 36, 32,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#F7F1E6", borderRadius: "28px 28px 0 0", padding: "20px 22px 28px" }}>
            <div style={{ width: 38, height: 4, borderRadius: 4, background: "#DDCBAF", margin: "0 auto 14px" }} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 800, color: "#142420", margin: "0 0 4px" }}>Ajustar Metas de Salud</h3>
            <p style={{ fontSize: 12, color: "#8A7259", margin: "0 0 16px" }}>Calculados con la fórmula Mifflin-St Jeor según tu peso y actividad.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="number" defaultValue={userHealth.targetCalories} id="edit-cal" style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1px solid #EEE1CC", background: "#FFFFFF", fontSize: 13 }} />
              <button onClick={() => {
                const val = Number(document.getElementById("edit-cal")?.value) || 1850;
                setUserHealth({ ...userHealth, targetCalories: val });
                setIsEditHealthOpen(false);
                showToast("Metas calóricas actualizadas correctamente ✅");
              }} style={{ width: "100%", background: "#0E5C46", color: "#FBEEE0", border: "none", borderRadius: 16, padding: "12px 0", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 92, left: "50%", transform: "translateX(-50%)", background: "#142420", color: "#FBEEE0", padding: "9px 18px", borderRadius: 20, fontSize: 12.5, fontWeight: 800, zIndex: 70, whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(0,0,0,0.35)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
