import { Link, useHistory } from "react-router-dom";
import { useState, useContext } from 'react';
import UserContext from "../../context/userContext";
import AppBar from '@material-ui/core/AppBar';
import SchoolIcon from '@material-ui/icons/School';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



const TopNav = () => {

    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        setUserData({
            token: undefined,
            user: undefined
        });
        localStorage.setItem("auth-token", "");
        setAnchorEl(null);
        history.push('/login');
    }
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    return (
        <div>
            <nav className="topNav">
                <AppBar position="static" color="white">
                    <ul className="topNavLinks">
                        <li className="topNavLinks">
                            <Link to="/" className="firstLink">
                                <div className="schoolIcon">
                                    <SchoolIcon />
                                </div>
                                <div>
                                    <em>TeacherStats</em>
                                </div>
                                
                            </Link>
                        </li>
                        <li className="topNavLinks">
                            <Link to="/about" className="topNavLinks">About</Link>
                        </li>
                        <li className="topNavLinks">
                            <Link to="/dashboard" className="topNavLinks">Dashboard</Link>
                        </li>
                        
                        <li className="topNavLinks">
                            <Link to="/register" className="topNavLinks">Sign up</Link>
                        </li>


                        {userData && userData.user && <Button className="lastLink" onClick={handleClick} variant="outlined" color="primary">
                            {userData && userData.user && `${userData.user.username}`}
                        </Button> }
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                        </Menu>
                        {!userData || !userData.user && <li className="topNavLinks">
                            <Link to="/login" className="topNavLinks">Sign in</Link>
                        </li>}
                    </ul>
                </AppBar>
            </nav>
        </div>
    );
}
 
export default TopNav;