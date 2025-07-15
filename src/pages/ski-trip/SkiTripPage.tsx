import { Box, Typography } from '@mui/material';
import { Container } from '../../shared/ui';
import { ModalContainer } from '../../features/modal';
import { TripOverview } from '../../widgets/trip-overview';
import { PriceSummary } from '../../widgets/price-summary';
import { useStore } from '@nanostores/react';
import type { TripComponent } from '../../shared/types';
import { tripStore, modalStore } from '../../shared/stores';
import { useTripData } from '../../shared/hooks/useTripData';
import styles from './SkiTripPage.module.css';

const SkiTripContent = () => {
  const userPreferences = useStore(tripStore.userPreferences);
  
  // Business logic moved to custom hook
  useTripData();

  const handleCustomizeComponent = (componentType: keyof TripComponent) => {
    modalStore.actions.open(componentType);
  };

  const handleCheckout = () => {
    return;
  };

  return (
    <Box className={styles.pageContainer}>
      <Container>
        <Box className={styles.contentWrapper}>
          <Typography variant="h1" gutterBottom className={styles.pageTitle}>
            Your Ski Trip
          </Typography>

          <Box className={styles.mainLayout}>
            <Box className={styles.contentColumn}>
              <TripOverview onCustomizeComponent={handleCustomizeComponent} />

              <Box className={styles.recommendationsBox}>
                <Typography variant="h6" gutterBottom className={styles.recommendationsTitle}>
                  Why These Recommendations?
                </Typography>
                <Typography variant="body1" color="text.secondary" className={styles.recommendationsText}>
                  Our AI-powered system analyzes thousands of ski trips to suggest the perfect combination
                  of resort, accommodation, and activities based on your preferences: {
                    userPreferences && Object.entries(userPreferences).length > 0 ? (
                      Object.entries(userPreferences)
                        .filter(([, value]) => value)
                        .map(([, value], index, array) => (
                          <span key={index}>
                            <strong>{value}</strong>
                            {index < array.length - 1 ? (index === array.length - 2 ? ', and ' : ', ') : ''}
                          </span>
                        ))
                    ) : (
                      <span>your skill level and interests</span>
                    )
                  }. Each recommendation is tailored to provide the best value and experience for your trip.
                </Typography>
              </Box>
            </Box>

            <Box className={styles.sidebarColumn}>
              <Box className={styles.sidebarSticky}>
                <PriceSummary onCheckout={handleCheckout} />
              </Box>
            </Box>
          </Box>
        </Box>

        <ModalContainer />
      </Container>
    </Box>
  );
};

export const SkiTripPage = () => {
  return <SkiTripContent />;
};
