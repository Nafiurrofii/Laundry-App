import { dataStore } from '@/lib/dataStore';
import {
  PredictionInput,
  MaterialResultItem,
  StockInventoryItem,
} from '../types';

export class PrediksiService {
  /**
   * Mengambil total berat cucian aktif hari ini dari data pesanan
   */
  public static getTodayActiveWeight(): number {
    const orders = dataStore.getOrders();
    return orders.reduce((sum, o) => sum + (o.weight_kg || 0), 0);
  }

  /**
   * Data persediaan stok bahan baku saat ini di outlet
   */
  public static getInventory(): StockInventoryItem[] {
    return [
      {
        id: 'INV-01',
        name: 'Deterjen Cair Konsentrat',
        category: 'Deterjen',
        currentStock: 4500, // 4.5 Liter dalam ml
        unit: 'ml',
        minThreshold: 1500,
      },
      {
        id: 'INV-02',
        name: 'Parfum Laundry (Snappy / Lavender)',
        category: 'Parfum',
        currentStock: 1200, // 1.2 Liter dalam ml
        unit: 'ml',
        minThreshold: 500,
      },
      {
        id: 'INV-03',
        name: 'Pelembut Pakaian (Softener Floral)',
        category: 'Softener',
        currentStock: 8000, // 8 Liter dalam ml
        unit: 'ml',
        minThreshold: 2000,
      },
      {
        id: 'INV-04',
        name: 'Plastik Kemasan Jinjing 35x50',
        category: 'Kemasan',
        currentStock: 35, // lembar
        unit: 'lembar',
        minThreshold: 20,
      },
    ];
  }

