const express = require("express");
const app = express();

const path = require("path");
 
const sequelize = require("./config/connection");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const exphbs = require("express-handlebars");

const allRoutes = require("./controllers");
const PORT = process.env.PORT || 3000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000*60*60*2 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({ db: sequelize }),
}));

const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

app.use(allRoutes);
 
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
});
