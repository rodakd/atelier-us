use crate::auth::{RequestModOrAdmin, RequestUser};
use crate::db;
use crate::errors::{ApiError, FieldValidator};
use crate::models::table::OnlyId;

use chrono::NaiveDateTime;
use rocket_contrib::json::{Json, JsonValue};
use serde::Deserialize;

#[derive(Deserialize, Validate)]
pub struct NewReservationInfo {
    for_date: Option<NaiveDateTime>,
    people_count: Option<i32>,
}

#[post("/reservations", format = "json", data = "<new_reservation>")]
pub fn post_reservation(
    new_reservation: Json<NewReservationInfo>,
    conn: db::Conn,
    user: RequestUser,
) -> Result<JsonValue, ApiError> {
    let new_reservation = new_reservation.into_inner();

    let mut extractor = FieldValidator::validate(&new_reservation);
    let for_date = new_reservation.for_date.unwrap();
    let people_count = extractor.extract("people_count", new_reservation.people_count);

    extractor.check()?;

    db::reservations::create(&conn, for_date, people_count, &user)
        .map(|res| json!({ "reservation": res }))
}

#[post("/available-hours", format = "json", data = "<info>")]
pub fn get_available_hours(
    conn: db::Conn,
    info: Json<NewReservationInfo>,
) -> Result<JsonValue, ApiError> {
    let info = info.into_inner();

    let mut extractor = FieldValidator::validate(&info);
    let for_date = info.for_date.unwrap();
    let people_count = extractor.extract("people_count", info.people_count);

    db::reservations::get_available_hours(&conn, for_date, people_count)
        .map(|hours| json!({ "hours": hours }))
}

#[get("/reservations")]
pub fn get_reservations(
    _moderator: RequestModOrAdmin,
    conn: db::Conn,
) -> Result<JsonValue, ApiError> {
    db::reservations::get_all(&conn).map(|reservations| json!({ "reservations": reservations }))
}

#[get("/my-reservations")]
pub fn get_my_reservations(user: RequestUser, conn: db::Conn) -> Result<JsonValue, ApiError> {
    db::reservations::get_all_my(&conn, &user)
        .map(|reservations| json!({ "reservations": reservations }))
}

#[post("/reservations/cancel", format = "json", data = "<only_id>")]
pub fn cancel_reservation(
    user: RequestUser,
    only_id: Json<OnlyId>,
    conn: db::Conn,
) -> Result<(), ApiError> {
    db::reservations::cancel_reservation(&conn, only_id.id, &user)
}
