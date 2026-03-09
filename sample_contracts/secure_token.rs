#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct SecureToken;

#[contractimpl]
impl SecureToken {
    // SECURE: Has authorization check
    pub fn mint(env: Env, to: Address, amount: i128) {
        to.require_auth();
        
        let balance = Self::get_balance(env.clone(), to.clone());
        // SECURE: Using checked_add for overflow protection
        let new_balance = balance.checked_add(amount).unwrap();
        env.storage().persistent().set(&to, &new_balance);
    }

    // SECURE: Has balance validation
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        let from_balance = Self::get_balance(env.clone(), from.clone());
        // SECURE: Validates balance before transfer
        if from_balance >= amount {
            let new_from_balance = from_balance.checked_sub(amount).unwrap();
            let to_balance = Self::get_balance(env.clone(), to.clone());
            let new_to_balance = to_balance.checked_add(amount).unwrap();
            
            env.storage().persistent().set(&from, &new_from_balance);
            env.storage().persistent().set(&to, &new_to_balance);
        }
    }

    // SECURE: Proper error handling
    pub fn get_balance(env: Env, addr: Address) -> i128 {
        env.storage().persistent().get(&addr).unwrap_or(0)
    }

    // SECURE: Admin check before setting
    pub fn set_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().persistent().get(&"admin").unwrap();
        admin.require_auth();
        env.storage().persistent().set(&"admin", &new_admin);
    }
}
