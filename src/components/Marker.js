import React, { Component } from 'react'

class Marker extends Component {

  render() {
    return (
      <div className="marker" lat={this.props.lat} lng={this.props.lng}></div>
    )
  }
}

export default Marker