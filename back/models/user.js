module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(30), //문자열이 30글자 이내  STRING< TEXT(긴글), BOOLEAN, INTGER(정수), FLOAT(실수), DATETIME(시간)
      allowNull: false, //필수
      unique: true, //고유한 값
    },
    nickname: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),  //비밀번호는 암호화를 하면 길이가 엄청 늘어남!
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    modelName: 'User',
    tableName: 'users',
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); //사용자와 게시글의 좋아요 관계. 중가테이블 이름 : Like.
    // as로 별칭붙여줌 이 별칭이 LikedPost느낌. .나중에 as에 따라서 post.getLikers처럼 게시글 좋아요 누른사람 가져오기할수이/ㅆ음.
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId'});
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId'});
  };
  return User;
}