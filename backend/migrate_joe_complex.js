const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function migrateJoeFinal() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Find Users
    const joe = await User.findOne({ name: /joe/i });
    const kiran = await User.findOne({ name: /kiran/i, role: 'mentor' });
    const zack = await User.findOne({ name: /zack/i, role: 'mentor' });

    if (!joe) return console.log('Joe not found');
    if (!kiran) console.log('Kiran not found (will skip kiran assignment)');
    if (!zack) console.log('Zack not found (will skip zack assignment)');

    // 2. Find Internships
    const fullstack = await Internship.findOne({ student: joe._id, domain: /full stack/i, company: /cognizant/i });
    const devops = await Internship.findOne({ student: joe._id, domain: /devops/i, company: /infosys/i });

    if (!fullstack) console.log('Cognizant Full Stack internship not found for Joe');
    if (!devops) console.log('Infosys DevOps internship not found for Joe');

    // 3. Assign Mentors
    if (fullstack && kiran) {
        fullstack.mentor = kiran._id;
        await fullstack.save();
        console.log(`✅ Assigned Kiran to Cognizant Full Stack (${fullstack._id})`);
    }

    if (devops && zack) {
        devops.mentor = zack._id;
        await devops.save();
        console.log(`✅ Assigned Zack to Infosys DevOps (${devops._id})`);
    }

    // 4. Move Reports to Infosys DevOps
    if (devops) {
        const result = await Report.updateMany(
            { student: joe._id }, // For Joe
            { internship: devops._id } // Move ALL to DevOps as per user request "move the 2 submitted reports"
        );
        console.log(`✅ Moved ${result.modifiedCount} reports to Infosys DevOps (${devops._id})`);
    }

    process.exit();
  } catch (err) {
    console.error('FINAL MIGRATION ERROR:', err);
    process.exit(1);
  }
}

migrateJoeFinal();
