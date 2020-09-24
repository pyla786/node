const admindao = require('../orm/daos/admindao');
const functions = require('../lib/functions');
var moment = require('moment');
const commonemitter = require('../lib/custom-events').commonEmitter;

exports.getLookups = async function(req, res) {
    try {
        admindao.getLookups(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at getLookups : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.addLookups = async function(req, res) {
    try {
        admindao.addLookups(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at addLookups : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateLookup = async function(req, res) {
    try {
        admindao.updateLookup(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at updateLookup : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getLookupOptions = async function(req, res) {
    try {
        admindao.getLookupOptions(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at getLookupOptions : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getBadges = async function(req, res) {
    try {
        admindao.getBadges(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at getBadges : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateBadge = async function(req, res) {
    try {
        admindao.updateBadge(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at updateLookup : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getAllUsers = async function(req, res) {
    try {
        admindao.getAllUsers(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at getAllUsers : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateUserStatus = async function(req, res) {
    try {
        admindao.updateUserStatus(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at updateUserStatus : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updateUserProfile = async function(req, res) {
    try {
        admindao.updateUserProfile(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": 'Error at updateUserProfile : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by": functions.decrypt(req.session.userId), "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}


