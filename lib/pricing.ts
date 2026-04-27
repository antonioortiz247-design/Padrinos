import { TacoConfig } from './types';

export const BASE_TACO_PRICE = 32;
export const QUESO_EXTRA = 8;

export function calculateTacoPrice(_config: TacoConfig, basePrice = BASE_TACO_PRICE): number {
  // El queso seleccionado en el taco no tiene costo extra.
  // Para "queso extra" existe un producto aparte en el menú.
  return basePrice;
}

export function deliveryFeeByZone(zone: 'zona1' | 'zona2' | 'zona3'): number {
  if (zone === 'zona1') return 20;
  if (zone === 'zona2') return 30;
  return 40;
}
