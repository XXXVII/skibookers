import { atom, computed } from 'nanostores';
import { $tripComponents, $availableComponents } from './trip';
import type { TripComponent } from '../types';
import type { PriceBreakdown, PriceState, PriceableComponent, ComponentWithPrice } from '../types/price.types';

// Initial price state
const initialPriceState: PriceState = {
  breakdown: null,
  isCalculating: false,
  error: null,
};

// Price store for managing calculation state
export const $priceStore = atom<PriceState>(initialPriceState);

// Price calculation helper functions
const calculateComponentPrice = (component: PriceableComponent | null): number => {
  return component?.basePrice || 0;
};

const calculateAddonsPrice = (addons: PriceableComponent[] | string[]): number => {
  // Handle legacy PriceableComponent[] format
  if (Array.isArray(addons) && addons.length > 0 && typeof addons[0] === 'object') {
    return (addons as PriceableComponent[]).reduce((total, addon) => total + (addon.basePrice || 0), 0);
  }

  // Handle new string[] format
  if (Array.isArray(addons) && addons.length > 0 && typeof addons[0] === 'string') {
    const availableComponents = $availableComponents.get();
    if (!availableComponents?.addons) {
      return 0;
    }

    // Calculate price by matching IDs
    const selectedAddons = availableComponents.addons.filter(addon => (addons as string[]).includes(addon.id));
    return selectedAddons.reduce((total, addon) => total + (addon.basePrice || 0), 0);
  }

  return 0;
};


// Store for calculated addon prices
export const $addonsPriceCache = atom<number>(0);

// Synchronous function to update addon prices
const updateAddonsPrice = (addons: string[]) => {
  try {
    $priceStore.set({
      ...$priceStore.get(),
      isCalculating: true,
    });

    const price = calculateAddonsPrice(addons);
    $addonsPriceCache.set(price);

    // Trigger price breakdown recalculation
    const components = $tripComponents.get();
    const breakdown = calculatePriceBreakdown(components, price);

    $priceStore.set({
      breakdown,
      isCalculating: false,
      error: null,
    });
  } catch (error) {
    console.error('Failed to update addon prices:', error);
    $priceStore.set({
      ...$priceStore.get(),
      error: 'Failed to calculate addon prices',
      isCalculating: false,
    });
  }
};

// Synchronous price calculation helper
const calculatePriceBreakdown = (components: TripComponent, addonsPrice: number): PriceBreakdown => {
  const componentPrices = {
    resort: calculateComponentPrice(components.resort || null),
    hotel: calculateComponentPrice(components.hotel || null),
    room: calculateComponentPrice(components.room || null),
    skipass: calculateComponentPrice(components.skipass || null),
    transfer: calculateComponentPrice(components.transfer || null),
    flight: calculateComponentPrice(components.flight || null),
    insurance: calculateComponentPrice(components.insurance || null),
    addons: addonsPrice,
  };

  const subtotal = Object.values(componentPrices).reduce((sum, price) => sum + price, 0);
  const total = subtotal;

  return {
    components: componentPrices,
    addons: addonsPrice,
    subtotal,
    total,
  };
};

// Computed price breakdown based on trip components
export const $priceBreakdown = computed([$tripComponents, $addonsPriceCache], (components, addonsPrice): PriceBreakdown => {
  return calculatePriceBreakdown(components, addonsPrice);
});

// Listen for addon changes and update prices asynchronously
$tripComponents.listen((components) => {
  if (Array.isArray(components.addons)) {
    const addonIds = components.addons.map(addon => typeof addon === 'string' ? addon : addon.id);
    updateAddonsPrice(addonIds);
  }
});

// Computed total price
export const $totalPrice = computed($priceBreakdown, (breakdown) => breakdown.total);

// Computed loading state
export const $isPriceCalculating = computed($priceStore, (state) => state.isCalculating);

// Computed error state
export const $priceError = computed($priceStore, (state) => state.error);

// Price actions
export const priceActions = {
  // Set calculating state
  setCalculating: (isCalculating: boolean) => {
    const current = $priceStore.get();
    $priceStore.set({
      ...current,
      isCalculating,
    });
  },

  // Set error
  setError: (error: string | null) => {
    const current = $priceStore.get();
    $priceStore.set({
      ...current,
      error,
      isCalculating: false,
    });
  },

  // Calculate price difference for component change
  calculatePriceDifference: (
    currentComponents: TripComponent,
    newComponent: ComponentWithPrice,
    componentType: keyof TripComponent
  ): number => {
    const currentComponent = currentComponents[componentType];
    const currentPrice = Array.isArray(currentComponent)
      ? 0 // Addon prices calculated separately
      : calculateComponentPrice(currentComponent || null);

    const newPrice = Array.isArray(newComponent)
      ? 0 // Addon prices calculated separately
      : calculateComponentPrice(newComponent);

    return newPrice - currentPrice;
  },

  // Get formatted price string
  formatPrice: (price: number): string => {
    return `€${price}`;
  },

  // Reset price state
  reset: () => {
    $priceStore.set(initialPriceState);
  },
};

// Export price store and computed values
export const priceStore = {
  store: $priceStore,
  breakdown: $priceBreakdown,
  total: $totalPrice,
  isCalculating: $isPriceCalculating,
  error: $priceError,
  actions: priceActions,
};
