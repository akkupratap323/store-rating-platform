'use client';

import { Toaster, toast } from 'react-hot-toast';
import { Z_CLASSES } from '@/lib/z-index';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Toast Component
const EnhancedToast = ({ message, type, visible, onDismiss }: {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onDismiss: () => void;
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'error':
        return 'from-red-500/20 to-red-600/20 border-red-500/30';
      case 'warning':
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'info':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`bg-gradient-to-r ${getColors()} backdrop-blur-xl border rounded-lg p-4 shadow-2xl max-w-md mx-auto relative overflow-hidden`}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-lg" />
          
          {/* Content */}
          <div className="relative flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{message}</p>
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Animated border */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-0.5 ${
              type === 'success' ? 'bg-green-400' :
              type === 'error' ? 'bg-red-400' :
              type === 'warning' ? 'bg-yellow-400' :
              'bg-blue-400'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Toast Functions
export const enhancedToast = {
  success: (message: string) => {
    toast.custom((t) => (
      <EnhancedToast
        message={message}
        type="success"
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
      position: 'top-right',
    });
  },

  error: (message: string) => {
    toast.custom((t) => (
      <EnhancedToast
        message={message}
        type="error"
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 5000,
      position: 'top-right',
    });
  },

  warning: (message: string) => {
    toast.custom((t) => (
      <EnhancedToast
        message={message}
        type="warning"
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
      position: 'top-right',
    });
  },

  info: (message: string) => {
    toast.custom((t) => (
      <EnhancedToast
        message={message}
        type="info"
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 3000,
      position: 'top-right',
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        backdropFilter: 'blur(12px)',
      },
      position: 'top-right',
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  }
};

// Enhanced Toaster Component
export function EnhancedToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
        },
      }}
      containerStyle={{
        top: 80,
        right: 20,
        zIndex: 2000,
      }}
      containerClassName={Z_CLASSES.toast}
    />
  );
}