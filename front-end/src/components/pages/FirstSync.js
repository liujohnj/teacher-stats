import axios from 'axios';
import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/userContext';

const FirstSync = () => {

    const {userData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user) {
            history.push("/login");
        }
    }, []);

    const handleClick = async () => {
        console.log("first sync button clicked");
        await axios.get('http://localhost:4000/api/test2');
        console.log("first sync returned");
    }


    return (
        <div className="firstsync">
            <h2>Sync page</h2>
            <div>
                <button onClick={handleClick}>First Sync</button>
            </div>
        </div>
    );
}
   
  export default FirstSync;