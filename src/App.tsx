import React from 'react';
import WalletProvider from './wallet/WalletProvider';
import Main from './Main';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <WalletProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(0, 243, 255, 0.4)',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontFamily: 'JetBrains Mono, monospace',
            padding: '0.5rem 1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#00f3ff',
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#000',
            },
          },
        }}
      />
      <Main />
    </WalletProvider>
  );
}
