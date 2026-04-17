const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function findJoeTimestamps() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const joe = await User.findOne({ name: /joe/i });
    if (!joe) return console.log('Joe not found');

    const reports = await Report.find({ student: joe._id }).sort('createdAt');
    console.log('--- Joe\'s Reports ---');
    reports.forEach(r => {
        console.log(`- Week: ${r.week}, Title: ${r.title}, CreatedAt: ${r.createdAt.getTime()} (${r.createdAt})`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findJoeTimestamps();
