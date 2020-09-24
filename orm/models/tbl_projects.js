/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_projects', {
    project_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    project_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    project_type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
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
    modified_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'tbl_projects'
  });
};
