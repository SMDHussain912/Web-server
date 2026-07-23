const mongoose = require('mongoose');

let db;

async function initializeDatabase(uri) {
    try {
        await mongoose.connect(uri);
        db = mongoose.connection;
        console.log('✅ MongoDB connected successfully');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return db;
}

module.exports = {
    initializeDatabase,
    getDatabase
};