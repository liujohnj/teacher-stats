const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const infoObject = {
    created_at: String,
    custom_attributes: [
        {
            key: String,
            name: String,
            value: String,
        }
    ],
    id: String,
    first_name: String,
    last_name: String,
    email: String,
    type: Number,
    role_name: String,
    pmi: Number,
    use_pmi: Boolean,
    personal_meeting_url: String,
    timezone: String,
    verified: Number,
    dept: String,
    last_login_time: String,
    last_client_version: String,
    pic_url: String,
    host_key: String,
    jid: String,
    group_ids: [],
    im_group_ids: [],
    account_id: String,
    language: String,
    phone_country: String,
    phone_number: String,
    status: String,
    role_id: String,
    employee_unique_id: String,
    account_number: Number,
    manager: String,
    login_types: [],
};

const MeetingSchema = new Schema({
    uuid: String,
    id: Number,
    host_id: String,
    topic: String,
    type: Number,
    start_time: String,
    duration: Number,
    timezone: String,
    join_url: String,
    pmi: String,
}, {timestamps: true });

const teacherSchema = new Schema({
    username: String,
    password: String,
    className: String,
    classSize: Number,
    controls: Object,
        /*
        attendanceWeight,
        totalMinutesWeight,
        pollsWeight,
        autorecordWeight,
        benchmarkAttendance,
        benchmarkTotalMinutes
        */
    info: Object,
        /* per API docs ...
        {
            created_at: String,
            custom_attributes: [
                {
                    key: String,
                    name: String,
                    value: String,
                }
            ],
            id: String,
            */
            //first_name: String,
            //last_name: String,
            /*
            email: String,
            type: Number,
            role_name: String,
            pmi: Number,
            use_pmi: Boolean,
            personal_meeting_url: String,
            timezone: String,
            verified: Number,
            dept: String,
            last_login_time: String,
            last_client_version: String,
            pic_url: String,
            host_key: String,
            cms_user_id: String,
            jid: String,
            group_ids: [],
            im_group_ids: [],
            account_id: String,
            language: String,
            phone_country: String,
            phone_number: String,
            status: String,
            job_title: String,
            location: String,
            role_id: String,
            employee_unique_id: String,
            account_number: Number,
            manager: String,
            login_types: [],
        }
        */
    meetings: Array,
}, {timestamps: true });

// model based on schema
const Teacher = mongoose.model('teacher', teacherSchema);
module.exports = Teacher;