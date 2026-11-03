use tenis-2025

// ---------------- 1. CARGA DEL DATASET ----------------

// Total de partidos cargados
db.partidos.countDocuments({})

// Un partido para ver la estructura
db.partidos.findOne()


// ---------------- 2. INSERCION, ACTUALIZACION, PROYECCION Y FILTRADO ----------------

// Superficies que hay
db.partidos.distinct("superficie")

// Traducir las superficies al castellano
var query = { "superficie": "Hard" }
var operacion = { $set: { "superficie": "Dura" } }
db.partidos.updateMany(query, operacion)

var query = { "superficie": "Clay" }
var operacion = { $set: { "superficie": "Tierra" } }
db.partidos.updateMany(query, operacion)

var query = { "superficie": "Grass" }
var operacion = { $set: { "superficie": "Hierba" } }
db.partidos.updateMany(query, operacion)

db.partidos.distinct("superficie")

// Partidos sin estadisticas de saque
var query = { "ganador.estadisticas.aces": null }
db.partidos.countDocuments(query)

// Marcar si el partido tiene estadisticas o no
var query = { "ganador.estadisticas.aces": null }
var operacion = { $set: { "con_estadisticas": false } }
db.partidos.updateMany(query, operacion)

var query = { "con_estadisticas": { $exists: false } }
var operacion = { $set: { "con_estadisticas": true } }
db.partidos.updateMany(query, operacion)

// Nueva coleccion con el nombre de cada nivel de torneo y los puntos que da al campeon
var array_niveles = [
    { "codigo": "G", "nombre": "Grand Slam", "puntos_campeon": 2000 },
    { "codigo": "F", "nombre": "ATP Finals", "puntos_campeon": 1500 },
    { "codigo": "M", "nombre": "Masters 1000", "puntos_campeon": 1000 },
    { "codigo": "500", "nombre": "ATP 500", "puntos_campeon": 500 },
    { "codigo": "250", "nombre": "ATP 250", "puntos_campeon": 250 },
    { "codigo": "D", "nombre": "Copa Davis" },
    { "codigo": "A", "nombre": "Otros (United Cup, Laver Cup, Next Gen)" }
]
db.niveles.insertMany(array_niveles)
db.niveles.find()

// Insertar un partido de 2026 (primer partido de la United Cup)
var nuevo_partido = { "torneo": "United Cup", "superficie": "Dura", "nivel": "A", "fecha": "2026-01-02", "ronda": "RR", "resultado": "6-4 6-4", "ganador": { "nombre": "Sebastian Baez", "pais": "ARG", "ranking": 45 }, "perdedor": { "nombre": "Jaume Munar", "pais": "ESP", "ranking": 33 } }
db.partidos.insertOne(nuevo_partido)

var query = { "fecha": "2026-01-02" }
db.partidos.find(query)

// Completar el partido con la duracion y los sets
var query = { "fecha": "2026-01-02" }
var operacion = { $set: { "minutos": 103 } }
db.partidos.updateOne(query, operacion)

var set1 = { "juegos_ganador": 6, "juegos_perdedor": 4, "tiebreak": null }
var set2 = { "juegos_ganador": 6, "juegos_perdedor": 4, "tiebreak": null }
var operacion = { $push: { "sets": { $each: [ set1, set2 ] } } }
db.partidos.updateOne(query, operacion)
db.partidos.find(query)

// Borrarlo porque el analisis es solo de 2025
db.partidos.deleteOne(query)
db.partidos.countDocuments({})

// Final de Roland Garros
var query = { "torneo": "Roland Garros", "ronda": "F" }
var proyeccion = { "_id": 0, "fecha": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1, "minutos": 1 }
db.partidos.find(query, proyeccion)

// Finales de los cuatro Grand Slam
var query = { "nivel": "G", "ronda": "F" }
var proyeccion = { "_id": 0, "torneo": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1 }
db.partidos.find(query, proyeccion).sort({ "fecha": 1 })

// Partidos ganados y perdidos por Alcaraz y por Sinner
db.partidos.countDocuments({ "ganador.nombre": "Carlos Alcaraz" })
db.partidos.countDocuments({ "perdedor.nombre": "Carlos Alcaraz" })
db.partidos.countDocuments({ "ganador.nombre": "Jannik Sinner" })
db.partidos.countDocuments({ "perdedor.nombre": "Jannik Sinner" })

// Partidos entre Alcaraz y Sinner
var query1 = { "ganador.nombre": "Carlos Alcaraz", "perdedor.nombre": "Jannik Sinner" }
var query2 = { "ganador.nombre": "Jannik Sinner", "perdedor.nombre": "Carlos Alcaraz" }
var logic = { $or: [ query1, query2 ] }
var proyeccion = { "_id": 0, "fecha": 1, "torneo": 1, "ronda": 1, "superficie": 1, "ganador.nombre": 1, "resultado": 1 }
db.partidos.find(logic, proyeccion).sort({ "fecha": 1 })

// Partidos con algun español y partidos ganados por españoles
var logic = { $or: [ { "ganador.pais": "ESP" }, { "perdedor.pais": "ESP" } ] }
db.partidos.countDocuments(logic)
db.partidos.countDocuments({ "ganador.pais": "ESP" })

// Los 5 partidos mas largos
var query = { "minutos": { $ne: null } }
var proyeccion = { "_id": 0, "torneo": 1, "ronda": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1, "minutos": 1 }
db.partidos.find(query, proyeccion).sort({ "minutos": -1 }).limit(5)

// Como acabaron los partidos
db.partidos.countDocuments({ "final": "completo" })
db.partidos.countDocuments({ "final": "retirada" })
db.partidos.countDocuments({ "final": "walkover" })

// Partidos que llegaron a 5 sets
db.partidos.countDocuments({ "sets": { $size: 5 } })

// Partidos con al menos un tiebreak
db.partidos.countDocuments({ "sets.tiebreak.puntos_ganador": { $exists: true } })

// Partidos ganados aunque el ganador perdio algun set 6-7
// sin $elemMatch las dos condiciones se pueden cumplir en sets distintos
db.partidos.countDocuments({ "sets.juegos_ganador": 6, "sets.juegos_perdedor": 7 })
var query = { "sets": { $elemMatch: { "juegos_ganador": 6, "juegos_perdedor": 7 } } }
db.partidos.countDocuments(query)

// Partidos ganados despues de perder un set 0-6
var query = { "sets": { $elemMatch: { "juegos_ganador": 0, "juegos_perdedor": 6 } } }
var proyeccion = { "_id": 0, "torneo": 1, "ronda": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1 }
db.partidos.find(query, proyeccion)
