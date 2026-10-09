// DEPENDENCIES
const dns = require('dns');
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require('express');
const app = express();
require("./config/connection");
require('dotenv').config();
const morgan = require('morgan');
const port = process.env.PORT;
const cors = require('cors');

const corsOptions={
    origin: process.env.CLIENT_ORIGIN
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

const authAPI = require('./routes/api/userRoutes');
const projectAPI = require('./routes/api/projectRoutes');
const taskAPI = require('./routes/api/taskRoutes')
// Below are the API routes for authentication and projects
app.use('/api/users', authAPI);
app.use('/api/projects', projectAPI);
// app.use('/api/projects/:projectId')
app.use('/api/tasks', taskAPI);

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});