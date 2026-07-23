const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    course: {
        type: String,
        required: true
    },
    lesson: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
lessonProgressSchema.index({ userId: 1, course: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);