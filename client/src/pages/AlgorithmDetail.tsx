import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Code, BarChart3, Play } from 'lucide-react';
import BubbleSortVisualizer from '../components/visualization/BubbleSortVisualizer';
import SelectionSortVisualizer from '../components/visualization/SelectionSortVisualizer';
import InsertionSortVisualizer from '../components/visualization/InsertionSortVisualizer';
import ShellSortVisualizer from '../components/visualization/ShellSortVisualizer';
import MergeSortVisualizer from '../components/visualization/MergeSortVisualizer';
import QuickSortVisualizer from '../components/visualization/QuickSortVisualizer';
import HeapSortVisualizer from '../components/visualization/HeapSortVisualizer';
import CountingSortVisualizer from '../components/visualization/CountingSortVisualizer';

interface Algorithm {
  id: number;
  name: string;
  description: string;
  best_time: string;
  average_time: string;
  worst_time: string;
  space_complexity: string;
  stability: string;
  in_place: string;
  use_cases: string;
}

const AlgorithmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlgorithm = async () => {
      try {
        const response = await axios.get(`/api/algorithms/${id}`);
        setAlgorithm(response.data);
      } catch (err) {
        setError('Failed to fetch algorithm details');
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithm();
  }, [id]);

  const getVisualizerComponent = (algorithmName: string) => {
    switch (algorithmName.toLowerCase()) {
      case 'bubble sort':
        return <BubbleSortVisualizer />;
      case 'selection sort':
        return <SelectionSortVisualizer />;
      case 'insertion sort':
        return <InsertionSortVisualizer />;
      case 'shell sort':
        return <ShellSortVisualizer />;
      case 'merge sort':
        return <MergeSortVisualizer />;
      case 'quick sort':
        return <QuickSortVisualizer />;
      case 'heap sort':
        return <HeapSortVisualizer />;
      case 'counting sort':
        return <CountingSortVisualizer />;
      default:
        return <div className="text-center text-gray-400">Visualization component in development...</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error || !algorithm) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Algorithm not found'}</div>
          <Link to="/algorithms" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Algorithms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/algorithms" className="inline-flex items-center text-neon-blue hover:text-neon-cyan mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Algorithms
          </Link>
          <h1 className="text-4xl font-bold neon-text mb-4">{algorithm.name}</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{algorithm.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Algorithm Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Complexity Card */}
            <div className="card p-6">
              <h3 className="text-xl font-bold neon-text-green mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Time Complexity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Best Case:</span>
                  <span className="text-neon-green font-mono">{algorithm.best_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Average Case:</span>
                  <span className="text-neon-yellow font-mono">{algorithm.average_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Worst Case:</span>
                  <span className="text-neon-pink font-mono">{algorithm.worst_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Space Complexity:</span>
                  <span className="text-neon-blue font-mono">{algorithm.space_complexity}</span>
                </div>
              </div>
            </div>

            {/* Characteristics Card */}
            <div className="card p-6">
              <h3 className="text-xl font-bold neon-text-purple mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Characteristics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Stability:</span>
                  <span className={`font-semibold ${algorithm.stability === 'Yes' ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {algorithm.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">In-Place:</span>
                  <span className={`font-semibold ${algorithm.in_place === 'Yes' ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {algorithm.in_place}
                  </span>
                </div>
              </div>
            </div>

            {/* Use Cases Card */}
            <div className="card p-6">
              <h3 className="text-xl font-bold neon-text-pink mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Use Cases
              </h3>
              <p className="text-gray-300 leading-relaxed">{algorithm.use_cases}</p>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-xl font-bold neon-text mb-6 text-center">
                Interactive Visualization
              </h3>
              {getVisualizerComponent(algorithm.name)}
            </div>
          </div>
        </div>

        {/* Code Examples Section */}
        <div className="mt-12">
          <div className="card p-6">
            <h3 className="text-2xl font-bold neon-text mb-6 text-center">Code Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="code-block">
                <h4 className="text-lg font-bold text-neon-green mb-3">Python</h4>
                <pre className="text-sm text-gray-300">
                  <code>
{`def ${algorithm.name.toLowerCase().replace(' ', '_')}(arr):
    # Implementation here
    pass`}
                  </code>
                </pre>
              </div>
              <div className="code-block">
                <h4 className="text-lg font-bold text-neon-blue mb-3">JavaScript</h4>
                <pre className="text-sm text-gray-300">
                  <code>
{`function ${algorithm.name.toLowerCase().replace(' ', '')}(arr) {
    // Implementation here
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Questions Link */}
        <div className="mt-8 text-center">
          <Link 
            to={`/questions?algorithm=${algorithm.id}`}
            className="btn-primary text-lg px-8 py-3"
          >
            Practice Questions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetail; 