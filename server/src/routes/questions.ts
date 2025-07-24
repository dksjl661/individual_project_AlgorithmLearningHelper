import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/init';
import { AuthenticatedRequest } from '../types/database';

const router = express.Router();

// JWT verification middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'] as string;
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

// Get all questions
router.get('/', async (req, res) => {
  try {
    const { difficulty, algorithm_id } = req.query;
    
    let query = 'SELECT * FROM questions';
    const params: any[] = [];
    
    if (difficulty || algorithm_id) {
      query += ' WHERE';
      if (difficulty) {
        query += ' difficulty = ?';
        params.push(difficulty);
      }
      if (algorithm_id) {
        if (difficulty) query += ' AND';
        query += ' algorithm_id = ?';
        params.push(algorithm_id);
      }
    }
    
    query += ' ORDER BY id';
    
    const questions = await db.all(query, params);
    res.json(questions);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get single question details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.get('SELECT * FROM questions WHERE id = ?', [id]);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Submit answer
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, language } = req.body;

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ error: 'Answer cannot be empty' });
    }

    // Get question information
    const question = await db.get('SELECT * FROM questions WHERE id = ?', [id]);
    if (!question) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Simple answer validation (you can implement more complex validation logic here)
    const isCorrect = await validateAnswer(answer, question);
    
    // Save submission
    await db.run(
      'INSERT INTO submissions (user_id, question_id, answer, language, is_correct, submitted_at) VALUES (?, ?, ?, ?, ?, ?)',
      [(req as any).user.id, id, answer, language || 'javascript', isCorrect, new Date().toISOString()]
    );

    res.json({
      isCorrect,
      message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!',
      feedback: isCorrect ? 'Great job! You implemented the algorithm correctly.' : 'Check your implementation and try again.'
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Get wrong answers
router.get('/wrong-answers', authenticateToken, async (req, res) => {
  try {
    const wrongAnswers = await db.all(`
      SELECT 
        wa.id,
        q.title as question_title,
        q.description,
        q.difficulty,
        q.algorithm_name,
        wa.answer as user_answer,
        wa.submitted_at
      FROM submissions wa
      JOIN questions q ON wa.question_id = q.id
      WHERE wa.user_id = ? AND wa.is_correct = 0
      ORDER BY wa.submitted_at DESC
    `, [(req as any).user.id]);

    res.json(wrongAnswers);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Delete wrong answer
router.delete('/wrong-answers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.run(
      'DELETE FROM submissions WHERE id = ? AND user_id = ? AND is_correct = 0',
      [id, (req as any).user.id]
    );

    if ((result as any).changes === 0) {
      return res.status(404).json({ error: 'Wrong answer not found' });
    }

    res.json({ message: 'Wrong answer deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete wrong answer' });
  }
});

// Simple answer validation function
const validateAnswer = async (answer: string, question: any): Promise<boolean> => {
  // This is a simple validation - in a real application, you would:
  // 1. Parse and execute the code safely
  // 2. Run it against test cases
  // 3. Check for correct algorithm implementation
  
  // For now, we'll do a basic check
  const answerLower = answer.toLowerCase();
  
  // Check if the answer contains basic sorting logic
  const hasSortingLogic = answerLower.includes('sort') || 
                         answerLower.includes('for') || 
                         answerLower.includes('while') ||
                         answerLower.includes('if');
  
  // Check if it's not just a placeholder
  const hasImplementation = answerLower.length > 20 && 
                          !answerLower.includes('// implementation here') &&
                          !answerLower.includes('pass');
  
  return hasSortingLogic && hasImplementation;
};

export { router as questionRoutes }; 