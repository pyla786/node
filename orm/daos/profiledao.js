const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const ORM = require('../associations/table_associations');
const functions = require('../../lib/functions');
const sgMail = require('@sendgrid/mail');
var moment = require('moment');
var config = require('../../config');
var param = process.argv[2];
sgMail.setApiKey(config['sendgridKey']);
var originurl = config[param];
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: config[param + 'bucket']} } );
const commonemitter = require('../../lib/custom-events').commonEmitter;

exports.addProfile = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            if(!data.user_id || !data.full_name || !data.location || !data.gender)
                return reject({ success: false, message: 'Invalid params' });
            data.user_id = functions.decrypt(data.user_id);
            data.badge_id = 1;
            data.points = 100;
            const Profile = ORM.model('tbl_user_profile');
            return Profile.create(data).then(profile => {
                data.badge_name = "Bronze";
                data.connections = 0;
                delete data.user_id;
                return resolve({"success":true,"results":data});
            }).catch(err => {
                console.log(err);
                return reject({"success":false});
            });
        } catch(err) {
            console.log(err);
            return reject({"success":false});
        }
    });
}

exports.getProfileData =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.params;
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const Profile = ORM.model('tbl_user_profile');
        const UserTags = ORM.model('tbl_user_tags');
        const LookupOptions = ORM.model('tbl_lookup_options');
        const Accomplishments = ORM.model('tbl_user_accomplishments');
        Profile.findAll({ where:queryWhere,
            include:[
                {model:UserTags, attributes:['tag_master_id'], where: {"is_deleted":0, "is_active":1} ,on:{'$tbl_user_tags.user_id$' : {'$col' : 'tbl_user_profile.user_id'}}, required:false},
                {model:Accomplishments, where: {"is_deleted":0, "is_active":1}, on:{'$tbl_user_accomplishments.user_id$' : {'$col' : 'tbl_user_profile.user_id'}}, required:false}
            ] 
        }).then(async (profiledata) => {
            if(profiledata) {
                profiledata = profiledata[0].get({plain:true});
                let selected_tags = {};
                let designation = [];
                let business = [];
                let accomsFinal = {};
                let accomps = profiledata.tbl_user_accomplishments;
                for( let i=0; i< accomps.length; i++) {
                    if(!(''+accomps[i]['type'] in accomsFinal))
                        accomsFinal[''+accomps[i]['type']] = [];
                    accomsFinal[''+accomps[i]['type']].push(accomps[i]);
                }
                profiledata.accomplishments = accomsFinal;
                delete profiledata.tbl_user_accomplishments;
                let tags = profiledata.tbl_user_tags;
                for(let i=0; i< tags.length; i++) {
                    selected_tags[tags[i]['tag_master_id']] = 1;
                }
                let total_tags = await LookupOptions.findAll({attributes:['lookup_id','lookup_name','code_master_id'], where:{"code_master_id":{$in:[1,2]}, "is_deleted":0, "is_active":1}});
                for(let i=0; i< total_tags.length; i++) {
                    total_tags[i] = total_tags[i].get({plain:true});
                    let obj = {"tag_master_id":''+total_tags[i]['lookup_id'], "tag_name":total_tags[i]['lookup_name'], "is_selected":false};
                    if(total_tags[i]['lookup_id'] in selected_tags)
                        obj.is_selected = true;
                    if(total_tags[i]['code_master_id'] == 1) {
                        designation.push(obj);
                    } else {
                        business.push(obj);
                    }
                }
                profiledata.badge_name = 'Bronze';
                profiledata.connections = 0;
                profiledata.designation_tags = designation;
                profiledata.business_tags = business;
                delete profiledata.tbl_user_tags;
                return resolve({"success":true, "results":profiledata});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}


exports.getProfileInfo =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.params;
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const Profile = ORM.model('tbl_user_profile');
        const UserTags = ORM.model('tbl_user_tags');
        const LookupOptions = ORM.model('tbl_lookup_options');
        const Accomplishments = ORM.model('tbl_user_accomplishments');
        Profile.findOne({ where:queryWhere,
            include:[
                {model:Accomplishments, where: {"is_deleted":0, "is_active":1}, on:{'$tbl_user_accomplishments.user_id$' : {'$col' : 'tbl_user_profile.user_id'}}, required:false},
                {model:UserTags, attributes:['tag_master_id'], where: {"is_deleted":0, "is_active":1} ,on:{'$tbl_user_tags.user_id$' : {'$col' : 'tbl_user_profile.user_id'}}, required:false,
                include:[{model:LookupOptions, attributes:['lookup_name'], where: {"is_deleted":0, "is_active":1, "code_master_id":1} ,on:{'$tbl_user_tags.tbl_lookup_options.lookup_id$' : {'$col' : 'tbl_user_tags.tag_master_id'}}, required:false}]
            }] 
        }).then(async (profiledata) => {
            if(profiledata) {
                profiledata = profiledata.get({"plain":true});
                profiledata['projects_count'] = 0;
                profiledata['badge_name'] = 'Bronze';
                profiledata['tag_name'] = '';
                if(profiledata.tbl_user_tags.length) {
                    let tags = profiledata.tbl_user_tags;
                    let count = 0;
                    for(let i=0; i< tags.length; i++) {
                        if(tags[i].tbl_lookup_options.length) {
                            if(count == 0) {
                                profiledata['tag_name'] = tags[i].tbl_lookup_options[0]['lookup_name'];
                                count++;
                            }
                            else {
                                profiledata['tag_name'] += ', '+tags[i].tbl_lookup_options[0]['lookup_name'];
                                break;
                            }
                        }    
                    }
                    delete profiledata.tbl_user_tags;
                }
                let accomsFinal = {};
                let accomps = profiledata.tbl_user_accomplishments;
                for( let i=0; i< accomps.length; i++) {
                    if(!(''+accomps[i]['type'] in accomsFinal))
                        accomsFinal[''+accomps[i]['type']] = [];
                    accomsFinal[''+accomps[i]['type']].push(accomps[i]);
                }
                profiledata.accomplishments = accomsFinal;
                delete profiledata.tbl_user_accomplishments;
                return resolve({"success":true, "results":profiledata});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}

exports.updateSocialMediaLinks =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const Profile = ORM.model('tbl_user_profile');
        Profile.findOne({ where:queryWhere}).then(async (profile) => {
            if(profile) {
                for(let key in data) {
                    profile[key] = data[key];
                }
                return profile.save({"validate":true}).then(async (updateres) => {
                    return resolve({"success":true});
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({"success":false,"message": "User Profile not found"});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}

exports.updateProfile =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = {};
        if(req.body.data) {
            data = JSON.parse(req.body.data);
        } else {
            data = req.body;
        }
        console.log(req.body);
        console.log(req.body.data);
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const Profile = ORM.model('tbl_user_profile');
        ORM.getObj().transaction().then(function(t) {
            Profile.findOne({ where:queryWhere}).then(async (profile) => {
                if(profile) {
                    if(req.file ) {  // key == 'profile_pic' && data.profile_pic
                        let upload_res = await uploadImageCloud(data.user_id, req.file);
                        if(upload_res.success) {
                            data['profile_pic'] = upload_res.profile_s3_path;
                        }
                    }
                    for(let key in data) {
                        profile[key] = data[key];
                    }
                    return profile.save({"validate":true}).then(async (updateres) => {
                        let tag_res = {"success":true};
                        if(("profile_tags" in data) && (data.profile_tags)) {
                            tag_res = await updateUserTags(data);
                            delete data.profile_tags;
                        }
                        if(tag_res.success) {
                            delete data.user_id;
                            t.commit();
                        } else {
                            return reject({"success":false, message: 'Something went wrong at tag flag'});
                        }
                        return resolve({"success":true, "results":data});
                    }).catch(err => {
                        console.log(err);
                        return reject({ success: false, message: 'Something went wrong' });
                    });
                } else {
                    return reject({"success":false,"message": "User Profile not found"});
                }
            }).catch(err => {
                console.log(err);
                return reject({"success":false,"message": "Something went wrong"});
            })
        });
    });
}

function updateUserTags(data) {
    data.profile_tags = data.profile_tags.split(', ');
    let tags = [];
    for(let i=0; i<data.profile_tags.length; i++) {
        let obj = {};
        obj['tag_master_id'] = data.profile_tags[i];
        obj['user_id'] = data.user_id;
        tags.push(obj);
    }
    console.log(tags);
    return new Promise(function(resolve, reject) {
        const UserTags = ORM.model('tbl_user_tags');
        UserTags.destroy({where:{"user_id":data.user_id}}).then(async (updateres) => {
            return UserTags.bulkCreate(tags).then(tagsres => {
                return resolve({"success":true});
            }).catch(err => {
                console.log(err);
                return reject({"success":false});
            });
        }).catch(err => {
            console.log(err);
            return reject({ success: false, message: 'Something went wrong' });
        });
    });
}

function uploadImageCloud(userId, imageData) {
    let key = 'Profiles/'+ userId +'/'+ functions.randomValueBase64(20) + '.jpg';
    return new Promise(function(resolve, reject) {
        try {
            let fileStream = fs.createReadStream(imageData.path);
            fileStream.on('error', function(err) {
                if (err) {  return reject({"success":false});}
            });
            fileStream.on('open', function() {
                s3Bucket.putObject({
                    Key: key,
                    Body: fileStream,
                    ACL:'public-read'
                }, function(err) {
                    if (err) { 
                        console.log(err);
                        console.log('Error uploading data: ', data); 
                        return reject({"success":false});
    
                    } else {
                        fs.unlink(imageData.path);
                        console.log('succesfully uploaded the image!');
                        return resolve({"success":true, "profile_s3_path":config.s3_base_url + config[param + 'bucket'] + '/' + key});
                    }
                });
            });
        } catch(err) {
            console.log(err);
            return reject({"success":false});
        }
    });
}

exports.getAccomplishments = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.params;
            if(!data.type || !data.user_id)
                return reject({ success: false, message: 'Invalid params' });
            data.user_id = functions.decrypt(data.user_id);
            let queryWhere = {"is_active":1, "is_deleted":0};
            queryWhere['user_id'] = {$in:[data.user_id]};
            queryWhere['type'] = {$in:[data.type]};
            const Accomplishments = ORM.model('tbl_user_accomplishments');
            return Accomplishments.findAll({where:queryWhere}).then(accoms => {
                return resolve({"success":true, "results":accoms});
            }).catch(err => {
                console.log(err);
                return reject({"success":false});
            });
        } catch(err) {
            console.log(err);
            return reject({"success":false});
        }
    });
}

exports.addAccomplishments = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            if(!data.user_id || !data.title || !data.type)
                return reject({ success: false, message: 'Invalid params' });
            data.user_id = functions.decrypt(data.user_id);
            const Accomplishments = ORM.model('tbl_user_accomplishments');
            return Accomplishments.create(data).then(profile => {
                profile = profile.get({plain:true});
                delete profile.user_id;
                return resolve({"success":true, "results": profile});
            }).catch(err => {
                console.log(err);
                return reject({"success":false});
            });
        } catch(err) {
            console.log(err);
            return reject({"success":false});
        }
    });
}

exports.updateAccomplishment =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.accomplishment_id)
            return reject({ success: false, message: 'Invalid params' });
        if("user_id" in data)
            data.user_id = functions.decrypt(data.user_id);
        let queryWhere = {"accomplishment_id": { $in:[data.accomplishment_id]}};
        const Accomplishments = ORM.model('tbl_user_accomplishments');
        Accomplishments.findOne({ where:queryWhere}).then(async (accom) => {
            if(accom) {
                for(let key in data) {
                    accom[key] = data[key];
                }
                return accom.save({"validate":true, "userId":req.session.userId}).then(async (updateres) => {
                    return resolve({"success":true});
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({"success":false,"message": "Accomplishment not found"});
            }
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}
