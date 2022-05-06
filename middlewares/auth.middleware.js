const jwt = require('jsonwebtoken');
const User = require('../models/User');
const methods = require('../helpers/methods');

const verifyJwtToken = (request, response, next) => {
  if ( request.headers && request.headers.authorization && request.headers.authorization.split(' ')[0] === "JWT" ) {
      jwt.verify( request.headers.authorization.split(' ')[1],
          process.env.JWT_SECRET,
          function (error, decode) {
            if (error) request.user = undefined;
            User.findOne({
                _id: decode.id
            }).exec((error, user) => {
                if (error) {
                    return response.status(500).send(
                        methods.failResponse(error._message)
                    )
                }
                request.user = user;
                next();
            })
          });
  } else {
      return response.status(401).send(
          methods.failResponse("Unauthenticated access.")
      )
  }
}

module.exports = verifyJwtToken;