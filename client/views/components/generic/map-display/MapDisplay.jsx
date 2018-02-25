import './mapDisplay.scss';
import React, { Component } from 'react';
import { string, object, array, number, bool, any, } from 'prop-types';

class MapDisplay extends Component {

  static defaultProps = {
    className: '',
    controls: false,
    zoom: 12,
    center: { lat: -33.8688, lng: 151.2093},
    markers: [],
    routes: [],
    icon: 'https://i.imgur.com/V8EhEJD.png'
  }

  static propTypes = {
    className: string,
    style: object,
    controls: bool,
    zoom: number,
    maxZoom: number,
    center: any,
    markers: array,
    routes: array,
    icon: string,
    lat: any,
    lng: any,
  }


  componentWillUnmount() {

    if(this.map) {
      this.map = null;
    }
  }

  setup = () => {

    if(typeof google == 'object') {

      const { controls, zoom, maxZoom, markers, routes } = this.props;

      let geocoder = new google.maps.Geocoder;

      let newCenter = this.getLatLng();
      
      const mapOptions = {
        zoom,
        maxZoom: maxZoom,
        center: newCenter,
        disableDefaultUI: !controls,
        zoomControl: !controls,
        scrollwheel: false,
      };

      this.map = new google.maps.Map( this.mapRef, mapOptions );
      
      let infowindow = new google.maps.InfoWindow({
        content: ''
      });

      if (window.getScreenSize() == 'sm') this.map.setOptions({gestureHandling: 'cooperative'});

      this.locations = [];

      const adjustMapBounds = () => {
        if (this.map) {
          setTimeout(() => {
            this.adjustBounds();
          }, 500);
        }
      };

      this.checkAddressFormat(geocoder, newCenter, (centerCoords) => {

        let counterMarkers = 0;
        markers.forEach(marker => {

          this.checkAddressFormat(geocoder, marker, (markerCoords) => {

            if (markerCoords.lat && markerCoords.lng) {

              let map = this.map;

              let newMarker = new google.maps.Marker({
                position: {
                  lat: parseFloat(markerCoords.lat),
                  lng: parseFloat(markerCoords.lng)
                },
                zIndex: 100,
                icon: this.props.icon,
                map
              });

              newMarker.addListener('click', function() {
                infowindow.open(map, newMarker);
                infowindow.setContent(marker.text);
              });

              this.locations.push(new google.maps.LatLng(markerCoords.lat, markerCoords.lng));

              if(counterMarkers == markers.length - 1) {
                if ( markers.length > 1 || routes && routes.length > 0 ) {
                  adjustMapBounds();
                } else {
                  adjustMapBounds();
                  map.setZoom(12);
                }
              }

              counterMarkers += 1;
            }
            else {
              counterMarkers += 1;
            }
          });
        });

        let counterRoutes = 0;
        routes.forEach(route => {

          this.checkAddressFormat(geocoder, route.origin, (routeOriginCoords) => {

            let originCoords = new google.maps.LatLng( routeOriginCoords.lat, routeOriginCoords.lng );

            this.locations.push(originCoords);

            this.checkAddressFormat(geocoder, route.dest, (routeDestCoords) => {

              let destCoords = new google.maps.LatLng( routeDestCoords.lat, routeDestCoords.lng );
              this.locations.push(destCoords);

              this.calcRoute(originCoords, destCoords, () => {
                if(counterRoutes == routes.length - 1) {
                  adjustMapBounds();
                }

                counterRoutes += 1;
              });
            });
          });
        });
      });
    }
  }

  getLatLng = () => {
    const { center, lat, lng } = this.props;

    let newLat = center.lat;
    let newLng = center.lng;

    if (lat && lng) {
      if (typeof lat != 'number' ){
        let checkLat = parseFloat(lat);

        if (typeof lng != 'number'){
          let checkLng = parseFloat(lng);

          if (Number.isInteger(checkLat) && Number.isInteger(checkLng)){
            newLat = parseFloat(checkLat);
            newLng = parseFloat(checkLng);
          }
        }
      }
    }
    return { 'lat': newLat, 'lng': newLng };
  }

  componentDidMount() {

      //console.log("------------------------------")
      //console.log(this.props);
      this.setup();
  }

  checkAddressFormat = (geocoder, value, callback) => {

    let address = value;

    if (typeof address == 'string' || typeof address == 'object' && address.suburb && address.state ) {

      if (typeof address == 'object') {
        address = address.suburb + ', ' + address.state;
      }

      geocoder.geocode({'address': address}, (results, status) => {

        if (status === 'OK' && results.length > 0) {

          let input = results[0].geometry.location.toString();
          input = input.substr(1, input.length-1);

          let latlngStr = input.split(',', 2);
          if (latlngStr.length == 2) {

            let latlng = {
              lat: parseFloat(latlngStr[0]),
              lng: parseFloat(latlngStr[1])
            };

            callback(latlng);
            return;
          }
        }
        else {
          // alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
    else if (typeof address == 'object') {
      callback(address);
      return;
    }
  }

  calcRoute = (originCoords, destCoords, callback) => {

    let directionsService = new google.maps.DirectionsService();

    let request = {
        origin: originCoords,
        //waypoints: waypointCoords
        destination: destCoords,
        travelMode: 'DRIVING'
    };

    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    directionsService.route(request, function(response, status) {

      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      }

      callback();
    });
  }

  adjustBounds = () => {

    let bounds = new google.maps.LatLngBounds();
    if(bounds && this.map && this.locations) {
      this.locations.forEach(location => {
        bounds.extend(location);
      });
    }

    // Don't zoom in too far on only one marker
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      let extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
      let extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
      bounds.extend(extendPoint1);
      bounds.extend(extendPoint2);
   }

    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);
    //this.map.setZoom(this.props.zoom);
  }

  render() {
    const { className, style } = this.props;
    const componentStyle = { ...style,};

    return (
      <div className={`map-display ${className}`} style={componentStyle}>
        <div className='google-map' ref={div => this.mapRef = div} />
      </div>
    );
  }
}

export default MapDisplay;