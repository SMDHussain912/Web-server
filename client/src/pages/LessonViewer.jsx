import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Code, CheckCircle, Lightbulb, Target } from 'lucide-react';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (lessonId === 'generate') {
      setLoading(false);
    } else {
      // Load existing lesson
      setLoading(false);
    }
  }, [lessonId]);

  const generateLesson = async () => {
    const topic = prompt('Enter the topic you want to learn:');
    if (!topic) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, difficulty: 'beginner' }),
      });

      if (response.ok) {
        const data = await response.json();
        setLesson(data.lesson);
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (lessonId === 'generate' || !lesson) {
    return (
      <div className="page">
        <div className="container mx-auto max-w-4xl">
          <div className="card text-center py-16">
            <BookOpen className="w-20 h-20 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">AI Lesson Generator</h1>
            <p className="text-gray-400 text-lg mb-8">
              Enter any programming topic and AI will generate a comprehensive lesson for you
            </p>
            
            <div className="bg-slate-800 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-white font-semibold mb-4">Example topics:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• "Java Arrays and Loops"</li>
                <li>• "Python Functions and Classes"</li>
                <li>• "JavaScript Async/Await"</li>
                <li>• "React Hooks Explained"</li>
                <li>• "Database Normalization"</li>
              </ul>
            </div>

            <button 
              onClick={generateLesson} 
              className="btn btn-primary text-lg px-8 py-4"
              disabled={generating}
            >
              {generating ? 'Generating Lesson...' : 'Generate AI Lesson'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{lesson.title}</h1>
          <p className="text-gray-400 text-lg">{lesson.description}</p>
        </div>

        {/* Objectives */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {lesson.objectives?.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {lesson.content?.map((block, idx) => (
            <div key={idx} className="card">
              {block.type === 'text' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {block.content}
                  </p>
                </div>
              )}

              {block.type === 'code' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold">Code Example</h3>
                  </div>
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{block.code}</code>
                  </pre>
                  {block.explanation && (
                    <div className="mt-3 flex items-start gap-2 text-gray-400">
                      <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p>{block.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {block.type === 'example' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{block.title}</h3>
                  <p className="text-gray-400 mb-4">{block.description}</p>
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{block.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Points */}
        {lesson.keyPoints && (
          <div className="card mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Key Points</h2>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practice Exercise */}
        {lesson.practiceExercise && (
          <div className="card mt-6 border-2 border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-400" />
              Practice Exercise
            </h2>
            <p className="text-gray-300 mb-4">{lesson.practiceExercise.description}</p>
            <div className="bg-slate-800 p-4 rounded-lg mb-4">
              <p className="text-white font-semibold mb-2">Task:</p>
              <p className="text-gray-300">{lesson.practiceExercise.task}</p>
            </div>
            {lesson.practiceExercise.hint && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-4">
                <p className="text-yellow-400 font-semibold mb-1">💡 Hint:</p>
                <p className="text-gray-300">{lesson.practiceExercise.hint}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonViewer;