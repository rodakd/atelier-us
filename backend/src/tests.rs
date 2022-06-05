use super::rocket;
use rocket::local::Client;
use rocket::http::Status;

#[test]
fn check_server_handling_requests() {
    let client = Client::new(rocket()).expect("valid rocket instance");
    let response = client.get("/").dispatch();
    assert_eq!(response.status(), Status::NotFound);
}
