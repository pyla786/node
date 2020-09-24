const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const ORM = require('../associations/table_associations');
const functions = require('../../lib/functions');
const sgMail = require('@sendgrid/mail');
var moment = require('moment');
var Sequelize = require("sequelize");
var config = require('../../config');
var param = process.argv[2];
sgMail.setApiKey(config['sendgridKey']);
var originurl = config[param];
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: config[param + 'bucket']} } );
const commonemitter = require('../../lib/custom-events').commonEmitter;
var probe = require('probe-image-size');

exports.addPostWithVideo =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.user_id || !data.description || !data.video_url)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        data.post_type = 2;
        const Posts = ORM.model('tbl_posts');
        const PostVideos = ORM.model('tbl_post_videos');
        ORM.getObj().transaction().then(function(t) {
            return Posts.create(data).then( async postres => {
                let obj = {"post_id":postres.post_id, "video_url":data.video_url};
                let post_video_res = await PostVideos.create(obj);
                if(post_video_res) {
                    t.commit();
                    return resolve({"success":true});
                } else {
                    return reject({"success":false, "messsage":"Error while saving video"});
                }
            }).catch(err => {
                console.log(err);
                return reject({"success":false, "message":"something went wrong"});
            });
        });
    });
}

exports.addPostWithImage =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = {};
        if(req.body.data) {
            data = JSON.parse(req.body.data);
        } else {
            data = req.body;
        }
        if(!data.user_id || !data.description)
            return reject({ success: false, message: 'Invalid params' });
        if(!req.file)
            return reject({"success":false, "messsage":"No file choosen"});
        data.user_id = functions.decrypt(data.user_id);
        data.post_type = 1;
        const Posts = ORM.model('tbl_posts');
        const PostImages = ORM.model('tbl_post_images');
        ORM.getObj().transaction().then(function(t) {
            return Posts.create(data).then( async postres => {
                if(req.file ) {  // key == 'profile_pic' && data.profile_pic
                    let upload_res = await uploadImageCloud(postres.post_id, req.file);
                    if(upload_res.success) {
                        let obj = {"post_id":postres.post_id, "image_url":upload_res.profile_s3_path, "height":upload_res.height, "width":upload_res.width};
                        let post_image_res = await PostImages.create(obj);
                        if(post_image_res) {
                            t.commit();
                            return resolve({"success":true});
                        } else {
                            return reject({"success":false, "messsage":"Error while saving image"});
                        }
                    } else {
                        return reject({"success":false, "messsage":"Error while uploading feed image"});
                    }
                } else {
                    return reject({"success":false, "messsage":"No file choosen"});
                }
            }).catch(err => {
                console.log(err);
                return reject({"success":false, "message":"something went wrong"});
            });
        });
    });
}

exports.addPostWithText =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.user_id || !data.description)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        data.post_type = 3;
        const Posts = ORM.model('tbl_posts');
        return Posts.create(data).then( postres => {
            return resolve({"success":true});
        }).catch(err => {
            console.log(err);
            return reject({"success":false, "message":"something went wrong"});
        });
    });
}

exports.getAllPosts =  async function(req) {
    return new Promise(function(resolve, reject) {
        console.log(req.query);
        let orderBy = [["post_id",  "desc"]];
        let queryWhere = {};
        let page = req.query.page ? req.query.page : 0;
        let per_page = req.query.per_page ? req.query.per_page : 100;
        let offset = parseInt(page)  * parseInt(per_page);
        const Posts = ORM.model('tbl_posts');
        const PostImages = ORM.model('tbl_post_images');
        const PostVideos = ORM.model('tbl_post_videos');
        const Profile = ORM.model('tbl_user_profile');
        /* const PostLikes = ORM.model('tbl_post_likes'); */
        return Posts.findAll({ where:queryWhere, limit:parseInt(per_page), offset : offset,order: orderBy,
            include:[
                {model:Profile, attributes:['profile_pic',"full_name"] , on:{'$tbl_user_profile.user_id$' : {'$col' : 'tbl_posts.user_id'}}, required:true},
                {model:PostImages, attributes:['image_url','height','width'] , on:{'$tbl_post_images.post_id$' : {'$col' : 'tbl_posts.post_id'}}, required:false},
                {model:PostVideos, attributes:['video_url'] , on:{'$tbl_post_videos.post_id$' : {'$col' : 'tbl_posts.post_id'}}, required:false},
                /* attributes:['post_id','user_id','post_type',[Sequelize.fn("COUNT", Sequelize.col("tbl_post_likes.like_id")), "likesCount"]], {model:PostLikes, where: {"like_status":1}, attributes: [], on:{'$tbl_post_likes.post_id$' : {'$col' : 'tbl_posts.post_id'}}, required:false} */
            ] 
        }).then(async (postsdata) => {
            return resolve({"success":true, "results":postsdata});
        }).catch(err => {
            console.log(err);
            return reject({"success":false,"message": "Something went wrong"});
        })
    });
}

exports.updatePost =  async function(req) {
    return new Promise(function(resolve, reject) {
        let data = req.body;
        if(!data.user_id)
            return reject({ success: false, message: 'Invalid params' });
        data.user_id = functions.decrypt(data.user_id);
        let queryWhere = {"user_id": { $in:[data.user_id]}};
        const Profile = ORM.model('tbl_user_profile');
        ORM.getObj().transaction().then(function(t) {
            Profile.findOne({ where:queryWhere}).then(async (profile) => {
                if(profile) {
                    for(let key in data) {
                        if(key == 'profile_pic') {
                            let upload_res = await uploadImageCloud(data.user_id, data.profile_pic);
                            if(upload_res.success) {
                                data['profile_pic'] = upload_res.profile_s3_path;
                            } else {
                                continue;
                            }
                        }
                        profile[key] = data[key];
                    }
                    return profile.save({"validate":true, "userId":req.session.userId}).then(async (updateres) => {
                        let tag_res = {"success":true};
                        if(("profile_tags" in data) && (data.profile_tags.length)) {
                            tag_res = await updateUserTags(data);
                            delete data.profile_tags;
                        }
                        if(tag_res.success) {
                            delete data.user_id;
                            t.commit();
                        } else {
                            return reject({"success":false});
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

function uploadImageCloud(post_id, imageData) {
    let key = 'PostFeedImages/'+ post_id +'/'+ functions.randomValueBase64(20) + '.jpg';
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
                }, async function(err) {
                    if (err) { 
                        console.log(err);
                        console.log('Error uploading data: ', data); 
                        return reject({"success":false});
                    } else {
                        console.log('succesfully uploaded the image!');
                        let imageProps = probe.sync(fs.readFileSync(imageData.path));
                        let height = imageProps ? imageProps.height : 350;
                        let width = imageProps ? imageProps.width : 350;
                        fs.unlink(imageData.path);
                        return resolve({"success":true, height : height, width : width, "profile_s3_path":config.s3_base_url + config[param + 'bucket'] + '/' + key});
                    }
                });
            });
        } catch(err) {
            console.log(err);
            return reject({"success":false});
        }
    });
}
