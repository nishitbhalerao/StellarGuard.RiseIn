export async function connectWallet() {
  if (!window.freighter) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    const publicKey = await window.freighter.getPublicKey();
    if (!publicKey) {
      throw new Error('Failed to get public key');
    }
    return publicKey;
  } catch (error) {
    console.error('Connect wallet error:', error);
    throw error;
  }
}

export async function disconnectWallet() {
  // Freighter doesn't have explicit disconnect, just clear local state
  return true;
}

export async function isWalletConnected() {
  if (!window.freighter) {
    return false;
  }

  try {
    const publicKey = await window.freighter.getPublicKey();
    return !!publicKey;
  } catch {
    return false;
  }
}

export async function getWalletPublicKey() {
  if (!window.freighter) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    return await window.freighter.getPublicKey();
  } catch (error) {
    console.error('Get public key error:', error);
    throw error;
  }
}

export async function signTransaction(xdr) {
  if (!window.freighter) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    const networkPassphrase = import.meta.env.VITE_NETWORK_PASSPHRASE;
    const signedXdr = await window.freighter.signTransaction(xdr, {
      networkPassphrase
    });
    return signedXdr;
  } catch (error) {
    console.error('Sign transaction error:', error);
    throw error;
  }
}
