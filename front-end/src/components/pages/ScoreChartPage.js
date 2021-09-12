// import { PureComponent } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const ScoreChartPage = (props) => {
    const { data } = props;
    return (
        <div>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                type="monotone"
                //dataKey="pv"
                dataKey="duration"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                />
                {/*
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                <Line type="monotone" dataKey="amt" stroke="#fd1b3e" />
                */}
            </LineChart>
        </div>
    );
    
  }

  export default ScoreChartPage;