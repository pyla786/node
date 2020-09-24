/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_lookup_options', {
    lookup_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code_master_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_code_master',
        key: 'code_master_id'
      }
    },
    lookup_name: {
      type: DataTypes.STRING(255),
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
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tbl_lookup_options',
    updatedAt: 'modified_date',
    createdAt: 'created_date',
    beforeValidate : function(instance, options) {
      /* if(!options.userId)
        return sequelize.Promise.reject("Session expired. Please login again");
      let userId = functions.decrypt(options.userId);
      instance['created_by'] = userId;
      instance['modified_by'] = userId; */
    }
  });
};
