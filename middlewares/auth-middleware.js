const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

module.exports = (req, res, next) => {
    console.log("지나감")
    const {authorization} = req.headers;
    const {tokenType, tokenValue} = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(400).send({
            errorMessage: "로그인 후 사용하세요."
        });
        return;
    }

    try {
        const {userId} = jwt.verify(tokenValue, "secret-key");

        User.findById(userId).exex().then((user) => {
            res.locals.user = user;
            next();
        })
    } catch (error) {
        res.status(400).send({
            errorMessage: "로그인 후 사용하세요."
        });
        return;
    }
}