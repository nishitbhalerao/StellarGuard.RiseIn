import {
  requestAccess,
  getAddress,
  isConnected,
  isAllowed,
  signTransaction as freighterSignTransaction
} from '@stellar/freighter-api';

/**
 * Connect wallet using @stellar/freighter-api v6
 * requestAccess() returns { address: string, error?: FreighterApiError }
 */
export async function connectWallet() {
  try {
    const result = await requestAccess();

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.address) {
      throw new Error('No address returned from Freighter');
    }

    return result.address;
  } catch (error) {
    console.error('Connect wallet error:', error);
    throw error;
  }
}

/**
 * Disconnect wallet - Freighter doesn't have explicit disconnect,
 * so we just clear local state (handled by WalletContext).
 */
export async function disconnectWallet() {
  return true;
}

/**
 * Check if Freighter is installed and the site is allowed.
 * isConnected() returns { isConnected: boolean, error? }
 * isAllowed() returns { isAllowed: boolean, error? }
 */
export async function isWalletConnected() {
  try {
    const connResult = await isConnected();
    if (!connResult.isConnected) return false;

    const allowedResult = await isAllowed();
    return !!allowedResult.isAllowed;
  } catch {
    return false;
  }
}

/**
 * Get the currently connected wallet's public key/address.
 * getAddress() returns { address: string, error?: FreighterApiError }
 */
export async function getWalletPublicKey() {
  try {
    const result = await getAddress();

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.address) {
      throw new Error('Failed to retrieve address from Freighter');
    }

    return result.address;
  } catch (error) {
    console.error('Get public key error:', error);
    throw error;
  }
}

/**
 * Sign a transaction XDR string using Freighter.
 * signTransaction() returns { signedTxXdr: string, signerAddress: string, error? }
 */
export async function signTransaction(xdr) {
  try {
    const networkPassphrase = import.meta.env.VITE_NETWORK_PASSPHRASE;
    const result = await freighterSignTransaction(xdr, {
      networkPassphrase
    });

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.signedTxXdr) {
      throw new Error('Failed to sign transaction');
    }

    return result.signedTxXdr;
  } catch (error) {
    console.error('Sign transaction error:', error);
    throw error;
  }
}
