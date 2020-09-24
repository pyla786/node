const commonemitter = require('../../lib/custom-events').commonEmitter;
const ORM = require('../associations/table_associations');
//const bcrypt = require('bcrypt');
var crypto = require('crypto');
var config = require('../../config');
var param = process.argv[2];
var moment = require('moment');


class BreakSignal { };


exports.writeEventlog = function(data) {
    return new Promise((resolve, reject) => {
        const Events = ORM.model('tbl_event_log');
        Events.create(data).then(res => {
            return resolve({ "success":true });
        }).catch(err => {
            commonemitter.emit('dbErrorLogEvent', err);
            var e = new Error(err);
            return reject(e);
        });
    });
}


exports.writeErrorlog = function(data) {
    console.log(data);
    return new Promise((resolve, reject) => {
        const errorLog = ORM.model('tbl_error_log');
        errorLog.create(data).then(res => {
            return resolve({ "success":true });
        }).catch(err => {
            console.log(err);
            commonemitter.emit('dbErrorLogEvent', err);
            let e = new Error(err);
            return reject(e);
        });
    });
}