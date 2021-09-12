import { useState, useEffect } from 'react';
import Chart from './Chart';

const MeetingsDuration = () => {
    const [data, setData] = useState([]);

    /*
    useEffect(() => {
        fetch('http://localhost:8000/meetings')
            .then(res => {
                return res.json();
            })
            .then((data) => {
                setData(data);
            })
    }, []);
    */

    return (  
        <div>
            <div>
                <center><Chart data={data} /></center>
            </div>
        </div>
    );
}
 
export default MeetingsDuration;
