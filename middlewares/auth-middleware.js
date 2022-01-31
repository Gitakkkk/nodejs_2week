const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    console.log(req.headers.authorization)
    const [tokenType, tokenValue] = authorization.split(' ');
    console.log("5")
    

    if (tokenType !== 'Bearer') {
        res.status(400).send({
            errorMessage: "로그인 후 사용하세요."
        });
        console.log("3333333")
        return;
    }

    try {
        const {userId} = jwt.verify(tokenValue, "secret-key");
        console.log("1")

        User.findById(userId).exec().then((user) => {
            console.log("2")
            res.locals.user = user;
            console.log("3")
            next();
        })
    } catch (error) {
        res.status(400).send({
            errorMessage: "로그인 후 사용하세요."
        });
        return;
    }
}