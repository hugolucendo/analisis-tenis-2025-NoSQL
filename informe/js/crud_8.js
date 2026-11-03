var query = { "minutos": { $ne: null } }
var proyeccion = { "_id": 0, "torneo": 1, "ronda": 1, "ganador.nombre": 1, "perdedor.nombre": 1, "resultado": 1, "minutos": 1 }
var opcion = { "minutos": -1 }
db.partidos.find( query, proyeccion ).sort( opcion ).limit(5)
