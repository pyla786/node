/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_badges_activity', {
    badge_activity_id: {
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
    previous_badge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_badges',
        key: 'badge_id'
      }
    },
    upgraded_badge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_badges',
        key: 'badge_id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tbl_badges_activity'
  });
};
