// Base Component Interface
export interface BaseComponent {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image?: string;
}

// Trip Component Types
export interface Resort extends BaseComponent {
  region: string;
  difficulty: string;
  vibe: string;
  image: string;
}

export interface Hotel extends BaseComponent {
  type: string;
  image: string;
}

export interface Room extends BaseComponent {
  type: string;
  occupancy: number;
  amenities: string[];
}

export interface Skipass extends BaseComponent {
  days: number;
  zone: string;
  level: string;
}

export interface Transfer extends BaseComponent {
  type: string;
  from: string;
  to: string;
}

export interface Flight extends BaseComponent {
  airline: string;
  class: string;
  date: string;
  time: string;
}

export interface Insurance extends BaseComponent {
  type?: string;
  coverage?: string[];
}

export type Addon = BaseComponent;

export interface TripComponent {
  resort: Resort | null;
  hotel: Hotel | null;
  room: Room | null;
  skipass: Skipass | null;
  transfer: Transfer | null;
  flight: Flight | null;
  insurance: Insurance | null;
  addons: Addon[];
}

export interface Trip {
  id: string;
  name: string;
  components: TripComponent;
  totalPrice: number;
}

export interface TripState {
  components: TripComponent;
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
}
