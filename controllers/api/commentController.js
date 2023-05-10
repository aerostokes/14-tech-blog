const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../../models");

// Routes for /api/comments

// Get Comment by id
router.get("/:id", async (req, res) => {
    try {
        const commentObj = await Comment.findByPk(req.params.id, { 
            include: Post,
        });
        return res.json(commentObj);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    };
});

// Create new Comment
router.post("/", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.status(403).json({ msg: "Login required" })
        } else {
            const postEntry = await Post.findByPk(req.body.PostId);
            if (!postEntry) {
                return res.status(404).json({ msg: "PostId not found" });
            } else {
                const commentObj = await Comment.create({
                    contents: req.body.contents,
                    PostId: req.body.PostId,
                    UserId: req.session.UserId,
                });
                res.json({ msg: "Successfully created", commentObj })
            };
        };
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    };
});

// Update Comment by id
router.put("/:id", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.status(403).json({ msg: "Login required" }); 
        } else {
            const commentEntry = await Comment.findByPk(req.params.id);
            if (!commentEntry) {
                return res.status(404).json({ msg: "CommentId not found" });
            } else if (req.session.UserId !== commentEntry.UserId) {
                return res.status(403).json({ msg: "Not authorized for this UserId" });
            } else {
                await commentEntry.update(req.body);
                return res.json({ msg: `Successfully updated Comment with id: ${req.params.id}` });
            };
        };
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    };
});

// Delete Comment by id
router.delete("/:id", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.status(403).json({ msg: "Login required" }); 
        } else {
            const commentEntry = await Comment.findByPk(req.params.id);
            if (!commentEntry) {
                return res.status(404).json({ msg: "CommentId not found" });
            } else if (req.session.UserId !== commentEntry.UserId) {
                return res.status(403).json({ msg: "Not authorized for this UserId" });
            } else {
                await commentEntry.destroy();
                res.json({ msg: `Successfully deleted Comment with id: ${req.params.id}`});
            };
        };
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});

module.exports = router;