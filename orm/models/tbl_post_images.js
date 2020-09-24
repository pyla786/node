/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_post_images', {
    post_image_id: {
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
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    width: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    tableName: 'tbl_post_images',
    timestamps: false,
  });
};
