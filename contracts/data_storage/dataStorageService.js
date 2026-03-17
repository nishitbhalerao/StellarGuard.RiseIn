// Example integration with StellarGuard frontend
// File: src/services/dataStorageService.js

import { Keypair, Server, TransactionBuilder, Networks } from "stellar-sdk";

class DataStorageService {
  constructor(contractId, rpcUrl = "https://soroban-testnet.stellar.org") {
    this.contractId = contractId;
    this.rpcUrl = rpcUrl;
    this.server = new Server(rpcUrl);
  }

  /**
   * Store data on the blockchain
   * @param {String} userAddress - User's Stellar address
   * @param {String} userSecret - User's secret key for signing
   * @param {String} key - Data key/identifier
   * @param {String} value - Data value to store
   * @param {Boolean} isPublic - Whether data is public
   * @returns {Promise<String>} - Data ID
   */
  async storeData(userAddress, userSecret, key, value, isPublic = false) {
    try {
      // Build transaction to call store_data contract method
      const keypair = Keypair.fromSecret(userSecret);
      const account = await this.server.loadAccount(userAddress);

      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
      })
        .addOperation(
          // Invoke store_data method
          // Note: Actual implementation depends on Soroban JS SDK
          {
            type: "invoke_host_function",
            function: {
              type: "invoke_contract",
              contractId: this.contractId,
              method: "store_data",
              args: [userAddress, key, value, isPublic],
            },
          }
        )
        .setTimeout(300)
        .build();

      transaction.sign(keypair);
      const result = await this.server.submitTransaction(transaction);

      return result;
    } catch (error) {
      console.error("Error storing data:", error);
      throw error;
    }
  }

  /**
   * Retrieve data by ID
   * @param {String} dataId - Data ID to retrieve
   * @returns {Promise<Object>} - Data record
   */
  async getData(dataId) {
    try {
      // Call get_data contract method
      const result = await this.server.invokeContractFunction(
        this.contractId,
        "get_data",
        [dataId]
      );

      return result;
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  }

  /**
   * Get all data for a user
   * @param {String} userAddress - User's Stellar address
   * @returns {Promise<Array>} - Array of data records
   */
  async getUserData(userAddress) {
    try {
      const result = await this.server.invokeContractFunction(
        this.contractId,
        "get_user_data",
        [userAddress]
      );

      return result;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      throw error;
    }
  }

  /**
   * Get all public data
   * @returns {Promise<Array>} - Array of public data records
   */
  async getPublicData() {
    try {
      const result = await this.server.invokeContractFunction(
        this.contractId,
        "get_public_data",
        []
      );

      return result;
    } catch (error) {
      console.error("Error retrieving public data:", error);
      throw error;
    }
  }

  /**
   * Update existing data
   * @param {String} userAddress - User's Stellar address
   * @param {String} userSecret - User's secret key
   * @param {String} dataId - Data ID to update
   * @param {String} newValue - New value
   * @returns {Promise<Boolean>} - Success status
   */
  async updateData(userAddress, userSecret, dataId, newValue) {
    try {
      const keypair = Keypair.fromSecret(userSecret);
      const account = await this.server.loadAccount(userAddress);

      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
      })
        .addOperation({
          type: "invoke_host_function",
          function: {
            type: "invoke_contract",
            contractId: this.contractId,
            method: "update_data",
            args: [userAddress, dataId, newValue],
          },
        })
        .setTimeout(300)
        .build();

      transaction.sign(keypair);
      const result = await this.server.submitTransaction(transaction);

      return result;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }

  /**
   * Delete data
   * @param {String} userAddress - User's Stellar address
   * @param {String} userSecret - User's secret key
   * @param {String} dataId - Data ID to delete
   * @returns {Promise<Boolean>} - Success status
   */
  async deleteData(userAddress, userSecret, dataId) {
    try {
      const keypair = Keypair.fromSecret(userSecret);
      const account = await this.server.loadAccount(userAddress);

      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
      })
        .addOperation({
          type: "invoke_host_function",
          function: {
            type: "invoke_contract",
            contractId: this.contractId,
            method: "delete_data",
            args: [userAddress, dataId],
          },
        })
        .setTimeout(300)
        .build();

      transaction.sign(keypair);
      const result = await this.server.submitTransaction(transaction);

      return result;
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }

  /**
   * Get total number of records
   * @returns {Promise<Number>} - Total record count
   */
  async getTotalRecords() {
    try {
      const result = await this.server.invokeContractFunction(
        this.contractId,
        "total_records",
        []
      );

      return result;
    } catch (error) {
      console.error("Error getting total records:", error);
      throw error;
    }
  }

  /**
   * Check if data exists
   * @param {String} dataId - Data ID to check
   * @returns {Promise<Boolean>} - Existence status
   */
  async dataExists(dataId) {
    try {
      const result = await this.server.invokeContractFunction(
        this.contractId,
        "data_exists",
        [dataId]
      );

      return result;
    } catch (error) {
      console.error("Error checking data existence:", error);
      throw error;
    }
  }

  /**
   * Get user record count
   * @param {String} userAddress - User's Stellar address
   * @returns {Promise<Number>} - User's record count
   */
  async getUserRecordCount(userAddress) {
    try {
      const result = await this.server.invokeContractFunction(
        this.contractId,
        "get_user_record_count",
        [userAddress]
      );

      return result;
    } catch (error) {
      console.error("Error getting user record count:", error);
      throw error;
    }
  }
}

export default DataStorageService;

/**
 * Usage Example in React Component
 */
/*
import DataStorageService from './services/dataStorageService';

const CONTRACT_ID = "CDATA..."; // Deploy contract first

function DataManager() {
  const dataStorageService = new DataStorageService(CONTRACT_ID);

  const handleStoreData = async () => {
    try {
      const result = await dataStorageService.storeData(
        userAddress,
        userSecret,
        "user_profile",
        JSON.stringify({ name: "John Doe", email: "john@example.com" }),
        false // private
      );
      console.log("Data stored:", result);
    } catch (error) {
      console.error("Failed to store data:", error);
    }
  };

  const handleGetUserData = async () => {
    try {
      const data = await dataStorageService.getUserData(userAddress);
      console.log("User data:", data);
    } catch (error) {
      console.error("Failed to retrieve data:", error);
    }
  };

  return (
    <div>
      <button onClick={handleStoreData}>Store Data</button>
      <button onClick={handleGetUserData}>Get My Data</button>
    </div>
  );
}

export default DataManager;
*/
