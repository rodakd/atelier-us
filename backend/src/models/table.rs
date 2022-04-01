use crate::schema::tables;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Serialize, QueryableByName, Debug)]
#[serde(rename_all = "camelCase")]
#[table_name = "tables"]
pub struct Table {
    pub id: i32,
    pub max_people: i32,
    pub available: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, QueryableByName, Debug, Deserialize)]
#[table_name = "tables"]
pub struct OnlyId {
    pub id: i32,
}
