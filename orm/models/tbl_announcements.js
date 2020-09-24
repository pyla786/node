/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_announcements', {
    announcement_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    profession: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    announcement_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    badge_type: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_badges',
        key: 'badge_id'
      }
    },
    published_date: {
      type: DataTypes.DATE,
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
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
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
    tableName: 'tbl_announcements'
  });
};
