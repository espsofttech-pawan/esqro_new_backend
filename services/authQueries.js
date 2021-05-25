var db = require('../utils/connection');

module.exports = {
    getUsers: "SELECT * FROM users WHERE email = ?",
    getUserSettings: "SELECT * FROM users WHERE id = ?",
    insertActivityData: "INSERT INTO activity SET ?",
    getToken: "SELECT * FROM users WHERE fcm_token = ?",    
    getUsersByid: "SELECT * FROM users WHERE id = ?",
    insertUserData: "INSERT INTO users SET ?",
    insertNotification: "INSERT INTO notification SET ?",
    updatePassowrd: "UPDATE users set password = ? where id = ?",
    updateProfile: "UPDATE users set ? where id = ?",
    createOfferData: "INSERT INTO offers SET ?",
    updateOfferData: "UPDATE offers SET ? WHERE id = ? ",
    getOfferData: "SELECT * FROM offers WHERE id = ? ",
    updatePassword: "UPDATE users SET password = ? WHERE email = ? ",
    acceptOrRejectTrade: "UPDATE trade_request set ? where id = ?",
    buyerWalletSubmit: "UPDATE trade_request set ? where id = ?",
    getAdminbankdetails: "SELECT * FROM settings",
    getSellerBankDetails : "SELECT * FROM seller_wallet WHERE trade_id = ?" ,
    insertSellerBankDetails : "INSERT INTO seller_wallet SET ?",
    updateSellerBankDetails : "UPDATE seller_wallet set ? where trade_id = ?" ,
    sellerTransactionIdSubmit : "UPDATE trade_request set ? where id = ?" ,
    getSellerBankDetails : "SELECT * FROM seller_wallet where trade_id = ? ",
    updateUnusualActivity : "UPDATE users set unusual_activity_count = ? where id = ?",
    gettradeData : "SELECT trade_request.id, trade_request.buyer_id, trade_request.seller_id ,trade_request.token_amount, buyer.email as buyeremail, seller.email as selleremail, offers.coin_available, offers.id as offer_id FROM trade_request LEFT JOIN users as buyer ON trade_request.buyer_id = buyer.id LEFT JOIN users as seller ON trade_request.seller_id = seller.id LEFT JOIN offers ON trade_request.offer_id = offers.id WHERE trade_request.id = ?" ,
    updateCoinAfterTrade : "UPDATE offers SET ? WHERE id = ? ",
    getChatList : " SELECT support_chat.*, DATE_FORMAT(support_chat.start_date, '%Y-%m-%d %H:%i:%s' ) as start_date, CASE WHEN support_chat.is_send_by_admin = 1 THEN admin.user_name else users.username END AS fromuser, CASE WHEN support_chat.is_send_by_admin = 0 THEN admin2.user_name else users2.username END AS touser FROM support_chat LEFT JOIN users ON users.id = support_chat.from_id LEFT JOIN admin ON admin.id = support_chat.from_id LEFT JOIN users as users2 ON users2.id = support_chat.to_id LEFT JOIN admin as admin2 ON admin2.id = support_chat.to_id WHERE support_chat.token = ? ORDER BY support_chat.id DESC ",
    getLastRequestId: "SELECT * FROM trade_request ORDER BY id DESC" ,
    getbuyOffersList: "SELECT offers.*, users.username, country.name as location FROM offers LEFT JOIN users ON offers.user_id = users.id LEFT JOIN country ON users.country_id = country.id WHERE offers.trade_type = 2 AND offers.user_id != ? AND offers.admin_approval = 1 ORDER BY id DESC ",

    getsellOffersList: "SELECT offers.*, users.username, country.name as location FROM offers LEFT JOIN users ON offers.user_id = users.id LEFT JOIN country ON users.country_id = country.id WHERE offers.trade_type = 1 AND offers.user_id != ? AND offers.admin_approval = 1 ORDER BY id DESC",

    getbuyOffersListByAmount: "SELECT offers.*, users.username, country.name as location FROM offers LEFT JOIN users ON offers.user_id = users.id LEFT JOIN country ON users.country_id = country.id WHERE offers.trade_type = ? AND offers.coin_quantity = ? AND user_id != ? ORDER BY id DESC ",

    getcountryList : "SELECT * FROM country",
    kycFormSubmit : "UPDATE users set ? where id = ?",
    getUserKycData : "SELECT * FROM userkyc WHERE user_id = ?",
    updateKycData : "UPDATE userkyc SET ? WHERE id = ? ",
    insertKycData : "INSERT into userkyc SET ? ",
    
    getProfileDetails: "SELECT users.*, DATE_FORMAT(users.dob, '%Y-%m-%d' ) as dob, userkyc.isapproved as kyc_status, userkyc.passport_file, userkyc.national_card_front, userkyc.national_card_back, userkyc.driving_licence, concat(left(coin_address_info.public_address,10),'.......',RIGHT(coin_address_info.public_address,10)) as wallet_address_concatinate, coin_address_info.public_address FROM users LEFT JOIN userkyc ON users.id = userkyc.user_id LEFT JOIN coin_address_info ON users.id = coin_address_info.user_id WHERE users.id = ? ",
    
    getWalletData: "SELECT * FROM coin_address_info WHERE user_id = ?",
    updateWalletData : "UPDATE coin_address_info SET ? WHERE id = ? ",
    insertWalletData : "INSERT into coin_address_info SET ? ",
    getBankDetailsByid: "SELECT * FROM bank_details WHERE user_id = ?",
    updateBankDetails : "UPDATE bank_details SET ? WHERE id = ? ",
    insertBankDetails : "INSERT into bank_details SET ? ",

    getMyOffers: "SELECT id, terms_of_trade, created_date, DATE_FORMAT(offer_expiration, '%d-%m-%Y') as offer_expiration ,DATE_FORMAT(created_date, '%d-%m-%Y') as created_date, CASE WHEN trade_type = 1 THEN 'Buy' WHEN trade_type = 2 THEN 'Sell' END AS tradeType, CASE WHEN admin_approval = 1 THEN 'Approved' WHEN admin_approval = 0 THEN 'Pending' END AS admin_approval, concat(coin_quantity, ' AUD' ) as coin_quantity, concat(purchase_price, ' AUD') as purchase_price, concat(min_transaction_limit,' AUD - ', max_transaction_limit, ' AUD' ) as tradeLimit FROM offers WHERE user_id = ? ORDER BY id DESC ",

    getCategory : "SELECT * FROM support_category",
    insertNewslatter : "INSERT into newslatter SET ? ",
    getnewslatter : "SELECT * FROM newslatter WHERE email = ?" ,
    insertGetInTouch : "INSERT into contact_us SET ? ",

    insertSupportRequest : "INSERT into support_token SET ? ",
    insertSupportRequestMsg : "INSERT into support_chat SET ? ",

    tradeRequest : "INSERT into trade_request SET ? ",

    getSupportRequest : "SELECT support_token.*, DATE_FORMAT(support_token.create_date,'%d-%m-%Y' ) as request_date, support_category.name as category_name FROM support_token LEFT JOIN support_category ON support_token.category_id = support_category.id WHERE user_id = ? ORDER BY id DESC " ,

    getOffersDetails: "SELECT offers.*, users.username, users.address1 FROM offers LEFT JOIN users ON offers.user_id = users.id WHERE offers.id = ?",

    getMytradeList : "SELECT trade_request.*, offers.trade_type, CASE WHEN offers.trade_type = 1 THEN 'Sell' WHEN offers.trade_type = 2 THEN 'Buy' END AS tradeType, CASE WHEN trade_request.status = 0 THEN 'Pending' WHEN trade_request.status = 1 THEN 'Ongoing' WHEN trade_request.status = 2 THEN 'Cancelled' WHEN trade_request.status = 3 THEN 'Cancelled'  WHEN trade_request.status = 4 THEN 'Completed' END AS tradeStatus, buyerUser.username as buyername, sellerUser.username as sellername FROM trade_request INNER JOIN offers ON trade_request.offer_id = offers.id LEFT JOIN users as buyerUser ON trade_request.buyer_id = buyerUser.id LEFT JOIN users as sellerUser ON trade_request.seller_id = sellerUser.id  WHERE trade_request.buyer_id = ? OR trade_request.seller_id = ? ORDER BY trade_request.id DESC",

    getOngoingTradeRequestList : "SELECT trade_request.*, offers.trade_type, CASE WHEN offers.trade_type = 1 THEN 'Sell' WHEN offers.trade_type = 2 THEN 'Buy' END AS tradeType, CASE WHEN trade_request.status = 0 THEN 'Pending' WHEN trade_request.status = 1 THEN 'Ongoing' WHEN trade_request.status = 2 THEN 'Cancelled' WHEN trade_request.status = 3 THEN 'Cancelled'  WHEN trade_request.status = 4 THEN 'Completed' END AS tradeStatus, buyerUser.username as buyername, sellerUser.username as sellername FROM trade_request INNER JOIN offers ON trade_request.offer_id = offers.id LEFT JOIN users as buyerUser ON trade_request.buyer_id = buyerUser.id LEFT JOIN users as sellerUser ON trade_request.seller_id = sellerUser.id  WHERE trade_request.status = 1 AND (trade_request.buyer_id = ? OR trade_request.seller_id = ? ) ORDER BY trade_request.id DESC",    

    getCompletedTradeRequest : "SELECT trade_request.*, offers.trade_type, CASE WHEN offers.trade_type = 1 THEN 'Sell' WHEN offers.trade_type = 2 THEN 'Buy' END AS tradeType, CASE WHEN trade_request.status = 0 THEN 'Pending' WHEN trade_request.status = 1 THEN 'Ongoing' WHEN trade_request.status = 2 THEN 'Cancelled' WHEN trade_request.status = 3 THEN 'Cancelled'  WHEN trade_request.status = 4 THEN 'Completed' END AS tradeStatus, buyerUser.username as buyername, sellerUser.username as sellername FROM trade_request INNER JOIN offers ON trade_request.offer_id = offers.id LEFT JOIN users as buyerUser ON trade_request.buyer_id = buyerUser.id LEFT JOIN users as sellerUser ON trade_request.seller_id = sellerUser.id  WHERE trade_request.status = 4 AND (trade_request.buyer_id = ? OR trade_request.seller_id = ? )  ORDER BY trade_request.id DESC",  

    getCancelledTradeRequestList : "SELECT trade_request.*, offers.trade_type, CASE WHEN offers.trade_type = 1 THEN 'Sell' WHEN offers.trade_type = 2 THEN 'Buy' END AS tradeType, CASE WHEN trade_request.status = 0 THEN 'Pending' WHEN trade_request.status = 1 THEN 'Ongoing' WHEN trade_request.status = 2 THEN 'Cancelled' WHEN trade_request.status = 3 THEN 'Cancelled'  WHEN trade_request.status = 4 THEN 'Completed' END AS tradeStatus, buyerUser.username as buyername, sellerUser.username as sellername FROM trade_request INNER JOIN offers ON trade_request.offer_id = offers.id LEFT JOIN users as buyerUser ON trade_request.buyer_id = buyerUser.id LEFT JOIN users as sellerUser ON trade_request.seller_id = sellerUser.id  WHERE trade_request.status = 2 AND (trade_request.buyer_id = ? OR trade_request.seller_id = ? ) ORDER BY trade_request.id DESC",  

    getTradeRequestDetailsData : "SELECT * FROM trade_request WHERE id = ?",

    getHomeData : "SELECT * FROM frontend_home",
    getHowItWorks : "SELECT * FROM frontend_how_it_works",
    getBlog : "SELECT title, description, image, DATE_FORMAT(created_date, '%d-%m-%Y') as created_date FROM frontend_blog",
    getAskQuestion : "SELECT * FROM frontend_frequently_asked_questions",
    getFeatures : "SELECT * FROM frontend_features",
    getMyActivity : "SELECT activity, DATE_FORMAT(created_date, '%d-%m-%Y %H:%i:%s') as created_date FROM activity WHERE user_id = ? ORDER BY id DESC",

    updateUsersAuth: "UPDATE users set google_auth_code = ?  where id = ?",
    updateUsersAuthQrCode: "UPDATE users set qrCodeImage = ? where id = ?",

    deleteUser(user) {
        db.query("DELETE FROM users WHERE email = ?", user, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('User deleted successfully');
            }
        });
    },
}