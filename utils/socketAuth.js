require("dotenv").config();

const jwt = require("jsonwebtoken");

function socketAuth(socket, next) {

    const token =
        socket.handshake.auth.token;

    console.log("SOCKET TOKEN:", token);

    if (!token) {
        return next(
            new Error("Authentication token is required")
        );
    }

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log(
            "SOCKET DECODED USER:",
            decoded
        );

        socket.user = decoded;

        next();

    } catch (error) {

        console.log(
            "SOCKET JWT ERROR:",
            error
        );

        next(
            new Error("Invalid or expired token")
        );
    }
}

module.exports = socketAuth;