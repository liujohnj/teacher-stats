import { getClassSize } from "../tools/GetClassSize";

const NumStudentsCard = () => {

    const classSize = localStorage.getItem('classSize');

    return (
        <div>
            <i># of students =</i>
            <br />
            <center><h3>{classSize}</h3></center>
        </div>
    );
}
 
export default NumStudentsCard;