const CryptoJS = require("crypto-js");
const config = require('../config');
const authQueries = require('../services/authQueries');

exports.update_profile = async (
    db, req, res) => {
    var user_id     = req.body.user_id;
    var first_name  = req.body.first_name;
    var last_name   = req.body.last_name;
    var dob         = req.body.dob;
    var mobile_number = req.body.mobile; 
    var country     = req.body.country; 
    var profile_pic =  (!req.files['profile_pic'])?null:req.files['profile_pic'][0].filename;  

    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
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
                console.log(profile_pic);
                if(!profile_pic){
                    profile_pic_data = results[0].profile_pic;
                }else{
                    profile_pic_data = 'public/images/'+profile_pic;
                }

                var userDetails = {
                    'first_name': first_name,
                    'last_name' : last_name,
                    'mobile'    : mobile_number,
                    'dob'       : dob,
                    'country_id': country,
                    'profile_pic' : profile_pic_data
                }
                console.log(userDetails);
                let updated = await db.query(authQueries.updateProfile, [userDetails, user_id] );
                if (updated){
                    try {

                        //  Activity Log
                        db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                            if(settingsData[0].activities_log == 1){
                                var activity = {
                                    "user_id"   : user_id,
                                    "activity"  : 'Profile Update',
                                }
                                await db.query(authQueries.insertActivityData, activity);
                            }
                        })                        

                        return res.status(200).send({
                            success: true,
                            msg: "Profile updated successfully."
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
                        msg: "Profile not update due to internal error"
                    });
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

exports.getProfile = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    console.log(req.body);
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }
        await db.query(authQueries.getProfileDetails, user_id, async function (error, results) {
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

                // var userdData = {
                //     'id'         : results[0].id,
                //     'first_name' : results[0].first_name,
                //     'last_name'  : results[0].last_name,
                //     'username'   : results[0].username,
                //     'email'      : results[0].email,
                //     'mobile'     : results[0].mobile,
                //     'country_id' : results[0].country_id,
                //     'state'      : results[0].state,
                //     'postcode'   : results[0].postcode,
                //     'city'       : results[0].city,
                //     'password'   : results[0].password,
                //     'profile_pic': results[0].profile_pic,
                //     'telegram_username' : results[0].telegram_username,
                //     'address1'   : results[0].address1,
                //     'address2'   : results[0].address2,
                //     'create_date': results[0].create_date,
                //     'dob'        :  results[0].dob1,
                //     // 'dob'        :  '1997-02-02',
                //     'passport_file': results[0].passport_file,
                //     'national_card_front' : results[0].national_card_front,
                //     'national_card_back' : results[0].national_card_back,
                //     'driving_licence' : results[0].driving_licence,
                //     'wallet_address' : results[0].public_address,
                //     'wallet_address_concatinate' : results[0].wallet_address_concatinate,
                // }

                return res.status(200).send({
                    success: true,
                    msg : 'User details get successfully!',
                    response :  results[0]
                });
            }
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
}

exports.updateSettings = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }
        var userDetails = {
            'activities_log'    : req.body.activities_log,
            'password_change_email_status' : req.body.password_change_email_status,
            'latest_news'       : req.body.latest_news,
            'unusual_activity'  : req.body.unusual_activity
        }
        console.log(userDetails);
        let updated = await db.query(authQueries.updateProfile, [userDetails, user_id] );
        if (updated){
            try {

                //  Activity Log
                db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                    if(settingsData[0].activities_log == 1){
                        var activity = {
                            "user_id"   : user_id,
                            "activity"  : 'Settings Update',
                        }
                        await db.query(authQueries.insertActivityData, activity);
                    }
                })                    

                return res.status(200).send({
                    success: true,
                    msg: "Settings updated successfully."
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
                msg: "Setting not update due to internal error"
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Setting not update due to internal error"
        });
    }
}