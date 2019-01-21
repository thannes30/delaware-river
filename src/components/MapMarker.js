import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class MapMarker extends Component {

  renderTheRedirect = (route) => {
    console.log(route);
    // if (route) {
    //  return <Redirect to={route} />
    // }
  }

  render() {
    const locations = this.props.locations;
    // console.log(locations.portjervis.lat);
    // console.log(locations.portjervis.lng);

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