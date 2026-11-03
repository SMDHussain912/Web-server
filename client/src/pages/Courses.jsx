import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, Clock, Users, Star } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const categories = ['all', ...new Set(courses.map((c) => c.category).filter(Boolean))];

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">All Courses</h1>
          <p className="text-gray-400 text-lg">
            Explore our collection of programming courses and start learning today.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course._id || course.courseId}
                to={`/course/${course.courseId}`}
                className="card group hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{course.icon || '📚'}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.difficulty === 'beginner'
                        ? 'bg-green-500/20 text-green-400'
                        : course.difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {course.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.totalLessons || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{course.rating || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
