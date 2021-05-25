const config = require('../config');
const authQueries = require('../services/authQueries');
const utils = require('../utils/randomTokenUtility');
const emailUtility = require('../utils/emailUtility');

exports.getOfferDetailsForTrade = async (
    db, req, res) => {
    var offer_id = req.body.offer_id;
    console.log(offer_id);
    try {
        if (!offer_id) {
            return res.status(400).send({
                success: false,
                msg: "Offer not found"
            });
        }
        await db.query(authQueries.getOffersDetails, offer_id, async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Offers get successfully!',
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

exports.tradeRequest = async (
    db, req, res) => {
    var offer_id = req.body.offer_id;
    var token_amount = req.body.token_amount;
    var user_id = req.body.user_id;
    var aud_amount = req.body.aud_amount;
    var min_transaction_limit = req.body.getOfferDetails.min_transaction_limit;
    var max_transaction_limit = req.body.getOfferDetails.max_transaction_limit;
    var trade_type = req.body.getOfferDetails.trade_type;
    var trader_id = req.body.getOfferDetails.user_id;
    var coin_available = req.body.getOfferDetails.coin_available;

    try {
        if (!offer_id) {
            return res.status(400).send({
                success: false,
                msg: "Offer not found."
            });
        }

        if (!token_amount) {
            return res.status(400).send({
                success: false,
                msg: "Qoin value required."
            });
        }

        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Please login first."
            });
        }

        if(min_transaction_limit > token_amount){
            return res.status(400).send({
                success: false,
                msg: "Please enter amount above minimum transaction limit."
            });
        }

        if(max_transaction_limit < token_amount){
            return res.status(400).send({
                success: false,
                msg: "Please enter amount below maximum transaction limit."
            });            
        }

        if(coin_available < token_amount){
            return res.status(400).send({
                success: false,
                msg: "Insufficient coins please enter less than available coins."
            });            
        }        
        
        if(trade_type == 1){
            seller_id = user_id
            buyer_id  = trader_id
            buyerConfirmation = 0
            sellerConfirmation = 1
            tradeType = 'Sell'
        }else{
            buyer_id = user_id
            seller_id = trader_id
            buyerConfirmation = 1
            sellerConfirmation = 0
            tradeType = 'Buy'
        }
        
        var tradeRequestData = {
            "seller_id" : seller_id,
            "buyer_id" : buyer_id,
            'offer_id' : offer_id,
            'token_amount' : token_amount,            
            'currency_amount' : aud_amount,
            'buyer_confirm' : buyerConfirmation,
            'seller_confirm' : sellerConfirmation 
        }

        let inserted = await db.query(authQueries.tradeRequest, tradeRequestData);
        if (inserted) {
            try {
                var available_coin = coin_available - token_amount;
                arr = { 'coin_available' : available_coin }
                await db.query(authQueries.updateCoinAfterTrade, [arr, offer_id] , async function (error, results) {
                    
                });                
                // await db.query(authQueries.getLastRequestId,async function (error, results) {
                //     if(results){
                //         trade_id = results[0].id;
                //     }else{
                //         trade_id = '';
                //     }
                // });

                //  Activity Log
                db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                    if(settingsData[0].activities_log == 1){
                        var activity = {
                            "user_id"   : user_id,
                            "activity"  : 'Send trade request',
                        }
                        await db.query(authQueries.insertActivityData, activity);
                    }
                }) 

                db.query(authQueries.getUserSettings, trader_id, async function (error, usersData) {
                        var notification = {
                            "user_id"   : user_id,
                            "message"  : 'You have sent '+tradeType+' trade request to '+ usersData[0].username
                        }
                        await db.query(authQueries.insertNotification, notification);
                })

                db.query(authQueries.getUserSettings, user_id, async function (error, usersData) {
                    var notification = {
                        "user_id"   : trader_id,
                        "message"  : usersData[0].username+' has sent '+tradeType+' trade request to you'
                    }
                    await db.query(authQueries.insertNotification, notification);
                })

                return res.status(200).send({
                    success: true,
                    // id : trade_id,
                    msg: "Trade request send successfully."
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
                msg: "Internal server error."
            });
        }

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Internal server error."
        });
    }
}


