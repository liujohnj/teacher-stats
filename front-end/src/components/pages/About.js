//const ParseDate = require("../tools/ParseDate");
import { getTwoDigitYear, getOneDigitMonth, getMonthDate, getYrMonth } from "../tools/ParseDate";
import { useState, useEffect } from 'react';
const axios = require('axios');

const About = () => {

    const [dateStr, setDateStr ] = useState('');

    /*
    useEffect( () => {
        axios({
            method: "get",
            url: 'http://localhost:8000/meetings/2'
        }).then(response => {
            console.log(response.data.start_time);
            setDateStr(response.data.start_time);
        }).catch(error => {
            console.log(error);
        })
    }, []);
    */

    const year = getTwoDigitYear(dateStr)
    const month = getOneDigitMonth(dateStr)
    const yearMonth = getYrMonth(dateStr);
    const monthDate = getMonthDate(dateStr);

    return (
      <div className="about">
        <h2>About</h2>
        <br />
        <br />
        <center><emphasis>Coming soon ....</emphasis></center>
      </div>
    );
  }
   
  export default About;