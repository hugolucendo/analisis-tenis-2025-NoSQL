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
