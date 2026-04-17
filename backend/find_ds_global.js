const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');

dotenv.config();

async function findDataScienceGlobal() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const internships = await Internship.find({ domain: /data science/i }).populate('student', 'name email');
    console.log('--- ALL DATA SCIENCE INTERNSHIPS ---');
    internships.forEach(i => {
        console.log(`ID: ${i._id}, Student: ${i.student?.name} (${i.student?._id}), Company: ${i.company}`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findDataScienceGlobal();
