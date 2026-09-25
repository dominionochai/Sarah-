import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'alert' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const bgClasses = 
    type === 'alert' 
      ? 'bg-error text-on-error'
      : type === 'info'
      ? 'bg-tertiary text-on-tertiary'
      : 'bg-primary text-on-primary';

  const iconName = 
    type === 'alert'
      ? 'warning'
      : type === 'info'
      ? 'info'
      : 'done_all';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${bgClasses} font-mono-data text-mono-data px-4 py-2.5 rounded shadow-xl flex items-center gap-2 transform transition-all duration-300 animate-bounce-subtle`}
    >
      <span className="material-symbols-outlined text-[18px]">{iconName}</span>
      <span>{message}</span>
    </div>
  );
};
