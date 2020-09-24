var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var moment = require('moment');
var path = require('path');
var session = require('express-session');
var morgan = require('morgan');
var commonemitter = require('./lib/custom-events').commonEmitter;
var helmet = require('helmet');
var frameguard = require('frameguard');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access-Log-' + moment().format('DD-MM-YYYY') + '.log'), { flags: 'a' });
var config = require('./config');
var associations = require('./orm/associations/table_associations');
var param = process.argv[2];
var originurl = config[param];
var corsOptions = {
    origin: originurl,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//catch any uncaught exceptions while execution.
process.on('uncaughtException', function(err) {
    commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg":err.stack});
});

//Importing routes of app.
var authroutes = require('./routes/authroutes');
var adminroutes = require('./routes/adminroutes');
var profileroutes = require('./routes/profileroutes');
var postsroutes = require('./routes/postsroutes');
var port = config[param + 'port'];

//middleware of application.
app.set('port', process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.all('*', function(req, res, next) {
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Content-Length', '52250');
    res.header('X-XSS-Protection', '1');
    // res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Cache-Control', 'no-cache');
    next();
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use("/uploads", express.static(__dirname + '/uploads'));

// setup the logger for all http requests.
app.use(morgan('combined', { stream: accessLogStream }));

app.all('*', function(req, res, next) {

    //Origin is the HTML/Angular domain from where the ExpressJS API would be called.
    res.header('Access-Control-Allow-Origin', originurl);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //make sure you set this parameter and make it true so that Angular and Express are able to exchange session values between each other .

    next();

});
app.use(helmet());
app.use(frameguard({ action: 'deny' }));

//setting headers for security eg: x-frame options. 

app.set('trust proxy', 1) // trust first proxy.

app.use(session({
    secret: config.sessionSecret,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        resave: true,
        rolling: true,
    },
    saveUninitialized: false,
    resave: false,
    rolling: true
}));


//Setting routes to express app.
authroutes.routes(app);
adminroutes.routes(app);
profileroutes.routes(app);
postsroutes.routes(app);

associations.setup('./orm/models', config[param + 'DB'].database , config[param + 'DB'].user, config[param + 'DB'].password, config[param + 'DB'].logger, {
    host: config[param + 'DB'].host,
    dialect: config[param + 'DB'].dialect,
    logging: config.logging,
    pool: {
        max: config[param + 'DB'].connectionLimit,
        min: 0,
        idle: 10000
    },
});

app.use(function(err, req, res, next) {
    commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg":err.stack});
    res.status(500).send({ "Error": err.stack });
});

//satrting server.
http.createServer(app).listen(app.get('port'), "0.0.0.0", function() {
    console.log('Server is listening on port ' + app.get('port'));
});