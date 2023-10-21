const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/Tasks');
const router = express.Router();
const cors = require('cors'); // Import the cors package



const app = express();
const port = process.env.PORT || 4001;

// Connect to the MongoDB database
const dbURL = 'mongodb+srv://hanzalafarhann:Uh9P4gowaTG6Zle6@cluster0.024be1f.mongodb.net/?retryWrites=true&w=majority'; // Change this to your MongoDB connection URL
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const verifyToken = require('./auth');

// ...

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Use verifyToken middleware to secure routes
router.use(verifyToken);




// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Use the tasks router for the /api route
app.use('/api', tasksRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;