const quries = require('../services/authQueries');
exports.sellList = async (db, req, res) => {
    try {

        var user_id = req.body.user_id;
        if(!user_id){
            user_id = 0;
        }        

        db.query(quries.getsellOffersList, user_id , async function (error, offers) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (offers.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : offers
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