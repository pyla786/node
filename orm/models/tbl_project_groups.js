/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_project_groups', {
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_projects',
        key: 'project_id'
      }
    },
    group_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'tbl_project_groups'
  });
};
