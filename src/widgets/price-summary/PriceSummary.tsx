import { Box, Typography, Stack, Divider } from '@mui/material';
import { useStore } from '@nanostores/react';
import { Card, Button } from '../../shared/ui';
import { tripStore, priceStore } from '../../shared/stores';
import styles from './PriceSummary.module.css';

export interface PriceSummaryProps {
  onCheckout: () => void;
}

export const PriceSummary = ({ onCheckout }: PriceSummaryProps) => {
  const tripComponents = useStore(tripStore.components);
  const priceBreakdown = useStore(priceStore.breakdown);
  const totalPrice = useStore(priceStore.total);
  const isCalculating = useStore(priceStore.isCalculating);

  const hasSelectedComponents = Object.values(tripComponents).some(
    (component) => component !== null && !Array.isArray(component)
  );

  if (!hasSelectedComponents) {
    return (
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom className={styles.header}>
          Price Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.emptyState}>
          Start customizing your trip to see pricing
        </Typography>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <Typography variant="h6" gutterBottom className={styles.header}>
        Price Summary
      </Typography>

      {isCalculating ? (
        <Typography variant="body2" color="text.secondary">
          Calculating prices...
        </Typography>
      ) : (
        <Stack className={styles.priceStack}>
          {priceBreakdown && (
            <>
              {Object.entries(priceBreakdown.components).map(([key, price]) => {
                const component = tripComponents[key as keyof typeof tripComponents];
                if (!component || Array.isArray(component) || price === 0) return null;
                
                return (
                  <Box key={key} className={styles.priceRow}>
                    <Typography variant="body2" className={styles.priceLabel}>
                      {key}
                    </Typography>
                    <Typography variant="body2" className={styles.priceValue}>
                      €{price}
                    </Typography>
                  </Box>
                );
              })}

              {priceBreakdown.addons > 0 && (
                <Box className={styles.priceRow}>
                  <Typography variant="body2" className={styles.priceLabel}>
                    Add-ons ({Array.isArray(tripComponents.addons) ? tripComponents.addons.length : 0})
                  </Typography>
                  <Typography variant="body2" className={styles.priceValue}>
                    €{priceBreakdown.addons}
                  </Typography>
                </Box>
              )}

              <Divider />
            </>
          )}

          <Box className={styles.totalRow}>
            <Typography variant="subtitle1" className={styles.totalLabel}>
              Total per person
            </Typography>
            <Typography variant="subtitle1" className={styles.totalValue}>
              €{totalPrice || 0}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" className={styles.disclaimer}>
            Final price may vary based on availability
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onCheckout}
            disabled={!totalPrice || totalPrice === 0}
            className={styles.checkoutButton}
          >
            Continue to Checkout
          </Button>
        </Stack>
      )}
    </Card>
  );
};