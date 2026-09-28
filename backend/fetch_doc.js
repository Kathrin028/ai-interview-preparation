const mongoose = require('mongoose');
const Interview = require('./models/Interview');

mongoose.connect('mongodb://127.0.0.1:27017/interviewdb')
  .then(async () => {
    const doc = await Interview.findById("6a6b12e29a52b533f040c9d4");
    console.log(JSON.stringify(doc, null, 2));
    process.exit(0);
  });
