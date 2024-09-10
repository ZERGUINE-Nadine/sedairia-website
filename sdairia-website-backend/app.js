// app.js
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const sequelize = require('./database/db.config');
const scheduleCronJobs = require('./utils/cron-schedular.utils');
const bodyParser = require('body-parser');

// Importing routes
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const ordersRoutes = require('./routes/oreders.routes');

// Start application
scheduleCronJobs();

app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});

// Connect with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database has been initialized successfully.');
    })
    .catch((error) => {
        console.error('Error initializing database:', error);
    });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Apply routes
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', appointmentsRoutes);
app.use('/api', ordersRoutes);
