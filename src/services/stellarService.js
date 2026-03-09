import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from './walletService';

const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE;
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;

const server = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);

export async function storeAuditOnChain(walletAddress, contractName, reportHash) {
  try {
    const account = await server.getAccount(walletAddress);
    
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    
    const operation = contract.call(
      'store_audit_hash',
      StellarSdk.nativeToScVal(walletAddress, { type: 'address' }),
      StellarSdk.nativeToScVal(contractName, { type: 'string' }),
      StellarSdk.nativeToScVal(reportHash, { type: 'string' })
    );
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();
    
    const preparedTx = await server.prepareTransaction(transaction);
    const xdr = preparedTx.toXDR();
    
    const signedXdr = await signTransaction(xdr);
    
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    );
    
    const result = await server.sendTransaction(signedTx);
    
    if (result.status === 'PENDING') {
      let txResponse = await server.getTransaction(result.hash);
      
      while (txResponse.status === 'NOT_FOUND') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        txResponse = await server.getTransaction(result.hash);
      }
      
      if (txResponse.status === 'SUCCESS') {
        return result.hash;
      }
    }
    
    throw new Error('Transaction failed');
  } catch (error) {
    console.error('Store on chain error:', error);
    throw error;
  }
}

export async function getAuditFromChain(auditId) {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    
    const operation = contract.call(
      'get_audit',
      StellarSdk.nativeToScVal(auditId, { type: 'string' })
    );
    
    // This would need proper implementation based on contract
    return null;
  } catch (error) {
    console.error('Get audit from chain error:', error);
    throw error;
  }
}
