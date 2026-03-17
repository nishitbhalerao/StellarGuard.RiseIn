# Data Storage Smart Contract

A comprehensive Soroban-based smart contract for storing, managing, and retrieving data on the Stellar blockchain.

## Overview

This smart contract provides a decentralized key-value storage system that allows users to:
- **Store** data on the blockchain with ownership and privacy controls
- **Retrieve** data by ID, key name, or user
- **Update** data with timestamp tracking
- **Delete** data (only by owner)
- **Browse** public data shared by other users
- **Track** metadata including creation time and last update time

## Features

### Core Functionality

1. **Store Data** - Save key-value pairs with public/private visibility
2. **Retrieve Data** - Get data by ID, key name, or owner address
3. **Update Data** - Modify existing data with timestamp tracking
4. **Delete Data** - Remove data from blockchain (owner only)
5. **Query Data** - Search public data or user-specific data
6. **Privacy Control** - Mark data as public or private

### Data Structure

```rust
pub struct DataRecord {
    pub data_id: String,           // Unique identifier
    pub owner: Address,            // Owner's wallet address
    pub key: String,               // Data key/name
    pub value: String,             // Data value
    pub timestamp: u64,            // Creation timestamp
    pub updated_at: u64,           // Last update timestamp
    pub is_public: bool,           // Public/Private flag
}
```

## Contract Methods

### `store_data(owner, key, value, is_public) -> String`
Stores new data on the blockchain.
- **Parameters:**
  - `owner`: Address of the data owner
  - `key`: Data key/identifier
  - `value`: Data value to store
  - `is_public`: Public visibility flag
- **Returns:** Generated data ID
- **Requires:** Owner authentication

### `get_data(data_id) -> Option<DataRecord>`
Retrieves a data record by its ID.
- **Parameters:**
  - `data_id`: The data ID to retrieve
- **Returns:** DataRecord if found

### `get_data_by_key(owner, key) -> Option<DataRecord>`
Retrieves a data record by owner and key name.
- **Parameters:**
  - `owner`: Owner's address
  - `key`: Data key to search
- **Returns:** DataRecord if found

### `update_data(owner, data_id, new_value) -> bool`
Updates an existing data record.
- **Parameters:**
  - `owner`: Owner address (must match owner)
  - `data_id`: ID of data to update
  - `new_value`: New value for the data
- **Returns:** true if successful
- **Requires:** Owner authentication

### `delete_data(owner, data_id) -> bool`
Deletes a data record (owner only).
- **Parameters:**
  - `owner`: Owner address
  - `data_id`: ID of data to delete
- **Returns:** true if successful
- **Requires:** Owner authentication

### `get_user_data(owner) -> Vec<DataRecord>`
Retrieves all data records owned by a specific user.
- **Parameters:**
  - `owner`: Owner's address
- **Returns:** Vector of all user's data records

### `get_public_data() -> Vec<DataRecord>`
Retrieves all public data records from the blockchain.
- **Returns:** Vector of all public data records

### `total_records() -> u32`
Returns the total number of data records stored.

### `data_exists(data_id) -> bool`
Checks if a data record exists.
- **Parameters:**
  - `data_id`: ID to check
- **Returns:** true if exists

### `get_user_record_count(owner) -> u32`
Returns the count of records owned by a user.
- **Parameters:**
  - `owner`: Owner's address
- **Returns:** Number of records

## Building the Contract

### Prerequisites
- Rust 1.70+
- Soroban CLI
- Stellar development environment

### Build Steps

```bash
cd contracts/data_storage

# Build for release
cargo build --release --target wasm32-unknown-unknown

# The compiled WASM file will be at:
# target/wasm32-unknown-unknown/release/data_storage.wasm
```

## Testing

Run the included unit tests:

```bash
cd contracts/data_storage
cargo test
```

### Test Coverage

1. **test_store_and_retrieve_data** - Tests storing and retrieving data
2. **test_update_data** - Tests updating data values
3. **test_user_data_retrieval** - Tests querying all user data

## Deployment

### Deploy to Stellar Network

1. Install Soroban CLI:
```bash
cargo install soroban-cli
```

2. Configure your network (testnet/mainnet):
```bash
soroban network add \
  --name testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

3. Deploy the contract:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/data_storage.wasm \
  --id CDATAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --network testnet \
  --source-account YOUR_ACCOUNT_ID
```

## Usage Examples

### Store User Profile Data

```javascript
const dataId = await contract.store_data(
  userAddress,
  "profile",
  JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    status: "active"
  }),
  false  // private
);
```

### Retrieve Data

```javascript
const data = await contract.get_data(dataId);
console.log(data);
// Output:
// {
//   data_id: "DATA_0",
//   owner: "GXXXXXX...",
//   key: "profile",
//   value: "{...}",
//   timestamp: 1234567890,
//   updated_at: 1234567890,
//   is_public: false
// }
```

### Update Data

```javascript
const success = await contract.update_data(
  userAddress,
  dataId,
  JSON.stringify({
    name: "John Doe",
    email: "newemail@example.com",
    status: "active"
  })
);
```

### Get All User Data

```javascript
const userDataRecords = await contract.get_user_data(userAddress);
console.log(`User has ${userDataRecords.length} records`);
```

### Share Public Data

```javascript
const sharedDataId = await contract.store_data(
  userAddress,
  "public_announcement",
  "Check out my new project!",
  true  // public
);
```

### Browse Public Data

```javascript
const publicData = await contract.get_public_data();
publicData.forEach(record => {
  console.log(`${record.owner}: ${record.value}`);
});
```

## Security Considerations

1. **Authentication** - All write operations require owner authentication
2. **Authorization** - Only owners can update/delete their own data
3. **Privacy** - Sensitive data can be marked as private
4. **Immutability** - Timestamp fields cannot be modified
5. **No Upgrades** - Contract code is immutable after deployment

## Storage Limits

- **Key/Value Size**: Limited by Soroban storage (typically several KB per entry)
- **Total Records**: Limited by Stellar ledger capacity
- **Transaction Size**: Limited by Soroban transaction limits

## Gas Optimization

The contract uses Soroban's persistent storage with the following optimizations:
- Efficient indexing by user and public status
- Minimal data duplication
- Compressed WASM binary (opt-level = "z")

## Future Enhancements

- [ ] Multi-owner data sharing
- [ ] Data expiration/TTL support
- [ ] Full-text search indexes
- [ ] Data versioning and history
- [ ] Access control lists (ACL)
- [ ] Data encryption on-chain
- [ ] Batch operations support

## License

MIT

## Support

For issues, questions, or contributions, please refer to the main StellarGuard project documentation.
