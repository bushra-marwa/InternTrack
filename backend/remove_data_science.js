const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function removeDataScience() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Find Joe
    const joe = await User.findOne({ name: /joe/i });
    if (!joe) return console.log('Joe not found');

    // 2. Find and Delete the Data Science Internship for Joe
    const internship = await Internship.findOne({ 
        student: joe._id, 
        domain: /data science/i 
    });

    if (internship) {
        console.log(`Found Data Science internship: ${internship._id}`);
        
        // Delete reports first
        const reports = await Report.deleteMany({ internship: internship._id });
        console.log(`✅ Deleted ${reports.deletedCount} associated reports.`);

        // Delete internship
        await Internship.findByIdAndDelete(internship._id);
        console.log(`✅ Deleted Data Science internship.`);
    } else {
        console.log('❌ Data Science internship not found for Joe.');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

removeDataScience();
