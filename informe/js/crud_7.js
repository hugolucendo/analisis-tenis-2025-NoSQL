var query1 = { "ganador.nombre": "Carlos Alcaraz", "perdedor.nombre": "Jannik Sinner" }
var query2 = { "ganador.nombre": "Jannik Sinner", "perdedor.nombre": "Carlos Alcaraz" }
var logic = { $or: [ query1, query2 ] }
var proyeccion = { "_id": 0, "torneo": 1, "ronda": 1, "superficie": 1, "ganador.nombre": 1, "resultado": 1 }
var opcion = { "fecha": 1 }
db.partidos.find( logic, proyeccion ).sort( opcion )
