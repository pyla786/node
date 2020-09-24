/* jshint indent: 2 */
const functions = require('../../lib/functions');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_users', {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_type: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    is_active: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'tbl_users',
    updatedAt: 'modified_date',
    createdAt: 'created_date',
    hooks : {
      beforeValidate : function(instance, options) {
        /* if(!options.userId)
          return sequelize.Promise.reject("Session expired. Please login again");
        let userId = functions.decrypt(options.userId);
        instance['created_by'] = userId;
        instance['modified_by'] = userId; */
      }
    }
  });
};
