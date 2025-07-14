import type {
  Resort,
  Hotel,
  Room,
  Skipass,
  Transfer,
  Flight,
  Insurance,
  Addon,
  UserPreferences
} from './';

// Generic interface for components with alternatives
export interface WithAlternatives<T> {
  alternatives?: T[];
}

// API Data Types with Alternatives
export type ResortWithAlternatives = Resort & WithAlternatives<Resort>;
export type HotelWithAlternatives = Hotel & WithAlternatives<Hotel>;
export type RoomWithAlternatives = Room & WithAlternatives<Room>;
export type SkipassWithAlternatives = Skipass & WithAlternatives<Skipass>;
export type TransferWithAlternatives = Transfer & WithAlternatives<Transfer>;
export type FlightWithAlternatives = Flight & WithAlternatives<Flight>;
export type InsuranceWithAlternatives = Insurance & WithAlternatives<Insurance>;
export type AddonWithAlternatives = Addon & WithAlternatives<Addon>;

export interface TripData {
  trip: {
    id: string;
    name: string;
    resort: string;
    hotel: string;
    room: string;
    skipass: string;
    transfer: string;
    flight: string;
    insurance: string;
    addons: string[];
  };
  availableResorts: Resort[];
  availableHotels: Hotel[];
  availableRooms: Room[];
  availableSkipasses: Skipass[];
  availableFlights: Flight[];
  availableInsurance: Insurance[];
  availableTransfers: Transfer[];
  availableAddons: Addon[];
  user: {
    preferences: UserPreferences;
  };
}
