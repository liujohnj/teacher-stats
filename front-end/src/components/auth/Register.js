import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../../components/misc/ErrorNotice";
import { TextField, Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

function Register () {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [className, setClassName] = useState('');
    const [classSize, setClassSize] = useState('');
   
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();

        try{
            const newUser = { username, password, passwordCheck, className, classSize };
            await axios.post("http://localhost:4000/api/signup", newUser);
            console.log("new user signed up???");
            const loginResponse = await axios.post("http://localhost:4000/api/signin", {
                username, password
            });
            console.log("after loginResponse");
            setUserData({
                token: loginResponse.data.token,
                user: loginResponse.data.user
            });
            console.log("after setUserData");
            localStorage.setItem("auth-token", loginResponse.data.token);
            console.log("after localStorage.setItem");
            history.push("/firstSync");
        } catch(err) {
            err.response.data.msg && setError(err.response.data.msg)
            //console.log("ERROR: ", err);
        }
        
    };
   
        return (
            <div className="register">
                {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                <form onSubmit={submit}>
                    <div className="signIn">
                        <div className="avatar">
                            <Avatar className="avatar">
                                <LockOutlinedIcon />
                            </Avatar>
                        </div>
                        <div className="signInTitle">
                            <h2>Sign up</h2>
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
                                onChange={e => setUsername(e.target.value)}
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
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="signInTextField">
                            <TextField
                                required
                                label="confirm password"
                                type="password"
                                variant="outlined"
                                placeholder="confirm password"
                                name="password"
                                fullWidth
                                onChange={e => setPasswordCheck(e.target.value)}
                            />
                        </div>
                        <div className="signInTextField">
                            <TextField
                                required
                                label="class name"
                                type="text"
                                variant="standard"
                                placeholder="class name"
                                name="className"
                                fullWidth
                                onChange={e => setClassName(e.target.value)}
                            />
                        </div>
                        <div className="signInTextField">
                            <TextField
                                required
                                label="class size"
                                type="number"
                                variant="standard"
                                placeholder="class size"
                                name="classSize"
                                fullWidth
                                onChange={e => setClassSize(e.target.value)}
                            />
                        </div>
                        <div className="signInButton">
                            <Button
                                type="submit"
                                value="Register"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Sign up
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
}
 
export default Register;