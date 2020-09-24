/* jshint indent: 2 */
const functions = require('../../lib/functions');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_user_profile', {
    profile_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gender: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: 0
    },
    badge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_badges',
        key: 'badge_id'
      }
    },
    website_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facebook_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    twitter_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    linkedin_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pinterest_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instagram_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tbl_user_profile',
    updatedAt: 'modified_date',
    createdAt: 'created_date',
    hooks : {
      beforeValidate : function(instance, options) {
        /* if(!options.userId)
          return sequelize.Promise.reject("Session expired. Please login again");
        let userId = functions.decrypt(options.userId);
        instance['created_by'] = userId;
        instance['modified_by'] = userId; */
        return;
      }
    }
  });
};
