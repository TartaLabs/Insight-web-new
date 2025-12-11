import React from 'react';
import WalletProvider from './wallet/WalletProvider';
import Main from './Main';

export default function App() {
  return (
    <WalletProvider>
      <Main />
    </WalletProvider>
  );
}
