const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI; 
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully!");
});

// --- CONNECT THE ROUTES ---
const subjectsRouter = require('./routes/subjects');
const teachersRouter = require('./routes/teachers');
const classroomsRouter = require('./routes/classrooms');

app.use('/subjects', subjectsRouter);
app.use('/teachers', teachersRouter);
app.use('/classrooms', classroomsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const axios = require('axios');
const Subject = require('./models/subject.model');
const Teacher = require('./models/teacher.model');
const Classroom = require('./models/classroom.model');

// The "Middleman" Endpoint
app.post('/generate-timetable', async (req, res) => {
  try {
    // 1. Fetch all data from MongoDB
    const subjects = await Subject.find();
    const teachers = await Teacher.find();
    const classrooms = await Classroom.find();

    // 2. Format the data for the Python service
    const payload = {
      subjects: subjects.map(s => ({ name: s.name, code: s.code })),
      teachers: teachers.map(t => ({ name: t.name })),
      classrooms: classrooms.map(c => ({ name: c.name, capacity: c.capacity })),
    };

    console.log('Sending data to Python solver...');

    // 3. Send the data to the Python solver service
    const pythonResponse = await axios.post('http://127.0.0.1:8000/generate', payload);

    // 4. Send the solver's response back to the frontend
    res.json(pythonResponse.data);

  } catch (error) {
    console.error('Error communicating with Python service:', error.message);
    res.status(500).json({ error: 'Failed to communicate with the solver service.' });
  }
});