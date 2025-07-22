import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  BookOpen, 
  BarChart3, 
  Users, 
  Zap, 
  Target,
  ArrowRight,
  Play,
  CheckCircle,
  Star
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Code,
      title: 'Eight Sorting Algorithms',
      description: 'Systematically learn bubble, selection, insertion, shell, merge, quick, heap, and counting sort algorithms',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Difficulty-based Practice',
      description: 'Three difficulty levels: easy, medium, and hard, progressively improving algorithm skills',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Target,
      title: 'Wrong Answer Book',
      description: 'Automatically save wrong questions for easy review and gap filling',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Multi-language Support',
      description: 'Support for C, C++, Python, Java, JavaScript, TypeScript, C# and other programming languages',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Learning Progress Tracking',
      description: 'Real-time statistics on learning progress and accuracy rate, visualizing learning achievements',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Email Verification Login',
      description: 'Secure and reliable email registration verification system to protect user privacy',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const algorithms = [
    { name: 'Bubble Sort', complexity: 'O(n²)', category: 'Exchange Sort' },
    { name: 'Selection Sort', complexity: 'O(n²)', category: 'Selection Sort' },
    { name: 'Insertion Sort', complexity: 'O(n²)', category: 'Insertion Sort' },
    { name: 'Shell Sort', complexity: 'O(n^1.3)', category: 'Insertion Sort' },
    { name: 'Merge Sort', complexity: 'O(n log n)', category: 'Merge Sort' },
    { name: 'Quick Sort', complexity: 'O(n log n)', category: 'Exchange Sort' },
    { name: 'Heap Sort', complexity: 'O(n log n)', category: 'Selection Sort' },
    { name: 'Counting Sort', complexity: 'O(n+k)', category: 'Non-comparison Sort' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Master Sorting Algorithms
              <span className="block text-yellow-300">Start Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Through interactive learning and practice, deeply understand the principles and implementation of eight classic sorting algorithms
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                  >
                    Free Registration
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
                  >
                    Login Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-4 h-4 bg-yellow-300 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-6 h-6 bg-pink-300 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
          <div className="w-3 h-3 bg-green-300 rounded-full opacity-60"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional algorithm learning platform that makes complex sorting algorithms simple and easy to understand
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="tech-card group">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Algorithms Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eight Sorting Algorithms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From basic to advanced, systematically master all classic sorting algorithms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.map((algorithm, index) => (
              <div key={index} className="algorithm-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{algorithm.name}</h3>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                    {algorithm.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Time Complexity: <span className="font-mono text-primary-600">{algorithm.complexity}</span>
                </p>
                <div className="flex items-center text-yellow-500">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {user && (
            <div className="text-center mt-12">
              <Link
                to="/algorithms"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Start Learning Algorithms
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your algorithm learning journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of learners and master the essence of sorting algorithms together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/questions"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Practice
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Register Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 