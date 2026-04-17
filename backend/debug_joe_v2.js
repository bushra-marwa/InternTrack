const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function debugJoe() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const joeUser = await User.findOne({ name: /joe/i });
    if (!joeUser) {
        console.log('User "Joe" not found');
        process.exit();
    }
    console.log(`Joe User Found: ID=${joeUser._id}, Name=${joeUser.name}`);

    const internships = await Internship.find({ student: joeUser._id }).populate('mentor');
    console.log('\n--- Joe\'s Internships ---');
    internships.forEach(i => {
        console.log(`- Company: ${i.company}, Domain: ${i.domain}`);
        console.log(`  ID: ${i._id}`);
        console.log(`  Status: ${i.status}`);
        console.log(`  Mentor: ${i.mentor ? i.mentor.name : 'NONE'}`);
    });

    const reports = await Report.find({ student: joeUser._id }).populate('internship');
    console.log('\n--- Joe\'s Reports ---');
    reports.forEach(r => {
        console.log(`- Title: ${r.title}, Week: ${r.week}`);
        console.log(`  Linked Internship: ${r.internship ? r.internship.domain : 'null'} (${r.internship ? r.internship._id : 'null'})`);
    });

    process.exit();
  } catch (err) {
    console.error('DEBUG ERROR:', err);
    process.exit(1);
  }
}

debugJoe();
