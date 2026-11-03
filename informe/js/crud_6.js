var query = { "nivel": "G", "ronda": "F" }
var proyeccion = { "_id": 0, "torneo": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1, "minutos": 1 }
var opcion = { "fecha": 1 }
db.partidos.find( query, proyeccion ).sort( opcion )
