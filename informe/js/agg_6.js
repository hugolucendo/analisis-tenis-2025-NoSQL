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
