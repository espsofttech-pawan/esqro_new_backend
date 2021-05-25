const quries = require('../services/authQueries');
exports.getAdminBankDetails = async (db, req, res) => {
    try {
        db.query(quries.getAdminbankdetails, async function (error, bankDetails) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (bankDetails.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : bankDetails[0]
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
