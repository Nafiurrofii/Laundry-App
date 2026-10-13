export type ServiceTypeOption =
  | 'Semua Layanan'
  | 'Cuci Setrika'
  | 'Cuci Kering'
  | 'Cuci Basah';

export type FragranceIntensity = 'Hemat' | 'Standar' | 'Ekstra Wangi';

export interface PredictionInput {
  weightKg: number;
  serviceType: ServiceTypeOption;
  intensity: FragranceIntensity;
  fragranceVariant: string;
}

export interface MaterialResultItem {
  id: string;
  name: string;
  category: 'Deterjen' | 'Parfum' | 'Softener' | 'Kemasan' | 'Air';
  unit: 'ml' | 'lembar' | 'liter';
  dosePerKg: number; // in ml or pcs
  totalNeeded: number; // e.g. 36 kg * 25 ml = 900 ml
  formattedNeeded: string; // e.g. "900 ml (0.90 L)"
  currentStock: number; // stock in ml or pcs
  stockUnit: string;
  isSufficient: boolean;
  deficit: number;
  costPerUnit: number; // Rp per ml
  estimatedCost: number;
  description: string;
}

export interface StockInventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
}

export interface PrediksiViewModelState {
  input: PredictionInput;
  results: MaterialResultItem[];
  todayTotalWeight: number;
  totalEstimatedCost: number;
  hasInsufficientStock: boolean;
  inventory: StockInventoryItem[];
}
