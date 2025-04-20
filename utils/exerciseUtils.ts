/**
 * Utilidades para manejo de ejercicios y entrenamientos
 */

export type Etapa = "INICIO" | "ACTIVO" | "DESCANSO" | "FIN";

/**
 * ID del ejercicio de descanso en la base de datos
 */
export const DESCANSO_ID = "67bc1a7372e1e0091651e944";

/**
 * Compara IDs de MongoDB de forma segura
 *
 * @param id1 Primer ID (puede ser string u objeto con _id)
 * @param id2 Segundo ID (puede ser string u objeto con _id)
 * @returns true si los IDs son iguales
 */
export const compareMongoIds = (id1: any, id2: any): boolean => {
  // Extraer el valor de _id si es un objeto, o usar el valor directamente si es string
  const getId = (id: any): string => {
    if (!id) return "";
    if (typeof id === "object" && id !== null) {
      return id._id ? id._id.toString().trim() : "";
    }
    return id.toString().trim();
  };

  const str1 = getId(id1);
  const str2 = getId(id2);

  return str1 === str2;
};

/**
 * Determina si un ejercicio es un periodo de descanso
 *
 * @param ejercicio Ejercicio o ID de ejercicio
 * @returns true si es ejercicio de descanso
 */
export const isRestExercise = (ejercicio: any): boolean => {
  if (!ejercicio) return false;

  // Si el ejercicio tiene 'ejercicioId' es porque viene del formato de entrenamiento
  const id = ejercicio.ejercicioId || ejercicio;
  return compareMongoIds(id, DESCANSO_ID);
};

/**
 * Calcula información sobre los ejercicios reales (no descansos) de un entrenamiento
 */
export const calculateRealExercises = (
  selectedEntrenamiento: any,
  currentIndex: number,
) => {
  if (!selectedEntrenamiento) {
    return {
      ejerciciosReales: [],
      indiceReal: 0,
      totalEjerciciosReales: 0,
      siguienteEsDescanso: false,
      siguienteIndiceReal: 0,
    };
  }

  // Filtrar solo los ejercicios reales (no descansos)
  const reales = selectedEntrenamiento.ejercicios.filter(
    (ejercicio: any) => ejercicio.ejercicioId.toString() !== DESCANSO_ID,
  );

  // Determinar el índice real (contando solo ejercicios, no descansos)
  let realIndex = 0;
  let nextRealIndex = 0;
  let isNextRestPeriod = false;

  // Contar cuántos ejercicios reales han pasado hasta el índice actual
  for (let i = 0; i < currentIndex; i++) {
    if (
      selectedEntrenamiento.ejercicios[i].ejercicioId.toString() !== DESCANSO_ID
    ) {
      realIndex++;
    }
  }

  // Verificar si el siguiente es un descanso
  if (currentIndex + 1 < selectedEntrenamiento.ejercicios.length) {
    isNextRestPeriod =
      selectedEntrenamiento.ejercicios[
        currentIndex + 1
      ].ejercicioId.toString() === DESCANSO_ID;

    // Calcular el siguiente índice real
    nextRealIndex = realIndex;
    const currentIsRest =
      selectedEntrenamiento.ejercicios[currentIndex].ejercicioId.toString() ===
      DESCANSO_ID;

    if (!isNextRestPeriod && !currentIsRest) {
      nextRealIndex = realIndex + 1;
    } else if (currentIsRest) {
      nextRealIndex = realIndex + 1;
    }
  }

  return {
    ejerciciosReales: reales,
    indiceReal: realIndex,
    totalEjerciciosReales: reales.length,
    siguienteEsDescanso: isNextRestPeriod,
    siguienteIndiceReal: nextRealIndex,
  };
};
