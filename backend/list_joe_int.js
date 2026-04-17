const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const User = require('./models/User');

dotenv.config();

async function listJoeInternships() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const joe = await User.findOne({ name: /joe/i });
    if (!joe) return console.log('Joe not found');

    const internships = await Internship.find({ student: joe._id });
    console.log(`--- Joe's Internships (${joe._id}) ---`);
    internships.forEach(i => {
        console.log(`ID: ${i._id}, Domain: "${i.domain}", Status: ${i.status}, Company: "${i.company}"`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listJoeInternships();
