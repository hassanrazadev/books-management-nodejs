/**
 * send success response
 * @param message
 * @param payload
 * @returns {{data, message: string, status: boolean}}
 */
exports.successResponse = ( message, payload ) => {
    return {
        status: true,
        message: message,
        data: payload
    }
}

/**
 * send fail response
 * @param message
 * @param payload
 * @returns {{message: string, status: boolean}}
 */
exports.failResponse = ( message, payload = null ) => {
    let response = {
        status: false,
        message: message
    }

    if ( payload ) { response.data = payload }

    return response;
}

/**
 * send not found response
 * @returns {{message: string, status: boolean}}
 */
exports.notFoundResponse = () => {
    return {
        status: false,
        message: "Unable to find the requested resource."
    }
}