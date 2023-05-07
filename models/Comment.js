const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model{};
Comment.init({
    contents: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},{
    sequelize,
});

module.exports = Comment