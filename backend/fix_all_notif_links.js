const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification');

dotenv.config();

async function fixAllLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Report Submitted (Mentor) -> goes to /reports (Which resolves to StudentReports for mentor)
    await Notification.updateMany(
      { type: 'report_submitted' },
      { $set: { link: '/reports' } }
    );

    // 2. Report Evaluated (Student) -> goes to /my-reports
    await Notification.updateMany(
      { type: 'report_evaluated' },
      { $set: { link: '/my-reports' } }
    );

    // 3. Internship Request (Admin) -> goes to /internship-requests
    await Notification.updateMany(
      { type: 'internship_request' },
      { $set: { link: '/internship-requests' } }
    );

    // 4. Final Submission (Mentor) -> goes to /final-evaluations
    await Notification.updateMany(
      { type: 'final_submission' },
      { $set: { link: '/final-evaluations' } }
    );

    // 5. Final Evaluated (Student) -> goes to /final-submission
    await Notification.updateMany(
      { type: 'final_evaluated' },
      { $set: { link: '/final-submission' } }
    );

    console.log('✅ ALL notification links force-updated successfully to match exact frontend router paths.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAllLinks();
