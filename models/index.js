const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

Post.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(Post);

Comment.belongsTo(Post, { onDelete: "CASCADE" });
Post.hasMany(Comment);

Comment.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(Comment);

module.exports = {
    User: User,
    Post: Post,
    Comment: Comment,
};