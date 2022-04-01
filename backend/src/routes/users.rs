use crate::config::AppState;
use crate::db;
use crate::errors::{ApiError, FieldValidator};

use rocket::State;
use rocket_contrib::json::{Json, JsonValue};
use serde::Deserialize;

#[derive(Deserialize, Validate)]
pub struct NewUser {
    #[validate(length(min = 1))]
    first_name: Option<String>,
    #[validate(length(min = 1))]
    last_name: Option<String>,
    #[validate(email)]
    email: Option<String>,
    #[validate(phone)]
    phone: Option<String>,
    #[validate(length(min = 8))]
    password: Option<String>,
}

#[post("/users", format = "json", data = "<new_user>")]
pub fn post_users(
    new_user: Json<NewUser>,
    conn: db::Conn,
    state: State<AppState>,
) -> Result<JsonValue, ApiError> {
    let new_user = new_user.into_inner();

    let mut extractor = FieldValidator::validate(&new_user);
    let first_name = extractor.extract("first_name", new_user.first_name);
    let last_name = extractor.extract("last_name", new_user.last_name);
    let email = extractor.extract("email", new_user.email);
    let phone = extractor.extract("phone", new_user.phone);
    let password = extractor.extract("password", new_user.password);

    extractor.check()?;

    db::users::create(
        &conn,
        &first_name,
        &last_name,
        &email,
        &phone,
        &password,
        &state.secret,
    )
    .map(|user| json!({ "user": user }))
}

#[derive(Deserialize, Validate)]
pub struct LoginUser {
    #[validate(email)]
    email: Option<String>,
    #[validate(length(min = 1))]
    password: Option<String>,
}

#[post("/users/login", format = "json", data = "<user>")]
pub fn post_users_login(
    user: Json<LoginUser>,
    conn: db::Conn,
    state: State<AppState>,
) -> Result<JsonValue, ApiError> {
    let user = user.into_inner();

    let mut extractor = FieldValidator::validate(&user);
    let email = extractor.extract("email", user.email);
    let password = extractor.extract("password", user.password);

    extractor.check()?;

    db::users::login(&conn, &email, &password, &state.secret).map(|user| json!({ "user": user }))
}
