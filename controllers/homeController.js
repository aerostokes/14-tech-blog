const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../models")
const dayjs = require("dayjs");



router.get("/", async (req, res) => {
    try {
        const postData = await Post.findAll({ include: [
            User,
            { 
                model: Comment, 
                include: User,
            },
        ]});
        const postArr = postData.map(postObj => postObj.get({ plain: true }))
        postArr.forEach(postObj => {
            postObj.createdAt = dayjs(postObj.createdAt).format("MM/DD/YY")
        });
        res.render("home", {
            allPosts: postArr,
            UserId: req.session.UserId,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});


router.get("/login", async (req,res) => {
  try {
    if (req.session.userId) {
      res.redirect("/")
    } else {
      res.render("login")
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.get("/signup", async (req,res) => {
  try {
    if (req.session.userId) {
      res.redirect("/")
    } else {
      res.render("signup")
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.get("/posts/:id", async (req, res) => {
  try {
    let isCurrentUser = false;
    const postData = await Post.findByPk(req.params.id, { 
      include: [
          User,
          { 
              model: Comment, 
              include: User,
          },
      ],
    });
    if (postData.UserId===req.session.UserId) { isCurrentUser = true };
    const postObj = postData.get({ plain: true }) 
    postObj.createdAt = dayjs(postObj.createdAt).format("MM/DD/YY")
    postObj.Comments.forEach(commentObj => {
      commentObj.createdAt = dayjs(commentObj.createdAt).format("MM/DD/YY")

    });
    res.render("post", {
      postObj,
      UserId: req.session.UserId,
      isCurrentUser,
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({ msg: "Error Occurred", err });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.UserId) {
      res.redirect("/login")
    } else {
      const userData = await User.findByPk(req.session.UserId, { include: [Post] })
      const postArr = userData.Posts.map(postObj => postObj.get({ plain: true }))
      postArr.forEach(postObj => {
        postObj.createdAt = dayjs(postObj.createdAt).format("MM/DD/YY")
        postObj.username = userData.username;
      });
      console.log(postArr)
      res.render("dashboard", {
        allPosts: postArr,
        UserId: req.session.UserId,
      });
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ msg: "Error Occurred", err });
  }
});



module.exports = router;