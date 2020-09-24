/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_code_master', {
    code_master_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code_master_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'tbl_code_master',
    timestamps : false
  });
};
