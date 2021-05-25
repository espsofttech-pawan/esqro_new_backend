const CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
const config = require('../config');
const emailUtility = require('../utils/emailUtility');
const utils = require('../utils/randomTokenUtility');
const authQueries = require('../services/authQueries');

exports.register = async (
    db, req, res) => {
    var username  = req.body.username;
    var email      = req.body.email;
    var password   = req.body.password;
    var confirm_password   = req.body.confirm_password;

    try {
        
        if (!username) {
            return res.status(400).send({
                success: false,
                msg: "Username required"
            });
        }

        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "email required"
            });
        }

        if (password != confirm_password) {
            return res.status(400).send({
                success: false,
                msg: "password not match"
            });
        }

        if (password.length < 6) {
            return res.status(400).send({
                success: false,
                msg: "password length should be 6 characters or more"
            });
        }   

        await db.query(authQueries.getUsers, email, async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length > 0) {
                return res.status(400).send({
                    success: false,
                    msg: "user already registered"
                });
            } else {
                const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
                delete req.body.confirm_password;

                let secretToken = utils.random();
                var users = {
                    "username"      : username,
                    "email"         : email,
                    "password"      : hash,
                    "fcm_token"     : secretToken
                }

                let inserted = await db.query(authQueries.insertUserData, users);
                if (inserted) {
                    try {
                        emailUtility.transporter.sendMail(emailUtility.mailOptions(users.email, config.otp.signupSubject, config.otp.template.emailSignupHtml(secretToken)), async (error, info) => {
                            if (error) {
                                await authQueries.deleteUser(users.email)
                                console.log(error)
                                return res.status(400).send({
                                    success: true,
                                    msg: "unexpected error occured, please try to signup again"
                                });
                            } else {
                                // Show message here to email send and verify
                                console.log('Message sent: %s', info.messageId);
                                return res.status(200).send({
                                    success: true,
                                    msg: "User registered successfully, Please check email to verify"
                                });
                            }
                        });

                    } catch (e) {
                        return res.status(500).send({
                            success: false,
                            msg: e
                        });
                    }                    
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "user not registered due to internal error"
                    });
                }
            }
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "user not registered due to internal error"
        });
    }
}

exports.verifyToken = async (
    db, req, res) => {

    const token = req.params.token;
    console.log(token)
    db.query(authQueries.getToken, token, async function (error, user) {
        if (error) {
            return res.status(400).send({
                success: false,
                message: "unexpected error occured"
            });
        } else if (user.length == 0) {
            return res.status(400).send({
                success: false,
                message: "invalid token"
            });
        } else {

            if (user[0].isVerified == 0) {
                db.query('UPDATE users SET isVerified = ? WHERE `users`.`id` = ? ', [1, user[0].id], function (err, user) {
                    if (user) {
                        return res.status(200).send({
                            success: true,
                            message: "account activated"
                        });
                    } else {
                        return res.status(400).send({
                            success: true,
                            message: "account not activated, due to bad error"
                        });
                    }
                })

            } else {
                return res.status(200).send({
                    success: true,
                    message: "user already verified"
                });
            }
        }
    })
}