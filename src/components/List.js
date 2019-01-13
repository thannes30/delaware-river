import React, {Component} from 'react';

class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listObject: this.props.listObject
    };

  }

	render() {

		console.log(this.props.listObject);

		let listObject = this.props.listObject;

		return (
			<ul>
				{Object.keys(listObject).map((key, index) =>
				  <li key={index}>{key}: {listObject[key].amount}{listObject[key].unit}</li>
				)}
			</ul>
		)
	}

}

export default List;