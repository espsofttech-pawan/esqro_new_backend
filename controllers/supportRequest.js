const utils = require('../utils/randomTokenUtility');
const authQueries = require('../services/authQueries');

exports.supportRequest = async (
    db, req, res) => {
    var user_id      = req.body.user_id;
    var category_id  = req.body.category_id;
    var subject      = req.body.subject;
    var message      = req.body.message;
    var attachment =  (!req.files['attachment'])?null:req.files['attachment'][0].filename;
    
    try {
        
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Username not found"
            });
        }

        if (!category_id) {
            return res.status(400).send({
                success: false,
                msg: "Category required"
            });
        }

        if (!subject) {
            return res.status(400).send({
                success: false,
                msg: "Subject required"
            });
        }

        if (!message) {
            return res.status(400).send({
                success: false,
                msg: "Message required"
            });
        }
        let token = utils.random();
        var request = {
            "user_id"     : user_id,
            "category_id" : category_id,
            "token"       : token,
            "subject"     : subject,
            "description" : message,
            'attachment'  : attachment
        }

        let inserted = await db.query(authQueries.insertSupportRequest, request);
        if (inserted) {
            try {
                var requestMsg = {
                    "from_id"     : user_id,
                    "to_id"       : 1,
                    "token"       : token,
                    "message"     : message
                }
                await db.query(authQueries.insertSupportRequestMsg, requestMsg);
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

exports.getChatList = async (
    db, req, res) => {
    var ticket  = req.body.ticket;    
    try {
        db.query(authQueries.getChatList, ticket , async function (error, chatlist) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (chatlist.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : chatlist
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

exports.supportChatMsg = async (
    db, req, res) => {
    var user_id      = req.body.from_id;
    var message      = req.body.message;
    var token        = req.body.token;
    
    try {
        
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Username not found"
            });
        }

        if (!message) {
            return res.status(400).send({
                success: false,
                msg: "Message required"
            });
        }

        var requestMsg = {
            "from_id"     : user_id,
            "to_id"       : 1,
            "token"       : token,
            "message"     : message
        }
        console.log(requestMsg);
        let inserted = await db.query(authQueries.insertSupportRequestMsg, requestMsg);
        if (inserted) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Message send successfully."
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