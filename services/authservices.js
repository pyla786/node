const authdao = require('../orm/daos/authdao');
const functions = require('../lib/functions');
var moment = require('moment');
const commonemitter = require('../lib/custom-events').commonEmitter;

exports.register = async function(req, res) {
    try {
        let require = ['user_name', 'email', 'password'];
        let report = functions.validation(req.body,require, []);
        if(!report.status)
            res.json(report);
        authdao.registerUser(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at registerUser : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.authenticate = async function(req, res) {
    try {
        authdao.authenticate(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at authenticate : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.checkSession = async function(req, res) {
    try {
        let bearerHeader = req.headers["authorization"];
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        if (req.session.token === bearerToken) {
            res.json({ "success": true });
        } else {
            res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
        }
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}   

exports.activateUser = function (req, res) {
    try {
        var require = ['userId', 'accessToken'];
        var integer = '';
        var report = functions.validation(req.body, require, integer);
        if (!report.status) {
            res.json(report);
        } else {
            authdao.activateUser(req).then(data => {
                res.json(data);

            }).catch(error => {
                commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at activateUser : '+error.message});
                console.log(error);
                res.json(error);
            });
        }
    } catch (e) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": e.stack});
        console.log(e);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

exports.forgotPassword = function (req, res) {
    try {
        var require = ['email'];
        var integer = '';
        var report = functions.emailvalidation(req.body, require, integer);
        if (!report.status) {
            res.json(report);
        } else {
            authdao.forgotPassword(req).then(data => {
                res.json(data);
            }).catch(error => {
                commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at forgotPassword : '+error.message});
                console.log(error);
                res.json(error);
            });
        }
    } catch (e) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": e.stack});
        console.log(e);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

exports.validateOTP = function (req, res) {
    try {
        if (req.body.otp) {
            authdao.validateOTP(req).then(data => {
                res.json(data);
            }).catch(error => {
                commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at validateOTP : '+error.message});
                console.log(error);
                res.json(error);
            });
        } else {
            res.json({ length: 0, message: 'Invalid OTP' });
        }
    } catch (e) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": e.stack});
        console.log(e);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

exports.resetPassword = function (req, res) {
    try {
        var require = ['userId', 'password'];
        var integer = '';
        var report = functions.validation(req.body, require, integer);
        if (!report.status) {
            res.json(report);
        } else {
            authdao.activateUser(req).then(data => {
                res.json(data);
            }).catch(error => {
                commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at resetPassword : '+error.message});
                console.log(error);
                res.json(error);
            });
        }
    } catch (e) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": e.stack});
        console.log(e);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

exports.changePassword = async function(req, res) {
    try {
        authdao.changePassword(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at changePassword : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

