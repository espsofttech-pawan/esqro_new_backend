const CryptoJS = require("crypto-js");
const config = require('../config');
const authQueries = require('../services/authQueries');

exports.change_password = async (
    db, req, res) => {
    var user_id          = req.body.user_id;
    var old_password     = req.body.old_password;
    var new_password     = req.body.new_password;
    var confirm_password = req.body.confirm_password;

    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }

        if (!old_password) {
            return res.status(400).send({
                success: false,
                msg: "Old Password required"
            });
        }

        if (!new_password) {
            return res.status(400).send({
                success: false,
                msg: "New Password required"
            });
        }

        if (new_password != confirm_password) {
            return res.status(400).send({
                success: false,
                msg: "password not match"
            });
        }

        if (new_password.length < 6) {
            return res.status(400).send({
                success: false,
                msg: "password length should be 6 characters or more"
            });
        }   

        await db.query(authQueries.getUsersByid, user_id, async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "User not found"
                });
            } else {

                const oldpassword = results[0].password;
                const old_password1 = CryptoJS.SHA256(old_password).toString(CryptoJS.enc.Hex);

                console.log(oldpassword); console.log(old_password1); 

                if(old_password1 != oldpassword){
                    return res.status(400).send({
                        success: false,
                        msg: "Old Password wrong"
                    });
                }else{
                    const hash = CryptoJS.SHA256(new_password).toString(CryptoJS.enc.Hex);
                    delete req.body.confirm_password;
                    let updated = await db.query(authQueries.updatePassowrd, [hash, user_id]);
                    if (updated){
                        try {

                            //  Activity Log
                            db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                                if(settingsData[0].activities_log == 1){
                                    var activity = {
                                        "user_id"   : user_id,
                                        "activity"  : 'Password Change',
                                    }
                                    await db.query(authQueries.insertActivityData, activity);
                                }
                            })

                            return res.status(200).send({
                                success: true,
                                msg: "Password updated successfully."
                            });

                        } catch (e) {
                            return res.status(500).send({
                                success: false,
                                msg: e
                            });
                        }
                    } else {
                        console.log('asd');
                        return res.status(400).send({
                            success: false,
                            msg: "password not update due to internal error"
                        });
                    }
                }
            }
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "password not update due to internal error"
        });
    }
}