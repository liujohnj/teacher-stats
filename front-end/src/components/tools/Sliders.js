import React, { useState } from 'react';
import { Button, Slider } from '@material-ui/core';

const Sliders = (props) => {
    const { sliderInitValue } = props;

    const [value, setValue] = useState(sliderInitValue);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    
    
    const handleClick = (event) => {
        /*
        fetch('http://localhost:8000/benchmarks/1', {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    "value": value
                }
            )
        }).then(response => {
            window.location.reload(false)
        })
        */
    }


    return (
        <div>
            <div className="sliderLine">
                <div className="sliderLabel">
                    Duration
                </div>
                <div className="slider">
                    <Slider value={value} onChange={handleChange} />
                </div>
                <div>
                    {value}
                </div>
            </div>
            <div>
                <Button onClick={handleClick} >Save Settings</Button>
            </div>
        </div>
       
    );
}

export default Sliders;