require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Teacher = require('./models/teacher');
const Meeting = require('./models/meeting');
const { reset } = require('nodemon');
const { response } = require('express');
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

let hostUrl = 'http://' + HOST + ':' + PORT
//if (dsConfig.appUrl != '' && dsConfig.appUrl != '{APP_URL}') { hostUrl = dsConfig.appUrl }

const app = express();

/*
const config = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(config));
*/

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000' || 'http://localhost:4000/' || 'http://localhost:3000/dashboard' || 'http://localhost:3000/firstSync' || req.header('origin') || req.header('x-forwarded-host') || req.header('referer') || req.header('host'));
    //res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, x-auth-token, id, Accept, Access-Control-Allow-Origin");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

/*
app.use(cors({
    //origin: 'http://localhost:3000',
    credentials: true
}));
*/

// Or req.body will be undefined on POSTs
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//app.use(cors());

app.use(cookieParser());

const dbURI = process.env.ATLAS_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(PORT))
    .then(console.log(`Listening on ${PORT}`))
    .catch(err => console.log(err));



const auth = (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if(!token) {
            return res.status(401).json({msg: "No authentication token, access denied"});
        }
           
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) {
            return res.status(401).json({msg: "Token verification failed, authorization denied"});
        }
        
        req.user = verified.id;
        console.log("from auth, verified = ", verified);
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

app.post("/api/teachers/controls", async (req, res) => {
   
    // Should verify token
    console.log("trying to POST");
    console.log(req.body);
    const id = req.header("id");
    console.log("your id = ", id);
    //const userId = req.cookies.userId;
    //console.log("userId = ", userId);
    let { benchmarkAttendance, benchmarkTotalMinutes, weightState } = req.body;

    console.log(benchmarkAttendance, benchmarkTotalMinutes, weightState);
    try {
        const teacher = await Teacher.findOneAndUpdate(
            //{ 'info.id' : userId },
            { _id : id },
            {
                'controls.attendanceWeight' : weightState.attendance,
                'controls.totalMinutesWeight' : weightState.totalMinutes,
                'controls.pollsWeight' : weightState.polls,
                'controls.autorecordWeight' : weightState.autorecord,
                'controls.benchmarkAttendance' : benchmarkAttendance,
                'controls.benchmarkTotalMinutes' : benchmarkTotalMinutes
            }
        )
    } catch (err) {
        console.log(err);
    }
});

app.post("/api/tokenIsValid", async (req, res) => {
    console.log("tokenIsValid is running");
    try {
        const token = req.header("x-auth-token");
        console.log("at least was able to read header at x-auth-token stage = ", token);
        if (!token) {
            console.log("!token");
            return res.json( { result: false, msg: "token was empty" });
        }
        console.log("about to verify ...");

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("verified = ", verified);
        
        if (!verified) {
            console.log("!verified");
            return res.json({ result: false, msg: "not verified" });
        }
        
        const user = await Teacher.findById(verified.id);
        
        if (!user) {
            console.log("!user");
            return res.json({ result: false, msg: "user not found" });
        }
        console.log("about to return res.json of true");
        return res.json({ result: true, msg: '' });
    } catch (err) {
        console.log("ugh ... hit 500 error");
        if (err.message === "jwt expired") {
            return res.json({ result: false, msg: "Session expired." });
        }
        res.status(500).json({ error: err.message });
    }
});


// Route to fetch saved controls settings from app database.
app.get('/api/teachers/controls', async (req, res) => {
    console.log("fetching saved controls");
    const id = req.header("id");
    console.log("id on this get: ", id);
    //const userId = await req.cookies.userId;
    //console.log("userId from cookie = ", req.cookies.userId);
    try {
        const foundTeacher = await Teacher.findOne(
            { _id : id }
            // { 'info.id' : userId }
        );
        console.log("found teacher = ", foundTeacher.username);
        console.log("found controls = ", foundTeacher.controls);
        res.send(foundTeacher.controls);
    } catch (err) {
        res.json({ message: err });
    } 
});


