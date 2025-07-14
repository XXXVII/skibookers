import { useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Card, Button } from '../../../shared/ui';
import { tripStore, modalStore } from '../../../shared/stores';
import { getImageUrl } from '../../../shared/utils/assets';
import { modalConfig } from '../config/modalConfig';
import type { ComponentData, ComponentSelectionModalProps } from '../types/modal.types';
import type { TripComponent } from '../../../shared/types';
import styles from './ComponentSelectionModal.module.css';

export const ComponentSelectionModal = ({componentType}: ComponentSelectionModalProps) => {
  const tripComponents = useStore(tripStore.components);
  const availableComponents = useStore(tripStore.availableComponents);
  const isDataLoaded = useStore(tripStore.isDataLoaded);
  const isLoading = useStore(tripStore.isLoading);
  const error = useStore(tripStore.error);
  
  const config = modalConfig[componentType];
  const isMultiple = config?.multiple || false;

  // Get available components for this type from the store
  const components = useMemo(() => {
    if (!availableComponents) return [];
    
    const componentMap = {
      resort: availableComponents.resorts,
      hotel: availableComponents.hotels,
      room: availableComponents.rooms,
      skipass: availableComponents.skipasses,
      transfer: availableComponents.transfers,
      flight: availableComponents.flights,
      insurance: availableComponents.insurance,
      addons: availableComponents.addons,
    };
    
    return componentMap[componentType] || [];
  }, [availableComponents, componentType]);

  // Multiple selection logic for addons
  const selectedItems = useMemo(() => {
    if (!isMultiple) return null;

    const currentComponents = tripComponents[componentType];
    if (Array.isArray(currentComponents)) {
      // Extract IDs from full objects
      const itemIds = currentComponents.map(item => typeof item === 'string' ? item : item.id);
      return components.filter(component => itemIds.includes(component.id));
    }

    return [];
  }, [isMultiple, tripComponents, componentType, components]);

  const selectedItemIds = useMemo(() => {
    if (!isMultiple) return new Set();

    const currentComponents = tripComponents[componentType];
    if (Array.isArray(currentComponents)) {
      // Extract IDs from full objects
      const itemIds = currentComponents.map(item => typeof item === 'string' ? item : item.id);
      return new Set(itemIds);
    }

    return new Set();
  }, [isMultiple, tripComponents, componentType]);

  const isItemSelected = (component: ComponentData): boolean => {
    if (isMultiple) {
      return selectedItemIds.has(component.id);
    }

    // Single selection mode
    const currentComponent = tripComponents[componentType];
    return currentComponent !== null && !Array.isArray(currentComponent) && currentComponent.id === component.id;
  };

  const handleSelect = (component: ComponentData) => {
    if (isMultiple) {
      handleToggleMultiple(component);
    } else {
      // Single selection - toggle selection (allow unselect)
      const currentComponent = tripComponents[componentType];
      const isCurrentlySelected = currentComponent !== null && !Array.isArray(currentComponent) && currentComponent.id === component.id;
      
      if (isCurrentlySelected) {
        // Unselect by setting to null
        tripStore.actions.setComponent(componentType, null as TripComponent[typeof componentType]);
      } else {
        // Select new component
        tripStore.actions.setComponent(componentType, component as TripComponent[typeof componentType]);
      }
      modalStore.actions.close();
    }
  };

  const handleToggleMultiple = (component: ComponentData) => {
    const isSelected = selectedItemIds.has(component.id);
    const currentElements = Array.isArray(tripComponents[componentType])
      ? tripComponents[componentType] as ComponentData[]
      : [];
    let newElements: ComponentData[];

    if (isSelected) {
      newElements = currentElements.filter(item => item.id !== component.id);
    } else {
      newElements = [...currentElements, component];
    }

    tripStore.actions.setComponent(componentType, newElements as TripComponent[typeof componentType]);
  };

  const handleSaveAndClose = () => {
    modalStore.actions.close();
  };

  const handleClearAll = () => {
    if (isMultiple) {
      tripStore.actions.setComponent(componentType, []);
    }
  };

  const totalPrice = useMemo(() => {
    if (!isMultiple || !selectedItems) return 0;
    return selectedItems.reduce((total, item) => total + (item.basePrice || 0), 0);
  }, [isMultiple, selectedItems]);

  if (isLoading || !isDataLoaded) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="error" action={
          <Button onClick={() => tripStore.actions.loadTripData()} size="small">
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {isMultiple ? (
        <Box className={styles.header}>
          <Typography variant="body2" color="text.secondary" className={styles.description}>
            Select multiple {componentType} to enhance your ski trip experience
          </Typography>

          {selectedItems && selectedItems.length > 0 && (
            <Box className={styles.summary}>
              <Typography variant="body2" className={styles.selectedCount}>
                {selectedItems.length} selected • Total: €{totalPrice}
              </Typography>

              <Button
                onClick={handleClearAll}
                size="small"
                variant="text"
                className={styles.clearButton}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          Choose from our carefully selected {componentType} options. Click to select, click again to unselect.
        </Typography>
      )}

      <Box className={styles.componentsGrid}>
        {components.map((component: ComponentData) => {
          const isSelected = isItemSelected(component);

          return (
            <Card
              key={component.id}
              className={`${styles.componentCard} ${isSelected ? styles.componentCardSelected : ''}`}
              onClick={() => handleSelect(component)}
            >
              {component.image && (
                <Box
                  className={styles.componentImage}
                  style={{
                    backgroundImage: `url(${getImageUrl(component.image)})`,
                  }}
                />
              )}

              <Typography variant="h6" gutterBottom className={styles.componentTitle}>
                {component.name}
              </Typography>

              {component.description && (
                <Typography variant="body2" color="text.secondary" className={styles.componentDescription}>
                  {component.description}
                </Typography>
              )}

              <Box className={styles.componentFooter}>
                <Typography variant="h6" className={styles.componentPrice}>
                  €{component.basePrice}/person
                </Typography>

                {isSelected && (
                  <Typography variant="caption" className={styles.selectedBadge}>
                    Selected
                  </Typography>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>

      {isMultiple && (
        <Box className={styles.actionButtons}>
          <Button
            variant="contained"
            onClick={handleSaveAndClose}
            className={styles.saveButton}
          >
            Save Selection
          </Button>
        </Box>
      )}
    </Box>
  );
};
