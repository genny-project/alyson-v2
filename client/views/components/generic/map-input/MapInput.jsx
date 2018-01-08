import './mapInput.scss';
import React, { Component } from 'react';
import { string, object, array, number, bool } from 'prop-types';
import { IconSmall, InputText } from 'views/components';

class MapInput extends Component {

  static defaultProps = {
    className: '',
    lat: -33.8688,
    lng: 151.2093,
    controls: false,
    zoom: 14,
  }

  static propTypes = {
    className: string,
    style: object,
    lat: number,
    lng: number,
    controls: bool,
    zoom: number,
  }

  state = {
    value: this.props.value || ''
  }

  componentWillUnmount() {

    //console.log("======================= UNMOUNTING =========================")
    if(this.map) {
      this.map = null;
    }
  }

  setup = () => {
    
    //console.log('SETTING UP')
    if(typeof google == 'object') {

      const { lat, lng, controls, zoom } = this.props;

      const mapOptions = {
        zoom,
        center: new google.maps.LatLng( lat, lng ),
        disableDefaultUI: !controls,
        zoomControl: !controls,
        scrollwheel: false,
      };

      this.map = new google.maps.Map( this.mapRef, mapOptions );

      let geocoder = new google.maps.Geocoder;

      this.map.addListener('idle', () => {

        if(this.map) {
         this.geocodeLatLng(geocoder, this.map);
        }
      });

      let input = this.input.getInput();
      let searchBox = new google.maps.places.SearchBox(input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      this.map.addListener('bounds_changed', () => {

        if(this.map) {
          searchBox.setBounds(this.map.getBounds());
        }
      });

      let markers = [];
      searchBox.addListener('places_changed', () => {
        
        if(!this.map) return;

        var places = searchBox.getPlaces();
        
        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
         
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        this.map.fitBounds(bounds);
      });
    }
  }

  componentDidMount() {
    this.setup();
  }

  geocodeLatLng = (geocoder, map, infowindow) => {

    let coords = map.getCenter();
      var input = coords.toString();
      input = input.substr(1, input.length-1);
      var latlngStr = input.split(',', 2);
      var latlng = { 
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1])
      };
      geocoder.geocode({'location': latlng}, (results, status) => {

        if (status === 'OK') {

          if (results[0]) {
            
            this.setState({
              value: results[0].formatted_address
            });
          } else {
            console.log('No results found');
          }
        } 
        else {
          console.log('Geocoder failed due to: ' + status);
        }
    });
  }

  handleChange = event => {
    this.setState({
      value: event.target.value,
    });
  }

  onKeyDown = event => {
    if(event.key == 'Enter') {
        this.handleBlur(event);
    }
  }

  handleBlur = (event) => {
    this.setState({
      value: event.target.value,
    });
    // const { validationList, validation, identifier } = this.props;
    // const value = event.target.value;
    // this.setState({ focused: false });
    // if(validation) validation(value, identifier, validationList);
  }

  render() {
    const { className, style } = this.props;
    const { value } = this.state;
    const componentStyle = { ...style, position: "relative" };

    return (
      <div className={`map-input ${className}`} style={componentStyle}>
        <div className={`google-map`} ref={div => this.mapRef = div}/>
        <InputText
          ref={r => this.input = r }
          value={value}
          type="text"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyDown={this.onKeyDown}
        />
        <IconSmall name="place" style={{ zIndex: '1', position: 'absolute', fontSize: '2em', top: '50%', left: '50%', transform: 'translate(-50%, -100% )', color: '#ff6b65' }}/>
      </div>
    );
  }
}

export default MapInput;
