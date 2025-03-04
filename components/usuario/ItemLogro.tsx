// HexBadge.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Canvas, Path, BlurMask, Skia } from "@shopify/react-native-skia";

interface HexBadgeProps {
  logroKey: string; // Texto que se muestra (p.ej. "500")
  obtenido: boolean; // Indica si el logro está obtenido
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

export const HexBadge: React.FC<HexBadgeProps> = ({ logroKey, obtenido }) => {
  const size = 125; // Tamaño total del componentex
  const cx = size / 2;
  const cy = size / 2;
  const radius = 50; // Radio para el hexágono

  // Construimos el path del hexágono
  const hexPath = createHexagonPath(cx, cy, radius);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {obtenido ? (
          // == Logro OBTENIDO ==
          <>
            {/* Sombra oscura (desplazada abajo-derecha) */}
            <Path
              path={hexPath}
              color="black"
              opacity={0.2}
              style="fill"
              transform={[{ translateX: 6 }, { translateY: 15 }]}
            >
              <BlurMask blur={5} style="normal" />
            </Path>

            {/* Hexágono principal (relleno oscuro) */}
            <Path path={hexPath} color="#2E2E2E" style="fill" />

            {/* Sombra clara (desplazada arriba-izquierda) */}
            <Path
              path={hexPath}
              color="gray"
              opacity={0.1}
              style="fill"
              transform={[{ translateX: -5 }, { translateY: -5 }]}
            >
              <BlurMask blur={5} style="normal" />
            </Path>
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
              transform={[{ translateX: 6 }, { translateY: 15 }]}
            >
              <BlurMask blur={5} style="normal" />
            </Path>

            <Path path={hexPath} color="#121212" style="fill"></Path>
            <Path
              path={hexPath}
              color="#202020"
              style="stroke"
              strokeWidth={3}
            />

            {/* Sombra clara (desplazada arriba-izquierda) */}
            <Path path={hexPath} color="#121212" opacity={0.1} style="fill">
              <BlurMask blur={6} style="inner" />
            </Path>
          </>
        )}
      </Canvas>

      {/* Capa absoluta para centrar el texto */}
      <View style={styles.centered}>
        <Text
          style={[
            styles.text,
            obtenido ? { color: "#FF9900" } : { color: "#606060" },
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
    fontSize: 16,
    fontWeight: "600",
  },
});
