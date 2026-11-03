query1 = {"ganador.nombre": {"$in": ["Carlos Alcaraz", "Jannik Sinner"]}}
fase1 = {"$match": query1}
fase2 = {"$addFields": {"fecha_date": {"$toDate": "$fecha"}}}
grupo = {"jugador": "$ganador.nombre", "mes": {"$month": "$fecha_date"}}
query3 = {"_id": grupo, "victorias": {"$sum": 1}}
fase3 = {"$group": query3}
query4 = {"_id.jugador": 1, "_id.mes": 1}
fase4 = {"$sort": query4}
etapas = [fase1, fase2, fase3, fase4]

resultado = list(db.partidos.aggregate(etapas))

# los meses sin victorias no salen en la agregacion, asi que empiezo con todo a 0
meses = list(range(1, 13))
victorias_alcaraz = [0] * 12
victorias_sinner = [0] * 12

for doc in resultado:
    mes = doc["_id"]["mes"]
    if doc["_id"]["jugador"] == "Carlos Alcaraz":
        victorias_alcaraz[mes - 1] = doc["victorias"]
    else:
        victorias_sinner[mes - 1] = doc["victorias"]

print("Alcaraz:", victorias_alcaraz)
print("Sinner: ", victorias_sinner)

plt.plot(meses, victorias_alcaraz, "o-", label="Alcaraz")
plt.plot(meses, victorias_sinner, "s-", label="Sinner")
plt.xticks(meses)
plt.xlabel("Mes")
plt.ylabel("Victorias")
plt.title("Victorias por mes en 2025")
plt.legend()
plt.grid(True)
plt.savefig("graficas/victorias_mes.png")
plt.show()
