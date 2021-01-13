const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) { // sequelize.define이 Modle.init으로 바뀌었다고 생각하면됨.
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      // UserId: ,
      // PostId: ,
    }, {
      modelName: 'Comment',
      tableName: 'comments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};