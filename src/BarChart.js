import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class BarChart extends Component {


		render() {

			const data = this.props.data;

			return (
	    	<LineChart width={this.props.width} height={this.props.height} data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
	      	<XAxis dataKey="date"/>
	      	<YAxis/>
	      	<CartesianGrid strokeDasharray="3 3"/>
	      	<Tooltip/>
	      	<Legend />
	      	<Line type="monotone" dataKey="waterHeight" stroke="blue" unit=" Ft" />
	      	<Line type="monotone" dataKey="flowSpeed" stroke="black" unit=" Flow (kcfs)"/>
	      </LineChart>
			)
		}

}

export default BarChart;