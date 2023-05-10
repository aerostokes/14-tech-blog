const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../../models");

// Routes for /api/posts

// Get all Posts
router.get("/", async (req, res) => {
    try {
        const postsArr = await Post.findAll({ 
            include: [
                User,
                { 
                    model: Comment, 
                    include: User,
                },
            ]
        });
        return res.json(postsArr);
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});

// Get Post by id
router.get("/:id", async (req, res) => {
    try {
        const postObj = await Post.findByPk(req.params.id, { 
            include: [
                User,
                { 
                    model: Comment, 
                    include: User,
                },
            ],
        });
        return res.json(postObj);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    };
});

// Create new Post
router.post("/", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.status(403).json({ msg: "Login required" });
        } else {
            const postObj = await Post.create({
                title: req.body.title,
                contents: req.body.contents,
                UserId: req.session.UserId,
            });
            res.json({ msg: "Successfully created", postObj });
        };
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});

// Update Post by id
router.put("/:id", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.status(403).json({ msg: "Login required" }); 
        } else {
            const postEntry = await Post.findByPk(req.params.id);
            if (!postEntry) {
                return res.status(404).json({ msg: "PostId not found" });
            } else if (req.session.UserId !== postEntry.UserId) {
                return res.status(403).json({ msg: "Not authorized for this UserId" });
            } else {
                await postEntry.update(req.body);
                return res.json({ msg: `Successfully updated Post with id: ${req.params.id}` });
            };
        };
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    };
});

// Delete Post by id
router.delete("/:id", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.status(403).json({ msg: "Login required" }); 
        } else {
            const postEntry = await Post.findByPk(req.params.id);
            if (!postEntry) {
                return res.status(404).json({ msg: "PostId not found" });
            } else if (req.session.UserId !== postEntry.UserId) {
                return res.status(403).json({ msg: "Not authorized for this UserId" });
            } else {
                await postEntry.destroy();
                res.json({ msg: `Successfully deleted Post with id: ${req.params.id}`});
            };
        };
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});

module.exports = router;