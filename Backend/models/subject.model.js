const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // --- ADD THIS NEW FIELD ---
  lectures_per_week: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
  // -------------------------
}, {
  timestamps: true,
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;