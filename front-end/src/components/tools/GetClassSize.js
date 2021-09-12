import { useEffect, useContext } from 'react';
import UserContext from '../../context/userContext';
const axios = require('axios');


const GetClassSize = () => {

    const {userData} = useContext(UserContext);

    let id = '';
    useEffect(() => {
        if (userData.user) {
            id = userData.user.id;
        }
        getClassSize();
    }, [userData]);

    const getClassSize = async () => {
        try {
            const classSize = await axios({
                method: "get",
                url: 'http://localhost:4000/api/teachers/classSize',
                withCredentials: true,
                headers: {"id": id}
            });
            console.log("!!!!!!!!!!!!!!!! CLASS SIZE = ", classSize.data, " !!!!!!!!!!!!!!!!!!!!!!!");
            return classSize.data;
        } catch (err) {
            console.log(err);
        }
    }
}

export default GetClassSize;