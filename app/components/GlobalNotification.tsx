// components/GlobalNotification.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  status?: number;
}

export function GlobalNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { status, message } = customEvent.detail;
      addNotification({
        type: 'error',
        message: message,
        status,
      });
    };

    const handleApiSuccess = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { message } = customEvent.detail;
      // Only show success for mutations (e.g., login, create, update)
      // You can filter by adding a custom header or check URL
      if (message && message !== 'Success') {
        addNotification({ type: 'success', message });
      }
    };

    window.addEventListener('api-error', handleApiError);
    window.addEventListener('api-success', handleApiSuccess);
    return () => {
      window.removeEventListener('api-error', handleApiError);
      window.removeEventListener('api-success', handleApiSuccess);
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, ...notification }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in-right ${
            notif.type === 'error'
              ? 'bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20'
              : 'bg-green-50 border-l-4 border-green-500 dark:bg-green-900/20'
          }`}
          role="alert"
        >
          {notif.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {notif.message}
            </p>
            {notif.status && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Status: {notif.status}
              </p>
            )}
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}