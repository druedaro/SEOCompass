import { useState, useCallback } from 'react';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface DeleteConfirmationOptions<T> {
  onConfirm: (item: T) => Promise<void>;
  itemName?: string;
  successMessage?: string;
  errorMessage?: string;
  getItemName?: (item: T) => string;
}

export function useDeleteConfirmation<T>(
  options: DeleteConfirmationOptions<T>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const open = useCallback((item: T) => {
    setItemToDelete(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setItemToDelete(null);
    setIsOpen(false);
  }, []);

  const confirm = useCallback(async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await options.onConfirm(itemToDelete);
      const itemName = options.getItemName?.(itemToDelete) || options.itemName || 'item';
      showSuccessToast(options.successMessage || `${itemName} deleted successfully`);
      close();
    } catch (error: unknown) {
      const err = error as Error;
      const itemName = options.getItemName?.(itemToDelete) || options.itemName || 'item';
      showErrorToast(options.errorMessage || `Failed to delete ${itemName}: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, options, close]);

  const DialogComponent = ({ title, description }: { title: string; description: string }) => (
    <DeleteConfirmationDialog
      open={isOpen}
      onOpenChange={close}
      onConfirm={confirm}
      title={title}
      description={description}
      isLoading={isDeleting}
    />
  );

  return { open, close, confirm, DialogComponent, itemToDelete, isLoading: isDeleting };
}
