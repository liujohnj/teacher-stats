import "./index.css";
import { useState, useEffect } from 'react';
const axios = require('axios');


const Test = () => {
    
    const [firstName, setFirstName] = useState(null);
    const [meetings, setMeetings] = useState(null);

    
    useEffect (() => {
        axios.get('http://localhost:4000/api/user')
            .then(res => {
                console.log("from server: ", res.data);
                setFirstName(res.data.firstName);
            }).catch(err => console.log(err))
    }, []);

    const handleClick = () => {
        axios.get('http://localhost:4000/api/meetings')
            .then(res => {
                console.log("from server: ", res.data);
                setMeetings(res.data);
            }).catch(err => console.log(err))
    }

    var newestStartTime = "2019-08-19T16:30:00Z"

    return (
        <div>
            {firstName && <h1>Welcome, {firstName}</h1>}

            <form method='GET' action="http://localhost:4000/api/meetings">
                <input type="text"></input>
            </form>
            <button onClick={handleClick}>Get meetings</button>
            <div>
                { meetings && meetings.filter(meeting => meeting.start_time > newestStartTime).map(filteredMeeting => ( 
                    <div key={filteredMeeting.id}>
                        <ul>
                            <li>{filteredMeeting.id}</li>
                                <ul>
                                    <li>Start time: {filteredMeeting.start_time}</li>
                                    <li>Duration: {filteredMeeting.duration} minutes</li>
                                </ul>
                        </ul>
                    </div>
                )
                )}
            </div>
        </div>
    );

}

 
export default Test;