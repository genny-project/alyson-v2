import './googleMapInput.scss';
import React, { Component } from 'react';
import { string, object, array, number, bool } from 'prop-types';
import { IconSmall, InputText } from 'views/components';

class GoogleMapInput extends Component {

  static defaultProps = {
    className: '',
    lat: -33.8688,
    lng: 151.2093,
    controls: true,
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

    console.log("======================= UNMOUNTING =========================")
    if(this.map) {
      this.map = null;
    }
  }

  // componentDidUpdate() {

  //   console.log("======================= DID UPDATE =========================")
  //   if(this.map == null) {
  //     this.setup();
  //   }
  // }

  setup = () => {
    
    console.log('SETTING UP')
    if(typeof google == 'object') {

      const { lat, lng, controls, zoom } = this.props;

      const mapOptions = {
        zoom,
        center: new google.maps.LatLng( lat, lng ),
        disableDefaultUI: !controls,
        scrollwheel: false,
      };

      this.map = new google.maps.Map( this.mapRef, mapOptions );
      
      // this.map.addListener('center_changed', () => {
        
      //   if(this.map) {
      //      let coords = this.map.getCenter();
      //      this.geocodeLatLng(geocoder, this.map, infowindow);
      //   }
      // });

      let geocoder = new google.maps.Geocoder;
      let infowindow = new google.maps.InfoWindow;

      this.map.addListener('idle', () => {

        if(this.map) {
         this.geocodeLatLng(geocoder, this.map, infowindow);
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
      searchBox.addListener('places_changed', function() {
          

        //TODO : failing here. this.map is undefined.

        if(!this.map) return;

        var places = searchBox.getPlaces();
        
        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });

        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
         
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: this.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

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
      console.log(latlng);
      geocoder.geocode({'location': latlng}, (results, status) => {

        if (status === 'OK') {

            if (results[0]) {
              console.log(results[0].formatted_address);
              
              this.setState({
                value: results[0].formatted_address
              });
              // var marker = new google.maps.Marker({
              //   position: latlng,
              //   map: map
              // });
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
      <div className={`google-map-input ${className}`} style={componentStyle}>
        <div className={`map`} ref={div => this.mapRef = div}/>
        <InputText
          ref={r => this.input = r }
          value={value}
          type="text"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyDown={this.onKeyDown}
        />
        <IconSmall name="place" style={{ zIndex: '1', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100% )' }}/>
      </div>
    );
  }
}

export default GoogleMapInput;
