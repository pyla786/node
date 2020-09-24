/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_post_shares', {
    share_id: {
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
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_posts',
        key: 'post_id'
      }
    },
    share_status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    platform: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'tbl_post_shares',
    timestamps:false
  });
};
