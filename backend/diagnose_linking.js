const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function diagnose() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const joe = await User.findOne({ name: /joe/i });
    if (!joe) return console.log('Joe not found');

    const reports = await Report.find({ student: joe._id }).sort('createdAt');
    const files = fs.readdirSync(path.join(__dirname, 'uploads')).sort();

    console.log('--- JOE REPORTS ---');
    reports.forEach(r => console.log(`Week ${r.week}: ${r.createdAt.getTime()} (${r.createdAt}) - Doc: ${r.documentFile}`));

    console.log('\n--- UPLOAD FILES (RECENT) ---');
    files.filter(f => f.startsWith('17764')).forEach(f => console.log(f));

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

diagnose();
