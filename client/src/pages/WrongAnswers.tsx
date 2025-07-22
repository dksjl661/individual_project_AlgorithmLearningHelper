import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Trash2, RefreshCw, BookOpen } from 'lucide-react';

interface WrongAnswer {
  id: number;
  question_title: string;
  description: string;
  difficulty: string;
  algorithm_name: string;
  user_answer: string;
  submitted_at: string;
}

const WrongAnswers: React.FC = () => {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWrongAnswers();
  }, []);

  const fetchWrongAnswers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/questions/wrong-answers');
      setWrongAnswers(response.data);
    } catch (error) {
      console.error('Failed to fetch wrong answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/wrong-answers/${id}`);
      setWrongAnswers(wrongAnswers.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete wrong answer:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wrong Answers</h1>
        <p className="text-gray-600">Review wrong answers, fill gaps, and improve algorithm skills</p>
      </div>

      {wrongAnswers.length > 0 ? (
        <div className="space-y-6">
          {wrongAnswers.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{item.question_title}</h3>
                    <span className={`difficulty-badge ${
                      item.difficulty === 'Easy' ? 'difficulty-easy' :
                      item.difficulty === 'Medium' ? 'difficulty-medium' : 'difficulty-hard'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Algorithm Type</h4>
                      <p className="text-sm text-gray-600">{item.algorithm_name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Submission Time</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(item.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your Answer</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {item.user_answer}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/questions/${item.id}`}
                      className="btn-primary text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice Again
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-secondary text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Wrong Answers</h3>
          <p className="text-gray-600 mb-6">Congratulations! You haven't made any mistakes yet. Keep it up!</p>
          <Link
            to="/questions"
            className="btn-primary inline-flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Practice
          </Link>
        </div>
      )}

      {/* Tips */}
      <div className="mt-12 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Regular Review</h3>
            <p className="text-sm text-gray-600">
              Regularly review wrong answers to strengthen weak areas
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Practice Again</h3>
            <p className="text-sm text-gray-600">
              Retry wrong questions to verify understanding
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Analyze Reasons</h3>
            <p className="text-sm text-gray-600">
              Analyze error reasons to avoid repeating mistakes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrongAnswers; 