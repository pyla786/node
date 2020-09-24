const authServices = require('../services/authservices');
exports.routes = function(app){
    
    app.use(function timeLog(req, res, next) {
        try {
            let skipUrls = {"/":true,"/validateotp":true,"/login":true,"/checksession":true,"/logout":true,"/checkurlstatus":true,"/activateuser":true,"/resetpassword":true,"/forgotpassword":true,"/checkresetpassurlstatus":true, "/register":true};
            if (skipUrls[req.url]) return next();
            console.log(req.headers["authorization"], '-----2');
            let bearerHeader = req.headers["authorization"];
            console.log(bearerHeader, '-----1');
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

    app.post('/register', authServices.register);
    app.post('/login', authServices.authenticate);
    app.get('/checksession', authServices.checkSession);
    app.post('/validateotp', authServices.validateOTP);
    app.post('/activateuser', authServices.activateUser);
    app.post('/forgotpassword', authServices.forgotPassword);
    app.post('/resetpassword', authServices.resetPassword);
    app.put('/changepassword', authServices.changePassword);
    app.post('/logout', function (req, res) {
        try {
            if (req.session) {
                req.session.destroy();
            }
            res.json({ success: true, message: 'Logged out successfully' });
        } catch (e) {
            res.status(421).send({ message: 'Failed to process request' });
        }
    });
};