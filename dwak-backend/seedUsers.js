// seedUsers.js
const mongoose = require('mongoose');
const User = require('./models/user');

const connectDB = require('./db'); // your MongoDB connection file

const seedUsers = async () => {
  await connectDB();

  const users = [
    {
      name: 'Sarah Patient',
      email: 'sarah@dwak.com',
      password: '123456',
      role: 'patient',
    },
    {
      name: 'Amine Patient',
      email: 'amine@dwak.com',
      password: '123456',
      role: 'patient',
    },
    {
      name: 'Dr. Malik',
      email: 'malik@dwak.com',
      password: '123456',
      role: 'doctor',
    },
    {
      name: 'Dr. Rania',
      email: 'rania@dwak.com',
      password: '123456',
      role: 'doctor',
    },
    {
      name: 'Admin Samir',
      email: 'admin@dwak.com',
      password: '123456',
      role: 'admin',
    },
  ];

  try {
    await User.deleteMany(); // Clear existing users (optional)
    await User.insertMany(users);
    console.log('✅ Users inserted');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
