import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Client, Message } from "paho-mqtt";

interface MqttContextValue {
  client: Client | null;
  publishMessage: (topic: string, message: string) => void;
  connected: boolean;
}

export const MqttContext = createContext<MqttContextValue>({
  client: null,
  publishMessage: () => {},
  connected: false,
});

export function MqttProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // Datos del broker y configuración
  const host = "broker.mqtt-dashboard.com";
  const port = 8000; // WebSocket sin SSL
  const path = "/mqtt";
  const clientId = "myClientId_" + new Date().getTime(); // Generar un ID único

  // Función para inicializar el cliente Paho
  const initializeMqttClient = useCallback(() => {
    // Crea el cliente MQTT sobre WebSocket
    const c = new Client(host, port, path, clientId);

    c.onConnectionLost = (responseObject) => {
      setConnected(false);
    };

    c.onMessageArrived = (message: Message) => {
      console.log(
        "Mensaje recibido:",
        message.destinationName,
        message.payloadString,
      );
      // Aquí podrías manejar los mensajes entrantes si lo necesitas
    };

    // Conectar al broker
    c.connect({
      useSSL: false,
      onSuccess: () => {
        setConnected(true);
        // Ejemplo: suscribirse a un tópico si se requiere:
        // c.subscribe("test/topic", { qos: 0 });
      },
      onFailure: (error) => {
        console.error("Error al conectar MQTT:", error.errorMessage);
      },
    });

    clientRef.current = c;
  }, [host, port, path, clientId]);

  useEffect(() => {
    initializeMqttClient();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [initializeMqttClient]);

  const publishMessage = useCallback(
    (pubTopic: string, message: string) => {
      const { current: c } = clientRef;
      if (c && connected) {
        const msg = new Message(message);
        msg.destinationName = pubTopic;
        c.send(msg);
        console.log("Mensaje publicado en", pubTopic, ":", message);
      } else {
        console.warn("No conectado a MQTT, no se puede publicar.");
      }
    },
    [connected],
  );

  return (
    <MqttContext.Provider
      value={{
        client: clientRef.current,
        publishMessage,
        connected,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
}

export default MqttProvider;
