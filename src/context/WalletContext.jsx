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
        if (key) {
          setPublicKey(key);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Check connection error:', error);
      // Silently fail - user will just see disconnected state
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async () => {
    try {
      const key = await connectWallet();
      if (key) {
        setPublicKey(key);
        setIsConnected(true);
        return key;
      }
      throw new Error('No public key returned');
    } catch (error) {
      console.error('Connect wallet error:', error);
      // Reset state on failure
      setPublicKey(null);
      setIsConnected(false);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Disconnect wallet error:', error);
    } finally {
      // Always clear state, even if disconnect fails
      setPublicKey(null);
      setIsConnected(false);
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
