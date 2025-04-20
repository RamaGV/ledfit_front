// HexBadge.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Canvas,
  Path,
  BlurMask,
  Skia,
  LinearGradient,
  vec,
  Circle,
} from "@shopify/react-native-skia";

interface HexBadgeProps {
  logroKey: string; // Texto que se muestra (p.ej. "500")
  obtenido: boolean; // Indica si el logro está obtenido
  type: "check" | "time" | "plus"; // Tipo de logro
  title: string; // Título del logro para determinar el nivel
}

// Función para obtener los colores según el nivel del logro
function getBadgeColors(title: string): {
  primary: string;
  secondary: string;
  text: string;
  glow: string;
} {
  if (title.includes("Bronze")) {
    return {
      primary: "#CD7F32",
      secondary: "#8B5A2B",
      text: "#FFEBCD",
      glow: "#CD7F3270",
    };
  } else if (title.includes("Plata")) {
    return {
      primary: "#C0C0C0",
      secondary: "#A9A9A9",
      text: "#F5F5F5",
      glow: "#C0C0C070",
    };
  } else if (title.includes("Oro")) {
    return {
      primary: "#FFD700",
      secondary: "#DAA520",
      text: "#FFFACD",
      glow: "#FFD70070",
    };
  } else if (title.includes("Platino")) {
    return {
      primary: "#E5E4E2",
      secondary: "#C9C8C5",
      text: "#FFFFFF",
      glow: "#E5E4E270",
    };
  } else if (title.includes("Diamante")) {
    return {
      primary: "#B9F2FF",
      secondary: "#70D9E7",
      text: "#E0FFFF",
      glow: "#B9F2FF70",
    };
  } else if (title.includes("Legendario")) {
    return {
      primary: "#FF44CC",
      secondary: "#CC33AA",
      text: "#FFCCEE",
      glow: "#FF44CC70",
    };
  } else {
    // Valor por defecto
    return {
      primary: "#6842FF",
      secondary: "#4123A0",
      text: "#E6E6FA",
      glow: "#6842FF70",
    };
  }
}

// Función para obtener el ícono según el tipo de logro
function getLogroIcon(type: string): string {
  switch (type) {
    case "check":
      return "🔥"; // Calorías (fuego)
    case "time":
      return "⏱️"; // Tiempo (reloj)
    case "plus":
      return "🏋️"; // Entrenamientos (pesas)
    default:
      return "🏆";
  }
}

/**
 * Crea un path en forma de hexágono regular, centrado en (cx, cy) con un radio dado.
 */
function createHexagonPath(cx: number, cy: number, radius: number) {
  const path = Skia.Path.Make();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }
  path.close();
  return path;
}

export const HexBadge: React.FC<HexBadgeProps> = ({
  logroKey,
  obtenido,
  type,
  title,
}) => {
  const size = 125; // Tamaño total del componente
  const cx = size / 2;
  const cy = size / 2;
  const radius = 50; // Radio para el hexágono

  // Obtenemos los colores según el nivel
  const colors = getBadgeColors(title);

  // Construimos el path del hexágono
  const hexPath = createHexagonPath(cx, cy, radius);

  // Emoji para el tipo de logro
  const logroIcon = getLogroIcon(type);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {obtenido ? (
          // == Logro OBTENIDO ==
          <>
            {/* Efecto de brillo exterior (solo para logros obtenidos) */}
            <Path
              path={hexPath}
              color={colors.glow}
              style="fill"
              transform={[
                { scale: 1.1 },
                { translateX: -cx * 0.05 },
                { translateY: -cy * 0.05 },
              ]}
            >
              <BlurMask blur={7} style="normal" />
            </Path>

            {/* Sombra oscura (desplazada abajo-derecha) */}
            <Path
              path={hexPath}
              color="black"
              opacity={0.8}
              style="fill"
              transform={[{ translateX: 0 }, { translateY: 8 }]}
            >
              <BlurMask blur={5} style="normal" />
            </Path>

            {/* Hexágono principal con gradiente */}
            <Path path={hexPath} style="fill">
              <LinearGradient
                start={vec(cx - radius, cy - radius)}
                end={vec(cx + radius, cy + radius)}
                colors={[colors.secondary, colors.primary, colors.secondary]}
                positions={[0, 0.2, 1]}
              />
            </Path>

            {/* Pequeño brillo en la parte superior */}
            <Circle
              cx={cx - radius / 3}
              cy={cy - radius / 3}
              r={5}
              color="white"
              opacity={0.7}
            >
              <BlurMask blur={5} style="normal" />
            </Circle>
          </>
        ) : (
          // == Logro NO OBTENIDO ==
          <>
            {/* Sombra oscura (desplazada abajo-derecha) */}
            <Path
              path={hexPath}
              color="black"
              opacity={0.2}
              style="fill"
              transform={[{ translateX: 4 }, { translateY: 6 }]}
            >
              <BlurMask blur={5} style="normal" />
            </Path>

            {/* Hexágono base de color oscuro */}
            <Path path={hexPath} color="#1A1A1A" style="fill"></Path>

            {/* Borde del hexágono con gradiente sutil */}
            <Path path={hexPath} style="stroke" strokeWidth={2}>
              <LinearGradient
                start={vec(cx - radius, cy - radius)}
                end={vec(cx + radius, cy + radius)}
                colors={["#333333", "#666666", "#333333"]}
                positions={[0, 0.5, 1]}
              />
            </Path>

            {/* Efecto de brillo interior sutil */}
            <Path path={hexPath} color="#252525" style="fill" opacity={0.3}>
              <BlurMask blur={4} style="inner" />
            </Path>
          </>
        )}
      </Canvas>

      {/* Capa absoluta para centrar el contenido */}
      <View style={styles.centered}>
        {/* Icono de tipo de logro */}
        <Text style={styles.icon}>{logroIcon}</Text>

        {/* Clave del logro (número) */}
        <Text
          style={[
            styles.text,
            obtenido ? { color: colors.text } : { color: "#505050" },
          ]}
        >
          {logroKey}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#121212",
  },
  centered: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
});
