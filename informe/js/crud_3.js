var query = { "ganador.estadisticas.aces": null }
db.partidos.countDocuments( query )

var operacion = { $set: { "con_estadisticas": false } }
db.partidos.updateMany( query, operacion )

var query = { "con_estadisticas": { $exists: false } }
var operacion = { $set: { "con_estadisticas": true } }
db.partidos.updateMany( query, operacion )
