import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';

const AvgScoreCard = () => {

    const [avgScore, setAvgScore] = useState(50);

    useEffect(() => {
        setAvgScore(Math.round(localStorage.getItem("avgScore")));
    }, [localStorage.getItem("avgScore")]);

    const handleClick = () => {
        setAvgScore(Math.round(localStorage.getItem("avgScore")));
    }

    return (
        <div>
            <i>Average score =</i>
            <br />
            <center><h4>{avgScore}</h4></center>
            <div className="syncAvgButton">
                <Button
                    size="large"
                    onClick={handleClick}
                    startIcon={<SyncIcon />}
                >
                </Button>
            </div>
        </div>
    );
}
 
export default AvgScoreCard;