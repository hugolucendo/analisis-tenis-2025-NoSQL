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
