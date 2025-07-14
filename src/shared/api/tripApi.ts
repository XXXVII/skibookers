import yaml from 'js-yaml';
import type { Addon, Flight, Hotel, Insurance, Resort, Room, Skipass, Transfer, TripData } from '../types';

let cachedTripData: TripData | null = null;

export const loadTripData = async (): Promise<TripData> => {
  if (cachedTripData) {
    return cachedTripData;
  }

  try {
    // Load the YAML file from public directory (relative to base URL)
    const baseUrl = import.meta.env.BASE_URL || '/';
    const yamlUrl = baseUrl.endsWith('/') ? `${baseUrl}trip-data.yml` : `${baseUrl}/trip-data.yml`;
    const response = await fetch(yamlUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} for ${response.url}`);
    }

    const yamlText = await response.text();
    const data = yaml.load(yamlText) as TripData;

    cachedTripData = data;
    return data;
  } catch (error) {
    console.error('Failed to load trip data:', error);
    throw new Error('Failed to load trip data');
  }
};

export const getTripComponents = async () => {
  const data = await loadTripData();

  // Helper function to find component by ID
  const findComponentById = (components: Resort[] | Hotel[] | Room[] | Skipass[] | Transfer[] | Flight[] | Insurance[] | Addon[], id: string) => {
    return components.find(component => component.id === id) || null;
  };

  const findAddonsByIds = (addons: Addon[], ids: string[]) => {
    return ids
      .map(id => addons.find(addon => addon.id === id))
      .filter((addon): addon is Addon => addon !== undefined);
  };

  return {
    resort: findComponentById(data.availableResorts || [], data.trip.resort) as Resort,
    hotel: findComponentById(data.availableHotels || [], data.trip.hotel) as Hotel,
    room: findComponentById(data.availableRooms || [], data.trip.room) as Room,
    skipass: findComponentById(data.availableSkipasses || [], data.trip.skipass) as Skipass,
    transfer: findComponentById(data.availableTransfers || [], data.trip.transfer) as Transfer,
    flight: findComponentById(data.availableFlights || [], data.trip.flight) as Flight,
    insurance: findComponentById(data.availableInsurance || [], data.trip.insurance) as Insurance,
    addons: findAddonsByIds(data.availableAddons || [], data.trip.addons),
  };
};

