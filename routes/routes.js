var express = require('express');
var bodyParser = require("body-parser");

var router = express.Router();
var db = require('../utils/connection');
var login = require('../controllers/login');
var register = require('../controllers/register');
var change_password = require('../controllers/change_password');
var update_profile = require('../controllers/update_profile');
var create_offer = require('../controllers/create_offer');
var buyList = require('../controllers/buyList');
var sellList = require('../controllers/sellList');
var getcountryList = require('../controllers/getcountryList');
var kycFormUpdate = require('../controllers/kycFormUpdate');
var saveAccountDetails = require('../controllers/saveAccountDetails');
var getMyoffers = require('../controllers/getMyoffers');
var getOfferDetails = require('../controllers/create_offer');
var updateOffer = require('../controllers/create_offer');
var updateSettings = require('../controllers/update_profile');
var forgotPassword = require('../controllers/forgot_password');
var getSupportCategory = require('../controllers/getSupportCategory');
var supportRequest = require('../controllers/supportRequest');
var getSupportRequestList = require('../controllers/getSupportRequestList');
var getOfferDetailsForTrade = require('../controllers/trade');
var tradeRequest = require('../controllers/trade');
var getTradeRequestList = require('../controllers/trade');
var getOngoingTradeRequestList = require('../controllers/trade');
var getCompletedTradeRequest = require('../controllers/trade');
var getCancelledTradeRequestList = require('../controllers/trade');
var searchAmountOfferList = require('../controllers/buyList');
var getTradeRequestDetails = require('../controllers/trade');
var acceptOrRejectTrade = require('../controllers/trade');
var buyerWalletSubmit = require('../controllers/trade');
var getAdminBankDetails = require('../controllers/bankDetails');
var buyerTransaction = require('../controllers/trade');
var sellerBankDetails = require('../controllers/trade');
var sellerTransaction = require('../controllers/trade');
var getSellerBankDetails = require('../controllers/trade');
var getChatList = require('../controllers/supportRequest');
var supportChatMsg = require('../controllers/supportRequest');
var getHomeData = require('../controllers/frontendData');
var getHowItWorks = require('../controllers/frontendData');
var getBlog = require('../controllers/frontendData');
var getAskQuestion = require('../controllers/frontendData');
var getFeatures = require('../controllers/frontendData');
var newslatter = require('../controllers/newslatter');
var getintouch = require('../controllers/newslatter');
var getMyActivity = require('../controllers/newslatter');
var twoAuthentication = require('../controllers/google_auth');
var twoAuthenticationVerify = require('../controllers/google_auth');
var googleAuthCode = require('../controllers/google_auth');
var verifyAuthCode = require('../controllers/google_auth');

var Logout = require('../controllers/newslatter');

router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      var filetype = '';
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'video/mp4') {
        filetype = 'mp4';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});

var cpUpload = upload.fields([{ name: 'passport', maxCount: 1 }, { name: 'nationalfront', maxCount: 1 }, { name: 'nationalback', maxCount: 1 }, { name: 'driving_licence', maxCount: 1 }])
var profileUpload = upload.fields([{ name: 'profile_pic', maxCount: 1 }])
var supportAttachment = upload.fields([{ name: 'attachment', maxCount: 1 }])
var AccountDetails = upload.fields([{  }])

