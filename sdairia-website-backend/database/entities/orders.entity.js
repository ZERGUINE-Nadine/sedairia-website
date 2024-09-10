const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');

const Order = sequelize.define('orders', {
    motif: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 255
    },
    files: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    tarif: {
      type: DataTypes.REAL,
      allowNull: true,
      default: null,
    },
    status: {
        type: DataTypes.ENUM('en cours', 'traité', 'annuler', 'bloquer'),
        allowNull: false,
        defaultValue: 'en cours',
    }
});

module.exports = Order