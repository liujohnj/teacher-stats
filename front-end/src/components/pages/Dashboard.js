//import { duration } from '@material-ui/core';

import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/userContext';
import AvgScoreCard from "../cards/AvgScoreCard";
import ClassesCard from "../cards/ClassesCard";
import NumStudentsCard from "../cards/NumStudentsCard";
import LowestAttendanceCard from "../cards/LowestAttendanceCard";
import ScoreChart from '../charts/ScoreChart';
import Score from './Score';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import axios from 'axios';
import { getDateTime } from "../tools/ParseDate";


const Dashboard = () => {
    var { userData } = useContext(UserContext);

    const [firstName, setFirstName] = useState('');
    const [syncDate, setSyncDate] = useState('');
    const history = useHistory();
    
    useEffect(() => {
        const url = window.location.search;
        const query = url.replace("?", '');
        console.log("query is: ", query);
        if (query.substr(0, 5) === "code=") {
            console.log('http://localhost:4000?' + query);
            axios.get('http://localhost:4000?' + query)
                .catch(err => console.log(err))
        }
    }, []);

    useEffect(() => {
        getSyncInfo();
        const token = localStorage.getItem("auth-token");
        if (!userData.user && token === '') {
            history.push("/login");
        }
    }, []);

    let id = '';
    let username = '';
    useEffect(() => {
        if (userData.user) {
            id = userData.user.id;
            username = userData.user.username;
        }
        getFirstName();
        getSyncInfo();
    }, [userData]);

    const getFirstName = async () => {
        try {
            console.log("ABOUT TO TRY TO GET FIRST NAME using id of = ", id);
            const userInfo = await axios({
                method: "get",
                url: 'http://localhost:4000/api/teachers/getUserInfo',
                withCredentials: true,
                headers: {"id": id}
            });
            console.log("FIRSTNAME: ", userInfo.data);
            setFirstName(userInfo.data[0]);
            localStorage.setItem("className", userInfo.data[1]);
        } catch (err) {
            console.log(err);
        }
    }

    const getSyncInfo = async () => {
        try {
            const lastMeeting = await axios({
                method: "get",
                url: 'http://localhost:4000/api/teachers/getSyncInfo',
                withCredentials: true,
                headers: {"id": username}
            });
            const dateTime = getDateTime(lastMeeting.data);
            await setSyncDate(dateTime);
            console.log("############ dateTime = ", dateTime);
        } catch(err) {
            console.log("getSyncInfo error: ", err);
        }
    }
    //getSyncInfo();


    if (!userData.user) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <div>
                <h2>Dashboard</h2>
            </div>
            <div>
                <div className="welcomeMessage">
                    <div>
                        <h4>Welcome, {firstName}.  Your are synced with Zoom meetings that started on or before {syncDate}.  Would you like to re-sync now?</h4>
                    </div>
                    <form action="http://localhost:4000" method="get">
                        <div className="syncButton">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SyncIcon />}
                            >
                                Sync
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="topCardsRow">
                <div className="topCardsRowCard">
                    <AvgScoreCard />
                </div>
                <div className="topCardsRowCard">
                    <ClassesCard />
                </div>
                <div className="topCardsRowCard">
                    <NumStudentsCard />
                </div>
                <div className="topCardsRowCard">
                    <LowestAttendanceCard />
                </div>  
            </div>
            <div className="centerRow">
                <Score />
            </div>
            <div className="bottomCardsRow">
                
            </div>
        </div>
    );
}
 
export default Dashboard;