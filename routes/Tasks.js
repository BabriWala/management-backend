const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


const User = require('../models/User'); 
const bcrypt = require('bcrypt'); // For password comparison
const jwt = require('jsonwebtoken');



// GET all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific task by ID
router.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST (create) a new task
router.post('/tasks', async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    const task = new Task({
      title,
      description,
      completed,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT (update) an existing task by ID
router.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updatedTask, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a task by ID
router.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByIdAndRemove(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the user's password before saving it
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Create a new user instance
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      // Save the user to the database
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error creating user' });
    }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by their username
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Password is correct; generate a JWT
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h', // Token expiration time
      });

      res.status(200).json({ message: 'Authentication successful', token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
