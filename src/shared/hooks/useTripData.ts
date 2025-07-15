import { useEffect, useCallback } from 'react';
import { tripStore } from '../stores';
import { cleanupPriceUpdates } from '../stores/price';

/**
 * Custom hook to handle trip data loading and state management
 * Separates business logic from UI components
 */
export const useTripData = () => {
  const loadTripData = useCallback(async () => {
    try {
      await tripStore.actions.loadTripData();
    } catch (error) {
      console.error('Failed to load trip data:', error);
    }
  }, []);

  useEffect(() => {
    loadTripData();
    
    // Cleanup function that runs when component unmounts
    return () => {
      cleanupPriceUpdates();
    };
  }, [loadTripData]);

  return {
    loadTripData,
  };
};