import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, Search, Flag, Clock, Users, Star } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetch('/api/courses/' + courseId)
      .then(res => {
        if (!res.ok) throw new Error('Course not found');
        return res.json();
      })
      .then(data => {
        setCourse(data);
        // Transform lessons from backend data
        const lessonList = data.lessons ? data.lessons.map(l => ({
          id: l.lessonNumber || 0,
          title: l.title || 'Lesson',
          number: l.lessonNumber || 0,
          description: l.description || '',
          completed: l.completed || false,
          locked: l.locked || false
        })) : [];
        setLessons(lessonList);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load course');
        setLoading(false);
      });
  }, [courseId]);

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    navigate('/lesson/' + courseId + '/' + lesson.number);
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigate('/courses')} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page">
        <div className="container mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-6">The course you requested does not exist.</p>
          <button onClick={() => navigate('/courses')} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          </div>
          <p className="text-gray-400 mb-2">{course.description || ''}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Flag className="w-3 h-3" />
            <span>{course.difficulty || 'Beginner'}</span>
            <span className="text-sm separator">|</span>
            <span>{course.totalLessons || 0} lessons</span>
          </div>
        </div>

        {/* Lessons Roadmap */
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {lessons.map((lesson) => (
              <div
                key={lesson.number}
                className="border rounded-md p-2 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => handleLessonSelect(lesson)}
              >
                <span className="font-medium text-sm">{lesson.number}</span>
                <span className="text-xs opacity-70">{lesson.title}</span>
                {lesson.completed && <span className="text-green-400">✓</span>}
                {lesson.locked && <span className="text-red-400">🔒</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Lesson */
        {selectedLesson && (
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-3">{selectedLesson.title}</h3>
            <p className="text-gray-400 text-sm">{selectedLesson.description}</p>
          </div>
        )}

        {!selectedLesson && (
          <div>
            <p className="text-gray-400 mb-4">Select a lesson to begin:</p>
            {lessons.map((lesson) => (
              <div
                key={lesson.number}
                className="border rounded-md p-2 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => handleLessonSelect(lesson)}
              >
                <span className="font-medium text-sm">{lesson.number}</span>
                <span className="text-xs opacity-70">{lesson.title}</span>
                {lesson.completed && <span className="text-green-400">✓</span>}
                {lesson.locked && <span className="text-red-400">🔒</span>}
              </div>
            ))}
          </div>
        )
      </div>
    </div>
  );
}

export default CourseDetail;
