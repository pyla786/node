const postsdao = require('../orm/daos/postsdao');
const functions = require('../lib/functions');
var moment = require('moment');
const commonemitter = require('../lib/custom-events').commonEmitter;

exports.addPostWithVideo = async function(req, res) {
    try {
        let require = ['description','user_id','video_url'];
        let integer = [];
        let report = functions.validation(req.body,require, integer);
        if(!report.status)
            res.json(report);
        postsdao.addPostWithVideo(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at addPostWithVideo : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.addPostWithImage = async function(req, res) {
    try {
        postsdao.addPostWithImage(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at addPostWithImage : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.addPostWithText = async function(req, res) {
    try {
        let require = ['description','user_id'];
        let integer = [];
        let report = functions.validation(req.body,require, integer);
        if(!report.status)
            res.json(report);
        postsdao.addPostWithText(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at addPostWithText : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.getAllPosts = async function(req, res) {
    try {
        postsdao.getAllPosts(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at getAllPosts : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

exports.updatePost = async function(req, res) {
    try {
        postsdao.updatePost(req).then(data => {
            res.json(data);
        }).catch(error => {
            commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": 'Error at updatePost : '+error.message});
            console.log(error);
            res.json(error);
        });
    } catch(error) {
        commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg": error.stack});
        console.log(error);
        res.status(500).send({"message":"Failed to process request"});
    }
}

