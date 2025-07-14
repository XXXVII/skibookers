import type { TripComponent, BaseComponent } from '../../../shared/types';

export type ModalType = keyof TripComponent | 'checkout';

export interface ComponentSelectionModalProps {
  componentType: keyof TripComponent;
}

export type ComponentData = BaseComponent;
