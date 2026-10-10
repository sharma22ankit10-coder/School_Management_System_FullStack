require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7777;

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/school-info', require('./routes/schoolInfo'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/exam-results', require('./routes/examResults'));

// Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ studentCount }]] = await pool.query('SELECT COUNT(*) as studentCount FROM students');
    const [[{ teacherCount }]] = await pool.query('SELECT COUNT(*) as teacherCount FROM teachers');
    const [[{ classCount }]] = await pool.query('SELECT COUNT(*) as classCount FROM classes');
    const [[{ feesCollected }]] = await pool.query('SELECT COALESCE(SUM(paid_amount), 0) as feesCollected FROM fees');
    const [recentNotices] = await pool.query('SELECT n.*, u.name as posted_by_name FROM notices n LEFT JOIN users u ON n.posted_by=u.id ORDER BY n.created_at DESC LIMIT 5');
    const [recentStudents] = await pool.query('SELECT s.*, u.name, u.email FROM students s JOIN users u ON s.user_id=u.id ORDER BY u.id DESC LIMIT 5');
    res.json({
      success: true,
      data: {
        stats: { students: studentCount, teachers: teacherCount, classes: classCount, feesCollected },
        recentNotices,
        recentStudents
      }
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve frontend
const dist = path.join(__dirname, '../frontend/dist');
app.use(express.static(dist));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, () => console.log(`SchoolPulse running on http://localhost:${PORT}`));
