const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');
//models
const User = require('./user');
const Movie = require('./movie');

const Vote = sequelize.define('Vote', {
  Note: {
    type: DataTypes.INTEGER,
    require: true,
  },

});

User.hasMany(Vote);
Vote.belongsTo(User);

Movie.hasMany(Vote);
Vote.belongsTo(Movie);

module.exports = Vote;
