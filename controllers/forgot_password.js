const CryptoJS = require("crypto-js");
const utils = require('../utils/randomTokenUtility');
const config = require('../config');
const quries = require('../services/authQueries');
const emailUtility = require('../utils/emailUtility');

exports.forgotPassword = async (db, req, res) => {
    var email = req.body.email;
    try {
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
                    message: "Email not found"
                });
            } else {
 
                let secretToken = utils.random();
                const hash = CryptoJS.SHA256(secretToken).toString(CryptoJS.enc.Hex);
                let updated = await db.query(quries.updatePassword, [hash, email] );
                if (updated){
                    try {
                        
                        emailUtility.transporter.sendMail(emailUtility.mailOptions(email, config.otp.forgotSubject, config.otp.template.emailForgotHtml(secretToken)), async (error, info) => {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    message: "unexpected error occured, please try again"
                                });
                            } else {

                                //  Activity Log
                                var id = user[0].id
                                db.query(quries.getUserSettings, id, async function (error, settingsData) {
                                    if(settingsData[0].activities_log == 1){
                                        var activity = {
                                            "user_id"   : id,
                                            "activity"  : 'Forget Password',
                                        }
                                        await db.query(quries.insertActivityData, activity);
                                    }
                                })

                                // Confirm through email before password change
                                db.query(quries.getUserSettings, id, async function (error, settingsData) {
                                    if(settingsData[0].password_change_email_status == 1){
                                        emailUtility.transporter.sendMail(emailUtility.mailOptions(email, config.otp.alertBeforePasswordChangeSubject, config.otp.template.beforePasswordChangeHtml()), async (error, info) => { });    
                                    }
                                })                                

                                console.log('Message sent: %s', info.messageId);
                                return res.status(200).send({
                                    success: true,
                                    message: "Password reset successfully, Please check your email."
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
                        msg: "unexpected error occured, please try again"
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
