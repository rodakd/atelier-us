use crate::errors::ApiError;
use crate::models::table::Table;
use crate::schema::tables;
use chrono::{NaiveDateTime, Utc};
use diesel::pg::PgConnection;
use diesel::prelude::*;

#[derive(Insertable)]
#[table_name = "tables"]
pub struct NewTable {
    pub max_people: i32,
    pub available: bool,
}

pub fn create(conn: &PgConnection, max_people: i32, available: bool) -> Result<Table, ApiError> {
    let new_table = NewTable {
        max_people,
        available,
    };

    let table = diesel::insert_into(tables::table)
        .values(new_table)
        .get_result::<Table>(conn)?;

    Ok(table)
}

#[derive(Insertable)]
#[table_name = "tables"]
pub struct UpdatedTable {
    pub max_people: i32,
    pub available: bool,
    pub updated_at: NaiveDateTime,
}

pub fn update(
    conn: &PgConnection,
    table_id: i32,
    max_people: i32,
    available: bool,
) -> Result<Table, ApiError> {
    let table = diesel::update(tables::table.find(table_id))
        .set((
            tables::max_people.eq(max_people),
            tables::available.eq(available),
            tables::updated_at.eq(Utc::now().naive_utc()),
        ))
        .get_result::<Table>(conn)?;

    Ok(table)
}

pub fn delete(conn: &PgConnection, table_id: i32) -> Result<(), ApiError> {
    diesel::delete(tables::table.find(table_id)).execute(conn)?;
    Ok(())
}

pub fn get_all(conn: &PgConnection) -> Result<Vec<Table>, ApiError> {
    let all_tables = tables::table.load::<Table>(conn)?;
    Ok(all_tables)
}
