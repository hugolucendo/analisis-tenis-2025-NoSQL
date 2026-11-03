var query1 = { "_id": "$superficie", "partidos": { $sum: 1 }, "media_minutos": { $avg: "$minutos" } }
var fase1 = { $group: query1 }
var query2 = { "partidos": -1 }
var fase2 = { $sort: query2 }
var etapas = [ fase1, fase2 ]
db.partidos.aggregate( etapas )
