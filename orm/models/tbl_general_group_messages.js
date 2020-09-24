/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_general_group_messages', {
    message_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    creator_member_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_general_group_members',
        key: 'ggm_id'
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
    parent_message_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'tbl_general_group_messages'
  });
};
