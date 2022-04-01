use crate::config::AppState;
use crate::models::user::User;
use crate::schema::users;
use crate::{config, db};

use diesel::prelude::*;
use rocket::http::Status;
use rocket::request::{self, FromRequest, Request};
use rocket::{Outcome, State};
use serde::{Deserialize, Serialize};

use jsonwebtoken as jwt;

#[derive(Debug, Deserialize, Serialize)]
pub struct Auth {
    pub exp: i64,
    pub id: i32,
}

#[derive(Debug)]
pub struct RequestUser {
    pub id: i32,
    pub urole: i32,
}

pub struct RequestAdmin;
pub struct RequestModOrAdmin;

impl Auth {
    pub fn token(&self, secret: &[u8]) -> String {
        jwt::encode(&jwt::Header::default(), self, secret).expect("jwt")
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for RequestUser {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<RequestUser, Self::Error> {
        let state: State<AppState> = request.guard()?;

        if let Some(auth) = extract_auth_from_request(request, &state.secret) {
            let conn = db::Conn::from_request(request)?;
            let user = users::table
                .filter(users::id.eq(auth.id))
                .get_result::<User>(&*conn)
                .ok();

            if let Some(user) = user {
                let ruser = RequestUser {
                    id: user.id,
                    urole: user.urole,
                };

                return Outcome::Success(ruser);
            }
        }

        Outcome::Failure((Status::Forbidden, ()))
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for RequestAdmin {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<RequestAdmin, Self::Error> {
        let user = RequestUser::from_request(request)?;

        if is_admin(user.urole) {
            return Outcome::Success(RequestAdmin {});
        }
        Outcome::Failure((Status::Forbidden, ()))
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for RequestModOrAdmin {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<RequestModOrAdmin, Self::Error> {
        let user = RequestUser::from_request(request)?;

        if is_mod_or_admin(user.urole) {
            return Outcome::Success(RequestModOrAdmin {});
        }
        Outcome::Failure((Status::Forbidden, ()))
    }
}

fn extract_auth_from_request(request: &Request, secret: &[u8]) -> Option<Auth> {
    request
        .headers()
        .get_one("authorization")
        .and_then(extract_token_from_header)
        .and_then(|token| decode_token(token, secret))
}

fn extract_token_from_header(header: &str) -> Option<&str> {
    if header.starts_with(config::TOKEN_PREFIX) {
        Some(&header[config::TOKEN_PREFIX.len()..])
    } else {
        None
    }
}

fn decode_token(token: &str, secret: &[u8]) -> Option<Auth> {
    use jwt::{Algorithm, Validation};

    jwt::decode(token, secret, &Validation::new(Algorithm::HS256))
        .map_err(|err| {
            eprintln!("Auth decode error: {:?}", err);
        })
        .ok()
        .map(|token_data| token_data.claims)
}

pub fn is_admin(urole: i32) -> bool {
    urole == 3
}

pub fn is_mod_or_admin(urole: i32) -> bool {
    urole == 3 || urole == 2
}
