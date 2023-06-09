const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../../models")
const bcrypt = require("bcrypt");

// Routes for /api/users

// Get all Users
router.get("/all", (req, res) => {
    User.findAll({ 
        include: [Post, Comment],
    }).then(usersArr => {
        if (usersArr.length === 0) {
            return res.status(404).json({ msg: "No Users found" });
        } else {
            return res.json(usersArr);
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Get Current User 
router.get("/", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(403).json({ msg: "Login required" }); 
    } else {
        User.findByPk(req.session.UserId, {
            include: [Post, Comment],
        }).then(userObj => {
            if (!userObj) {
                return res.status(404).json({ msg: "UserId not found" });
            } else {
                return res.json(userObj);
            };
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Error Occurred", err });
        });
    };
});

// Post new User
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    }).then(userObj => {
        req.session.UserId = userObj.id;
        req.session.loggedIn = true;
        return res.json([
            { msg: "Signup successful" }, 
            req.session,
        ]);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Login
router.post("/login", (req, res) => {
    User.findOne({
        where: { username: req.body.username },
    }).then(userObj => {
        if (!userObj) {
            return res.status(401).json({ msg:"Invalid username/password" });
        } else if (bcrypt.compareSync(req.body.password, userObj.password)) {
            req.session.UserId = userObj.id;
            req.session.loggedIn = true;
            return res.json([
                { msg: "Login successful" }, 
                req.session,
            ]);
        } else {
            return res.status(401).json({ msg:"Invalid username/password" });
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error occurred", err });
    });
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ msg: "Logout successful"});
});

// Put update User by id
router.put("/:id", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(403).json({ msg: "Login required" })
    } else if (req.session.UserId !== parseInt(req.params.id)) {
        return res.status(403).json({ msg: "Not authorized for this UserId" })
    } else {
        User.update({
            username: req.body.username,
        },{
            where: { id: req.params.id },
        }).then(userArr => {
            return res.json({ msg: "Successfully updated" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Error Occurred", err });
        });
    };
});

// Delete User by id and logout
router.delete("/:id", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(403).json({ msg: "Login required" })
    } else if (req.session.UserId !== parseInt(req.params.id)) {
        return res.status(403).json({ msg: "Not authorized for this UserId" })
    } else {
        User.destroy({
            where: { id: req.params.id },
        }).then(userObj => {
            req.session.destroy();
            return res.json({ msg: "Successfully deleted" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Error Occurred", err });
        });
    };
});

module.exports = router;
