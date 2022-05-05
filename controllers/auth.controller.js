const methods = require('../helpers/methods')
const User = require('../models/User');

/**
 * Register user
 * @param request
 * @param response
 * @param next
 */
exports.register =  (request, response, next) => {

    User.create(request, (error, data) => {
        if (error) {
            let statusCode = 500;
            if ( error.name === "ValidationError" ) { statusCode = 422; }
            response.status(statusCode).send(
                methods.failResponse(error._message, {
                    errors: error.errors
                })
            )
        } else {
            response.status(200).send(
                methods.successResponse("User registration successful.", {
                    user: data
                })
            )
        }
    });

 }