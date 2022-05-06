const methods = require('../helpers/methods')
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register user
 * @param request
 * @param response
 * @param next
 */
exports.register = (request, response, next) => {

    User.create(request.body, (error, data) => {
        if (error) {
            let statusCode = 500;
            if (error.name === "ValidationError" || statusCode === 11000) {
                statusCode = 422;
            }
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

/**
 * Login user and generate JWT token
 * @param request
 * @param response
 * @param next
 */
exports.login = (request, response, next) => {
    User.findOne({
        email: request.body.email
    }).exec((error, user) => {
        if (error) {
            let statusCode = 500;
            if (error.name === "ValidationError" || statusCode === 11000) {
                statusCode = 422;
            }
            response.status(statusCode).send(
                methods.failResponse(error._message,{
                    errors: error.errors
                })
            )
            return;
        }
        if (!user) {
            response.status(404).send(
                methods.notFoundResponse("Email or password is incorrect")
            )
            return;
        }
        // user found, now check password
        const isPasswordValid = bcrypt.compareSync(
            request.body.password,
            user.password
        )
        if (!isPasswordValid) {
            response.status(401).send(
                methods.failResponse("Email or password is incorrect")
            )
            return;
        }
        const jwtToken = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        response.status(200).send(
            methods.successResponse("Login successful", {
                user: {
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                },
                accessToken: jwtToken
            })
        )
    })
}