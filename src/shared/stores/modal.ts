import { atom, computed } from 'nanostores';
import type { ModalState } from '../types/modal.types';
import type { TripComponent } from '../types';

// Initial state
const initialState: ModalState = {
  isOpen: false,
  data: undefined,
};

// Main modal store
export const $modalStore = atom<ModalState>(initialState);

// Computed selectors
export const $activeModal = computed($modalStore, (state) => state.activeModal);
export const $isModalOpen = computed($modalStore, (state) => state.isOpen);
export const $modalData = computed($modalStore, (state) => state.data);

// Modal actions
export const modalActions = {
  // Open modal with specific type
  open: (modalType: keyof TripComponent, data?: unknown) => {
    $modalStore.set({
      activeModal: modalType,
      isOpen: true,
      data,
    });
  },

  // Close modal
  close: () => {
    $modalStore.set({
      isOpen: false,
      data: undefined,
    });
  },

  // Check if specific modal is open
  isOpen: (modalType: keyof TripComponent): boolean => {
    const state = $modalStore.get();
    return state.isOpen && state.activeModal === modalType;
  },

  // Get current modal type
  getCurrentModal: (): keyof TripComponent | null => {
    return $modalStore.get().activeModal || null;
  },

  // Set modal data without changing open state
  setData: (data: unknown) => {
    const current = $modalStore.get();
    $modalStore.set({
      ...current,
      data,
    });
  },
};

// Export modal store and actions together
export const modalStore = {
  store: $modalStore,
  activeModal: $activeModal,
  isOpen: $isModalOpen,
  data: $modalData,
  actions: modalActions,
};
