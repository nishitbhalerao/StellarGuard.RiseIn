#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, Map};

/// Data storage record structure
#[contracttype]
#[derive(Clone)]
pub struct DataRecord {
    pub data_id: String,
    pub owner: Address,
    pub key: String,
    pub value: String,
    pub timestamp: u64,
    pub updated_at: u64,
    pub is_public: bool,
}

/// Storage keys
const DATA_RECORDS: &str = "DATA";
const USER_DATA_INDEX: &str = "USER_DATA";
const TOTAL_RECORDS: &str = "TOTAL";
const PUBLIC_DATA_INDEX: &str = "PUBLIC";

#[contract]
pub struct DataStorage;

#[contractimpl]
impl DataStorage {
    /// Store new data on the blockchain
    /// Returns the data ID
    pub fn store_data(
        env: Env,
        owner: Address,
        key: String,
        value: String,
        is_public: bool,
    ) -> String {
        owner.require_auth();

        let current_time = env.ledger().timestamp();
        let record_count: u32 = env
            .storage()
            .persistent()
            .get(&TOTAL_RECORDS)
            .unwrap_or(0);

        let data_id = String::from_str(&env, &format!("DATA_{}", record_count));

        let data_record = DataRecord {
            data_id: data_id.clone(),
            owner: owner.clone(),
            key: key.clone(),
            value,
            timestamp: current_time,
            updated_at: current_time,
            is_public,
        };

        // Store the main record
        let main_key = (DATA_RECORDS, data_id.clone());
        env.storage().persistent().set(&main_key, &data_record);

        // Index by user
        let user_key = (USER_DATA_INDEX, owner.clone(), record_count);
        env.storage().persistent().set(&user_key, &data_id);

        // Index public data if specified
        if is_public {
            let public_key = (PUBLIC_DATA_INDEX, record_count);
            env.storage().persistent().set(&public_key, &data_id);
        }

        // Update total count
        env.storage()
            .persistent()
            .set(&TOTAL_RECORDS, &(record_count + 1));

        data_id
    }

    /// Retrieve data by ID
    pub fn get_data(env: Env, data_id: String) -> Option<DataRecord> {
        let key = (DATA_RECORDS, data_id);
        env.storage().persistent().get(&key)
    }

    /// Retrieve data by key name
    pub fn get_data_by_key(env: Env, owner: Address, key: String) -> Option<DataRecord> {
        let count: u32 = env
            .storage()
            .persistent()
            .get(&TOTAL_RECORDS)
            .unwrap_or(0);

        for i in 0..count {
            let user_key = (USER_DATA_INDEX, owner.clone(), i);
            if let Some(data_id) = env.storage().persistent().get::<_, String>(&user_key) {
                if let Some(record) = Self::get_data(env.clone(), data_id) {
                    if record.key == key {
                        return Some(record);
                    }
                }
            }
        }

        None
    }

    /// Update existing data
    pub fn update_data(
        env: Env,
        owner: Address,
        data_id: String,
        new_value: String,
    ) -> bool {
        owner.require_auth();

        let key = (DATA_RECORDS, data_id);
        if let Some(mut record) = env.storage().persistent().get::<_, DataRecord>(&key) {
            // Verify owner
            if record.owner != owner {
                return false;
            }

            record.value = new_value;
            record.updated_at = env.ledger().timestamp();

            env.storage().persistent().set(&key, &record);
            return true;
        }

        false
    }

    /// Delete data (only owner can delete)
    pub fn delete_data(env: Env, owner: Address, data_id: String) -> bool {
        owner.require_auth();

        let key = (DATA_RECORDS, data_id.clone());
        if let Some(record) = env.storage().persistent().get::<_, DataRecord>(&key) {
            // Verify owner
            if record.owner != owner {
                return false;
            }

            // Remove from storage
            env.storage().persistent().remove(&key);
            return true;
        }

        false
    }

    /// Get all data records for a specific owner
    pub fn get_user_data(env: Env, owner: Address) -> Vec<DataRecord> {
        let mut data_records = Vec::new(&env);
        let count: u32 = env
            .storage()
            .persistent()
            .get(&TOTAL_RECORDS)
            .unwrap_or(0);

        for i in 0..count {
            let user_key = (USER_DATA_INDEX, owner.clone(), i);
            if let Some(data_id) = env.storage().persistent().get::<_, String>(&user_key) {
                if let Some(record) = Self::get_data(env.clone(), data_id) {
                    data_records.push_back(record);
                }
            }
        }

        data_records
    }

    /// Get all public data records
    pub fn get_public_data(env: Env) -> Vec<DataRecord> {
        let mut public_records = Vec::new(&env);
        let count: u32 = env
            .storage()
            .persistent()
            .get(&TOTAL_RECORDS)
            .unwrap_or(0);

        for i in 0..count {
            let public_key = (PUBLIC_DATA_INDEX, i);
            if let Some(data_id) = env.storage().persistent().get::<_, String>(&public_key) {
                if let Some(record) = Self::get_data(env.clone(), data_id) {
                    if record.is_public {
                        public_records.push_back(record);
                    }
                }
            }
        }

        public_records
    }

    /// Get total number of data records stored
    pub fn total_records(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&TOTAL_RECORDS)
            .unwrap_or(0)
    }

    /// Check if data exists
    pub fn data_exists(env: Env, data_id: String) -> bool {
        let key = (DATA_RECORDS, data_id);
        env.storage().persistent().has(&key)
    }

    /// Get total records by owner
    pub fn get_user_record_count(env: Env, owner: Address) -> u32 {
        let user_data = Self::get_user_data(env, owner);
        user_data.len()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_store_and_retrieve_data() {
        let env = Env::default();
        let owner = Address::random(&env);

        let key = String::from_str(&env, "user_profile");
        let value = String::from_str(&env, "john_doe");

        let data_id = DataStorage::store_data(
            env.clone(),
            owner.clone(),
            key.clone(),
            value.clone(),
            false,
        );

        let retrieved = DataStorage::get_data(env, data_id);
        assert!(retrieved.is_some());

        let record = retrieved.unwrap();
        assert_eq!(record.key, key);
        assert_eq!(record.value, value);
        assert_eq!(record.owner, owner);
    }

    #[test]
    fn test_update_data() {
        let env = Env::default();
        let owner = Address::random(&env);

        let data_id = DataStorage::store_data(
            env.clone(),
            owner.clone(),
            String::from_str(&env, "counter"),
            String::from_str(&env, "100"),
            false,
        );

        let updated = DataStorage::update_data(
            env.clone(),
            owner.clone(),
            data_id.clone(),
            String::from_str(&env, "200"),
        );

        assert!(updated);

        let record = DataStorage::get_data(env, data_id).unwrap();
        assert_eq!(record.value, String::from_str(&env, "200"));
    }

    #[test]
    fn test_user_data_retrieval() {
        let env = Env::default();
        let owner = Address::random(&env);

        DataStorage::store_data(
            env.clone(),
            owner.clone(),
            String::from_str(&env, "email"),
            String::from_str(&env, "user@example.com"),
            false,
        );

        DataStorage::store_data(
            env.clone(),
            owner.clone(),
            String::from_str(&env, "age"),
            String::from_str(&env, "25"),
            false,
        );

        let user_data = DataStorage::get_user_data(env, owner);
        assert_eq!(user_data.len(), 2);
    }
}
