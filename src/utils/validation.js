const validator = require("validator");

const validateUser = (req) => {
    const { firstName, lastName, emailId, age, gender, password } = req.body;

    if (!firstName || !emailId || !password) {
        const error = new Error("Request Data missing");
        error.statusCode = 400; // Bad Request
        throw error;
    }

    if (firstName.length < 2 || firstName.length > 50) {
        const error = new Error("First Name should be between 2-50 characters");
        error.statusCode = 400; // Bad Request
        throw error;
    }

    if (emailId && !validator.isEmail(emailId)) {
        const error = new Error("Please Enter a valid email id");
        error.statusCode = 422; // Unprocessable Entity
        throw error;
    }

};

module.exports = { validateUser };
