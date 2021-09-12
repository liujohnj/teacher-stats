import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/ErrorNotice";
import { TextField, Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
const axios = require('axios');


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const handleUsernameInputChange = (e) => {
        console.log("target = ", e.target.value)
        setUsername(e.target.value);
    };

    const handlePasswordInputChange = (e) => {
        console.log("target = ", e.target.value)
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("username = ", username);
            const response = await axios.post('http://localhost:4000/api/signin', {
                username: username,
                password: password
            });
            console.log("response.data = ", response.data);

            setUserData({
                token: response.data.token,
                user: response.data.user
            });
            localStorage.setItem("auth-token", response.data.token);
            history.push("/dashboard");
        } catch (err) {
            //err.response.data.msg && setError(err.response.data.msg)
            console.log(err);
        }
    };

    return (
        <div className="login">
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <div className="signIn">
                <div className="avatar">
                    <Avatar className="avatar">
                        <LockOutlinedIcon />
                    </Avatar>
                </div>
                <div className="signInTitle">
                    <h2>Sign in</h2>
                </div>
                <div className="signInTextField">
                    <TextField
                        required
                        label="email"
                        placeholder="email"
                        autoComplete="email"
                        variant="outlined"
                        name="username"
                        fullWidth
                        onChange={handleUsernameInputChange}
                    />
                </div>
                <div className="signInTextField">
                    <TextField
                        required
                        label="password"
                        type="password"
                        variant="outlined"
                        placeholder="password"
                        name="password"
                        fullWidth
                        onChange={handlePasswordInputChange}
                    />
                </div>
                <div className="signInButton">
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </div>
    );
}
   
export default Login;