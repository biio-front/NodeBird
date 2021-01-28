module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {// MYSQL에는 posts로 저장됨.
    // id: {},   MYSQL에서 자동적으로 넣어줌.
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {          // 두번째 객체는 유저모델에 대한 세팅
    charset: 'utf8mb4', // utf8은 한글, mb4를 같이 쓰면 이모티콘도 사용가능😊
    collate: 'utf8mb4_general_ci',
    modelName: 'Post',
    tableName: 'posts',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);  //post.addUser, post.setUser(게시글 작성자 수정하기)
    db.Post.hasMany(db.Comment);  //post.addComments
    db.Post.hasMany(db.Image); // post.addImages, post.removeImages
    db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});  //
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, {as:'Retwee'});  // post.addRetweet, post.removeRetweet
  };
  return Post;
}