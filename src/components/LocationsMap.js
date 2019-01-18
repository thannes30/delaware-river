import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import { Link } from 'react-router-dom'

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class LocationsMap extends Component {

	static defaultProps = {
	    center: {
	    	lat: 41.47,
	    	lng: -74.91
	    },
	    zoom: 8
  	};

  	renderMarkers(map, maps) {
  		const locations = [
  			['Hale Eddy, NY', 'haleeddy', 42.00, -75.38],
  			['Callicoon, NY', 'callicoon', 41.76, -75.05],
  			['Barryville, NY', 'barryville', 41.47, -74.91],
  			['Port Jervis, NY', 'portjervis', 41.37, -74.69],
  			['Montague, NJ', 'montague', 41.29, -74.78]
  		];
  		for (let i = 0; i < locations.length; i++) {
		  	let marker = new maps.Marker({
		    	position: {lat: locations[i][2], lng: locations[i][3]},
		    	title: locations[i][0],
		    	map
		  	});
  		}
	};

	
	render() {
		return (
		    <div style={{ height: '80vh', width: '80%', margin: '10vh auto' }}>
		        <GoogleMapReact
		          bootstrapURLKeys={{ key: 'AIzaSyDKTCb6IG3kANo7FMadb5q_msrPbvsaDOw' }}
		          defaultCenter={this.props.center}
		          defaultZoom={this.props.zoom}
		          onGoogleApiLoaded ={({map, maps}) => this.renderMarkers(map, maps)}
		        >
		        	<AnyReactComponent
		            	lat={41.47}
		            	lng={-74.91}
		          	/>
		        </GoogleMapReact>
		    </div>
		)
	}

}

export default LocationsMap;