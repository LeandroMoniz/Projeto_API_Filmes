const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Log = sequelize.define('Log', {
    idAdmin: {
        type: DataTypes.STRING,
        require: true,
    },

    deleteName: {
        type: DataTypes.STRING,
        require: true,
    },

    deleteEmail: {
        type: DataTypes.STRING,
        require: true,
    },

    deleteIsAdmin: {
        type: DataTypes.BOOLEAN,
        require: true,
    }
});

module.exports = Log