exports.getTradeRequestList = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Please login first"
            });
        }
        console.log(user_id);
        await db.query(authQueries.getMytradeList, [user_id, user_id], async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Offers get successfully!',
                    response :  results
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

exports.getOngoingTradeRequestList = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Please login first"
            });
        }
        console.log(user_id);
        await db.query(authQueries.getOngoingTradeRequestList, [user_id, user_id], async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Offers get successfully!',
                    response :  results
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

exports.getCompletedTradeRequest = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Please login first"
            });
        }
        console.log(user_id);
        await db.query(authQueries.getCompletedTradeRequest, [user_id, user_id], async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Offers get successfully!',
                    response :  results
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

exports.getCancelledTradeRequestList = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Please login first"
            });
        }
        console.log(user_id);
        await db.query(authQueries.getCancelledTradeRequestList, [user_id, user_id], async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Offers get successfully!',
                    response :  results
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

exports.getTradeRequestDetails = async (
    db, req, res) => {
    var id = req.body.id;
    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Trade request not valid"
            });
        }
        await db.query(authQueries.getTradeRequestDetailsData, id , async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Offers get successfully!',
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

exports.acceptOrRejectTrade = async (
    db, req, res) => {
    var id = req.body.id;
    var status = req.body.status;
    var trade_type = req.body.trade_type;
    var user_id = req.body.user_id;

    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Trade request not valid"
            });
        }

        if(trade_type == 1){
            buyerConfirmation = 1
        }else{
            sellerConfirmation = 1
        }

        let orderNumber = utils.random();
        var arr = { 'status' : status, 'order_number' : orderNumber }
        await db.query(authQueries.acceptOrRejectTrade, [arr, id] , async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }else {

                if(status == 1){

                    await db.query(authQueries.gettradeData, id, async function (error, uresults) {
                        if(uresults){
                            if(uresults.length > 0){
                                buyer_email = uresults[0].buyeremail;
                                seller_email = uresults[0].selleremail;
                                qoinAmount = uresults[0].token_amount;
                                console.log(buyer_email);
                                emailUtility.transporter.sendMail(emailUtility.mailOptions(buyer_email, config.otp.trade_accept, config.otp.template.emailTradeAcceptHtml(qoinAmount)), async (error, info) => {
                                    
                                });

                                // var buyerid = uresults[0].buyer_id;
                                // var sellerid = uresults[0].seller_id;

                                // if(user_id == buyerid){
                                    
                                // }

                                // db.query(authQueries.getUserSettings, user_id, async function (error, usersData) {
                                //     var notification = {
                                //         "user_id"   : user_id,
                                //         "message"  : 'You have accepted the trade of '+usersData[0].username
                                //     }
                                //     await db.query(authQueries.insertNotification, notification);
                                // })
            
                                // db.query(authQueries.getUserSettings, user_id, async function (error, usersData) {
                                //     var notification = {
                                //         "user_id"   : trader_id,
                                //         "message"  : usersData[0].username+' has sent '+tradeType+' trade request to you'
                                //     }
                                //     await db.query(authQueries.insertNotification, notification);
                                // })

                                emailUtility.transporter.sendMail(emailUtility.mailOptions(seller_email, config.otp.trade_accept, config.otp.template.emailTradeAcceptHtml(qoinAmount)), async (error, info) => {
                                    
                                });                                
                            }
                        }
                    });                    

                    var msg = "Trade accepted successfully.";
                }else{

                    await db.query(authQueries.gettradeData, id, async function (error, uresults) {
                        if(uresults){
                            if(uresults.length > 0){
                                buyer_email = uresults[0].buyeremail;
                                seller_email = uresults[0].selleremail;
                                qoinAmount = uresults[0].token_amount;
                                console.log(buyer_email);
                                emailUtility.transporter.sendMail(emailUtility.mailOptions(buyer_email, config.otp.trade_reject, config.otp.template.emailTradeRejectHtml(qoinAmount)), async (error, info) => {
                                    
                                });

                                emailUtility.transporter.sendMail(emailUtility.mailOptions(seller_email, config.otp.trade_reject, config.otp.template.emailTradeRejectHtml(qoinAmount)), async (error, info) => {
                                    
                                });                     
                                coin_available = uresults[0].coin_available;
                                offer_id = uresults[0].offer_id;
                                var available_coin = coin_available + qoinAmount;
                                arr = { 'coin_available' : available_coin }
                                await db.query(authQueries.updateCoinAfterTrade, [arr, offer_id] , async function (error, results) {
                                    
                                });  

                            }
                        }
                    });                     

                    var msg = "Trade rejected successfully.";
                }

                return res.status(200).send({
                    success: true,
                    msg : msg,
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

exports.buyerWalletSubmit = async (
    db, req, res) => {
    var id = req.body.id;
    var wallet_address = req.body.wallet_address;
    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Trade request not valid"
            });
        }

        if (!wallet_address) {
            return res.status(400).send({
                success: false,
                msg: "Wallet address required!"
            });
        }

        var arr = { 'buyer_wallet' : wallet_address }
        await db.query(authQueries.buyerWalletSubmit, [arr, id] , async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }else {
                return res.status(200).send({
                    success : true,
                    msg     : "wallet added successfully.",
                    response:  results[0]
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

exports.buyerTransaction = async (
    db, req, res) => {
    var id = req.body.id;
    var buyer_transaction_id = req.body.buyer_transaction_id;
    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Trade request not valid"
            });
        }

        if (!buyer_transaction_id) {
            return res.status(400).send({
                success: false,
                msg: "Transaction Id required!"
            });
        }

        var arr = { 'buyer_transaction_id' : buyer_transaction_id }
        await db.query(authQueries.buyerWalletSubmit, [arr, id] , async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }else {
                return res.status(200).send({
                    success : true,
                    msg     : "Transaction id save successfully.",
                    response:  results[0]
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

exports.sellerBankDetails = async (
    db, req, res) => {
    var id = req.body.id;
    var account_holder_name = req.body.account_holder_name;
    var account_number = req.body.account_number;
    var bsc = req.body.bsc;
    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Trade request not valid"
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
        
        if (!bsc) {
            return res.status(400).send({
                success: false,
                msg: "BSC required!"
            });
        }        

        await db.query(authQueries.getSellerBankDetails, id , async function (error, results) {
            if (results.length < 1) {
                var arr = { 'trade_id': id ,'account_holder_name' : account_holder_name, 'account_number' : account_number, 'bsc': bsc }
                await db.query(authQueries.insertSellerBankDetails, arr , async function (error, results) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured",
                            error
                        });
                    }else {
                        return res.status(200).send({
                            success : true,
                            msg     : "Bank Details added successfully.",
                            response:  results[0]
                        });
                    }
                });
            } else {
                var arr = {'account_holder_name' : account_holder_name, 'account_number' : account_number, 'bsc': bsc }
                await db.query(authQueries.updateSellerBankDetails, [arr, id] , async function (error, results) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured",
                            error
                        });
                    }else {
                        return res.status(200).send({
                            success : true,
                            msg     : "Bank Details updated successfully.",
                            response:  results[0]
                        });
                    }
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

exports.sellerTransaction = async (
    db, req, res) => {
    var id = req.body.id;
    var seller_transaction_id = req.body.seller_transaction_id;
    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Trade request not valid"
            });
        }

        if (!seller_transaction_id) {
            return res.status(400).send({
                success: false,
                msg: "Transaction Id required!"
            });
        }

        var arr = { 'seller_transaction_id' : seller_transaction_id }
        await db.query(authQueries.sellerTransactionIdSubmit, [arr, id] , async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }else {
                return res.status(200).send({
                    success : true,
                    msg     : "Transaction id save successfully.",
                    response:  results[0]
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

exports.getSellerBankDetails = async (
    db, req, res) => {
    var id = req.body.id;
    try {
        await db.query(authQueries.getSellerBankDetails, id, async function (error, results) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length < 1) {
                return res.status(400).send({
                    success: false,
                    msg: "No data found!",
                    response: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    msg : 'Seller bank details get successfully!',
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