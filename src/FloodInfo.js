import React, {Component} from 'react';
import List from './List'

class FloodInfo extends Component {

	render() {

		console.log(this.props)

		return (
			<div>
				<h4>Flood Zones</h4>
				<List listItems={this.props.floodInfo} />
			</div>
		)
	}

}

export default FloodInfo;