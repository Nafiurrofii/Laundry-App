"""
Generator dataset transaksi laundry SINTETIS dengan aturan tetap per 10 kg pakaian:
    sabun   : 200 gram   (20 gram per kg)
    pewangi : 100 ml     (10 ml per kg)
    parfum  : 2 ml       (0,2 ml per kg)

Data ini ilustrasi, bukan data nyata Risqy Laundry.

Cara pakai:
    python generate_dataset_transaksi.py
    python generate_dataset_transaksi.py --jumlah 1000 --seed 7
    python generate_dataset_transaksi.py --noise 0.05   # variasi acak 5%
"""

import argparse
import csv
import random
from datetime import date, timedelta

SABUN_GRAM_PER_KG = 200 / 10     # 20 gram per kg
PEWANGI_ML_PER_KG = 100 / 10     # 10 ml per kg
PARFUM_ML_PER_KG = 2 / 10        # 0,2 ml per kg


def variasi(rng, noise):
    return 1 + rng.uniform(-noise, noise) if noise else 1


def buat_transaksi(nomor, tanggal, rng, noise):
    berat = rng.randrange(2, 21) / 2          # 1 - 10 kg, kelipatan 0,5

    return {
        "no_transaksi": f"TRX-{nomor:04d}",
        "tanggal": tanggal.isoformat(),
        "berat_kg": berat,
        "sabun_gram": round(berat * SABUN_GRAM_PER_KG * variasi(rng, noise)),
        "pewangi_ml": round(berat * PEWANGI_ML_PER_KG * variasi(rng, noise), 1),
        "parfum_ml": round(berat * PARFUM_ML_PER_KG * variasi(rng, noise), 2),
    }


def main():
    parser = argparse.ArgumentParser(description="Dataset transaksi laundry sintetis")
    parser.add_argument("--jumlah", type=int, default=500)
    parser.add_argument("--hari", type=int, default=90)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--noise", type=float, default=0.0,
                        help="variasi acak relatif, contoh 0.05 = 5 persen (default 0 = persis)")
    parser.add_argument("--output", default="dataset_transaksi_laundry.csv")
    args = parser.parse_args()

    rng = random.Random(args.seed)
    awal = date.today() - timedelta(days=args.hari - 1)
    tanggal = sorted(awal + timedelta(days=rng.randrange(args.hari)) for _ in range(args.jumlah))
    data = [buat_transaksi(i + 1, t, rng, args.noise) for i, t in enumerate(tanggal)]

    with open(args.output, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(data[0].keys()))
        w.writeheader()
        w.writerows(data)

    kg = sum(d["berat_kg"] for d in data)
    print(f"File disimpan: {args.output}")
    print(f"Transaksi : {len(data)} | total {kg:.1f} kg")
    print(f"Sabun     : {sum(d['sabun_gram'] for d in data)} g ({sum(d['sabun_gram'] for d in data)/kg:.2f} g/kg)")
    print(f"Pewangi   : {sum(d['pewangi_ml'] for d in data):.1f} ml ({sum(d['pewangi_ml'] for d in data)/kg:.2f} ml/kg)")
    print(f"Parfum    : {sum(d['parfum_ml'] for d in data):.2f} ml ({sum(d['parfum_ml'] for d in data)/kg:.2f} ml/kg)")


if __name__ == "__main__":
    main()
