const config = require('../config');
const authQueries = require('../services/authQueries');

exports.getSupportRequestList = async (
    db, req, res) => {
    var user_id = req.body.user_id;
    try {
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            });
        }
        await db.query(authQueries.getSupportRequest, user_id, async function (error, results) {
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
                    msg : 'Support Request get successfully!',
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