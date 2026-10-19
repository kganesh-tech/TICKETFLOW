const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization token is required"
        });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);
    console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

    if (!token) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    try {

        console.log("VERIFY SECRET:" , process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED USER:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("JWT ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });

    }
}

module.exports = authMiddleware;