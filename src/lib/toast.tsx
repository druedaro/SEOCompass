import toast from 'react-hot-toast';

export { toast };

export function showSuccessToast(title: string, description?: string) {
  const message = description ? `${title}: ${description}` : title;
  toast.success(message);
}

export function showErrorToast(title: string, description?: string) {
  const message = description ? `${title}: ${description}` : title;
  toast.error(message);
}

export function showInfoToast(message: string) {
  toast(message);
}

export function showWarningToast(message: string) {
  toast(message, { icon: '⚠️' });
}
