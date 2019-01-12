import React, {Component} from 'react';

class Title extends Component {

	render() {
		return (
			<div>
				<div className="page-title"><h1>{this.props.title}</h1></div>
				<p>{this.props.warning}</p>
			</div>
		)
	}

}

export default Title;