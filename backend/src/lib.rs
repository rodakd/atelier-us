#![feature(proc_macro_hygiene, decl_macro, int_abs_diff)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
use rocket_cors;

#[macro_use]
extern crate diesel;

#[macro_use]
extern crate validator_derive;

use dotenv::dotenv;
use rocket_contrib::json::JsonValue;
use rocket_cors::Cors;

mod db;
mod models;
mod routes;

mod auth;
mod config;
mod errors;
mod schema;

#[catch(404)]
fn not_found() -> JsonValue {
    json!({
        "error": "Endpoint not found or payload required"
    })
}

fn cors_fairing() -> Cors {
    Cors::from_options(&Default::default()).expect("Cors fairing cannot be created")
}

pub fn rocket() -> rocket::Rocket {
    dotenv().ok();
    rocket::custom(config::from_env())
        .mount(
            "/api",
            routes![
                routes::users::post_users,
                routes::users::post_users_login,
                routes::tables::post_tables,
                routes::tables::get_tables,
                routes::tables::patch_tables,
                routes::tables::delete_tables,
                routes::reservations::post_reservation,
                routes::reservations::get_reservations,
                routes::reservations::get_my_reservations,
                routes::reservations::get_available_hours,
                routes::reservations::cancel_reservation
            ],
        )
        .attach(db::Conn::fairing())
        .attach(cors_fairing())
        .attach(config::AppState::manage())
        .register(catchers![not_found])
}
