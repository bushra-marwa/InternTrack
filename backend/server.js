const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',        require('./routes/authRoutes'))
app.use('/api/tasks',       require('./routes/taskRoutes'))
app.use('/api/evaluations', require('./routes/evaluationRoutes'))
app.use('/api/reports',     require('./routes/reportRoutes'))
app.use('/api/students',    require('./routes/studentRoutes'))
app.use('/api/internships', require('./routes/internshipRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
  res.send('🎓 Internship API Running')
})

app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})