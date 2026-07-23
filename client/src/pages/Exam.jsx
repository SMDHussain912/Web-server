import React, { useState } from 'react';
import { PenTool, CheckCircle, XCircle } from 'lucide-react';

const Exam = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/lessons/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, numQuestions: 10 }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const submitQuiz = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTopic('');
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Generating quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="page">
        <div className="container mx-auto max-w-2xl">
          <div className="card">
            <div className="text-center mb-8">
              <PenTool className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">Practice Exam</h1>
              <p className="text-gray-400 text-lg">
                Enter a topic and AI will generate a quiz to test your knowledge
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="input"
                  placeholder="e.g., Java Variables, Python Functions, React Hooks"
                  onKeyPress={(e) => e.key === 'Enter' && generateQuiz()}
                />
              </div>

              <button
                onClick={generateQuiz}
                className="btn btn-primary w-full"
                disabled={!topic.trim()}
              >
                Generate Quiz
              </button>
            </div>

            <div className="mt-8 bg-slate-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">💡 Tips:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Be specific with topics for better questions</li>
                <li>• Quiz contains 10 multiple-choice questions</li>
                <li>• Review explanations after submission</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="page">
        <div className="container mx-auto max-w-2xl">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">{percentage >= 70 ? '🎉' : '📚'}</div>
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
            <p className="text-gray-400 text-lg mb-8">
              You scored {score} out of {quiz.questions.length}
            </p>

            <div className="text-6xl font-bold text-blue-400 mb-8">
              {percentage}%
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mb-8">
              <p className="text-white text-lg">
                {percentage >= 70 ? 'Great job! Keep up the good work!' : 'Keep practicing! You\'ll improve!'}
              </p>
            </div>

            <button onClick={resetQuiz} className="btn btn-primary">
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quiz: {topic}</h1>
          <p className="text-gray-400">{quiz.questions.length} questions</p>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="card">
              <h3 className="text-xl font-semibold text-white mb-4">
                {qIndex + 1}. {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  const isCorrect = oIndex === question.correctAnswer;

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleAnswerSelect(qIndex, oIndex)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500' : 'border-slate-600'
                        }`}>
                          {isSelected && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <span className="text-gray-200">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={submitQuiz}
            className="btn btn-primary w-full"
            disabled={Object.keys(answers).length !== quiz.questions.length}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exam;