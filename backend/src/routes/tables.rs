use crate::auth::{RequestAdmin, RequestModOrAdmin};
use crate::db;
use crate::errors::{ApiError, FieldValidator};

use rocket_contrib::json::{Json, JsonValue};
use serde::Deserialize;

#[derive(Deserialize, Validate)]
pub struct NewTable {
    max_people: Option<i32>,
    available: Option<bool>,
}

#[post("/tables", format = "json", data = "<new_table>")]
pub fn post_tables(
    _admin: RequestAdmin,
    new_table: Json<NewTable>,
    conn: db::Conn,
) -> Result<JsonValue, ApiError> {
    let new_table = new_table.into_inner();

    let mut extractor = FieldValidator::validate(&new_table);
    let max_people = extractor.extract("max_people", new_table.max_people);
    let available = extractor.extract("available", new_table.available);

    extractor.check()?;

    db::tables::create(&conn, max_people, available).map(|table| json!({ "table": table }))
}

#[get("/tables")]
pub fn get_tables(_moderator: RequestModOrAdmin, conn: db::Conn) -> Result<JsonValue, ApiError> {
    db::tables::get_all(&conn).map(|tables| json!({ "tables": tables }))
}

#[patch("/tables/<table_id>", format = "json", data = "<new_table>")]
pub fn patch_tables(
    _moderator: RequestModOrAdmin,
    table_id: i32,
    new_table: Json<NewTable>,
    conn: db::Conn,
) -> Result<JsonValue, ApiError> {
    let new_table = new_table.into_inner();

    let mut extractor = FieldValidator::validate(&new_table);
    let max_people = extractor.extract("max_people", new_table.max_people);
    let available = extractor.extract("available", new_table.available);

    extractor.check()?;

    db::tables::update(&conn, table_id, max_people, available)
        .map(|table| json!({ "table": table }))
}

#[delete("/tables/<table_id>")]
pub fn delete_tables(
    _admin: RequestAdmin,
    table_id: i32,
    conn: db::Conn,
) -> Result<JsonValue, ApiError> {
    db::tables::delete(&conn, table_id).map(|_| json!({ "result": "success" }))
}
