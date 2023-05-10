const express = require("express");
const router = express.Router();

const userRoutes = require("./userController");
router.use("/users", userRoutes);

const postRoutes = require("./postController");
router.use("/posts", postRoutes);

const commentRoutes = require("./commentController");
router.use("/comments", commentRoutes);

module.exports = router;