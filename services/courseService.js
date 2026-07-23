const Course = require('../models/Course');
const LessonProgress = require('../models/LessonProgress');
const fs = require('fs');
const path = require('path');

class CourseService {
    // Seed courses from JSON files to MongoDB
    async seedCoursesFromJSON() {
        try {
            const lessonsDir = path.join(__dirname, '../courses/lessons');
            
            // Check if directory exists
            if (!fs.existsSync(lessonsDir)) {
                console.log('⚠️  No courses/lessons directory found. Creating...');
                fs.mkdirSync(lessonsDir, { recursive: true });
                return 0;
            }

            const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'));
            let count = 0;

            for (const file of files) {
                const filePath = path.join(lessonsDir, file);
                const courseData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                // Check if course already exists
                const existing = await Course.findOne({ courseId: courseData.courseId });
                if (!existing) {
                    await Course.create({
                        courseId: courseData.courseId,
                        title: courseData.courseTitle,
                        description: courseData.courseDescription,
                        difficulty: courseData.difficulty || 'beginner',
                        icon: courseData.icon || '📚',
                        totalLessons: courseData.totalLessons,
                        lessons: courseData.lessons.map((l, idx) => ({
                            lessonNumber: l.lessonNumber || idx + 1,
                            title: l.title,
                            topic: l.topic,
                            description: l.description,
                            duration: l.duration,
                            difficulty: l.difficulty || courseData.difficulty || 'beginner',
                            objectives: l.objectives || [],
                            prerequisites: l.prerequisites || [],
                            content: l.content || [],
                            summary: l.summary || '',
                            keyPoints: l.keyPoints || [],
                            practiceExercise: l.practiceExercise || null,
                            tags: l.tags || []
                        })),
                        tags: courseData.tags || [],
                        isPublished: true
                    });
                    count++;
                    console.log(`✅ Seeded course: ${courseData.courseTitle}`);
                }
            }
            
            if (count === 0) {
                console.log('📚 All courses already seeded in MongoDB');
            }
            
            return count;
        } catch (error) {
            console.error('Error seeding courses:', error);
            return 0;
        }
    }

    // Get all published courses
    async getCourses(filters = {}) {
        try {
            const query = { isPublished: true };
            
            if (filters.difficulty) {
                query.difficulty = filters.difficulty;
            }
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { tags: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const courses = await Course.find(query)
                .select('courseId title description difficulty icon category totalLessons rating enrollmentCount')
                .sort({ createdAt: -1 });

            return courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    }

    // Get single course with all lessons
    async getCourse(courseId) {
        try {
            const course = await Course.findOne({ courseId });
            return course;
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    }

    // Get specific lesson
    async getLesson(courseId, lessonNumber) {
        try {
            const course = await Course.findOne({ courseId });
            if (!course) return null;

            const lesson = course.lessons.find(l => l.lessonNumber === parseInt(lessonNumber));
            if (!lesson) return null;

            return {
                courseTitle: course.title,
                courseId: course.courseId,
                totalLessons: course.totalLessons,
                lesson
            };
        } catch (error) {
            console.error('Error fetching lesson:', error);
            throw error;
        }
    }

    // Create a new course
    async createCourse(courseData) {
        try {
            const course = await Course.create(courseData);
            return course;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    // Update course
    async updateCourse(courseId, updateData) {
        try {
            const course = await Course.findOneAndUpdate(
                { courseId },
                { ...updateData, updatedAt: new Date() },
                { new: true }
            );
            return course;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }

    // Add lesson to course
    async addLesson(courseId, lessonData) {
        try {
            const course = await Course.findOne({ courseId });
            if (!course) throw new Error('Course not found');

            const lessonNumber = course.lessons.length + 1;
            course.lessons.push({
                lessonNumber,
                ...lessonData,
                createdAt: new Date()
            });
            course.totalLessons = course.lessons.length;
            course.updatedAt = new Date();

            await course.save();
            return course;
        } catch (error) {
            console.error('Error adding lesson:', error);
            throw error;
        }
    }

    // Delete course
    async deleteCourse(courseId) {
        try {
            await Course.findOneAndDelete({ courseId });
            await LessonProgress.deleteMany({ course: courseId });
            return true;
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }

    // Get user's enrolled courses with progress
    async getUserCourses(userId) {
        try {
            const courses = await Course.find({ isPublished: true });
            const progress = await LessonProgress.find({ userId });

            return courses.map(course => {
                const courseProgress = progress.filter(p => p.course === course.courseId);
                const completedLessons = courseProgress.length;
                const totalLessons = course.totalLessons;
                const progressPercent = totalLessons > 0 
                    ? Math.round((completedLessons / totalLessons) * 100) 
                    : 0;

                return {
                    courseId: course.courseId,
                    title: course.title,
                    description: course.description,
                    difficulty: course.difficulty,
                    icon: course.icon,
                    totalLessons,
                    completedLessons,
                    progressPercent,
                    rating: course.rating
                };
            });
        } catch (error) {
            console.error('Error fetching user courses:', error);
            throw error;
        }
    }
}

module.exports = new CourseService();