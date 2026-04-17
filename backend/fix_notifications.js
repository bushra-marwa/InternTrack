const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification');

dotenv.config();

async function fixNotificationLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Fix paths created with old links before the backend was updated

    // Fix Mentor links
    const mentorRes = await Notification.updateMany(
      { link: '/mentor/evaluations' },
      { $set: { link: '/final-evaluations' } }
    );
    console.log(`✅ Fixed ${mentorRes.modifiedCount} mentor notification links.`);

    // Fix Student links
    const studentRes = await Notification.updateMany(
      { link: '/student/final-submission' },
      { $set: { link: '/final-submission' } }
    );
    console.log(`✅ Fixed ${studentRes.modifiedCount} student notification links.`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixNotificationLinks();
