const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const quries = require('../services/authQueries');
var speakeasy = require("speakeasy");
var QRCode = require('qrcode');

// Login User
exports.login = async (db, req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try {
        if (!password) {
            return res.status(400).send({
                success: false,
                msg: "password required"
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "email required"
            });
        }
        db.query(quries.getUsers, email, async function (error, user) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (user.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No User found"
                });
            } else {
                if (user[0].isVerified == false) {
                    return res.status(200).send({
                        success: false,
                        message: "deactive account"
                    });
                }

                const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
                if (user[0].password == hash) {

                    const jwtToken = jwt.sign({
                        email: req.body.email,
                        id: user[0].id,
                        mobile_number: user[0].mobile_number
                    }, config.JWT_SECRET_KEY, {
                        expiresIn: config.SESSION_EXPIRES_IN
                    })
                    var id = user[0].id
                    db.query(quries.getUserSettings, id, async function (error, settingsData) {
                        if(settingsData[0].activities_log == 1){
                            var activity = {
                                "user_id"   : id,
                                "activity"  : 'Login',
                            }
                            await db.query(quries.insertActivityData, activity);
                        }
                    })

                    var unusual_activity_count = 0
                    db.query(quries.updateUnusualActivity, [unusual_activity_count , id], async function (error, result) {

                    });

                    // Update Google auth code if code is null
                    var SecretKey = user[0].google_auth_code
                    if(!SecretKey){
                        var secret = speakeasy.generateSecret({ length : 20 });
                        var key =    secret.base32
                        await db.query(quries.updateUsersAuth,[key ,id],function(error,data){
                            console.log(error);
                        })

                        QRCode.toDataURL(secret.otpauth_url, function(error, data_url) {
                            db.query(quries.updateUsersAuthQrCode,[data_url,id],function(error,data){
                                console.log(error);
                            })
                      });                        
                    }                        

                    return res.status(200).send({
                        success: true,
                        message: jwtToken,
                        data : {
                            id    : user[0].id,
                            email : user[0].email,
                            username : user[0].username,
                            is_enable_google_auth_code : user[0].is_enable_google_auth_code,
                            account_status : user[0].account_status
                        }
                    });
                } else {

                    var userDetails = user[0]
                    var id = userDetails.id
                    //  Unusual Activity Log
                    db.query(quries.getUserSettings, id, async function (error, settingsData) {
                        if(settingsData[0].unusual_activity == 1){

                            var unusual_activity_count = userDetails.unusual_activity_count+1
                            db.query(quries.updateUnusualActivity, [unusual_activity_count , id], async function (error, result) {
        
                            });
        
                            if(unusual_activity_count > 4){
                                emailUtility.transporter.sendMail(emailUtility.mailOptions(email, config.otp.unusualActivity, config.otp.template.unusualActivityHtml()), async (error, info) => { });                        
                            }
                        }
                    })

                    return res.status(400).send({
                        success: false,
                        message: "Password does not match"
                    });
                }
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "unexpected internal error",
            err
        });
    }

}