router.post('/login', login.login.bind(this, db));
router.post('/register', register.register.bind(this, db));
router.post('/change_password', change_password.change_password.bind(this, db));
router.post('/update_profile', profileUpload , update_profile.update_profile.bind(this, db));
router.post('/getProfile', update_profile.getProfile.bind(this, db));
router.post('/create_offer', create_offer.create_offer.bind(this, db));
router.post('/buyList', buyList.buyList.bind(this, db));
router.post('/sellList', sellList.sellList.bind(this, db));
router.get('/getcountryList', getcountryList.getcountryList.bind(this, db));
router.post('/kycFormUpdate', cpUpload, kycFormUpdate.kycFormUpdate.bind(this, db));
router.post('/saveAccountDetails',AccountDetails, saveAccountDetails.saveAccountDetails.bind(this, db));
router.post('/getAccoutDetails', saveAccountDetails.getAccoutDetails.bind(this, db));
router.post('/getMyoffers', getMyoffers.getMyoffers.bind(this, db));
router.post('/getOfferDetails', getOfferDetails.getOfferDetails.bind(this, db));
router.post('/updateOffer', updateOffer.updateOffer.bind(this, db));
router.post('/updateSettings', updateSettings.updateSettings.bind(this, db));
router.post('/forgotPassword', forgotPassword.forgotPassword.bind(this, db));
router.get('/verifyAccount/:token', register.verifyToken.bind(this, db));
router.get('/getSupportCategory' , getSupportCategory.getSupportCategory.bind(this, db));
router.post('/supportRequest', supportAttachment , supportRequest.supportRequest.bind(this, db));
router.post('/getSupportRequestList', getSupportRequestList.getSupportRequestList.bind(this, db));
router.post('/getOfferDetailsForTrade', getOfferDetailsForTrade.getOfferDetailsForTrade.bind(this, db));
router.post('/tradeRequest', tradeRequest.tradeRequest.bind(this, db));
router.post('/getTradeRequestList', getTradeRequestList.getTradeRequestList.bind(this, db));
router.post('/getOngoingTradeRequestList', getOngoingTradeRequestList.getOngoingTradeRequestList.bind(this, db));
router.post('/getCompletedTradeRequest', getCompletedTradeRequest.getCompletedTradeRequest.bind(this, db));
router.post('/getCancelledTradeRequestList', getCancelledTradeRequestList.getCancelledTradeRequestList.bind(this, db));
router.post('/searchAmountOfferList', searchAmountOfferList.searchAmountOfferList.bind(this, db));
router.post('/getTradeRequestDetails', getTradeRequestDetails.getTradeRequestDetails.bind(this, db));
router.post('/acceptOrRejectTrade', acceptOrRejectTrade.acceptOrRejectTrade.bind(this, db));
router.post('/buyerWalletSubmit', buyerWalletSubmit.buyerWalletSubmit.bind(this, db));
router.post('/getAdminBankDetails', getAdminBankDetails.getAdminBankDetails.bind(this, db));
router.post('/buyerTransaction', buyerTransaction.buyerTransaction.bind(this, db));
router.post('/sellerBankDetails', sellerBankDetails.sellerBankDetails.bind(this, db));
router.post('/sellerTransaction', sellerTransaction.sellerTransaction.bind(this, db));
router.post('/getSellerBankDetails', getSellerBankDetails.getSellerBankDetails.bind(this, db));
router.post('/getChatList', getChatList.getChatList.bind(this, db));
router.post('/supportChatMsg', supportChatMsg.supportChatMsg.bind(this, db));
router.get('/getHomeData', getHomeData.getHomeData.bind(this, db));
router.get('/getHowItWorks', getHowItWorks.getHowItWorks.bind(this, db));
router.get('/getBlog', getBlog.getBlog.bind(this, db));
router.get('/getAskQuestion', getAskQuestion.getAskQuestion.bind(this, db));
router.get('/getFeatures', getFeatures.getFeatures.bind(this, db));
router.post('/newslatter', newslatter.newslatter.bind(this, db));
router.post('/getintouch', getintouch.getintouch.bind(this, db));
router.post('/getMyActivity', getMyActivity.getMyActivity.bind(this, db));
router.post('/twoAuthentication', twoAuthentication.twoAuthentication.bind(this, db));
router.post('/twoAuthenticationVerify', twoAuthenticationVerify.twoAuthenticationVerify.bind(this, db));
router.post('/googleAuthCode', googleAuthCode.googleAuthCode.bind(this, db));
router.post('/verifyAuthCode', verifyAuthCode.verifyAuthCode.bind(this, db));

router.post('/Logout', Logout.Logout.bind(this, db));


module.exports = router;