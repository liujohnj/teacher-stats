import { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/userContext';
import ScoreChart from "../charts/ScoreChart";
import { Slider, Switch, Input } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';
import SaveIcon from '@material-ui/icons/Save';
import AvgScoreCard from '../cards/AvgScoreCard';


const axios = require('axios');

const Score = () => {
    const {userData} = useContext(UserContext);
    const [benchmarkTotalMinutes, setBenchmarkTotalMinutes ] = useState(100);
    const [benchmarkAttendance, setBenchmarkAttendance ] = useState(100);
    
    const [switchState, setSwitchState] = useState({
        checkedTotalMinutes: true,
        checkedAttendance: true,
        checkedAutorecord: true,
        checkedPolls: true
      });

    const [weightState, setWeightState] = useState({
        attendance: 25,
        totalMinutes: 25,
        autorecord: 25,
        polls: 25
    });
    
    const [totalWeight, setTotalWeight] = useState(100);
    
    
    useEffect( () => {
        console.log("====================HANDLERESETSAVED LAUNCHED==================");
        handleResetSaved();
    }, [userData]);
    
    useEffect( () => {
        setTotalWeight(weightState.attendance + weightState.totalMinutes + weightState.autorecord + weightState.polls);
    }, [weightState.attendance, weightState.totalMinutes, weightState.autorecord, weightState.polls]);
    

    const handleChangeTotalMinutes = (event, newValue) => {
        setBenchmarkTotalMinutes(newValue);
    };

    const handleChangeAttendance = (event, newValue) => {
        setBenchmarkAttendance(newValue);
    };

    const handleChangeSwitch = (event) => {
        setSwitchState({ ...switchState, [event.target.name]: event.target.checked });
    };
    
    const handleChangeWeight = (event) => {
        setWeightState({ ...weightState, [event.target.name] : Number(event.target.value) })
    };

    // const totalWeight = weightState.attendance + weightState.totalMinutes + weightState.autorecord + weightState.polls;
    let id;
    if (userData.user) {
        id = userData.user.id;
    } else {
        id = '';
    }

    const handleResetSaved = () => {
        axios({
            method: "get",
            url: 'http://localhost:4000/api/teachers/controls',
            withCredentials: true,
            headers: {"id": id}
        }).then(response => {
            console.log("header id = ", id);
            console.log("response from axios is = ", response.data);
            setBenchmarkTotalMinutes(response.data.benchmarkTotalMinutes);
            setBenchmarkAttendance(response.data.benchmarkAttendance);
            setWeightState(
                {
                    attendance : response.data.attendanceWeight,
                    totalMinutes : response.data.totalMinutesWeight,
                    autorecord : response.data.autorecordWeight,
                    polls : response.data.pollsWeight
                }
            );
        }).then( () => {
            console.log("from useeffect: ", weightState);
        }).catch(error => {
            console.log(error);
        })
    }

    const handleSaveNewSettings = async () => {
        try {
            await axios({
                method: "post",
                url: 'http://localhost:4000/api/teachers/controls',
                //withCredentials: true,
                headers: {"id": userData.user.id},
                data:
                    {
                        benchmarkAttendance,
                        benchmarkTotalMinutes,
                        weightState
                    }
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className="pageTitle">
                {/*Score page*/}
            </div>
            <div className="scorePanels">
                
                {/*==================== ScoreChart Component==================*/}
                <div className="scoreChartPanel">
                    <div className="largeCardsTitle">
                        <h3>Score Chart</h3>
                    </div>
                    <div className="chart">
                        <ScoreChart
                            attendanceWeight={weightState.attendance}
                            totalMinutesWeight={weightState.totalMinutes}
                            autorecordWeight={weightState.autorecord}
                            pollsWeight={weightState.polls}
                            benchmarkAttendance={benchmarkAttendance}
                            benchmarkTotalMinutes={benchmarkTotalMinutes}
                        />
                    </div>
                </div>
                {/*======================= Controls Panel ====================*/}
                <div className="controlsPanel">
                    <div className="largeCardsTitle">
                        <h3>Controls</h3>
                    </div>
                    <div className="weightsLabel">
                        <h4>Weight</h4>
                    </div>
                     {/*--------------- Attendance ----------------*/}
                     <div className="controlGroup">
                        <div className="switch">
                            {/*
                            <Switch
                                checked={switchState.checked}
                                onChange={handleChangeSwitch}
                                name="checkedAttendance"
                                color="primary"
                            />
                            */}
                        </div>
                        <div className="controlLabel">
                            Student attendance %
                        </div>
                        <div className="slider">
                            <Slider value={benchmarkAttendance} valueLabelDisplay="on" min={1} onChange={handleChangeAttendance} />
                        </div>
                        <div className="numberInputFlexbox">
                            <Input
                                className="numberInput"
                                name="attendance"
                                value={weightState.attendance}
                                //margin="dense"
                                onChange={handleChangeWeight}
                                inputProps={{
                                    step: 5,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                }}
                            />
                        </div>
                    </div>
                    {/*-------------- TotalMinutes ----------------*/}
                    <div className="controlGroup">
                        <div className="switch">
                            {/*
                            <Switch
                                checked={switchState.checked}
                                onChange={handleChangeSwitch}
                                name="checkedTotalMinutes"
                                color="primary"
                            />
                            */}
                        </div>
                        <div className="controlLabel">
                            Total minutes %
                        </div>
                        <div className="slider">
                            <Slider value={benchmarkTotalMinutes} valueLabelDisplay="on" min={1} onChange={handleChangeTotalMinutes} />
                        </div>
                        <div className="numberInputFlexbox">
                            <Input
                                className="numberInput"
                                name="totalMinutes"
                                value={weightState.totalMinutes}
                                //margin="dense"
                                onChange={handleChangeWeight}
                                inputProps={{
                                    step: 5,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                }}
                            />
                        </div>
                    </div>
                    {/*--------------- Autorecord ----------------*/}
                    <div className="controlGroup">
                        <div className="switch">
                            {/*
                            <Switch
                                checked={switchState.checked}
                                onChange={handleChangeWeight}
                                name="checkedAutorecord"
                                color="primary"
                            />
                            */}
                        </div>
                        <div className="controlLabel">
                            Used autorecord
                        </div>
                        <div className="numberInputFlexbox">
                            <Input
                                className="numberInput"
                                name="autorecord"
                                value={weightState.autorecord}
                                //margin="dense"
                                onChange={handleChangeWeight}
                                inputProps={{
                                    step: 5,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                }}
                            />
                        </div>
                    </div>
                    {/*--------------- Polls ----------------*/}
                    <div className="controlGroup">
                        <div className="switch">
                            {/*
                            <Switch
                                checked={switchState.checked}
                                onChange={handleChangeSwitch}
                                name="checkedPolls"
                                color="primary"
                            />
                            */}
                        </div>
                        <div className="controlLabel">
                            Used poll
                        </div>
                        <div className="numberInputFlexbox">
                            <Input
                                className="numberInput"
                                name="polls"
                                value={weightState.polls}
                                //margin="dense"
                                onChange={handleChangeWeight}
                                inputProps={{
                                    step: 5,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                }}
                            />
                        </div>
                    </div>
                    {/*--------------- Total ----------------*/}
                    <div className="totalsGroup">
                        <div className="totalsLabel">
                            <i>Total (must add up to 100):</i>
                        </div>
                        <div className="totalsNum">
                            {totalWeight !== 100 && <p style={{margin: 0, color: "red"}}>{totalWeight}</p>}
                            {totalWeight === 100 && <p style={{margin: 0, color: "green"}}>{totalWeight}</p>}
                        </div>
                    </div>
                    <div className="controlPanelButtons">
                        <Button
                            onClick={handleResetSaved}
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<RestoreIcon />}
                        >
                            Restore saved settings
                        </Button>
                        
                        <Button
                            onClick={handleSaveNewSettings}
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<SaveIcon />}
                        >
                            Save new settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Score;