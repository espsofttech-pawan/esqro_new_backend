const CryptoJS = require("crypto-js");
const config = require('../config');
const authQueries = require('../services/authQueries');

exports.kycFormUpdate = async (
    db, req, res) => {
    try {

        var user_id = req.body.user_id;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }
        var passport_file =  (!req.files['passport'])?null:req.files['passport'][0].filename;
        var nationalfront =  (!req.files['nationalfront'])?null:req.files['nationalfront'][0].filename;
        var nationalback =  (!req.files['nationalback'])?null:req.files['nationalback'][0].filename;
        var driving_licence =  (!req.files['driving_licence'])?null:req.files['driving_licence'][0].filename;
        console.log(nationalback);

        var kycData = {
            "first_name"  : req.body.first_name,
            "last_name"   : req.body.last_name,
            "mobile"      : req.body.mobile,
            "dob"         : req.body.dob,
            "address1"    : req.body.address1,
            "address2"    : req.body.address2,
            "state"       : req.body.state,
            "postcode"    : req.body.postcode,
            "country_id"  : req.body.country,
            "telegram_username"  : req.body.telegram_username,
            "city"        : req.body.city
        }

        db.query(authQueries.kycFormSubmit, [kycData, user_id] , async function (error, offers) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "unexpected error occured",
                    error
                });
            }else {

             // ID Proof uploads....
             await db.query(authQueries.getUserKycData, user_id, async function (error, result) {
                    if(result.length > 0){
                        var id = result[0].id;

                        if(!passport_file){
                            passport_file_data = result[0].passport_file;
                        }else{
                            passport_file_data = 'public/images/'+passport_file;
                        }

                        if(!nationalfront){
                            nationalfront_data = result[0].national_card_front;
                        }else{
                            nationalfront_data = 'public/images/'+nationalfront;
                        }

                        if(!nationalback){
                            nationalback_data = result[0].national_card_back;
                        }else{
                            nationalback_data = 'public/images/'+nationalback;
                        }

                        if(!driving_licence){
                            driving_licence_data = result[0].driving_licence;
                            
                        }else{
                            driving_licence_data = 'public/images/'+driving_licence;
                        }

                        if(passport_file || nationalfront || nationalback || driving_licence){
                            isapproved = 0;
                        }else{
                            isapproved = result[0].isapproved;
                        }

                        var kycImages = {
                            'user_id' : user_id,
                            'issuing_country' : req.body.country,
                            'passport_file' : passport_file_data,
                            'national_card_front' : nationalfront_data,
                            'national_card_back' : nationalback_data,
                            'driving_licence' : driving_licence_data,
                            'isapproved' : isapproved,
                        }                        
                        console.log(kycImages);
                      db.query(authQueries.updateKycData, [kycImages, id], async function (error, result) {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "unexpected error occured",
                                    error
                                });
                            }
                        });
                    }else{

                        var kycImages = {
                            'user_id' : user_id,
                            'issuing_country' : req.body.country,
                            'passport_file' : passport_file,
                            'national_card_front' : nationalfront,
                            'national_card_back' : nationalback,
                            'driving_licence' : driving_licence,
                        }        
                                         
                       await db.query(authQueries.insertKycData, kycImages , async function (error, result) {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "unexpected error occured",
                                    error
                                });
                            }
                        });
                    }
                });

             // Wallet Address upldate....
             if(req.body.wallet_address){

                var walletPostData = {
                    'user_id' : user_id,
                    'public_address' : req.body.wallet_address
                }

                 await db.query(authQueries.getWalletData, user_id, async function (error, result) {
                        if(result.length > 0){
                            var id = result[0].id;
                          db.query(authQueries.updateWalletData, [walletPostData, id], async function (error, result) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "unexpected error occured",
                                        error
                                    });
                                }
                            });
                        }else{
                           await db.query(authQueries.insertWalletData, walletPostData , async function (error, result) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "unexpected error occured",
                                        error
                                    });
                                }
                            });
                        }
                    }); 
             }

                //  Activity Log
                db.query(authQueries.getUserSettings, user_id, async function (error, settingsData) {
                    if(settingsData[0].activities_log == 1){
                        var activity = {
                            "user_id"   : user_id,
                            "activity"  : 'KYC Update',
                        }
                        await db.query(authQueries.insertActivityData, activity);
                    }
                })             

                return res.status(200).send({
                    success: true,
                    msg: "updated successfully",
                    response : kycData
                });
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            msg: "unexpected internal error",
            err
        });
    }
}