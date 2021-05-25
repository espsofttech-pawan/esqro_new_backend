const authQueries = require('../services/authQueries');

exports.saveAccountDetails = async (
    db, req, res) => {
    var user_id     = req.body.user_id;
    var account_holder_name  = req.body.card_holder_name;
    var account_number   = req.body.account_number;
    var ifsc         = req.body.ifsc;
    var branch_name = req.body.branch_name; 
    console.log(req.body);
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }

        if (!account_holder_name) {
            return res.status(400).send({
                success: false,
                msg: "Account holder name required!"
            });
        }
        
        if (!account_number) {
            return res.status(400).send({
                success: false,
                msg: "Account number required!"
            });
        }
        
        if (!ifsc) {
            return res.status(400).send({
                success: false,
                msg: "IFSC required!"
            });
        }
        
        if (!branch_name) {
            return res.status(400).send({
                success: false,
                msg: "Branch name required!"
            });
        }        

        var bankDetailsPostData = {
            'user_id' : user_id,
            'card_holder_name' : account_holder_name,
            'account_number' : account_number,
            'ifsc' : ifsc,
            'branch_name' :branch_name 
        }

        await db.query(authQueries.getBankDetailsByid, user_id, async function (error, result) {
            if(result.length > 0){
                var id = result[0].id;
              db.query(authQueries.updateBankDetails, [bankDetailsPostData, id], async function (error, result) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "unexpected error occured",
                            error
                        });
                    }else{

                        //  Activity Log
                        db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                            if(settingsData[0].activities_log == 1){
                                var activity = {
                                    "user_id"   : user_id,
                                    "activity"  : 'Update Bank Details',
                                }
                                await db.query(authQueries.insertActivityData, activity);
                            }
                        })                          

                        return res.status(200).send({
                            success: true,
                            msg: "Bank details updated successfully",
                            response : bankDetailsPostData
                        });                        
                    }
                });
            }else{
               await db.query(authQueries.insertBankDetails, bankDetailsPostData , async function (error, result) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "unexpected error occured",
                            error
                        });
                    }else{

                        //  Activity Log
                        db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                            if(settingsData[0].activities_log == 1){
                                var activity = {
                                    "user_id"   : user_id,
                                    "activity"  : 'Add Bank Details',
                                }
                                await db.query(authQueries.insertActivityData, activity);
                            }
                        })                        

                        return res.status(200).send({
                            success: true,
                            msg: "Bank details added successfully",
                            response : bankDetailsPostData
                        });                        
                    }
                });
            }
        }); 
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Bank details not update due to internal error"
        });
    }
}

exports.getAccoutDetails = async (
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
        await db.query(authQueries.getBankDetailsByid, user_id, async function (error, results) {
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
                return res.status(200).send({
                    success: true,
                    msg : 'Bank details get successfully!',
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