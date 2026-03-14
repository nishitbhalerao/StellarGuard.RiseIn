winget install --id RustLang.Rust -e#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct Token;

#[contractimpl]
impl Token {
    // VULNERABLE: Missing authorization check
    pub fn mint(env: Env, to: Address, amount: i128) {
        let mut balance = Self::get_balance(env.clone(), to.clone());
        // VULNERABLE: No overflow protection
        balance = balance + amount;
        env.storage().persistent().set(&to, &balance);
    }

    // VULNERABLE: Missing balance validation
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        let mut from_balance = Self::get_balance(env.clone(), from.clone());
        // VULNERABLE: No check if from_balance >= amount
        from_balance = from_balance - amount;
        
        let mut to_balance = Self::get_balance(env.clone(), to.clone());
        to_balance = to_balance + amount;
        
        env.storage().persistent().set(&from, &from_balance);
        env.storage().persistent().set(&to, &to_balance);
    }

    // VULNERABLE: Using unwrap without error handling
    pub fn get_balance(env: Env, addr: Address) -> i128 {
        env.storage().persistent().get(&addr).unwrap()
    }

    // VULNERABLE: Admin function without access control
    pub fn set_admin(env: Env, new_admin: Address) {
        env.storage().persistent().set(&"admin", &new_admin);
    }
}
