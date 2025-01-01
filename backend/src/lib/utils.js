import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {

    // generate jwt token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',  // token will expire in 7 days
    });

    // set the token in a cookie
    res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiry time (7 days)
        httpOnly: true, // Cookie is not accessible by JavaScript (security)
        sameSite: "Strict", // Cookie only sent in first-party context
        secure: process.env.NODE_ENV === "production" ? true : false, // Secure cookie in production
    });

    return token;
};