// Route to fetch all of teacher's meetings
app.get('/api/teachers/meetings', async (req, res) => {
    //console.log("cookies = ", req.cookies);
    const id = req.header("id");
    console.log("username on this meeting get: ", id);
    const meetings = await Meeting.find({ user_email : id });
    //console.log("user??? ", userId);
    console.log("meetings??? ", meetings)
    res.send(meetings);
})


var date = '';
app.get('/api/teachers/getSyncInfo', async (req, res) => {
    const id = req.header("id");
    const meetings = await Meeting.find({ user_email : id });
    await meetings.map(async meeting => {
        console.log("this meeting date is = ", meeting.start_time);
        if (meeting.start_time > date) {
            date = meeting.start_time;
            console.log("new date = ", date);
        }
    })
    console.log("date is = ", date);
    res.send(date);
})

app.get("/api/teachers", auth, async (req, res) => {
    console.log("getting /api/teachers");
    const user = await Teacher.findById(req.user);
    res.json({
      username: user.username,
      id: user._id,
    });
  });

app.get('/cookies', async (req, res) => {
    res.cookie('myCookie3', 'hello again').send('cookie set');
    //res.send();
    //console.log("cookie set simple");
});

app.post("/api/signup", async (req, res) => {
    try {
        console.log("req body = ", req.body);
        let { username, password, passwordCheck, className, classSize } = req.body;
        console.log("after let");
        // validate
        if (!username || !password || !passwordCheck)
            return res.status(400).json({ msg: "Not all fields have been entered." });
        if (password.length < 4)
            return res
                .status(400)
                .json({ msg: "The password needs to be at least 4 characters long." });
        if (password !== passwordCheck)
            return res
                .status(400)
                .json({ msg: "Enter the same password twice for verification." });
  
        console.log("before existingUser");
        const existingUser = await Teacher.findOne({ username: username });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "An account with this email already exists." });
  
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newTeacher = new Teacher({
            username,
            password: passwordHash,
            className,
            classSize,
            info: null,
            controls: {
                attendanceWeight: 100,
                totalMinutesWeight: 0,
                pollsWeight: 0,
                autorecordWeight: 0,
                benchmarkAttendance: 80,
                benchmarkTotalMinutes: 60,
                autoRecord: false,
                usedPoll: false,
            },
        meetings: [],
        });
        const savedUser = await newTeacher.save();
        console.log("did fine here");
        res.json(savedUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("just deconstructured")

        // Validate
        if (!username || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }
        console.log("before findOne");
        const user = await Teacher.findOne({ username : username });
        if (!user) {
            console.log("user not found");
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json( { msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });  // one hour
        console.log("token", token);

        res.json({
            token,
            user: {
                id: user._id,
                username: username,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/teachers/getUserInfo', async (req, res) => {
    const id = req.header("id");
    console.log("....using id of = ", id);
    try {
        const teacher = await Teacher.findOne(
            { _id : id }
        );
        console.log("found teacher is = ", teacher.username);
        const firstName = teacher.info.first_name;
        const className = teacher.className;
        res.status(200).send([firstName, className]);
    } catch (error) {
        console.error("getUserInfo error: ", error)
    } 
});


app.get('/api/teachers/classSize', async (req, res) => {
    const id = req.header("id");
    console.log("....using id of for classSize = ", id);
    try {
        const teacher = await Teacher.findOne(
            { _id : id }
        );
        console.log("found teacher is = ", teacher.username);
        const classSize = teacher.classSize;
        console.log("====== class size = ", classSize);
        res.status(200).send(String(classSize));
    } catch (error) {
        console.error("getClassSize error: ", error)
    } 
});

// Route to add a new teacher to app database.
app.get('/api/teachers/add', async (req, res) => {
    const teacher = new Teacher({
        username: username,
        password: "1234",
        info: null,
        controls: {
            attendanceWeight: 100,
            totalMinutesWeight: 0,
            pollsWeight: 0,
            autorecordWeight: 0,
            benchmarkAttendance: 80,
            benchmarkTotalMinutes: 60,
            autoRecord: false,
            usedPoll: false,
        },
        meetings: [],
    });
    try {
        const savedTeacher = await teacher.save();
        res.json(savedTeacher);
    } catch (err) {
        res.json({ message: err });
    } 
});



// Helper function to add Zoom user info to app database profile for teacher.
const addUserInfo = async (data) => {
    try {
        //console.log("about to add sample user info");
        const foundTeacher = await Teacher.findOneAndUpdate(
            { username: zoomUserEmail },
            { info: data }
        );
        return;
    } catch (error) {
        console.error(error)
    } 
};

/*=======================================================================================
/                           ZOOM API ENDPOINTS UTILIZED
/========================================================================================
/
/       url: 'https://api.zoom.us/v2/users/me/meetings/',
/                   batch --> uuid, id, topic, type, duration(sched)
/        //url: 'https://api.zoom.us/v2/past_meetings/96338863572',
/                   id, topic, start_time, end_time, duration, participants_count
/        //url: 'https://api.zoom.us/v2/past_meetings/96338863572/polls',
/                   len(questions): {count} also can track students by name/email
/        //url: 'https://api.zoom.us/v2/meetings/96338863572',
/                   auto_recording
/        //url: 'https://api.zoom.us/v2/past_meetings/96338863572/participants',
/                   len(participants), id, name, user_email
/                   IMPORTANT NOTE: There is a typo in Zoom documentation; docs call
                        for {meetingUUID} in URL path, but correct one is {id}.
/
/=====================================================================================*/

// Authenticate with Zoom servers.
app.get('/api/zoom/auth', (req, res) => {
    // console.log(req);
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL);
});


// Sync app database to Zoom servers.
// Retrieve saved controls settings
// Reset controls settings to default
// Retrive meetings data for score chart
// Disconnect from Zoom servers
// Logout of app

// Helper function to fetch past meeting details.
const fetchPastMeetingDetails = async (data) => {
    arr = [];
    await Promise.all(data.map(async meeting => {
        try {
            //console.log("pre: ", meeting);
            const response = await axios({
                method: "get",
                url: 'https://api.zoom.us/v2/past_meetings/' + meeting.id,
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer " + accessToken       //req.cookies.accessToken
                }
            });
            //console.log("post: ", response.data);
            arr.push(response.data);
        } catch (error) {
            return;
        }
    }))
    //console.log("array: ", arr)
    return arr;
}


var zoomAccessToken;
var zoomRefreshToken;
var zoomUserEmail;
var zoomUserId;

// Route to sync app database with Zoom servers.
app.get('/', async (req, res) => {
//const authUserWithZoom = async (req, res) => {
    if (req.query.code) {
        console.log("req.query.code is PRESENT: ", req.query.code);
        try { 
            const tokenResponse = await axios({
                method: "post",
                url: 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.redirectURL,
                headers: {
                    Authorization: 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64'),
                }
            });
            
            zoomAccessToken = tokenResponse.data.access_token;
            zoomRefreshToken = tokenResponse.data.refresh_token;
            console.log("access token = ", zoomAccessToken);
            res.cookie('accessToken', zoomAccessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            res.cookie('refreshToken', zoomRefreshToken, { httpOnly: true, maxAge: 3600 * 1000 });
            console.log("cookies set");
        
            // Use Zoom API to fetch user info.
            const userInfoResponse = await axios({
                method: "get",
                url: 'https://api.zoom.us/v2/users/me',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer " + zoomAccessToken,
                }
            });

            zoomUserId = userInfoResponse.data.id;
            zoomUserEmail = userInfoResponse.data.email;
            console.log("user id about to be cookied: ", zoomUserId);
            console.log("corresponding username = ", zoomUserEmail);
            res.cookie('userId', zoomUserId, { httpOnly: true, maxAge: 3600 * 1000 });
            
            await addUserInfo(userInfoResponse.data);

            // Fetch from Zoom servers ALL of user's meetings (regardless of whether actually transpired).
            //   To qualify, meeting must have been 'scheduled'. Can have zero participants.
            const responseAllMeetings = await axios({
                method: "get",
                url: 'https://api.zoom.us/v2/users/me/meetings',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer " + zoomAccessToken  // Alternative: req.cookies.accessToken
                }
            });

            //console.log("All meetings fetched: ", response.data.meetings);
            console.log("username for teacher to be updated here: ", zoomUserEmail);
            try {
                const foundTeacher = await Teacher.findOneAndUpdate(
                    { username: zoomUserEmail },
                    { $addToSet: { meetings: responseAllMeetings.data.meetings }}
                );
            } catch (err) {
                console.log(err);
            }
           

            // return ([response.data.meetings, teacher]);
            //console.log("------> found teacher or did i???: ", foundTeacher.username);
            //console.log("meetings array: ", meetings);


            // From list of all meetings, retrieve and save to app database only those
            //   meetings that had minimum of two participants (i.e., "past meetings").
            console.log("all meetings ??? --> ", responseAllMeetings.data.meetings);

            await responseAllMeetings.data.meetings.map(async meeting => {
                console.log("individual meeting = ", meeting);
                const responseMapMeetings = await axios({
                    method: "get",
                    url: 'https://api.zoom.us/v2/past_meetings/' + meeting.id,
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer " + zoomAccessToken
                    }
                });

                console.log("past_meeting fetched: ", responseMapMeetings.data);

                try {
                    Meeting.findOne({ id: responseMapMeetings.data.id }, function(err, found) {
                        if (err) console.log("find error: ", err);
                        if (found) {
                            console.log("it already exists");
                        } else {
                            const mergedObject = { ...responseMapMeetings.data, timezone : meeting.timezone }
                            console.log("merged object: ", mergedObject);
                            const pastNewMeeting = new Meeting(mergedObject);
                            const savedPastMeeting = pastNewMeeting.save();
                        }
                        //return;
                    })
                } catch (err) {
                    return;     // Not found since not a past meeting w/min 2 participants and so skipping
                }
                return;
            });
        } catch (err) {
            console.log(err);
        } 
        console.log("hello: ", zoomUserId);

        try {
            const pastMeetings = await Meeting.find({ host_id : zoomUserId });
            
            // Loop through past meetings to retrieve special metrics for each.
            pastMeetings.map(async meeting => {

                // Load auto_recording attribute for past meeting and save in app database.
                const autoRecordingResponse = await axios({
                    method: "get",
                    url: 'https://api.zoom.us/v2/meetings/' + meeting.id,
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer " + zoomAccessToken
                    }
                });


                const auto_recording = autoRecordingResponse.data.settings.auto_recording;
                console.log("auto_recording = ", auto_recording);
                try {
                    const pastMeeting = await Meeting.findOneAndUpdate(
                        { id: meeting.id },
                        { auto_recording },
                    );
                } catch (err) {
                    console.log(err);
                }
               

                // Load polls info for past meeting and save in app database.
                const pollsResponse = await axios({
                    method: "get",
                    url: 'https://api.zoom.us/v2/past_meetings/' + meeting.id + '/polls',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer " + zoomAccessToken
                    }
                });

                console.log("=======================");
                console.log("the meeting is: ", meeting.id);
                console.log("pollsResponse = ", pollsResponse.data);
                const pastPollsMeeting = await Meeting.findOneAndUpdate(
                    { id: meeting.id },
                    { $addToSet: { polls : pollsResponse.data } },
                );

                console.log("meeting above is: ", pastPollsMeeting.id)



                // Load participants info for past meeting and save in app database.
                const participantsResponse = await axios({
                    method: "get",
                    url: 'https://api.zoom.us/v2/past_meetings/' + meeting.id + '/participants',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer " + zoomAccessToken
                    }
                });
                
                //console.log("=======================");
                //console.log("the meeting is: ", meeting.id);
                //console.log("resp: ", response.data.participants);
                try {
                    const pastParticipantsMeeting = await Meeting.findOneAndUpdate(
                        { id: meeting.id },
                        { $addToSet: { participants : { $each: participantsResponse.data.participants } } },
                    );
                } catch (err) {
                    console.log(err);
                }
               
                
                //console.log("?? ", pastParticipantsMeeting);
              
                console.log("done");
                try {
                    return res.status(200).redirect('http://localhost:3000/dashboard');
                      // stop ERR_HTTP_HEADERS_SENT error
                } catch (err) {
                    console.log("cannot redirect error??? = ", err)
                }
            });    
        } catch (err) {
            console.log("outside: ", err);
        }
        return;
    } else {
        // Authenticate user with Zoom if not already authenticated in order to access Zoom APIs.
        console.log("code was NOT present");
        return res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL);
    }
});