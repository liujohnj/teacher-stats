//import { duration } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Chart from "./components/charts/Chart";


const Duration = (props) => {
    const { benchmarkDuration } = props;
    //console.log("props: ", benchmarkDuration);
    
    const [data, setData] = useState([]);
    //const [durationBenchmark, setDurationBenchmark] = useState(benchmarkDuration);
    const [avgDuration, setAvgDuration] = useState(999);
    const [score, setScore] = useState(0);

    /*
    useEffect(() => {
        fetch('http://localhost:8000/meetings')
            .then(response => {
                return response.json();
            })
            .then(data => {
                setData(data);
                //console.log("after setData: ", data);
                return data;
            })
            .then((data) => {
                const sum = data.reduce((currentTotal, datum) => {
                    //console.log("currentTotal: ", currentTotal);
                    return datum.duration + currentTotal
                }, 0);
                return sum/data.length;
            })
            .then((avg) => {
                //console.log("sum/data.length: ", avg);
               //return setAvgDuration(avg);
               setAvgDuration(avg);
               return avg/benchmarkDuration
            })
            */
            /*
            .then(() => {
                return fetch('http://localhost:8000/benchmarks');
            })
            .then(response => {
                    return response.json();
            })
            
            .then((benchmarkData) => {
                setDurationBenchmark(benchmarkData[0].value);
                //console.log("avgDuration: ", avgDuration);
                return avgDuration/benchmarkData[0].value;
            })
            */
            /*
            .then((newScore) => {
                //console.log("newScore: ", newScore);
                setScore(newScore*100)
            })
    }, [benchmarkDuration]);
            */
    return (
        <div>
            <h3>Duration page</h3>
            <div>
                <p>Duration Benchmark = {benchmarkDuration}</p>
                <p>Score = {score}%</p>
                <Chart data={data} />
            </div>
            
        </div>
    );
}
 
export default Duration;