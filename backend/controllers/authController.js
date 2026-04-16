const User = require('../models/User')
const jwt = require('jsonwebtoken')
const Student =require('../models/Student')
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role ,department } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      department
    })

    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    })
  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ message: error.message })
  }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('name email role')
    res.json(mentors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}