  /**
   * Menghitung takaran kebutuhan bahan baku berdasarkan input berat cucian (kg)
   */
  public static calculatePrediction(input: PredictionInput): MaterialResultItem[] {
    const { weightKg, serviceType, intensity, fragranceVariant } = input;
    const inventory = this.getInventory();

    const weight = Math.max(0, weightKg);

    // 1. DETERJEN CAIR (25 ml per kg untuk semua layanan)
    const detergentDose = 25; // ml/kg
    const detergentNeeded = Math.round(weight * detergentDose);
    const detergentStock = inventory.find((i) => i.category === 'Deterjen')?.currentStock || 4500;
    const detergentSufficient = detergentStock >= detergentNeeded;
    const detergentDeficit = detergentSufficient ? 0 : detergentNeeded - detergentStock;
    const detergentCostPerMl = 18; // Rp18.000 / 1000ml = Rp18/ml

    // 2. PARFUM LAUNDRY
    // Jika Cuci Basah: tidak menggunakan parfum
    // Multiplier intensitas: Hemat = 7ml/kg, Standar = 10ml/kg, Ekstra = 13ml/kg
    let perfumeDose = 10;
    if (serviceType === 'Cuci Basah') {
      perfumeDose = 0;
    } else if (intensity === 'Hemat') {
      perfumeDose = 7;
    } else if (intensity === 'Ekstra Wangi') {
      perfumeDose = 13;
    }
    const perfumeNeeded = Math.round(weight * perfumeDose);
    const perfumeStock = inventory.find((i) => i.category === 'Parfum')?.currentStock || 1200;
    const perfumeSufficient = perfumeStock >= perfumeNeeded;
    const perfumeDeficit = perfumeSufficient ? 0 : perfumeNeeded - perfumeStock;
    const perfumeCostPerMl = 45; // Rp45.000 / 1000ml = Rp45/ml

    // 3. SOFTENER / PELEMBUT (20 ml per kg)
    const softenerDose = serviceType === 'Cuci Basah' ? 0 : 20;
    const softenerNeeded = Math.round(weight * softenerDose);
    const softenerStock = inventory.find((i) => i.category === 'Softener')?.currentStock || 8000;
    const softenerSufficient = softenerStock >= softenerNeeded;
    const softenerDeficit = softenerSufficient ? 0 : softenerNeeded - softenerStock;
    const softenerCostPerMl = 16; // Rp16.000 / 1000ml = Rp16/ml

    // 4. PLASTIK KEMASAN
    // Rata-rata 1 pack plastik memuat 4 kg cucian
    const plasticNeeded = serviceType === 'Cuci Basah' ? 0 : Math.ceil(weight / 4);
    const plasticStock = inventory.find((i) => i.category === 'Kemasan')?.currentStock || 35;
    const plasticSufficient = plasticStock >= plasticNeeded;
    const plasticDeficit = plasticSufficient ? 0 : plasticNeeded - plasticStock;
    const plasticCostPerUnit = 500; // Rp500 / lembar

    // Helper format Liter
    const formatLiter = (ml: number) => {
      if (ml >= 1000) {
        return `${(ml / 1000).toFixed(2)} Liter`;
      }
      return `${(ml / 1000).toFixed(2)} L`;
    };

    return [
      {
        id: 'MAT-01',
        name: 'Sabun / Deterjen Cair Konsentrat',
        category: 'Deterjen',
        unit: 'ml',
        dosePerKg: detergentDose,
        totalNeeded: detergentNeeded,
        formattedNeeded: `${detergentNeeded.toLocaleString('id-ID')} ml (${formatLiter(detergentNeeded)})`,
        currentStock: detergentStock,
        stockUnit: `${(detergentStock / 1000).toFixed(1)} L (${detergentStock.toLocaleString('id-ID')} ml)`,
        isSufficient: detergentSufficient,
        deficit: detergentDeficit,
        costPerUnit: detergentCostPerMl,
        estimatedCost: detergentNeeded * detergentCostPerMl,
        description: 'Dosis standar 25 ml per 1 kg pakaian kotor untuk pembersihan optimal.',
      },
      {
        id: 'MAT-02',
        name: `Parfum Laundry (${fragranceVariant})`,
        category: 'Parfum',
        unit: 'ml',
        dosePerKg: perfumeDose,
        totalNeeded: perfumeNeeded,
        formattedNeeded:
          serviceType === 'Cuci Basah'
            ? '0 ml (Tidak digunakan pada Cuci Basah)'
            : `${perfumeNeeded.toLocaleString('id-ID')} ml (${formatLiter(perfumeNeeded)})`,
        currentStock: perfumeStock,
        stockUnit: `${(perfumeStock / 1000).toFixed(1)} L (${perfumeStock.toLocaleString('id-ID')} ml)`,
        isSufficient: perfumeSufficient,
        deficit: perfumeDeficit,
        costPerUnit: perfumeCostPerMl,
        estimatedCost: perfumeNeeded * perfumeCostPerMl,
        description:
          serviceType === 'Cuci Basah'
            ? 'Layanan cuci basah tidak menggunakan parfum laundry finishing.'
            : `Level aroma: ${intensity} (~${perfumeDose} ml per kg saat proses finishing / packing).`,
      },
      {
        id: 'MAT-03',
        name: 'Pelembut Pakaian (Softener Floral)',
        category: 'Softener',
        unit: 'ml',
        dosePerKg: softenerDose,
        totalNeeded: softenerNeeded,
        formattedNeeded:
          serviceType === 'Cuci Basah'
            ? '0 ml (Tidak digunakan pada Cuci Basah)'
            : `${softenerNeeded.toLocaleString('id-ID')} ml (${formatLiter(softenerNeeded)})`,
        currentStock: softenerStock,
        stockUnit: `${(softenerStock / 1000).toFixed(1)} L (${softenerStock.toLocaleString('id-ID')} ml)`,
        isSufficient: softenerSufficient,
        deficit: softenerDeficit,
        costPerUnit: softenerCostPerMl,
        estimatedCost: softenerNeeded * softenerCostPerMl,
        description: 'Diberikan pada bilasan terakhir agar serat pakaian lembut dan mudah disetrika.',
      },
      {
        id: 'MAT-04',
        name: 'Plastik Kemasan Jinjing (35x50)',
        category: 'Kemasan',
        unit: 'lembar',
        dosePerKg: 0.25,
        totalNeeded: plasticNeeded,
        formattedNeeded:
          serviceType === 'Cuci Basah'
            ? '0 lembar (Dibawa langsung pelanggan)'
            : `${plasticNeeded} lembar`,
        currentStock: plasticStock,
        stockUnit: `${plasticStock} lembar`,
        isSufficient: plasticSufficient,
        deficit: plasticDeficit,
        costPerUnit: plasticCostPerUnit,
        estimatedCost: plasticNeeded * plasticCostPerUnit,
        description: '1 lembar kantong higienis menampung rata-rata 4-5 kg pakaian jadi.',
      },
    ];
  }
}
