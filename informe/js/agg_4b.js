db.jugadores.countDocuments({})
var query = { "partidos": { $gte: 40 } }
var opcion = { "porcentaje": -1 }
db.jugadores.find( query ).sort( opcion ).limit(10)
