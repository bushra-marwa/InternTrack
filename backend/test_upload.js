const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

async function testUpload() {
  try {
    // We will do a local test to see if backend crashes
    console.log("Mocking an upload test...");
    
    // Create a dummy file
    fs.writeFileSync('dummy.pdf', 'dummy content');
    
    // Get a test student user token
    const User = require('./models/User');
    await mongoose.connect(process.env.MONGO_URI);
    const student = await User.findOne({ role: 'student' });
    
    if (!student) {
      console.log("No student found");
      return;
    }
    
    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    const form = new FormData();
    form.append('company', 'Test Co');
    form.append('domain', 'Web');
    form.append('location', 'Remote');
    form.append('duration', '3 months');
    form.append('offerLetter', fs.createReadStream('dummy.pdf'));
    
    console.log("Sending request...");
    
    const res = await axios.post('http://localhost:5000/api/internships', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders()
      }
    });
    
    console.log("SUCCESS:", res.data);
    fs.unlinkSync('dummy.pdf');
    process.exit();
  } catch (err) {
    console.error("FAILED:", err.response ? err.response.data : err.message);
    if(fs.existsSync('dummy.pdf')) fs.unlinkSync('dummy.pdf');
    process.exit(1);
  }
}

testUpload();
