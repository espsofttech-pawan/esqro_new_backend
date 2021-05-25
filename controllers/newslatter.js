const utils = require('../utils/randomTokenUtility');
const authQueries = require('../services/authQueries');

exports.newslatter = async (
    db, req, res) => {
    var email      = req.body.email;
    
    try {
        
        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "Email Required"
            });
        }

        var requestMsg = {
            "email"     : email
        }

        db.query(authQueries.getnewslatter, email , async function (error, offers) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (offers.length == 0) {
                let inserted = await db.query(authQueries.insertNewslatter, requestMsg);
                if (inserted) {
                    try {
                        return res.status(200).send({
                            success: true,
                            msg: "Newsletter subscribe successfully."
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
                        msg: "Request not send due to internal error"
                    });
                }
            } else {
                return res.status(400).send({
                    success: false,
                    msg: "Newsletter already subscribed from this email.",
                    error
                });
            }
        })        

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Request not send due to internal error"
        });
    }
}


exports.getintouch = async (
    db, req, res) => {
    var name      = req.body.name;
    var email      = req.body.email;
    var mobile      = req.body.mobile;
    var comment      = req.body.comment;
    
    try {
        
        if (!name) {
            return res.status(400).send({
                success: false,
                msg: "Name Required"
            });
        }

        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "Email Required"
            });
        }

        if (!mobile) {
            return res.status(400).send({
                success: false,
                msg: "Mobile number Required"
            });
        }

        if (!comment) {
            return res.status(400).send({
                success: false,
                msg: "Comment Required"
            });
        }

        var requestMsg = {
            "name"    : name,
            "email"   : email,
            "mobile"  : mobile,
            "comment" : comment,
        }

        let inserted = await db.query(authQueries.insertGetInTouch, requestMsg);
        if (inserted) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Request send successfully."
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
                msg: "Request not send due to internal error"
            });
        }       

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Request not send due to internal error"
        });
    }
}

exports.getMyActivity = async (
    db, req, res) => {
    var user_id  = req.body.user_id;    
    try {
        db.query(authQueries.getMyActivity, user_id , async function (error, activity) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (activity.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : activity
                });
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

exports.Logout = async (
    db, req, res) => {
    var user_id  = req.body.user_id;    
    try {
        //  Activity Log
        db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
            if(settingsData[0].activities_log == 1){
                var activity = {
                    "user_id"   : user_id,
                    "activity"  : 'Log Out',
                }
                await db.query(authQueries.insertActivityData, activity);
            }
        })        
    } catch (err) {

    }
}