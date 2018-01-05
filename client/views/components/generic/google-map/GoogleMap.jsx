import './googleMap.scss';
import React, { Component } from 'react';
import { string, object, array, number, bool } from 'prop-types';


class GoogleMap extends Component {

  static defaultProps = {
    className: '',
    lat: -33.8688,
    lng: 151.2093,
    controls: false,
    zoom: 14,
    markers: [],
    directions: []
  }

  static propTypes = {
    className: string,
    style: object,
    lat: number,
    lng: number,
    controls: bool,
    zoom: number,
    markers: array,
    directions: array
  }

  state = {
  }

  componentDidMount() {
    
    if(typeof google == 'object') {

      const { lat, lng, controls, zoom, markers, directions } = this.props;

      const mapOptions = {
        zoom,
        center: new google.maps.LatLng( lat, lng ),
        disableDefaultUI: !controls,
        scrollwheel: false,
      };

      const map = new google.maps.Map( this.map, mapOptions );
      
      markers.forEach( m => {
        if (m.lat && m.lng) {
          new google.maps.Marker({
            position: {
              lat: m.lat,
              lng: m.lng,
            },
            map,
          });
        }
      });

      directions.forEach( d => {
        let originCoords = new google.maps.LatLng( d.origin.lat, d.origin.lng );
        // if ( d.waypoint) {
        //   let waypoint = new google.maps.LatLng( d.waypoint.lat, d.waypoint.lng );
        // }
        let destCoords = new google.maps.LatLng( d.dest.lat, d.dest.lng );
        this.calcRoute(originCoords, destCoords, map);
      });
    }
  }

  calcRoute = (originCoords, destCoords, map) => {
    
    let directionsService = new google.maps.DirectionsService();
    
    let request = {
        origin: originCoords,
        //waypoints: waypointCoords
        destination: destCoords,
        travelMode: 'DRIVING'
    };

    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
  }

  render() {
    const { className, style } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`google-map ${className}`} style={componentStyle}>
        <div className={`map`} ref={div => this.map = div} />
      </div>
    );
  }
}

export default GoogleMap;
