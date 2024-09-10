const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');
const Appointment = require("./appointment.entity");
const Order = require("./orders.entity");

const User = sequelize.define('users', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        length: 250,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        length: 250
    },

    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        unique: false,
    },

    token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        length: 250,
    }
});

Appointment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Appointment, { foreignKey: 'userId' });

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Appointment, { foreignKey: 'userId' });

module.exports = User;
