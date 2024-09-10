const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');

const Appointment = sequelize.define('appointment', {
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    fullDate: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false
    },
    motif: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    status: {
        type: DataTypes.ENUM('accepter', 'refuser', 'en cours', 'annuler'),
        defaultValue: 'pending',
        allowNull: true,
    },
    userId: {
    type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
            key: 'id'
    }
}
});

module.exports = Appointment;