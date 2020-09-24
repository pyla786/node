const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ORM = require('../associations/table_associations');
const functions = require('../../lib/functions');
var moment = require('moment');
const commonemitter = require('../../lib/custom-events').commonEmitter;
var Sequelize = require("sequelize");

exports.getLookups = function(req) {
    try {
        let data = req.body;
        let queryWhere = {"is_deleted":0, "is_active":1};
        if("code_master_id" in data)
            queryWhere['code_master_id'] = data['code_master_id'];
        else
            return reject({ success: false, message: 'Invalid params' });
        const Lookups = ORM.model('tbl_lookup_options');
        return Lookups.findAndCountAll({where:queryWhere}).then(lookups => {
            return { success: true, results:lookups.rows, count : lookups.count };
        }).catch(err => {
            console.log(err);
            return { success: false, message: 'Something went wrong' };
        });
    } catch(err) {
        console.log(err);
        return { success: false, message: 'Something went wrong' };
    }
}

exports.addLookups =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.code_master_id || !data.lookup_names.length)
            return reject({ success: false, message: 'Invalid params' });
        let userId = functions.decrypt(req.session.userId);
        const LookupOptions = ORM.model('tbl_lookup_options');
        let finalItems = [];
        for(let i=0; i< data.lookup_names.length; i++) {
            let item = {"code_master_id":data.code_master_id, "lookup_name":data.lookup_names[i], "created_by": userId, "modified_by": userId};
            finalItems.push(item);
        }
        LookupOptions.bulkCreate(finalItems,{"validate":true, "userId":req.session.userId}).then(lookup_res => {
            commonemitter.emit('eventLogEvent', data, 'Lookup', functions.decrypt(req.session.userId) );
            return resolve({"success":true});
        }).catch(err => {
            console.log(err);
            return reject({"success":false, "message": 'Something went wrong'});
        });
    });
}

exports.updateLookup =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.lookup_id)
            return reject({ success: false, message: 'Invalid params' });
        data.id = data.lookup_id;
        let queryWhere = {"lookup_id": { $in:[data.lookup_id]}};
        const LookupOptions = ORM.model('tbl_lookup_options');
        LookupOptions.findOne({attributes:["lookup_id","lookup_name","is_active","is_deleted"], where:queryWhere}).then(lookup => {
            if(lookup) {
                delete data.lookup_id;
                for(let key in data) {
                    lookup[key] = data[key];
                }
                return lookup.save({"validate":true, "userId":req.session.userId}).then(updateres => {
                    commonemitter.emit('eventLogEvent', data, 'Lookup', functions.decrypt(req.session.userId));
                    return resolve({"success":true});
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({"success":false,"message": "Lookup option not found"});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}

exports.getLookupOptions = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            if(!("page" in data) || !("per_page" in data)) {
                return reject({"success":false, "message": "Pagination params missing."})
            }
            let queryWhere = {'is_deleted': 0};
            if("lookup_name" in data) {
                queryWhere['lookup_name'] = {$like : '%'+data.lookup_name+'%'};
            }
            let orderBy = [["lookup_id",  "desc"]];
            let start_limit = parseInt(data["page"])  * parseInt(data["per_page"]);
            const LookupOptions = ORM.model('tbl_lookup_options');
            const CodeMaster = ORM.model('tbl_code_master');
            return LookupOptions.findAndCountAll({ 
                attributes:["code_master_id", "lookup_name","lookup_id", "is_active", "is_deleted"],where: queryWhere, limit: parseInt(data["per_page"]), offset : start_limit, order: orderBy,distinct: true,
                include:[{model:CodeMaster, on:{'$tbl_lookup_options.code_master_id$' : {'$col' : 'tbl_code_master.code_master_id'}}, required:true}] 
            }).then(lookups => {
                let results = [];
                lookups.rows.forEach(element => {
                    element = element.get({plain:true});
                    element['code_name'] = element.tbl_code_master.code_master_name;
                    delete element.tbl_code_master;
                    results.push(element);
                });
                return resolve({"success":true, "results":results, "count":lookups.count});
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: 'Something went wrong' });
            });
        } catch(err) {
            console.log(err);
            return reject({ success: false, message: 'Something went wrong' });
        }
    });
}

