import type { TripComponent } from '../types';

// Price breakdown interface
export interface PriceBreakdown {
  components: {
    [K in keyof TripComponent]: number;
  };
  addons: number;
  subtotal: number;
  total: number;
}

// Price calculation state
export interface PriceState {
  breakdown: PriceBreakdown | null;
  isCalculating: boolean;
  error: string | null;
}

// Component with price information
export interface PriceableComponent {
  basePrice?: number;
}

// Union type for any component that can have a price
export type ComponentWithPrice = PriceableComponent | PriceableComponent[] | string[] | null;