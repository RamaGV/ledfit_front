import os

def get_all_files_text(base_dirs, output_file):
    try:
        with open(output_file, 'w', encoding='utf-8') as output:
            for base_dir in base_dirs:
                for root, _, files in os.walk(base_dir):
                    for file in files:
                        if file.endswith('.ts') or file.endswith('.tsx') or file.endswith('.js'):
                            file_path = os.path.join(root, file)
                            with open(file_path, 'r', encoding='utf-8') as f:
                                output.write(f"// --- Contenido de {file_path} ---\n")
                                output.write(f.read())
                                output.write("\n\n")
        print(f"Archivo consolidado creado: {output_file}")
    except Exception as e:
        print(f"Error al procesar los archivos: {e}")

# Directorios a incluir en la recopilación
base_dirs = [
    "/home/rama/Escritorio/ledfit/ledfit_front/app",
    "/home/rama/Escritorio/ledfit/ledfit_front/context",
    "/home/rama/Escritorio/ledfit/ledfit_front/components"
]

# Archivo de salida
output_file = "frontend_code.txt"

get_all_files_text(base_dirs, output_file)
