/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_user_tags', {
    user_tag_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag_master_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_lookup_options',
        key: 'lookup_id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
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
    tableName: 'tbl_user_tags',
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
