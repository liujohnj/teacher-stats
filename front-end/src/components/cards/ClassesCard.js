const ClassesCard = () => {
    return (
        <div>
            <i>Class name:</i>
            <br />
            <center><h4>{localStorage.getItem("className")}</h4></center>
        </div>
    );
}
 
export default ClassesCard;