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
      functionalStrengthImage: require("@/assets/functionalStrengthImage.png"),
      hathaYogaImage: require("@/assets/hathaYogaImage.png"),
      potenciaEnCadenaImage: require("@/assets/potenciaEnCadenaImage.png"),
      amrapImage: require("@/assets/amrapImage.png"),
      tabataImage: require("@/assets/tabataImage.png"),
      sinDescansoImage: require("@/assets/sinDescansoImage.png"),
      fundamentosImage: require("@/assets/fundamentosImage.png"),

      // Ejercicios individuales
      warrior1Image: require("@/assets/exercises/warrior1.png"),
      restImage: require("@/assets/exercises/rest.png"),
      sidePlankImage: require("@/assets/exercises/sidePlank.png"),
      oneLegDownImage: require("@/assets/exercises/oneLegDown.png"),
      halfMoonPoseImage: require("@/assets/exercises/halfMoonPose.png"),
      trianglePoseImage: require("@/assets/exercises/trianglePose.png"),
      wheelPoseImage: require("@/assets/exercises/wheelPose.png"),
      camelPoseImage: require("@/assets/exercises/camelPose.png"),
      oneLegUpImage: require("@/assets/exercises/oneLegUp.png"),
      oneLegHeadImage: require("@/assets/exercises/oneLegHead.png"),
      strokePoseImage: require("@/assets/exercises/strokePose.png"),

      // Iconos de notificaciones
      notificationTick: require("@/assets/icons/notificationTick.png"),
      notificationPlus: require("@/assets/icons/notificationPlus.png"),
      notificationTime: require("@/assets/icons/notificationTime.png"),
    };
    setImagesMap(imagesMap);
  }, []);

  return (
    <ImagesMapContext.Provider value={{ imagesMap }}>
      {children}
    </ImagesMapContext.Provider>
  );
}

export default ImagesMapContext;
