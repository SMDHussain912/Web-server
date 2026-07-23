import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PenTool, TrendingUp, Award, Clock, Target } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    examsTaken: 0,
    averageScore: 0,
    streak: 0,
    totalScore: 0
  });
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome back! Here's your learning progress.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Lessons Completed</p>
                <p className="text-3xl font-bold text-white">{stats.lessonsCompleted}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <PenTool className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Exams Taken</p>
                <p className="text-3xl font-bold text-white">{stats.examsTaken}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-white">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Learning Streak</p>
                <p className="text-3xl font-bold text-white">{stats.streak} days</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Score</p>
                <p className="text-3xl font-bold text-white">{stats.totalScore}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Target className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Achievements</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/courses" className="card hover:border-blue-500/50 cursor-pointer">
            <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Continue Learning</h3>
            <p className="text-gray-400">Pick up where you left off</p>
          </Link>

          <Link to="/exam" className="card hover:border-green-500/50 cursor-pointer">
            <PenTool className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Take an Exam</h3>
            <p className="text-gray-400">Test your knowledge</p>
          </Link>

          <Link to="/courses" className="card hover:border-purple-500/50 cursor-pointer">
            <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Explore Courses</h3>
            <p className="text-gray-400">Discover new topics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;