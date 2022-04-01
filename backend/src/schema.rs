table! {
    reservations (id) {
        id -> Int4,
        user_id -> Int4,
        for_date -> Timestamp,
        people_count -> Int4,
        cancelled -> Nullable<Bool>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        table_id -> Int4,
    }
}

table! {
    tables (id) {
        id -> Int4,
        max_people -> Int4,
        available -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

table! {
    users (id) {
        id -> Int4,
        first_name -> Varchar,
        last_name -> Varchar,
        phone -> Varchar,
        urole -> Int4,
        deleted_at -> Nullable<Timestamp>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

table! {
    users_auth (id) {
        id -> Int4,
        email -> Varchar,
        passhash -> Varchar,
        user_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

joinable!(reservations -> tables (table_id));
joinable!(reservations -> users (user_id));
joinable!(users_auth -> users (user_id));

allow_tables_to_appear_in_same_query!(
    reservations,
    tables,
    users,
    users_auth,
);
