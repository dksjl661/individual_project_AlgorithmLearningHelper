import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Code, Clock, TrendingUp, ArrowRight, BookOpen } from 'lucide-react';

interface Algorithm {
  id: number;
  name: string;
  description: string;
  complexity_best: string;
  complexity_average: string;
  complexity_worst: string;
  space_complexity: string;
  category: string;
}

const Algorithms: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/algorithms');
        setAlgorithms(response.data);
      } catch (error) {
        console.error('Failed to fetch algorithms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(n²)')) return 'text-red-600';
    if (complexity.includes('O(n log n)')) return 'text-green-600';
    if (complexity.includes('O(n)')) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exchange Sort':
        return 'bg-blue-100 text-blue-800';
      case 'Selection Sort':
        return 'bg-green-100 text-green-800';
      case 'Insertion Sort':
        return 'bg-purple-100 text-purple-800';
      case 'Merge Sort':
        return 'bg-orange-100 text-orange-800';
      case 'Non-comparison Sort':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Eight Sorting Algorithms
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Systematically learn classic sorting algorithms, from basic concepts to advanced implementations, master the essence of algorithms
        </p>
      </div>

      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {algorithms.map((algorithm) => (
          <Link
            key={algorithm.id}
            to={`/algorithms/${algorithm.id}`}
            className="algorithm-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                  <Code className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {algorithm.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(algorithm.category)}`}>
                    {algorithm.category}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {algorithm.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Best Case:</span>
                <span className={`font-mono ${getComplexityColor(algorithm.complexity_best)}`}>
                  {algorithm.complexity_best}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Average Case:</span>
                <span className={`font-mono ${getComplexityColor(algorithm.complexity_average)}`}>
                  {algorithm.complexity_average}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Worst Case:</span>
                <span className={`font-mono ${getComplexityColor(algorithm.complexity_worst)}`}>
                  {algorithm.complexity_worst}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Space Complexity:</span>
                <span className="font-mono text-gray-600">
                  {algorithm.space_complexity}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Learning Progress</span>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">0%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Learning Tips */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Learning Tips
          </h2>
          <p className="text-gray-600">
            Follow the recommended order to learn sorting algorithms step by step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Basic Algorithms</h3>
            <p className="text-sm text-gray-600">
              Start with bubble, selection, and insertion sort to understand basic sorting concepts
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Algorithms</h3>
            <p className="text-sm text-gray-600">
              Learn shell, merge, and quick sort to master divide-and-conquer thinking
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Algorithms</h3>
            <p className="text-sm text-gray-600">
              Master heap sort and counting sort to understand special data structures
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <Link
          to="/questions"
          className="btn-primary text-lg px-8 py-3 inline-flex items-center"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Start Practice Questions
        </Link>
      </div>
    </div>
  );
};

export default Algorithms; 