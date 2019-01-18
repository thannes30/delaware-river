import React, {Component} from 'react';

class List extends Component {

	render() {

		console.log(this.props.listObject);

		const listObject = this.props.listObject;

		return (
			<ul>
				{Object.keys(listObject).map((key, index) =>
				  <li key={index}><b>{key}</b>: {listObject[key].amount} {listObject[key].unit}</li>
				)}
			</ul>
		)
	}

}

export default List;