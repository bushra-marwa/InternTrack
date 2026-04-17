const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function linkPastDocs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const reports = await Report.find({ documentFile: { $exists: false } }).sort('createdAt');
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);

    console.log(`Analyzing ${reports.length} reports with missing document links...`);

    for (const report of reports) {
      if (report.documentFile) continue; // Already has one

      const reportTime = report.createdAt.getTime();
      
      // Find files created within 5 minutes of the report
      const matches = files.filter(f => {
          const timestampPart = f.split('.')[0];
          if (isNaN(timestampPart)) return false;
          const fileTime = parseInt(timestampPart);
          return Math.abs(fileTime - reportTime) < 300000; // 5 minutes tolerance
      }).sort((a, b) => {
          // Sort by proximity
          const timeA = Math.abs(parseInt(a.split('.')[0]) - reportTime);
          const timeB = Math.abs(parseInt(b.split('.')[0]) - reportTime);
          return timeA - timeB;
      });

      if (matches.length > 0) {
        const bestMatch = matches[0];
        report.documentFile = bestMatch;
        await report.save();
        console.log(`✅ Linked Week ${report.week} report to file: ${bestMatch}`);
      } else {
        console.log(`❌ Could not find a matching file for Week ${report.week} (Time: ${reportTime})`);
      }
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

linkPastDocs();
