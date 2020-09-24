const profileServices = require('../services/profileservices');
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

    app.get('/getprofiledata/:user_id', profileServices.getProfileData);
    app.get('/getprofileinfo/:user_id', profileServices.getProfileInfo);
    app.post('/addprofile', profileServices.addProfile);
    app.post('/updateprofile', upload.single('profile_pic'), profileServices.updateProfile);
    app.post('/addaccomplishments', profileServices.addAccomplishments);
    app.post('/updateaccomplishment', profileServices.updateAccomplishment);
    app.post('/updatesocialmedialinks', profileServices.updateSocialMediaLinks);
    app.get('/getaccomplishments/:user_id/:type', profileServices.getAccomplishments);
};