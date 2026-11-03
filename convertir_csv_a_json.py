import csv
import json

FICHERO_CSV = "datos/atp_partidos_2025.csv"
FICHERO_JSON = "datos/atp_partidos_2025.json"


def a_numero(valor):
    if valor == "":
        return None
    numero = float(valor)
    if numero.is_integer():
        return int(numero)
    return numero


def formatear_fecha(fecha):
    return fecha[0:4] + "-" + fecha[4:6] + "-" + fecha[6:8]


def crear_jugador(fila, prefijo, prefijo_est):
    jugador = {
        "id": fila[prefijo + "_id"],
        "nombre": fila[prefijo + "_name"],
        "pais": fila[prefijo + "_ioc"],
        "mano": fila[prefijo + "_hand"],
        "altura": a_numero(fila[prefijo + "_ht"]),
        "edad": a_numero(fila[prefijo + "_age"]),
        "ranking": a_numero(fila[prefijo + "_rank"]),
        "puntos_ranking": a_numero(fila[prefijo + "_rank_points"]),
        "estadisticas": {
            "aces": a_numero(fila[prefijo_est + "_ace"]),
            "dobles_faltas": a_numero(fila[prefijo_est + "_df"]),
            "puntos_saque": a_numero(fila[prefijo_est + "_svpt"]),
            "primeros_dentro": a_numero(fila[prefijo_est + "_1stIn"]),
            "primeros_ganados": a_numero(fila[prefijo_est + "_1stWon"]),
            "segundos_ganados": a_numero(fila[prefijo_est + "_2ndWon"]),
            "juegos_saque": a_numero(fila[prefijo_est + "_SvGms"]),
            "breaks_salvados": a_numero(fila[prefijo_est + "_bpSaved"]),
            "breaks_en_contra": a_numero(fila[prefijo_est + "_bpFaced"])
        }
    }
    return jugador


partidos = []

with open(FICHERO_CSV, encoding="utf-8") as f:
    lector = csv.DictReader(f)
    for fila in lector:
        # la ultima fila del csv viene cortada
        if fila["l_bpFaced"] is None:
            print("Fila incompleta:", fila["tourney_name"], fila["winner_name"])
            continue
        partido = {
            "id_torneo": fila["tourney_id"],
            "torneo": fila["tourney_name"],
            "superficie": fila["surface"],
            "nivel": fila["tourney_level"],
            "pista_cubierta": fila["indoor"] == "I",
            "fecha": formatear_fecha(fila["tourney_date"]),
            "ronda": fila["round"],
            "al_mejor_de": a_numero(fila["best_of"]),
            "resultado": fila["score"],
            "minutos": a_numero(fila["minutes"]),
            "ganador": crear_jugador(fila, "winner", "w"),
            "perdedor": crear_jugador(fila, "loser", "l")
        }
        partidos.append(partido)

with open(FICHERO_JSON, "w", encoding="utf-8") as f:
    json.dump(partidos, f, ensure_ascii=False, indent=4)

print("Partidos convertidos:", len(partidos))
