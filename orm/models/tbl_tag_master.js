/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tag_master', {
    tag_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tag_type: {
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
    tableName: 'tbl_tag_master'
  });
};
