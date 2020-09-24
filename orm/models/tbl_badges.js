/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_badges', {
    badge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    badge_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    minimum_points: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    minimum_connections: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    minimum_posts: {
      type: DataTypes.INTEGER(11),
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
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    }
  }, {
    tableName: 'tbl_badges',
    updatedAt: 'modified_date',
    createdAt: 'modified_date',
    beforeValidate : function(instance, options) {
      /* if(!options.userId)
        return sequelize.Promise.reject("Session expired. Please login again");
      let userId = functions.decrypt(options.userId);
      instance['created_by'] = userId;
      instance['modified_by'] = userId; */
    }
  });
};
