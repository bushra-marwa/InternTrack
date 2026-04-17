const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function migrateJoeReports() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Find Joe
    const joe = await User.findOne({ name: /joe/i });
    if (!joe) {
        console.log('User Joe not found.');
        process.exit();
    }

    // 2. Find Kiran (Mentor)
    const kiran = await User.findOne({ name: /kiran/i, role: 'mentor' });
    if (!kiran) {
        console.log('Mentor Kiran not found.');
        // We can continue but warn
    } else {
        console.log(`Found Mentor Kiran: ${kiran._id}`);
    }

    // 3. Find Joe's Internships
    const devops = await Internship.findOne({ student: joe._id, domain: /devops/i });
    const fullstack = await Internship.findOne({ student: joe._id, domain: /full stack/i });

    if (!devops) {
        console.log('DevOps internship not found for Joe.');
    }
    if (!fullstack) {
        console.log('Full Stack internship not found for Joe. Please ensure it exists and is approved.');
        // If it doesn't exist, we can't move them.
        process.exit();
    }

    console.log(`Moving reports from DevOps (${devops?._id}) to Full Stack (${fullstack._id})`);

    // 4. Update the reports
    const result = await Report.updateMany(
        { student: joe._id, internship: devops?._id },
        { internship: fullstack._id }
    );

    console.log(`✅ Success! Moved ${result.modifiedCount} reports for Joe to the Full Stack internship.`);

    // 5. Ensure Full Stack has Kiran as mentor
    if (kiran) {
        fullstack.mentor = kiran._id;
        await fullstack.save();
        console.log(`✅ Success! Assigned Kiran as the mentor for the Full Stack internship.`);
    }

    process.exit();
  } catch (err) {
    console.error('MIGRATION ERROR:', err);
    process.exit(1);
  }
}

migrateJoeReports();
