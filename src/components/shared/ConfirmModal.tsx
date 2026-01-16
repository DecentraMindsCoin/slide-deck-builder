'use client';

import Modal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import type { PanelType } from '@/store/useUIStore';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  activePanel?: PanelType;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  activePanel,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm" activePanel={activePanel} height="auto">
      <div className="p-6">
        <p className="text-zinc-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} variant={variant}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
