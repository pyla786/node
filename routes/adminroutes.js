const adminServices = require('../services/adminservices');

exports.routes = function(app){
    app.use(function timeLog(req, res, next) {
        try {
            let skipUrls = {"/":true,"/validateotp":true,"/login":true,"/checksession":true,"/logout":true,"/checkurlstatus":true,"/activateuser":true,"/resetpassword":true,"/forgotpassword":true,"/checkresetpassurlstatus":true, "/register":true};
            if (skipUrls[req.url]) return next();
            //console.log(skipUrls);
            let bearerHeader = req.headers["authorization"];
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

    app.post('/getlookups', adminServices.getLookups);
    app.post('/addlookups', adminServices.addLookups);
    app.put('/updatelookup', adminServices.updateLookup);
    app.post('/getlookupoptions', adminServices.getLookupOptions);
    app.post('/getbadges', adminServices.getBadges);
    app.put('/updatebadge', adminServices.updateBadge);
    app.post('/getallusers', adminServices.getAllUsers);
    app.put('/updateuserstatus', adminServices.updateUserStatus);
    app.put('/updateuserprofile', adminServices.updateUserProfile);
    
};