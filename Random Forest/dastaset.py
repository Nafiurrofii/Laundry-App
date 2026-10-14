
import csv
import random

# Agar hasil dataset konsisten setiap dijalankan
random.seed(42)

# Jumlah data
jumlah_data = 159

# Nama file output
nama_file = "dataset_laundry_159.csv"

with open(
    nama_file,
    mode="w",
    newline="",
    encoding="utf-8-sig"
) as file:
    writer = csv.writer(file)

    # Header kolom
    writer.writerow(["kg", "sabun", "parfum"])

    for _ in range(jumlah_data):
        # Berat cucian: 0,5 sampai 10 kg
        kg = round(random.uniform(0.5, 10.0), 1)

        # Estimasi pemakaian bahan per kg
        sabun_per_kg = random.uniform(8, 12)
        parfum_per_kg = random.uniform(3, 6)

        # Hitung kebutuhan sabun dan parfum dalam ml
        sabun = round(kg * sabun_per_kg, 1)
        parfum = round(kg * parfum_per_kg, 1)

        writer.writerow([
            kg,
            sabun,
            parfum
        ])

print(f"Dataset berhasil dibuat: {nama_file}")
print(f"Jumlah data: {jumlah_data}")
