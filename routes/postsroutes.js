const postsServices = require('../services/postsservices');
let multer = require('multer');
let upload = multer({ dest: 'uploads/' });

exports.routes = function(app){
    
    app.use(function timeLog(req, res, next) {
        try {
            let skipUrls = {"/":true,"/validateotp":true,"/login":true,"/checksession":true,"/logout":true,"/checkurlstatus":true,"/activateuser":true,"/resetpassword":true,"/forgotpassword":true,"/checkresetpassurlstatus":true, "/register":true};
            if (skipUrls[req.url]) return next();
            let bearerHeader = req.headers["authorization"];
            //console.log(bearerHeader);
            let bearer = bearerHeader.split(" ");
            let bearerToken = bearer[1];
            if ( bearerToken && req.session.token === bearerToken) {
                next();
            } else {
                res.status(401).send({ success: false, message: 'Session expired. Please login again.' });
            }
        } catch(err) {
            res.status(401).send({ success: false, message: 'Session expired. Please login again.' });
        }
    });

    app.get('/getallposts', postsServices.getAllPosts);
    app.post('/addpostwithvideo', postsServices.addPostWithVideo);
    app.post('/addpostwithimage',upload.single('feed_photo'), postsServices.addPostWithImage);
    app.post('/addpostwithtext', postsServices.addPostWithText);
    app.post('/updatepost', postsServices.updatePost);
};