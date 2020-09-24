/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_project_images', {
    image_id: {
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
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'tbl_project_images'
  });
};
