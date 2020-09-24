/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_user_accomplishments', {
    accomplishment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'tbl_user_accomplishments',
    timestamps: false,
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
