import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, Award, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    examsTaken: 0,
    averageScore: 0,
    streak: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="page">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Info */}
          <div className="card md:col-span-1">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{user?.name || 'User'}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'No email'}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="card text-center">
                <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.lessonsCompleted}</p>
                <p className="text-gray-400 text-sm">Lessons</p>
              </div>

              <div className="card text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.examsTaken}</p>
                <p className="text-gray-400 text-sm">Exams</p>
              </div>

              <div className="card text-center">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.averageScore}%</p>
                <p className="text-gray-400 text-sm">Avg Score</p>
              </div>

              <div className="card text-center">
                <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.streak}🔥</p>
                <p className="text-gray-400 text-sm">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;