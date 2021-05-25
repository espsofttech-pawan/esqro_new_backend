const CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
const config = require('../config');
const emailUtility = require('../utils/emailUtility');
const utils = require('../utils/randomTokenUtility');
const authQueries = require('../services/authQueries');

exports.create_offer = async (
    db, req, res) => {
    var user_id                 = req.body.user_id;
    var trade_type              = req.body.trade_type;
    var coin_quantity           = req.body.coin_quantity;
    var purchase_price          = req.body.purchase_price;
    var offer_expiration        = req.body.offer_expiration;
    var min_transaction_limit   = req.body.min_transaction_limit;
    var max_transaction_limit   = req.body.max_transaction_limit;
    var terms_of_trade          = req.body.terms_of_trade;

    try {
        
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "Username not found"
            });
        }

        if (!trade_type) {
            return res.status(400).send({
                success: false,
                msg: "Trade type required"
            });
        }

        if (!coin_quantity) {
            return res.status(400).send({
                success: false,
                msg: "Coin quantity required"
            });
        }

        if (!purchase_price) {
            return res.status(400).send({
                success: false,
                msg: "Purchase price required"
            });
        }

        if (!offer_expiration) {
            return res.status(400).send({
                success: false,
                msg: "Offer expiration required"
            });
        }

        if (!min_transaction_limit) {
            return res.status(400).send({
                success: false,
                msg: "Min transaction required"
            });
        }

        if (!max_transaction_limit) {
            return res.status(400).send({
                success: false,
                msg: "Max transaction required"
            });
        }

        var offer = {
            "user_id"       : user_id,
            "trade_type"    : trade_type,
            "coin_quantity" : coin_quantity,
            "purchase_price": purchase_price,
            "offer_expiration": offer_expiration,
            "min_transaction_limit" : min_transaction_limit,
            "max_transaction_limit" : max_transaction_limit,
            "terms_of_trade" : terms_of_trade,
            "coin_available" : coin_quantity
        }

        let inserted = await db.query(authQueries.createOfferData, offer);
        if (inserted) {
            try {

                //  Activity Log
                db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                    if(settingsData[0].activities_log == 1){
                        var activity = {
                            "user_id"   : user_id,
                            "activity"  : 'Create Offer',
                        }
                        await db.query(authQueries.insertActivityData, activity);
                    }
                })

                return res.status(200).send({
                    success: true,
                    msg: "Offer created successfully."
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
                msg: "offer not create due to internal error"
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "offer not create due to internal error"
        });
    }
}


exports.updateOffer = async (
    db, req, res) => {
    var id                      = req.body.id;
    var trade_type              = req.body.trade_type;
    var coin_quantity           = req.body.coin_quantity;
    var purchase_price          = req.body.purchase_price;
    var offer_expiration        = req.body.offer_expiration;
    var min_transaction_limit   = req.body.min_transaction_limit;
    var max_transaction_limit   = req.body.max_transaction_limit;
    var terms_of_trade          = req.body.terms_of_trade;

    try {
        
        if (!trade_type) {
            return res.status(400).send({
                success: false,
                msg: "Trade type required"
            });
        }

        if (!coin_quantity) {
            return res.status(400).send({
                success: false,
                msg: "Coin quantity required"
            });
        }

        if (!purchase_price) {
            return res.status(400).send({
                success: false,
                msg: "Purchase price required"
            });
        }

        if (!offer_expiration) {
            return res.status(400).send({
                success: false,
                msg: "Offer expiration required"
            });
        }

        if (!min_transaction_limit) {
            return res.status(400).send({
                success: false,
                msg: "Min transaction required"
            });
        }

        if (!max_transaction_limit) {
            return res.status(400).send({
                success: false,
                msg: "Max transaction required"
            });
        }

        if (!terms_of_trade) {
            return res.status(400).send({
                success: false,
                msg: "Terms of trade required"
            });
        }

        var offer = {
            "trade_type"    : trade_type,
            "coin_quantity" : coin_quantity,
            "purchase_price": purchase_price,
            "offer_expiration": offer_expiration,
            "min_transaction_limit" : min_transaction_limit,
            "max_transaction_limit" : max_transaction_limit,
            "terms_of_trade" : terms_of_trade
        }

        let updated = await db.query(authQueries.updateOfferData, [offer, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Offer updated successfully."
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
                msg: "offer not updated due to internal error"
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "offer not updated due to internal error"
        });
    }
}


exports.getOfferDetails = async (
    db, req, res) => {
    var id = req.body.id;
    try {
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "Offer not found"
            });
        }
        db.query(authQueries.getOfferData, id , async function (error, offerRes) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (offerRes.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Offer data get successfully",
                    response: offerRes[0]
                });                
            }
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "offer not get due to internal error"
        });
    }
}