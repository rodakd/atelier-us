use crate::auth::RequestUser;
use crate::db::helpers::get_available_tables_between_dates;
use crate::diesel::RunQueryDsl;
use crate::errors::ApiError;
use crate::models::reservation::Reservation;
use crate::models::table::OnlyId;
use crate::schema::reservations;
use chrono::{Duration, NaiveDateTime, Timelike};
use diesel::pg::PgConnection;
use diesel::sql_types::{Integer, Timestamp};
use diesel::{prelude::*, sql_query};
use rocket::http::Status;
use serde::Serialize;

#[derive(Insertable)]
#[table_name = "reservations"]
pub struct NewReservation {
    pub user_id: i32,
    pub for_date: NaiveDateTime,
    pub people_count: i32,
    pub table_id: i32,
}

pub fn create(
    conn: &PgConnection,
    for_date: NaiveDateTime,
    people_count: i32,
    user: &RequestUser,
) -> Result<Reservation, ApiError> {
    const RESERVATION_DURATION_HOURS: i64 = 2;

    let date_a = for_date - Duration::hours(RESERVATION_DURATION_HOURS) + Duration::minutes(5);
    let date_b = for_date + Duration::hours(RESERVATION_DURATION_HOURS) - Duration::minutes(5);
    let tables = get_available_tables_between_dates(&conn, date_a, date_b, people_count)?;

    if tables.len() == 0 {
        return Err(ApiError::new(
            Status::BadRequest,
            &*format!("No available places for this date"),
        ));
    }

    let new_reservation = NewReservation {
        user_id: user.id,
        for_date,
        people_count,
        table_id: tables[0].id,
    };

    let reservation: Reservation = diesel::insert_into(reservations::table)
        .values(new_reservation)
        .get_result(conn)?;

    Ok(reservation)
}

#[derive(Serialize, QueryableByName, Debug)]
#[table_name = "reservations"]
pub struct ReservationResult {
    pub id: i32,
    pub table_id: i32,
    pub for_date: NaiveDateTime,
}

pub fn get_available_hours(
    conn: &PgConnection,
    for_date: NaiveDateTime,
    people_count: i32,
) -> Result<Vec<u32>, ApiError> {
    let q = "
        SELECT t.id FROM tables t 
        WHERE t.available = true 
        AND t.max_people >= $1 
        AND (t.max_people * 1. / 2) <= $2
    ";

    let query = sql_query(q)
        .bind::<Integer, _>(people_count)
        .bind::<Integer, _>(people_count);

    let available_tables: Vec<OnlyId> = query.get_results(conn).unwrap();

    if available_tables.is_empty() {
        return Ok(Vec::new());
    }

    let q2 = "
        SELECT r.id, r.table_id, r.for_date FROM reservations r
        WHERE r.for_date BETWEEN $1 AND $2 AND r.cancelled=false
    ";

    let query2 = sql_query(q2)
        .bind::<Timestamp, _>(for_date)
        .bind::<Timestamp, _>(for_date + Duration::hours(24));

    let reservations: Vec<ReservationResult> = query2.get_results(conn).unwrap();

    let hours = vec![9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    let mut available_hours: Vec<u32> = Vec::new();

    for h in hours {
        for t in &available_tables {
            let found_reservation = reservations.iter().find(|r| {
                let r_hour = r.for_date.hour();
                return t.id == r.table_id && r_hour.abs_diff(h) <= 1;
            });

            if found_reservation.is_none() {
                available_hours.push(h);
                break;
            }
        }
    }

    Ok(available_hours)
}

pub fn get_all(conn: &PgConnection) -> Result<Vec<Reservation>, ApiError> {
    let all_reservations = reservations::table
        .order(reservations::for_date)
        .get_results::<Reservation>(conn)?;
    Ok(all_reservations)
}

pub fn get_all_my(conn: &PgConnection, user: &RequestUser) -> Result<Vec<Reservation>, ApiError> {
    let my_reservations = reservations::table
        .order(reservations::for_date.desc())
        .filter(reservations::user_id.eq(user.id))
        .get_results::<Reservation>(conn)?;
    Ok(my_reservations)
}

pub fn cancel_reservation(
    conn: &PgConnection,
    id: i32,
    user: &RequestUser,
) -> Result<(), ApiError> {
    let q = "
        UPDATE reservations SET cancelled=TRUE 
        WHERE id = $1 AND user_id = $2
    ";

    let query = sql_query(q)
        .bind::<Integer, _>(id)
        .bind::<Integer, _>(user.id);

    query.execute(conn).unwrap();

    return Ok(());
}
