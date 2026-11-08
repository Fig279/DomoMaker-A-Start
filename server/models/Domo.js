const mongoose = require('mongoose');
const _ = require('underscore');

// Escape and trim the name so it is safe to store and display.
const setName = (name) => _.escape(name).trim();

// A Domo has a name, an age, an owner (an Account), and a created date.
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Returns only the Domo fields the client needs.
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
