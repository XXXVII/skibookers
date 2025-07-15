import { map, computed } from 'nanostores';
import type { Addon, TripComponent, TripState, Resort, Hotel, Room, Skipass, Transfer, Flight, Insurance } from '../types';
import { loadTripData, getTripComponents } from '../api';

export interface AvailableComponents {
  resorts: Resort[];
  hotels: Hotel[];
  rooms: Room[];
  skipasses: Skipass[];
  transfers: Transfer[];
  flights: Flight[];
  insurance: Insurance[];
  addons: Addon[];
}

export interface EnhancedTripState extends TripState {
  availableComponents: AvailableComponents | null;
  isDataLoaded: boolean;
  userPreferences: {
    vibe?: string;
    budget?: string;
    group?: string;
  } | null;
}

// Initial state
const initialState: EnhancedTripState = {
  components: {
    resort: null,
    hotel: null,
    room: null,
    skipass: null,
    transfer: null,
    flight: null,
    insurance: null,
    addons: [],
  },
  availableComponents: null,
  isLoading: false,
  isDataLoaded: false,
  hasChanges: false,
  error: null,
  userPreferences: null,
};

// Main trip store
export const $tripStore = map<EnhancedTripState>(initialState);

// Computed selectors for easy access
export const $tripComponents = computed($tripStore, (state) => state.components);
export const $isLoading = computed($tripStore, (state) => state.isLoading);
export const $hasChanges = computed($tripStore, (state) => state.hasChanges);
export const $error = computed($tripStore, (state) => state.error);

// Individual component selectors
export const $resort = computed($tripStore, (state) => state.components.resort);
export const $hotel = computed($tripStore, (state) => state.components.hotel);
export const $room = computed($tripStore, (state) => state.components.room);
export const $skipass = computed($tripStore, (state) => state.components.skipass);
export const $transfer = computed($tripStore, (state) => state.components.transfer);
export const $flight = computed($tripStore, (state) => state.components.flight);
export const $insurance = computed($tripStore, (state) => state.components.insurance);
export const $addons = computed($tripStore, (state) => state.components.addons);

// Available components selectors
export const $availableComponents = computed($tripStore, (state) => state.availableComponents);
export const $isDataLoaded = computed($tripStore, (state) => state.isDataLoaded);
export const $userPreferences = computed($tripStore, (state) => state.userPreferences);

// Store actions
export const tripActions = {
  // Load all trip data once
  loadTripData: async () => {
    try {
      $tripStore.setKey('isLoading', true);
      $tripStore.setKey('error', null);

      const data = await loadTripData();

      // Store available components
      const availableComponents: AvailableComponents = {
        resorts: data.availableResorts || [],
        hotels: data.availableHotels || [],
        rooms: data.availableRooms || [],
        skipasses: data.availableSkipasses || [],
        transfers: data.availableTransfers || [],
        flights: data.availableFlights || [],
        insurance: data.availableInsurance || [],
        addons: data.availableAddons || [],
      };

      $tripStore.setKey('availableComponents', availableComponents);
      $tripStore.setKey('userPreferences', data.user?.preferences || null);
      $tripStore.setKey('isDataLoaded', true);

      // Initialize current trip components
      const tripComponents = await getTripComponents();
      $tripStore.setKey('components', tripComponents);
      $tripStore.setKey('hasChanges', false);

    } catch (error) {
      console.error('Failed to load trip data:', error);
      $tripStore.setKey('error', 'Failed to load trip data');
    } finally {
      $tripStore.setKey('isLoading', false);
    }
  },

  // Set individual component
  setComponent: <T extends keyof TripComponent>(
    componentType: T,
    component: TripComponent[T]
  ) => {
    const current = $tripStore.get();

    if (componentType === 'addons') {
      // Handle addons array
      $tripStore.setKey('components', {
        ...current.components,
        addons: component as TripComponent['addons'],
      });
    } else {
      // Handle single components
      $tripStore.setKey('components', {
        ...current.components,
        [componentType]: component,
      });
    }

    $tripStore.setKey('hasChanges', true);
    $tripStore.setKey('error', null);
  },

  // Toggle addon
  toggleAddon: (addon: Addon, selected: boolean) => {
    const current = $tripStore.get();
    const currentAddons = current.components.addons;

    let newAddons: Addon[];
    if (selected) {
      // Add addon if not already present
      newAddons = currentAddons.find(existing => existing.id === addon.id)
        ? currentAddons
        : [...currentAddons, addon];
    } else {
      // Remove addon
      newAddons = currentAddons.filter(existing => existing.id !== addon.id);
    }

    $tripStore.setKey('components', {
      ...current.components,
      addons: newAddons,
    });
    $tripStore.setKey('hasChanges', true);
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    $tripStore.setKey('isLoading', isLoading);
  },

  // Set error
  setError: (error: string | null) => {
    $tripStore.setKey('error', error);
  },

  // Reset changes flag
  resetChanges: () => {
    $tripStore.setKey('hasChanges', false);
  },

  // Reset entire store
  reset: () => {
    $tripStore.set(initialState);
  },

  // Get component by type
  getComponent: <T extends keyof TripComponent>(componentType: T): TripComponent[T] => {
    return $tripStore.get().components[componentType];
  },

  // Check if component is selected
  isComponentSelected: (componentType: keyof TripComponent): boolean => {
    const component = tripActions.getComponent(componentType);
    return componentType === 'addons'
      ? Array.isArray(component) && component.length > 0
      : component !== null;
  },
};

// Export store and actions together for convenience
export const tripStore = {
  store: $tripStore,
  components: $tripComponents,
  availableComponents: $availableComponents,
  isLoading: $isLoading,
  isDataLoaded: $isDataLoaded,
  hasChanges: $hasChanges,
  error: $error,
  userPreferences: $userPreferences,
  resort: $resort,
  hotel: $hotel,
  room: $room,
  skipass: $skipass,
  transfer: $transfer,
  flight: $flight,
  insurance: $insurance,
  addons: $addons,
  actions: tripActions,
};
