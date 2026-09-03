import React, { useState, useEffect, useRef } from "react";
import {
  Home, Users, MapPin, Camera, User, Plus, Heart,
  MessageCircle, Share2, ChevronLeft, Check, Search,
  Leaf, Zap, Wheat, Droplet, ChevronRight, Calendar, Star,
  Bookmark, Send, Sparkles, X, Flame, RefreshCw, Upload,
  Sun, Carrot, Utensils, Soup, Compass, Award, ArrowUpRight
} from "lucide-react";

// ==========================================
// 1. DATOS REGIONALES Y DE CONFIGURACIÓN
// ==========================================

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query + ", Chihuahua, Chihuahua, México"
  )}`;
}

function openMaps(query) {
  window.open(mapsUrl(query), "_blank", "noopener,noreferrer");
}

const COLOR_PORTIONS = [
  {
    id: "green",
    name: "Verde (Nopal / Quelites)",
    ingredient: "Nopal tierno",
    icon: Leaf,
    gradient: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    id: "red",
    name: "Rojo (Chile pasado / Tomate)",
    ingredient: "Chile pasado serrano",
    icon: Flame,
    gradient: "linear-gradient(135deg, #DC2626 0%, #F43F5E 100%)",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    id: "yellow",
    name: "Amarillo (Elote criollo / Maíz)",
    ingredient: "Elote asado",
    icon: Sun,
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  {
    id: "purple",
    name: "Morado (Cebolla morada / Higo)",
    ingredient: "Cebolla curtida",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
    glow: "rgba(147, 51, 234, 0.35)",
  },
  {
    id: "orange",
    name: "Naranja (Zanahoria / Calabaza)",
    ingredient: "Calabaza de castilla",
    icon: Carrot,
    gradient: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
    glow: "rgba(249, 115, 22, 0.35)",
  }
];

const INITIAL_FRIENDS = [
  { id: "vale", name: "Vale", gradient: "linear-gradient(135deg, #008471, #00B496)", bio: "Le encanta improvisar con lo que hay en el refri de la abuela.", recipes: 9 },
  { id: "diego", name: "Diego", gradient: "linear-gradient(135deg, #898E46, #A8AF58)", bio: "Siempre trae algo nuevo del tianguis los sábados.", recipes: 6 },
  { id: "ana", name: "Ana", gradient: "linear-gradient(135deg, #C45F3F, #E07755)", bio: "Organiza las cenas de mesa colaborativas de los jueves.", recipes: 4 },
  { id: "luis", name: "Luis", gradient: "linear-gradient(135deg, #5B86B8, #7FA8DA)", bio: "Fanático del sotol artesanal y recetas con nuez pecana.", recipes: 3 },
  { id: "mar", name: "Mar", gradient: "linear-gradient(135deg, #C4628E, #E27FA9)", bio: "Perfeccionando el asado a la leña con chile chilaca.", recipes: 7 },
];

const INITIAL_FEED = [
  {
    id: 1,
    user: "Vale Reyes",
    avatarGradient: "linear-gradient(135deg, #008471, #00B496)",
    time: "hace 2 h",
    dish: "Tacos de coliflor asada al pastor con piña deshidratada",
    tag: "Cena de hoy",
    likes: 24,
    comments: [
      { user: "Diego", text: "¿Le pusiste orégano de la sierra o naranja agria?" },
      { user: "Ana", text: "¡Guárdame dos para el ratito! 🙌" }
    ],
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    user: "Diego Ortiz",
    avatarGradient: "linear-gradient(135deg, #898E46, #A8AF58)",
    time: "hace 4 h",
    dish: "Bowl de quinoa, nopal tierno y queso menonita maduro",
    tag: "Receta nueva",
    likes: 42,
    comments: [
      { user: "Vale", text: "El queso menonita le da un toque 10/10" }
    ],
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    user: "Ana Cortés",
    avatarGradient: "linear-gradient(135deg, #C45F3F, #E07755)",
    time: "ayer",
    dish: "Cena de mesa con barbacoa de hongos y maridaje de sotol",
    tag: "Plan de mesa",
    likes: 19,
    comments: [],
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80",
  },
];

const INITIAL_SPOTS = [
  {
    id: 1,
    name: "Chihuahua Local",
    type: "Tienda de productores",
    tag: "Miel silvestre, quesos menonitas y nuez de Delicias",
    dist: "A 800m · Centro",
    timeEst: "8 min a pie",
    query: "Chihuahua Local, Calle Guadalupe Victoria 100, Zona Centro",
    x: "28%", y: "42%",
  },
  {
    id: 2,
    name: "Tianguis de Productores",
    type: "Tianguis municipal",
    tag: "Hortalizas frescas cosechadas el mismo día",
    dist: "A 1.4 km · Sede rotativa",
    timeEst: "5 min en bici",
    query: "Tianguis de Productores Locales, Municipio de Chihuahua",
    x: "54%", y: "60%",
  },
  {
    id: 3,
    name: "Plaza del Ángel",
    type: "Mercado agroalimentario",
    tag: "Ferias campesinas y talleres al aire libre",
    dist: "A 1.8 km · Centro Cívico",
    timeEst: "7 min en bici",
    query: "Plaza del Ángel Chihuahua",
    x: "72%", y: "30%",
  },
  {
    id: 4,
    name: "La Rodadora",
    type: "Espacio interactivo",
    tag: "Taller: Cocina sustentable del desierto norteño",
    dist: "A 3.2 km · Parque Central",
    timeEst: "12 min en auto",
    query: "La Rodadora Espacio Interactivo Chihuahua",
    x: "42%", y: "78%",
  },
  {
    id: 5,
    name: "Calle Libertad Centro",
    type: "Corredor gastronómico",
    tag: "Puestos de elotes asados, empanadas y frutos secos",
    dist: "A 950m · Andador peatonal",
    timeEst: "10 min a pie",
    query: "Calle Libertad Centro Histórico Chihuahua",
    x: "82%", y: "65%",
  },
];

const REGIONAL_TIPS = [
  {
    title: "Sabor del Desierto: El Chile Pasado",
    text: "Se tuesta y deshidrata al sol de Chihuahua para concentrar antioxidantes y un sabor ahumado profundo que realza cualquier verdura.",
    badgeGradient: "linear-gradient(135deg, #C45F3F, #E07755)",
    icon: Flame,
  },
  {
    title: "Potencia de la Nuez Pecana",
    text: "Chihuahua es el principal productor mundial. Un puñado diario aporta ácidos grasos omega-9 que benefician la salud cardiovascular.",
    badgeGradient: "linear-gradient(135deg, #898E46, #A8AF58)",
    icon: Award,
  },
  {
    title: "Fibra viva: Nopal asado",
    text: "Sustituye la mitad del arroz o tortilla por nopal asado con orégano. Reduce el pico glucémico de forma natural.",
    badgeGradient: "linear-gradient(135deg, #008471, #00B496)",
    icon: Leaf,
  }
];

const PRESET_DISHES = [
  {
    name: "Tacos de Coliflor con Nopal Asado",
    cal: 385,
    protein: 18,
    carbs: 42,
    fats: 12,
    fiber: 9,
    localScore: 92,
    icon: Utensils,
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Caldillo de Chile Pasado con Queso Menonita",
    cal: 320,
    protein: 21,
    carbs: 26,
    fats: 14,
    fiber: 8,
    localScore: 98,
    icon: Soup,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80",
  }
];

// ==========================================
// 2. COMPONENTES VISUALES Y FONDOS
// ==========================================

// Fondo topográfico de curvas de nivel (Barrancas del Cobre / Sierra Tarahumara)
function TopographicContourBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.22, zIndex: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-60 160 C 60 120, 160 210, 280 150 C 360 110, 420 160, 480 130" stroke="#008471" strokeWidth="1.8" strokeDasharray="6 6" />
        <path d="M-80 230 C 80 190, 190 300, 310 240 C 390 200, 440 250, 520 220" stroke="#C45F3F" strokeWidth="1.6" />
        <path d="M-40 330 C 90 290, 170 400, 290 340 C 370 300, 450 350, 500 310" stroke="#008471" strokeWidth="1.8" strokeDasharray="4 4" />
        <path d="M-90 490 C 70 430, 200 560, 330 480 C 410 440, 460 500, 540 460" stroke="#F59E0B" strokeWidth="2" />
        <path d="M-50 630 C 100 590, 210 700, 320 640 C 400 600, 450 650, 520 620" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="5 5" />
      </svg>
    </div>
  );
}

// Avatar con marco en gradiente
function GradientAvatar({ letter, gradient, size = 48, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.36,
        background: gradient || "linear-gradient(135deg, #008471, #00B496)",
        padding: 2,
        border: "none",
        cursor: onClick ? "pointer" : "default",
        boxShadow: "0 6px 14px rgba(45,35,25,0.12)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s ease"
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: size * 0.32,
          background: "#FAF6ED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#201A18",
          fontWeight: 800,
          fontSize: size * 0.4,
          fontFamily: "Space Grotesk, sans-serif"
        }}
      >
        {letter}
      </div>
    </button>
  );
}

function ScreenHeader({ title, subtitle, rightElement }) {
  return (
    <div style={{ padding: "16px 20px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
      <div>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: "-0.02em",
            margin: 0,
            background: "linear-gradient(135deg, #201A18 20%, #008471 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "#79694F", fontSize: 13, marginTop: 3, fontFamily: "Manrope, sans-serif", fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>
      {rightElement}
    </div>
  );
}

// ==========================================
// 3. PANTALLA: INICIO (HOME)
// ==========================================

function HomeScreen({
  colorPortions,
  onToggleColor,
  friends,
  onFriendClick,
  onInvite,
  tipIndex,
  onNextTip
}) {
  const checkedColors = colorPortions.filter((c) => c.checked).length;
  const progressPct = Math.round((checkedColors / colorPortions.length) * 100);
  const currentTip = REGIONAL_TIPS[tipIndex];
  const TipIcon = currentTip.icon;

  return (
    <div style={{ paddingBottom: 100, position: "relative", zIndex: 1 }}>
      <ScreenHeader
        title="Hola, Alma"
        subtitle="Jueves 27 de agosto · Chihuahua"
        rightElement={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              border: "1px solid rgba(245,158,11,0.35)",
              color: "#92400E",
              fontSize: 12,
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(245,158,11,0.12)"
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={11} color="#FFFFFF" />
            </div>
            <span>4 días</span>
          </div>
        }
      />

      {/* Tarjeta Hero con Gradiente Cósmico-Desértico */}
      <div style={{ margin: "0 20px 18px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #008471 0%, #00594B 50%, #C45F3F 100%)",
            borderRadius: 28,
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 16px 36px rgba(0,132,113,0.22)",
            border: "1px solid rgba(255,255,255,0.35)",
            color: "#FAF6ED",
          }}
        >
          {/* Manchas de luz abstractas */}
          <div style={{ position: "absolute", right: -30, bottom: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,208,167,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(255,255,255,0.18)", padding: "3px 10px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)" }}>
                Arcoíris de Nutrientes
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#FDE68A", display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={13} color="#FDE68A" />
                <span>{checkedColors}/5 registrados</span>
              </span>
            </div>

            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 21, fontWeight: 800, margin: "4px 0 14px", lineHeight: 1.25 }}>
              5 porciones de color al día
            </h2>

            {/* Selector de Iconos Gráficos Vectoriales (NO EMOJIS) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
                background: "rgba(0,0,0,0.24)",
                backdropFilter: "blur(8px)",
                padding: "10px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.15)",
                marginBottom: 14
              }}
            >
              {colorPortions.map((cp, idx) => {
                const IconComponent = cp.icon;
                return (
                  <button
                    key={cp.id}
                    onClick={() => onToggleColor(idx)}
                    title={cp.name}
                    style={{
                      background: "none",
                      border: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                      padding: 0,
                      transform: cp.checked ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        background: cp.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: cp.checked ? `0 6px 16px ${cp.glow}` : "none",
                        border: cp.checked ? "2px solid #FAF6ED" : "1px solid rgba(255,255,255,0.2)",
                        opacity: cp.checked ? 1 : 0.4,
                        filter: cp.checked ? "none" : "grayscale(0.6)"
                      }}
                    >
                      <IconComponent size={19} color="#FFFFFF" strokeWidth={2.4} />
                    </div>
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: cp.checked ? "#FAF6ED" : "rgba(250,246,237,0.6)" }}>
                      {cp.checked ? "Listo" : "+1"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Barra de Progreso con Gradiente Dinámico */}
            <div style={{ height: 8, background: "rgba(0,0,0,0.25)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #5EEAD4 0%, #FDE047 50%, #FB923C 100%)",
                  borderRadius: 10,
                  boxShadow: "0 0 12px rgba(253,224,71,0.75)",
                  transition: "width 0.4s ease"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 11.5, fontWeight: 700 }}>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>
                {progressPct === 100 ? "¡Reto del día completado!" : "Toca un icono para registrar tu porción"}
              </span>
              <span style={{ color: "#FDE68A", fontWeight: 800 }}>{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amigos con Anillos en Gradiente */}
      <div style={{ margin: "0 0 20px" }}>
        <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ color: "#201A18", fontSize: 15, fontWeight: 800, margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
            Tu mesa esta semana
          </h3>
          <button
            onClick={onInvite}
            style={{
              background: "none",
              border: "none",
              color: "#008471",
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <Plus size={14} />
            <span>Invitar</span>
          </button>
        </div>
        <div style={{ display: "flex", gap: 14, padding: "0 20px", overflowX: "auto" }}>
          {friends.map((f) => (
            <div key={f.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <GradientAvatar letter={f.name[0]} gradient={f.gradient} size={52} onClick={() => onFriendClick(f)} />
              <span style={{ fontSize: 11.5, color: "#5A5347", fontWeight: 700 }}>{f.name}</span>
            </div>
          ))}
          <div
            onClick={onInvite}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0, cursor: "pointer" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                border: "2px dashed #C8BEA8",
                background: "rgba(255,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Plus size={20} color="#008471" />
            </div>
            <span style={{ fontSize: 11.5, color: "#79694F", fontWeight: 700 }}>Sumar</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Tip Regional con Vidrio Esmerilado */}
      <div style={{ margin: "0 20px 18px" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.76)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.85)",
            borderRadius: 24,
            padding: "16px",
            display: "flex",
            gap: 14,
            position: "relative",
            boxShadow: "0 8px 24px rgba(45,35,25,0.06)"
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: currentTip.badgeGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
            }}
          >
            <TipIcon size={22} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1, paddingRight: 20 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: "#201A18", fontFamily: "Space Grotesk, sans-serif" }}>
              {currentTip.title}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#5A5347", lineHeight: 1.45, fontWeight: 500 }}>
              {currentTip.text}
            </p>
          </div>
          <button
            onClick={onNextTip}
            title="Siguiente dato"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#79694F"
            }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Destacado en Chihuahua */}
      <div style={{ margin: "0 20px" }}>
        <p style={{ color: "#201A18", fontSize: 14.5, fontWeight: 800, margin: "0 0 10px", fontFamily: "Space Grotesk, sans-serif" }}>
          Destacado en Chihuahua
        </p>
        <div
          onClick={() => openMaps("La Rodadora Espacio Interactivo Chihuahua")}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            borderRadius: 22,
            padding: "14px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(45,35,25,0.06)"
          }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 16, background: "linear-gradient(135deg, #C45F3F, #E07755)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(196,95,63,0.25)" }}>
            <Calendar size={22} color="#FAF6ED" strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: "#201A18", fontFamily: "Space Grotesk, sans-serif" }}>
              Taller de Huerta & Desierto
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#79694F", fontWeight: 500 }}>
              Sábado · La Rodadora Espacio Interactivo
            </p>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,132,113,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowUpRight size={16} color="#008471" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. PANTALLA: SOCIAL (FEED)
// ==========================================

function SocialScreen({ feed, onLike, onSave, savedPosts, onOpenComments, onFriendClick, onShare }) {
  return (
    <div style={{ paddingBottom: 100, position: "relative", zIndex: 1 }}>
      <ScreenHeader title="Mesa Social" subtitle="Creaciones auténticas de la comunidad de Chihuahua" />

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 18 }}>
        {feed.map((post) => {
          const isSaved = !!savedPosts[post.id];
          return (
            <div
              key={post.id}
              style={{
                background: "rgba(255, 255, 255, 0.78)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(45,35,25,0.06)"
              }}
            >
              {/* Header de post con avatar en gradiente */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
                <GradientAvatar
                  letter={post.user[0]}
                  gradient={post.avatarGradient}
                  size={42}
                  onClick={() => onFriendClick({ name: post.user, bio: `Compartió "${post.dish}"` })}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#201A18" }}>{post.user}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#79694F", fontWeight: 500 }}>{post.time}</p>
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: "#008471",
                    background: "rgba(0,132,113,0.12)",
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: "1px solid rgba(0,132,113,0.2)"
                  }}
                >
                  {post.tag}
                </span>
              </div>

              {/* Imagen con sombreado */}
              <div
                onDoubleClick={() => onLike(post.id)}
                style={{ height: 185, position: "relative", overflow: "hidden", background: "#EAE2CE" }}
              >
                <img
                  src={post.img}
                  alt={post.dish}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Acciones e información */}
              <div style={{ padding: "14px 16px" }}>
                <h3 style={{ margin: "0 0 10px", fontFamily: "Space Grotesk, sans-serif", fontSize: 15.5, fontWeight: 800, color: "#201A18", lineHeight: 1.35 }}>
                  {post.dish}
                </h3>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, borderTop: "1px solid rgba(229,222,201,0.5)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <button
                      onClick={() => onLike(post.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: post.isLiked ? "#C45F3F" : "#5A5347",
                        fontWeight: 800,
                        fontSize: 13
                      }}
                    >
                      <Heart size={18} color={post.isLiked ? "#C45F3F" : "#79694F"} fill={post.isLiked ? "#C45F3F" : "none"} strokeWidth={2.2} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => onOpenComments(post)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "#5A5347",
                        fontWeight: 700,
                        fontSize: 13
                      }}
                    >
                      <MessageCircle size={18} color="#898E46" strokeWidth={2.2} />
                      <span>{post.comments ? post.comments.length : 0}</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => onSave(post.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Bookmark size={18} color={isSaved ? "#008471" : "#79694F"} fill={isSaved ? "#008471" : "none"} strokeWidth={2.2} />
                    </button>
                    <button onClick={() => onShare(post.dish)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Share2 size={18} color="#79694F" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>

                {post.comments && post.comments.length > 0 && (
                  <div
                    onClick={() => onOpenComments(post)}
                    style={{
                      marginTop: 10,
                      background: "rgba(255,255,255,0.7)",
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 12,
                      cursor: "pointer",
                      border: "1px solid rgba(237,230,214,0.6)"
                    }}
                  >
                    <strong style={{ color: "#008471" }}>{post.comments[post.comments.length - 1].user}: </strong>
                    <span style={{ color: "#201A18", fontWeight: 500 }}>{post.comments[post.comments.length - 1].text}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 5. PANTALLA: ESCÁNER INTELIGENTE
// ==========================================

function ScanScreen({ onPublishRecipe }) {
  const [step, setStep] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);
  const [scannedData, setScannedData] = useState(PRESET_DISHES[0]);
  const [recipeName, setRecipeName] = useState("");
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (step !== "camera") return;
    let cancelled = false;
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Tu navegador no soporta acceso directo a la cámara.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        if (!cancelled) setCameraError("Permiso de cámara no disponible. ¡Puedes subir una foto o usar un platillo muestra!");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [step]);

  function handleCapture() {
    const video = videoRef.current;
    if (video && video.videoWidth) {
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/jpeg", 0.85));
    } else {
      setCapturedImage(PRESET_DISHES[0].img);
    }
    triggerAnalysis(PRESET_DISHES[0]);
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result);
        triggerAnalysis(PRESET_DISHES[0]);
      };
      reader.readAsDataURL(file);
    }
  }

  function triggerAnalysis(dish) {
    setScannedData(dish);
    setRecipeName(dish.name);
    setStep("scanning");
    setTimeout(() => {
      setStep("result");
    }, 1400);
  }

  if (step === "camera") {
    return (
      <div style={{ height: "100%", minHeight: "85vh", background: "#181412", display: "flex", flexDirection: "column", color: "#FAF6ED", position: "relative" }}>
        <div style={{ padding: "18px 20px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, margin: 0, fontWeight: 800 }}>Escáner Nutricional</h1>
            <span style={{ fontSize: 10.5, fontWeight: 800, background: "linear-gradient(135deg, #008471, #00D0A7)", padding: "4px 10px", borderRadius: 12 }}>
              IA Culinaria
            </span>
          </div>
          <p style={{ color: "#C8BEA8", fontSize: 12.5, margin: "3px 0 0" }}>
            Calcula nutrientes y origen regional en tiempo real
          </p>
        </div>

        {/* Visor de escaneo */}
        <div style={{ flex: 1, margin: "8px 20px 0", borderRadius: 28, overflow: "hidden", position: "relative", background: "#0D0B0A", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #2D2522" }}>
          {!cameraError ? (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ padding: "20px", textAlign: "center", maxWidth: 280 }}>
              <div style={{ width: 56, height: 56, borderRadius: 20, background: "linear-gradient(135deg, #C45F3F, #E07755)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Camera size={26} color="#FAF6ED" strokeWidth={2.2} />
              </div>
              <p style={{ fontSize: 12, color: "#C8BEA8", margin: "0 0 14px", lineHeight: 1.4 }}>
                {cameraError}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: "linear-gradient(135deg, #008471, #00B496)",
                  border: "none",
                  color: "#FAF6ED",
                  fontSize: 12.5,
                  fontWeight: 800,
                  padding: "10px 18px",
                  borderRadius: 16,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(0,132,113,0.3)"
                }}
              >
                <Upload size={15} /> Subir foto de platillo
              </button>
            </div>
          )}

          {/* Mira reticular con esquinas holográficas */}
          <div style={{ position: "absolute", inset: 24, border: "2px dashed rgba(244,210,66,0.5)", borderRadius: 24, pointerEvents: "none" }} />
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />

        {/* Platillos de muestra con Iconos Gráficos */}
        <div style={{ padding: "12px 20px 4px" }}>
          <span style={{ fontSize: 11, color: "#A89F8D", display: "block", marginBottom: 8, textAlign: "center", fontWeight: 700 }}>
            O prueba una muestra chihuahuense:
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {PRESET_DISHES.map((d) => {
              const PresetIcon = d.icon;
              return (
                <button
                  key={d.name}
                  onClick={() => {
                    setCapturedImage(d.img);
                    triggerAnalysis(d);
                  }}
                  style={{
                    flex: 1,
                    background: "#241E1B",
                    border: "1px solid #3A302C",
                    color: "#FAF6ED",
                    padding: "10px 12px",
                    borderRadius: 16,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textAlign: "left"
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: "linear-gradient(135deg, #008471, #00B496)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <PresetIcon size={14} color="#FFFFFF" />
                  </div>
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {d.name.split(" ")[0]} {d.name.split(" ")[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón Disparador */}
        <div style={{ padding: "16px 0 24px", display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Subir archivo"
            style={{ width: 46, height: 46, borderRadius: 16, background: "#241E1B", border: "1px solid #3A302C", color: "#FAF6ED", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Upload size={18} />
          </button>

          <button
            onClick={handleCapture}
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FAF6ED, #EAE2CE)",
              border: "5px solid #C45F3F",
              cursor: "pointer",
              boxShadow: "0 0 24px rgba(196,95,63,0.5)"
            }}
          />

          <div style={{ width: 46 }} />
        </div>
      </div>
    );
  }

  if (step === "scanning") {
    return (
      <div style={{ height: "100%", minHeight: "80vh", background: "#181412", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#FAF6ED", padding: 30, textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 22,
            background: "linear-gradient(135deg, #008471, #00D0A7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 30px rgba(0,208,167,0.4)"
          }}
        >
          <Sparkles size={30} color="#FFFFFF" />
        </div>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 800, margin: 0 }}>
          Mapeando Nutrientes…
        </p>
        <p style={{ fontSize: 13, color: "#A89F8D", margin: 0 }}>
          Calculando origen regional de los ingredientes
        </p>
      </div>
    );
  }

  // Resultado
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "18px 20px 8px" }}>
        <button onClick={() => setStep("camera")} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
          <ChevronLeft size={22} color="#201A18" />
        </button>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, margin: 0, fontWeight: 800, color: "#201A18" }}>
          Resultado Nutricional
        </h1>
      </div>

      <div style={{ margin: "10px 20px", height: 165, borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
        <img src={capturedImage || scannedData.img} alt="Platillo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(0,132,113,0.92)",
          backdropFilter: "blur(6px)",
          color: "#FAF6ED",
          padding: "5px 12px",
          borderRadius: 14,
          fontSize: 11.5,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: 6
        }}>
          <Check size={14} />
          <span>{scannedData.localScore}% Ingredientes de Chihuahua</span>
        </div>
      </div>

      <div style={{ margin: "0 20px 14px", textAlign: "center" }}>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 800, color: "#201A18", margin: 0 }}>
          {scannedData.name}
        </p>
        <p style={{ fontSize: 13, color: "#79694F", margin: "4px 0 0", fontWeight: 700 }}>
          ≈ {scannedData.cal} kcal por porción
        </p>
      </div>

      {/* Grid de Macronutrientes */}
      <div style={{ margin: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Proteína", value: scannedData.protein, unit: "g", color: "#008471", icon: Zap },
          { label: "Carbohidratos", value: scannedData.carbs, unit: "g", color: "#C45F3F", icon: Wheat },
          { label: "Grasas", value: scannedData.fats, unit: "g", color: "#898E46", icon: Droplet },
          { label: "Fibra", value: scannedData.fiber, unit: "g", color: "#F59E0B", icon: Leaf },
        ].map((n) => (
          <div key={n.label} style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 20, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <n.icon size={16} color={n.color} />
              <span style={{ fontSize: 11.5, color: "#5A5347", fontWeight: 700 }}>{n.label}</span>
            </div>
            <p style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 800, color: "#201A18" }}>
              {n.value} <span style={{ fontSize: 12 }}>{n.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div style={{ margin: "0 20px" }}>
        <button
          onClick={() => onPublishRecipe({ name: recipeName || scannedData.name, img: capturedImage || scannedData.img, cal: scannedData.cal })}
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: 18,
            border: "none",
            background: "linear-gradient(135deg, #008471, #00B496)",
            color: "#FAF6ED",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,132,113,0.3)"
          }}
        >
          Publicar en Social y Perfil
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 6. PANTALLA: MAPA LOCAL & RADAR
// ==========================================

function MapScreen({ spots = INITIAL_SPOTS }) {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const [selectedSpotId, setSelectedSpotId] = useState(1);

  const filters = ["Todos", "Mercados", "Talleres"];

  const visibleSpots = spots.filter((s) => {
    const matchesType =
      filter === "Todos" ||
      (filter === "Mercados" && /tianguis|mercado|tienda/i.test(s.type)) ||
      (filter === "Talleres" && /taller|interactivo/i.test(s.type));
    const matchesQuery = (s.name + s.type + s.tag).toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  const activeSpot = spots.find((s) => s.id === selectedSpotId) || spots[0];

  return (
    <div style={{ paddingBottom: 100, position: "relative", zIndex: 1 }}>
      <ScreenHeader title="Ruta Culinaria" subtitle="Mercados y productores de Chihuahua" />

      {/* Buscador */}
      <div style={{ margin: "0 20px 12px", position: "relative" }}>
        <Search size={16} color="#79694F" style={{ position: "absolute", left: 14, top: 14 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar nopal, queso menonita o taller…"
          style={{
            width: "100%",
            padding: "12px 14px 12px 38px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.9)",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            fontSize: 13,
            color: "#201A18",
            outline: "none",
            boxShadow: "0 4px 14px rgba(45,35,25,0.04)"
          }}
        />
      </div>

      {/* Lienzo del Mapa con Pines Gráficos */}
      <div style={{ margin: "0 20px 14px", borderRadius: 26, overflow: "hidden", height: 195, position: "relative", background: "#EDE4D0", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <svg width="100%" height="100%" viewBox="0 0 340 195" preserveAspectRatio="none" style={{ opacity: 0.75 }}>
          <rect width="340" height="195" fill="#E8DEC8" />
          <path d="M-10 45 Q 120 75 350 50" stroke="#D3C5A5" strokeWidth="12" fill="none" />
          <path d="M-10 145 Q 180 115 350 140" stroke="#D3C5A5" strokeWidth="16" fill="none" />
          <path d="M80 -10 Q 110 90 95 210" stroke="#D3C5A5" strokeWidth="10" fill="none" />
          <path d="M260 -10 Q 240 100 255 210" stroke="#D3C5A5" strokeWidth="10" fill="none" />
          <circle cx="95" cy="60" r="45" fill="#BFCAA2" opacity="0.65" />
          <circle cx="270" cy="135" r="38" fill="#BFCAA2" opacity="0.65" />
        </svg>

        {/* Pines con Radar y Gradientes */}
        {spots.map((spot) => {
          const isSelected = spot.id === selectedSpotId;
          return (
            <div
              key={spot.id}
              onClick={() => setSelectedSpotId(spot.id)}
              style={{
                position: "absolute",
                left: spot.x,
                top: spot.y,
                transform: isSelected ? "scale(1.25) translate(-50%, -50%)" : "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: isSelected ? 20 : 10,
                transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 12,
                  background: isSelected ? "linear-gradient(135deg, #008471, #00D0A7)" : "linear-gradient(135deg, #C45F3F, #E07755)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #FAF6ED",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
                }}
              >
                <MapPin size={16} color="#FAF6ED" strokeWidth={2.4} />
              </div>
            </div>
          );
        })}

        {/* Tarjeta Flotante del Punto Seleccionado */}
        {activeSpot && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              borderRadius: 18,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              zIndex: 30
            }}
          >
            <div style={{ minWidth: 0, paddingRight: 8 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#201A18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "Space Grotesk, sans-serif" }}>
                {activeSpot.name}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#79694F", fontWeight: 600 }}>
                {activeSpot.timeEst} · {activeSpot.dist}
              </p>
            </div>
            <button
              onClick={() => openMaps(activeSpot.query)}
              style={{
                background: "linear-gradient(135deg, #008471, #00B496)",
                color: "#FAF6ED",
                border: "none",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 11.5,
                fontWeight: 800,
                cursor: "pointer",
                flexShrink: 0
              }}
            >
              Cómo llegar ↗
            </button>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px", marginBottom: 12 }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: filter === f ? "none" : "1px solid rgba(255,255,255,0.9)",
              background: filter === f ? "linear-gradient(135deg, #008471, #00B496)" : "rgba(255,255,255,0.7)",
              color: filter === f ? "#FAF6ED" : "#5A5347",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: filter === f ? "0 4px 12px rgba(0,132,113,0.25)" : "none"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 9 }}>
        {visibleSpots.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSpotId(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: s.id === selectedSpotId ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid " + (s.id === selectedSpotId ? "#008471" : "rgba(255,255,255,0.85)"),
              borderRadius: 20,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(137,142,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Compass size={20} color="#5F6530" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#201A18", fontFamily: "Space Grotesk, sans-serif" }}>{s.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#79694F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{s.tag}</p>
            </div>
            <span style={{ fontSize: 11, color: "#008471", fontWeight: 700 }}>{s.dist}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. PANTALLA: PERFIL DE ALMA
// ==========================================

function ProfileScreen({ recipes, friendsCount }) {
  return (
    <div style={{ paddingBottom: 100, position: "relative", zIndex: 1 }}>
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 66, height: 66, borderRadius: 24, background: "linear-gradient(135deg, #008471, #00B496, #F59E0B)", padding: 2.5, boxShadow: "0 8px 20px rgba(0,132,113,0.25)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 22, background: "#FAF6ED", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontSize: 26, fontWeight: 800, color: "#201A18" }}>
            A
          </div>
        </div>
        <div>
          <h2 style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 21, fontWeight: 800, color: "#201A18" }}>Alma Ramírez</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#79694F", fontWeight: 500 }}>Chihuahua, Chih · Cocina Consciente</p>
          <span style={{ display: "inline-block", marginTop: 4, fontSize: 10.5, fontWeight: 800, background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))", color: "#92400E", border: "1px solid rgba(245,158,11,0.35)", padding: "2px 10px", borderRadius: 12 }}>
            Nivel 4 · Creadora de Sazón
          </span>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div style={{ display: "flex", margin: "0 20px 20px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 22, overflow: "hidden", boxShadow: "0 6px 18px rgba(45,35,25,0.04)" }}>
        {[
          { n: recipes.length, l: "Recetas" },
          { n: "5", l: "Talleres" },
          { n: friendsCount, l: "Amigos" },
        ].map((s, i) => (
          <div key={s.l} style={{ flex: 1, textAlign: "center", padding: "14px 0", borderLeft: i > 0 ? "1px solid rgba(229,222,201,0.5)" : "none" }}>
            <p style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 21, fontWeight: 800, color: "#008471" }}>{s.n}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#79694F", fontWeight: 700 }}>{s.l}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 15, color: "#201A18", margin: 0 }}>
          Mi recetario ({recipes.length})
        </p>
        <Star size={16} color="#C45F3F" />
      </div>

      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {recipes.map((r, i) => (
          <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 6px 18px rgba(45,35,25,0.04)" }}>
            <div style={{ height: 95, background: "#EAE2CE", position: "relative" }}>
              <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <p style={{ margin: 0, padding: "10px 12px", fontSize: 12, fontWeight: 800, color: "#201A18", lineHeight: 1.3, fontFamily: "Space Grotesk, sans-serif" }}>
              {r.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. MODAL DE COMENTARIOS Y AMIGOS
// ==========================================

function CommentsModal({ post, onClose, onAddComment }) {
  const [commentText, setCommentText] = useState("");
  if (!post) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(24,20,18,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "75%", background: "#FAF6ED", borderRadius: "28px 28px 0 0", display: "flex", flexDirection: "column", padding: "18px 20px 24px" }}>
        <div style={{ width: 38, height: 4, borderRadius: 4, background: "#D6CDB8", margin: "0 auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 16, fontWeight: 800, color: "#201A18" }}>
            Comentarios ({post.comments ? post.comments.length : 0})
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color="#79694F" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
          {(!post.comments || post.comments.length === 0) ? (
            <p style={{ textAlign: "center", color: "#79694F", fontSize: 13, padding: "20px 0", fontWeight: 500 }}>
              Aún no hay comentarios. ¡Sé el primero en saludar!
            </p>
          ) : (
            post.comments.map((c, i) => (
              <div key={i} style={{ background: "#FFFFFF", padding: "10px 14px", borderRadius: 14, border: "1px solid #EDE6D6", fontSize: 12.5 }}>
                <strong style={{ color: "#008471" }}>{c.user}: </strong>
                <span style={{ color: "#201A18", fontWeight: 500 }}>{c.text}</span>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid #EDE6D6" }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Añade tu comentario..."
            style={{ flex: 1, padding: "11px 14px", borderRadius: 16, border: "1px solid #EDE6D6", background: "#FFFFFF", fontSize: 13, color: "#201A18", outline: "none" }}
          />
          <button type="submit" style={{ background: "linear-gradient(135deg, #008471, #00B496)", border: "none", color: "#FAF6ED", borderRadius: 16, padding: "0 18px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}

function FriendModal({ friend, onClose, onPlanDinner }) {
  if (!friend) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(24,20,18,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 55 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#FAF6ED", borderRadius: "28px 28px 0 0", padding: "20px 22px 28px" }}>
        <div style={{ width: 38, height: 4, borderRadius: 4, background: "#D6CDB8", margin: "0 auto 16px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <GradientAvatar letter={friend.name[0]} gradient={friend.gradient} size={58} />
          <div>
            <p style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 800, color: "#201A18" }}>{friend.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#79694F", fontWeight: 600 }}>{friend.recipes || 5} recetas en la comunidad</p>
          </div>
        </div>

        {friend.bio && (
          <p style={{ margin: "14px 0", fontSize: 13, color: "#5A5347", lineHeight: 1.45, background: "rgba(255,255,255,0.7)", padding: "12px 14px", borderRadius: 16, border: "1px solid #EDE6D6", fontWeight: 500 }}>
            "{friend.bio}"
          </p>
        )}

        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#201A18", margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif" }}>
            Agendar cena colaborativa
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["Hoy noche", "Mañana", "Este sábado"].map((slot) => (
              <button
                key={slot}
                onClick={() => onPlanDinner(friend.name, slot)}
                style={{ flex: 1, padding: "12px 8px", borderRadius: 16, border: "1px solid #EDE6D6", background: "#FFFFFF", fontWeight: 700, fontSize: 12.5, color: "#201A18", cursor: "pointer" }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. APP SHELL PRINCIPAL
// ==========================================

const TABS = [
  { key: "home", label: "Inicio", icon: Home },
  { key: "social", label: "Social", icon: Users },
  { key: "scan", label: "", icon: Camera },
  { key: "map", label: "Ruta", icon: MapPin },
  { key: "profile", label: "Perfil", icon: User },
];

export default function MesaLocalPrototype() {
  const [tab, setTab] = useState("home");
  const [activeFriend, setActiveFriend] = useState(null);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [toast, setToast] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  const [feed, setFeed] = useState(INITIAL_FEED);
  const [savedPosts, setSavedPosts] = useState({});
  const [myRecipes, setMyRecipes] = useState([
    { name: "Ensalada de nopal asado al comal", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80" },
    { name: "Sopa de lentejas y chile chilaca", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80" },
    { name: "Agua fresca de jamaica y menta", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80" },
    { name: "Pico de gallo serrano", img: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=400&auto=format&fit=crop&q=80" },
  ]);

  const [colorPortions, setColorPortions] = useState(
    COLOR_PORTIONS.map((cp, idx) => ({ ...cp, checked: idx < 3 }))
  );

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }

  function handleToggleColor(idx) {
    const updated = [...colorPortions];
    updated[idx].checked = !updated[idx].checked;
    setColorPortions(updated);
    const count = updated.filter((c) => c.checked).length;
    if (count === updated.length) {
      showToast("¡Completaste los 5 colores hoy! +50 pts");
    } else {
      showToast(updated[idx].checked ? `Porción de ${updated[idx].ingredient} registrada` : "Porción desmarcada");
    }
  }

  function handleLike(postId) {
    setFeed((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: p.likes + (isLiked ? 1 : -1) };
        }
        return p;
      })
    );
  }

  function handleSave(postId) {
    setSavedPosts((prev) => {
      const next = { ...prev, [postId]: !prev[postId] };
      showToast(next[postId] ? "Receta guardada en tu perfil" : "Receta removida");
      return next;
    });
  }

  function handleAddComment(postId, text) {
    setFeed((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const comments = p.comments ? [...p.comments] : [];
          comments.push({ user: "Alma", text });
          return { ...p, comments };
        }
        return p;
      })
    );
    showToast("Comentario publicado");
  }

  function handlePublishRecipe(newRecipe) {
    const newPost = {
      id: Date.now(),
      user: "Alma Ramírez",
      avatarGradient: "linear-gradient(135deg, #008471, #00B496)",
      time: "Ahora mismo",
      dish: newRecipe.name,
      tag: "Recién cocinado",
      likes: 1,
      isLiked: true,
      comments: [],
      img: newRecipe.img
    };

    setFeed((prev) => [newPost, ...prev]);
    setMyRecipes((prev) => [{ name: newRecipe.name, img: newRecipe.img }, ...prev]);
    showToast("¡Receta agregada a tu perfil!");
    setTab("social");
  }

  const isDark = tab === "scan";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        minHeight: "100vh",
        // Gradiente ambiental complejo (Mesh Gradient)
        background: isDark
          ? "radial-gradient(circle at 20% 20%, rgba(0, 180, 140, 0.25) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(224, 90, 58, 0.2) 0%, transparent 45%), linear-gradient(165deg, #181412 0%, #120F0E 60%, #0D1412 100%)"
          : "radial-gradient(circle at 15% 15%, rgba(0, 180, 140, 0.16) 0%, transparent 40%), radial-gradient(circle at 85% 25%, rgba(224, 90, 58, 0.14) 0%, transparent 45%), radial-gradient(circle at 50% 70%, rgba(245, 158, 11, 0.10) 0%, transparent 50%), linear-gradient(160deg, #FBF8F3 0%, #F5EEE2 45%, #EEF6F2 100%)",
        color: isDark ? "#FAF6ED" : "#201A18",
        position: "relative",
        fontFamily: "Manrope, sans-serif",
        boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
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

      {/* Gráfico topográfico de fondo */}
      {!isDark && <TopographicContourBackground />}

      {/* Contenido scrolleable */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "home" && (
          <HomeScreen
            colorPortions={colorPortions}
            onToggleColor={handleToggleColor}
            friends={INITIAL_FRIENDS}
            onFriendClick={setActiveFriend}
            onInvite={() => showToast("Enlace de invitación copiado")}
            tipIndex={tipIndex}
            onNextTip={() => setTipIndex((prev) => (prev + 1) % REGIONAL_TIPS.length)}
          />
        )}
        {tab === "social" && (
          <SocialScreen
            feed={feed}
            onLike={handleLike}
            onSave={handleSave}
            savedPosts={savedPosts}
            onOpenComments={setActiveCommentsPost}
            onFriendClick={setActiveFriend}
            onShare={(dish) => showToast(`Enlace para "${dish}" copiado`)}
          />
        )}
        {tab === "scan" && <ScanScreen onPublishRecipe={handlePublishRecipe} />}
        {tab === "map" && <MapScreen spots={INITIAL_SPOTS} />}
        {tab === "profile" && <ProfileScreen recipes={myRecipes} friendsCount={INITIAL_FRIENDS.length} />}
      </div>

      {/* Barra de Navegación con Vidrio Esmerilado */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 440,
          height: 76,
          background: isDark ? "rgba(24,20,18,0.92)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(18px)",
          borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 6px",
          zIndex: 40,
          boxShadow: "0 -8px 30px rgba(0,0,0,0.06)"
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
                  width: 58,
                  height: 58,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #00A88F 0%, #008471 50%, #005246 100%)",
                  border: "4px solid #FAF6ED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -26,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(0,132,113,0.4)",
                  transition: "transform 0.15s ease",
                }}
              >
                <Camera size={24} color="#FAF6ED" strokeWidth={2.2} />
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
                padding: "6px 12px",
              }}
            >
              <t.icon size={20} color={active ? "#008471" : isDark ? "#79694F" : "#A89F8D"} strokeWidth={2.3} />
              <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#008471" : isDark ? "#79694F" : "#A89F8D" }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modales y Toast */}
      <FriendModal friend={activeFriend} onClose={() => setActiveFriend(null)} onPlanDinner={(name, slot) => { showToast(`Cena con ${name} agendada`); setActiveFriend(null); }} />
      <CommentsModal
        post={activeCommentsPost ? feed.find((p) => p.id === activeCommentsPost.id) : null}
        onClose={() => setActiveCommentsPost(null)}
        onAddComment={handleAddComment}
      />

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 94,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(32,26,24,0.95)",
            backdropFilter: "blur(10px)",
            color: "#FAF6ED",
            padding: "10px 20px",
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 800,
            zIndex: 70,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.12)"
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
