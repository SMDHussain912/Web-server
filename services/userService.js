const User = require('../models/User');
const LessonProgress = require('../models/LessonProgress');
const ExamResult = require('../models/ExamResult');
const Achievement = require('../models/Achievement');
const Bookmark = require('../models/Bookmark');
const Note = require('../models/Note');

class UserService {
    async getUserProgress(userId) {
        try {
            const completedLessons = await LessonProgress.find({ userId });
            const examResults = await ExamResult.find({ userId });

            return {
                completedLessons: completedLessons.map(doc => doc.toObject()),
                examResults: examResults.map(doc => doc.toObject()),
                totalLessonsCompleted: completedLessons.length,
                totalExamsTaken: examResults.length
            };
        } catch (error) {
            console.error('Error fetching user progress:', error);
            throw error;
        }
    }

    async getLearningStreak(userId) {
        try {
            const progress = await LessonProgress.find({ userId })
                .sort({ date: -1 })
                .limit(30);

            const dates = [...new Set(progress.map(p => {
                const date = new Date(p.date);
                return date.toDateString();
            }))];

            let streak = 0;
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (dates[0] === today || dates[0] === yesterday) {
                for (let i = 0; i < dates.length; i++) {
                    const expectedDate = new Date();
                    expectedDate.setDate(expectedDate.getDate() - i);
                    if (dates[i] === expectedDate.toDateString()) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }

            return streak;
        } catch (error) {
            console.error('Error calculating streak:', error);
            return 0;
        }
    }

    async getUserStats(userId) {
        try {
            const progress = await this.getUserProgress(userId);
            const streak = await this.getLearningStreak(userId);

            const totalScore = progress.examResults.reduce((sum, exam) => sum + (exam.score || 0), 0);
            const averageScore = progress.examResults.length > 0 
                ? Math.round(totalScore / progress.examResults.length) 
                : 0;

            return {
                lessonsCompleted: progress.totalLessonsCompleted,
                examsTaken: progress.totalExamsTaken,
                averageScore,
                streak,
                totalScore
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    }

    async saveLessonProgress(userId, course, lesson) {
        try {
            await LessonProgress.findOneAndUpdate(
                { userId, course, lesson },
                { date: new Date() },
                { upsert: true, new: true }
            );
            return true;
        } catch (error) {
            console.error('Error saving lesson progress:', error);
            throw error;
        }
    }

    async saveExamResult(userId, topic, score) {
        try {
            await ExamResult.create({
                userId,
                topic,
                score
            });
            return true;
        } catch (error) {
            console.error('Error saving exam result:', error);
            throw error;
        }
    }

    async getBookmarks(userId) {
        try {
            const bookmarks = await Bookmark.find({ userId });
            return bookmarks.map(doc => doc.toObject());
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            return [];
        }
    }

    async addBookmark(userId, type, itemId, title) {
        try {
            await Bookmark.findOneAndUpdate(
                { userId, itemId },
                { type, title, date: new Date() },
                { upsert: true, new: true }
            );
            return true;
        } catch (error) {
            console.error('Error adding bookmark:', error);
            throw error;
        }
    }

    async removeBookmark(userId, itemId) {
        try {
            await Bookmark.deleteOne({ userId, itemId });
            return true;
        } catch (error) {
            console.error('Error removing bookmark:', error);
            throw error;
        }
    }

    async getNotes(userId, courseId) {
        try {
            let query = { userId };
            if (courseId) {
                query.courseId = courseId;
            }

            const notes = await Note.find(query).sort({ date: -1 });
            return notes.map(doc => ({ id: doc._id.toString(), ...doc.toObject() }));
        } catch (error) {
            console.error('Error fetching notes:', error);
            return [];
        }
    }

    async saveNote(userId, courseId, lessonId, content) {
        try {
            await Note.create({
                userId,
                courseId,
                lessonId,
                content
            });
            return true;
        } catch (error) {
            console.error('Error saving note:', error);
            throw error;
        }
    }
}

module.exports = new UserService();