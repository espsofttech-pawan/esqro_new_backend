const CryptoJS = require("crypto-js");
const config = require('../config');
const authQueries = require('../services/authQueries');
var speakeasy = require("speakeasy");
var QRCode = require('qrcode');

exports.googleAuthCode = async (db,req,res)=>{
    var user_id = req.body.user_id;
    var qrCode = req.body.qrCode;
    var is_enable_google_auth_code = req.body.is_enable_google_auth_code;
    console.log(req.body);
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }
        if (!qrCode) {
            return res.status(400).send({
                success: false,
                msg: "Google auth code required."
            });
        }
            
        await db.query(authQueries.getUserSettings,[user_id],function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        var tokenValidates = speakeasy.totp.verify({
        secret: data[0].google_auth_code,
        encoding: 'base32',
        token: qrCode,
        window: 0
        });
        
        if(tokenValidates){
            var arr = {
                'is_enable_google_auth_code' : is_enable_google_auth_code
            }   

            let updated =  db.query(authQueries.updateProfile, [arr, user_id] );
            if (updated){
                try {    

                    if(is_enable_google_auth_code == 1){
                        message = "Google auth code enabled successfully"
                    }else{
                        message = "Google auth code disabled successfully"
                    }

                    return res.status(200).send({
                        success: true,
                        msg: message
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
        }else{
            return res.status(400).send({
                success: false,
                msg: "Google auth code not valid Please try again.",
                error
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

exports.verifyAuthCode = async (db,req,res)=>{
    var user_id = req.body.user_id;
    var qrCode = req.body.googleAuthCode;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }
        if (!qrCode) {
            return res.status(400).send({
                success: false,
                msg: "Google auth code required."
            });
        }
            
        await db.query(authQueries.getUserSettings,[user_id],function(error,user){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        var tokenValidates = speakeasy.totp.verify({
        secret: user[0].google_auth_code,
        encoding: 'base32',
        token: qrCode,
        window: 0
        });
        
        if(tokenValidates){
            return res.status(200).send({
                success: true,
                data : {
                    id    : user[0].id,
                    email : user[0].email,
                    username : user[0].username,
                    is_enable_google_auth_code : user[0].is_enable_google_auth_code,
                    account_status : user[0].account_status
                }                
            });                               
        }else{
            return res.status(400).send({
                success: false,
                msg: "Google auth code not valid Please try again.",
                error
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


exports.twoAuthentication = async (db,req,res)=>{

    var secret = speakeasy.generateSecret({ length : 20 });
     
    var user_id = req.body.user_id;
     var key =    secret.base32
    console.log(user_id);
    await db.query(authQueries.updateUsersAuth,[key,user_id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured",
            error
        });
    }
    console.log(secret);
    QRCode.toDataURL(secret.otpauth_url, function(error, data_url) {
        if(error){
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        res.status(200).send({
            success:true,
            msg : "QR Code",
            response : data_url
        });
  });
  });
}
            

            
 exports.twoAuthenticationVerify = async (db,req,res)=>{

                var user_id = req.body.user_id;
                var token = req.body.token;             
             
                await db.query(authQueries.getUserSettings,[user_id],function(error,data){
                    if(error){
                    return res.status(400).send({
                        success: false,
                        msg: "error occured",
                        error
                    });
                }

             var tokenValidates = speakeasy.totp.verify({
                secret: data[0].google_auth_code,
                encoding: 'base32',
                token: token,
                window: 0
              });
              
                res.status(200).send({
                    success:true,
                    msg : "Result",
                    response : tokenValidates
                });
              
                });
    }
                        
            