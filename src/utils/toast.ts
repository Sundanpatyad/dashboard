import toast, { ToastOptions } from 'react-hot-toast';

// Custom styled toast utilities
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: 4000,
    style: {
      background: '#10b981',
      color: '#ffffff',
      border: '1px solid #059669',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10b981',
    },
    ...options,
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: 6000,
    style: {
      background: '#ef4444',
      color: '#ffffff',
      border: '1px solid #dc2626',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#ef4444',
    },
    ...options,
  });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: 5000,
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#ffffff',
      border: '1px solid #d97706',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options,
  });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: 4000,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#ffffff',
      border: '1px solid #2563eb',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options,
  });
};

export const showLoadingToast = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    style: {
      background: 'var(--toast-bg)',
      color: 'var(--toast-color)',
      border: '1px solid var(--toast-border)',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options,
  });
};

// Promise-based toast for async operations
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: {
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
      success: {
        duration: 4000,
        iconTheme: {
          primary: '#10b981',
          secondary: '#ffffff',
        },
      },
      error: {
        duration: 6000,
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      },
      ...options,
    }
  );
};

// Export default toast for simple usage
export { toast as default };

// Usage examples:
/*
// Simple toasts
showSuccessToast('Operation completed successfully!');
showErrorToast('Something went wrong');
showWarningToast('Please check your inputs');
showInfoToast('Here is some useful information');

// Loading toast
const toastId = showLoadingToast('Processing...');
// Later dismiss it
toast.dismiss(toastId);

// Promise toast for async operations
showPromiseToast(
  apiCall(),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save',
  }
);

// Promise toast with dynamic messages
showPromiseToast(
  createUser(userData),
  {
    loading: 'Creating user...',
    success: (user) => `Welcome ${user.name}!`,
    error: (err) => `Failed: ${err.message}`,
  }
);
*/
