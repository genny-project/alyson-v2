import './inputAddress.scss';
import React, { Component } from 'react';
import { string, object, array, func, bool } from 'prop-types';
import { Label, SubmitStatusIcon, Dropdown, MapInput, Button, } from 'views/components';
import { Grid } from '@genny-project/layson';
import { geocodeByAddress } from 'react-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';

class InputAddress extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        value: string,
        validationList: array,
        identifier: string,
        name: string,
        validation: func,
        placeholder: string,
        mandatory: bool,
        validationStatus: string,
    }

    state = {
        address: this.props.value || '',
        value: this.props.value || '',
        hasChanges: false,
        showMap: false,
        coords: null,
    }

    onSelect = (newAddress) => {

        if(newAddress) {

            geocodeByAddress(newAddress)
            .then(results => {

                let addressObj = results[0];

                this.setState({
                    coords: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                    }
                });

                let requiredFields = ['street_number','route','locality','administrative_area_level_1','postal_code','country'];

                let resultObj = {};
                let streetAddress = {};

                requiredFields.forEach((f) => {

                    addressObj.address_components.forEach((a) => {

                        if (a.types.includes(f)) {

                            if (a.types.includes('street_number')) {
                                streetAddress['street_number'] = a.long_name;
                            }
                            else if (a.types.includes('route')) {
                                streetAddress['street_name'] = a.long_name;
                            }
                            else if (a.types.includes('locality')) {
                                resultObj['suburb'] = a.long_name;
                            }
                            else if (a.types.includes('administrative_area_level_1')) {
                                resultObj['state'] = a.short_name;
                            }
                            else if (a.types.includes('postal_code')) {
                                resultObj['postal_code'] = a.long_name;
                            }
                            else if (a.types.includes('country')) {
                                resultObj['country'] = a.short_name;
                            }
                        }

                        if (streetAddress.street_number && streetAddress.street_name) {
                            resultObj['street_address'] = streetAddress['street_number'] + ' ' + streetAddress['street_name'];
                        }
                    });
                });

                resultObj['full_address'] = results[0].formatted_address;
                resultObj['latitude'] = results[0].geometry.location.lat();
                resultObj['longitude'] = results[0].geometry.location.lng();

                this.updateAddressProp(results[0].formatted_address);

                // send answer
                this.onBlur(resultObj);
            });
        }
    }

    updateAddressProp = (newAddress) => {
        this.setState({
            address: newAddress,
            value: newAddress
        });
    }

    onChange = (newAddress) => {
        this.setState({
            value: newAddress,
            hasChanges: true
        });
    }

    onBlur = (address) => {
        const { validationList, validation, identifier } = this.props;
        const value = JSON.stringify(address);
        if(validation) validation(value, identifier, validationList);
    }

    showMap = () => {

        this.setState({
            showMap: !this.state.showMap
        });
    }

    renderInput() {
        const { showMap } = this.state;

        const inputProps = {
            value: this.state.value,
            onChange: this.onChange,
            placeholder: this.props.placeholder
        };

        const classes = {
            root: 'input-address-search',
        };

        if (window.getScreenSize() == 'sm') {
            return (
                <Grid cols={1} rows={1}>
                    <PlacesAutocomplete onSelect={this.onSelect} position={[0, 0]} inputProps={inputProps} classNames={classes} style={{zIndex: 100}}/>
                </Grid>
            );
        } else {
            return (
                <Grid cols={
                        [
                            {
                                style: {
                                    flexGrow: 5,
                                    paddingRight: '10px'
                                }
                            },
                            {
                                style: {
                                    flex: '0 0 100px'
                                }
                            },
                        ]
                    }
                    rows="1"
                >
                    <PlacesAutocomplete onSelect={this.onSelect} position={[0, 0]} inputProps={inputProps} classNames={classes} style={{zIndex: 100}}/>
                    <Button position={[0, 1]} onClick={this.showMap}>{showMap ? 'Hide Map' : 'Show on Map'}</Button>
                </Grid>
            );
        }
    }

    render() {

        const { name, mandatory, validationStatus } = this.props;
        const { showMap, address, coords  } = this.state;

        return (
            <div className="input input-address">
                <div className="input-header">
                    {name ? <Label text={name} /> : null }
                    {mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : ''} text="*  required" /> : null}
                    <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
                </div>
                {window.google ? this.renderInput() : <p>Loading...</p>}
                { window.getScreenSize() == 'sm' && <Button onClick={this.showMap} style={{marginTop: '10px'}}>{showMap ? 'Hide Map' : 'Show on Map'}</Button> }
                <Dropdown inline={true} open={showMap} style={{ marginTop: '10px'}}>
                    <MapInput
                        handleUpdate={this.onSelect}
                        style={{
                            'height': '300px',
                            'width': '100%'
                        }}
                        address={address}
                        lat={coords && coords.lat}
                        lng={coords && coords.lng}
                        hideInput
                    />
                </Dropdown>
            </div>
        );
    }
}

export default InputAddress;
