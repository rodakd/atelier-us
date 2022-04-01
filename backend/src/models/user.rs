use chrono::{Duration, NaiveDateTime, Utc};
use serde::Serialize;

use crate::auth::Auth;

#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub urole: i32,
    pub deleted_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable)]
pub struct UserAuth {
    pub id: i32,
    pub email: String,
    pub passhash: String,
    pub user_id: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserJson {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: String,
    pub token: String,
    pub urole: i32,
}

impl UserJson {
    pub fn new(user: &User, user_auth: &UserAuth, secret: &[u8]) -> UserJson {
        let exp = Utc::now() + Duration::days(60);
        let token = Auth {
            id: user.id,
            exp: exp.timestamp(),
        }
        .token(secret);

        UserJson {
            first_name: user.first_name.clone(),
            last_name: user.last_name.clone(),
            email: user_auth.email.clone(),
            phone: user.phone.clone(),
            urole: user.urole,
            token,
        }
    }
}
