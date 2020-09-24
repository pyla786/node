/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_post_likes', {
    like_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_posts',
        key: 'post_id'
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
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    like_status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'tbl_post_likes',
    timestamps:false
  });
};
