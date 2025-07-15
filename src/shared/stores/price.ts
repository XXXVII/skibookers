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

// Sequence counter to prevent race conditions
let priceUpdateSequence = 0;

// Synchronous function to update addon prices with race condition protection
const updateAddonsPrice = (addons: string[]) => {
  // Increment sequence counter for this update
  const currentSequence = ++priceUpdateSequence;
  
  try {
    $priceStore.set({
      ...$priceStore.get(),
      isCalculating: true,
    });

    const price = calculateAddonsPrice(addons);
    
    // Check if this is still the latest update request
    if (currentSequence !== priceUpdateSequence) {
      // Newer update has been started, abandon this one
      return;
    }
    
    $addonsPriceCache.set(price);

    // Trigger price breakdown recalculation
    const components = $tripComponents.get();
    const breakdown = calculatePriceBreakdown(components, price);

    // Final check before updating the store
    if (currentSequence === priceUpdateSequence) {
      $priceStore.set({
        breakdown,
        isCalculating: false,
        error: null,
      });
    }
  } catch (error) {
    console.error('Failed to update addon prices:', error);
    
    // Only update error state if this is still the latest update
    if (currentSequence === priceUpdateSequence) {
      $priceStore.set({
        ...$priceStore.get(),
        error: 'Failed to calculate addon prices',
        isCalculating: false,
      });
    }
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

// Debounced price update manager with cleanup
class PriceUpdateManager {
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    // Listen for addon changes and update prices asynchronously with debouncing
    this.unsubscribe = $tripComponents.listen((components) => {
      if (Array.isArray(components.addons)) {
        this.debouncedUpdate(components.addons);
      }
    });
  }

  private debouncedUpdate = (addons: (string | { id: string })[]) => {
    // Clear previous timeout to prevent race conditions
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    // Debounce price updates to prevent rapid sequential calls
    this.timeout = setTimeout(() => {
      const addonIds = addons.map(addon => typeof addon === 'string' ? addon : addon.id);
      updateAddonsPrice(addonIds);
      this.timeout = null;
    }, 100); // 100ms debounce delay
  };

  public cleanup = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  };
}

// Global price update manager instance
let priceUpdateManager: PriceUpdateManager | null = null;

// Initialize price update manager lazily
const initializePriceManager = () => {
  if (!priceUpdateManager) {
    priceUpdateManager = new PriceUpdateManager();
  }
  return priceUpdateManager;
};

// Initialize on module load
initializePriceManager();

// Export cleanup function for proper memory management
export const cleanupPriceUpdates = () => {
  if (priceUpdateManager) {
    priceUpdateManager.cleanup();
    priceUpdateManager = null;
  }
};

// Cleanup on page unload/refresh
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupPriceUpdates);
  window.addEventListener('unload', cleanupPriceUpdates);
}

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
