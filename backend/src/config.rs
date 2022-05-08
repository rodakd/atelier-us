use rocket::config::{Config, Environment, Value};
use rocket::fairing::AdHoc;
use std::collections::HashMap;
use std::env;

pub const TOKEN_PREFIX: &'static str = "Token ";

pub struct AppState {
    pub secret: Vec<u8>,
}

impl AppState {
    pub fn manage() -> AdHoc {
        AdHoc::on_attach("Manage config", |rocket| {
            let secret = env::var("SECRET_KEY").expect("No SECRET_KEY env variable found!");

            Ok(rocket.manage(AppState {
                secret: secret.into_bytes(),
            }))
        })
    }
}

pub fn from_env() -> Config {
    let environment = Environment::active().expect("No environment found");
    let mut database_config = HashMap::new();
    let mut databases = HashMap::new();
    let database_url = env::var("DATABASE_URL").expect("No DATABASE_URL env variable found");
    database_config.insert("url", Value::from(database_url));
    databases.insert("diesel_postgres_pool", Value::from(database_config));

    Config::build(environment)
        .environment(environment)
        .port(8080)
        .extra("databases", databases)
        .finalize()
        .unwrap()
}
