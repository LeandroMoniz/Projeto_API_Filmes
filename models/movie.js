const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Movie = sequelize.define('Movie', {

    Title: {
        type: DataTypes.STRING,
        require: true,
    },

    IdMovie: {
        type: DataTypes.STRING,
        require: true,
    },

    Runtime: {
        type: DataTypes.STRING,
    },

    Genre: {
        type: DataTypes.STRING,
    },

    Director: {
        type: DataTypes.STRING,
    },

    Actors: {
        type: DataTypes.STRING,
    },

    Poster: {
        type: DataTypes.STRING,
    },

    Plot: {
        type: DataTypes.STRING,
    },

    IdUser: {
        type: DataTypes.STRING,
        require: true,
    },

    bit: {
        type: DataTypes.BOOLEAN,
        require: true,
    },

});

module.exports = Movie