exports.getBadges = function(req) {
    try {
        let data = req.body;
        let queryWhere = {"is_deleted":0, "is_active":1};
        const Badges = ORM.model('tbl_badges');
        return Badges.findAndCountAll({where:queryWhere}).then(badges => {
            return { success: true, results:badges.rows, count : badges.count };
        }).catch(err => {
            console.log(err);
            return { success: false, message: 'Something went wrong' };
        });
    } catch(err) {
        console.log(err);
        return { success: false, message: 'Something went wrong' };
    }
}

exports.updateBadge =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.badge_id)
            return reject({ success: false, message: 'Invalid params' });
        data.id = data.lookup_id;
        let queryWhere = {"badge_id": { $in:[data.badge_id]}};
        const Badges = ORM.model('tbl_badges');
        Badges.findOne({ where:queryWhere}).then(badge => {
            if(badge) {
                delete data.badge_id;
                for(let key in data) {
                    badge[key] = data[key];
                }
                return badge.save({"validate":true, "userId":req.session.userId}).then(updateres => {
                    commonemitter.emit('eventLogEvent', data, 'badge', functions.decrypt(req.session.userId));
                    return resolve({"success":true});
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({"success":false,"message": "Badge not found"});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}

exports.getAllUsers = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            if(!("page" in data) || !("per_page" in data)) {
                return reject({"success":false, "message": "Pagination params missing."})
            }
            let orderBy = [["user_id",  "desc"]];
            let start_limit = parseInt(data["page"])  * parseInt(data["per_page"]);
            const Users = ORM.model('tbl_users');
            const Badges = ORM.model('tbl_badges');
            const UserProfile = ORM.model('tbl_user_profile');
            let queryWhere = {'is_deleted':0};
            let userWhere = {};
            if(data.user_type) {
                queryWhere['user_type'] = data.user_type;
            }
            if(data.name) {
                const Op = Sequelize.Op;
                queryWhere[Op.or]= [{'user_name': {[Op.like]: '%'+data.name+'%'}},{'email': {[Op.like]: '%'+data.name+'%'}}];
            }
            return Users.findAndCountAll({ where: queryWhere,attributes:['email','user_id','user_name', 'is_active','is_deleted'],
                 limit: parseInt(data["per_page"]), offset : start_limit, order: orderBy,
                include:[{model:UserProfile,attributes:['badge_id','location'], on:{'$tbl_user_profile.user_id$' : {'$col' : 'tbl_users.user_id'}}, required:false,
                       include:[{model:Badges,attributes:['badge_name','badge_id'], on:{'$tbl_user_profile.badge_id$' : {'$col' : 'tbl_user_profile.tbl_badge.badge_id'}}, required:false}]}
                ] 
            }).then(users => {
                return resolve({"success":true, "results":users.rows, "count":users.count});
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: 'Something went wrong' });
            });
        } catch(err) {
            console.log(err);
            return reject({ success: false, message: 'Something went wrong' });
        }
    });
}

exports.updateUserStatus =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.id = data.user_id;
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const Users = ORM.model('tbl_users');
        Users.findOne({where:queryWhere}).then(user => {
            if(user) {
                delete data.user_id;
                for(let key in data) {
                    user[key] = data[key];
                }
                return user.save({"validate":true, "userId":req.session.userId}).then(updateres => {
                    commonemitter.emit('eventLogEvent', data, 'User', functions.decrypt(req.session.userId));
                    return resolve({"success":true});
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({"success":false,"message": "User not found"});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}

exports.updateUserProfile =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.id = data.user_id;
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const UserProfile = ORM.model('tbl_user_profile');
        UserProfile.findOne({where:queryWhere}).then(user => {
            if(user) {
                delete data.user_id;
                for(let key in data) {
                    user[key] = data[key];
                }
                return user.save({"validate":true, "userId":req.session.userId}).then(updateres => {
                    commonemitter.emit('eventLogEvent', data, 'UserProfile', functions.decrypt(req.session.userId));
                    return resolve({"success":true});
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({"success":false,"message": "User not found"});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}