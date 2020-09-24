const profiledao = require('../orm/daos/profiledao');
const functions = require('../lib/functions');
var moment = require('moment');
const commonemitter = require('../lib/custom-events').commonEmitter;

exports.addProfile = async function(req, res) {
    try {
        let require = ['full_name', 'location','user_id'];
        let integer = ['gender'];
        let report = functions.validation(req.body,require, integer);
        if(!report.status)
            res.json(report);
            profiledao.addProfile(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at addProfile : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateSocialMediaLinks = async function(req, res) {
    try {
        profiledao.updateSocialMediaLinks(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at updateSocialMediaLinks : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getProfileData = async function(req, res) {
    try {
        profiledao.getProfileData(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at getProfileData : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getProfileInfo = async function(req, res) {
    try {
        profiledao.getProfileInfo(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at getProfileInfo : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateProfile = async function(req, res) {
    try {
        profiledao.updateProfile(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at updateProfile : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.addAccomplishments = async function(req, res) {
    try {
        let require = ['title','user_id'];
        let integer = [];
        let report = functions.validation(req.body,require, integer);
        if(!report.status)
            res.json(report);
            profiledao.addAccomplishments(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at addAccomplishments : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getAccomplishments = async function(req, res) {
    try {
        profiledao.getAccomplishments(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at getAccomplishments : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateAccomplishment = async function(req, res) {
    try {
        profiledao.updateAccomplishment(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at updateAccomplishments : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

