import csv
import random
import os

# Agar hasil dataset konsisten setiap kali script dijalankan
random.seed(42)

# File target yang digunakan oleh RandomForest.ipynb
NAMA_FILE = "dataset_laundry.csv"
JUMLAH_DATA = 495

# ==============================================================================
# PARAMETER KEBUTUHAN PER KG
# ==============================================================================
# Sabun: rata-rata ~10 ml/kg (bervariasi antara 7 sampai 13 ml)
SABUN_PER_KG_MIN = 7.0
SABUN_PER_KG_MAX = 13.0

# Parfum: rata-rata ~0.2 ml/kg (bervariasi antara 0.13 sampai 0.30 ml)
PARFUM_PER_KG_MIN = 0.13
PARFUM_PER_KG_MAX = 0.30

# Ambil path relatif ke folder skrip saat ini
current_dir = os.path.dirname(os.path.abspath(__file__))
filepath = os.path.join(current_dir, NAMA_FILE)

# Jika file lama ada, kita baca berat kg aslinya agar distribusinya tetap konsisten
daftar_kg = []
if os.path.exists(filepath):
    with open(filepath, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if "kg" in row and row["kg"]:
                daftar_kg.append(float(row["kg"]))

# Jika file belum ada atau kosong, generate berat acak 1.0 s.d 10.0 kg (kelipatan 0.5)
if len(daftar_kg) < JUMLAH_DATA:
    daftar_kg = [round(random.choice([x * 0.5 for x in range(2, 21)]), 1) for _ in range(JUMLAH_DATA)]

with open(filepath, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["kg", "sabun", "parfum"])

    for kg in daftar_kg:
        # Estimasi pemakaian bahan bervariasi per kg
        sabun_per_kg = random.uniform(SABUN_PER_KG_MIN, SABUN_PER_KG_MAX)
        parfum_per_kg = random.uniform(PARFUM_PER_KG_MIN, PARFUM_PER_KG_MAX)

        # Hitung kebutuhan total dalam ml
        sabun = round(kg * sabun_per_kg, 1)
        parfum = round(kg * parfum_per_kg, 2)

        writer.writerow([kg, sabun, parfum])

print(f"Dataset berhasil dibuat/diperbarui: {filepath}")
print(f"Jumlah baris data : {len(daftar_kg)}")
print(f"Rentang Sabun/kg  : {SABUN_PER_KG_MIN} - {SABUN_PER_KG_MAX} ml (rata-rata ~10 ml)")
print(f"Rentang Parfum/kg : {PARFUM_PER_KG_MIN} - {PARFUM_PER_KG_MAX} ml (rata-rata ~0.2 ml)")
