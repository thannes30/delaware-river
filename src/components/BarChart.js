import React, {Component} from 'react';
// import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class BarChart extends Component {

		render() {

			const data = this.props.data;

			return (
	    	<AreaChart 
          width={this.props.width} 
          height={this.props.height} 
          data={data}
	        margin={{top: 20, right: 20, left: 20, bottom: 20}} 
          key={this.props.width}
        >
	        <CartesianGrid strokeDasharray="3 3"/>
	        <XAxis dataKey="date"/>
	        <YAxis/>
	        <Tooltip/>
	        <Legend verticalAlign="top" height={50} />
	        <Area name='Water Level' type='monotone' dataKey='waterHeight' stroke='blue' fill='blue' fillOpacity={0.3}/>
	        <Area name='Flow Speed' type='monotone' dataKey='flowSpeed' stroke='black' fill='black' fillOpacity={0.3}/>
	      </AreaChart>
			)
		}

}

export default BarChart;