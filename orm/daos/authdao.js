const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ORM = require('../associations/table_associations');
const functions = require('../../lib/functions');
const sgMail = require('@sendgrid/mail');
var moment = require('moment');
var config = require('../../config');
var param = process.argv[2];
sgMail.setApiKey(config['sendgridKey']);
var originurl = config[param];
const commonemitter = require('../../lib/custom-events').commonEmitter;

exports.registerUser =  function(req) {
    return new Promise(async function(resolve, reject) {
        try {
            let data = req.body;
            if(!data.user_name || !data.email || !data.password )
                return reject({ auth: false, message: 'Invalid params' });
            const Users = ORM.model('tbl_users');
            let requiredFields = ["user_id","is_deleted"];
            let already_exists = await checkIfAlreadyExists(data, Users, requiredFields);
            if(already_exists.success) {
                ORM.getObj().transaction().then(function(t) {
                    var accessToken = data.password;
                    let hash = bcrypt.hashSync(accessToken, 10);
                    data.password_reset_token = functions.generateCode();
                    data.password = hash;
                    data.is_active = 0;
                    data.user_type = 2;
                    Users.create(data,{"validate":true, "transaction" : t}).then(async (usrres) => {
                        var uId = functions.encrypt(usrres.user_id.toString());
                        var email = data.email;
                        let email_res = await sendActivationEmail(email, data.user_name, data.password_reset_token);
                        if(email_res.success) {
                            t.commit();
                            let rmd = functions.randomValueBase64(20);
                            let sessionToken = functions.encrypt(rmd);
                            req.session.userId = uId;
                            req.session.token = sessionToken;
                            return resolve({ success: true, name:usrres.user_name, phone:usrres.phone, email:usrres.email,is_verified:usrres.is_verified, is_active:usrres.is_active, auth_token: sessionToken, user_id: uId, message: email_res.message});
                        } else {
                            return reject(email_res);
                        }
                    }).catch(err => {
                        console.log(err);
                        return reject({"success":false, "message": 'Something went wrong'});
                    });
                });
            } else {
                return reject(already_exists);
            }
        } catch(err) {
            console.log(err);
            return reject({"success":false, "message": 'Something went wrong'});
        }
    });
}

function checkIfAlreadyExists(data, model, requiredFields) {
    try {
        return model.findAll({attributes:requiredFields, where:{"email":data.email,"is_deleted":0}}).then(userdata => {
            if(userdata.length === 0) {
                return {"success":true};
            } else {
                return {"success":false, "message":"User with same email id already exits"};
            }
        }).catch(err => {
            return {"success":false, "message":"Something went wrong"};
        });
    } catch(err) {
        console.log(err);
        return {"success":false};
    }
}

function sendActivationEmail(email, name, code) {
    return new Promise(function(resolve, reject) {
        const msg = {
            to: email,
            from: config.fromMailId,
            subject: 'Account Activation - Hanger',
            html: '<p>Hello '+ functions.capitalizeString(name) +',</p></br> <p>Welcome to Hanger, please verify your email with the provided verification code : </p> <b>' + code + '</b></br></br><p>Thanks</p></br><b>Hanger Support Team</b>' // html body
        };
        sgMail.send(msg).then(() => {
            return resolve({"success":true, "message": "Verification code has been sent to your email ID. Please enter to complete the sign up"});
        }).catch(error => {
            return reject({"success":false, "message":"Failed to send verification link", "error": error.toString()});
        });
    });
}

exports.authenticate = function(req) {
    try {
        let data = req.body;
        if(!data.email || !data.password)
            return { auth: false, message: 'Invalid params' };
        let queryWhere = {"email":data.email,"is_deleted":0, "user_type" : 2};
        if("user_type" in data) {
            queryWhere['user_type'] = data.user_type;
        }
        const Users = ORM.model('tbl_users');
        const Profile = ORM.model('tbl_user_profile');
        return Users.findOne({where: queryWhere,
            include:[{model:Profile,attributes:['profile_pic'], on:{'$tbl_user_profile.user_id$' : {'$col' : 'tbl_users.user_id'}}, required:false}] 
        }).then(userdata => {
            console.log(userdata);
            if(userdata) {
                userdata = userdata.get({plain:true});
                console.log(userdata);
                if(!userdata.is_verified)
                    return { auth: false, message: 'Verification code has been sent to your email ID. Please enter to complete the sign up' };
                if(!bcrypt.compareSync(data.password, userdata.password))
                    return { auth: false, message: 'Password not matched' };
                if(!userdata.is_active)
                    return { auth: false, message: 'User not active. Please contact admin' };
                let uId = functions.encrypt(userdata.user_id.toString());
                let rmd = functions.randomValueBase64(20);
                let accessToken = functions.encrypt(rmd);
                req.session.userId = uId;
                req.session.token = accessToken;
                return { auth: true, name:userdata.user_name, registration_completed: userdata.tbl_user_profile ? 1  : 0, profile_pic: userdata.tbl_user_profile ? userdata.tbl_user_profile.profile_pic : '',phone:userdata.phone, email:userdata.email,is_verified:true, is_active:true, auth_token: accessToken, user_id: uId, message: 'Login Success'};
            } else {
                return { auth: false, message: 'User not found' };
            }
        }).catch(err => {
            console.log(err);
            return { auth: false, message: 'Something went wrong' };
        });
    } catch(err) {
        console.log(err);
        return { auth: false, message: 'Something went wrong' };
    }
}

