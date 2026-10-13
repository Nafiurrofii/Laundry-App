import { PredictionInput } from '../types';

export class PrediksiMutations {
  public static validateWeight(weight: number): number {
    if (isNaN(weight) || weight < 0) return 0;
    return Math.round(weight * 10) / 10;
  }
}
