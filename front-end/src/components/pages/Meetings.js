import { useState, useEffect } from 'react';
import Chart from '../Charts/Chart';

const Meetings = (props) => {
    const { duration } = props;
    console.log("props duration: ", duration);
    const [data, setData] = useState([]);

    return (  
        <div>
            <h2>Meetings page</h2>
            <div key={data.uuid}>   {/* key must be in outermost return element */}
                {
                    data && data.length > 0 && data.map((item) => (
                        <div>
                            <p>uuid: {item.uuid}</p>
                            <ul>
                                <li>id: {item.id}</li>
                                <li>duration: {item.duration}</li>
                            </ul>
                            
                        </div>
                    ))
                }
            </div>
            
            <div>
                <Chart data={data} />
            </div>
            
        </div>
    );
}
 
export default Meetings;
