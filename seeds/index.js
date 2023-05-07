const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

const users = [
    {
        username: "userA",
        password: "passwordA",
    },{
        username: "userB",
        password: "passwordB",
    },
];

const posts = [
    {
        title: "Test Post 1",
        contents: "This is the first test post, by userA.",
        UserId: 1,
    },{
        title: "Test Post 2",
        contents: "This is the second test post, by userB.",
        UserId: 2, 
    },
];

const comments = [
    {
        contents: "First comment on Post 1, by userA",
        UserId: 1,
        PostId: 1,
    },{
        contents: "Second comment on Post 1, by userB",
        UserId: 2,
        PostId: 1,
    },
];

const startSeedin = async () => {
    try {
        await sequelize.sync({ force: true });
        await User.bulkCreate(users, { individualHooks: true });
        await Post.bulkCreate(posts);
        await Comment.bulkCreate(comments);
        console.log("Seeded Users, Posts, and Comments");
        process.exit(0);
    } catch(err) {
        console.log(err);
    };
};

startSeedin();