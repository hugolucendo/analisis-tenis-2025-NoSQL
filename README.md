# Análisis de la temporada ATP 2025 con MongoDB

Tarea final de la asignatura Bases de Datos NoSQL del Máster en Big Data, Data Science e Inteligencia Artificial (UCM).

## Contenido

- `datos/`: CSV original de la temporada 2025 y el JSON generado a partir de él.
- `convertir_csv_a_json.py`: script que pasa el CSV a JSON con el modelo embebido.
- `consultas_tenis.js`: todas las consultas del trabajo, en el mismo orden que el informe.
- `graficas_tenis.ipynb`: conexión a MongoDB desde Python y gráficas de algunas agregaciones.
- `graficas/`: gráficas generadas con el notebook.
- `informe/`: informe en PDF y su código en LaTeX.

## Ejecución

1. Crear el entorno con `uv sync`.
2. Generar el JSON con `uv run python convertir_csv_a_json.py`.
3. Importar `datos/atp_partidos_2025.json` con MongoDB Compass en la base de datos `tenis-2025`, colección `partidos`.
4. Lanzar `consultas_tenis.js` en la consola de mongosh.
5. Ejecutar `graficas_tenis.ipynb`.

## Datos

Los datos proceden de [TML-Database](https://github.com/Tennismylife/TML-Database).
