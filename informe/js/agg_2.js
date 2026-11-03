var query1 = { "minutos": { $ne: null } }
var fase1 = { $match: query1 }
var grupo = { "superficie": "$superficie", "al_mejor_de": "$al_mejor_de" }
var query2 = { "_id": grupo, "partidos": { $sum: 1 }, "media_minutos": { $avg: "$minutos" } }
var fase2 = { $group: query2 }
var query3 = { "_id.al_mejor_de": 1, "media_minutos": -1 }
var fase3 = { $sort: query3 }
var etapas = [ fase1, fase2, fase3 ]
db.partidos.aggregate( etapas )
