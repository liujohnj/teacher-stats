const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const meetingSchema = new Schema({
    uuid: String,
    id: Number,
    host_id: String,
    topic: String,
    user_name: String,
    user_email: String,
    start_time: String,
    end_time: String,
    duration: Number,
    total_minutes: Number,
    participants_count: Number,
    participants: Array,
    polls: Array,
    timezone: String,
    auto_recording: String,

}, {timestamps: true });

// model based on schema
const Meeting = mongoose.model('meeting', meetingSchema);
module.exports = Meeting;