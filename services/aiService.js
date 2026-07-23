const config = require('../config/config');

class AIService {
    constructor() {
        this.apiKey = config.ai.apiKey;
        this.baseUrl = config.ai.baseUrl;
        this.model = config.ai.model;
    }

    async generateExam(topic) {
        try {
            const prompt = `
Generate a multiple choice exam.

Topic: ${topic}

Return ONLY JSON.

Format:

{
 "questions":[
  {
   "question":"",
   "options":["","","",""],
   "answer":0
  }
 ]
}

Rules:
- 20 questions
- 4 options each
- answer index 0-3
`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (!data.choices) {
                throw new Error('AI response error');
            }

            let aiText = data.choices[0].message.content.trim();

            const firstBrace = aiText.indexOf('{');
            const lastBrace = aiText.lastIndexOf('}');

            aiText = aiText.substring(firstBrace, lastBrace + 1);

            return JSON.parse(aiText);
        } catch (error) {
            console.error('Exam generation error:', error);
            throw new Error('Exam generation failed');
        }
    }

    async checkCode(code, output, task) {
        try {
            const prompt = `
You are a beginner friendly programming teacher.

Task:
${task}

Student Code:
${code}

Program Output:
${output}

Check if the solution solves the task.

Rules:
- respond under 3 sentences
- start with Correct or Incorrect
- ignore formatting mistakes
- focus on logic and output
`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            const data = await response.json();

            if (!data.choices) {
                return { feedback: 'AI response error' };
            }

            return {
                feedback: data.choices[0].message.content
            };
        } catch (error) {
            console.error('Code check error:', error);
            return { feedback: 'AI check failed' };
        }
    }

    async checkExercise(questions, answers) {
        try {
            const prompt = `
You are a beginner programming teacher.

Questions:
${JSON.stringify(questions)}

Student Answers:
${JSON.stringify(answers)}

Check if answers show correct understanding.

Rules:
- If mostly correct respond PASSED
- Otherwise explain briefly
- Maximum 3 sentences
`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            const data = await response.json();

            const feedback = data.choices[0].message.content;

            return {
                feedback,
                passed: feedback.toLowerCase().includes('passed')
            };
        } catch (error) {
            console.error('Exercise check error:', error);
            return {
                feedback: 'Exercise check failed',
                passed: false
            };
        }
    }

    async generateProjectDetails(title, explanation, examples) {
        try {
            const prompt = `
You are a programming teacher creating a mini project.

Lesson Title:
${title}

Lesson Explanation:
${explanation}

Example Code:
${JSON.stringify(examples)}

Create a VERY SIMPLE beginner project that uses ONLY concepts from this lesson.

Rules:
- Beginner level
- 10-20 lines of code maximum
- Only console programs
- Use System.out.println
- Do NOT use advanced topics
- Project must match the lesson topic

Return HTML like this:

<h3>🎯 Goal</h3>
Explain what the student will build.

<h3>📋 Requirements</h3>
List 3-5 simple tasks.

<h3>💻 Example Output</h3>
Show expected console output.

<h3>💡 Hint</h3>
Give one helpful hint.
`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.4,
                    max_tokens: 500
                })
            });

            const data = await response.json();

            if (!data.choices) {
                return { details: '<p>Failed to generate project.</p>' };
            }

            return {
                details: data.choices[0].message.content
            };
        } catch (error) {
            console.error('Project generation error:', error);
            return { details: '<p>Project generation failed.</p>' };
        }
    }

    async getCareerRecommendations(skills, interests, education) {
        try {
            const prompt = `
You are a career advisor. Based on the following information, recommend 5 suitable career paths.

Skills: ${skills}
Interests: ${interests}
Education Level: ${education}

For each career, provide:
1. Career title
2. Why it's a good fit
3. Required skills to learn
4. Average salary range
5. Growth prospects

Format as JSON:
{
  "recommendations": [
    {
      "title": "",
      "fit": "",
      "skills": [],
      "salary": "",
      "growth": ""
    }
  ]
}
`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (!data.choices) {
                throw new Error('AI response error');
            }

            let aiText = data.choices[0].message.content.trim();
            const firstBrace = aiText.indexOf('{');
            const lastBrace = aiText.lastIndexOf('}');
            aiText = aiText.substring(firstBrace, lastBrace + 1);

            return JSON.parse(aiText);
        } catch (error) {
            console.error('Career recommendation error:', error);
            throw new Error('Failed to generate recommendations');
        }
    }
}

module.exports = new AIService();