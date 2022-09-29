import toast, { Toaster } from 'react-hot-toast';

function useToast() {
  const showToast = function (icon: string, message: string) {
    toast(message, {
      duration: 4000,
      position: 'top-center',
      style: {},
      className: '',
      icon: icon,
      iconTheme: {
        primary: '#000',
        secondary: '#fff',
      },
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      }
    });
  };

  return {
    showToast,
    Toaster,
  }
}

export { useToast };