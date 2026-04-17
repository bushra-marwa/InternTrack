const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Student = require('./models/Student');
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
    console.log(`Joe User Found: ID=${joeUser._id}, Email=${joeUser.email}`);

    const studentRecord = await Student.findOne({ user: joeUser._id }).populate('mentor');
    console.log(`Student Record: ${studentRecord ? 'Exists' : 'MISSING'}`);
    if (studentRecord) {
        console.log(`- Current Mentor: ${studentRecord.mentor ? studentRecord.mentor.name : 'NONE'}`);
        console.log(`- Status: ${studentRecord.status}`);
        console.log(`- Domain: ${studentRecord.internshipDomain}`);
    }

    const internships = await Internship.find({ student: joeUser._id }).populate('mentor');
    console.log('\n--- Joe\'s Internships ---');
    internships.forEach(i => {
        console.log(`- Company: ${i.company}`);
        console.log(`  ID: ${i._id}`);
        console.log(`  Status: ${i.status}`);
        console.log(`  Mentor: ${i.mentor ? i.mentor.name : 'NONE'}`);
    });

    process.exit();
  } catch (err) {
    console.error('DEBUG ERROR:', err);
    process.exit(1);
  }
}

debugJoe();
