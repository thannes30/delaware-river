import React, { Component } from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { Redirect } from 'react-router-dom'

export class MapContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
			clickedMarker: false,
			redirect: false,
			redirectLocation: '',
			center: {
	  		lat: 41.47,
	  		lng: -74.91
	  	},
	    zoom: 8,
			locations: {
				haleeddy: {
					name: 'Hale Eddy, NY',
					route: '/haleeddy',
					lat: 42.00,
					lng: -75.38
				},
				callicoon: {
					name: 'Callicoon, NY',
					route: '/callicoon',
					lat: 41.76,
					lng: -75.05
				},
				barryville: {
					name: 'Barryville, NY',
					route: '/barryville',
					lat: 41.47,
					lng: -74.91
				},
				portjervis: {
					name: 'Port Jervis, NY',
					route: '/portjervis',
					lat: 41.37,
					lng: -74.69
				},
				montague: {
					name: 'Montague, NJ',
					route: '/montague',
					lat: 41.29,
					lng: -74.78
				}
	  	}
	  }
	}

	onMarkerClick = (route) => {
		console.log('route >>> ', route);
		this.setState({ redirectLocation: route })
		this.setState({ redirect: true });
	}

  render() {

  	if (this.state.redirect === true) {
  		return <Redirect to={this.state.redirectLocation} />
  	}

  	const locations = this.state.locations;
  	const Markers = Object.keys(locations).map(key =>
  		<Marker
	        onClick={() => { this.onMarkerClick(locations[key].route)}}
	        position={{lat: locations[key].lat, lng: locations[key].lng}}
	        name={locations[key].name}
	        key={locations[key].name}
		/>
  	)

    return (
      <div
        style={{
          position: "relative",
          height: "calc(100vh - 200px)",
          width: "100%",
          margin: "20px auto"
        }}
      >
        <Map google={this.props.google} zoom={8} initialCenter={{lat: this.state.locations.portjervis.lat, lng: this.state.locations.portjervis.lng}}>
					{Markers}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyDKTCb6IG3kANo7FMadb5q_msrPbvsaDOw')
})(MapContainer)
