use crate::errors::ApiError;
use crate::models::user::{User, UserAuth, UserJson};
use crate::schema::{users, users_auth};
use crypto::scrypt::{scrypt_check, scrypt_simple, ScryptParams};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use rocket::http::Status;

use diesel::result::Error as DieselError;

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub first_name: &'a str,
    pub last_name: &'a str,
    pub phone: &'a str,
}

#[derive(Insertable)]
#[table_name = "users_auth"]
pub struct NewUserAuth<'a> {
    pub email: &'a str,
    pub passhash: &'a str,
    pub user_id: i32,
}

pub fn create(
    conn: &PgConnection,
    first_name: &str,
    last_name: &str,
    email: &str,
    phone: &str,
    password: &str,
    secret: &[u8],
) -> Result<UserJson, ApiError> {
    let existing_user = users_auth::table
        .filter(users_auth::email.eq(email))
        .get_result::<UserAuth>(conn);

    if let Ok(existing_user) = existing_user {
        return Err(ApiError::new(
            Status::Forbidden,
            &*format!("User with email {} already exists!", existing_user.email),
        ));
    }

    let passhash = &scrypt_simple(password, &ScryptParams::new(12, 8, 1)).expect("hash error");

    let new_user = &NewUser {
        first_name,
        last_name,
        phone,
    };

    let (user, user_auth) = conn.transaction::<_, diesel::result::Error, _>(|| {
        let user = diesel::insert_into(users::table)
            .values(new_user)
            .get_result::<User>(conn)?;

        let new_user_auth = &NewUserAuth {
            email,
            passhash,
            user_id: user.id,
        };

        let user_auth = diesel::insert_into(users_auth::table)
            .values(new_user_auth)
            .get_result::<UserAuth>(conn)?;

        Ok((user, user_auth))
    })?;

    Ok(UserJson::new(&user, &user_auth, &secret))
}

pub fn login(
    conn: &PgConnection,
    email: &str,
    password: &str,
    secret: &[u8],
) -> Result<UserJson, ApiError> {
    let user_auth = match users_auth::table
        .filter(users_auth::email.eq(email))
        .get_result::<UserAuth>(conn)
    {
        Ok(user_auth) => user_auth,
        Err(DieselError::NotFound) => {
            return Err(ApiError::new(Status::Unauthorized, "Invalid credentials"))
        }
        Err(e) => return Err(e.into()),
    };

    let password_matches = scrypt_check(password, &user_auth.passhash)?;

    if !password_matches {
        return Err(ApiError::new(Status::Unauthorized, "Invalid credentials"));
    }

    let user = match users::table
        .filter(
            users::id
                .eq(user_auth.user_id)
                .and(users::deleted_at.is_null()),
        )
        .get_result::<User>(conn)
    {
        Ok(user) => user,
        Err(DieselError::NotFound) => {
            return Err(ApiError::new(Status::Unauthorized, "Invalid credentials"))
        }
        Err(e) => return Err(e.into()),
    };

    Ok(UserJson::new(&user, &user_auth, &secret))
}
