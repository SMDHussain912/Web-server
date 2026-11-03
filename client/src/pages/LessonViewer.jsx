import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Code, CheckCircle, Lightbulb, Target, ArrowLeft, ArrowRight } from 'lucide-react';

const LessonViewer = () => {
  const { courseId, lessonNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Fetch lesson from backend using the correct endpoint
    fetch('/api/courses/' + courseId + '/lesson/' + lessonNumber)
      .then(res => {
        if (!res.ok) throw new Error('Lesson not found');
        return res.json();
      })
      .then(data => {
        setLesson(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Lesson not found. It may be locked or not yet available.');
        setLoading(false);
      });
  }, [courseId, lessonNumber]);

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
          <button onClick={() => window.location.href='/courses/' + courseId} className="btn btn-primary">Go Back to Course</button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="page">Lesson content not available</div>;
  }

  // Mark lesson as completed when component mounts (if not already completed)
  useEffect(() => {
    if (!completed) {
      fetch('/api/courses/' + courseId + '/lesson/' + lesson.number + '/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId: lesson.id, courseId: courseId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCompleted(true);
            // Refresh the page to show updated progress after a delay
            setTimeout(() => window.location.reload(), 1500);
          }
        })
      .catch(err => console.error('Error completing lesson:', err));
    }
  }, [courseId, lesson.number, completed]);

  if (completed) {
    return (
      <div className="page">
        <div className="container mx-auto max-w-2xl text-center py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Lesson Completed!</h1>
          <p className="text-gray-400 mb-4">You have completed this lesson.</p>
          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <p className="text-lg text-gray-300">{lesson.title}</p>
            <p className="text-lg text-gray-300">Completed on {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={() => window.location.href='/courses/' + courseId} className="btn btn-primary">Continue to Next Lesson</button>
        </div>
      </div>
    );
  }

  // Get course lesson list for navigation
  useEffect(() => {
    fetch('/api/courses/' + courseId)
      .then(res => res.json())
      .then(data => {
        if (data && data.lessons) {
          const lessonList = data.lessons.map(l => ({
            number: l.lessonNumber,
            title: l.title,
            id: l.lessonNumber
          }));
          // Find current lesson index
          const lessonIndex = lessonList.findIndex(l => l.number === lessonNumber);
          const prevLesson = lessonList[lessonIndex - 1];
          const nextLesson = lessonList[lessonIndex + 1];
          // Store for navigation (could be passed to context or stored in state)
          setLessonLessonList(lessonList);
          setLessonPrevLesson(prevLesson);
          setLessonNextLesson(nextLesson);
        }
      })
      .catch(err => console.error('Error fetching course lesson list:', err));
  }, [courseId]);

  // We need to store the lesson list in state
  const [lessonLessonList, setLessonLessonList] = useState([]);
  const [lessonPrevLesson, setLessonPrevLesson] = useState(null);
  const [lessonNextLesson, setLessonNextLesson] = useState(null);

  // Use the stored values from the fetch above
  // (In a real app, useReactQuery or similar would be better)

  const prevLesson = lessonPrevLesson;
  const nextLesson = lessonNextLesson;

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
          <button onClick={() => window.location.href='/courses/' + courseId} className="btn btn-primary">Go Back to Course</button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="page">Lesson content not available</div>;
  }

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
                }
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
        {lessonNumber && lessonNumber > 1 && (
          <div className="mb-6">
            <button
              onClick={() => navigate('/lesson/' + courseId + '/' + (lessonNumber - 1))}
              className="border rounded-md p-2 hover:bg-slate-700 hover:text-white transition">< ArrowLeft className="w-5 h-5"/></button>
        )
      }
      }
      {lessonNumber < totalLessons && (
        <div className="mb-8">
          <button
            onClick={() => navigate('/lesson/' + courseId + '/' + (lessonNumber + 1))}
            className="button transparent"
            aria-label="Next lesson"
          >
            <ArrowRight className="w-5 h-5"/>
          </button>
        </div>
      )
    }
  );
}

export default LessonViewer;
