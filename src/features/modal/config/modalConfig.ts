import type { ModalType } from '../types/modal.types';

export interface ModalConfig {
  title: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  multiple?: boolean;
}

export const modalConfig: Record<NonNullable<ModalType>, ModalConfig> = {
  resort: {
    title: 'Choose Your Resort',
    maxWidth: 'md',
  },
  hotel: {
    title: 'Choose Your Hotel',
    maxWidth: 'md',
  },
  room: {
    title: 'Choose Your Room',
    maxWidth: 'md',
  },
  skipass: {
    title: 'Choose Your Ski Pass',
    maxWidth: 'md',
  },
  transfer: {
    title: 'Choose Your Transfer',
    maxWidth: 'md',
  },
  flight: {
    title: 'Choose Your Flight',
    maxWidth: 'md',
  },
  insurance: {
    title: 'Choose Your Insurance',
    maxWidth: 'md',
  },
  addons: {
    title: 'Choose Your Add-ons',
    maxWidth: 'md',
    multiple: true,
  },
  checkout: {
    title: 'Checkout',
    maxWidth: 'lg',
  },
};