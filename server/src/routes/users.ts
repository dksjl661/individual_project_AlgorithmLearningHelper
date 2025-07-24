import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/init';

const router = express.Router();

// JWT verification middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid access token' });
    }
    req.user = user;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await db.get(
      'SELECT id, email, username, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: any, res: any) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username cannot be empty' });
    }

    const result = await db.run(
      'UPDATE users SET username = ? WHERE id = ?',
      [username.trim(), req.user.id]
    );

    if ((result as any).changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Update failed' });
  }
});

// Get user learning progress
router.get('/progress', authenticateToken, async (req: any, res: any) => {
  try {
    const progress = await db.all(`
      SELECT 
        q.algorithm_name,
        COUNT(s.id) as attempts,
        SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) as correct_answers,
        ROUND(AVG(CASE WHEN s.is_correct THEN 100 ELSE 0 END), 1) as accuracy
      FROM questions q
      LEFT JOIN submissions s ON q.id = s.question_id AND s.user_id = ?
      GROUP BY q.algorithm_name
      ORDER BY q.algorithm_name
    `, [req.user.id]);

    res.json(progress);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req: any, res: any) => {
  try {
    // Overall statistics
    const overallStats = await db.get(`
      SELECT 
        COUNT(DISTINCT s.question_id) as total_questions_attempted,
        SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) as correct_answers,
        COUNT(DISTINCT s.question_id) as unique_questions_attempted,
        ROUND(
          (SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 1
        ) as accuracy
      FROM submissions s
      WHERE s.user_id = ?
    `, [req.user.id]);

    // Statistics by algorithm
    const byAlgorithm = await db.all(`
      SELECT 
        q.algorithm_name,
        COUNT(s.id) as attempts,
        SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) as correct,
        ROUND(
          (SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 1
        ) as accuracy
      FROM questions q
      LEFT JOIN submissions s ON q.id = s.question_id AND s.user_id = ?
      GROUP BY q.algorithm_name
      ORDER BY q.algorithm_name
    `, [req.user.id]);

    res.json({
      overall: overallStats,
      byAlgorithm: byAlgorithm
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get recent activity
router.get('/recent-activity', authenticateToken, async (req: any, res: any) => {
  try {
    const recentActivity = await db.all(`
      SELECT 
        s.submitted_at,
        q.title as question_title,
        q.difficulty,
        q.algorithm_name,
        s.is_correct
      FROM submissions s
      JOIN questions q ON s.question_id = q.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `, [req.user.id]);

    res.json(recentActivity);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

export { router as userRoutes }; 