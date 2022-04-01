use chrono::NaiveDateTime;
use serde::Serialize;

#[derive(Queryable, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Reservation {
    pub id: i32,
    pub user_id: i32,
    pub for_date: NaiveDateTime,
    pub people_count: i32,
    pub cancelled: Option<bool>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub table_id: i32,
}
