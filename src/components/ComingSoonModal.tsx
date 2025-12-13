import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mobile' | 'web';
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, type }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-xl p-8 relative shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  type === 'mobile' ? 'bg-blue-500/10' : 'bg-tech-blue/10'
                }`}
              >
                {type === 'mobile' ? (
                  <Smartphone size={32} className="text-blue-400" />
                ) : (
                  <Monitor size={32} className="text-tech-blue" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Coming Soon</h3>
              <p className="text-gray-400 mb-6">
                {type === 'mobile'
                  ? 'Insight iOS app is currently in development. Stay tuned for updates!'
                  : 'Insight Web is currently in development. Stay tuned for updates!'}
              </p>
              <button
                onClick={onClose}
                className={`w-full py-3 rounded-lg font-bold hover:opacity-90 transition-opacity ${
                  type === 'mobile'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
                    : 'bg-gradient-to-r from-tech-blue to-blue-400 text-black'
                }`}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
