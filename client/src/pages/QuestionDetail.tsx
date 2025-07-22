import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Code, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const QuestionDetail: React.FC = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/${id}`);
        setQuestion(response.data);
      } catch (error) {
        console.error('Failed to fetch question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/questions/${id}/submit`, {
        answer: answer,
        language: 'javascript'
      });
      setResult(response.data);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h2>
          <p className="text-gray-600">Please check if the URL is correct</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Question List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question Details */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
              <span className={`difficulty-badge ${question.difficulty === 'Easy' ? 'difficulty-easy' : question.difficulty === 'Medium' ? 'difficulty-medium' : 'difficulty-hard'}`}>
                {question.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{question.description}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Algorithm: {question.algorithm_name}</span>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700">
                {question.test_cases}
              </pre>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Code Editor</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Programming Language
              </label>
              <select className="input-field">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="csharp">C#</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write Your Code
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input-field h-64 font-mono text-sm"
                placeholder="Write your sorting algorithm code here..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Code className="w-4 h-4 mr-2" />
                  Submit Answer
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Result</h2>
              
              <div className={`p-4 rounded-lg ${
                result.isCorrect 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    result.isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  result.isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.feedback}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Solution Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Understand Requirements</h3>
              <p className="text-sm text-gray-600">Carefully read the question description and clarify input/output format</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Choose Appropriate Algorithm</h3>
              <p className="text-sm text-gray-600">Select the most suitable sorting algorithm based on data size and characteristics</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Test Your Code</h3>
              <p className="text-sm text-gray-600">Use the provided test cases to verify code correctness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail; 