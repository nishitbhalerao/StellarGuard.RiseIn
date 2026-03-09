import { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, isWalletConnected, getWalletPublicKey } from '../services/walletService';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isWalletConnected();
      if (connected) {
        const key = await getWalletPublicKey();
        setPublicKey(key);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Check connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async () => {
    try {
      const key = await connectWallet();
      setPublicKey(key);
      setIsConnected(true);
      return key;
    } catch (error) {
      console.error('Connect wallet error:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setPublicKey(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Disconnect wallet error:', error);
    }
  };

  return (
    <WalletContext.Provider value={{
      publicKey,
      isConnected,
      isLoading,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
