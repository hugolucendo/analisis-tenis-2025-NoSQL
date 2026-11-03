import os
import pandas as pd
import matplotlib.pyplot as plt
from pymongo import MongoClient

cliente = MongoClient("mongodb://localhost:27017")
db = cliente["tenis-2025"]

os.makedirs("graficas", exist_ok=True)

print("Partidos:", db.partidos.count_documents({}))
print("Jugadores:", db.jugadores.count_documents({}))
