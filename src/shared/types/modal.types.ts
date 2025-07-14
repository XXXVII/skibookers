import type { TripComponent } from '../types';;

// Modal state interface
export interface ModalState {
  activeModal?: keyof TripComponent;
  isOpen: boolean;
  data?: unknown; // Optional data to pass to modal
}
