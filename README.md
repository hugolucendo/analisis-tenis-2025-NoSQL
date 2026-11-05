# Análisis de la temporada ATP 2025 con MongoDB

Tarea final de la asignatura Bases de Datos NoSQL del Máster en Big Data, Data Science e Inteligencia Artificial (UCM).

## Contenido

- `informe.pdf`: informe del trabajo.
- `datos/atp_partidos_2025.csv`: dataset original de la temporada 2025.
- `datos/atp_partidos_2025.json`: el mismo dataset en JSON, generado con el script y sin las actualizaciones de las consultas.
- `convertir_csv_a_json.py`: script que pasa el CSV a JSON.
- `consultas_tenis.js`: consultas del trabajo, en el mismo orden que el informe.
- `graficas_tenis.ipynb`: conexión a MongoDB desde Python y gráficas de algunas agregaciones.
- `graficas/`: gráficas generadas con el notebook.

## Requisitos

- MongoDB en `localhost:27017` y MongoDB Compass.
- [uv](https://docs.astral.sh/uv/) para el entorno de Python.

## Ejecución

1. Crear el entorno:

   ```
   uv sync
   ```

2. Generar el JSON. Es opcional, porque el fichero ya está en `datos/`:

   ```
   uv run python convertir_csv_a_json.py
   ```

3. En Compass, crear la base de datos `tenis-2025` con la colección `partidos` e importar `datos/atp_partidos_2025.json`.

4. Lanzar las consultas de `consultas_tenis.js` en orden, en la consola de mongosh de Compass. Hay que partir de la base de datos recién importada, porque las consultas actualizan `partidos` y crean las colecciones `niveles` y `jugadores`.

5. Abrir el notebook y ejecutar todas las celdas. Necesita que antes se hayan lanzado las consultas del paso 4:

   ```
   uv run jupyter notebook graficas_tenis.ipynb
   ```

## Datos

Los datos proceden de [TML-Database](https://github.com/Tennismylife/TML-Database).
