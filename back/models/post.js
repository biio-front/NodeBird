module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {// MYSQL에는 posts로 저장됨.
    // id: {},   MYSQL에서 자동적으로 넣어줌.
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {          // 두번째 객체는 유저모델에 대한 세팅
    charset: 'utf8mb4', // utf8은 한글, mb4를 같이 쓰면 이모티콘도 사용가능😊
    collate: 'utf8mb4_general_ci'
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liked' }); //사용자와 게시글의 좋아요 관계. 
    db.Post.belongsTo(db.Post, {as:'Retwee'});
  };
  return Post;
}