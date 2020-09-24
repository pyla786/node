/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_project_invitations', {
    invitation_id: {
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
    invited_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    invitation_status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '2'
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    invitation_accepted_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'tbl_project_invitations'
  });
};
