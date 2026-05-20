import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

function Notification() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleShowNotification = (event) => {
      const { message, type = 'success' } = event.detail || {};
      setNotification({ message, type });

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    };

    window.addEventListener('showNotification', handleShowNotification);
    return () => window.removeEventListener('showNotification', handleShowNotification);
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl border-3 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-[#06d6a0] text-black'
              : notification.type === 'error'
              ? 'bg-[#ef476f] text-white'
              : 'bg-[#ffd166] text-black'
          }`}
        >
          {notification.type === 'success' && (
            <CheckCircle className="w-6 h-6" strokeWidth={3} />
          )}
          <span className="font-bold text-lg">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
