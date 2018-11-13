const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    storage: 'data/database/rajio.sqlite'
});

const rajio = sequelize.define('rajio', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    downloadCount: {
        type: Sequelize.INTEGER
    },
    downloadLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    uploadTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    fileSize: {
        type: Sequelize.INTEGER
    },
    timeLimit: {
        type: Sequelize.DATE,
        allowNull: true
    },
    downloadCode: {
        type: Sequelize.STRING,
        unique: true
    },
    fileName: {
        type: Sequelize.STRING
    }
})

module.exports = rajio;