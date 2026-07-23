const config = require('../config/config');

class LessonService {
    async generateLesson(topic, difficulty = 'beginner') {
        try {
            const prompt = `
Generate a comprehensive programming lesson on "${topic}" for ${difficulty} level students.

Return the lesson in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
    "title": "Lesson title here",
    "description": "Brief description of what will be learned",
    "objectives": ["Objective 1", "Objective 2", "Objective 3"],
    "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
    "content": [
        {
            "type": "text",
            "content": "Explanation text here"
        },
        {
            "type": "code",
            "language": "java",
            "code": "code example here",
            "explanation": "What this code does"
        },
        {
            "type": "example",
            "title": "Example title",
            "description": "Example description",
            "code": "example code"
        }
    ],
    "summary": "Lesson summary",
    "keyPoints": ["Key point 1", "Key point 2"],
    "practiceExercise": {
        "description": "Exercise description",
        "task": "What student should do",
        "hint": "Helpful hint",
        "solution": "Solution code"
    }
}

Make it engaging, practical, and easy to understand. Include at least 3 code examples.
`;

            const response = await fetch(config.ai.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.ai.apiKey}`
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            if (!data.choices || !data.choices[0]) {
                throw new Error('Invalid AI response');
            }

            const content = data.choices[0].message.content;
            
            // Parse JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const lesson = JSON.parse(jsonMatch[0]);
            return lesson;

        } catch (error) {
            console.error('Error generating lesson:', error);
            throw error;
        }
    }

    async generateCourseSyllabus(courseName, totalLessons = 10) {
        try {
            const prompt = `
Generate a course syllabus for "${courseName}" with ${totalLessons} lessons.

Return in this EXACT JSON format (pure JSON, no markdown):
{
    "courseName": "${courseName}",
    "description": "Course description",
    "difficulty": "beginner|intermediate|advanced",
    "duration": "Estimated duration",
    "lessons": [
        {
            "lessonNumber": 1,
            "title": "Lesson title",
            "topic": "Specific topic",
            "description": "What this lesson covers",
            "duration": "30 mins"
        }
    ]
}

Make it progressive - each lesson builds on previous ones.
`;

            const response = await fetch(config.ai.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.ai.apiKey}`
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            if (!data.choices || !data.choices[0]) {
                throw new Error('Invalid AI response');
            }

            const content = data.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            return JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error('Error generating syllabus:', error);
            throw error;
        }
    }

    async generateQuiz(topic, numQuestions = 10) {
        try {
            const prompt = `
Generate ${numQuestions} multiple-choice quiz questions on "${topic}".

Return in this EXACT JSON format (pure JSON, no markdown):
{
    "questions": [
        {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Why this is correct"
        }
    ]
}

Make questions practical and test understanding, not just memorization.
`;

            const response = await fetch(config.ai.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.ai.apiKey}`
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            if (!data.choices || !data.choices[0]) {
                throw new Error('Invalid AI response');
            }

            const content = data.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            return JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error('Error generating quiz:', error);
            throw error;
        }
    }
}

module.exports = new LessonService();