import { useEffect } from 'react';
import { cleanupPriceUpdates } from '../stores/price';

/**
 * Hook to manage PriceUpdateManager lifecycle
 * Ensures proper cleanup when component unmounts
 */
export const usePriceManager = () => {
  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      cleanupPriceUpdates();
    };
  }, []);
};