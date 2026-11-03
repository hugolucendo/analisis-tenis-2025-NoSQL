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
var query = { "fecha": "2026-01-02" }
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


// ---------------- 3. PIPELINE DE AGREGACION ----------------

// Partidos y duracion media por superficie
var fase1 = { $group: { "_id": "$superficie", "partidos": { $sum: 1 }, "media_minutos": { $avg: "$minutos" } } }
var fase2 = { $sort: { "partidos": -1 } }
var etapas = [ fase1, fase2 ]
db.partidos.aggregate(etapas)

// Los 10 jugadores con mas victorias
var fase1 = { $group: { "_id": "$ganador.nombre", "victorias": { $sum: 1 } } }
var fase2 = { $sort: { "victorias": -1 } }
var fase3 = { $limit: 10 }
var etapas = [ fase1, fase2, fase3 ]
db.partidos.aggregate(etapas)

// Jugadores con mas titulos y que torneos ganaron
var fase1 = { $match: { "ronda": "F" } }
var fase2 = { $group: { "_id": "$ganador.nombre", "titulos": { $sum: 1 }, "torneos": { $push: "$torneo" } } }
var fase3 = { $sort: { "titulos": -1 } }
var fase4 = { $limit: 5 }
var etapas = [ fase1, fase2, fase3, fase4 ]
db.partidos.aggregate(etapas)

// Porcentaje de victorias de los jugadores con al menos 40 partidos
var jugadores = [ { "nombre": "$ganador.nombre", "victoria": 1 }, { "nombre": "$perdedor.nombre", "victoria": 0 } ]
var fase1 = { $project: { "_id": 0, "jugadores": jugadores } }
var fase2 = { $unwind: "$jugadores" }
var fase3 = { $group: { "_id": "$jugadores.nombre", "partidos": { $sum: 1 }, "victorias": { $sum: "$jugadores.victoria" } } }
var fase4 = { $match: { "partidos": { $gte: 40 } } }
var fase5 = { $addFields: { "porcentaje": { $multiply: [ { $divide: [ "$victorias", "$partidos" ] }, 100 ] } } }
var fase6 = { $sort: { "porcentaje": -1 } }
var fase7 = { $limit: 10 }
var etapas = [ fase1, fase2, fase3, fase4, fase5, fase6, fase7 ]
db.partidos.aggregate(etapas)

// Duracion media por superficie separando partidos al mejor de 3 y de 5 sets
var fase1 = { $match: { "minutos": { $ne: null } } }
var fase2 = { $group: { "_id": { "superficie": "$superficie", "al_mejor_de": "$al_mejor_de" }, "partidos": { $sum: 1 }, "media_minutos": { $avg: "$minutos" } } }
var fase3 = { $sort: { "_id.al_mejor_de": 1, "media_minutos": -1 } }
var etapas = [ fase1, fase2, fase3 ]
db.partidos.aggregate(etapas)

// Partidos sin duracion por torneo
var fase1 = { $match: { "minutos": null } }
var fase2 = { $group: { "_id": "$torneo", "partidos": { $sum: 1 } } }
var fase3 = { $sort: { "partidos": -1 } }
var fase4 = { $limit: 5 }
var etapas = [ fase1, fase2, fase3, fase4 ]
db.partidos.aggregate(etapas)

// Puntos que suman los titulos de cada jugador (uniendo con la coleccion niveles)
var fase1 = { $match: { "ronda": "F" } }
var fase2 = { $lookup: { from: "niveles", localField: "nivel", foreignField: "codigo", as: "info_nivel" } }
var fase3 = { $unwind: "$info_nivel" }
var fase4 = { $group: { "_id": "$ganador.nombre", "titulos": { $sum: 1 }, "puntos": { $sum: "$info_nivel.puntos_campeon" }, "tipos": { $push: "$info_nivel.nombre" } } }
var fase5 = { $sort: { "puntos": -1 } }
var fase6 = { $limit: 5 }
var etapas = [ fase1, fase2, fase3, fase4, fase5, fase6 ]
db.partidos.aggregate(etapas)

// Porcentaje de sets que acaban en tiebreak por superficie
var fase1 = { $unwind: "$sets" }
var fase2 = { $match: { "sets.juegos_ganador": { $ne: null } } }
var es_tiebreak = { $cond: [ { $ne: [ "$sets.tiebreak", null ] }, 1, 0 ] }
var fase3 = { $group: { "_id": "$superficie", "sets": { $sum: 1 }, "tiebreaks": { $sum: es_tiebreak } } }
var fase4 = { $addFields: { "porcentaje": { $multiply: [ { $divide: [ "$tiebreaks", "$sets" ] }, 100 ] } } }
var fase5 = { $sort: { "porcentaje": -1 } }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate(etapas)

