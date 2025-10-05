const router = require('express').Router();
let Subject = require('../models/subject.model'); // We import the Subject model we just created

// === GET ALL SUBJECTS ===
// Handles incoming HTTP GET requests on the /subjects/ URL
router.route('/').get((req, res) => {
  Subject.find() // Mongoose method to get all Subjects from the database
    .then(subjects => res.json(subjects)) // Return the subjects in JSON format
    .catch(err => res.status(400).json('Error: ' + err)); // Catch and return any errors
});

// === ADD A NEW SUBJECT ===
// Handles incoming HTTP POST requests on the /subjects/add URL
router.route('/add').post((req, res) => {
  const name = req.body.name; // Get the name from the incoming request body
  const code = req.body.code; // Get the code from the incoming request body

  const newSubject = new Subject({
    name,
    code,
  });

  newSubject.save() // Save the new subject to the database
    .then(() => res.json('Subject added!')) // Return a success message
    .catch(err => res.status(400).json('Error: ' + err)); // Or return an error message
});

module.exports = router; // Export the router