const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for a subject
const subjectSchema = new Schema({
  name: { 
    type: String, 
    required: true, // A subject must have a name
    trim: true      // Removes whitespace from the beginning and end
  },
  code: { 
    type: String, 
    required: true, // A subject must have a code
    unique: true,   // No two subjects can have the same code
    trim: true 
  },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Create the model from the schema
const Subject = mongoose.model('Subject', subjectSchema);

// Export the model so other files can use it
module.exports = Subject;