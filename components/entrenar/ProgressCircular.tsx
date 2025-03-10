import React from "react";
import { View, Text, AccessibilityInfo, Image } from "react-native";
import { LinearGradient, Canvas, Circle, Shadow, Path, Skia, vec } from "@shopify/react-native-skia";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext"; // Importamos el contexto de tema

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

type Props = {
  tiempoMaximo: number;       // Tiempo total en segundos
  tiempoTranscurrido: number; // Tiempo transcurrido en segundos (tiempo restante = tiempoMaximo - tiempoTranscurrido)
  containerWidth: number;     // Ancho del contenedor
  containerHeight: number;    // Alto del contenedor
  colores: string[];          // Colores para el gradiente
  pausa: boolean;             // Indica si el temporizador está en pausa
  onTiempoAgotado: () => void;// Función a llamar cuando se agota el tiempo
  esDescanso?: boolean;       // Indica si estamos en un período de descanso
  proximoEjercicio?: any;     // Información sobre el próximo ejercicio (si esDescanso es true)
  totalEjercicios?: number;   // Total de ejercicios en el entrenamiento
  indiceEjercicio?: number;   // Índice del ejercicio actual
  imagesMap?: any;            // Mapa de imágenes para mostrar la imagen del próximo ejercicio
};

export default function ProgressCircular({
  tiempoMaximo,
  tiempoTranscurrido,
  containerWidth,
  containerHeight,
  colores,
  pausa,
  onTiempoAgotado,
  esDescanso = false,
  proximoEjercicio = null,
  totalEjercicios = 0,
  indiceEjercicio = 0,
  imagesMap = {}
}: Props) {
  // Obtenemos los colores del tema actual
  const { colors, isDarkMode } = useTheme();

  // Añadimos un log para verificar si este componente se usa durante el descanso
  console.log("=== PROGRESSCIRCULAR SIENDO RENDERIZADO ===", {
    tiempoMaximo,
    tiempoTranscurrido,
    containerWidth,
    containerHeight,
    pausa,
    esDescanso,
    proximoEjercicio
  });

  // Dimensiones y centro del canvas
  const RADIO = Math.min(containerWidth, containerHeight) / 2 - 45;
  const CX = containerWidth / 2;
  const CY = containerHeight / 2;

  // Convertir tiempos de segundos a milisegundos
  const totalTimeMs = tiempoMaximo * 1000;
  
  // Calcular el tiempo restante
  const elapsedTimeMs = tiempoTranscurrido * 1000;
  const remainingTimeMs = totalTimeMs - elapsedTimeMs;

  // Calcular el ángulo del arco (360° representa el total del tiempo)
  const FULL_DEGREES = 360;
  const progress = elapsedTimeMs / totalTimeMs;
  const sweepAngle = progress * FULL_DEGREES;

  // Si ya se agotó el tiempo y no está en pausa, se invoca la función para pasar a la siguiente etapa
  if (remainingTimeMs <= 0 && !pausa) {
    onTiempoAgotado();
  }

  // Formatear el tiempo restante para mostrar (mm:ss:cc)
  const minutes = Math.floor(remainingTimeMs / 60000);
  const seconds = Math.floor((remainingTimeMs % 60000) / 1000);
  const centiseconds = Math.floor((remainingTimeMs % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedCentiseconds = centiseconds.toString().padStart(2, "0");

  // Formato para lectores de pantalla
  const accessibilityLabel = `Temporizador: ${minutes} minutos y ${seconds} segundos restantes`;
  const timeString = `${formattedMinutes}:${formattedSeconds}:${formattedCentiseconds}`;

  // Crear el arco usando Skia
  const boundingRect = Skia.XYWHRect(CX - RADIO, CY - RADIO, RADIO * 2, RADIO * 2);
  const arcPath = Skia.Path.Make();
  arcPath.addArc(boundingRect, -90, sweepAngle);

  // Convertir los colores a formato Skia
  const skiaColors = colores.map((c) => Skia.Color(c));

  // Si es un descanso, mostramos una pantalla diferente con información del próximo ejercicio
  if (esDescanso && proximoEjercicio) {
    const { ejercicioId, tiempo } = proximoEjercicio;
    
    // Estimar calorías
    const caloriasEstimadas = ejercicioId.caloriasPorSegundo 
      ? Math.round(tiempo * ejercicioId.caloriasPorSegundo) 
      : Math.round(tiempo * 0.15);
    
    return (
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: 20
        }}
      >
        {/* Título y temporizador */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>
            Descanso
          </Text>
          <Text style={{ color: '#6842FF', fontSize: 48, fontWeight: 'bold', marginTop: 10 }}>
            {formattedMinutes}:{formattedSeconds}
            <Text style={{ color: '#FFD700', fontSize: 24 }}>{formattedCentiseconds}</Text>
          </Text>
        </View>
        
        {/* Próximo ejercicio */}
        <View style={{ padding: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="arrow-forward-circle" size={22} color="#6842FF" />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
              Próximo ejercicio
            </Text>
          </View>
          
          {/* Imagen y detalles */}
          <View style={{ backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 15 }}>
            {imagesMap && ejercicioId.imagen && imagesMap[ejercicioId.imagen] && (
              <Image 
                source={imagesMap[ejercicioId.imagen]} 
                style={{ width: '100%', height: 180 }}
                resizeMode="cover"
              />
            )}
            
            <View style={{ padding: 15 }}>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
                {ejercicioId.nombre}
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Ionicons name="barbell-outline" size={16} color="#6842FF" />
                <Text style={{ color: colors.secondaryText, marginLeft: 5 }}>
                  {ejercicioId.grupo || "General"}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="time-outline" size={18} color="#6842FF" />
                  <Text style={{ color: colors.text, marginLeft: 5 }}>
                    {tiempo}s
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="flame-outline" size={18} color="#FF5757" />
                  <Text style={{ color: colors.text, marginLeft: 5 }}>
                    {caloriasEstimadas} cal
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Indicador de posición */}
          <View style={{ 
            backgroundColor: 'rgba(104, 66, 255, 0.2)', 
            alignSelf: 'flex-start', 
            paddingHorizontal: 12, 
            paddingVertical: 6, 
            borderRadius: 20 
          }}>
            <Text style={{ color: '#8C6EFF' }}>
              {indiceEjercicio} de {totalEjercicios}
            </Text>
          </View>
        </View>
        
        {/* Botón de saltar descanso */}
        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <View style={{ 
            backgroundColor: '#6842FF', 
            padding: 15, 
            borderRadius: 30, 
            alignItems: 'center' 
          }}>
            <Text 
              style={{ color: 'white', fontWeight: 'bold' }}
              onPress={onTiempoAgotado}
            >
              Saltar descanso
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Vista normal del temporizador circular para ejercicios (no descanso)
  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent'
      }}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Muestra el tiempo restante para el ejercicio actual"
      accessibilityRole="timer"
    >
      <Canvas style={{ width: containerWidth, height: containerHeight }}>
        {/* Círculo de fondo */}
        <Circle
          cx={CX}
          cy={CY}
          r={RADIO}
          color={isDarkMode ? "#333" : "#D8D6D2"}
          style="stroke"
          strokeWidth={13}
        >
          <Shadow dx={0} dy={0} blur={10} color={isDarkMode ? "#000" : "rgba(0,0,0,0.1)"} />
        </Circle>

        {/* Arco de progreso */}
        <Path
          path={arcPath}
          style="stroke"
          strokeWidth={15}
          strokeCap="round"
        >
          <Shadow dx={0} dy={0} blur={4} color="#038C3E" />
          <LinearGradient
            start={vec(CX - RADIO, CY)}
            end={vec(CX + RADIO, CY)}
            colors={skiaColors}
          />
        </Path>
      </Canvas>

      {/* Texto del tiempo */}
      <View 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: containerWidth,
          height: containerHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text 
          style={{ 
            color: isDarkMode ? "#FFF" : colors.text, 
            fontSize: 24, 
            fontWeight: "bold", 
            marginLeft: 4 
          }}
        >
          {formattedMinutes} : {formattedSeconds}
          <Text style={{ color: "#FFD700", fontSize: 16 }}> {formattedCentiseconds}</Text>
        </Text>
        
        {/* Indicador de pausa */}
        {pausa && (
          <Text style={{ color: "#FF5252", fontSize: 14, marginTop: 8 }}>PAUSADO</Text>
        )}
      </View>
    </View>
  );
}
