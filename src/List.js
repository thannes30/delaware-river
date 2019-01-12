import React, {Component} from 'react';

class List extends Component {

	render() {

		// const printListFromObj = Object.keys(this.props.floodInfo).map(key =>
		// 	<li>{this.props.floodInfo[key]}</li>
		// )
		// console.log(this.props)

		// const listItems

		return (
			<ul>
				<li>{this.props.action}</li>
			</ul>
		)
	}

}

export default List;