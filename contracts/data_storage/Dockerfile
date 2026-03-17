# Build Soroban Contract in Docker
FROM rust:latest

WORKDIR /app

# Install Soroban CLI and dependencies
RUN cargo install soroban-cli && \
    rustup target add wasm32-unknown-unknown

# Copy contract files
COPY Cargo.toml .
COPY src/ src/

# Build contract
RUN cargo build --release --target wasm32-unknown-unknown

# Output ready for deployment
CMD ["bash", "-c", "echo '✅ Contract built to:' && ls -lh target/wasm32-unknown-unknown/release/data_storage.wasm"]
