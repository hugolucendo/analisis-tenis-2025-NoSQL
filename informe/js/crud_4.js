var array_niveles = [
    { "codigo": "G", "nombre": "Grand Slam", "puntos_campeon": 2000 },
    { "codigo": "F", "nombre": "ATP Finals", "puntos_campeon": 1500 },
    { "codigo": "M", "nombre": "Masters 1000", "puntos_campeon": 1000 },
    { "codigo": "500", "nombre": "ATP 500", "puntos_campeon": 500 },
    { "codigo": "250", "nombre": "ATP 250", "puntos_campeon": 250 },
    { "codigo": "D", "nombre": "Copa Davis" },
    { "codigo": "A", "nombre": "Otros (United Cup, Laver Cup, Next Gen)" }
]
db.niveles.insertMany( array_niveles )
db.niveles.find()
