import keyboard
import pyaudio
import wave
import threading
import whisper

# Variables globales
is_recording = False
recording_thread = None
frames = []

# Parámetros de audio
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000          # Whisper funciona bien con audio de 16kHz
CHUNK = 1024

def record_audio():
    global frames, is_recording
    p = pyaudio.PyAudio()
    sample_width = p.get_sample_size(FORMAT)
    
    # Abrir stream de audio
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)
    
    frames = []
    print("Grabando... presiona 'g' nuevamente para detener.")

    while is_recording:
        try:
            data = stream.read(CHUNK)
            frames.append(data)
        except Exception as e:
            print("Error al leer audio:", e)
            break

    print("Grabación detenida.")

    # Detener y cerrar el stream
    stream.stop_stream()
    stream.close()
    p.terminate()

    # Guardar audio en un archivo WAV en el mismo directorio
    audio_filename = "grabacion.wav"
    wf = wave.open(audio_filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(sample_width)
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    print(f"Audio guardado en: {audio_filename}")

    # Transcribir el audio usando Whisper
    print("Transcribiendo audio con Whisper...")
    model = whisper.load_model("base")
    result = model.transcribe(audio_filename)
    transcription = result.get("text", "").strip()

    # Guardar la transcripción en un archivo de texto
    transcription_filename = "transcripcion.txt"
    with open(transcription_filename, "w", encoding="utf-8") as f:
        f.write(transcription)
    print(f"Transcripción guardada en: {transcription_filename}")

def toggle_recording():
    global is_recording, recording_thread
    if not is_recording:
        # Iniciar grabación
        is_recording = True
        recording_thread = threading.Thread(target=record_audio)
        recording_thread.start()
    else:
        # Detener grabación
        is_recording = False
        recording_thread.join()

def main():
    print("Presiona 'g' para iniciar/detener la grabación.")
    print("Presiona 'esc' para salir del programa.")
    # Asignar la tecla 'g' para iniciar/detener la grabación
    keyboard.add_hotkey('g', toggle_recording)
    keyboard.wait('esc')

if __name__ == "__main__":
    main()