// Aces por partido y por juego de saque en cada superficie
var fase1 = { $match: { "con_estadisticas": true } }
var fase2 = { $addFields: { "aces_partido": { $add: [ "$ganador.estadisticas.aces", "$perdedor.estadisticas.aces" ] }, "juegos_saque_partido": { $add: [ "$ganador.estadisticas.juegos_saque", "$perdedor.estadisticas.juegos_saque" ] } } }
var fase3 = { $group: { "_id": "$superficie", "partidos": { $sum: 1 }, "media_aces": { $avg: "$aces_partido" }, "total_aces": { $sum: "$aces_partido" }, "total_juegos_saque": { $sum: "$juegos_saque_partido" } } }
var fase4 = { $addFields: { "aces_por_juego_saque": { $divide: [ "$total_aces", "$total_juegos_saque" ] } } }
var fase5 = { $sort: { "aces_por_juego_saque": -1 } }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate(etapas)

// Porcentaje de sorpresas (gana el peor clasificado) por tipo de torneo
var fase1 = { $match: { "ganador.ranking": { $ne: null }, "perdedor.ranking": { $ne: null } } }
var es_sorpresa = { $cond: [ { $gt: [ "$ganador.ranking", "$perdedor.ranking" ] }, 1, 0 ] }
var fase2 = { $group: { "_id": "$nivel", "partidos": { $sum: 1 }, "sorpresas": { $sum: es_sorpresa } } }
var fase3 = { $lookup: { from: "niveles", localField: "_id", foreignField: "codigo", as: "info_nivel" } }
var fase4 = { $unwind: "$info_nivel" }
var fase5 = { $project: { "_id": 0, "nivel": "$info_nivel.nombre", "partidos": 1, "sorpresas": 1, "porcentaje": { $multiply: [ { $divide: [ "$sorpresas", "$partidos" ] }, 100 ] } } }
var fase6 = { $sort: { "porcentaje": -1 } }
var etapas = [ fase1, fase2, fase3, fase4, fase5, fase6 ]
db.partidos.aggregate(etapas)

// Las 5 mayores sorpresas por diferencia de ranking (sin Copa Davis ni torneos por equipos)
var fase1 = { $match: { "ganador.ranking": { $ne: null }, "perdedor.ranking": { $ne: null }, "final": "completo", "nivel": { $in: [ "G", "M", "500", "250" ] } } }
var fase2 = { $addFields: { "diferencia": { $subtract: [ "$ganador.ranking", "$perdedor.ranking" ] } } }
var fase3 = { $sort: { "diferencia": -1 } }
var fase4 = { $limit: 5 }
var fase5 = { $project: { "_id": 0, "torneo": 1, "ronda": 1, "ganador.nombre": 1, "ganador.ranking": 1, "perdedor.nombre": 1, "perdedor.ranking": 1, "diferencia": 1 } }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate(etapas)

// Media de aces por partido segun la altura del jugador
var jugadores = [ { "altura": "$ganador.altura", "aces": "$ganador.estadisticas.aces" }, { "altura": "$perdedor.altura", "aces": "$perdedor.estadisticas.aces" } ]
var fase1 = { $match: { "con_estadisticas": true } }
var fase2 = { $project: { "_id": 0, "jugadores": jugadores } }
var fase3 = { $unwind: "$jugadores" }
var fase4 = { $match: { "jugadores.altura": { $ne: null } } }
var fase5 = { $bucket: { groupBy: "$jugadores.altura", boundaries: [ 165, 175, 180, 185, 190, 195, 200, 215 ], default: "Otros", output: { "partidos": { $sum: 1 }, "media_aces": { $avg: "$jugadores.aces" } } } }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate(etapas)

// Victorias de Alcaraz y Sinner por mes
var fase1 = { $match: { "ganador.nombre": { $in: [ "Carlos Alcaraz", "Jannik Sinner" ] } } }
var fase2 = { $addFields: { "fecha_date": { $toDate: "$fecha" } } }
var fase3 = { $group: { "_id": { "jugador": "$ganador.nombre", "mes": { $month: "$fecha_date" } }, "victorias": { $sum: 1 } } }
var fase4 = { $sort: { "_id.jugador": 1, "_id.mes": 1 } }
var etapas = [ fase1, fase2, fase3, fase4 ]
db.partidos.aggregate(etapas)

// Guardar el balance de todos los jugadores en una coleccion nueva para el notebook
var jugadores = [ { "nombre": "$ganador.nombre", "pais": "$ganador.pais", "victoria": 1 }, { "nombre": "$perdedor.nombre", "pais": "$perdedor.pais", "victoria": 0 } ]
var fase1 = { $project: { "_id": 0, "jugadores": jugadores } }
var fase2 = { $unwind: "$jugadores" }
var fase3 = { $group: { "_id": "$jugadores.nombre", "pais": { $first: "$jugadores.pais" }, "partidos": { $sum: 1 }, "victorias": { $sum: "$jugadores.victoria" } } }
var fase4 = { $addFields: { "porcentaje": { $multiply: [ { $divide: [ "$victorias", "$partidos" ] }, 100 ] } } }
var fase5 = { $out: "jugadores" }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate(etapas)
db.jugadores.countDocuments({})
db.jugadores.find().sort({ "victorias": -1 }).limit(3)
