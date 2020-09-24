var filesystem = require('fs');
var models = {};

var association = function association() {
    var Sequelize = require("sequelize");
    var DataTypes = require("sequelize").DataTypes;
    var sequelize = null;
    var modelsPath = "";
    var logger;
    this.setup = function (path, database, username, password, consoleLogger, obj){
        modelsPath = path;
        logger = consoleLogger;
        sequelize = new Sequelize(database, username, password, obj);     
        sequelize.authenticate().then(function(result) {
            console.log("connected to db " + database);
            console.log(database + " => " + username + " => " + password );
        }).catch(function(err) {
            console.log(err);
        });
        init();
    }

    this.model = function (name){
        return models[name];
    }

    this.Seq = function (){
        return Sequelize;
    }

    this.getObj = function() {
        return sequelize;
    }

    function setAssociations() {
        models["tbl_lookup_options"].hasOne(models["tbl_code_master"], { foreignKey : 'code_master_id' , targetKey : 'code_master_id'} );
        models["tbl_user_profile"].hasMany(models["tbl_user_accomplishments"], { foreignKey : 'user_id' , targetKey : 'user_id'} );
        models["tbl_user_profile"].hasMany(models["tbl_user_tags"], { foreignKey : 'user_id' , targetKey : 'user_id'} );
        models["tbl_user_profile"].hasOne(models["tbl_users"], { foreignKey : 'user_id' , targetKey : 'user_id'} );
        models["tbl_user_profile"].hasOne(models["tbl_badges"], { foreignKey : 'badge_id' , targetKey : 'badge_id'} );
        models["tbl_users"].hasOne(models["tbl_user_profile"], { foreignKey : 'user_id' , targetKey : 'user_id'} );
        models["tbl_posts"].hasOne(models["tbl_user_profile"], { foreignKey : 'user_id' , targetKey : 'user_id'} );
        models["tbl_posts"].hasMany(models["tbl_post_videos"], { foreignKey : 'post_id' , targetKey : 'post_id'} );
        models["tbl_posts"].hasMany(models["tbl_post_images"], { foreignKey : 'post_id' , targetKey : 'post_id'} );
        models["tbl_posts"].hasMany(models["tbl_post_likes"], { foreignKey : 'post_id' , targetKey : 'post_id'} );
        models["tbl_user_tags"].hasMany(models["tbl_lookup_options"], { foreignKey : 'tag_master_id' , targetKey : 'lookup_id'} );
    }
    
    function init() {
        filesystem.readdirSync(modelsPath).forEach(function(name){
            if(name.indexOf(".swp") == -1) {
                var modelName = name.replace(/\.js$/i, "");
                var object = require("../models/" + modelName)(sequelize,DataTypes);
                models[modelName] = object;
            }
            else {
                logger.log(name);
            }
        });
        setAssociations();
    }
}

association.instance = null;

association.getInstance = function() {
    if(this.instance === null){
        this.instance = new association();
    }
    return this.instance;
}

module.exports = association.getInstance();

