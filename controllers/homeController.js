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

module.exports = router;