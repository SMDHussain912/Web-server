const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    topic: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ExamResult', examResultSchema);