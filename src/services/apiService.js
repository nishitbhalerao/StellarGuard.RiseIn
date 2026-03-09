import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function createAudit(contractCode, contractName, walletAddress) {
  const response = await api.post('/api/audit', {
    contractCode,
    contractName,
    walletAddress
  });
  return response.data;
}

export async function getAudit(auditId) {
  const response = await api.get(`/api/audit/${auditId}`);
  return response.data;
}

export async function getWalletAudits(walletAddress) {
  const response = await api.get(`/api/audit/wallet/${walletAddress}`);
  return response.data;
}

export async function updateBlockchainHash(auditId, txHash) {
  const response = await api.patch(`/api/audit/${auditId}/blockchain`, {
    txHash
  });
  return response.data;
}
