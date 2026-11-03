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
