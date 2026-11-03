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
