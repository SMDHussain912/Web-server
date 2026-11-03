import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, PenTool, TrendingUp, Award, Clock, Target, User, Mail } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => {
        setStats(data);
        return fetch('/api/achievements');
      })
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(() => setAchievements([]));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    finally {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6"><div className="spinner"></div></div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6"><p className="text-gray-400">Please log in to view your dashboard.</p></div>;
  }

  const totalLessons = stats?.lessonsCompleted || 0;
  const totalExams = stats?.examsTaken || 0;
  const avgScore = stats?.averageScore || 0;
  const streak = stats?.streak || 0;
  const totalScore = stats?.totalScore || 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/30 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button size="sm" onClick="window.location.href='/dashboard'">Home</Button>
            {user?.name && (
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs">{user.name?.charAt(0)}</span>
                <span className="text-sm text-slate-300">{user.name || 'User'}</span>
              </div>
            )
            }
            <Button size="sm" onClick="logout()">Logout</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardIcon>
                <BookOpen className="w-5 h-5 text-blue-400" />
              </CardIcon>
              <h3 className="text-xs font-medium text-slate-400">Lessons Completed</h3>
            </CardHeader>
            <CardBody>
              <StatNumber>{totalLessons}</StatNumber>
              <p className="text-xs text-slate-400">Lessons</p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardIcon>
                <PenTool className="w-5 h-5 text-green-400" />
              </CardIcon>
              <h3 className="text-xs font-medium text-slate-400">Exams Taken</h3>
            </CardHeader>
            <CardBody>
              <StatNumber>{totalExams}</StatNumber>
              <p className="text-xs text-slate-400">Exams</p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardIcon>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </CardHeader>
              <CardBody>
                <StatNumber>{avgScore}%</StatNumber>
                <p className="text-xs text-slate-400">Average</p>
              </CardBody>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardIcon>
                <Clock className="w-5 h-5 text-orange-400" />
              </CardHeader>
              <CardBody>
                <StatNumber>{streak}</StatNumber>
                <p className="text-xs text-slate-400">days</p>
              </CardBody>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardIcon>
                <Star className="w-5 h-5 text-yellow-400" />
              </CardHeader>
              <CardBody>
                <StatNumber>{totalScore}</StatNumber>
                <p className="text-xs text-slate-400">points</p>
              </CardBody>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div key={achievement.id} className="card p-4 text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-medium text-white">{achievement.title}</h3>
                <p className="text-sm text-slate-300">{achievement.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No Achievements Yet</h3>
              <p className="text-sm text-slate-400">Earn badges by completing lessons and exams.</p>
            </div>
          )
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link to="/courses" className="ActionCard">
            <ActionIcon>
              <BookOpen className="w-5 h-5 text-blue-400" />
            </ActionIcon>
            <h3 className="text-sm font-medium text-white mb-1">Continue Learning</h3>
            <p className="text-xs text-slate-300">Pick up where you left off</p>
          </Link>
          <Link to="/exam" className="ActionCard">
            <ActionIcon>
              <PenTool className="w-5 h-5 text-green-400" />
            </ActionIcon>
            <h3 className="text-sm font-medium text-white mb-1">Take an Exam</h3>
            <p className="text-xs text-slate-300">Test your knowledge</p>
          </Link>
          <Link to="/achievements" className="ActionCard">
            <ActionIcon>
              <Star className="w-5 h-5 text-yellow-400" />
            </ActionIcon>
            <h3 className="text-sm font-medium text-white mb-1">Achievements</h3>
            <p className="text-xs text-slate-300">View earned badges</p>
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-white">Recent Activity</h2>
          {/* Activity items would go here if supported by backend */}
        </div>
      </main>
    </div>
  );
}

function logout() {
  fetch('/logout').then(() => window.location.href='/login');
}

function Card({ children }) {
  return <div className="card p-6">{children}</div>;
}

function CardHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

function CardBody({ children }) {
  return <div className="pb-4">{children}</div>;
}

function StatNumber({ children }) {
  return <p className="text-3xl font-bold text-white">{children}</p>;
}

function ActionIcon({ children }) {
  return <div className="w-5 h-5">{children}</div>;
}

function ActionCard({ children }) {
  return <div className="card hover:border-blue-500/50 p-4 cursor-pointer transition">{children}</div>;
}
