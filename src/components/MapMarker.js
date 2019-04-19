import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class MapMarker extends Component {

  renderTheRedirect = (route) => {
    console.log(route);
  }

  render() {
    const locations = this.props.locations;

    return (
      <div
        className="marker"
        key={locations.portjervis.lat}
        onClick={this.renderTheRedirect(locations.portjervis.route)}
        lat={locations.portjervis.lat}
        lng={locations.portjervis.lng}
        text={locations.portjervis.name}
      ></div>
    )
  }

}

export default MapMarker
