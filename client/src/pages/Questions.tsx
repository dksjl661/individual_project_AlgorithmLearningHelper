import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Filter, Search, Target } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  algorithm_name: string;
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    difficulty: '',
    algorithm_id: ''
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params = new URLSearchParams();
        if (filter.difficulty) params.append('difficulty', filter.difficulty);
        if (filter.algorithm_id) params.append('algorithm_id', filter.algorithm_id);
        
        const response = await axios.get(`http://localhost:5000/api/questions?${params.toString()}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'difficulty-easy';
      case 'Medium':
        return 'difficulty-medium';
      case 'Hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-easy';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Questions</h1>
        <p className="text-gray-600">Consolidate algorithm knowledge through practice and improve programming skills</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
              className="input-field"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
            <select
              value={filter.algorithm_id}
              onChange={(e) => setFilter({ ...filter, algorithm_id: e.target.value })}
              className="input-field"
            >
              <option value="">All Algorithms</option>
              <option value="1">Bubble Sort</option>
              <option value="2">Selection Sort</option>
              <option value="3">Insertion Sort</option>
              <option value="4">Shell Sort</option>
              <option value="5">Merge Sort</option>
              <option value="6">Quick Sort</option>
              <option value="7">Heap Sort</option>
              <option value="8">Counting Sort</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilter({ difficulty: '', algorithm_id: '' })}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <Link
            key={question.id}
            to={`/questions/${question.id}`}
            className="card hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-600" />
                </div>
                <span className={`difficulty-badge ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
              {question.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {question.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Algorithm: {question.algorithm_name}
              </span>
              <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
                <span className="text-sm font-medium">Start Practice</span>
                <Target className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions</h3>
          <p className="text-gray-600">No questions found under current filter conditions</p>
        </div>
      )}

      {/* Learning Tips */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Practice Tips
          </h2>
          <p className="text-gray-600">
            Progress step by step by difficulty, start with easy questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Basic Practice</h3>
            <p className="text-sm text-gray-600">
              Start with easy questions to familiarize with basic algorithm concepts
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Challenge</h3>
            <p className="text-sm text-gray-600">
              Try medium difficulty questions to improve algorithmic thinking
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Application</h3>
            <p className="text-sm text-gray-600">
              Challenge hard questions to master the essence of algorithms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions; 