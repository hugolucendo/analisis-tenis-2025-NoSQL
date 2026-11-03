var query = { "sets": { $size: 5 } }
db.partidos.countDocuments( query )

var query = { "sets.juegos_ganador": 6, "sets.juegos_perdedor": 7 }
db.partidos.countDocuments( query )

var query = { "sets": { $elemMatch: { "juegos_ganador": 6, "juegos_perdedor": 7 } } }
db.partidos.countDocuments( query )
