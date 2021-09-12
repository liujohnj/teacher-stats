// import Scores from "./Scores";
import Sliders from "./Sliders";
import { useEffect } from "react";

const Controls = (props) => {
    const benchmarksObj = props;
    console.log("benchmarks here: ", benchmarksObj);

    useEffect( () => {
        const arrayOfObjects = Object.entries(benchmarksObj).map(key => ({ ...key[1]}));
        console.log("objArray at Sliders: ", arrayOfObjects)
        console.log("array item = ", arrayOfObjects[0])
    }, [benchmarksObj]);

    const sliderInitValue = 40;
    //console.log("object value? = ", benchmarks);

    return (
        <div className="controls">
            <div className="title">
                <h2>Controls page</h2>
            </div>
            <div>
                <Sliders sliderInitiValue={sliderInitValue} />
            </div> 
            <div>
                
            </div>
        </div>
    );
  }

  export default Controls;