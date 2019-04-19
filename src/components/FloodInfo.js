import React, {Component} from 'react';
import List from './List'

class FloodInfo extends Component {

	render() {

		return (
			<div className='flood-zones'>
				<h4>Flood Zones</h4>
				<List key={this.props.floodInfo.action} listObject={this.props.floodInfo} />
			</div>
		)
	}

}

export default FloodInfo;
