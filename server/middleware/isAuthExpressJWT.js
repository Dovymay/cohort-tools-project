const expressjwt = require("express-jwt")
const dotenv = require("dotenv")

dotenv.config()

if (process.env.TOKEN_SECRET === undefined) {
    throw new Error("TOKEN_SIGN_SECRET is undefined")
}

export default expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"]
})