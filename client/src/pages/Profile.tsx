import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProfile(response.data);
        setUsername(response.data.username || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put('/api/users/profile', 
        { username },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setProfile(prev => prev ? { ...prev, username } : null);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Failed to load profile</div>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold neon-text mb-8">Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold neon-text-green">Personal Information</h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="btn-secondary"
                  >
                    {editing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-neon-blue" />
                    <div className="flex-1">
                      <label className="text-sm text-gray-400">Username</label>
                      {editing ? (
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="input-field mt-1"
                        />
                      ) : (
                        <div className="text-gray-200 font-medium">{profile.username || 'Not set'}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-neon-blue" />
                    <div className="flex-1">
                      <label className="text-sm text-gray-400">Email</label>
                      <div className="text-gray-200 font-medium">{profile.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-neon-blue" />
                    <div className="flex-1">
                      <label className="text-sm text-gray-400">Member Since</label>
                      <div className="text-gray-200 font-medium">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {editing && (
                  <div className="mt-6 flex space-x-3">
                    <button onClick={handleUpdateProfile} className="btn-success">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold neon-text-purple mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Questions:</span>
                    <span className="text-neon-green font-bold">{profile.total_questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Correct Answers:</span>
                    <span className="text-neon-blue font-bold">{profile.correct_answers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Accuracy:</span>
                    <span className="text-neon-yellow font-bold">{profile.accuracy.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-xl font-bold neon-text-pink mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary w-full"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/questions')}
                    className="btn-secondary w-full"
                  >
                    Practice Questions
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-danger w-full"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 