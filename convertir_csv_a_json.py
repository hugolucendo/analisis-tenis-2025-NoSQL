import csv
import json

FICHERO_CSV = "datos/atp_partidos_2025.csv"
FICHERO_JSON = "datos/atp_partidos_2025.json"


def a_numero(valor):
    """Convierte un texto del csv a int o float.
    Si el valor esta vacio devuelve None."""
    if valor == "":
        return None
    numero = float(valor)
    if numero.is_integer():
        return int(numero)
    return numero


def formatear_fecha(fecha):
    """Pasa la fecha del formato 20250113 al formato 2025-01-13."""
    return fecha[0:4] + "-" + fecha[4:6] + "-" + fecha[6:8]


def crear_sets(resultado, nivel):
    """Convierte el resultado en texto a una lista con los sets jugados.
    Los juegos y los puntos del tiebreak van siempre desde el punto de vista
    del ganador del partido."""
    sets = []
    numero_set = 0
    for parte in resultado.split(" "):
        if parte == "RET" or parte == "W/O":
            continue
        numero_set = numero_set + 1
        parte = parte.replace("[", "").replace("]", "")

        puntos_tb = None
        if "(" in parte:
            parte, puntos_tb = parte.split("(")
            puntos_tb = int(puntos_tb.replace(")", ""))

        juegos = parte.split("-")
        juegos_ganador = int(juegos[0])
        juegos_perdedor = int(juegos[1])
        tiebreak = None

        # super tiebreak a 10 puntos en vez de tercer set (Davis y Laver Cup)
        if juegos_ganador > 7 or juegos_perdedor > 7:
            tiebreak = {"puntos_ganador": juegos_ganador, "puntos_perdedor": juegos_perdedor}
            juegos_ganador = None
            juegos_perdedor = None
        elif puntos_tb is not None:
            # en el quinto set de los Grand Slam el tiebreak es a 10
            if nivel == "G" and numero_set == 5:
                minimo = 10
            else:
                minimo = 7
            puntos_rival = max(minimo, puntos_tb + 2)
            if juegos_ganador > juegos_perdedor:
                tiebreak = {"puntos_ganador": puntos_rival, "puntos_perdedor": puntos_tb}
            else:
                tiebreak = {"puntos_ganador": puntos_tb, "puntos_perdedor": puntos_rival}

        sets.append({
            "juegos_ganador": juegos_ganador,
            "juegos_perdedor": juegos_perdedor,
            "tiebreak": tiebreak
        })
    return sets


def tipo_final(resultado):
    """Devuelve como acabo el partido: completo, retirada o walkover."""
    if "W/O" in resultado:
        return "walkover"
    if "RET" in resultado:
        return "retirada"
    return "completo"


def crear_jugador(fila, prefijo, prefijo_est):
    """Devuelve un diccionario con los datos y estadisticas de un jugador.
    prefijo es winner o loser y prefijo_est es w o l."""
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
            "sets": crear_sets(fila["score"], fila["tourney_level"]),
            "final": tipo_final(fila["score"]),
            "minutos": a_numero(fila["minutes"]),
            "ganador": crear_jugador(fila, "winner", "w"),
            "perdedor": crear_jugador(fila, "loser", "l")
        }
        partidos.append(partido)

with open(FICHERO_JSON, "w", encoding="utf-8") as f:
    json.dump(partidos, f, ensure_ascii=False, indent=4)

print("Partidos convertidos:", len(partidos))
