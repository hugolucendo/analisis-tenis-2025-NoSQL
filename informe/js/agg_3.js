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
