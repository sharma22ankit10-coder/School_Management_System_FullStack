require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function createAdmin() {
  const email = process.argv[2] || 'admin@school.com';
  const password = process.argv[3] || 'Admin@123';
  const name = process.argv[4] || 'Admin';

  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, hash, 'admin']);
    console.log('Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Login at: http://localhost:7777');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

createAdmin();
