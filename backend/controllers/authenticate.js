const jwt = require("jsonwebtoken");
let User = require('./../models/user.js');
require("dotenv").config();


const checkTokenValidity = async (req, res) => {
    const token = String(req.headers.authorization)
        .replace(/^bearer|^jwt/i, "")
        .replace(/^\s+|\s+$/gi, "");

    try {
        if (!token) {
            return res.status(403).json({
                msg: "A token is required for authentication",
            });
        }
        /* Verifying the token. */
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        req.userData = decoded;
        return res.status(201).json({
            msg: "Token is valid",
            username: decoded.username,
            roleLevel: decoded.roleLevel
        })

    } catch (err) {
        return res.status(401).json({
            statusCode: 401,
            msg: "Invalid Token",
        });
    }
};



const login = async (req, res) => {
    
    const { username, password } = req.body;
    if (!(typeof(username) === "string" && typeof(password) === "string")) {
        // console.log("Username and password supplied are not of correct data type!") 
        return res.status(400).json({
            message: "Username and password supplied are not of correct data type!",
        });
    }

    try {

        let userFromDatabase = await User.search({ 'username': username });

        if (userFromDatabase.length === 0) {
            // console.log('There is no such user!');
            
            return res.status(404).json({
                message: "User not found!",
            });
        }

        userFromDatabase = new User(userFromDatabase[0]); //* There should anyway be only one user; one username

        userFromDatabase.checkPassword(password, (error, userFound) => {

            if (userFound) {
                const payload = {
                    'username': userFromDatabase.username,
                    'roleLevel': userFromDatabase.roleLevel
                }
                const token = jwt.sign(payload, process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                });
                
                return res.status(201).json({
                    username: payload.username,
                    roleLevel: payload.roleLevel,
                    token: token
                });
            } else if (error) {                
                return res.status(500).json({
                message: "Server error occurred during login process.",
            });
            } else {
                return res.status(401).json({
                    message: "Invalid username or password",
                });
            }
        })


    } catch (err) {
        // console.log("Error occurred during login:", err);
        return res.status(500).json({
            message: "Server error occurred during login process."
        })
    }
};

module.exports = {
    login, checkTokenValidity
};