import os

# Ruta a la carpeta donde están las imágenes
path_to_images = "/home/rama/Escritorio/ledfit/ledfit_front/assets/entrenamientos"

# Filtrar solo archivos con extensiones de imagen válidas
valid_extensions = [".png", ".jpg", ".jpeg", ".webp"]
image_files = [f for f in os.listdir(path_to_images) if os.path.splitext(f)[1].lower() in valid_extensions]

# Escribir los nombres de las imágenes en un archivo de texto
output_file = "image_names.txt"
with open(output_file, "w") as file:
    for image in image_files:
        file.write(f"{os.path.splitext(image)[0]}\n")

print(f"Nombres de las imágenes escritos en: {output_file}")