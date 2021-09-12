import Chart from "./Chart";
import { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/userContext';
import { identity } from "lodash";
import { getMonthDate } from "../tools/ParseDate.js"
const axios = require('axios');
axios.defaults.withCredentials = true;

const ScoreChart = (props) => {

    const {userData} = useContext(UserContext);
    let id = '';
    let username = '';
    if (userData.user) {
        id = userData.user.id;
        username = userData.user.username;
    } else {
        username = '';
    }

    
    const { attendanceWeight, totalMinutesWeight, autorecordWeight, pollsWeight, benchmarkAttendance, benchmarkTotalMinutes } = props;
    console.log("a = ", attendanceWeight, "& m = ", totalMinutesWeight);
    const [meetingsData, setMeetingsData] = useState([]);
    const [chartMeetingsData, setChartMeetingsData] = useState([]);
    const [chartScoreData, setChartScoreData] = useState([]);
    const [classSize, setClassSize] = useState("");
    
    useEffect(() => {
        if (userData.user) {
            id = userData.user.id;
            username = userData.user.username;
        }
        getClassSize();
        console.log("++++++++++++++ updated userData new id +++++++++++++", id);
    }, [userData]);

    useEffect(() => {
        axios({
            method: "get",
            url: 'http://localhost:4000/api/teachers/meetings',
            withCredentials: true,
            headers: {"id": username}  // from userData.user.username
            })
            .then(response => {
                console.log("RESPONSE => ", response.data)
                setMeetingsData(response.data);
                return response.data;
            })
            .then(data => {
                setChartScoreData(calculatedScore(data));
            })
            .catch(error =>
                console.log(error))
    }, [attendanceWeight, totalMinutesWeight, benchmarkAttendance, benchmarkTotalMinutes, autorecordWeight, pollsWeight]);

    const getClassSize = async () => {
        try {
            const classSize = await axios({
                method: "get",
                url: 'http://localhost:4000/api/teachers/classSize',
                withCredentials: true,
                headers: {"id": id}
            });
            console.log("!!!!!!!!!!!!!!!! CLASS SIZE = ", classSize.data, " !!!!!!!!!!!!!!!!!!!!!!!");
            setClassSize(Number(classSize.data));
            localStorage.setItem('classSize', Number(classSize.data));
        } catch (err) {
            console.log(err);
        }
    }

    const totalNumStudents = classSize;
    //const totalNumStudents = 20;  // Temporary fixed class size

    const calculatedScore = (data) => {
        /*
        console.log("attend: ", (3/(totalNumStudents * benchmarkAttendance/100)) * attendanceWeight);
        console.log("minutes: ", ((45/benchmarkTotalMinutes) * totalMinutesWeight));
        */
        console.log("...........DATA = ", data);
        console.log("&&&&&& classSize = ", classSize);

        const totalScore = data.map( object =>
            ({ "date": getMonthDate(object.start_time), "score":
            (
                // Weighted attendance score.
                //  Calculated based on attendance % with full score
                //  given if benchmark % is met relative to class size;
                //  otherwise, score is pro-rata.
                Math.min((((object.participants_count - 1)/(totalNumStudents * benchmarkAttendance/100)) * attendanceWeight), attendanceWeight) +

                // Weighted total minutes score
                //  Calculated based on total minutes Zoom meeting
                //  lasted relative to scheduled duration.
                Math.min(((object.total_minutes/(object.duration * benchmarkTotalMinutes/100)) * totalMinutesWeight), totalMinutesWeight) +

                // Weighted autorecord score.
                //  Full score given if auto-recording was enabled.
                //  Otherwise, received score of zero.
                ((object.auto_recording === "none" ? 0 : 1) * autorecordWeight) +

                // Weighted used poll score.
                 // Full score given if at least one poll was used.
                //  Otherwise, received score of zero.
                ((object.polls[0].questions.length === 0 ? 0 : 1) * pollsWeight)
            )
        }));
        /*
        const pollInfo = data.map( meeting => {
            console.log("THIS MEETING = ", meeting.polls[0].questions.length);
            const tempPollScore =  ((meeting.polls[0].questions.length === 0 ? 0 : 1) * pollsWeight)
            console.log("POLLS SCORE = ", tempPollScore);
        });
        */
        let sumScore = 0;
        console.log("can i see data? ", data);
        const avgScore = data.map( object =>
            sumScore += 
                Math.min((((object.participants_count - 1)/(totalNumStudents * benchmarkAttendance/100)) * attendanceWeight), attendanceWeight) +

                Math.min(((object.total_minutes/(object.duration * benchmarkTotalMinutes/100)) * totalMinutesWeight), totalMinutesWeight) +

                ((object.auto_recording === "none" ? 0 : 1) * autorecordWeight) +

                ((object.polls[0].questions.length === 0 ? 0 : 1) * pollsWeight)
            );
        console.log("avg = ", sumScore/data.length);
        localStorage.setItem("avgScore", sumScore/data.length);

        return totalScore;
    }

    return (
        <div>
            {chartScoreData && <Chart data={chartScoreData} />}
        </div>
    );
}
 
export default ScoreChart;