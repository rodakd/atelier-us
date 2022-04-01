extern crate diesel;

pub mod helpers;
pub mod reservations;
pub mod tables;
pub mod users;

#[database("diesel_postgres_pool")]
pub struct Conn(diesel::PgConnection);
