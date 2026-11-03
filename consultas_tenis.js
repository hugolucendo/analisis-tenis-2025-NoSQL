use tenis-2025

// 1. CARGA DEL DATASET

// Numero de partidos cargados
db.partidos.countDocuments({})

// Estructura de un partido
db.partidos.findOne()


// 2. INSERCION, ACTUALIZACION, PROYECCION Y FILTRADO

// Traducir las superficies al castellano
db.partidos.distinct("superficie")

var query = { "superficie": "Hard" }
var operacion = { $set: { "superficie": "Dura" } }
db.partidos.updateMany( query, operacion )

var query = { "superficie": "Clay" }
var operacion = { $set: { "superficie": "Tierra" } }
db.partidos.updateMany( query, operacion )

var query = { "superficie": "Grass" }
var operacion = { $set: { "superficie": "Hierba" } }
db.partidos.updateMany( query, operacion )

db.partidos.distinct("superficie")

// Marcar los partidos que tienen estadisticas y los que no
var query = { "ganador.estadisticas.aces": null }
db.partidos.countDocuments( query )

var operacion = { $set: { "con_estadisticas": false } }
db.partidos.updateMany( query, operacion )

var query = { "con_estadisticas": { $exists: false } }
var operacion = { $set: { "con_estadisticas": true } }
db.partidos.updateMany( query, operacion )

// Coleccion con el nombre de cada nivel de torneo y los puntos que da al campeon
var array_niveles = [
    { "codigo": "G", "nombre": "Grand Slam", "puntos_campeon": 2000 },
    { "codigo": "F", "nombre": "ATP Finals", "puntos_campeon": 1500 },
    { "codigo": "M", "nombre": "Masters 1000", "puntos_campeon": 1000 },
    { "codigo": "500", "nombre": "ATP 500", "puntos_campeon": 500 },
    { "codigo": "250", "nombre": "ATP 250", "puntos_campeon": 250 },
    { "codigo": "D", "nombre": "Copa Davis" },
    { "codigo": "A", "nombre": "Otros (United Cup, Laver Cup, Next Gen)" }
]
db.niveles.insertMany( array_niveles )
db.niveles.find()

// Insertar un partido de 2026, completarlo y borrarlo
var ganador = { "nombre": "Sebastian Baez", "pais": "ARG", "ranking": 45 }
var perdedor = { "nombre": "Jaume Munar", "pais": "ESP", "ranking": 33 }
var nuevo_partido = { "torneo": "United Cup", "superficie": "Dura", "nivel": "A", "fecha": "2026-01-02", "ronda": "RR", "resultado": "6-4 6-4", "ganador": ganador, "perdedor": perdedor }
db.partidos.insertOne( nuevo_partido )

var query = { "fecha": "2026-01-02" }
db.partidos.find( query )

var operacion = { $set: { "minutos": 103 } }
db.partidos.updateOne( query, operacion )

var set1 = { "juegos_ganador": 6, "juegos_perdedor": 4, "tiebreak": null }
var set2 = { "juegos_ganador": 6, "juegos_perdedor": 4, "tiebreak": null }
var operacion = { $push: { "sets": { $each: [ set1, set2 ] } } }
db.partidos.updateOne( query, operacion )
db.partidos.find( query )

db.partidos.deleteOne( query )
db.partidos.countDocuments({})

// Finales de los cuatro Grand Slam
var query = { "nivel": "G", "ronda": "F" }
var proyeccion = { "_id": 0, "torneo": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1, "minutos": 1 }
var opcion = { "fecha": 1 }
db.partidos.find( query, proyeccion ).sort( opcion )

// Partidos entre Alcaraz y Sinner
var query1 = { "ganador.nombre": "Carlos Alcaraz", "perdedor.nombre": "Jannik Sinner" }
var query2 = { "ganador.nombre": "Jannik Sinner", "perdedor.nombre": "Carlos Alcaraz" }
var logic = { $or: [ query1, query2 ] }
var proyeccion = { "_id": 0, "torneo": 1, "ronda": 1, "superficie": 1, "ganador.nombre": 1, "resultado": 1 }
var opcion = { "fecha": 1 }
db.partidos.find( logic, proyeccion ).sort( opcion )

// Los 5 partidos mas largos
var query = { "minutos": { $ne: null } }
var proyeccion = { "_id": 0, "torneo": 1, "ronda": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1, "minutos": 1 }
var opcion = { "minutos": -1 }
db.partidos.find( query, proyeccion ).sort( opcion ).limit(5)

// Partidos que llegaron a 5 sets
var query = { "sets": { $size: 5 } }
db.partidos.countDocuments( query )

// Partidos ganados aunque el ganador perdio algun set 6-7
// sin $elemMatch las dos condiciones se pueden cumplir en sets distintos
var query = { "sets.juegos_ganador": 6, "sets.juegos_perdedor": 7 }
db.partidos.countDocuments( query )

var query = { "sets": { $elemMatch: { "juegos_ganador": 6, "juegos_perdedor": 7 } } }
db.partidos.countDocuments( query )


// 3. PIPELINE DE AGREGACION

// Partidos y duracion media por superficie
var query1 = { "_id": "$superficie", "partidos": { $sum: 1 }, "media_minutos": { $avg: "$minutos" } }
var fase1 = { $group: query1 }
var query2 = { "partidos": -1 }
var fase2 = { $sort: query2 }
var etapas = [ fase1, fase2 ]
db.partidos.aggregate( etapas )

