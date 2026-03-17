import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from './walletService';

const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || '';
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || '';
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || '';

function isContractConfigured() {
  return CONTRACT_ID && CONTRACT_ID !== 'your_deployed_contract_id_here';
}

function ensureEnv(name, value) {
  if (!value || value === 'your_deployed_contract_id_here') {
    throw new Error(
      `${name} is not properly configured. Please:\n1. Deploy the smart contract\n2. Update VITE_CONTRACT_ID in .env\n3. Restart the dev server`
    );
  }
  return value;
}

function getServer() {
  ensureEnv('VITE_SOROBAN_RPC_URL', SOROBAN_RPC_URL);
  return new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
}

function getContract() {
  ensureEnv('VITE_CONTRACT_ID', CONTRACT_ID);
  return new StellarSdk.Contract(CONTRACT_ID);
}

export async function storeAuditOnChain(walletAddress, contractName, reportHash) {
  try {
    // Check if contract is properly configured
    if (!isContractConfigured()) {
      return {
        success: false,
        message: 'Smart contract not deployed yet. Audit stored locally.',
        hash: null
      };
    }

    if (!walletAddress) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    if (!contractName || !reportHash) {
      throw new Error('Missing audit data (contract name or report hash)');
    }

    const server = getServer();
    
    // Verify wallet account exists on testnet
    let account;
    try {
      account = await server.getAccount(walletAddress);
    } catch (error) {
      throw new Error(
        'Wallet account not found on Stellar testnet. ' +
        'Please fund your account with testnet XLM from: https://stellar.org/developers/testnet-lab'
      );
    }

    const contract = getContract();

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
        return {
          success: true,
          hash: result.hash
        };
      } else {
        throw new Error(`Transaction status: ${txResponse.status}`);
      }
    }

    throw new Error('Transaction pending but no confirmation received');
  } catch (error) {
    console.error('Store on chain error:', error);
    throw error;
  }
}

export async function getAuditFromChain(auditId) {
  try {
    if (!isContractConfigured()) {
      return null;
    }

    const contract = getContract();

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
