const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function emergencyFix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const joe = await User.findOne({ name: /joe/i });
    if (!joe) return console.log('Joe not found');

    const result = await Report.updateMany(
      { student: joe._id, documentFile: { $exists: false } },
      { documentFile: '1776448788100.png' }
    );

    const result2 = await Report.updateMany(
        { student: joe._id, documentFile: null },
        { documentFile: '1776448788100.png' }
      );

    console.log(`✅ Success! Updated ${result.modifiedCount + result2.modifiedCount} reports for Joe with the placeholder image.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

emergencyFix();
