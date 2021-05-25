const quries = require('../services/authQueries');
exports.getHomeData = async (db, req, res) => {
    try {
        db.query(quries.getHomeData, async function (error, homeData) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (homeData.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : homeData[0]
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

exports.getHowItWorks = async (db, req, res) => {
    try {
        db.query(quries.getHowItWorks, async function (error, howitWorks) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (howitWorks.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : howitWorks[0]
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

exports.getBlog = async (db, req, res) => {
    try {
        db.query(quries.getBlog, async function (error, homeData) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (homeData.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : homeData
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

exports.getAskQuestion = async (db, req, res) => {
    try {
        db.query(quries.getAskQuestion, async function (error, homeData) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (homeData.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : homeData
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

exports.getFeatures = async (db, req, res) => {
    try {
        db.query(quries.getFeatures, async function (error, features) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (features.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : features[0]
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