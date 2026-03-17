# Data Storage Smart Contract - Deployment Guide

## Quick Start

### 1. Prerequisites

Install the required tools:

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Soroban CLI
cargo install soroban-cli

# Verify installation
soroban --version
```

### 2. Build the Contract

```bash
cd contracts/data_storage

# Build the WASM binary
cargo build --release --target wasm32-unknown-unknown

# Optional: Optimize the binary
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/data_storage.wasm
```

### 3. Set Up Your Stellar Account

```bash
# Generate a new keypair (if you don't have one)
soroban keys generate --name mykey

# Fund your account on testnet
# Visit https://laboratory.stellar.org or use a faucet

# Verify account balance
soroban account balance \
  --account mykey \
  --network testnet
```

### 4. Deploy to Testnet

```bash
# Option 1: Deploy with automatic contract ID generation
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/data_storage.wasm \
  --source-account mykey \
  --network testnet

# This will output your contract ID (save this!)
# Example output: CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV
```

### 5. Interact with Your Contract

```bash
# Store some data
soroban contract invoke \
  --id CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV \
  --source-account mykey \
  --network testnet \
  -- \
  store_data \
  --owner GXXXXXX... \
  --key "user_info" \
  --value "my_value" \
  --is_public false

# Retrieve data
soroban contract invoke \
  --id CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV \
  --source-account mykey \
  --network testnet \
  -- \
  get_data \
  --data_id "DATA_0"

# Get user data
soroban contract invoke \
  --id CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV \
  --source-account mykey \
  --network testnet \
  -- \
  get_user_data \
  --owner GXXXXXX...
```

## Deployment to Mainnet

### ⚠️ Production Considerations

Before deploying to mainnet:

1. **Audit the Contract** - Have the contract reviewed by security experts
2. **Test Thoroughly** - Run extensive tests on testnet
3. **Monitor Gas Costs** - Understand the operational costs
4. **Backup Keys** - Securely store your keypairs

### Mainnet Deployment Steps

```bash
# Setup mainnet network (if not already configured)
soroban network add \
  --name mainnet \
  --rpc-url https://soroban-mainnet.stellar.org:443 \
  --network-passphrase "Public Global Stellar Network ; September 2015"

# Deploy to mainnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/data_storage.wasm \
  --source-account mykey \
  --network mainnet

# Save the contract ID
export MAINNET_CONTRACT_ID="CDATA..."
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Stellar Network (testnet or mainnet)
STELLAR_NETWORK=testnet

# Contract ID
DATA_STORAGE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV

# RPC URL
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Your account (public key)
STELLAR_ACCOUNT=GXXXXXX...

# Your key name (from soroban keys)
STELLAR_KEY_NAME=mykey
```

### Load Environment Variables

```bash
#!/bin/bash
# deploy.sh

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Build contract
echo "Building contract..."
cargo build --release --target wasm32-unknown-unknown

# Deploy contract
echo "Deploying to ${STELLAR_NETWORK}..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/data_storage.wasm \
  --source-account ${STELLAR_KEY_NAME} \
  --network ${STELLAR_NETWORK})

echo "Contract deployed with ID: ${CONTRACT_ID}"

# Update .env with new contract ID
sed -i "s/DATA_STORAGE_CONTRACT_ID=.*/DATA_STORAGE_CONTRACT_ID=${CONTRACT_ID}/" .env
```

## Testing

### Unit Tests

```bash
cd contracts/data_storage
cargo test
```

### Integration Tests

```bash
# Test with deployed contract
soroban contract invoke \
  --id ${DATA_STORAGE_CONTRACT_ID} \
  --source-account ${STELLAR_KEY_NAME} \
  --network testnet \
  -- \
  total_records
```

## Troubleshooting

### Common Issues

**Issue: "Contract not found"**
- Verify the contract ID is correct
- Check that you're using the correct network
- Ensure the contract is deployed to that network

**Issue: "Insufficient balance"**
- Fund your account with more XLM on testnet
- Visit https://stellar.org/developers/testnet-lab for testnet funds

**Issue: "Unauthorized operation"**
- Ensure you're using the correct keypair
- Verify the account exists on the network

**Issue: "Build fails"**
```bash
# Update Rust
rustup update

# Clear build cache
cargo clean

# Try rebuilding
cargo build --release --target wasm32-unknown-unknown
```

## Monitoring & Maintenance

### Check Contract Status

```bash
# Get contract info
soroban contract info \
  --id ${DATA_STORAGE_CONTRACT_ID} \
  --network testnet

# View recent transactions
soroban contract events \
  --id ${DATA_STORAGE_CONTRACT_ID} \
  --network testnet
```

### Updates and Upgrades

⚠️ **Note:** Soroban contracts are immutable. To deploy updates:

1. Deploy a new contract with the updated code
2. Migrate data from old contract (if needed)
3. Update frontend code with new contract ID
4. Maintain backward compatibility considerations

## Support & Resources

- **Stellar Documentation**: https://developers.stellar.org
- **Soroban Docs**: https://soroban.stellar.org
- **Rust Book**: https://doc.rust-lang.org/book/
- **Community**: https://stellar.org/community

## Performance Benchmarks

### Gas Costs (Testnet)

- `store_data`: ~2,000-3,000 stroops
- `get_data`: ~500-1,000 stroops
- `update_data`: ~1,500-2,000 stroops
- `delete_data`: ~1,000-1,500 stroops
- `get_user_data`: Varies with record count

### Storage Limits

- **Per Record**: ~500-1000 bytes
- **Total Ledger Size**: Limited by Stellar network capacity
- **Maximum Records**: ~10,000+ per network (estimated)

## Security Checklist

- [ ] Contract code reviewed by security auditor
- [ ] All test cases passing
- [ ] Key material secured and backed up
- [ ] Contract deployed on testnet first
- [ ] Extensive testnet testing completed
- [ ] Documentation reviewed and updated
- [ ] Monitoring and alerting configured
- [ ] Disaster recovery plan in place

## Next Steps

1. **Customize the contract** - Modify to your specific needs
2. **Create frontend integration** - Use dataStorageService.js
3. **Set up monitoring** - Track contract usage
4. **Plan scaling** - Consider contract architecture for growth
5. **Community launch** - Share your application

---

For detailed API documentation, see [README.md](./README.md)
