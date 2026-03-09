#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub struct AuditRecord {
    pub audit_id: String,
    pub wallet: Address,
    pub contract_name: String,
    pub report_hash: String,
    pub timestamp: u64,
}

const AUDITS: &str = "AUDITS";
const AUDIT_COUNT: &str = "COUNT";

#[contract]
pub struct AuditRegistry;

#[contractimpl]
impl AuditRegistry {
    /// Store a new audit hash on the blockchain
    pub fn store_audit_hash(
        env: Env,
        wallet: Address,
        contract_name: String,
        report_hash: String,
    ) -> String {
        wallet.require_auth();

        let audit_count: u32 = env
            .storage()
            .persistent()
            .get(&AUDIT_COUNT)
            .unwrap_or(0);

        let audit_id = String::from_str(&env, &format!("AUDIT_{}", audit_count));

        let audit = AuditRecord {
            audit_id: audit_id.clone(),
            wallet: wallet.clone(),
            contract_name,
            report_hash,
            timestamp: env.ledger().timestamp(),
        };

        let key = (AUDITS, audit_id.clone());
        env.storage().persistent().set(&key, &audit);

        let wallet_key = (wallet.clone(), audit_count);
        env.storage().persistent().set(&wallet_key, &audit_id);

        env.storage()
            .persistent()
            .set(&AUDIT_COUNT, &(audit_count + 1));

        audit_id
    }

    /// Get audit record by ID
    pub fn get_audit(env: Env, audit_id: String) -> Option<AuditRecord> {
        let key = (AUDITS, audit_id);
        env.storage().persistent().get(&key)
    }

    /// Get all audits for a specific wallet
    pub fn get_audits_by_wallet(env: Env, wallet: Address) -> Vec<AuditRecord> {
        let mut audits = Vec::new(&env);
        let count: u32 = env
            .storage()
            .persistent()
            .get(&AUDIT_COUNT)
            .unwrap_or(0);

        for i in 0..count {
            let wallet_key = (wallet.clone(), i);
            if let Some(audit_id) = env.storage().persistent().get::<_, String>(&wallet_key) {
                if let Some(audit) = Self::get_audit(env.clone(), audit_id) {
                    audits.push_back(audit);
                }
            }
        }

        audits
    }

    /// Get total number of audits stored
    pub fn audit_count(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&AUDIT_COUNT)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_store_and_retrieve() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuditRegistry);
        let client = AuditRegistryClient::new(&env, &contract_id);

        let wallet = Address::generate(&env);
        let contract_name = String::from_str(&env, "test_contract");
        let report_hash = String::from_str(&env, "abc123hash");

        env.mock_all_auths();

        let audit_id = client.store_audit_hash(&wallet, &contract_name, &report_hash);

        let audit = client.get_audit(&audit_id).unwrap();
        assert_eq!(audit.contract_name, contract_name);
        assert_eq!(audit.report_hash, report_hash);
        assert_eq!(audit.wallet, wallet);

        let count = client.audit_count();
        assert_eq!(count, 1);
    }
}
