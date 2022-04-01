use crate::diesel::RunQueryDsl;
use chrono::NaiveDateTime;
use diesel::{
    sql_query,
    sql_types::{Integer, Timestamp},
    PgConnection,
};

use crate::{errors::ApiError, models::table::OnlyId};

pub fn get_available_tables_between_dates(
    conn: &PgConnection,
    date_a: NaiveDateTime,
    date_b: NaiveDateTime,
    people_count: i32,
) -> Result<Vec<OnlyId>, ApiError> {
    let q = "
        SELECT DISTINCT t.id, t.max_people FROM tables t
        LEFT JOIN reservations r ON t.id=r.table_id 
        WHERE t.available = true 
        AND t.max_people >= $1 
        AND (t.max_people * 1. / 2) <= $2
        AND NOT EXISTS (SELECT TRUE FROM reservations WHERE (for_date BETWEEN $3 AND $4) AND table_id=t.id AND cancelled=false) 
        ORDER BY t.max_people
    ";

    let query = sql_query(q)
        .bind::<Integer, _>(people_count)
        .bind::<Integer, _>(people_count)
        .bind::<Timestamp, _>(date_a)
        .bind::<Timestamp, _>(date_b);

    let results: Vec<OnlyId> = query.get_results(conn).unwrap();

    return Ok(results);
}
