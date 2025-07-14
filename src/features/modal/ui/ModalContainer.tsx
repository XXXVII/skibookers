import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import { useStore } from '@nanostores/react';
import { Close as CloseIcon } from '@mui/icons-material';
import { modalStore } from '../../../shared/stores';
import { ComponentSelectionModal } from './ComponentSelectionModal';
import { modalConfig } from '../config/modalConfig';
import styles from './Modal.module.css';
import type { TripComponent } from '../../../shared';

const renderModalContent = (activeModal: keyof TripComponent) => {
  // Handle all component selection modals (including addons)
  return <ComponentSelectionModal componentType={activeModal} />;
};

export const ModalContainer = () => {
  const modalState = useStore(modalStore.store);

  if (!modalState.isOpen || !modalState.activeModal) {
    return null;
  }

  const config = modalConfig[modalState.activeModal];
  const content = renderModalContent(modalState.activeModal);

  return (
    <Dialog
      open={modalState.isOpen}
      onClose={modalStore.actions.close}
      maxWidth={config.maxWidth}
      fullWidth
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Box component="span" className={styles.titleText}>
          {config.title}
        </Box>

        <IconButton
          onClick={modalStore.actions.close}
          size="small"
          className={styles.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        {content}
      </DialogContent>
    </Dialog>
  );
};
