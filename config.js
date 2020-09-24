const winston = require('winston');
require('winston-daily-rotate-file');

let transport = new winston.transports.DailyRotateFile({
  filename: './logs/daily_query_log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'all'
});

let logger = winston.createLogger({
  transports: [
    transport
  ]
});

module.exports = {
  'sessionSecret': 'hanger2019!@#',
  'algorithm' : 'aes-256-ctr',
  'local': 'http://localhost:4200',
  'dev': 'http://dev.hanger.life',
  'qa': 'http://qa.hanger.life',
  'prod': 'http://prod.hanger.life',
  'localServ': 'http://localhost:6500',
  'qaServ': 'http://qa.hanger.life:6502',
  'devServ': 'http://dev.hanger.life:6501',
  'prodServ': 'http://prod.hanger.life:6500',
  'undefined': 'http://localhost:4200',
  'fromMailId': 'info@hanger.life',
  'sendgridKey' : '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',
  'localDB': {
    connectionLimit: 100,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hanger_dev',
    dialect:'mysql',
    logger:logger,
    logging:false
  },
  'devDB': {
    connectionLimit: 100,
    host: 'hanger-dev-instance-1.cu7vp75ijgfg.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'te$tdataba$e',
    database: 'hanger_dev',
    dialect:'mysql',
    logger:logger,
    logging:false
  },
  'qaDB': {
    connectionLimit: 100,
    host: 'hanger-dev-instance-1.cu7vp75ijgfg.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'te$tdataba$e',
    database: 'hanger_qa',
    dialect:'mysql',
    logger:logger,
    logging:false
  },
  'prodDB': {
    connectionLimit: 100,
    host: 'hanger-dev-instance-1.cu7vp75ijgfg.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'te$tdataba$e',
    database: 'hanger_prod',
    dialect:'mysql',
    logger:logger,
    logging:false
  },
  'localport': 6500,
  'devport': 6500,
  'qaport': 6500,
  'prodport': 6500,
  'localbucket':'hanger-mobile',
  'devbucket':'hanger-dev',
  'qabucket':'hanger-qa',
  's3_base_url':'https://s3-us-west-1.amazonaws.com/'
};