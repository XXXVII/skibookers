import { useMemo } from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { useStore } from '@nanostores/react';
import { Button } from '../../shared/ui';
import { tripStore, priceStore } from '../../shared/stores';
import { getImageUrl } from '../../shared/utils/assets';
import type { TripComponent, Addon } from '../../shared/types';
import styles from './TripOverview.module.css';

export interface TripOverviewProps {
  onCustomizeComponent: (componentType: keyof TripComponent) => void;
}

export const TripOverview = ({ onCustomizeComponent }: TripOverviewProps) => {
  const tripComponents = useStore(tripStore.components);
  const availableComponents = useStore(tripStore.availableComponents);
  const totalPrice = useStore(priceStore.total);
  const isCalculating = useStore(priceStore.isCalculating);

  const selectedAddons = useMemo(() => {
    if (!availableComponents?.addons) return [];
    
    const addonIds = tripComponents.addons.map(addon => 
      typeof addon === 'string' ? addon : addon.id
    );
    return availableComponents.addons.filter(addon => addonIds.includes(addon.id));
  }, [tripComponents.addons, availableComponents?.addons]);

  const components = [
    { key: 'resort' as const, label: 'Resort', value: tripComponents.resort },
    { key: 'hotel' as const, label: 'Hotel', value: tripComponents.hotel },
    { key: 'room' as const, label: 'Room', value: tripComponents.room },
    { key: 'skipass' as const, label: 'Ski Pass', value: tripComponents.skipass },
    { key: 'transfer' as const, label: 'Transfer', value: tripComponents.transfer },
    { key: 'flight' as const, label: 'Flight', value: tripComponents.flight },
    { key: 'insurance' as const, label: 'Insurance', value: tripComponents.insurance },
  ];

  return (
    <Box>
      <Stack className={styles.componentStack}>
        {components.map(({ key, label, value }) => (
          <Box key={key} className={styles.componentItem}>
            <Box className={styles.componentHeader}>
              <Typography variant="subtitle1" className={styles.componentLabel}>
                {label}
              </Typography>
            </Box>
            
            <Box className={styles.componentDetailsWithButton}>
              <Box className={styles.componentDetails}>
                {value ? (
                  <>
                    {value.image && (
                      <Box
                        className={styles.componentImage}
                        style={{
                          backgroundImage: `url(${getImageUrl(value.image)})`,
                        }}
                      />
                    )}
                    <Box className={styles.componentInfo}>
                      <Typography variant="body2" className={styles.componentName}>
                        {value.name}
                      </Typography>
                      {value.description && (
                        <Typography variant="body2" color="text.secondary" className={styles.componentDescription}>
                          {value.description}
                        </Typography>
                      )}
                      <Typography variant="body2" className={styles.componentPrice}>
                        €{value.basePrice}/person
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not selected
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onCustomizeComponent(key)}
                className={styles.changeButton}
              >
                {value ? 'Change' : 'Select'}
              </Button>
            </Box>
          </Box>
        ))}
        
        <Box className={styles.componentItem}>
          <Box className={styles.componentHeader}>
            <Typography variant="subtitle1" className={styles.componentLabel}>
              Add-ons
            </Typography>
          </Box>
          
          <Box className={styles.componentDetailsWithButton}>
            <Box sx={{ flex: 1 }}>
              {selectedAddons && selectedAddons.length > 0 ? (
                <Stack className={styles.addonsStack}>
                  {selectedAddons.map((addon: Addon) => (
                    <Box key={addon.id} className={styles.addonRow}>
                      <Typography variant="body2">{addon.name}</Typography>
                      <Typography variant="body2" className={styles.addonPrice}>
                        €{addon.basePrice}/person
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No add-ons selected
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onCustomizeComponent('addons')}
              className={styles.changeButton}
            >
              {selectedAddons && selectedAddons.length > 0 ? 'Change' : 'Select'}
            </Button>
          </Box>
        </Box>
      </Stack>
      
      <Divider className={styles.totalSection} />
      
      <Box className={styles.totalRow}>
        <Typography variant="h6" className={styles.totalLabel}>
          Total Price
        </Typography>
        <Typography variant="h6" className={styles.totalValue}>
          {isCalculating ? 'Calculating...' : `€${totalPrice || 0}/person`}
        </Typography>
      </Box>
    </Box>
  );
};