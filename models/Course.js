const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'code', 'example', 'image', 'video', 'quiz'],
        required: true
    },
    content: String,
    language: String,
    code: String,
    explanation: String,
    title: String,
    description: String,
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
    }]
}, { _id: false });

const lessonSchema = new mongoose.Schema({
    lessonNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    topic: String,
    description: String,
    duration: String,
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    objectives: [String],
    prerequisites: [String],
    content: [contentBlockSchema],
    summary: String,
    keyPoints: [String],
    practiceExercise: {
        description: String,
        task: String,
        hint: String,
        starterCode: String,
        solution: String,
        testCases: [{
            input: String,
            expectedOutput: String
        }]
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    icon: {
        type: String,
        default: '📚'
    },
    category: {
        type: String,
        default: 'programming'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    lessons: [lessonSchema],
    totalLessons: {
        type: Number,
        default: 0
    },
    totalDuration: String,
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps on save
courseSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    this.totalLessons = this.lessons.length;
    next();
});

lessonSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Course', courseSchema);