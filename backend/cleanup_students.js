const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Internship = require('./models/Internship');
const Report = require('./models/Report');
const Notification = require('./models/Notification');

dotenv.config();

async function cleanupData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Find Joe (+ any other variations of his name to be safe)
    const joe = await User.findOne({ name: /joe/i, role: 'student' });
    if (!joe) {
      console.log('❌ Error: Student "Joe" not found. Cleanup aborted to protect data.');
      process.exit();
    }
    console.log(`Keeping student: ${joe.name} (${joe._id})`);

    // 2. Identify all other students
    const otherStudents = await User.find({ 
      role: 'student', 
      _id: { $ne: joe._id } 
    });
    const otherIds = otherStudents.map(s => s._id);

    console.log(`Found ${otherIds.length} other students to remove.`);

    if (otherIds.length > 0) {
      // 3. Delete Report records
      const reports = await Report.deleteMany({ student: { $in: otherIds } });
      console.log(`✅ Deleted ${reports.deletedCount} Report records.`);

      // 4. Delete Internship records
      const internships = await Internship.deleteMany({ student: { $in: otherIds } });
      console.log(`✅ Deleted ${internships.deletedCount} Internship records.`);

      // 5. Delete Student profile records
      const profiles = await Student.deleteMany({ user: { $in: otherIds } });
      console.log(`✅ Deleted ${profiles.deletedCount} Student profile records.`);

      // 6. Delete Notification records (where they were sender or recipient)
      const notifications = await Notification.deleteMany({
        $or: [
          { recipient: { $in: otherIds } },
          { sender: { $in: otherIds } }
        ]
      });
      console.log(`✅ Deleted ${notifications.deletedCount} Notification records.`);

      // 7. Finally, delete the User accounts
      const users = await User.deleteMany({ _id: { $in: otherIds } });
      console.log(`✅ Deleted ${users.deletedCount} User accounts.`);
    }

    console.log('\n✨ Cleanup complete! Only Joe\'s data remains.');
    process.exit();
  } catch (err) {
    console.error('CRITICAL ERROR DURING CLEANUP:', err);
    process.exit(1);
  }
}

cleanupData();
