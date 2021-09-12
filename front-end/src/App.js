import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import UserContext from './context/userContext';
import axios from 'axios';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Controls from './components/tools/Controls';
import Chart from "./components/charts/Chart";
import TopNav from "./components/nav/TopNav";
import LeftNav from "./components/nav/LeftNav";
import Error404 from "./components/pages/Error404";
import Score from "./components/pages/Score";
import Dashboard from "./components/pages/Dashboard";
import Test from "./Test";
import Zoom from "./Zoom";
import FooterNav from "./components/nav/FooterNav";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import FirstSync from "./components/pages/FirstSync";

function App() {

    const [ userData, setUserData] = useState({
        token: undefined,
        user: undefined
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                console.log("token was null");
                localStorage.setItem("auth-token", "");
                token = "";
            }
            console.log("token exists apparently = ", token);
            
            try {
                const tokenResponse = await axios.post('http://localhost:4000/api/tokenIsValid', null, {headers: {"x-auth-token": token}});

                const { result, msg } = tokenResponse.data;

                if (result) {
                    const userRes = await axios.get("http://localhost:4000/api/teachers", {
                        headers: { "x-auth-token": token },
                    });
                    setUserData({
                        token,
                        user: userRes.data,
                    });
                    console.log("setUserData = ", userRes);

                    console.log("tokenisvalid response = ", tokenResponse.data);
                } else {
                    console.log("returning message = ", msg);
                }


            } catch (err) {
                console.log("caught error = ", err);
            }
        }
      
        checkLoggedIn();
        }, []);

    return (
        <Router>
            <UserContext.Provider value={{ userData, setUserData }}>
                <div>
                    <TopNav />
                </div>
                <div className="belowTopNav">
                    {/*<LeftNav />*/}
                    <div className= "mainContainer">
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route path="/about">
                                <About />
                            </Route>
                            <Route path="/controls">
                                <Controls />
                            </Route>
                            <Route path="/score">
                                <Score />
                            </Route>
                            <Route path="/chart">
                                <Chart />
                            </Route>
                            <Route path="/dashboard">
                                <Dashboard />
                            </Route>
                            <Route path="/test">
                                <Test />
                            </Route>
                            <Route path="/zoom">
                                <Zoom />
                            </Route>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/register">
                                <Register />
                            </Route>
                            <Route path="/firstSync">
                                <FirstSync />
                            </Route>
                            <Route path="*">
                                <Error404 />
                            </Route>
                        </Switch>
                    </div>
                </div>
                {/*
                <div>
                    <FooterNav />
                </div>
                */}
            </UserContext.Provider>
        </Router>
    );
}

/*
function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}
*/

export default App;