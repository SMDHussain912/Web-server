import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Code, CheckCircle, Lightbulb, Target, ArrowLeft, ArrowRight } from 'lucide-react';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch lesson from backend
    if (lessonId && lessonId !== 'generate') {
      // Try to fetch from the course lessons API
      fetch('/api/lessons/' + lessonId)
        .then(res => {
          if (!res.ok) throw new Error('Lesson not found');
          return res.json();
        })
        .then(data => {
          setLesson(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching lesson:', err);
          setError('Lesson not found. It may be locked or not yet available.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner w-16 h-16 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container mx-auto max-w-md text-center py-8">
          <h1 className="text-3xl font-bold text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigate('/courses')} className="btn btn-primary">Go Back to Courses</button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="page">Lesson content not available</div>;
  }

  // Navigate based on lesson number
  const lessonNumber = lesson.number || 1;
  const allLessons = lesson.courseLessons || [];
  const totalLessons = allLessons.length;
  const lessonIndex = allLessons.findIndex(l => l.number === lessonNumber);
  const prevLesson = allLessons[lessonIndex - 1];
  const nextLesson = allLessons[lessonIndex + 1];

  const handleLessonComplete = () => {
    // Mark lesson as completed
    fetch('/api/lessons/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lessonId: lesson.id, courseId: lesson.courseId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('Lesson completed!');
          // Refresh the page to show updated progress
          setTimeout(() => window.location.reload(), 1500);
        }
      })
      .catch(err => console.error('Error completing lesson:', err));
  };

  return (
    <div className="page">
      <div className="max-w-3xl mx-auto p-6">
        {/* Lesson Header */
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-gray-400 text-lg">{lesson.description}</p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4"/> {lesson.duration || '30 min'}
            <span className="opacity-70">{lesson.topic || ''}</span>
          </div>
        </div>

        {/* Lesson Content */
        <div className="prose prose-invert max-w-none my-8">
          {lesson.content?.map((block, idx) => (
            <div key={idx} className="mb-6">
              {block.type === 'text' && (
                <p className="leading-relaxed text-lg text-white/80">{block.content}</p>
              )
              }
              {block.type === 'code' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-medium text-white">Code Example</h3>
                  </div>
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto"><code className="text-sm">{block.code}</code></pre>
                  {block.explanation && (
                    <div className="mt-3 flex items-start gap-2 text-gray-400">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <p>{block.explanation}</p>
                    </div>
                  )
                </div>
              )
              {block.type === 'example' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">{block.title}</h3>
                  <p className="text-gray-400 mb-4">{block.description}</p>
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto"><code className="text-sm">{block.code}</code></pre>
                </div>
              )
            }
          ))}
        </div>

        {/* Key Points */
        {lesson.keyPoints && lesson.keyPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Key Points</h3>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0"/>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )

        {/* Practice Exercise */
        {lesson.practiceExercise && (
          <div className="border-l-4 border-blue-500/30 p-6 my-6">
            <h3 className="text-lg font-bold text-white mb-4">Practice Exercise</h3>
            <p className="text-gray-400 mb-4">{lesson.practiceExercise.description}</p>
            <p className="text-gray-400 mb-2"><strong>Task:</strong> {lesson.practiceExercise.task}</p>
            {lesson.practiceExercise.hint && (
              <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                <p className="text-gray-400 mb-1">💡 Hint:</p>
                <p className="text-gray-400">{lesson.practiceExercise.hint}</p>
              </div>
            )
          </div>
        )
        }

        {/* Lesson Navigation */
        {totalLessons > 1 && (
          <div className="mt-8 flex justify-between">
            {prevLesson && (
              <button
                onClick={() => navigate('/lesson/' + prevLesson.number)}
                className="button transparent"
                aria-label="Previous lesson"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )
            : null
          }
          {nextLesson && (
            <button
              onClick={() => navigate('/lesson/' + nextLesson.number)}
              className="button transparent"
              aria-label="Next lesson"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )
        }
      </div>
    </div>
  );
}

export default LessonViewer;
