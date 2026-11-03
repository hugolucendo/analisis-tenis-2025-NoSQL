var ganador = { "nombre": "Sebastian Baez", "pais": "ARG", "ranking": 45 }
var perdedor = { "nombre": "Jaume Munar", "pais": "ESP", "ranking": 33 }
var nuevo_partido = { "torneo": "United Cup", "superficie": "Dura", "nivel": "A", "fecha": "2026-01-02", "ronda": "RR", "resultado": "6-4 6-4", "ganador": ganador, "perdedor": perdedor }
db.partidos.insertOne( nuevo_partido )

var query = { "fecha": "2026-01-02" }
db.partidos.find( query )

var operacion = { $set: { "minutos": 103 } }
db.partidos.updateOne( query, operacion )

var set1 = { "juegos_ganador": 6, "juegos_perdedor": 4, "tiebreak": null }
var set2 = { "juegos_ganador": 6, "juegos_perdedor": 4, "tiebreak": null }
var operacion = { $push: { "sets": { $each: [ set1, set2 ] } } }
db.partidos.updateOne( query, operacion )
db.partidos.find( query )

db.partidos.deleteOne( query )
db.partidos.countDocuments({})
