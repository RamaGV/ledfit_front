import React, { createContext, useState, useEffect } from "react";

interface ImagesMap {
  [key: string]: any;
}

interface ImagesMapContextValue {
  imagesMap: ImagesMap;
}

export const ImagesMapContext = createContext<ImagesMapContextValue>({
  imagesMap: {},
});

export function ImagesMapProvider({ children }: { children: React.ReactNode }) {
  const [imagesMap, setImagesMap] = useState<ImagesMap>({});
  useEffect(() => {
    const imagesMap: { [key: string]: any } = {
      // Entrenamientos
      yogaIntermedioImage: require("@/assets/entrenamientos/yogaIntermedioImage.webp"),
      flexibilidadPrincipianteImage: require("@/assets/entrenamientos/flexibilidadPrincipianteImage.webp"),
      hiitParaPrincipiantesImage: require("@/assets/entrenamientos/hiitParaPrincipiantesImage.webp"),
      fuerzaTotalIntermedioImage: require("@/assets/entrenamientos/fuerzaTotalIntermedioImage.webp"),
      crossfitAvanzadoImage: require("@/assets/entrenamientos/crossfitAvanzadoImage.webp"),

      // Ejercicios
      perroBocaAbajoImage: require("@/assets/ejercicios/perroBocaAbajoImage.webp"),
      deadliftImage: require("@/assets/ejercicios/deadliftImage.webp"),
      pressBancaImage: require("@/assets/ejercicios/pressBancaImage.webp"),
      dominadasImage: require("@/assets/ejercicios/dominadasImage.webp"),
      highKneesImage: require("@/assets/ejercicios/highKneesImage.webp"),
      burpeesImage: require("@/assets/ejercicios/burpeesImage.webp"),
      warrior1Image: require("@/assets/ejercicios/warrior1Image.webp"),
      pesoMuertoImage: require("@/assets/ejercicios/pesoMuertoImage.webp"),
      posturaDelGatoImage: require("@/assets/ejercicios/posturaDelGatoImage.webp"),
      kettlebellSwingImage: require("@/assets/ejercicios/kettlebellSwingImage.webp"),
      fondosTricepsImage: require("@/assets/ejercicios/fondosTricepsImage.webp"),
      squatJumpImage: require("@/assets/ejercicios/squatJumpImage.webp"),
      boxJumpImage: require("@/assets/ejercicios/boxJumpImage.webp"),
      zancadaConRotacionImage: require("@/assets/ejercicios/zancadaConRotacionImage.webp"),
      mountainClimbersImage: require("@/assets/ejercicios/mountainClimbersImage.webp"),
      pressMilitarImage: require("@/assets/ejercicios/pressMilitarImage.webp"),
      estiramientoAductoresImage: require("@/assets/ejercicios/estiramientoAductoresImage.webp"),
      remoBarraBajaImage: require("@/assets/ejercicios/remoBarraBajaImage.webp"),
      sidePlankImage: require("@/assets/ejercicios/sidePlankImage.webp"),
      sentadillaProfundaImage: require("@/assets/ejercicios/sentadillaProfundaImage.webp"),
      curlBicepsBarraImage: require("@/assets/ejercicios/curlBicepsBarraImage.webp"),
      trianglePoseImage: require("@/assets/ejercicios/trianglePoseImage.webp"),
      wallBallShotImage: require("@/assets/ejercicios/wallBallShotImage.webp"),
      jumpingJacksImage: require("@/assets/ejercicios/jumpingJacksImage.webp"),
      plankToPushUpImage: require("@/assets/ejercicios/plankToPushUpImage.webp"),

      // Iconos de notificaciones
      notifCheck: require("@/assets/icons/notifCheck.png"),
      notifPlus: require("@/assets/icons/notifPlus.png"),
      notifTime: require("@/assets/icons/notifTime.png"),
    };
    setImagesMap(imagesMap);
  }, []);

  return (
    <ImagesMapContext.Provider value={{ imagesMap }}>
      {children}
    </ImagesMapContext.Provider>
  );
}

export const useImagesMap = () => {
  const context = React.useContext(ImagesMapContext);
  if (!context) {
    throw new Error("useImagesMap must be used within a ImagesMapProvider");
  }
  return context;
};

export default ImagesMapContext;