// Duracion media por superficie separando partidos al mejor de 3 y de 5 sets
var query1 = { "minutos": { $ne: null } }
var fase1 = { $match: query1 }
var grupo = { "superficie": "$superficie", "al_mejor_de": "$al_mejor_de" }
var query2 = { "_id": grupo, "partidos": { $sum: 1 }, "media_minutos": { $avg: "$minutos" } }
var fase2 = { $group: query2 }
var query3 = { "_id.al_mejor_de": 1, "media_minutos": -1 }
var fase3 = { $sort: query3 }
var etapas = [ fase1, fase2, fase3 ]
db.partidos.aggregate( etapas )

// Titulos de cada jugador y puntos que suman (uniendo con la coleccion niveles)
var query1 = { "ronda": "F" }
var fase1 = { $match: query1 }
var query2 = { from: "niveles", localField: "nivel", foreignField: "codigo", as: "info_nivel" }
var fase2 = { $lookup: query2 }
var fase3 = { $unwind: "$info_nivel" }
var query4 = { "_id": "$ganador.nombre", "titulos": { $sum: 1 }, "puntos": { $sum: "$info_nivel.puntos_campeon" }, "torneos": { $push: "$torneo" } }
var fase4 = { $group: query4 }
var query5 = { "puntos": -1 }
var fase5 = { $sort: query5 }
var fase6 = { $limit: 5 }
var etapas = [ fase1, fase2, fase3, fase4, fase5, fase6 ]
db.partidos.aggregate( etapas )

// Balance de todos los jugadores guardado en una coleccion nueva
var jugador1 = { "nombre": "$ganador.nombre", "pais": "$ganador.pais", "victoria": 1 }
var jugador2 = { "nombre": "$perdedor.nombre", "pais": "$perdedor.pais", "victoria": 0 }
var query1 = { "_id": 0, "jugadores": [ jugador1, jugador2 ] }
var fase1 = { $project: query1 }
var fase2 = { $unwind: "$jugadores" }
var query3 = { "_id": "$jugadores.nombre", "pais": { $first: "$jugadores.pais" }, "partidos": { $sum: 1 }, "victorias": { $sum: "$jugadores.victoria" } }
var fase3 = { $group: query3 }
var porcentaje = { $multiply: [ { $divide: [ "$victorias", "$partidos" ] }, 100 ] }
var query4 = { "porcentaje": porcentaje }
var fase4 = { $addFields: query4 }
var fase5 = { $out: "jugadores" }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate( etapas )

// Mejores porcentajes de victoria con al menos 40 partidos (sobre la coleccion guardada)
db.jugadores.countDocuments({})
var query = { "partidos": { $gte: 40 } }
var opcion = { "porcentaje": -1 }
db.jugadores.find( query ).sort( opcion ).limit(10)

// Porcentaje de sets que acaban en tiebreak por superficie
var fase1 = { $unwind: "$sets" }
var query2 = { "sets.juegos_ganador": { $ne: null } }
var fase2 = { $match: query2 }
var es_tiebreak = { $cond: [ { $ne: [ "$sets.tiebreak", null ] }, 1, 0 ] }
var query3 = { "_id": "$superficie", "sets": { $sum: 1 }, "tiebreaks": { $sum: es_tiebreak } }
var fase3 = { $group: query3 }
var porcentaje = { $multiply: [ { $divide: [ "$tiebreaks", "$sets" ] }, 100 ] }
var query4 = { "porcentaje": porcentaje }
var fase4 = { $addFields: query4 }
var query5 = { "porcentaje": -1 }
var fase5 = { $sort: query5 }
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate( etapas )

// Media de aces por partido segun la altura del jugador
var jugador1 = { "altura": "$ganador.altura", "aces": "$ganador.estadisticas.aces" }
var jugador2 = { "altura": "$perdedor.altura", "aces": "$perdedor.estadisticas.aces" }
var query1 = { "con_estadisticas": true }
var fase1 = { $match: query1 }
var query2 = { "_id": 0, "jugadores": [ jugador1, jugador2 ] }
var fase2 = { $project: query2 }
var fase3 = { $unwind: "$jugadores" }
var query4 = { "jugadores.altura": { $ne: null } }
var fase4 = { $match: query4 }
var fase5 = {
    $bucket: {
        groupBy: "$jugadores.altura",
        boundaries: [ 165, 175, 180, 185, 190, 195, 200, 215 ],
        default: "Otros",
        output: {
            "partidos": { $sum: 1 },
            "media_aces": { $avg: "$jugadores.aces" }
        }
    }
}
var etapas = [ fase1, fase2, fase3, fase4, fase5 ]
db.partidos.aggregate( etapas )

// Victorias de Alcaraz y Sinner por mes
var query1 = { "ganador.nombre": { $in: [ "Carlos Alcaraz", "Jannik Sinner" ] } }
var fase1 = { $match: query1 }
var fase2 = { $addFields: { "fecha_date": { $toDate: "$fecha" } } }
var grupo = { "jugador": "$ganador.nombre", "mes": { $month: "$fecha_date" } }
var query3 = { "_id": grupo, "victorias": { $sum: 1 } }
var fase3 = { $group: query3 }
var query4 = { "_id.jugador": 1, "_id.mes": 1 }
var fase4 = { $sort: query4 }
var etapas = [ fase1, fase2, fase3, fase4 ]
db.partidos.aggregate( etapas )
