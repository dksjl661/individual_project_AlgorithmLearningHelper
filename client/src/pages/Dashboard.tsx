import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart3, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserStats {
  overall: {
    total_questions_attempted: number;
    correct_answers: number;
    unique_questions_attempted: number;
    accuracy: string;
  };
  byAlgorithm: Array<{
    algorithm_name: string;
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

interface RecentActivity {
  submitted_at: string;
  question_title: string;
  difficulty: string;
  algorithm_name: string;
  is_correct: boolean;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users/stats'),
          axios.get('http://localhost:5000/api/users/recent-activity')
        ]);
        
        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const chartData = stats?.byAlgorithm.map(item => ({
    name: item.algorithm_name,
    value: item.attempts,
    accuracy: item.accuracy
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Dashboard</h1>
        <p className="text-gray-600">View your learning progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overall.total_questions_attempted || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overall.correct_answers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overall.accuracy || '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Learning Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overall.unique_questions_attempted || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Algorithm Performance Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Learning Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy by Algorithm</h3>
          <div className="space-y-4">
            {stats?.byAlgorithm.map((algorithm, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {algorithm.algorithm_name}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${algorithm.accuracy}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {algorithm.accuracy.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Link
            to="/wrong-answers"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center"
          >
            View Wrong Answers
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {activity.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{activity.question_title}</p>
                    <p className="text-sm text-gray-600">
                      {activity.algorithm_name} • {activity.difficulty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(activity.submitted_at).toLocaleDateString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.difficulty === 'Easy' ? 'difficulty-easy' :
                    activity.difficulty === 'Medium' ? 'difficulty-medium' : 'difficulty-hard'
                  }`}>
                    {activity.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No learning records yet. Start your first question!</p>
            <Link
              to="/questions"
              className="btn-primary mt-4 inline-flex items-center"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start Practice
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          to="/algorithms"
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Learn Algorithms</h3>
              <p className="text-sm text-gray-600">Deep dive into eight sorting algorithms</p>
            </div>
          </div>
        </Link>

        <Link
          to="/questions"
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Practice Questions</h3>
              <p className="text-sm text-gray-600">Consolidate algorithm knowledge through practice</p>
            </div>
          </div>
        </Link>

        <Link
          to="/wrong-answers"
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Wrong Answers</h3>
              <p className="text-sm text-gray-600">Review wrong answers and fill gaps</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 