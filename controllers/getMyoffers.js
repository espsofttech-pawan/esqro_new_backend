const config = require('../config');
const authQueries = require('../services/authQueries');

exports.getMyoffers = async (
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
        await db.query(authQueries.getMyOffers, user_id, async function (error, results) {
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