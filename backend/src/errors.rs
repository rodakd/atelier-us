use rocket::http::Status;
use rocket::request::Request;
use rocket::response::status;
use rocket::response::{self, Responder};
use rocket_contrib::json::Json;
use validator::{Validate, ValidationError, ValidationErrors};

#[derive(Debug)]
pub struct ApiError {
    errors: Option<ValidationErrors>,
    error: Option<(Status, Option<String>)>,
}

impl ApiError {
    pub fn new(status: Status, message: &str) -> Self {
        Self {
            errors: None,
            error: Some((status, Some(message.to_string()))),
        }
    }
}

impl From<diesel::result::Error> for ApiError {
    fn from(error: diesel::result::Error) -> Self {
        ApiError::new(Status::InternalServerError, &*error.to_string())
    }
}

impl From<&'static str> for ApiError {
    fn from(error: &'static str) -> Self {
        ApiError::new(Status::InternalServerError, &*error.to_string())
    }
}

impl<'r> Responder<'r> for ApiError {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        if let Some(serrors) = self.errors {
            let mut errors = json!({});

            for (field, field_errors) in serrors.into_errors() {
                errors[field] = serde_json::to_value(field_errors).unwrap();
            }

            return status::Custom(
                Status::UnprocessableEntity,
                Json(json!({ "errors": errors })),
            )
            .respond_to(req);
        }

        if let Some(serror) = self.error {
            if let Some(error_msg) = serror.1 {
                return status::Custom(serror.0, Json(json!({ "error": error_msg })))
                    .respond_to(req);
            }

            return serror.0.respond_to(req);
        }

        Status::InternalServerError.respond_to(req)
    }
}

pub struct FieldValidator {
    errors: ValidationErrors,
}

impl FieldValidator {
    pub fn validate<T: Validate>(model: &T) -> Self {
        Self {
            errors: model.validate().err().unwrap_or_else(ValidationErrors::new),
        }
    }

    // Convenience method to trigger early returns with ? operator.
    pub fn check(self) -> Result<(), ApiError> {
        if self.errors.is_empty() {
            Ok(())
        } else {
            Err(ApiError {
                errors: Some(self.errors),
                error: None,
            })
        }
    }

    pub fn extract<T>(&mut self, field_name: &'static str, field: Option<T>) -> T
    where
        T: Default,
    {
        field.unwrap_or_else(|| {
            self.errors
                .add(field_name, ValidationError::new("can't be blank"));
            T::default()
        })
    }
}
