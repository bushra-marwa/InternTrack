const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');

dotenv.config();

async function deleteOrphanedDS() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const targetId = '69da27baba6bf5fc36db3940';

    // Delete reports first
    const reports = await Report.deleteMany({ internship: targetId });
    console.log(`✅ Deleted ${reports.deletedCount} associated reports.`);

    // Delete internship
    const internship = await Internship.findByIdAndDelete(targetId);
    if (internship) {
        console.log(`✅ Deleted orphaned Data Science internship (${targetId}).`);
    } else {
        console.log(`❌ Internship ${targetId} not found.`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

deleteOrphanedDS();