exports.changePassword = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            console.log(data);
            if(!data.email)
                return { success: false, message: 'Invalid params' };
            data.id = null;
            const Users = ORM.model('tbl_users');
            let queryWhere = {"email": data.email, "is_deleted":0};
            return Users.findOne({attributes:["user_id",'password'], where:queryWhere}).then(user => {
                if(user) {
                    if(!bcrypt.compareSync(data.old_password, user.password)) {
                        return reject({ success: false, message: 'Old Password not matched' });
                    } else {
                        user.password = bcrypt.hashSync(data.new_password, 10);
                        return user.save({"validate":true, "userId":req.session.userId}).then(async (updateres) => {
                            commonemitter.emit('eventLogEvent', data, 'Password', functions.decrypt(req.session.userId));
                            return resolve({success:true});
                        }).catch(err => {
                            console.log(err);
                            return reject({ success: false, message: 'Something went wrong' });
                        });
                    }
                } else {
                    return reject({ success: false, message:"User not found" });
                }
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


exports.validateOTP = function(req) {
    try {
        let data = req.body;
        console.log(data);
        if(!data.userId || !data.otp)
            return { success: false, message: 'Invalid params' };
        let userId = functions.decrypt(data.userId);
        userId = Number(userId);
        const Users = ORM.model('tbl_users');
        return Users.findAll({attributes: ['password_reset_token'], where:{"user_id":userId, "is_deleted":false}}).then(userdata => {
            if(userdata.length !== 0 &&  userdata[0].password_reset_token != null) {
                if(data.otp == userdata[0].password_reset_token) {
                    return { success:true, message: 'Verification code validation is success',"user_id":data.userId };
                } else {
                    return { success: false, message: 'Invalid verification code' };
                }
            } else {
                return { success: false, message: 'Invalid verification code' };
            }
        }).catch(err => {
            console.log(err);
            return { success: false, message: 'Invalid verification code' };
        });
    } catch(err) {
        console.log(err);
        return { success: false, message: 'Invalid verification code' };
    }
}

exports.activateUser = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            if(!data.userId)
                return { success: false, message: 'Invalid params' };
            let userId = functions.decrypt(data.userId);
            userId = Number(userId);
            const Users = ORM.model('tbl_users');
            let queryWhere = {"user_id": userId, "is_deleted":0};
            return Users.findOne({attributes:["user_id",'password_reset_token'], where:queryWhere}).then(user => {
                if(user) {
                    if(req.url == '/activateuser') {
                        if(data.otp && (data.otp == user.password_reset_token)) {
                            user.is_active = true;
                            user.is_verified = true;
                            user.password_reset_token = null;
                        } else {
                            return reject({ success: false, message:"Invalid verification code" });
                        }
                    } else {
                        user.password = bcrypt.hashSync(data.password, 10);
                        user.is_verified = true;
                        user.is_active = true;
                        user.password_reset_token = null;
                    }
                    return user.save({"validate":true, "userId":'2b'}).then(updateres => {
                        return resolve({"success":true});
                    }).catch(err => {
                        console.log(err);
                        return reject({ success: false, message: 'Something went wrong' });
                    });
                } else {
                    return reject({ success: false, message:"User not found" });
                }
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

exports.forgotPassword = async function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let data = req.body;
            if(!data.email)
                return { success: false, message: 'Invalid params' };
            let queryWhere = {"email":data.email,"is_deleted":0, "user_type" : 2};
            if("user_type" in data) {
                queryWhere['user_type'] = data.user_type;
            }
            const Users = ORM.model('tbl_users');
            return Users.findOne({attributes:["user_id",'user_name','password_reset_token'], where:queryWhere}).then(user => {
                if(user) {
                    //if(user.is_verified && user.is_active) {
                        let accessToken = functions.generateCode();
                        user.password_reset_token = accessToken;
                        return user.save({"validate":true, "userId":'2b'}).then(async (updateres) => {
                            let uId = functions.encrypt(user.user_id.toString());
                            let email = data.email;
                            let email_res = await sendPassResetEmail(accessToken, email, user.user_name);
                            if(email_res.success) {
                                email_res['user_id'] = uId;
                                return resolve(email_res);
                            } else {
                                email_res['user_id'] = uId;
                                return reject(email_res);
                            }
                        }).catch(err => {
                            console.log(err);
                            return reject({ success: false, message: 'Something went wrong' });
                        });
                    /* } else {
                        if(!user.is_verified) {
                            return reject({ success: false, message:"User email is not verified. Please verify your account." });
                        } else {
                            return reject({ success: false, message:"User is not active. Please contact admin. " });
                        }
                    } */
                } else {
                    return reject({ success: false, message:"User not found" });
                }
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

function sendPassResetEmail(code, email, name) {
    return new Promise(function(resolve, reject) {
        const msg = {
            to: email,
            from: config.fromMailId,
            subject: 'Reset Password - Hanger', // Subject line
            html: '<p>Hello '+ functions.capitalizeString(name) + ',</p></br><p>You have requested a new password for ' + email + ' </p></br>Verification code to change password : <b>' +code +'</b> </br></br><p>Thanks,</p></br><b>Hanger Support Team</b>' // html body
        };
        sgMail.send(msg).then(() => {
            return resolve({"success":true, "message": "Verification code has been sent to your email ID. Please enter to reset password."});
        }).catch(error => {
            return reject({"success":false, "message":"Failed to send password reset mail", "error": error.toString()});
        });
    });
}
