import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/userContext';

const Home = () => {

    const {userData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user) {
            history.push("/login");
        } else {
            history.push("/dashboard");
        }
    }, []);

    return (
        <div className="home">
            <h2>Home page</h2>
            <div>
                
            </div>
        </div>
    );
}
   
  export default Home;